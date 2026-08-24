const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta base de prueba
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'EduConnect API en ejecución' });
});

module.exports = app;