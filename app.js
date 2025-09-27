require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas públicas y estáticos
// Archivos subidos por el admin/clientes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Assets del sitio (CSS/JS/IMG bajo /assets)
app.use('/assets', express.static(path.join(__dirname, 'assets')));
// Archivos de frontend específicos bajo /public (css/js usados por admin/clientes)
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));

// Rutas HTML limitadas: solo clientes.html y admin.html desde puerto 3000
const sendRoot = (file) => path.join(__dirname, file);
app.get('/clientes.html', (req, res) => res.sendFile(sendRoot('clientes.html')));
app.get('/admin.html', (req, res) => res.sendFile(sendRoot('admin.html')));

// Opcional: bloquear/avisar en otras rutas HTML
app.get(['/', '/index.html', '/portafolio.html', '/paquetes.html', '/reseñas.html', '/preguntas-frecuentes.html', '/acerca-de.html'], (req, res) => {
  res.status(404).send('Página no disponible en este puerto. Use http://fotoyvideomx.ddns.net/');
});

// API routes
const apiRouter = require('./api');
app.use('/api', apiRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
