const express = require('express');
const cors = require('cors');
const sql = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', async (req, res) => {
  try {
    await sql`SELECT 1`;
    res.status(200).json({ status: 'ok', message: 'EduConnect API en ejecución' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.get('/api/db/tables', async (req, res) => {
  try {
    const result = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`;
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const studentRoutes = require('./routes/student.routes');
app.use('/api/students', studentRoutes);

module.exports = app;
