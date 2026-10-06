const { Router } = require('express');
const router = Router();
const multer = require('multer');

const { registerStudent } = require('../controllers/registro.estudiante');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/register', upload.fields([
  { name: 'foto', maxCount: 1 },
  { name: 'carnet_pdf', maxCount: 1 }
]), registerStudent);

module.exports = router;
