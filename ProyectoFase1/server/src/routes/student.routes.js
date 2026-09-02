const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const { getTutorCatalog, getTutorAvailability, createSession, searchTutors } = require('../controllers/student.controller');

router.get('/catalog', verifyToken, getTutorCatalog);
router.get('/catalog/search', verifyToken, searchTutors);
router.get('/tutor/:idTutor/availability', verifyToken, getTutorAvailability);
router.post('/sessions', verifyToken, createSession);

module.exports = router;