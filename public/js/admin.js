const apiBase = '/api';
let token = null;

/**
 * Maneja el submit del formulario de login.
 * Muestra mensajes descriptivos en el contenedor #loginError según el código de respuesta:
 * - 400: campos faltantes
 * - 401: credenciales incorrectas
 * - 503: error de conexión a la base de datos
 * - 500: error del servidor
 * También captura errores de red (fetch) y los muestra.
 */
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errEl = document.getElementById('loginError');
  errEl.style.display = 'none';
  errEl.innerText = '';
  try {
    const res = await fetch(`${apiBase}/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    // Intentar parsear JSON si hay respuesta
    let data = {};
    try { data = await res.json(); } catch (parseErr) { /* ignore */ }

    if (res.ok) {
      token = data.token;
      document.getElementById('loginCard').style.display = 'none';
      document.getElementById('adminPanel').style.display = 'block';
      loadClients();
    } else {
      // Mostrar mensajes más claros según el status
      if (res.status === 400) errEl.innerText = data.error || 'Campos faltantes';
      else if (res.status === 401) errEl.innerText = 'Usuario o contraseña incorrectos';
      else if (res.status === 503) errEl.innerText = 'Error de conexión a la base de datos. Revise DB_HOST y que MySQL esté activo.';
      else if (res.status === 500) errEl.innerText = 'Error interno del servidor. Revisa los logs del servidor.';
      else errEl.innerText = data.error || `Error ${res.status}`;
      errEl.style.display = 'block';
      console.error('Login failed', res.status, data);
    }
  } catch (fetchErr) {
    // Errores de red: servidor no responde, CORS, etc.
    const errMsg = 'No se pudo conectar al servidor. Verifica que la API esté corriendo (npm start).';
    const errEl = document.getElementById('loginError');
    errEl.innerText = errMsg + ' Detalle: ' + (fetchErr.message || fetchErr);
    errEl.style.display = 'block';
    console.error('Fetch error on login:', fetchErr);
  }
});

document.getElementById('createClientForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('clientName').value;
  const email = document.getElementById('clientEmail').value;
  const res = await fetch(`${apiBase}/admin/clients`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ name, email })
  });
  const data = await res.json();
  if (res.ok) {
    alert('Cliente creado. Código: ' + data.code);
    loadClients();
  } else alert(data.error || 'Error');
});

document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const code = document.getElementById('uploadCode').value;
  const files = document.getElementById('filesInput').files;
  if (!files.length) return alert('Selecciona archivos');
  const form = new FormData();
  form.append('code', code);
  for (const f of files) form.append('files', f);
  const res = await fetch(`${apiBase}/admin/upload`, { method: 'POST', headers: { 'Authorization': 'Bearer ' + token }, body: form });
  const data = await res.json();
  if (res.ok) {
    document.getElementById('uploadStatus').innerText = 'Subida completada: ' + data.count;
    loadClients();
  } else document.getElementById('uploadStatus').innerText = data.error || 'Error';
});

document.getElementById('logoutBtn').addEventListener('click', () => { token = null; location.reload(); });

async function loadClients() {
  const res = await fetch(`${apiBase}/admin/clients`, { headers: { 'Authorization': 'Bearer ' + token } });
  const data = await res.json();
  if (!res.ok) return alert(data.error || 'Error');
  const container = document.getElementById('clientsList');
  container.innerHTML = '';
  data.forEach(c => {
    const div = document.createElement('div');
    div.className = 'd-flex justify-content-between align-items-center py-2 border-bottom';
    div.innerHTML = `<div><strong>${c.name}</strong><div class="text-muted">${c.email||''}</div><small class="text-muted">Código: ${c.code}</small></div>`;
    container.appendChild(div);
  });
}
