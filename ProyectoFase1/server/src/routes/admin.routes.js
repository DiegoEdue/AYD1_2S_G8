const express = require('express');
const router = express.Router();
const { loginAdmin, verify2fa, getProfileAdmin } = require('../controllers/admin');
const { verifyToken, isAdmin } = require('../middlewares/auth');

// Ruta pública de login de administrador (con setup/verify de 2FA)
router.post('/login', loginAdmin);

// Ruta pública para validar el código TOTP y emitir el token
router.post('/verify-2fa', verify2fa);

// Ruta protegida de perfil de administrador
router.get('/profile', verifyToken, isAdmin, getProfileAdmin);

module.exports = router;
