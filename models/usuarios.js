const db = require('../utils/db');

async function findByUsername(username) {
  const [rows] = await db.query('SELECT * FROM usuarios WHERE username = ?', [username]);
  return rows[0];
}

async function createUsuario(username, passwordHash) {
  const [result] = await db.query('INSERT INTO usuarios (username, password) VALUES (?, ?)', [username, passwordHash]);
  return result.insertId;
}

module.exports = { findByUsername, createUsuario };
