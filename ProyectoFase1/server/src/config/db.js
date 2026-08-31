const postgres = require('postgres');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || process.env.DB_URL;

// 1. Cliente postgres (para tagged template literals: sql`SELECT...` y sql.begin)
const sqlConfig = connectionString
  ? { ssl: 'require', max: 10, idle_timeout: 30 }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'secret',
      database: process.env.DB_NAME || 'educonnect',
      ...(process.env.DB_SSL === 'true' ? { ssl: 'require' } : {}),
    };

const sql = connectionString
  ? postgres(connectionString, sqlConfig)
  : postgres(sqlConfig);

// 2. Pool de pg (para db.query(text, params) y compatibilidad)
const poolConfig = connectionString
  ? {
      connectionString,
      ssl: { rejectUnauthorized: false },
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'secret',
      database: process.env.DB_NAME || 'educonnect',
      ...(process.env.DB_SSL === 'true' ? { ssl: { rejectUnauthorized: false } } : {}),
    };

const pool = new Pool(poolConfig);

pool.on('connect', () => {
  console.log('Conectado a la base de datos PostgreSQL (pg & postgres)');
});

pool.on('error', (err) => {
  console.error('Error inesperado en el cliente de PostgreSQL:', err);
});

// Adjuntar query y pool a sql para soportar ambos patrones de importación
sql.query = (text, params) => pool.query(text, params);
sql.pool = pool;

module.exports = sql;

