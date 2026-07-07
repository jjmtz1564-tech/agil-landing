/* =====================================================
   AGIL — Automated García Intelligence & Logistics
   Landing Page Script
===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Año dinámico en footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------- Navbar: fondo sólido al hacer scroll ---------- */
  const navbar = document.getElementById('navbar');
  const onScrollNavbar = () => {
    if (window.scrollY > 40) {
      navbar.style.background = 'rgba(5, 7, 10, 0.92)';
      navbar.style.borderBottomColor = 'rgba(34, 226, 255, 0.18)';
    } else {
      navbar.style.background = 'rgba(5, 7, 10, 0.6)';
      navbar.style.borderBottomColor = 'rgba(255, 255, 255, 0.08)';
    }
  };
  window.addEventListener('scroll', onScrollNavbar);
  onScrollNavbar();

  /* ---------- Scroll reveal (fade-in) con IntersectionObserver ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // pequeño stagger para elementos que aparecen juntos (cards, grids)
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, index * 60);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- Contador animado del 45% ---------- */
  const statNumber = document.querySelector('.stat-number');
  const statRing = document.querySelector('.stat-ring__fg');
  const statCircle = document.querySelector('.stat-circle');

  if (statNumber && statRing && statCircle) {
    let animated = false;

    const animateStat = () => {
      if (animated) return;
      animated = true;

      const target = parseInt(statRing.getAttribute('data-percent'), 10) || 45;
      const circumference = 327; // 2 * PI * r(52), redondeado
      const offset = circumference - (circumference * target) / 100;
      statRing.style.strokeDashoffset = offset;

      const duration = 1500;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current = Math.round(eased * target);
        statNumber.textContent = current + '%';
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    };

    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateStat();
          statObserver.disconnect();
        }
      });
    }, { threshold: 0.4 });

    statObserver.observe(statCircle);
  }

  /* ---------- Smooth scroll para enlaces internos ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId.length > 1) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const offset = 76; // altura del navbar
          const top = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

});
