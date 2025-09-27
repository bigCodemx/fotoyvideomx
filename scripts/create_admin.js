// Uso: node scripts/create_admin.js adminuser password
const bcrypt = require('bcryptjs');
const db = require('../utils/db');

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) return console.log('Usage: node scripts/create_admin.js username password');
  const [username, password] = args;
  const hash = await bcrypt.hash(password, 10);
  const [res] = await db.query('INSERT INTO usuarios (username, password) VALUES (?, ?)', [username, hash]);
  console.log('Created admin id:', res.insertId);
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
