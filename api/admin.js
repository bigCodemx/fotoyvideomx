const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../utils/helpers');
const { generateCode } = require('../utils/helpers');
const clientesModel = require('../models/clientes');
const archivosModel = require('../models/archivos');
const pool = require('../utils/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, uploadDir); },
  filename: function (req, file, cb) { const name = Date.now() + '_' + file.originalname.replace(/\s+/g,'_'); cb(null, name); }
});
const upload = multer({ storage });

// POST /api/admin/clients -> crear cliente
router.post('/clients', authMiddleware, async (req, res) => {
  const { name, email } = req.body;
  if (!name) return res.status(400).json({ error: 'Missing name' });
  try {
    const code = generateCode(8);
    const id = await clientesModel.createCliente(name, email, code);
    res.json({ id, code });
  } catch (err) {
    console.error(err); res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/admin/clients -> listar (protegido)
router.get('/clients', authMiddleware, async (req, res) => {
  try {
    const rows = await clientesModel.getAllClientes();
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

// POST /api/admin/upload -> subir archivos y asociar por code
router.post('/upload', authMiddleware, upload.array('files', 50), async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Missing code' });
  try {
    const client = await clientesModel.findByCode(code);
    if (!client) return res.status(404).json({ error: 'Cliente no encontrado' });
    const files = req.files || [];
    for (const f of files) {
      await archivosModel.addArchivo(client.id, f.filename, f.originalname, f.mimetype, f.size);
    }
    res.json({ count: files.length });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;
