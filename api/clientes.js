const express = require('express');
const router = express.Router();
const clientesModel = require('../models/clientes');
const archivosModel = require('../models/archivos');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

// GET /api/clientes/:code -> retorna cliente y lista de archivos
router.get('/:code', async (req, res) => {
  const { code } = req.params;
  try {
    const client = await clientesModel.findByCode(code);
    if (!client) return res.status(404).json({ error: 'Código inválido' });
    const files = await archivosModel.getByClienteId(client.id);
    res.json({ client, files });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

// GET /api/clientes/:code/download -> zip de todos los archivos
router.get('/:code/download', async (req, res) => {
  const { code } = req.params;
  try {
    const client = await clientesModel.findByCode(code);
    if (!client) return res.status(404).json({ error: 'Código inválido' });
    const files = await archivosModel.getByClienteId(client.id);
    if (!files.length) return res.status(404).json({ error: 'No hay archivos' });
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="${client.code}_files.zip"`);
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.on('error', err => { throw err; });
    archive.pipe(res);
    for (const f of files) {
      const filePath = path.join(__dirname, '..', 'uploads', f.filename);
      if (fs.existsSync(filePath)) archive.file(filePath, { name: f.original_name || f.filename });
    }
    archive.finalize();
  } catch (err) { console.error(err); if (!res.headersSent) res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;
