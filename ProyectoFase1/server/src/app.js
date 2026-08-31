const express = require('express');
const cors = require('cors');
const registerStudent = require('./routes/registro.estudiante.routes');
const registerTutor = require('./routes/registro.tutor.routes');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/student', registerStudent);
app.use('/api/tutor', registerTutor);

// Ruta base de prueba
app.get('/api/health', (req, res) => {
  res
    .status(200)
    .json({ status: 'ok', message: 'EduConnect API en ejecución' });
});

module.exports = app;
