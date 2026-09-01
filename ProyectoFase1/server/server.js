require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`ERROR: El puerto ${PORT} ya está siendo utilizado por otro proceso`);
  } else {
    console.error('Error al iniciar el servidor:', err);
  }
});