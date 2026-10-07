const express = require('express');
const router = express.Router();
const { loginUnified, resendVerificationToken } = require('../controllers/auth');
const { registerStudent } = require('../controllers/registro.estudiante');
const { registroTutor } = require('../controllers/registro.tutor');
const { loginAdmin } = require('../controllers/admin');

// Ruta pública (HU-003)
router.post('/login', loginUnified);
router.post('/login/admin', loginAdmin);

// Reenviar código de verificación (HU-030)
router.post('/resend-verification', resendVerificationToken);

// Compatibilidad con rutas del cliente
router.post('/registro/estudiante', registerStudent);
router.post('/registro/tutor', registroTutor);

module.exports = router;
