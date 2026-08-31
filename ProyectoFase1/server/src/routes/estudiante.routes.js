const express = require('express');
const router = express.Router();
const { loginEstudiante, getProfileEstudiante } = require('../controllers/estudiante');
const { verifyToken, isEstudiante } = require('../middlewares/auth');

// Ruta pública (HU-003)
router.post('/login', loginEstudiante);

// Ruta protegida de perfil de estudiante
router.get('/profile', verifyToken, isEstudiante, getProfileEstudiante);

module.exports = router;
