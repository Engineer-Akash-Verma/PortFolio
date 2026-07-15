(function() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: false });
  
  // Style the canvas to be fixed behind everything
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '-1';
  canvas.style.pointerEvents = 'none';

  let width, height;
  let particles = [];
  
  // Premium, ultra-minimalist configuration
  const config = {
    particleCount: window.innerWidth < 600 ? 40 : 80,
    particleBaseRadius: 0.8,
    connectionDistance: 150,
    mouseConnectionDistance: 200,
    speed: 0.15,
    bgColor: '#0a0a0a',
    baseColor: '255, 255, 255'
  };

  function updateTheme() {
    const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
    config.bgColor = isLightMode ? '#f8fafc' : '#0a0a0a';
    config.baseColor = isLightMode ? '15, 23, 42' : '255, 255, 255';
  }

  // Watch for theme changes
  const themeObserver = new MutationObserver(() => {
    updateTheme();
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  updateTheme();

  const mouse = { x: null, y: null };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    config.particleCount = width < 600 ? 40 : 100;
  }
  
  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * config.speed;
      this.vy = (Math.random() - 0.5) * config.speed;
      this.radius = Math.random() * config.particleBaseRadius + 0.5;
      this.alpha = Math.random() * 0.3 + 0.1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Wrap around edges for smoother continuous flow instead of bouncing
      if (this.x < -10) this.x = width + 10;
      if (this.x > width + 10) this.x = -10;
      if (this.y < -10) this.y = height + 10;
      if (this.y > height + 10) this.y = -10;

      // Mouse repulsion for an elegant subtle displacement
      if (mouse.x != null && mouse.y != null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 100) {
          const force = (100 - dist) / 100;
          this.x -= (dx / dist) * force * 0.5;
          this.y -= (dy / dist) * force * 0.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${config.baseColor}, ${this.alpha})`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < config.particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function drawLines() {
    ctx.lineWidth = 0.5;
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < config.connectionDistance) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const opacity = 0.1 * (1 - dist / config.connectionDistance);
          ctx.strokeStyle = `rgba(${config.baseColor}, ${opacity})`;
          ctx.stroke();
        }
      }

      // Draw elegant connection to mouse
      if (mouse.x != null && mouse.y != null) {
        let dx = particles[i].x - mouse.x;
        let dy = particles[i].y - mouse.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < config.mouseConnectionDistance) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          const opacity = 0.15 * (1 - dist / config.mouseConnectionDistance);
          ctx.strokeStyle = `rgba(${config.baseColor}, ${opacity})`;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    // Elegant solid background fill instead of clearRect for better blending
    ctx.fillStyle = config.bgColor;
    ctx.fillRect(0, 0, width, height);

    for (let p of particles) {
      p.update();
      p.draw();
    }

    drawLines();
    requestAnimationFrame(animate);
  }

  resize();
  initParticles();
  animate();

})();
