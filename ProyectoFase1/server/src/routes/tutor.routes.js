const express = require('express');
const router = express.Router();
const { loginTutor, getProfile } = require('../controllers/tutor');
const { verifyToken, isTutor } = require('../middlewares/auth');

// Ruta pública (HU-003)
router.post('/login', loginTutor);

// Ruta protegida de perfil de tutor
router.get('/profile', verifyToken, isTutor, getProfile);

module.exports = router;
