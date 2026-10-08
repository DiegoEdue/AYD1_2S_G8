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
  updateStudentAdmin,
  updateTutorAdmin,
  getDenuncias,
  resolverDenuncia,
  getTutorRatings,
  getStudentRatings,
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

// HU-040: Gestión, Edición y Baja de Estudiantes Aprobados
router.get('/students/approved', getApprovedStudents);
router.put('/students/:id', updateStudentAdmin);
router.put('/students/:id/deactivate', deactivateStudent);

// HU-041: Gestión, Edición y Baja de Tutores Aprobados
router.get('/tutors/approved', getApprovedTutors);
router.put('/tutors/:id', updateTutorAdmin);
router.put('/tutors/:id/deactivate', deactivateTutor);

// HU-042 & HU-043: Moderación y Resolución de Denuncias
router.get('/denuncias', getDenuncias);
router.patch('/denuncias/:id/resolver', resolverDenuncia);

// HU-044 & HU-045: Reportes de Calificaciones y Satisfacción
router.get('/ratings/tutors', getTutorRatings);
router.get('/ratings/students', getStudentRatings);

// HU-046: Reportes Analíticos Generales
router.get('/reportes', getReports);

// Rutas adicionales de administración
router.get('/profile', getProfileAdmin);
router.get('/usuarios', getUsers);
router.patch('/usuarios/:id/dar-de-baja', deactivateUser);

module.exports = router;
