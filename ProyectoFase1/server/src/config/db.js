const postgres = require('postgres');
const dotenv = require('dotenv');

const sql = postgres(process.env.DATABASE_URL, {
  ssl: 'require', // enable SSL for secure connections
  max: 10, // maximum number of connections in the pool
  idle_timeout: 30, // idle timeout in seconds
});

module.exports = sql;
