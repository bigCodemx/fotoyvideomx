// Efectos JS para Foto&VideoMX
// Animación de scroll suave
window.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if(target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});

// Efecto de navbar al hacer scroll
window.addEventListener('scroll', function() {
  const nav = document.querySelector('.navbar');
  if(window.scrollY > 50) {
    nav.classList.add('shadow');
  } else {
    nav.classList.remove('shadow');
  }
});

// Puedes agregar más efectos JS aquí para galerías, acordeón, etc.

// Forzar que el enlace "Clientes" del menú apunte a la URL con host:puerto correctos
// e inyectar el ítem si no existe.
window.addEventListener('DOMContentLoaded', function() {
  try {
    const desiredHost = 'fotoyvideomx.ddns.net:3000';
    const isDesiredHost = window.location.host === desiredHost;
    const desiredUrl = 'http://' + desiredHost + '/clientes.html';

    // Encontrar enlaces en el menú
    const nav = document.querySelector('.navbar .navbar-nav');
    if (nav) {
      const links = nav.querySelectorAll('a');
      let clientesLinkFound = false;
      links.forEach(a => {
        const href = (a.getAttribute('href') || '').trim();
        const text = (a.textContent || '').trim().toLowerCase();
        if (href.endsWith('clientes.html') || text === 'clientes') {
          clientesLinkFound = true;
          if (!isDesiredHost) {
            a.setAttribute('href', desiredUrl);
            a.setAttribute('target', '_self');
          }
        }
      });
      // Si no existe el enlace, inyectarlo al final del menú
      if (!clientesLinkFound) {
        const li = document.createElement('li');
        li.className = 'nav-item';
        const a = document.createElement('a');
        a.className = 'nav-link';
        a.textContent = 'Clientes';
        a.href = isDesiredHost ? 'clientes.html' : desiredUrl;
        li.appendChild(a);
        nav.appendChild(li);
      }
    }
  } catch (e) {
    // Ignorar errores no críticos del frontend
    console.warn('Menu Clientes link normalize error:', e);
  }
});

// Normalizar navegación saliendo de clientes (puerto 3000) hacia el sitio principal sin puerto
window.addEventListener('DOMContentLoaded', function() {
  try {
    const mainHost = 'fotoyvideomx.ddns.net';
    const clientesHost = 'fotoyvideomx.ddns.net:3000';
    const onClientesHost = window.location.host === clientesHost;

    if (onClientesHost) {
      const nav = document.querySelector('.navbar');
      if (nav) {
        nav.querySelectorAll('a').forEach(a => {
          const href = (a.getAttribute('href') || '').trim();
          const text = (a.textContent || '').trim().toLowerCase();

          // Mantener link de Clientes tal cual
          if (href.endsWith('clientes.html') || text === 'clientes') return;

          // Ignorar anclas internas
          if (href.startsWith('#')) return;

          // Si es relativo, apuntar al host principal sin puerto
          if (!/^https?:\/\//i.test(href)) {
            const targetPath = href.replace(/^\//, '');
            a.setAttribute('href', 'http://' + mainHost + '/' + targetPath);
            a.setAttribute('target', '_self');
          } else {
            // Si es absoluto y apunta al host con puerto 3000, cambiarlo al principal
            try {
              const u = new URL(href);
              if (u.host === clientesHost && !u.pathname.endsWith('/clientes.html')) {
                u.host = mainHost;
                a.setAttribute('href', u.toString());
                a.setAttribute('target', '_self');
              }
            } catch (_e) { /* ignore */ }
          }
        });
      }
    }
  } catch (e) {
    console.warn('Menu cross-port normalize error:', e);
  }
});
