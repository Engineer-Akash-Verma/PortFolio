/* ============================================================
   AKASH VERMA PORTFOLIO — Main JavaScript
   Three.js Particles · GSAP ScrollTrigger · VanillaTilt
   ============================================================ */

// ── Navbar scroll effect & active link ──────────────────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-links');

  // Scroll-based navbar style + active link highlight
  const onScroll = () => {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    // Active section detection
    let current = '';
    document.querySelectorAll('section[id]').forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top <= 120) current = section.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  // Smooth scroll on nav click
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.getElementById(link.dataset.section);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });

  // Hamburger menu
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });
})();

// ── Three.js Hero Particle Field ────────────────────────────
(function initThreeJS() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 4;

  // ── Particle Field ─────────────────────────────────────────
  const PARTICLE_COUNT = 3500;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const sizes = new Float32Array(PARTICLE_COUNT);

  const palette = [
    new THREE.Color('#00d4ff'), // cyan
    new THREE.Color('#7c3aed'), // violet
    new THREE.Color('#fbbf24'), // gold
    new THREE.Color('#10b981'), // green
    new THREE.Color('#ffffff'), // white
  ];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    // Sphere distribution
    const radius = 2.5 + Math.random() * 5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);

    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i3] = c.r;
    colors[i3 + 1] = c.g;
    colors[i3 + 2] = c.b;

    sizes[i] = Math.random() * 2.5 + 0.5;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const mat = new THREE.PointsMaterial({
    size: 0.025,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  // ── Floating wireframe geometry ────────────────────────────
  const geoCrystal = new THREE.IcosahedronGeometry(0.6, 1);
  const matWire = new THREE.MeshBasicMaterial({
    color: 0x00d4ff,
    wireframe: true,
    transparent: true,
    opacity: 0.25,
  });
  const crystal = new THREE.Mesh(geoCrystal, matWire);
  crystal.position.set(2.5, 0, 0);
  scene.add(crystal);

  // Inner solid
  const geoInner = new THREE.IcosahedronGeometry(0.42, 1);
  const matInner = new THREE.MeshBasicMaterial({
    color: 0x7c3aed,
    wireframe: true,
    transparent: true,
    opacity: 0.15,
  });
  const inner = new THREE.Mesh(geoInner, matInner);
  crystal.add(inner);

  // ── TorusKnot accent ───────────────────────────────────────
  const geoTorus = new THREE.TorusKnotGeometry(0.35, 0.1, 80, 16);
  const matTorus = new THREE.MeshBasicMaterial({
    color: 0xfbbf24,
    wireframe: true,
    transparent: true,
    opacity: 0.18,
  });
  const torusKnot = new THREE.Mesh(geoTorus, matTorus);
  torusKnot.position.set(-2.8, -0.5, -1);
  scene.add(torusKnot);

  // ── Mouse parallax ─────────────────────────────────────────
  let mouse = { x: 0, y: 0 };
  let targetMouse = { x: 0, y: 0 };

  document.addEventListener('mousemove', e => {
    mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── Resize ─────────────────────────────────────────────────
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ── Render loop ────────────────────────────────────────────
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Smooth mouse follow
    targetMouse.x += (mouse.x - targetMouse.x) * 0.04;
    targetMouse.y += (mouse.y - targetMouse.y) * 0.04;

    // Rotate particle cloud gently
    particles.rotation.y = t * 0.04 + targetMouse.x * 0.3;
    particles.rotation.x = t * 0.02 + targetMouse.y * 0.15;

    // Rotate crystal
    crystal.rotation.x = t * 0.5;
    crystal.rotation.y = t * 0.7;
    inner.rotation.z = -t * 0.8;

    // Animate torus knot
    torusKnot.rotation.x = t * 0.4;
    torusKnot.rotation.y = t * 0.6;

    // Camera sway
    camera.position.x = targetMouse.x * 0.3;
    camera.position.y = -targetMouse.y * 0.2;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();
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
    backDelay: 1800,
    loop: true,
    cursorChar: '|',
  });
})();

