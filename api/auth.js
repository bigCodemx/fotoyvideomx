const express = require('express');
const router = express.Router();
const usuarios = require('../models/usuarios');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../utils/helpers');

// POST /api/auth/login
// Esta ruta intenta buscar el usuario en la base de datos y validar la contraseña.
// Si ocurre un error de conexión a la base de datos (ECONNREFUSED u otros errores de red/DB)
// devolvemos un 503 Service Unavailable con un mensaje claro para que el cliente
// pueda mostrar una leyenda explicativa al admin.
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
  try {
    const user = await usuarios.findByUsername(username);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = generateJWT({ id: user.id, username: user.username });
    res.json({ token });
  } catch (err) {
    // Detectar errores comunes de conexión a la BD (mysql2) o errores de red
    if (err && err.code && (err.code === 'ECONNREFUSED' || err.code === 'PROTOCOL_CONNECTION_LOST')) {
      console.error('Database connection error:', err);
      return res.status(503).json({ error: 'Database connection refused. Check DB_HOST/credentials and that MySQL is running.' });
    }
    // Para otros errores, registrar y devolver 500
    console.error('Auth error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
