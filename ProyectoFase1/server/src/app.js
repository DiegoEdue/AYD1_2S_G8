const express = require('express');
const cors = require('cors');
const tutorRoutes = require('./routes/tutor.routes')
const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.use('/api/tutors', tutorRoutes);

// Ruta base de prueba
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'EduConnect API en ejecución' });
});

module.exports = app;