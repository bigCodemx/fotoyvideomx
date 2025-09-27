const crypto = require('crypto');
const jwt = require('jsonwebtoken');

function generateCode(len = 8) {
  return crypto.randomBytes(Math.ceil(len / 2)).toString('hex').slice(0, len).toUpperCase();
}

function generateJWT(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || 'change_this_secret', { expiresIn: '8h' });
}

function verifyJWT(token) {
  return jwt.verify(token, process.env.JWT_SECRET || 'change_this_secret');
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  const parts = authHeader.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'Invalid token' });
  const token = parts[1];
  try {
    const decoded = verifyJWT(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { generateCode, generateJWT, verifyJWT, authMiddleware };
