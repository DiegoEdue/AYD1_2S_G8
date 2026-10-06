const express = require('express');
const router = express.Router();
const { loginTutor, getProfile } = require('../controllers/tutor');
const { verifyToken, isTutor } = require('../middlewares/auth');
const tutorController = require('../controllers/tutor.controller');

// Ruta pública (HU-003) - Debe ir antes del middleware de autenticación
router.post('/login', loginTutor);

// Middleware de autenticación para las siguientes rutas protegidas de tutor
router.use(verifyToken, isTutor);

// Ruta protegida de perfil de tutor
router.get('/profile', getProfile);

// Configuración de Horarios de Atención del Tutor
router.get('/schedule', tutorController.getSchedule);
router.put('/schedule', tutorController.upsertSchedule);

// Visualización de Sesiones Pendientes del Tutor
router.get('/sessions/pending', tutorController.getPendingSessions);

// Registro de Atención y Resumen de Tutoría
router.patch('/sessions/:id/attend', tutorController.attendSession);
router.get('/sessions/:id/detail', tutorController.getSessionDetails);

// Cancelación de Sesión por Parte del Tutor con Notificación por Correo
router.patch('/sessions/:id/cancel', tutorController.cancelSession);

// Historial de Sesiones del Tutor
router.get('/sessions/history', tutorController.getHistorySessions);

// Actualización de Perfil del Tutor
router.patch('/profile', tutorController.updateProfile);

module.exports = router;
