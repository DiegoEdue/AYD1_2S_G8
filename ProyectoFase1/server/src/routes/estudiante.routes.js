const express = require('express');
const router = express.Router();
const { loginEstudiante } = require('../controllers/estudiante');

// Ruta pública (HU-003)
router.post('/login', loginEstudiante);

module.exports = router;
