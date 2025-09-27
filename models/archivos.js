const db = require('../utils/db');

async function addArchivo(cliente_id, filename, original_name, mimetype, size) {
  const [result] = await db.query(
    'INSERT INTO archivos (cliente_id, filename, original_name, mimetype, size) VALUES (?, ?, ?, ?, ?)',
    [cliente_id, filename, original_name, mimetype, size]
  );
  return result.insertId;
}

async function getByClienteId(cliente_id) {
  const [rows] = await db.query('SELECT * FROM archivos WHERE cliente_id = ?', [cliente_id]);
  return rows;
}

module.exports = { addArchivo, getByClienteId };
