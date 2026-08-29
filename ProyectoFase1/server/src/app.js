const express = require('express');
const cors = require('cors');
const { pool } = require('./config/db');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta base de prueba
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'EduConnect API en ejecución' });
});

// Ver tablas de la BD
app.get('/api/db/tables', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`
    );
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Rutas
const studentRoutes = require('./routes/student.routes');
app.use('/api/students', studentRoutes);

module.exports = app;