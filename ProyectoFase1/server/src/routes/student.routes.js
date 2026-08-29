const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const { getTutorCatalog } = require('../controllers/student.controller');

router.get('/catalog', authenticate, getTutorCatalog);

module.exports = router;
