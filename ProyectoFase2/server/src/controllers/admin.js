const sql = require('../config/db');
const { comparePassword } = require('../utils/bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middlewares/auth');
const db = require('../config/db');
const {
  sendApprovalEmail,
  sendDeactivationEmail,
} = require('../services/email');
const {
  generateSecret,
  encryptSecret,
  decryptSecret,
  generateQrDataUrl,
  verifyTotp,
} = require('../utils/twoFactor');
const cloudinary = require('../config/cloudinary');

// Controlador para aprobar, rechazar y listar estudiantes pendientes de aprobación por el administrador.

const getPendingStudents = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT e.id_estudiante, NULL AS id_tutor, e.nombre, e.apellido, e.carnet,
        NULL AS carnet_id, e.genero, e.correo, e.estado_aprobacion,
        'estudiante' AS tipo_usuario, NULL AS especialidad, e.fecha_registro,
        e.fecha_nacimiento, e.foto_url, e.carnet_pdf_url,
        NULL AS numero_identificacion_tutor, NULL AS cv_pdf_url
      FROM estudiante e
      JOIN solicitud s ON s.id_estudiante = e.id_estudiante
      WHERE e.estado_aprobacion = 'pendiente' AND s.estado = 'pendiente'
      UNION ALL
      SELECT NULL AS id_estudiante, t.id_tutor, t.nombre, t.apellido, NULL AS carnet,
        t.carnet_id, t.genero, t.correo, t.estado_aprobacion,
        'tutor' AS tipo_usuario, t.universidad_graduacion AS especialidad, t.fecha_registro,
        t.fecha_nacimiento, t.foto_url, NULL AS carnet_pdf_url,
        t.numero_identificacion_tutor, t.cv_pdf_url
      FROM tutor t
      JOIN solicitud s ON s.id_tutor = t.id_tutor
      WHERE t.estado_aprobacion = 'pendiente' AND s.estado = 'pendiente'
      ORDER BY fecha_registro ASC`,
    );

    return res.status(200).json({
      status: 'success',
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error en getPendingStudents:', error);
    return res.status(500).json({
      status: 'error',
      message:
        'Error interno del servidor al consultar estudiantes pendientes.',
    });
  }
};

const approveStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol = 'estudiante' } = req.body || {};

    if (!id) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor proporcione el ID del estudiante.',
      });
    }

    if (rol === 'tutor') {
      const tutorRes = await db.query(
        'SELECT id_tutor, nombre, apellido, correo, verification_token FROM tutor WHERE id_tutor = $1 AND estado_aprobacion = $2',
        [id, 'pendiente'],
      );
      if (tutorRes.rows.length === 0) {
        return res
          .status(404)
          .json({ status: 'error', message: 'Tutor no encontrado.' });
      }
      const tutor = tutorRes.rows[0];
      await db.query(
        'UPDATE tutor SET estado_aprobacion = $1 WHERE id_tutor = $2',
        ['aprobado', id],
      );
      await db.query(
        `UPDATE solicitud SET estado = 'aceptada', fecha_procesado = CURRENT_TIMESTAMP
         WHERE id_tutor = $1 AND tipo_usuario = 'tutor' AND estado = 'pendiente'`,
        [id],
      );
      sendApprovalEmail({
        to: tutor.correo,
        name: `${tutor.nombre} ${tutor.apellido}`,
        approved: true,
        verificationToken: tutor.verification_token,
        role: 'tutor',
      }).catch((err) =>
        console.error('Error al enviar correo de aprobación:', err),
      );
      return res
        .status(200)
        .json({
          status: 'success',
          message: 'Tutor aprobado exitosamente.',
          data: tutor,
        });
    }

    const studentRes = await db.query(
      'SELECT id_estudiante, nombre, apellido, correo, estado_aprobacion, verification_token FROM estudiante WHERE id_estudiante = $1 AND estado_aprobacion = $2',
      [id, 'pendiente'],
    );

    if (studentRes.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Estudiante no encontrado.',
      });
    }

    const student = studentRes.rows[0];

    await db.query(
      `UPDATE estudiante 
       SET estado_aprobacion = 'aprobado' 
       WHERE id_estudiante = $1`,
      [id],
    );

    await db.query(
      `UPDATE solicitud 
       SET estado = 'aceptada', fecha_procesado = CURRENT_TIMESTAMP 
       WHERE id_estudiante = $1 AND tipo_usuario = 'estudiante'`,
      [id],
    );

    const fullName = `${student.nombre} ${student.apellido}`;

    sendApprovalEmail({
      to: student.correo,
      name: fullName,
      approved: true,
      verificationToken: student.verification_token,
    }).catch((err) =>
      console.error('Error al enviar correo de aprobación:', err),
    );

    return res.status(200).json({
      status: 'success',
      message: 'Estudiante aprobado exitosamente.',
      data: {
        id_estudiante: student.id_estudiante,
        nombre: fullName,
        correo: student.correo,
        estado_aprobacion: 'aprobado',
      },
    });
  } catch (error) {
    console.error('Error en approveStudent:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error interno al aprobar al estudiante.',
    });
  }
};

const rejectStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo, rol = 'estudiante' } = req.body || {};

    if (!id) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor proporcione el ID del estudiante.',
      });
    }

    if (rol === 'tutor') {
      const tutorRes = await db.query(
        'SELECT id_tutor, nombre, apellido, correo FROM tutor WHERE id_tutor = $1 AND estado_aprobacion = $2',
        [id, 'pendiente'],
      );
      if (tutorRes.rows.length === 0) {
        return res
          .status(404)
          .json({ status: 'error', message: 'Tutor no encontrado.' });
      }
      const tutor = tutorRes.rows[0];
      await db.query(
        'UPDATE tutor SET estado_aprobacion = $1 WHERE id_tutor = $2',
        ['rechazado', id],
      );
      await db.query(
        `UPDATE solicitud SET estado = 'rechazada', fecha_procesado = CURRENT_TIMESTAMP, motivo_rechazo = $2
         WHERE id_tutor = $1 AND tipo_usuario = 'tutor' AND estado = 'pendiente'`,
        [id, motivo || 'Solicitud rechazada por el administrador'],
      );
      sendApprovalEmail({
        to: tutor.correo,
        name: `${tutor.nombre} ${tutor.apellido}`,
        approved: false,
        reason: motivo,
        role: 'tutor',
      }).catch((err) =>
        console.error('Error al enviar correo de rechazo:', err),
      );
      return res
        .status(200)
        .json({
          status: 'success',
          message: 'Tutor rechazado exitosamente.',
          data: tutor,
        });
    }

    const studentRes = await db.query(
      'SELECT id_estudiante, nombre, apellido, correo, estado_aprobacion FROM estudiante WHERE id_estudiante = $1 AND estado_aprobacion = $2',
      [id, 'pendiente'],
    );

    if (studentRes.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Estudiante no encontrado.',
      });
    }

    const student = studentRes.rows[0];

    await db.query(
      `UPDATE estudiante 
       SET estado_aprobacion = 'rechazado' 
       WHERE id_estudiante = $1`,
      [id],
    );

    await db.query(
      `UPDATE solicitud 
       SET estado = 'rechazada', fecha_procesado = CURRENT_TIMESTAMP, motivo_rechazo = $2 
       WHERE id_estudiante = $1 AND tipo_usuario = 'estudiante'`,
      [id, motivo || 'Solicitud rechazada por el administrador'],
    );

    const fullName = `${student.nombre} ${student.apellido}`;

    sendApprovalEmail({
      to: student.correo,
      name: fullName,
      approved: false,
      reason: motivo,
    }).catch((err) => console.error('Error al enviar correo de rechazo:', err));

    return res.status(200).json({
      status: 'success',
      message: 'Estudiante rechazado exitosamente.',
      data: {
        id_estudiante: student.id_estudiante,
        nombre: fullName,
        correo: student.correo,
        estado_aprobacion: 'rechazado',
        motivo: motivo || 'No especificado',
      },
    });
  } catch (error) {
    console.error('Error en rejectStudent:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error interno al rechazar al estudiante.',
    });
  }
};

// Controlador para el login del administrador con soporte de doble autenticación (2FA) y verificación del código TOTP.

/**
 * Login del Administrador con soporte de Doble Autenticación (2FA).
 */
const loginAdmin = async (req, res) => {
  try {
    const { nombre_usuario, password } = req.body || {};

    if (!nombre_usuario || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor, ingrese nombre de usuario y contraseña.',
      });
    }

    const result = await sql`
      SELECT id_administrador, nombre_usuario, password_hash, two_factor_secret, two_factor_enable
      FROM administrador WHERE nombre_usuario = ${nombre_usuario.trim()};
    `;

    if (result.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'Nombre de usuario o contraseña incorrectos',
      });
    }

    const admin = result[0];

    const isValidPassword = await comparePassword(
      password,
      admin.password_hash,
    );
    if (!isValidPassword) {
      return res.status(401).json({
        status: 'error',
        message: 'Nombre de usuario o contraseña incorrectos',
      });
    }

    // Primer acceso: el admin no tiene secreto 2FA todavía → generar QR y guardarlo
    if (!admin.two_factor_secret) {
      const plainSecret = generateSecret();
      const encryptedSecret = encryptSecret(plainSecret);

      await sql`
        UPDATE administrador SET two_factor_secret = ${encryptedSecret}
        WHERE id_administrador = ${admin.id_administrador};
      `;

      const qrDataUrl = await generateQrDataUrl(plainSecret, admin.nombre_usuario);

      return res.status(200).json({
        status: 'pending_2fa_setup',
        message: 'Escanea el código QR con tu aplicación autenticadora y luego ingresa el código.',
        adminId: admin.id_administrador,
        qr_code: qrDataUrl,
        secret: plainSecret,
      });
    }

    // 2FA ya configurado pero aún no habilitado → también requiere verificar QR una vez más
    // (edge case: secret guardado pero two_factor_enable todavía false)
    if (!admin.two_factor_enable) {
      const plainSecret = decryptSecret(admin.two_factor_secret);
      const qrDataUrl = await generateQrDataUrl(plainSecret, admin.nombre_usuario);

      return res.status(200).json({
        status: 'pending_2fa_setup',
        message: 'Escanea el código QR con tu aplicación autenticadora y luego ingresa el código.',
        adminId: admin.id_administrador,
        qr_code: qrDataUrl,
        secret: plainSecret,
      });
    }

    // 2FA YA habilitado → pedir el código TOTP
    return res.status(200).json({
      status: 'pending_2fa_verify',
      message: 'Ingrese el código de su aplicación autenticadora.',
      adminId: admin.id_administrador,
    });
  } catch (error) {
    console.error('Error en loginAdmin:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor al procesar el inicio de sesión.',
    });
  }
};

/**
 * Verificación del código TOTP del Administrador.
 */
const verify2fa = async (req, res) => {
  try {
    const { adminId, token } = req.body || {};

    if (!adminId || !token) {
      return res.status(400).json({
        status: 'error',
        message:
          'Por favor, ingrese el id del administrador y el código de verificación.',
      });
    }

    const result = await sql`
      SELECT id_administrador, nombre_usuario, two_factor_secret, two_factor_enable
      FROM administrador WHERE id_administrador = ${adminId};
    `;

    if (result.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Administrador no encontrado.',
      });
    }

    const admin = result[0];

    if (!admin.two_factor_secret) {
      return res.status(400).json({
        status: 'error',
        message: 'El administrador no tiene un secreto 2FA configurado.',
      });
    }

    const secret = decryptSecret(admin.two_factor_secret);
    const isValid = verifyTotp(secret, token);

    if (!isValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Código de verificación inválido o expirado.',
      });
    }

    // Si estaba en setup inicial, habilitar el 2FA definitivamente
    if (!admin.two_factor_enable) {
      await sql`
        UPDATE administrador SET two_factor_enable = TRUE
        WHERE id_administrador = ${admin.id_administrador};
      `;
    }

    const payload = {
      id: admin.id_administrador,
      nombre_usuario: admin.nombre_usuario,
      rol: 'admin',
    };

    const jwtToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

    return res.status(200).json({
      status: 'success',
      message: 'Autenticación exitosa',
      token: jwtToken,
      user: {
        id_administrador: admin.id_administrador,
        nombre_usuario: admin.nombre_usuario,
        rol: 'admin',
        two_factor_enable: true,
      },
    });
  } catch (error) {
    console.error('Error en verify2fa:', error);
    if (error.message === 'Secreto TOTP almacenado en formato inválido.') {
      return res.status(500).json({
        status: 'error',
        message:
          'Error al desencriptar el secreto 2FA. Verifique OTP_ENCRYPTION_KEY.',
      });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor al verificar el código 2FA.',
    });
  }
};

/**
 * Obtener perfil del administrador autenticado.
 */
const getProfileAdmin = async (req, res) => {
  try {
    const adminId = req.user.id;

    const result = await sql`
      SELECT id_administrador, nombre_usuario, two_factor_enable
      FROM administrador WHERE id_administrador = ${adminId};
    `;

    if (result.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Administrador no encontrado',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        ...result[0],
        rol: 'admin',
      },
    });
  } catch (error) {
    console.error('Error en getProfileAdmin:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error interno al obtener perfil del administrador.',
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const { rol } = req.query;
    const consultas = [];

    if (!rol || rol === 'estudiante') {
      consultas.push(
        db.query(`
        SELECT id_estudiante AS id, nombre, apellido, carnet AS identificador,
               correo, estado_aprobacion AS estado, 'estudiante' AS rol
        FROM estudiante WHERE estado_aprobacion IN ('aprobado', 'baja')`),
      );
    }
    if (!rol || rol === 'tutor') {
      consultas.push(
        db.query(`
        SELECT id_tutor AS id, nombre, apellido, carnet_id AS identificador,
               correo, estado_aprobacion AS estado, 'tutor' AS rol
        FROM tutor WHERE estado_aprobacion IN ('aprobado', 'baja')`),
      );
    }

    const resultados = await Promise.all(consultas);
    const data = resultados
      .flatMap((resultado) => resultado.rows)
      .sort((a, b) =>
        `${a.nombre} ${a.apellido}`.localeCompare(`${b.nombre} ${b.apellido}`),
      );
    return res.status(200).json({ status: 'success', data });
  } catch (error) {
    console.error('Error en getUsers:', error);
    return res
      .status(500)
      .json({
        status: 'error',
        message: 'Error interno al consultar usuarios.',
      });
  }
};

const deactivateUser = async (req, res) => {
  const { rol } = req.body || {};
  if (rol === 'tutor') {
    return deactivateTutor(req, res);
  }
  if (rol === 'estudiante') {
    return deactivateStudent(req, res);
  }
  return res.status(400).json({ status: 'error', message: 'Rol inválido.' });
};

const getApprovedStudents = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id_estudiante, nombre, apellido, carnet, genero, direccion, telefono, 
              fecha_nacimiento, foto_url, correo, estado_aprobacion, fecha_registro 
       FROM estudiante 
       WHERE estado_aprobacion = 'aprobado' 
       ORDER BY nombre ASC, apellido ASC`,
    );

    return res.status(200).json({
      status: 'success',
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error en getApprovedStudents:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor al consultar estudiantes aprobados.',
    });
  }
};

const deactivateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body || {};

    if (!id) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor proporcione el ID del estudiante.',
      });
    }

    // 1. Obtener datos del estudiante antes de eliminar
    const studentRes = await db.query(
      'SELECT id_estudiante, nombre, apellido, correo FROM estudiante WHERE id_estudiante = $1',
      [id],
    );

    if (studentRes.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Estudiante no encontrado.',
      });
    }

    const student = studentRes.rows[0];
    const fullName = `${student.nombre} ${student.apellido}`;

    // 2. Eliminar referencias y registros asociados al estudiante
    await db.query('DELETE FROM tutor_ratings WHERE id_estudiante = $1', [id]);
    await db.query('DELETE FROM student_ratings WHERE id_estudiante = $1', [id]);
    await db.query('DELETE FROM tutor_reports WHERE id_estudiante = $1', [id]);
    await db.query('DELETE FROM student_reports WHERE id_estudiante = $1', [id]);
    await db.query('DELETE FROM sesion WHERE id_estudiante = $1', [id]);
    await db.query('DELETE FROM solicitud WHERE id_estudiante = $1', [id]);
    await db.query('DELETE FROM estudiante WHERE id_estudiante = $1', [id]);

    // 3. Enviar correo de notificación de baja/eliminación
    sendDeactivationEmail({
      to: student.correo,
      name: fullName,
      role: 'Estudiante',
      reason:
        motivo ||
        'Baja y eliminación de cuenta procesada por la administración',
    }).catch((err) =>
      console.error('Error al enviar correo de baja de estudiante:', err),
    );

    return res.status(200).json({
      status: 'success',
      message:
        'Estudiante dado de baja y eliminado exitosamente de la base de datos.',
      data: {
        id_estudiante: parseInt(id, 10),
        nombre: fullName,
        correo: student.correo,
        estado_aprobacion: 'baja',
        motivo: motivo || 'No especificado',
      },
    });
  } catch (error) {
    console.error('Error en deactivateStudent:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error interno al dar de baja al estudiante.',
    });
  }
};

