const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'neondb_owner',
    host: process.env.DB_HOST || 'ep-wild-dawn-a5u5yfvw-pooler.us-east-2.aws.neon.tech',
    database: process.env.DB_NAME || 'neondb',
    password: process.env.DB_PASSWORD || 'npg_w2sNouanq6Rr',
    port: process.env.DB_PORT || 5432,
    ssl: {
        rejectUnauthorized: false // Esto permite conexiones SSL sin verificar el certificado
    }
});

module.exports = pool;