const db = require('../config/db');
const { comparePassword } = require('../utils/bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middlewares/auth');

const loginEstudiante = async (req, res) => {
  try {
    const { correo, password, token } = req.body || {};

    if (!correo || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor, ingrese correo y contraseña.',
      });
    }

    const result = await db.query(
      'SELECT * FROM estudiante WHERE correo = $1',
      [correo.trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'Correo o contraseña incorrectos',
      });
    }

    const estudiante = result.rows[0];

    const isValidPassword = await comparePassword(password, estudiante.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        status: 'error',
        message: 'Correo o contraseña incorrectos',
      });
    }

    if (estudiante.estado_aprobacion === 'pendiente') {
      return res.status(403).json({
        status: 'error',
        message: 'Su cuenta está pendiente de aprobación',
      });
    }

    if (estudiante.estado_aprobacion === 'rechazado') {
      return res.status(403).json({
        status: 'error',
        message: 'Su cuenta ha sido rechazada por el administrador',
      });
    }

    if (estudiante.estado_aprobacion === 'baja') {
      return res.status(403).json({
        status: 'error',
        message: 'Su cuenta ha sido dada de baja por el administrador',
      });
    }

    if (estudiante.estado_aprobacion !== 'aprobado') {
      return res.status(403).json({
        status: 'error',
        message: 'No cuenta con autorización para acceder al sistema.',
      });
    }

    // Validar token de verificación en primer inicio de sesión
    if (!estudiante.is_email_verified) {
      if (!token) {
        return res.status(400).json({
          status: 'error',
          message: 'Se requiere token de verificación para el primer inicio de sesión',
          requiresToken: true,
        });
      }

      if (estudiante.verification_token !== token) {
        return res.status(401).json({
          status: 'error',
          message: 'Token de verificación inválido',
        });
      }

      // Verificar expiración del token (24 horas)
      const tokenCreatedAt = new Date(estudiante.token_created_at).getTime();
      const now = Date.now();
      const hoursDiff = (now - tokenCreatedAt) / (1000 * 60 * 60);
      
      if (hoursDiff > 24) {
        return res.status(401).json({
          status: 'error',
          message: 'Token de verificación expirado (24 horas)',
        });
      }

      // Marcar email como verificado y limpiar token
      await db.query(
        'UPDATE estudiante SET is_email_verified = TRUE, verification_token = NULL, token_created_at = NULL WHERE id_estudiante = $1',
        [estudiante.id_estudiante]
      );
    }

    const payload = {
      id: estudiante.id_estudiante,
      correo: estudiante.correo,
      rol: 'estudiante',
      nombre: estudiante.nombre,
      apellido: estudiante.apellido,
    };

    const jwtToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

    const { password_hash, ...estudianteData } = estudiante;

    return res.status(200).json({
      status: 'success',
      message: 'Inicio de sesión exitoso',
      token: jwtToken,
      user: {
        ...estudianteData,
        rol: 'estudiante',
      },
    });
  } catch (error) {
    console.error('Error en loginEstudiante:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor al procesar el inicio de sesión.',
    });
  }
};

const getProfileEstudiante = async (req, res) => {
  try {
    const estudianteId = req.user.id;

    const result = await db.query(
      'SELECT id_estudiante, nombre, apellido, carnet, genero, direccion, telefono, fecha_nacimiento, foto_url, correo, estado_aprobacion, fecha_registro FROM estudiante WHERE id_estudiante = $1',
      [estudianteId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Estudiante no encontrado',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        ...result.rows[0],
        rol: 'estudiante',
      },
    });
  } catch (error) {
    console.error('Error en getProfileEstudiante:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error interno al obtener perfil del estudiante.',
    });
  }
};

module.exports = {
  loginEstudiante,
  getProfileEstudiante,
};
