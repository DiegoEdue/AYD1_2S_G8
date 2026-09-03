const express = require('express');
const router = express.Router();
const { loginAdmin, verify2fa, getProfileAdmin, getUsers, deactivateUser, getReports } = require('../controllers/admin');
const { verifyToken, isAdmin } = require('../middlewares/auth');
const {
  getPendingStudents,
  approveStudent,
  rejectStudent,
} = require('../controllers/admin');


// Ruta pública de login de administrador (con setup/verify de 2FA)
router.post('/login', loginAdmin);

// Ruta pública para validar el código TOTP y emitir el token
router.post('/verify-2fa', verify2fa);

router.use(verifyToken, isAdmin);

router.get('/students/pending', getPendingStudents);
router.get('/solicitudes', getPendingStudents);
router.put('/students/:id/approve', approveStudent);
router.put('/students/:id/reject', rejectStudent);
router.patch('/solicitudes/:id/aprobar', approveStudent);
router.patch('/solicitudes/:id/rechazar', rejectStudent);

// Ruta protegida de perfil de administrador
router.get('/profile', getProfileAdmin);
router.get('/usuarios', getUsers);
router.patch('/usuarios/:id/dar-de-baja', deactivateUser);
router.get('/reportes', getReports);

module.exports = router;