// ── GSAP ScrollTrigger Animations ──────────────────────────
(function initGSAP() {
  if (typeof gsap === 'undefined') return;
  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

  // ── 1. Scroll Progress Bar ─────────────────────────────────
  const progressBar = document.createElement('div');
  progressBar.style.cssText = [
    'position:fixed', 'top:0', 'left:0', 'height:3px', 'width:0%',
    'z-index:9999', 'pointer-events:none',
    'background:linear-gradient(90deg,#00d4ff 0%,#7c3aed 55%,#fbbf24 100%)',
    'box-shadow:0 0 10px rgba(0,212,255,0.55)',
    'border-radius:0 3px 3px 0',
    'transition:width 0.08s linear',
  ].join(';');
  document.body.prepend(progressBar);

  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    progressBar.style.width = (Math.min(pct, 1) * 100) + '%';
  }, { passive: true });

  // ── 2. Glow orb parallax ──────────────────────────────────
  const orbs = document.querySelectorAll('.glow-orb');
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    orbs.forEach((orb, i) => {
      orb.style.transform = `translateY(${sy * (0.08 + i * 0.05)}px)`;
    });
  }, { passive: true });

  // ── 3. Hero entrance timeline ─────────────────────────────
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .to('.hero-greeting', { opacity: 1, y: 0, duration: 0.7, delay: 0.35 })
    .to('.hero-name', { opacity: 1, y: 0, duration: 0.85 }, '-=0.4')
    .to('.hero-typed-wrapper', { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
    .to('.hero-desc', { opacity: 1, y: 0, duration: 0.7 }, '-=0.45')
    .to('.hero-actions', { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
    .to('.hero-visual', { opacity: 1, y: 0, duration: 1.0, ease: 'back.out(1.4)' }, '-=0.7');

  // ── 4. Section headers — fade up ──────────────────────────
  document.querySelectorAll('.section-header').forEach(el => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      opacity: 1, y: 0, duration: 0.85, ease: 'power2.out',
    });
  });

  // ── 5. About text — directional fades ────────────────────
  document.querySelectorAll('.gsap-fade-left').forEach(el => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      opacity: 1, x: 0, duration: 0.85, ease: 'power2.out',
    });
  });
  document.querySelectorAll('.gsap-fade-right').forEach(el => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      opacity: 1, x: 0, duration: 0.85, ease: 'power2.out',
    });
  });

  // ── 6. Stat counters — spring zoom-in + count up ─────────
  document.querySelectorAll('.stat-card').forEach((card, i) => {
    gsap.to(card, {
      scrollTrigger: { trigger: card, start: 'top 90%', once: true },
      opacity: 1, scale: 1, duration: 0.6,
      delay: i * 0.1,
      ease: 'back.out(1.6)',
    });
    const counter = card.querySelector('.stat-number[data-count]');
    if (counter) {
      const to = parseInt(counter.dataset.count, 10);
      ScrollTrigger.create({
        trigger: card,
        start: 'top 90%',
        once: true,
        onEnter: () => gsap.fromTo(counter,
          { innerText: 0 },
          {
            innerText: to, duration: 1.8, ease: 'power2.out',
            snap: { innerText: 1 },
            delay: i * 0.1,
            onUpdate() { counter.textContent = Math.round(this.targets()[0]._gsap.innerText) + '+'; },
          }
        ),
      });
    }
  });

  // ── 7. Timeline items — slide in from left, staggered ────
  document.querySelectorAll('.timeline-item').forEach((item, i) => {
    gsap.set(item, { opacity: 0, x: -50 });
    gsap.to(item, {
      scrollTrigger: { trigger: item, start: 'top 88%', once: true },
      opacity: 1, x: 0,
      duration: 0.75,
      delay: i * 0.08,
      ease: 'power3.out',
    });
    // Dot pulse on enter
    const dot = item.querySelector('.timeline-dot');
    if (dot) {
      gsap.from(dot, {
        scrollTrigger: { trigger: item, start: 'top 88%', once: true },
        scale: 0, duration: 0.4, ease: 'back.out(2)', delay: i * 0.08 + 0.3,
      });
    }
  });

  // ── 8. Skill cards — stagger per grid ────────────────────
  document.querySelectorAll('.skills-grid').forEach(grid => {
    const cards = Array.from(grid.querySelectorAll('.skill-card'));
    gsap.set(cards, { opacity: 0, scale: 0.75, y: 25 });
    ScrollTrigger.create({
      trigger: grid,
      start: 'top 87%',
      once: true,
      onEnter: () => gsap.to(cards, {
        opacity: 1, scale: 1, y: 0,
        duration: 0.45,
        stagger: { amount: 0.55, from: 'start' },
        ease: 'back.out(1.7)',
      }),
    });
  });

  // ── 9. Project cards — cascade fade up ───────────────────
  const projCards = Array.from(document.querySelectorAll('.project-card'));
  if (projCards.length) {
    gsap.set(projCards, { opacity: 0, y: 60 });
    ScrollTrigger.create({
      trigger: '.projects-grid',
      start: 'top 85%',
      once: true,
      onEnter: () => gsap.to(projCards, {
        opacity: 1, y: 0,
        duration: 0.65,
        stagger: 0.15,
        ease: 'power2.out',
      }),
    });
  }

  // ── 10. Contact cards — stagger zoom-in ──────────────────
  const contactCards = Array.from(document.querySelectorAll('.contact-card'));
  if (contactCards.length) {
    gsap.set(contactCards, { opacity: 0, y: 35, scale: 0.88 });
    ScrollTrigger.create({
      trigger: '.contact-grid',
      start: 'top 85%',
      once: true,
      onEnter: () => gsap.to(contactCards, {
        opacity: 1, y: 0, scale: 1,
        duration: 0.5,
        stagger: 0.09,
        ease: 'back.out(1.5)',
      }),
    });
  }

  // ── 11. Education card ────────────────────────────────────
  const eduCard = document.querySelector('.edu-card');
  if (eduCard) {
    gsap.to(eduCard, {
      scrollTrigger: { trigger: eduCard, start: 'top 88%', once: true },
      opacity: 1, scale: 1, duration: 0.75, ease: 'back.out(1.4)',
    });
  }

  // ── 12. Skill category titles — slide in ─────────────────
  document.querySelectorAll('.skill-cat-title').forEach((title, i) => {
    gsap.from(title, {
      scrollTrigger: { trigger: title, start: 'top 90%', once: true },
      opacity: 0, x: -25, duration: 0.55, ease: 'power2.out',
    });
  });

  // ── 13. Section separator lines — width sweep ─────────────
  // Subtle underline animation on section tags
  document.querySelectorAll('.section-tag').forEach(tag => {
    gsap.from(tag, {
      scrollTrigger: { trigger: tag, start: 'top 92%', once: true },
      opacity: 0, scale: 0.8, duration: 0.4, ease: 'back.out(1.8)',
    });
  });

  // ── 14. Tech tags inside timeline — wave ─────────────────
  document.querySelectorAll('.tech-tags').forEach(container => {
    const tags = Array.from(container.querySelectorAll('.tech-tag'));
    gsap.set(tags, { opacity: 0, y: 8 });
    ScrollTrigger.create({
      trigger: container,
      start: 'top 92%',
      once: true,
      onEnter: () => gsap.to(tags, {
        opacity: 1, y: 0,
        duration: 0.3,
        stagger: 0.05,
        ease: 'power1.out',
      }),
    });
  });

})();

// ── VanillaTilt 3D Card Tilt ────────────────────────────────
(function initVanillaTilt() {
  if (typeof VanillaTilt === 'undefined') return;

  VanillaTilt.init(document.querySelectorAll('.skill-card'), {
    max: 12,
    speed: 400,
    glare: true,
    'max-glare': 0.15,
    gyroscope: true,
  });

  VanillaTilt.init(document.querySelectorAll('.project-card'), {
    max: 6,
    speed: 500,
    glare: true,
    'max-glare': 0.2,
    gyroscope: true,
  });

  VanillaTilt.init(document.querySelectorAll('.contact-card'), {
    max: 10,
    speed: 400,
    glare: true,
    'max-glare': 0.12,
  });
})();

// ── Footer year ─────────────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();