/* =====================================================
   AGIL — Automated García Intelligence & Logistics
   Landing Page Script
===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  /* ---------- Contador animado genérico (.counter[data-target]) ---------- */
  function animateCountTo(el, target, duration, suffix) {
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current.toLocaleString('es-MX') + (suffix || '');
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }

  const counterEls = document.querySelectorAll('.counter[data-target]');
  if (counterEls.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10) || 0;
          const suffix = el.getAttribute('data-suffix') || '';
          animateCountTo(el, target, 1500, suffix);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.4 });

    counterEls.forEach((el) => counterObserver.observe(el));
  }

  /* ---------- Smooth scroll para enlaces internos ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId.length > 1) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const offset = 76;
          const top = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

  /* =====================================================
     RED DE PARTÍCULAS DEL HERO (líneas conectadas)
  ===================================================== */
  const canvas = document.getElementById('heroNetwork');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const hero = document.getElementById('hero');
    let width, height, particles, rafId;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const maxDist = 140;

    function resize() {
      width = hero.offsetWidth || window.innerWidth;
      height = hero.offsetHeight || window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function createParticles() {
      const count = Math.min(70, Math.max(24, Math.floor(width / 24)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35
      }));
    }

    function drawStatic() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(34, 226, 255, 0.35)';
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    function tick() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.35;
            ctx.strokeStyle = `rgba(34, 226, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.fillStyle = 'rgba(91, 141, 255, 0.7)';
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      });

      rafId = requestAnimationFrame(tick);
    }

    function start() {
      resize();
      createParticles();
      if (prefersReducedMotion) {
        drawStatic();
      } else {
        cancelAnimationFrame(rafId);
        tick();
      }
    }

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(start, 200);
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else if (!prefersReducedMotion) {
        tick();
      }
    });

    start();
    window.addEventListener('load', start);
  }

  /* =====================================================
     TEST DE MODERNIZACIÓN OPERATIVA
  ===================================================== */
  const quizIntro = document.getElementById('quizIntro');
  const quizQuestions = document.getElementById('quizQuestions');
  const quizResult = document.getElementById('quizResult');
  const quizProgress = document.getElementById('quizProgress');
  const quizStep = document.getElementById('quizStep');
  const quizStartBtn = document.getElementById('quizStartBtn');
  const quizRestart = document.getElementById('quizRestart');
  const evaluarBtn = document.getElementById('evaluarBtn');

  if (quizIntro && quizQuestions && quizResult) {
    const questionEls = Array.from(quizQuestions.querySelectorAll('.quiz__question'));
    const totalQuestions = questionEls.length;
    let currentIndex = 0;
    let scoredPoints = [];
    let urgencyLevel = null;
    const MAX_SCORE = 24; // 8 preguntas puntuadas x 3 pts

    function resetQuiz() {
      currentIndex = 0;
      scoredPoints = [];
      urgencyLevel = null;
      questionEls.forEach((q, i) => {
        q.classList.toggle('is-active', i === 0);
        q.querySelectorAll('.quiz__option').forEach((opt) => opt.classList.remove('is-selected'));
        const feedback = q.querySelector('.quiz__feedback');
        if (feedback) feedback.classList.remove('is-visible');
        const nextBtn = q.querySelector('.quiz__next');
        if (nextBtn) nextBtn.disabled = true;
      });
      quizProgress.style.width = '0%';
      updateStepLabel();
      quizIntro.hidden = false;
      quizQuestions.hidden = true;
      quizResult.hidden = true;
    }

    function updateStepLabel() {
      if (quizStep) {
        quizStep.textContent = `Pregunta ${currentIndex + 1} de ${totalQuestions}`;
      }
      quizProgress.style.width = `${((currentIndex) / totalQuestions) * 100}%`;
    }

    function startQuiz() {
      quizIntro.hidden = true;
      quizQuestions.hidden = false;
      quizResult.hidden = true;
      updateStepLabel();
      quizQuestions.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function goToQuestion(index) {
      questionEls.forEach((q, i) => q.classList.toggle('is-active', i === index));
      currentIndex = index;
      updateStepLabel();
    }

    questionEls.forEach((question, index) => {
      const options = question.querySelectorAll('.quiz__option');
      const feedback = question.querySelector('.quiz__feedback');
      const nextBtn = question.querySelector('.quiz__next');

      options.forEach((opt) => {
        opt.addEventListener('click', () => {
          options.forEach((o) => o.classList.remove('is-selected'));
          opt.classList.add('is-selected');

          if (opt.hasAttribute('data-points')) {
            scoredPoints[index] = parseInt(opt.getAttribute('data-points'), 10);
          }
          if (opt.hasAttribute('data-urgency')) {
            urgencyLevel = opt.getAttribute('data-urgency');
          }

          if (feedback) feedback.classList.add('is-visible');
          if (nextBtn) nextBtn.disabled = false;
        });
      });

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          if (index < totalQuestions - 1) {
            goToQuestion(index + 1);
          } else {
            showResult();
          }
        });
      }
    });

    function getDiagnosis(score) {
      if (score >= 80) {
        return {
          risk: 'Bajo', riskClass: 'bajo', opportunity: 'Media',
          loss: '$20,000 – $60,000 MXN/mes',
          diagnosis: 'Tu operación ya tiene una base sólida. Aun así, existen micro-fugas que se pueden cerrar con automatización fina y capas de IA.'
        };
      } else if (score >= 60) {
        return {
          risk: 'Medio', riskClass: 'medio', opportunity: 'Media-Alta',
          loss: '$60,000 – $150,000 MXN/mes',
          diagnosis: 'Tu empresa tiene procesos funcionales, pero está perdiendo tiempo y dinero en tareas repetitivas, errores manuales y reportes lentos.'
        };
      } else if (score >= 40) {
        return {
          risk: 'Alto', riskClass: 'alto', opportunity: 'Alta',
          loss: '$150,000 – $350,000 MXN/mes',
          diagnosis: 'Hay fugas operativas importantes: captura manual, sistemas desconectados y dependencia de personas saturadas están costando más de lo que parece.'
        };
      }
      return {
        risk: 'Crítico', riskClass: 'critico', opportunity: 'Muy alta',
        loss: '$350,000+ MXN/mes',
        diagnosis: 'Tu operación depende casi por completo de procesos manuales. Es el escenario con mayor oportunidad de automatización que existe.'
      };
    }

    function showResult() {
      quizProgress.style.width = '100%';
      quizQuestions.hidden = true;
      quizResult.hidden = false;

      const sum = scoredPoints.reduce((acc, val) => acc + (val || 0), 0);
      const score = Math.max(0, Math.min(100, Math.round((sum / MAX_SCORE) * 100)));
      const diag = getDiagnosis(score);

      const scoreEl = document.getElementById('quizScoreNumber');
      const diagnosisEl = document.getElementById('quizDiagnosis');
      const lossEl = document.getElementById('quizLoss');
      const riskEl = document.getElementById('quizRisk');
      const opportunityEl = document.getElementById('quizOpportunity');
      const ctaEl = document.getElementById('quizResultCta');
      const urgencyBadge = document.getElementById('quizUrgencyBadge');

      scoreEl.textContent = '0';
      animateCountTo(scoreEl, score, 1100, '');

      diagnosisEl.textContent = diag.diagnosis;
      lossEl.textContent = diag.loss;
      riskEl.textContent = diag.risk;
      riskEl.className = `value risk--${diag.riskClass}`;
      opportunityEl.textContent = diag.opportunity;

      if (urgencyLevel === 'Alta' || urgencyLevel === 'Ayer') {
        urgencyBadge.hidden = false;
      } else {
        urgencyBadge.hidden = true;
      }

      const message = `Hola AGIL, hice el Test de Modernización Operativa y obtuve un score de ${score}/100 (riesgo ${diag.risk}). Quiero solicitar mi auditoría operativa gratuita.`;
      ctaEl.href = `https://wa.me/525532180680?text=${encodeURIComponent(message)}`;

      quizResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    quizStartBtn.addEventListener('click', startQuiz);

    if (quizRestart) {
      quizRestart.addEventListener('click', () => {
        resetQuiz();
        quizIntro.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }

    if (evaluarBtn) {
      evaluarBtn.addEventListener('click', () => {
        const testSection = document.getElementById('test');
        if (testSection) {
          const offset = 76;
          const top = testSection.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
        startQuiz();
      });
    }

    updateStepLabel();
  }

});
