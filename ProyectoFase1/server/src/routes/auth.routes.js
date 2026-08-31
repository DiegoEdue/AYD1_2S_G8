const express = require('express');
const router = express.Router();
const { loginUnified } = require('../controllers/auth');

// Ruta pública (HU-003)
router.post('/login', loginUnified);

module.exports = router;
