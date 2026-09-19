const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'educonnect_secret_key';

/**
 * Middleware para verificar si la petición incluye un Token JWT válido.
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  if (!authHeader) {
    return res.status(401).json({
      status: 'error',
      message: 'Acceso no autorizado. No se proporcionó un token.',
    });
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Token inválido o expirado.',
    });
  }
};

/**
 * Middleware para verificar que el usuario tenga rol de Tutor.
 */
const isTutor = (req, res, next) => {
  if (!req.user || req.user.rol !== 'tutor') {
    return res.status(403).json({
      status: 'error',
      message: 'Acceso denegado. Se requiere rol de Tutor.',
    });
  }
  next();
};

/**
 * Middleware para verificar que el usuario tenga rol de Estudiante.
 */
const isEstudiante = (req, res, next) => {
  if (!req.user || req.user.rol !== 'estudiante') {
    return res.status(403).json({
      status: 'error',
      message: 'Acceso denegado. Se requiere rol de Estudiante.',
    });
  }
  next();
};

/**
 * Middleware para verificar que el usuario tenga rol de Administrador.
 */
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.rol !== 'admin') {
    return res.status(403).json({
      status: 'error',
      message: 'Acceso denegado. Se requiere rol de Administrador.',
    });
  }
  next();
};

module.exports = {
  verifyToken,
  isTutor,
  isEstudiante,
  isAdmin,
  JWT_SECRET,
};
