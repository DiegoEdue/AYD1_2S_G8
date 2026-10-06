const { Router } = require('express');
const router = Router();

const { registroTutor } = require('../controllers/registro.tutor');

router.post('/registro', registroTutor);

module.exports = router;
