const express = require('express');
const cors = require('cors');

// Rutas de registro (develop)
const registerStudent = require('./routes/registro.estudiante.routes');
const registerTutor = require('./routes/registro.tutor.routes');

// Rutas de autenticación y perfil (HU-003)
const tutorRoutes = require('./routes/tutor.routes');
const estudianteRoutes = require('./routes/estudiante.routes');
const authRoutes = require('./routes/auth.routes');

const db = require('./config/db');

const app = express();
const pool = require('./config/db')

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
app.use('/api/student', registerStudent);
app.use('/api/tutor', registerTutor);
app.use('/api/tutor', tutorRoutes);
app.use('/api/estudiante', estudianteRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;
