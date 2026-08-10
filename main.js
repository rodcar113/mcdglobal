/* =============================================
   MCD GLOBAL — JAVASCRIPT v4
   Sistema de animación limpio:
   - Hero: CSS @keyframes (sin JS, siempre funciona)
   - Scroll: IntersectionObserver + clase .in-view
   - Stagger: CSS transition-delay vía JS
   - GSAP: solo para parallax (opcional)
   ============================================= */

(function () {
  'use strict';

  /* ════════════════════════════════
     1. LOADER
  ════════════════════════════════ */
  const loader = document.getElementById('loader');

  function hideLoader() {
    if (loader) loader.classList.add('hidden');
  }

  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 1800);
  } else {
    window.addEventListener('load', () => setTimeout(hideLoader, 1800));
  }

  /* ════════════════════════════════
     2. CURSOR PERSONALIZADO
        (solo en dispositivos con hover real)
  ════════════════════════════════ */
  const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (hasMouse) {
    const dot     = document.getElementById('cursorDot');
    const outline = document.getElementById('cursorOutline');
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dot) { dot.style.left = mouseX + 'px'; dot.style.top = mouseY + 'px'; }
    });

    (function animateCursor() {
      outlineX += (mouseX - outlineX) * 0.12;
      outlineY += (mouseY - outlineY) * 0.12;
      if (outline) { outline.style.left = outlineX + 'px'; outline.style.top  = outlineY + 'px'; }
      requestAnimationFrame(animateCursor);
    })();

    document.querySelectorAll('a, button, .servicio-card, .sector-chip, .beneficio-item').forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (!outline) return;
        outline.style.width  = '56px';
        outline.style.height = '56px';
        outline.style.background   = 'rgba(168,131,74,0.15)';
        outline.style.borderColor  = 'rgba(168,131,74,0.7)';
      });
      el.addEventListener('mouseleave', () => {
        if (!outline) return;
        outline.style.width  = '';
        outline.style.height = '';
        outline.style.background  = '';
        outline.style.borderColor = '';
      });
    });
  }

  /* ════════════════════════════════
     3. NAVBAR — scroll + menú móvil
  ════════════════════════════════ */
  const header       = document.getElementById('header');
  const scrollTopBtn = document.getElementById('scrollTop');
  const sections     = document.querySelectorAll('section[id]');
  const navLinks     = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    if (header)       header.classList.toggle('scrolled', window.scrollY > 60);
    if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', window.scrollY > 500);

    // Active link highlight
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 130) current = sec.id;
    });
    navLinks.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === '#' + current) link.style.color = 'var(--gold-light)';
    });
  }, { passive: true });

  /* Mobile menu */
  const menuToggle  = document.getElementById('menuToggle');
  const navMenu     = document.getElementById('navLinks');
  const menuOverlay = document.createElement('div');
  menuOverlay.className = 'menu-overlay';
  document.body.appendChild(menuOverlay);

  function openMenu() {
    if (!navMenu) return;
    navMenu.classList.add('active');
    menuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (menuToggle) menuToggle.querySelector('i').className = 'fas fa-times';
  }
  function closeMenu() {
    if (!navMenu) return;
    navMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
    if (menuToggle) menuToggle.querySelector('i').className = 'fas fa-bars';
  }

  if (menuToggle) menuToggle.addEventListener('click', () => navMenu.classList.contains('active') ? closeMenu() : openMenu());
  menuOverlay.addEventListener('click', closeMenu);
  document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  /* Smooth scroll */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
      }
    });
  });

  /* Scroll to top */
  if (scrollTopBtn) scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ════════════════════════════════
     4. TABS FILOSOFÍA
  ════════════════════════════════ */
  document.querySelectorAll('.ftab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.ftab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.ftab-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('tab-' + tab.dataset.target);
      if (panel) panel.classList.add('active');
    });
  });

  /* ════════════════════════════════
     5. FORMULARIO
  ════════════════════════════════ */
  const form       = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');
  const submitBtn  = document.getElementById('submitBtn');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name  = form.name.value.trim();
      const email = form.email.value.trim();
      const msg   = form.mensaje.value.trim();

      if (!name || !email || !msg) { shakeEmpty(form); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { flashField(form.email); return; }

      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
      submitBtn.disabled = true;
      setTimeout(() => {
        form.reset();
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar mensaje';
        submitBtn.disabled = false;
        if (successMsg) {
          successMsg.classList.add('visible');
          setTimeout(() => successMsg.classList.remove('visible'), 5500);
        }
      }, 1600);
    });
  }

  function flashField(field) {
    field.style.borderColor = '#ef4444';
    field.style.boxShadow   = '0 0 0 3px rgba(239,68,68,.12)';
    field.focus();
    setTimeout(() => { field.style.borderColor = ''; field.style.boxShadow = ''; }, 2200);
  }
  function shakeEmpty(f) {
    ['name', 'email', 'mensaje'].forEach(n => {
      const el = f[n];
      if (el && !el.value.trim()) {
        flashField(el);
        el.style.animation = 'shake .45s ease';
        setTimeout(() => { el.style.animation = ''; }, 900);
      }
    });
  }

  /* ════════════════════════════════
     6. SCROLL REVEAL — IntersectionObserver
        Agrega .in-view cuando el elemento
        entra al viewport. La CSS define la
        animación de transición.
  ════════════════════════════════ */

  /* Stagger: transition-delay por índice dentro de cada grupo */
  function applyStagger(selector, delayPerItem) {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.style.transitionDelay = (i * delayPerItem) + 's';
    });
  }

  applyStagger('.gs-card',       .09);   // Service cards
  applyStagger('.gs-chip',       .07);   // Sector chips
  applyStagger('.beneficio-item',.08);   // Benefits
  applyStagger('.contacto-item', .11);   // Contact items

  // Proceso: secuencia interleaved 1→2→3→4 con conectores entre pasos
  // Timing: step1(0s) → conector1(.32s) → step2(.52s) → conector2(.84s) → step3(1.04s) → conector3(1.36s) → step4(1.56s)
  const procesoSteps      = document.querySelectorAll('.proceso-step');
  const procesoConnectors = document.querySelectorAll('.gs-connector');
  const stepDelay   = 0.52;   // distancia entre cada step
  const connOffset  = 0.32;   // conector aparece 0.32s después del step previo
  procesoSteps.forEach((el, i) => {
    el.style.transitionDelay = (i * stepDelay) + 's';
  });
  procesoConnectors.forEach((el, i) => {
    el.style.animationDelay = (i * stepDelay + connOffset) + 's';
  });

  // Limpiar la animación del icono al terminar para que el hover funcione
  procesoSteps.forEach(step => {
    step.addEventListener('animationend', e => {
      const wrap = step.querySelector('.step-icon-wrap');
      if (e.target === wrap) { wrap.style.animation = 'none'; wrap.style.transform = ''; }
    });
  });

  // Footer stagger manual
  const footerGroups = document.querySelectorAll('.footer-brand, .footer-links-group, .footer-contact-group');
  footerGroups.forEach((el, i) => { el.style.transitionDelay = (i * .1) + 's'; });

  /* All elements to observe */
  const revealTargets = document.querySelectorAll(
    '.section-header, ' +
    '.gs-card, .gs-step, .proceso-step, .gs-chip, .gs-connector, ' +
    '.gs-fade-left, .gs-fade-right, ' +
    '.nosotros-visual, .nosotros-texto, ' +
    '.porq-texto, .beneficios-lista, ' +
    '.beneficio-item, .contacto-item, ' +
    '.contacto-form-wrap, .contacto-info, ' +
    '.footer-brand, .footer-links-group, .footer-contact-group, ' +
    '.cta-text, .btn-white'
  );

  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealIO.unobserve(entry.target);   // fire once
      }
    });
  }, {
    threshold: 0.06,
    rootMargin: '0px 0px -20px 0px'
  });

  revealTargets.forEach(el => revealIO.observe(el));

  /* ════════════════════════════════
     7. GSAP — solo parallax (opcional)
        Si no carga, nada se rompe.
  ════════════════════════════════ */
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  window.addEventListener('load', () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    if (!isIOS) {
      // Parallax sutil en la imagen de nosotros
      gsap.to('.nosotros-img', {
        scrollTrigger: {
          trigger: '.nosotros',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
        y: -35,
        ease: 'none'
      });
    }

    ScrollTrigger.refresh();
  });

})();