const getApprovedTutors = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT t.id_tutor, t.nombre, t.apellido, t.carnet_id, t.numero_identificacion_tutor, t.genero, 
              t.direccion, t.telefono, t.fecha_nacimiento, t.foto_url, t.correo, t.direccion_tutoria, 
              t.anio_inicio_tutorias, t.universidad_graduacion, t.estado_aprobacion, 
              t.hora_inicio_atencion, t.hora_fin_atencion, t.fecha_registro,
              COALESCE(
                (SELECT string_agg(m.nombre, ', ') 
                 FROM tutor_materia tm 
                 JOIN materia m ON tm.id_materia = m.id_materia 
                 WHERE tm.id_tutor = t.id_tutor),
                t.universidad_graduacion,
                ''
              ) AS especialidad,
              COALESCE(
                (SELECT json_agg(json_build_object('id_materia', m.id_materia, 'nombre', m.nombre))
                 FROM tutor_materia tm 
                 JOIN materia m ON tm.id_materia = m.id_materia 
                 WHERE tm.id_tutor = t.id_tutor),
                '[]'::json
              ) AS materias
       FROM tutor t 
       WHERE t.estado_aprobacion = 'aprobado' 
       ORDER BY t.nombre ASC, t.apellido ASC`,
    );

    return res.status(200).json({
      status: 'success',
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error en getApprovedTutors:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor al consultar tutores aprobados.',
    });
  }
};

const deactivateTutor = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body || {};

    if (!id) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor proporcione el ID del tutor.',
      });
    }

    // 1. Obtener datos del tutor antes de eliminar
    const tutorRes = await db.query(
      'SELECT id_tutor, nombre, apellido, correo FROM tutor WHERE id_tutor = $1',
      [id],
    );

    if (tutorRes.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Tutor no encontrado.',
      });
    }

    const tutor = tutorRes.rows[0];
    const fullName = `${tutor.nombre} ${tutor.apellido}`;

    // 2. Eliminar referencias y registros asociados al tutor
    await db.query('DELETE FROM tutor_ratings WHERE id_tutor = $1', [id]);
    await db.query('DELETE FROM student_ratings WHERE id_tutor = $1', [id]);
    await db.query('DELETE FROM tutor_reports WHERE id_tutor = $1', [id]);
    await db.query('DELETE FROM student_reports WHERE id_tutor = $1', [id]);
    await db.query('DELETE FROM sesion WHERE id_tutor = $1', [id]);
    await db.query('DELETE FROM tutor_materia WHERE id_tutor = $1', [id]);
    await db.query('DELETE FROM tutor_dia_atencion WHERE id_tutor = $1', [id]);
    await db.query('DELETE FROM solicitud WHERE id_tutor = $1', [id]);
    await db.query('DELETE FROM tutor WHERE id_tutor = $1', [id]);

    // 3. Enviar correo de notificación de baja/eliminación
    sendDeactivationEmail({
      to: tutor.correo,
      name: fullName,
      role: 'Tutor',
      reason:
        motivo ||
        'Baja y eliminación de cuenta procesada por la administración',
    }).catch((err) =>
      console.error('Error al enviar correo de baja de tutor:', err),
    );

    return res.status(200).json({
      status: 'success',
      message:
        'Tutor dado de baja y eliminado exitosamente de la base de datos.',
      data: {
        id_tutor: parseInt(id, 10),
        nombre: fullName,
        correo: tutor.correo,
        estado_aprobacion: 'baja',
        motivo: motivo || 'No especificado',
      },
    });
  } catch (error) {
    console.error('Error en deactivateTutor:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error interno al dar de baja al tutor.',
    });
  }
};

const getReports = async (req, res) => {
  try {
    const [states, subjects, tutors, totals, cancellations, popularHours] = await Promise.all([
      db.query(
        `SELECT estado, COUNT(*)::integer AS cantidad FROM sesion GROUP BY estado ORDER BY estado`,
      ),
      db.query(`SELECT m.nombre AS materia, COUNT(*)::integer AS cantidad
                FROM sesion s JOIN materia m ON m.id_materia = s.id_materia
                WHERE s.estado = 'Atendida'
                GROUP BY m.nombre ORDER BY cantidad DESC, m.nombre ASC`),
      db.query(`SELECT CONCAT(t.nombre, ' ', t.apellido) AS tutor,
                       t.foto_url,
                       COUNT(*)::integer AS sesiones
                FROM sesion s JOIN tutor t ON t.id_tutor = s.id_tutor
                WHERE s.estado = 'Atendida'
                GROUP BY t.id_tutor, t.nombre, t.apellido, t.foto_url
                ORDER BY sesiones DESC, tutor ASC`),
      db.query(`SELECT COUNT(*)::integer AS sesiones, COUNT(DISTINCT id_estudiante)::integer AS estudiantes,
                       COUNT(DISTINCT id_tutor)::integer AS tutores FROM sesion`),
      db.query(`SELECT m.nombre AS materia, COUNT(*)::integer AS total_canceladas
                FROM sesion s JOIN materia m ON m.id_materia = s.id_materia
                WHERE s.estado LIKE 'Cancelada%'
                GROUP BY m.nombre ORDER BY total_canceladas DESC LIMIT 5`),
      db.query(`SELECT TO_CHAR(hora_sesion, 'HH24:00') AS franja_horaria,
                       COUNT(*)::integer AS total_sesiones
                FROM sesion
                GROUP BY TO_CHAR(hora_sesion, 'HH24:00')
                ORDER BY total_sesiones DESC LIMIT 6`),
    ]);
    return res.status(200).json({
      status: 'success',
      data: {
        totales: totals.rows[0],
        porEstado: states.rows,
        porMateria: subjects.rows,
        porTutor: tutors.rows,
        cancelacionesPorMateria: cancellations.rows,
        horariosDemandados: popularHours.rows,
      },
    });
  } catch (error) {
    console.error('Error en getReports:', error);
    return res
      .status(500)
      .json({ status: 'error', message: 'Error interno al generar reportes.' });
  }
};

const fs = require('fs');
const path = require('path');

const streamDocumento = async (req, res) => {
  try {
    const { url, id, tipo } = req.query;
    let targetUrl = url;

    if (id && tipo) {
      if (tipo === 'estudiante') {
        const studentRes = await db.query(
          'SELECT carnet_pdf_url FROM estudiante WHERE id_estudiante = $1',
          [id]
        );
        if (studentRes.rows.length > 0) {
          targetUrl = targetUrl || studentRes.rows[0].carnet_pdf_url;
        }
      } else if (tipo === 'tutor') {
        const tutorRes = await db.query(
          'SELECT cv_pdf_url FROM tutor WHERE id_tutor = $1',
          [id]
        );
        if (tutorRes.rows.length > 0) {
          targetUrl = targetUrl || tutorRes.rows[0].cv_pdf_url;
        }
      }
    }

    if (!targetUrl) {
      return res.status(404).send('Documento no encontrado.');
    }

    let buffer = null;

    // 1. Archivo local almacenado en /uploads/
    if (targetUrl.startsWith('/uploads/') || targetUrl.includes('/uploads/')) {
      const subPath = targetUrl.substring(targetUrl.indexOf('/uploads/') + '/uploads/'.length);
      const localFilePath = path.join(__dirname, '../../uploads', subPath);
      if (fs.existsSync(localFilePath)) {
        buffer = fs.readFileSync(localFilePath);
      }
    }

    // 2. Archivo en formato DataURI base64
    if (!buffer && targetUrl.startsWith('data:')) {
      try {
        const parts = targetUrl.split(',');
        if (parts[1]) {
          buffer = Buffer.from(parts[1], 'base64');
        }
      } catch (err) {
        console.error('Error parseando base64 del PDF:', err);
      }
    }

    // 3. Archivo remoto HTTP/HTTPS
    if (!buffer && (targetUrl.startsWith('http://') || targetUrl.startsWith('https://'))) {
      try {
        const response = await fetch(targetUrl);
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          buffer = Buffer.from(arrayBuffer);
        }
      } catch (fetchErr) {
        console.error('Error al obtener archivo remoto:', fetchErr.message);
      }
    }

    if (!buffer || buffer.length === 0) {
      return res.status(404).send('No se pudo cargar el archivo PDF original.');
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="documento.pdf"');
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Cache-Control', 'public, max-age=1800');
    return res.send(buffer);
  } catch (error) {
    console.error('Error en streamDocumento:', error);
    return res.status(500).send('Error interno al transmitir el documento.');
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// HU-038: Obtener URL segura del PDF del carnet escaneado del estudiante
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Genera una URL de acceso seguro (firmada por Cloudinary o directa) al PDF
 * del carnet escaneado de un estudiante pendiente de aprobación.
 *
 * GET /admin/students/:id/documento
 *
 * Respuesta:
 *  { status, data: { id_estudiante, nombre, apellido, carnet_pdf_url } }
 */
const getStudentDocument = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor proporcione el ID del estudiante.',
      });
    }

    const result = await db.query(
      `SELECT id_estudiante, nombre, apellido, carnet_pdf_url
       FROM estudiante
       WHERE id_estudiante = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Estudiante no encontrado.',
      });
    }

    const student = result.rows[0];

    if (!student.carnet_pdf_url) {
      return res.status(404).json({
        status: 'error',
        message: 'El estudiante no tiene un carnet PDF registrado.',
      });
    }

    // Si la URL apunta a Cloudinary, generamos una URL firmada de corta duración
    // para que no sea accesible públicamente sin autenticación.
    let pdfUrl = student.carnet_pdf_url;
    if (pdfUrl.includes('cloudinary.com')) {
      try {
        // Extraemos el public_id del recurso desde la URL de Cloudinary
        // Formato esperado: https://res.cloudinary.com/<cloud>/raw/upload/v<ver>/<public_id>.pdf
        const urlObj = new URL(pdfUrl);
        const pathParts = urlObj.pathname.split('/');
        // El public_id está después de /upload/ o /raw/upload/
        const uploadIdx = pathParts.findIndex((p) => p === 'upload');
        if (uploadIdx !== -1) {
          // Saltar la versión (vXXXXXX) si existe
          const afterUpload = pathParts.slice(uploadIdx + 1);
          const withoutVersion = afterUpload[0] && /^v\d+$/.test(afterUpload[0])
            ? afterUpload.slice(1)
            : afterUpload;
          const publicId = withoutVersion.join('/').replace(/\.pdf$/i, '');

          // URL firmada válida por 15 minutos (900 segundos)
          pdfUrl = cloudinary.url(publicId, {
            resource_type: 'raw',
            type: 'upload',
            sign_url: true,
            expires_at: Math.floor(Date.now() / 1000) + 900,
          });
        }
      } catch (signErr) {
        console.warn(
          'No se pudo firmar la URL de Cloudinary, se devuelve la URL original:',
          signErr.message,
        );
        // Fallback: devolver la URL original si falla la firma
      }
    }

    return res.status(200).json({
      status: 'success',
      data: {
        id_estudiante: student.id_estudiante,
        nombre: `${student.nombre} ${student.apellido}`,
        carnet_pdf_url: pdfUrl,
      },
    });
  } catch (error) {
    console.error('Error en getStudentDocument:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error interno al obtener el documento del estudiante.',
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// HU-039: Obtener URL segura del PDF del CV del tutor
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Genera una URL de acceso seguro (firmada por Cloudinary o directa) al PDF
 * del CV de un tutor pendiente de aprobación.
 *
 * GET /admin/tutors/:id/documento
 *
 * Respuesta:
 *  { status, data: { id_tutor, nombre, apellido, cv_pdf_url } }
 */
const getTutorDocument = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor proporcione el ID del tutor.',
      });
    }

    const result = await db.query(
      `SELECT id_tutor, nombre, apellido, cv_pdf_url
       FROM tutor
       WHERE id_tutor = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Tutor no encontrado.',
      });
    }

    const tutor = result.rows[0];

    if (!tutor.cv_pdf_url) {
      return res.status(404).json({
        status: 'error',
        message: 'El tutor no tiene un CV en PDF registrado.',
      });
    }

    // Misma lógica de URL firmada para Cloudinary
    let pdfUrl = tutor.cv_pdf_url;
    if (pdfUrl.includes('cloudinary.com')) {
      try {
        const urlObj = new URL(pdfUrl);
        const pathParts = urlObj.pathname.split('/');
        const uploadIdx = pathParts.findIndex((p) => p === 'upload');
        if (uploadIdx !== -1) {
          const afterUpload = pathParts.slice(uploadIdx + 1);
          const withoutVersion = afterUpload[0] && /^v\d+$/.test(afterUpload[0])
            ? afterUpload.slice(1)
            : afterUpload;
          const publicId = withoutVersion.join('/').replace(/\.pdf$/i, '');

          pdfUrl = cloudinary.url(publicId, {
            resource_type: 'raw',
            type: 'upload',
            sign_url: true,
            expires_at: Math.floor(Date.now() / 1000) + 900,
          });
        }
      } catch (signErr) {
        console.warn(
          'No se pudo firmar la URL de Cloudinary, se devuelve la URL original:',
          signErr.message,
        );
      }
    }

    return res.status(200).json({
      status: 'success',
      data: {
        id_tutor: tutor.id_tutor,
        nombre: `${tutor.nombre} ${tutor.apellido}`,
        cv_pdf_url: pdfUrl,
      },
    });
  } catch (error) {
    console.error('Error en getTutorDocument:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error interno al obtener el CV del tutor.',
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// HU-040: Actualizar datos de estudiante activo (correo bloqueado)
// ─────────────────────────────────────────────────────────────────────────────
const updateStudentAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      apellido,
      carnet,
      genero,
      direccion,
      telefono,
      fecha_nacimiento,
      foto_url,
    } = req.body || {};

    if (!id) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor proporcione el ID del estudiante.',
      });
    }

    const checkRes = await db.query(
      'SELECT id_estudiante FROM estudiante WHERE id_estudiante = $1',
      [id],
    );
    if (checkRes.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Estudiante no encontrado.',
      });
    }

    const updateRes = await db.query(
      `UPDATE estudiante
       SET nombre = COALESCE($1, nombre),
           apellido = COALESCE($2, apellido),
           carnet = COALESCE($3, carnet),
           genero = COALESCE($4, genero),
           direccion = COALESCE($5, direccion),
           telefono = COALESCE($6, telefono),
           fecha_nacimiento = COALESCE($7, fecha_nacimiento),
           foto_url = COALESCE($8, foto_url)
       WHERE id_estudiante = $9
       RETURNING id_estudiante, nombre, apellido, carnet, genero, direccion, telefono, fecha_nacimiento, correo, foto_url, estado_aprobacion`,
      [
        nombre || null,
        apellido || null,
        carnet || null,
        genero || null,
        direccion || null,
        telefono || null,
        fecha_nacimiento || null,
        foto_url || null,
        id,
      ],
    );

    return res.status(200).json({
      status: 'success',
      message: 'Estudiante actualizado exitosamente.',
      data: updateRes.rows[0],
    });
  } catch (error) {
    console.error('Error en updateStudentAdmin:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error interno al actualizar los datos del estudiante.',
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// HU-041: Actualizar datos de tutor activo (correo bloqueado)
// ─────────────────────────────────────────────────────────────────────────────
const updateTutorAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      apellido,
      carnet_id,
      numero_identificacion_tutor,
      genero,
      direccion,
      telefono,
      fecha_nacimiento,
      universidad_graduacion,
      direccion_tutoria,
      anio_inicio_tutorias,
      foto_url,
      hora_inicio_atencion,
      hora_fin_atencion,
      materias,
    } = req.body || {};

    if (!id) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor proporcione el ID del tutor.',
      });
    }

    const checkRes = await db.query(
      'SELECT id_tutor FROM tutor WHERE id_tutor = $1',
      [id],
    );
    if (checkRes.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Tutor no encontrado.',
      });
    }

    const updateRes = await db.query(
      `UPDATE tutor
       SET nombre = COALESCE($1, nombre),
           apellido = COALESCE($2, apellido),
           carnet_id = COALESCE($3, carnet_id),
           numero_identificacion_tutor = COALESCE($4, numero_identificacion_tutor),
           genero = COALESCE($5, genero),
           direccion = COALESCE($6, direccion),
           telefono = COALESCE($7, telefono),
           fecha_nacimiento = COALESCE($8, fecha_nacimiento),
           universidad_graduacion = COALESCE($9, universidad_graduacion),
           direccion_tutoria = COALESCE($10, direccion_tutoria),
           anio_inicio_tutorias = COALESCE($11, anio_inicio_tutorias),
           foto_url = COALESCE($12, foto_url),
           hora_inicio_atencion = COALESCE($13, hora_inicio_atencion),
           hora_fin_atencion = COALESCE($14, hora_fin_atencion)
       WHERE id_tutor = $15
       RETURNING id_tutor, nombre, apellido, carnet_id, numero_identificacion_tutor, genero, direccion, telefono, fecha_nacimiento, universidad_graduacion, direccion_tutoria, anio_inicio_tutorias, correo, foto_url, estado_aprobacion`,
      [
        nombre || null,
        apellido || null,
        carnet_id || null,
        numero_identificacion_tutor || null,
        genero || null,
        direccion || null,
        telefono || null,
        fecha_nacimiento || null,
        universidad_graduacion || null,
        direccion_tutoria || null,
        anio_inicio_tutorias || null,
        foto_url || null,
        hora_inicio_atencion || null,
        hora_fin_atencion || null,
        id,
      ],
    );

    // Sincronizar materias en tutor_materia si se enviaron
    if (Array.isArray(materias)) {
      await db.query('DELETE FROM tutor_materia WHERE id_tutor = $1', [id]);
      for (const mat of materias) {
        const matNombre = typeof mat === 'string' ? mat.trim() : mat?.nombre?.trim();
        if (matNombre) {
          const matRes = await db.query(
            `INSERT INTO materia (nombre) VALUES ($1)
             ON CONFLICT (nombre) DO UPDATE SET nombre = EXCLUDED.nombre
             RETURNING id_materia`,
            [matNombre]
          );
          await db.query(
            `INSERT INTO tutor_materia (id_tutor, id_materia)
             VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [id, matRes.rows[0].id_materia]
          );
        }
      }
    }

    return res.status(200).json({
      status: 'success',
      message: 'Tutor actualizado exitosamente.',
      data: updateRes.rows[0],
    });
  } catch (error) {
    console.error('Error en updateTutorAdmin:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error interno al actualizar los datos del tutor.',
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// HU-042 & HU-043: Listar denuncias
// ─────────────────────────────────────────────────────────────────────────────
const DENUNCIAS = {
  tutores: { tabla: 'tutor_reports', columnaAcusado: 'id_tutor', baja: (req, res) => deactivateTutor(req, res) },
  estudiantes: { tabla: 'student_reports', columnaAcusado: 'id_estudiante', baja: (req, res) => deactivateStudent(req, res) },
};
const tipoDenuncia = (valor) => {
  if (valor === 'tutor' || valor === 'tutores') return 'tutores';
  if (valor === 'estudiante' || valor === 'estudiantes') return 'estudiantes';
  return null;
};

const getDenuncias = async (req, res) => {
  const tipo = tipoDenuncia(req.query.tipo || 'tutores');
  if (!tipo) {
    return res.status(400).json({ status: 'error', message: 'El tipo debe ser "tutores" o "estudiantes".' });
  }

  // Quien denuncia es el otro rol: contra tutores denuncia un estudiante y viceversa.
  const consulta = tipo === 'tutores'
    ? `SELECT r.id_reporte AS id, 'tutor' AS tipo, r.id_sesion, r.categoria, r.descripcion AS motivo,
              r.id_tutor AS id_acusado,
              CONCAT(a.nombre, ' ', a.apellido) AS denunciado_nombre, a.foto_url AS denunciado_foto,
              CONCAT(d.nombre, ' ', d.apellido) AS denunciante_nombre,
              r.fecha_reporte AS fecha, LOWER(r.estado) AS estado
       FROM tutor_reports r
       JOIN tutor a ON a.id_tutor = r.id_tutor
       JOIN estudiante d ON d.id_estudiante = r.id_estudiante
       ORDER BY (LOWER(r.estado) = 'pendiente') DESC, r.fecha_reporte DESC`
    : `SELECT r.id_reporte AS id, 'estudiante' AS tipo, r.id_sesion, r.categoria, r.descripcion AS motivo,
              r.id_estudiante AS id_acusado,
              CONCAT(a.nombre, ' ', a.apellido) AS denunciado_nombre, a.foto_url AS denunciado_foto,
              CONCAT(d.nombre, ' ', d.apellido) AS denunciante_nombre,
              r.fecha_reporte AS fecha, LOWER(r.estado) AS estado
       FROM student_reports r
       JOIN estudiante a ON a.id_estudiante = r.id_estudiante
       JOIN tutor d ON d.id_tutor = r.id_tutor
       ORDER BY (LOWER(r.estado) = 'pendiente') DESC, r.fecha_reporte DESC`;

  try {
    const result = await db.query(consulta);
    return res.status(200).json({ status: 'success', data: result.rows });
  } catch (error) {
    console.error('Error en getDenuncias:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno al listar denuncias.' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// HU-042 & HU-043: Resolver denuncia
// Body: { tipo: 'tutores'|'estudiantes', accion: 'dar_de_baja'|'rechazar_denuncia', motivo? }
// Los ids de tutor_reports y student_reports son independientes, por eso `tipo` es obligatorio.
// ─────────────────────────────────────────────────────────────────────────────
const resolverDenuncia = async (req, res) => {
  const { id } = req.params;
  const { accion, motivo } = req.body || {};
  const tipo = tipoDenuncia((req.body || {}).tipo || req.query.tipo);

  if (!/^[1-9]\d*$/.test(id)) {
    return res.status(400).json({ status: 'error', message: 'ID de denuncia inválido.' });
  }
  if (!tipo) {
    return res.status(400).json({ status: 'error', message: 'Indica el tipo de denuncia: "tutores" o "estudiantes".' });
  }
  const darDeBaja = accion === 'dar_de_baja' || accion === 'baja';
  const descartar = accion === 'rechazar_denuncia' || accion === 'descartar';
  if (!darDeBaja && !descartar) {
    return res.status(400).json({ status: 'error', message: 'Acción inválida. Usa "dar_de_baja" o "rechazar_denuncia".' });
  }

  const { tabla, columnaAcusado, baja } = DENUNCIAS[tipo];
  const comentario = typeof motivo === 'string' && motivo.trim() ? motivo.trim() : null;

  try {
    const found = await db.query(
      `SELECT id_reporte, ${columnaAcusado} AS id_acusado, categoria, estado FROM ${tabla} WHERE id_reporte = $1`,
      [id]
    );
    if (found.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Denuncia no encontrada.' });
    }
    const denuncia = found.rows[0];
    if (String(denuncia.estado).toLowerCase() !== 'pendiente') {
      return res.status(409).json({ status: 'error', message: 'Esta denuncia ya fue resuelta.' });
    }

    if (darDeBaja) {
      // Se reutiliza la baja existente (borra la cuenta y envía el correo) sin responder todavía:
      // si falla, la denuncia sigue pendiente.
      const salida = {
        code: 200,
        body: null,
        status(c) { this.code = c; return this; },
        json(b) { this.body = b; return this; },
      };
      await baja(
        { params: { id: String(denuncia.id_acusado) }, body: { motivo: comentario || `Sanción por denuncia: ${denuncia.categoria}` } },
        salida
      );
      if (salida.code !== 200) return res.status(salida.code).json(salida.body);
    }

    // Al dar de baja, la cuenta y sus reportes se eliminan (ver deactivateTutor/deactivateStudent),
    // por lo que este UPDATE solo deja huella cuando la denuncia se descarta.
    await db.query(
      `UPDATE ${tabla} SET estado = $1, fecha_resolucion = NOW(), motivo_resolucion = $2 WHERE id_reporte = $3`,
      [darDeBaja ? 'Resuelto' : 'Descartado', comentario, id]
    );

    return res.status(200).json({
      status: 'success',
      message: darDeBaja ? 'Usuario dado de baja exitosamente.' : 'Denuncia descartada exitosamente.',
    });
  } catch (error) {
    console.error('Error en resolverDenuncia:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno al resolver la denuncia.' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// HU-044: Reporte de calificaciones de tutores
// ─────────────────────────────────────────────────────────────────────────────
const getTutorRatings = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT t.id_tutor, CONCAT(t.nombre, ' ', t.apellido) AS nombre_completo, t.correo,
              t.universidad_graduacion AS especialidad, t.foto_url,
              (SELECT COUNT(*)::integer FROM sesion s WHERE s.id_tutor = t.id_tutor) AS total_sesiones,
              (SELECT COUNT(*)::integer FROM tutor_ratings tr WHERE tr.id_tutor = t.id_tutor) AS total_evaluaciones,
              COALESCE((SELECT ROUND(AVG(tr.estrellas)::numeric, 1) FROM tutor_ratings tr WHERE tr.id_tutor = t.id_tutor), 0) AS promedio_estrellas
       FROM tutor t
       WHERE t.estado_aprobacion = 'aprobado'
       ORDER BY promedio_estrellas DESC, nombre_completo ASC`
    );
    return res.status(200).json({ status: 'success', data: result.rows });
  } catch (error) {
    console.error('Error en getTutorRatings:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error interno al consultar calificaciones de tutores.',
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// HU-045: Reporte de calificaciones de estudiantes
// ─────────────────────────────────────────────────────────────────────────────
const getStudentRatings = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT e.id_estudiante, CONCAT(e.nombre, ' ', e.apellido) AS nombre_completo, e.correo,
              e.carnet, e.foto_url,
              (SELECT COUNT(*)::integer FROM sesion s WHERE s.id_estudiante = e.id_estudiante) AS total_sesiones,
              (SELECT COUNT(*)::integer FROM student_ratings sr WHERE sr.id_estudiante = e.id_estudiante) AS total_evaluaciones,
              COALESCE((SELECT ROUND(AVG(sr.estrellas)::numeric, 1) FROM student_ratings sr WHERE sr.id_estudiante = e.id_estudiante), 0) AS promedio_estrellas
       FROM estudiante e
       WHERE e.estado_aprobacion = 'aprobado'
       ORDER BY promedio_estrellas DESC, nombre_completo ASC`
    );
    return res.status(200).json({ status: 'success', data: result.rows });
  } catch (error) {
    console.error('Error en getStudentRatings:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error interno al consultar calificaciones de estudiantes.',
    });
  }
};

module.exports = {
  getPendingStudents,
  approveStudent,
  rejectStudent,
  loginAdmin,
  verify2fa,
  getProfileAdmin,
  getUsers,
  deactivateUser,
  getApprovedStudents,
  deactivateStudent,
  getApprovedTutors,
  deactivateTutor,
  getReports,
  streamDocumento,
  getStudentDocument,
  getTutorDocument,
  updateStudentAdmin,
  updateTutorAdmin,
  getDenuncias,
  resolverDenuncia,
  getTutorRatings,
  getStudentRatings,
};