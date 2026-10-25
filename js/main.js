/**
 * INSTITUCIÓN EDUCATIVA EMBLEMÁTICA Y CENTENARIA
 * «MANUEL ANTONIO MESONES MURO» N° 11031 — FERREÑAFE
 * Archivo Principal de Scripts (js/main.js)
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================
     1. PRELOADER
  ============================================ */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('hidden');
      }, 500);
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 1100);
    });

    // Fallback de seguridad en caso de que tarde en cargar
    setTimeout(() => {
      if (!preloader.classList.contains('hidden')) {
        preloader.classList.add('hidden');
        setTimeout(() => { preloader.style.display = 'none'; }, 600);
      }
    }, 3500);
  }

  /* ============================================
     2. NAVBAR SCROLL EFFECT & BACK TO TOP
  ============================================ */
  const navbar = document.getElementById('mainNavbar');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Sombra y compresión de Navbar
    if (navbar) {
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Visibilidad del botón Volver Arriba
    if (backToTop) {
      if (scrollY > 450) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================
     3. ENLACE ACTIVO EN NAVBAR SEGÚN SCROLL
  ============================================ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link:not(.btn-matricula)');

  function updateActiveLink() {
    const scrollPos = window.scrollY + 130;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveLink);

  /* ============================================
     4. CERRAR MENÚ MÓVIL AL HACER CLIC
  ============================================ */
  const navCollapse = document.getElementById('navbarNav');
  if (navCollapse && typeof bootstrap !== 'undefined') {
    document.querySelectorAll('.navbar-nav a').forEach(link => {
      link.addEventListener('click', () => {
        if (navCollapse.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(navCollapse) || new bootstrap.Collapse(navCollapse, { toggle: false });
          bsCollapse.hide();
        }
      });
    });
  }

  /* ============================================
     5. CONTADORES ANIMADOS
  ============================================ */
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
      if (counter.dataset.animated === 'true') return;

      const rect = counter.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        counter.dataset.animated = 'true';

        // Manejo de valores de texto fijos (100%, A+)
        if (counter.classList.contains('stat-text')) {
          const text = counter.dataset.text;
          setTimeout(() => {
            counter.textContent = text;
          }, 350);
          return;
        }

        const target = parseInt(counter.dataset.target, 10);
        const duration = 2000;
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(eased * target);
          counter.textContent = '+' + current;
          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            counter.textContent = '+' + target;
          }
        }
        requestAnimationFrame(update);
      }
    });
  }

  window.addEventListener('scroll', animateCounters);
  window.addEventListener('load', () => setTimeout(animateCounters, 700));

  /* ============================================
     6. FADE-UP ANIMATIONS (Intersection Observer)
  ============================================ */
  const fadeElements = document.querySelectorAll('.fade-up');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 70);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeElements.forEach(el => observer.observe(el));
  } else {
    // Si el navegador no soporta IntersectionObserver
    fadeElements.forEach(el => el.classList.add('visible'));
  }

  /* ============================================
     7. FORMULARIO DE CONTACTO & VALIDACIÓN DNI
  ============================================ */
  const contactForm = document.getElementById('contactForm');
  const dniInput = document.getElementById('contactDni');
  const dniError = document.getElementById('dniError');

  // Validación en tiempo real del DNI (solo 8 dígitos numéricos)
  if (dniInput) {
    dniInput.addEventListener('input', (e) => {
      // Filtrar inmediatamente caracteres no numéricos y limitar a 8 dígitos
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 8);
      if (dniError) {
        if (e.target.value.length === 8) {
          dniError.classList.add('d-none');
          dniInput.classList.remove('is-invalid');
          dniInput.classList.add('is-valid');
        } else if (e.target.value.length > 0 && e.target.value.length < 8) {
          dniInput.classList.remove('is-valid');
        }
      }
    });

    dniInput.addEventListener('blur', (e) => {
      if (e.target.value.length > 0 && e.target.value.length < 8) {
        if (dniError) dniError.classList.remove('d-none');
        dniInput.classList.add('is-invalid');
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const dniVal = dniInput ? dniInput.value.trim() : '';
      
      // Validación estricta del DNI de 8 dígitos
      if (!/^\d{8}$/.test(dniVal)) {
        if (dniError) dniError.classList.remove('d-none');
        if (dniInput) {
          dniInput.classList.add('is-invalid');
          dniInput.focus();
        }
        return;
      }

      const name = document.getElementById('contactName')?.value.trim() || '';
      const email = document.getElementById('contactEmail')?.value.trim() || '';
      const level = document.getElementById('contactLevel')?.value || 'General';
      const message = document.getElementById('contactMessage')?.value.trim() || '';

      // Correos oficiales de destino
      const primaryEmail = 'ie.mmesonesmuro@hotmail.com';
      const alternateEmail = 'iemanuelmesonesm@gmail.com';
      const phoneOfficial = '074-287415';

      const subject = `Consulta Web I.E. Mesones Muro - ${level} - DNI ${dniVal}`;
      const emailBody = `Estimada Dirección y Secretaría de la I.E. Emblemática «Manuel Antonio Mesones Muro»,\n\n`
        + `Se ha registrado una nueva consulta desde el portal web oficial:\n\n`
        + `• Remitente: ${name}\n`
        + `• DNI: ${dniVal}\n`
        + `• Correo electrónico: ${email}\n`
        + `• Nivel / Modalidad: ${level}\n\n`
        + `Mensaje / Consulta:\n${message}\n\n`
        + `Atentamente,\n${name}\nDNI: ${dniVal}\n\n`
        + `(Canal oficial: Tel. ${phoneOfficial} | ${primaryEmail})`;

      // Generar enlace mailto para el cliente de correo
      const mailtoUrl = `mailto:${primaryEmail}?cc=${encodeURIComponent(alternateEmail)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

      const submitBtn = this.querySelector('button[type="submit"]');
      const originalHtml = submitBtn.innerHTML;

      submitBtn.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>¡Abriendo correo para enviar...!';
      submitBtn.style.background = '#28a745';
      submitBtn.style.borderColor = '#28a745';
      submitBtn.style.color = '#ffffff';
      submitBtn.disabled = true;

      // Lanzar el envío por correo electrónico
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 400);

      setTimeout(() => {
        submitBtn.innerHTML = originalHtml;
        submitBtn.style.background = '';
        submitBtn.style.borderColor = '';
        submitBtn.style.color = '';
        submitBtn.disabled = false;
        contactForm.reset();
        if (dniInput) dniInput.classList.remove('is-valid', 'is-invalid');
      }, 4500);
    });
  }

  /* ============================================
     8. AÑO ACTUAL EN FOOTER
  ============================================ */
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

});
