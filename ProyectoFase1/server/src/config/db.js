const postgres = require('postgres');

const sql = postgres(process.env.DATABASE_URL, {
  ssl: 'require',
  max: 10,
  idle_timeout: 30,
});

module.exports = sql;
