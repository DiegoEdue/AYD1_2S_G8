const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const { getTutorCatalog, getTutorAvailability, createSession, searchTutors, getActiveSessions, cancelSession, getSessionHistory, getStudentProfile, updateStudentProfile } = require('../controllers/student.controller');

router.get('/catalog', verifyToken, getTutorCatalog);
router.get('/catalog/search', verifyToken, searchTutors);
router.get('/tutor/:idTutor/availability', verifyToken, getTutorAvailability);
router.get('/sessions/active', verifyToken, getActiveSessions);
router.get('/sessions/history', verifyToken, getSessionHistory);
router.post('/sessions', verifyToken, createSession);
router.patch('/sessions/:id/cancel', verifyToken, cancelSession);
router.get('/profile', verifyToken, getStudentProfile);
router.put('/profile', verifyToken, updateStudentProfile);

module.exports = router;