const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const { getTutorCatalog, getTutorAvailability } = require('../controllers/student.controller');

router.get('/catalog', authenticate, getTutorCatalog);
router.get('/tutor/:idTutor/availability', authenticate, getTutorAvailability);

module.exports = router;
