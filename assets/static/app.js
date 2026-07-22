/* ============================================================
   AKASH VERMA PORTFOLIO — Optimised JavaScript
   Typed.js · Intersection Observer · Vanilla JS only
   No Three.js · No GSAP · No VanillaTilt
   ============================================================ */

// ── Navbar: scroll shadow + active link + hamburger ─────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-links');
  const navLinks = document.querySelectorAll('[data-section]');
  if (!navbar || !hamburger) return;

  // Scroll: add shadow + track active section
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    let current = '';
    document.querySelectorAll('section[id]').forEach(s => {
      if (s.getBoundingClientRect().top <= 120) current = s.id;
    });
    navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === current));
  }, { passive: true });

  // Smooth scroll on nav click
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.getElementById(link.dataset.section)?.scrollIntoView({ behavior: 'smooth' });
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });
})();

// ── Typed.js hero subtitle ──────────────────────────────────
(function initTyped() {
  if (typeof Typed === 'undefined') return;
  new Typed('#typed-text', {
    strings: [
      'Full Stack Software Engineer',
      '.NET Core &amp; Cloud Architect',
      'Angular &bull; React &bull; Blazor Developer',
      'Microservices &amp; DevOps Engineer',
    ],
    typeSpeed: 55,
    backSpeed: 28,
    backDelay: 2200,
    loop: true,
    cursorChar: '|',
  });
})();

// ── Scroll progress bar (pure JS, ~5 lines) ─────────────────
(function initProgressBar() {
  const bar = document.createElement('div');
  bar.style.cssText = [
    'position:fixed', 'top:0', 'left:0', 'height:3px', 'width:0%',
    'z-index:9999', 'pointer-events:none',
    'background:linear-gradient(90deg,#00d4ff,#7c3aed,#fbbf24)',
    'border-radius:0 2px 2px 0',
    'transition:width 0.1s linear',
  ].join(';');
  document.body.prepend(bar);
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    bar.style.width = Math.min(pct * 100, 100) + '%';
  }, { passive: true });
})();

// ── Intersection Observer: scroll reveals + stat counters ───
(function initReveal() {

  // Add stagger transition-delays to card groups
  const staggerConfig = [
    { sel: '.skills-grid .gsap-zoom-in', delay: 55 },
    { sel: '.project-card', delay: 100 },
    { sel: '.contact-card', delay: 70 },
    { sel: '.stat-card', delay: 90 },
    { sel: '.timeline-item', delay: 80 },
  ];
  staggerConfig.forEach(({ sel, delay }) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.style.transitionDelay = (i * delay) + 'ms';
    });
  });

  // Simple integer count-up animation
  function countUp(el) {
    const target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;
    const suffix = el.textContent.includes('+') ? '+' : '';
    let v = 0;
    const step = Math.max(Math.ceil(target / 40), 1);
    const timer = setInterval(() => {
      v = Math.min(v + step, target);
      el.textContent = v + suffix;
      if (v >= target) clearInterval(timer);
    }, 35);
  }

  // Single IO instance handles all reveal targets
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      // Trigger counter if this card contains a stat number
      const counter = entry.target.querySelector('.stat-number[data-count]');
      if (counter) setTimeout(() => countUp(counter), 250);
      io.unobserve(entry.target); // fire once only
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

  // Observe all animated elements
  const targets = [
    '.gsap-fade-up',
    '.gsap-fade-left',
    '.gsap-fade-right',
    '.gsap-zoom-in',
    '.timeline-item',
    '.edu-card',
    '.skill-cat-title',
  ].join(',');

  document.querySelectorAll(targets).forEach(el => io.observe(el));

})();



// ── Footer year ─────────────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ── Auto Calculate Experience ──────────────────────────────────
(function initExperienceCalc() {
  const startDate = new Date(2021, 9, 4); // October 4, 2021
  const now = new Date();
  
  let years = now.getFullYear() - startDate.getFullYear();
  let months = now.getMonth() - startDate.getMonth();
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  let experienceText = '';
  if (years > 0) {
    experienceText += years + (years === 1 ? ' year' : ' years');
  }
  if (months > 0) {
    if (experienceText !== '') experienceText += ' and ';
    experienceText += months + (months === 1 ? ' month' : ' months');
  }
  if (experienceText === '') {
    experienceText = 'Less than a month';
  }
  
  document.querySelectorAll('.experience-calc').forEach(el => {
    el.textContent = experienceText;
  });
})();