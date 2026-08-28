const express = require('express');
const router = express.Router();
const tutorController = require('../controllers/tutor.controller');

// Configuración de Horarios de Atención del Tutor
router.get('/schedule', tutorController.getSchedule);
router.put('/schedule', tutorController.upsertSchedule);

// Visualización de Sesiones Pendientes del Tutor

// Registro de Atención y Resumen de Tutoría

// Cancelación de Sesión por Parte del Tutor con Notificación por Correo

module.exports = router;