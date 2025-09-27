// Determinar base de la API y origen para uploads
const defaultApiBase = '/api';
let apiBase = defaultApiBase;
if (location.protocol === 'file:') {
  // Si se abre desde file://, usar el host remoto conocido (fallback para producción)
  apiBase = 'http://fotoyvideomx.ddns.net:3000/api';
}
function getUploadsBaseFromApi(base) {
  try { return new URL(base, window.location.origin).origin; }
  catch { return window.location.origin; }
}
const uploadsBase = getUploadsBaseFromApi(apiBase);

function getOrCreateErrorEl() {
  let errEl = document.getElementById('clientError');
  if (!errEl) {
    errEl = document.createElement('div');
    errEl.id = 'clientError';
    errEl.className = 'text-danger mt-3';
    errEl.style.display = 'none';
    const form = document.getElementById('codeForm');
    form.parentNode.appendChild(errEl);
  }
  return errEl;
}

document.getElementById('codeForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const code = document.getElementById('clientCode').value.trim();
  if (!code) return;

  const errEl = getOrCreateErrorEl();
  errEl.style.display = 'none';
  errEl.innerText = '';

  try {
    const res = await fetch(`${apiBase}/clientes/${encodeURIComponent(code)}`);

    // Intentar parsear JSON si existe
    let data = {};
    try { data = await res.json(); } catch (_) { /* ignore parse error */ }

    if (!res.ok) {
      // Mensajes claros según código de estado
      if (res.status === 404) errEl.innerText = data.error || 'Código inválido o sin archivos.';
      else if (res.status === 503) errEl.innerText = 'Error de conexión a la base de datos. Verifica DB_HOST/credenciales y que MySQL esté activo.';
      else if (res.status === 500) errEl.innerText = 'Error interno del servidor. Revisa los logs del backend.';
      else errEl.innerText = data.error || `Error ${res.status}`;
      errEl.style.display = 'block';
      return;
    }

    // Éxito: renderizar galería
    document.getElementById('clientTitle').innerText = data.client.name + ' — Archivos';
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';
    (data.files || []).forEach(f => {
      const col = document.createElement('div');
      col.className = 'col-md-4 gallery-item';
      let media = '';
      if (f.mimetype && f.mimetype.startsWith('image')) {
        media = `<img src="${uploadsBase}/uploads/${f.filename}" alt="${f.original_name}">`;
      } else {
        media = `<video controls src="${uploadsBase}/uploads/${f.filename}"></video>`;
      }
      col.innerHTML = `<div class="card p-2">${media}<div class="mt-2 d-flex justify-content-between align-items-center"><small>${f.original_name || ''}</small><div><a class="btn btn-sm btn-outline-primary me-2" href="${uploadsBase}/uploads/${f.filename}" download>Descargar</a></div></div></div>`;
      gallery.appendChild(col);
    });
    document.getElementById('galleryArea').style.display = 'block';

    document.getElementById('downloadAllBtn').onclick = () => {
      window.location = `${apiBase}/clientes/${encodeURIComponent(code)}/download`;
    };
  } catch (fetchErr) {
    // Errores de red: servidor caído, CORS, abrir HTML sin servidor, etc.
    const hint = (location.protocol === 'file:')
      ? 'Abre la página vía http://localhost:3000/clientes.html o levanta el servidor con npm start.'
      : 'Verifica que el backend esté corriendo (npm start) y accesible.';
    errEl.innerText = `No se pudo conectar al servidor. ${hint} Detalle: ${fetchErr.message || fetchErr}`;
    errEl.style.display = 'block';
    console.error('Fetch error on clientes:', fetchErr);
  }
});
