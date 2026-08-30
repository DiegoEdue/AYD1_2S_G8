const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const { getTutorCatalog, getTutorAvailability, createSession } = require('../controllers/student.controller');

router.get('/catalog', authenticate, getTutorCatalog);
router.get('/tutor/:idTutor/availability', authenticate, getTutorAvailability);
router.post('/sessions', authenticate, createSession);

module.exports = router;
