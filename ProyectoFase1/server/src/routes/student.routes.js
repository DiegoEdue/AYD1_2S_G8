const express = require('express');
const router = express.Router();
const { verifyToken, isEstudiante } = require('../middlewares/auth');
const {
  getTutorCatalog,
  getTutorAvailability,
  createSession,
  getActiveSessions,
  getSessionHistory,
  cancelSession,
} = require('../controllers/student.controller');

router.get('/catalog', verifyToken, isEstudiante, getTutorCatalog);
router.get('/tutor/:idTutor/availability', verifyToken, isEstudiante, getTutorAvailability);
router.post('/sessions', verifyToken, isEstudiante, createSession);
router.get('/sessions/active', verifyToken, isEstudiante, getActiveSessions);
router.get('/sessions/history', verifyToken, isEstudiante, getSessionHistory);
router.patch('/sessions/:id/cancel', verifyToken, isEstudiante, cancelSession);

module.exports = router;
