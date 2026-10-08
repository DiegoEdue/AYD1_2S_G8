const express = require('express');
const router = express.Router();
const {
  loginAdmin,
  verify2fa,
  getProfileAdmin,
  getUsers,
  deactivateUser,
  getReports,
  getPendingStudents,
  approveStudent,
  rejectStudent,
  getApprovedStudents,
  deactivateStudent,
  getApprovedTutors,
  deactivateTutor,
  streamDocumento,
  getStudentDocument,
  getTutorDocument,
} = require('../controllers/admin');
const { verifyToken, isAdmin } = require('../middlewares/auth');

// Ruta pública de login de administrador (con setup/verify de 2FA)
router.post('/login', loginAdmin);

// Ruta pública para validar el código TOTP y emitir el token
router.post('/verify-2fa', verify2fa);

// Ruta para transmisión de documento PDF en línea (acceso con token en query opcionalmente)
router.get('/documento/stream', streamDocumento);

router.use(verifyToken, isAdmin);

// HU-005: Solicitudes pendientes de estudiantes y tutores
router.get('/students/pending', getPendingStudents);
router.get('/solicitudes', getPendingStudents);
router.put('/students/:id/approve', approveStudent);
router.put('/students/:id/reject', rejectStudent);
router.patch('/solicitudes/:id/aprobar', approveStudent);
router.patch('/solicitudes/:id/rechazar', rejectStudent);

// HU-038: URL segura del PDF del carnet del estudiante (visor embebido)
router.get('/students/:id/documento', getStudentDocument);

// HU-039: URL segura del PDF del CV del tutor (visor embebido)
router.get('/tutors/:id/documento', getTutorDocument);

// HU: Gestión y Baja de Estudiantes Aprobados
router.get('/students/approved', getApprovedStudents);
router.put('/students/:id/deactivate', deactivateStudent);

// HU: Gestión y Baja de Tutores Aprobados
router.get('/tutors/approved', getApprovedTutors);
router.put('/tutors/:id/deactivate', deactivateTutor);

// Rutas adicionales de administración
router.get('/profile', getProfileAdmin);
router.get('/usuarios', getUsers);
router.patch('/usuarios/:id/dar-de-baja', deactivateUser);
router.get('/reportes', getReports);

module.exports = router;
