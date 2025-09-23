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
