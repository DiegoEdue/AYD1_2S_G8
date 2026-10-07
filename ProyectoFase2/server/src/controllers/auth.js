const { loginEstudiante } = require('./estudiante');
const { loginTutor } = require('./tutor');
const db = require('../config/db');
const { sendVerificationEmail } = require('../services/email');

const generateVerificationToken = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const loginUnified = async (req, res) => {
  try {
    const { correo, password, verification_token } = req.body || {};

    if (!correo || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor, ingrese correo y contraseña.',
      });
    }

    const cleanCorreo = correo.trim();

    // 1. Buscar en estudiante
    const estRes = await db.query('SELECT 1 FROM estudiante WHERE correo = $1', [cleanCorreo]);
    if (estRes.rows.length > 0) {
      return loginEstudiante(req, res);
    }

    // 2. Buscar en tutor
    const tutRes = await db.query('SELECT 1 FROM tutor WHERE correo = $1', [cleanCorreo]);
    if (tutRes.rows.length > 0) {
      return loginTutor(req, res);
    }

    // 3. No existe en ninguna de las dos tablas
    return res.status(401).json({
      status: 'error',
      message: 'Correo o contraseña incorrectos',
    });
  } catch (error) {
    console.error('Error en loginUnified:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor al procesar el inicio de sesión.',
    });
  }
};

/**
 * Reenviar código de verificación por correo (HU-030)
 * POST /api/auth/resend-verification
 * Body: { correo }
 */
const resendVerificationToken = async (req, res) => {
  try {
    const { correo } = req.body || {};

    if (!correo) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor, ingrese su correo electrónico.',
      });
    }

    const cleanCorreo = correo.trim();

    // Buscar en estudiante
    const estRes = await db.query(
      'SELECT id_estudiante, nombre, apellido, correo, is_email_verified FROM estudiante WHERE correo = $1',
      [cleanCorreo]
    );
    if (estRes.rows.length > 0) {
      const estudiante = estRes.rows[0];
      if (estudiante.is_email_verified) {
        return res.status(400).json({
          status: 'error',
          message: 'Este correo ya ha sido verificado.',
        });
      }
      const newToken = generateVerificationToken();
      await db.query(
        `UPDATE estudiante SET verification_token = $1, token_created_at = NOW() WHERE id_estudiante = $2`,
        [newToken, estudiante.id_estudiante]
      );
      const fullName = `${estudiante.nombre} ${estudiante.apellido}`;
      sendVerificationEmail({
        to: cleanCorreo,
        name: fullName,
        token: newToken,
      }).catch((err) => console.error('Error al reenviar verificación:', err));
      return res.status(200).json({
        status: 'success',
        message: 'Nuevo código de verificación enviado a su correo.',
      });
    }

    // Buscar en tutor
    const tutRes = await db.query(
      'SELECT id_tutor, nombre, apellido, correo, is_email_verified FROM tutor WHERE correo = $1',
      [cleanCorreo]
    );
    if (tutRes.rows.length > 0) {
      const tutor = tutRes.rows[0];
      if (tutor.is_email_verified) {
        return res.status(400).json({
          status: 'error',
          message: 'Este correo ya ha sido verificado.',
        });
      }
      const newToken = generateVerificationToken();
      await db.query(
        `UPDATE tutor SET verification_token = $1, token_created_at = NOW() WHERE id_tutor = $2`,
        [newToken, tutor.id_tutor]
      );
      const fullName = `${tutor.nombre} ${tutor.apellido}`;
      sendVerificationEmail({
        to: cleanCorreo,
        name: fullName,
        token: newToken,
      }).catch((err) => console.error('Error al reenviar verificación:', err));
      return res.status(200).json({
        status: 'success',
        message: 'Nuevo código de verificación enviado a su correo.',
      });
    }

    // No existe
    return res.status(404).json({
      status: 'error',
      message: 'No se encontró una cuenta con ese correo.',
    });
  } catch (error) {
    console.error('Error en resendVerificationToken:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error interno al reenviar código de verificación.',
    });
  }
};

module.exports = {
  loginUnified,
  resendVerificationToken,
};
