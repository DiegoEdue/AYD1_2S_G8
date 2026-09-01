const express = require('express');
const cors = require('cors');

// Rutas de estudiantes (HU-017, HU-019, HU-020)
const studentRoutes = require('./routes/student.routes');

const db = require('./config/db');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta base de prueba y diagnóstico de base de datos
app.get('/api/health', async (req, res) => {
  try {
    const dbResult = await db.query('SELECT NOW() as db_time');
    res.status(200).json({
      status: 'ok',
      message: 'EduConnect API en ejecución',
      database: {
        connected: true,
        provider: 'Neon PostgreSQL (Cloud)',
        server_time: dbResult.rows[0].db_time,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'EduConnect API en ejecución pero con error de conexión a Base de Datos',
      error: error.message,
    });
  }
});


// Rutas del sistema
app.use('/api/students', studentRoutes);

module.exports = app;