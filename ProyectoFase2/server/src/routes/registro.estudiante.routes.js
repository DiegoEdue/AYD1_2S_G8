const { Router } = require('express');
const router = Router();

const { registerStudent } = require('../controllers/registro.estudiante');

router.post('/register', registerStudent);

module.exports = router;
