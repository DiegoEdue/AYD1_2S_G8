const sql = require('../config/db');
const { comparePassword } = require('../utils/bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middlewares/auth');
const db = require('../config/db');
const { sendApprovalEmail } = require('../services/email');
const {
  generateSecret,
  encryptSecret,
  decryptSecret,
  generateQrDataUrl,
  verifyTotp,
} = require('../utils/twoFactor');

//Controllador para aprobar, rechazar y listar estudiantes pendientes de aprobación por el administrador.

const getPendingStudents = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id_estudiante, nombre, apellido, carnet, genero, direccion, telefono, 
              fecha_nacimiento, foto_url, correo, estado_aprobacion, fecha_registro 
       FROM estudiante 
       WHERE estado_aprobacion = 'pendiente' 
       ORDER BY fecha_registro ASC`
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
      message: 'Error interno del servidor al consultar estudiantes pendientes.',
    });
  }
};


const approveStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor proporcione el ID del estudiante.',
      });
    }

    // Buscar estudiante
    const studentRes = await db.query(
      'SELECT id_estudiante, nombre, apellido, correo, estado_aprobacion FROM estudiante WHERE id_estudiante = $1',
      [id]
    );

    if (studentRes.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Estudiante no encontrado.',
      });
    }

    const student = studentRes.rows[0];

    // Actualizar estado en la tabla estudiante
    await db.query(
      `UPDATE estudiante 
       SET estado_aprobacion = 'aprobado' 
       WHERE id_estudiante = $1`,
      [id]
    );

    // Actualizar estado en la tabla solicitud (si existe)
    await db.query(
      `UPDATE solicitud 
       SET estado = 'aceptada', fecha_procesado = CURRENT_TIMESTAMP 
       WHERE id_estudiante = $1 AND tipo_usuario = 'estudiante'`,
      [id]
    );

    const fullName = `${student.nombre} ${student.apellido}`;

    sendApprovalEmail({ to: student.correo, name: fullName, approved: true }).catch(err => console.error('Error al enviar correo de aprobación:', err));


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
    const { motivo } = req.body || {};

    if (!id) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor proporcione el ID del estudiante.',
      });
    }

    // Buscar estudiante
    const studentRes = await db.query(
      'SELECT id_estudiante, nombre, apellido, correo, estado_aprobacion FROM estudiante WHERE id_estudiante = $1',
      [id]
    );

    if (studentRes.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Estudiante no encontrado.',
      });
    }

    const student = studentRes.rows[0];

    // Actualizar estado en la tabla estudiante
    await db.query(
      `UPDATE estudiante 
       SET estado_aprobacion = 'rechazado' 
       WHERE id_estudiante = $1`,
      [id]
    );

    // Actualizar estado en la tabla solicitud (si existe)
    await db.query(
      `UPDATE solicitud 
       SET estado = 'rechazada', fecha_procesado = CURRENT_TIMESTAMP, motivo_rechazo = $2 
       WHERE id_estudiante = $1 AND tipo_usuario = 'estudiante'`,
      [id, motivo || 'Solicitud rechazada por el administrador']
    );

    const fullName = `${student.nombre} ${student.apellido}`;

    // Enviar correo de notificación
    sendApprovalEmail({ to: student.correo, name: fullName, approved: false, reason: motivo }).catch(err => console.error('Error al enviar correo de rechazo:', err));


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



//Controllador para el login del administrador con soporte de doble autenticación (2FA) y verificación del código TOTP.

/**
 * Login del Administrador con soporte de Doble Autenticación (2FA).
 *
 * Flujo:
 *  - Si el admin NO tiene 2FA habilitado (primer login):
 *      valida credenciales, genera un secreto TOTP, lo encripta y lo guarda,
 *      y devuelve el QR + secreto para que configure su app autenticadora.
 *      NO emite token todavía.
 *  - Si el admin YA tiene 2FA habilitado:
 *      valida credenciales y devuelve pending_2fa_verify (sin token);
 *      el código TOTP se valida en /verify-2fa.
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

    const isValidPassword = await comparePassword(password, admin.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        status: 'error',
        message: 'Nombre de usuario o contraseña incorrectos',
      });
    }

    // Caso A: 2FA NO habilitado aún -> setup del secreto TOTP
    if (!admin.two_factor_enable) {
      const secret = generateSecret();
      const encrypted = encryptSecret(secret);

      await sql`
        UPDATE administrador SET two_factor_secret = ${encrypted}
        WHERE id_administrador = ${admin.id_administrador};
      `;

      const qrCode = await generateQrDataUrl(secret, admin.nombre_usuario);

      return res.status(200).json({
        status: 'pending_2fa_setup',
        message:
          'Configure su autenticador. Escanee el código QR o ingrese el secreto manualmente y valide el código en /verify-2fa.',
        adminId: admin.id_administrador,
        secret,
        qr_code: qrCode,
      });
    }

    // Caso B: 2FA YA habilitado -> pedir el código TOTP
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
 * Si era la primera configuración, habilita definitivamente el 2FA.
 * Al validar, emite el token JWT con rol 'admin'.
 */
const verify2fa = async (req, res) => {
  try {
    const { adminId, token } = req.body || {};

    if (!adminId || !token) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor, ingrese el id del administrador y el código de verificación.',
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
        message: 'Error al desencriptar el secreto 2FA. Verifique OTP_ENCRYPTION_KEY.',
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

module.exports = {
  getPendingStudents,
  approveStudent,
  rejectStudent,
  loginAdmin,
  verify2fa,
  getProfileAdmin,
};
