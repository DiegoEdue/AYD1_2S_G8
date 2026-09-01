const express = require('express');
const router = express.Router();
const { loginTutor, getProfile } = require('../controllers/tutor');
const { verifyToken, isTutor } = require('../middlewares/auth');
const tutorController = require('../controllers/tutor.controller');

// Algunas rutas utilizan la autenticación de tutor
router.use(verifyToken, isTutor);

// Ruta pública (HU-003)
router.post('/login', loginTutor);

// Ruta protegida de perfil de tutor
router.get('/profile', verifyToken, isTutor, getProfile);

// Configuración de Horarios de Atención del Tutor
router.get('/schedule', tutorController.getSchedule);
router.put('/schedule', tutorController.upsertSchedule);

// Visualización de Sesiones Pendientes del Tutor
router.get('/sessions/pending', tutorController.getPendingSessions)

// Registro de Atención y Resumen de Tutoría
router.patch('/sessions/:id/attend', tutorController.attendSession);

// Cancelación de Sesión por Parte del Tutor con Notificación por Correo
router.patch('/sessions/:id/cancel', tutorController.cancelSession);

module.exports = router;