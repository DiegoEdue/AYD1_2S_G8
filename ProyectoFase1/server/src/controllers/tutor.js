const db = require('../config/db');
const { comparePassword } = require('../utils/bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middlewares/auth');

const loginTutor = async (req, res) => {
  try {
    const { correo, password } = req.body || {};

    if (!correo || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor, ingrese correo y contraseña.',
      });
    }

    // Buscar tutor por correo
    const result = await db.query(
      'SELECT * FROM tutor WHERE correo = $1',
      [correo.trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'Correo o contraseña incorrectos',
      });
    }

    const tutor = result.rows[0];

    // Validar contraseña
    const isValidPassword = await comparePassword(password, tutor.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        status: 'error',
        message: 'Correo o contraseña incorrectos',
      });
    }

    // Validar estado de aprobación
    if (tutor.estado_aprobacion === 'pendiente') {
      return res.status(403).json({
        status: 'error',
        message: 'Su cuenta está pendiente de aprobación',
      });
    }

    if (tutor.estado_aprobacion === 'rechazado') {
      return res.status(403).json({
        status: 'error',
        message: 'Su cuenta ha sido rechazada por el administrador',
      });
    }

    if (tutor.estado_aprobacion === 'baja') {
      return res.status(403).json({
        status: 'error',
        message: 'Su cuenta ha sido dada de baja por el administrador',
      });
    }

    if (tutor.estado_aprobacion !== 'aprobado') {
      return res.status(403).json({
        status: 'error',
        message: 'No cuenta con autorización para acceder al sistema.',
      });
    }

    // Generar token JWT
    const payload = {
      id: tutor.id_tutor,
      correo: tutor.correo,
      rol: 'tutor',
      nombre: tutor.nombre,
      apellido: tutor.apellido,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

    // Excluir password_hash de los datos devueltos
    const { password_hash, ...tutorData } = tutor;

    return res.status(200).json({
      status: 'success',
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        ...tutorData,
        rol: 'tutor',
      },
    });
  } catch (error) {
    console.error('Error en loginTutor:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor al procesar el inicio de sesión.',
    });
  }
};

/**
 * Obtener perfil del tutor autenticado (HU-016 / Auxiliar)
 */
const getProfile = async (req, res) => {
  try {
    const tutorId = req.user.id;

    const result = await db.query(
      'SELECT id_tutor, nombre, apellido, carnet_id, fecha_nacimiento, genero, direccion, telefono, foto_url, numero_identificacion_tutor, direccion_tutoria, correo, anio_inicio_tutorias, universidad_graduacion, estado_aprobacion, hora_inicio_atencion, hora_fin_atencion, fecha_registro FROM tutor WHERE id_tutor = $1',
      [tutorId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Tutor no encontrado',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        ...result.rows[0],
        rol: 'tutor',
      },
    });
  } catch (error) {
    console.error('Error en getProfile:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error interno al obtener perfil del tutor.',
    });
  }
};

module.exports = {
  loginTutor,
  getProfile,
};
