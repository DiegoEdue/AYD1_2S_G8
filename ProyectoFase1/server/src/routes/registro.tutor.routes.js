const { Router } = require('express');
const router = Router();
const multer = require('multer');

const { registroTutor } = require('../controllers/registro.tutor');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/registro', upload.fields([
  { name: 'foto', maxCount: 1 },
  { name: 'cv_pdf', maxCount: 1 }
]), registroTutor);

module.exports = router;
