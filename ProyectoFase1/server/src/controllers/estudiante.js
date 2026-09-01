const db = require('../config/db');
const { comparePassword } = require('../utils/bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middlewares/auth');


const loginEstudiante = async (req, res) => {
  try {
    const { correo, password } = req.body || {};

    if (!correo || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor, ingrese correo y contraseña.',
      });
    }

    // Buscar estudiante por correo
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

    // Validar contraseña
    const isValidPassword = await comparePassword(password, estudiante.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        status: 'error',
        message: 'Correo o contraseña incorrectos',
      });
    }

    // Validar estado de aprobación
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

    // Generar token JWT
    const payload = {
      id: estudiante.id_estudiante,
      correo: estudiante.correo,
      rol: 'estudiante',
      nombre: estudiante.nombre,
      apellido: estudiante.apellido,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

    // Excluir password_hash de los datos devueltos
    const { password_hash, ...estudianteData } = estudiante;

    return res.status(200).json({
      status: 'success',
      message: 'Inicio de sesión exitoso',
      token,
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
