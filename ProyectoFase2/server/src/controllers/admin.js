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
      `SELECT id_tutor, nombre, apellido, carnet_id, numero_identificacion_tutor, genero, 
              direccion, telefono, fecha_nacimiento, foto_url, correo, direccion_tutoria, 
              anio_inicio_tutorias, universidad_graduacion, estado_aprobacion, 
              hora_inicio_atencion, hora_fin_atencion, fecha_registro 
       FROM tutor 
       WHERE estado_aprobacion = 'aprobado' 
       ORDER BY nombre ASC, apellido ASC`,
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
    const [states, subjects, tutors, totals] = await Promise.all([
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
    ]);
    return res.status(200).json({
      status: 'success',
      data: {
        totales: totals.rows[0],
        porEstado: states.rows,
        porMateria: subjects.rows,
        porTutor: tutors.rows,
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
};
