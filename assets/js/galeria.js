// galeria.js - Lógica para galería fullscreen con animaciones y navegación
// Comentarios incluidos para facilitar modificaciones

const galerias = {
  bodas: [
    'assets/img/boda/boda1.jpg',
    'assets/img/boda/boda2.jpg',
    'assets/img/boda/boda3.jpg',
    'assets/img/boda/boda4.jpg',
    'assets/img/boda/boda5.jpg',
    'assets/img/boda/boda6.jpg',
    'assets/img/boda/boda7.jpg',
    'assets/img/boda/boda8.jpg',
    'assets/img/boda/boda9.jpg',
    'assets/img/boda/boda10.jpg',
    'assets/img/boda/boda11.jpg',
    'assets/img/boda/boda12.jpg',
    'assets/img/boda/boda13.jpg',
    'assets/img/boda/boda14.jpg',
    'assets/img/boda/boda15.jpg',
    'assets/img/boda/boda16.jpg',
    'assets/img/boda/boda17.jpg',
    'assets/img/boda/boda18.jpg',
    'assets/img/boda/boda19.jpg'
  ],
  xv: [
    'assets/img/xv/xv1.JPG',
    'assets/img/xv/xv2.JPG',
    'assets/img/xv/xv3.jpg',
    'assets/img/xv/xv4.jpg',
    'assets/img/xv/xv5.jpg',
    'assets/img/xv/xv6.jpg',
    'assets/img/xv/xv7.jpg',
    'assets/img/xv/xv8.jpg',
    'assets/img/xv/xv9.JPG',
    'assets/img/xv/xv10.JPG'
  ],
  bautizos: [
    'assets/img/bautizo/bautizo1.jpg',
    'assets/img/bautizo/bautizo2.jpg',
    'assets/img/bautizo/bautizo3.jpg',
    'assets/img/bautizo/bautizo4.jpg',
    'assets/img/bautizo/bautizo5.jpg',
    'assets/img/bautizo/bautizo6.jpg',
    'assets/img/bautizo/bautizo7.jpg',
    'assets/img/bautizo/bautizo8.jpg',
    'assets/img/bautizo/bautizo9.jpg',
    'assets/img/bautizo/bautizo10.jpg',
    'assets/img/bautizo/bautizo11.jpg',
    'assets/img/bautizo/bautizo12.jpg',
    'assets/img/bautizo/bautizo13.jpg',
    'assets/img/bautizo/bautizo14.jpg',
    'assets/img/bautizo/bautizo15.jpg',
    'assets/img/bautizo/bautizo16.jpg',
    'assets/img/bautizo/bautizo17.jpg',
    'assets/img/bautizo/bautizo18.jpg',
    'assets/img/bautizo/bautizo19.jpg',
    'assets/img/bautizo/bautizo20.jpg'
  ],
  presentaciones: [
    'assets/img/pre/pre.jpg',
    'assets/img/pre/pre1.jpg',
    'assets/img/pre/pre2.jpg',
    'assets/img/pre/pre3.jpg',
    'assets/img/pre/pre4.jpg',
    'assets/img/pre/pre5.jpg',
    'assets/img/pre/pre6.jpg',
    'assets/img/pre/pre7.jpg',
    'assets/img/pre/pre8.jpg',
    'assets/img/pre/pre9.jpg',
    'assets/img/pre/pre10.jpg',
    'assets/img/pre/pre11.jpg',
    'assets/img/pre/pre12.jpg',
    'assets/img/pre/pre13.jpg'
  ],
  comuniones: [
    'assets/img/primera/primera.jpg',
    'assets/img/primera/primera1.jpg',
    'assets/img/primera/primera2.jpg',
    'assets/img/primera/primera3.jpg',
    'assets/img/primera/primera4.jpg',
    'assets/img/primera/primera5.jpg',
    'assets/img/primera/primera6.jpg',
    'assets/img/primera/primera7.jpg',
    'assets/img/primera/primera8.jpg',
    'assets/img/primera/primera9.jpg',
    'assets/img/primera/primera10.jpg',
    'assets/img/primera/primera11.jpg',
    'assets/img/primera/primera12.jpg',
    'assets/img/primera/primera13.jpg',
    'assets/img/primera/primera14.jpg',
    'assets/img/primera/primera15.jpg',
    'assets/img/primera/primera16.jpg',
    'assets/img/primera/primera17.jpg'
  ]
};

let galeriaActual = '';
let indiceActual = 0;

// Abrir modal al hacer clic en miniatura
window.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.gallery-thumb').forEach(img => {
    img.addEventListener('click', function() {
      galeriaActual = this.dataset.gallery;
      indiceActual = parseInt(this.dataset.index);
      mostrarImagen();
      const modal = new bootstrap.Modal(document.getElementById('galleryModal'));
      modal.show();

      // Agregar listeners de swipe cada vez que se abre el modal
      setTimeout(() => {
        const galleryImage = document.getElementById('galleryImage');
        let startX = 0;
        let endX = 0;
        if (galleryImage) {
          galleryImage.ontouchstart = function(e) {
            startX = e.touches[0].clientX;
          };
          galleryImage.ontouchmove = function(e) {
            endX = e.touches[0].clientX;
          };
          galleryImage.ontouchend = function(e) {
            if (startX && endX) {
              const diff = startX - endX;
              if (Math.abs(diff) > 50) {
                if (diff > 0) {
                  cambiarImagen(1);
                } else {
                  cambiarImagen(-1);
                }
              }
            }
            startX = 0;
            endX = 0;
          };
        }
      }, 300);
    });
  });

  document.getElementById('galleryPrev').addEventListener('click', function() {
    cambiarImagen(-1);
  });
  document.getElementById('galleryNext').addEventListener('click', function() {
    cambiarImagen(1);
  });
});

function mostrarImagen() {
  const img = document.getElementById('galleryImage');
  img.style.opacity = 0;
  setTimeout(() => {
    img.src = galerias[galeriaActual][indiceActual];
    img.style.opacity = 1;
  }, 200);
}

function cambiarImagen(direccion) {
  const galeria = galerias[galeriaActual];
  indiceActual = (indiceActual + direccion + galeria.length) % galeria.length;
  mostrarImagen();
}

// Animación suave al abrir/cerrar modal
const galleryModal = document.getElementById('galleryModal');
galleryModal.addEventListener('show.bs.modal', function () {
  document.body.style.overflow = 'hidden';
});
galleryModal.addEventListener('hidden.bs.modal', function () {
  document.body.style.overflow = '';
});
