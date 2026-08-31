const { loginEstudiante } = require('./estudiante');
const { loginTutor } = require('./tutor');
const db = require('../config/db');

/**
 * Endpoint de Login Unificado (HU-003)
 * Busca el correo tanto en Estudiante como en Tutor.
 */
const loginUnified = async (req, res) => {
  try {
    const { correo, password } = req.body || {};

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

module.exports = {
  loginUnified,
};
