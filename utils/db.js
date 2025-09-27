const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'lfotoyvideomx.ddns.net',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'HKivan33',
  database: process.env.DB_NAME || 'fotoyvideomx',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
