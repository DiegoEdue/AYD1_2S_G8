const express = require('express');
const cors = require('cors');
const tutorRoutes = require('./routes/tutor.routes')
const app = express();
const pool = require('./config/db')

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.use('/api/tutors', tutorRoutes);

// Ruta base de prueba
app.get('/api/health', (req, res) => {
  //res.status(200).json({ status: 'ok', message: 'EduConnect API en ejecución' });
  try { // probando la conexion a la base de datos
    pool.query('SELECT NOW()', (err, result) => {
      if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return res.status(500).json({ status: 'error', message: 'Error al conectar a la base de datos' });
      }
      res.status(200).json({ status: 'ok', message: 'EduConnect API en ejecución', dbTime: result.rows[0].now });
    });
    
  }catch (error) {
    console.error('Error en la ruta de prueba:', error);
    res.status(500).json({ status: 'error', message: 'Error en la ruta de prueba' });
  }
});

module.exports = app;