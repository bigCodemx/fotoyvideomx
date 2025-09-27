const db = require('../utils/db');

async function createCliente(name, email, code) {
  const [result] = await db.query('INSERT INTO clientes (name, email, code) VALUES (?, ?, ?)', [name, email, code]);
  return result.insertId;
}

async function findByCode(code) {
  const [rows] = await db.query('SELECT * FROM clientes WHERE code = ?', [code]);
  return rows[0];
}

async function getAllClientes() {
  const [rows] = await db.query('SELECT * FROM clientes');
  return rows;
}

module.exports = { createCliente, findByCode, getAllClientes };
