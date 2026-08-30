const express = require('express');
const router = express.Router();
const tutorController = require('../controllers/tutor.controller');

// se espera que el token del tutor

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