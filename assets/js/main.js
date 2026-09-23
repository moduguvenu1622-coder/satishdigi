/* ==========================================================================
   P. SATISH CHANDRA — ULTRA-LUXURY 3D EXECUTIVE PORTFOLIO & EVENT SHOWCASE
   Cinematic Three.js Companion Layer: Champagne Bokeh Sparks & 3D Diamond Prism
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initLuxuryCompanion3D();
  initCursorSpotlight();
  init3DCardTilt();
  initDynamicTyping();
  initAnimatedCounters();
  initCinemaModal();
  initEcosystemFilters();
  initRoiCalculator();
  initSoundEngine();
  initContactForm();
  initNavbarScroll();
  initMobileMenu();
  initScrollProgress();
  initLuxuryReveal();
});

/* ==========================================================================
   1. THREE.JS 3D COMPANION LAYER (CHAMPAGNE BOKEH SPARKS & DIAMOND PRISM)
   ========================================================================== */
function initLuxuryCompanion3D() {
  const container = document.getElementById('webgl-canvas-container');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!container || typeof THREE === 'undefined' || reduceMotion) return;

  const isCompactDevice = window.matchMedia('(max-width: 768px)').matches;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 42;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isCompactDevice ? 1.35 : 2));
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  // Helper to generate soft circular micro-dot texture
  function createCircleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 248, 230, 0.95)');
    gradient.addColorStop(0.5, 'rgba(246, 216, 150, 0.4)');
    gradient.addColorStop(1, 'rgba(246, 216, 150, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(32, 32, 30, 0, Math.PI * 2);
    ctx.fill();
    return new THREE.CanvasTexture(canvas);
  }

  // Small, delicate micro-dot particles ("dots particles style, not much, small small sizes")
  const sparkCount = isCompactDevice ? 34 : 85; // Lighter particle field on mobile for smoother scrolling
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(sparkCount * 3);
  const colors = new Float32Array(sparkCount * 3);
  const sparkData = [];

  const goldColor = new THREE.Color(0xf6d896);
  const warmWhite = new THREE.Color(0xfffbeb);
  const softCyan = new THREE.Color(0x7dd3fc);

  for (let i = 0; i < sparkCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 95;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 75;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 45;

    const rand = Math.random();
    const c = rand < 0.70 ? goldColor : (rand < 0.90 ? warmWhite : softCyan);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    sparkData.push({
      speedY: 0.009 + Math.random() * 0.015,
      speedX: (Math.random() - 0.5) * 0.005,
      wobble: Math.random() * Math.PI * 2
    });
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const sparkMaterial = new THREE.PointsMaterial({
    size: 0.38, // Delicate, small micro-dot size (pinprick stardust)
    map: createCircleTexture(),
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const sparks = new THREE.Points(geometry, sparkMaterial);
  scene.add(sparks);

  // Mouse Parallax Lerp
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.0004;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.0004;
  }, { passive: true });

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    targetX += (mouseX - targetX) * 0.035;
    targetY += (mouseY - targetY) * 0.035;

    // Gentle upward stardust float
    const posArr = geometry.attributes.position.array;
    for (let i = 0; i < sparkCount; i++) {
      const data = sparkData[i];
      posArr[i * 3 + 1] += data.speedY;
      posArr[i * 3] += Math.sin(elapsedTime * 0.45 + data.wobble) * data.speedX;

      if (posArr[i * 3 + 1] > 38) {
        posArr[i * 3 + 1] = -38;
        posArr[i * 3] = (Math.random() - 0.5) * 95;
      }
    }
    geometry.attributes.position.needsUpdate = true;

    // Subtle Camera Perspective Follow
    camera.position.x += (targetX * 6 - camera.position.x) * 0.03;
    camera.position.y += (-targetY * 6 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

/* ==========================================================================
   2. REFINED SUBTLE CURSOR SPOTLIGHT TRACKING
   ========================================================================== */
function initCursorSpotlight() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('mousemove', (e) => {
    document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);
  }, { passive: true });
}

/* ==========================================================================
   3. INTERACTIVE 3D CARD TILT WITH SPECULAR REFLECTION
   ========================================================================== */
function init3DCardTilt() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const tiltCards = document.querySelectorAll('.card-3d-wrapper, .event-card, .metric-card, .timeline-card, .calculator-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;

      const percentX = (x / rect.width) * 100;
      const percentY = (y / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${percentX}%`);
      card.style.setProperty('--mouse-y', `${percentY}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1100px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });
}

/* ==========================================================================
   4. DYNAMIC TYPING SUBTITLE
   ========================================================================== */
function initDynamicTyping() {
  const typingElement = document.getElementById('typing-text');
  if (!typingElement) return;

  const roles = [
    "Digital Marketing Manager | Team Lead",
    "Revenue Generated ₹1500 Cr+ in 6 Years",
    "From High-Intent Audiences to High-Value Conversions",
    "Meta, Google, OTT & JioHotstar Performance Lead",
    "AI-Driven Marketing & ChatGPT Advertising Specialist",
    "Gramayatri Cultural Tour Organizer & Myron Mall Host"
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 65;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 35;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 65;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typeSpeed = 1800;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 400;
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

/* ==========================================================================
   5. ANIMATED COUNTERS FOR STATS
   ========================================================================== */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('.counter-val');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseFloat(counter.getAttribute('data-target'));
        const prefix = counter.getAttribute('data-prefix') || '';
        const suffix = counter.getAttribute('data-suffix') || '';
        const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
        let start = 0;
        const duration = 1800;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const currentVal = start + (target - start) * easeProgress;

          counter.textContent = prefix + (decimals > 0 ? currentVal.toFixed(decimals) : Math.floor(currentVal)) + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = prefix + (decimals > 0 ? target.toFixed(decimals) : target) + suffix;
          }
        }

        requestAnimationFrame(updateCounter);
        obs.unobserve(counter);
      }
    });
  }, { threshold: 0.25 });

  counters.forEach(counter => observer.observe(counter));
}

/* ==========================================================================
   6. CINEMA VIDEO & REEL MODAL
   ========================================================================== */
function initCinemaModal() {
  const modal = document.getElementById('cinema-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalFrame = document.getElementById('modal-media-frame');
  const modalDirectLink = document.getElementById('modal-direct-link');
  const closeBtn = document.getElementById('modal-close-btn');

  if (!modal || !modalFrame) return;

  const triggers = document.querySelectorAll('[data-video-type]');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const type = trigger.getAttribute('data-video-type');
      const title = trigger.getAttribute('data-video-title') || 'Event Presentation';
      const desc = trigger.getAttribute('data-video-desc') || '';
      const src = trigger.getAttribute('data-video-src');
      const directUrl = trigger.getAttribute('data-video-link') || src;

      modalTitle.textContent = title;
      modalDesc.textContent = desc;
      modalDirectLink.href = directUrl;

      if (type === 'youtube') {
        modalFrame.innerHTML = `<iframe src="${src}?autoplay=1&rel=0&modestbranding=1" title="${title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      } else if (type === 'instagram') {
        modalFrame.innerHTML = `
          <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; text-align:center; padding:30px; background: radial-gradient(circle, #121829 0%, #060913 100%);">
            <div style="font-size:3.5rem; color:#e5b966; margin-bottom:16px;"><i class="fa-brands fa-instagram"></i></div>
            <h3 style="color:#fff; font-size:1.4rem; font-family:var(--font-heading); margin-bottom:10px;">${title}</h3>
            <p style="color:#cbd5e1; max-width:480px; margin-bottom:24px; font-size:0.95rem;">${desc}</p>
            <a href="${directUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-gold" style="font-size:0.95rem; padding:12px 28px;">
              <i class="fa-brands fa-instagram"></i> Open Official Instagram Reel
            </a>
            <span style="font-size:0.75rem; color:#94a3b8; margin-top:14px;">Direct Link: ${directUrl}</span>
          </div>`;
      }

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      playSound('open');
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    modalFrame.innerHTML = '';
    document.body.style.overflow = '';
    playSound('close');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   7. BRAND ECOSYSTEM FILTER TABS & SEARCH
   ========================================================================== */
function initEcosystemFilters() {
  const tabs = document.querySelectorAll('.eco-tab-btn');
  const cards = document.querySelectorAll('.eco-card');
  const searchInput = document.getElementById('eco-search-input');

  if (!tabs.length || !cards.length) return;

  function filterCards() {
    const activeTab = document.querySelector('.eco-tab-btn.active');
    const filter = activeTab ? activeTab.getAttribute('data-filter') : 'all';
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    cards.forEach(card => {
      const category = card.getAttribute('data-category');
      const title = card.querySelector('.eco-brand-title').textContent.toLowerCase();
      const handle = card.querySelector('.eco-handle').textContent.toLowerCase();

      const matchesTab = filter === 'all' || category === filter;
      const matchesSearch = !query || title.includes(query) || handle.includes(query);

      if (matchesTab && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      playSound('click');
      filterCards();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', filterCards);
  }
}

/* ==========================================================================
   8. INTERACTIVE ROI & REVENUE SCALING CALCULATOR
   ========================================================================== */
function initRoiCalculator() {
  const budgetSlider = document.getElementById('budget-slider');
  const budgetValDisplay = document.getElementById('budget-val-display');
  const calcLeads = document.getElementById('calc-leads');
  const calcImpressions = document.getElementById('calc-impressions');
  const calcVisits = document.getElementById('calc-visits');
  const calcPipeline = document.getElementById('calc-pipeline');
  const calcRevenue = document.getElementById('calc-revenue');

  if (!budgetSlider || !budgetValDisplay) return;

  function updateCalculator() {
    const budgetLakhs = parseFloat(budgetSlider.value);
    budgetValDisplay.textContent = `₹${budgetLakhs.toFixed(1)} Lakhs / Month`;

    const impressions = Math.round(budgetLakhs * 185000);
    const leads = Math.round(budgetLakhs * 110);
    const visits = Math.round(leads * 0.28);
    const pipelineCrores = Math.round(budgetLakhs * 45);
    const estimatedSalesCrores = (budgetLakhs * 7.5).toFixed(1);

    if (calcImpressions) calcImpressions.textContent = (impressions >= 1000000) ? (impressions / 1000000).toFixed(2) + 'M+' : Math.round(impressions / 1000) + 'K+';
    if (calcLeads) calcLeads.textContent = leads.toLocaleString() + '+';
    if (calcVisits) calcVisits.textContent = visits.toLocaleString() + '+ Qualified';
    if (calcPipeline) calcPipeline.textContent = `₹${pipelineCrores} Crores+`;
    if (calcRevenue) calcRevenue.textContent = `₹${estimatedSalesCrores} Cr+ Estimated`;
  }

  budgetSlider.addEventListener('input', () => {
    updateCalculator();
    playSound('slide');
  });

  updateCalculator();
}

/* ==========================================================================
   9. SYNTHESIZED SOUND ENGINE (Web Audio API)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = false;

function initSoundEngine() {
  const toggleBtn = document.getElementById('sound-toggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    soundEnabled = !soundEnabled;

    if (soundEnabled) {
      toggleBtn.classList.add('sound-on');
      toggleBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
      showToast("Audio FX Enabled", "Tactile luxury sound feedback active.");
      playSound('open');
    } else {
      toggleBtn.classList.remove('sound-on');
      toggleBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
      showToast("Audio FX Muted", "Sound effects turned off.");
    }
  });
}

function playSound(type) {
  if (!soundEnabled || !audioCtx) return;

  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'open') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.18);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === 'close') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(330, now + 0.15);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'slide') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    }
  } catch (err) {
    console.warn("Audio playback note:", err);
  }
}

/* ==========================================================================
   10. INTERACTIVE CONTACT & VIP BOOKING FORM
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('vip-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();
    const service = document.getElementById('contact-service').value;
    const notes = document.getElementById('contact-notes').value.trim();

    if (!name || !phone) {
      alert("Please provide your name and phone number so Satish can connect with you.");
      return;
    }

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.65 },
        colors: ['#e5b966', '#00e5ff', '#a855f7', '#ffffff']
      });
    }

    const message = encodeURIComponent(
      `Hello Satish,\n\nI am contacting you through your 3D Portfolio Website.\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Service Interested In:* ${service}\n*Details:* ${notes || 'Looking forward to discussing collaboration / event hosting.'}`
    );
    const waUrl = `https://wa.me/918464960327?text=${message}`;

    showToast("Booking Request Prepared!", "Redirecting you directly to Satish's WhatsApp...");

    setTimeout(() => {
      window.open(waUrl, '_blank');
      form.reset();
    }, 1200);
  });
}

function showToast(title, msg) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <div class="toast-icon"><i class="fa-solid fa-circle-check"></i></div>
    <div>
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${msg}</div>
    </div>
  `;

  toast.classList.add('active');
  setTimeout(() => {
    toast.classList.remove('active');
  }, 4500);
}

/* ==========================================================================
   11. NAVBAR SCROLL & ACTIVE LINK OBSERVER
   ========================================================================== */
function initNavbarScroll() {
  const header = document.querySelector('.header-nav');
  const navLinks = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (!header) return;

  const updateHeader = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);

    const marker = window.scrollY + Math.min(window.innerHeight * 0.36, 260);
    let currentId = '';
    sections.forEach(section => {
      if (section.offsetTop <= marker) currentId = section.id;
    });

    navLinks.forEach(link => {
      const isActive = currentId && link.getAttribute('href') === `#${currentId}`;
      link.classList.toggle('active', Boolean(isActive));
      if (isActive) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateHeader();
      ticking = false;
    });
  }, { passive: true });

  updateHeader();
}

/* ==========================================================================
   12. MOBILE NAVIGATION MENU TOGGLE
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const links = document.querySelector('.nav-links');
  const backdrop = document.getElementById('nav-backdrop');

  if (!toggle || !links) return;

  const setMenuState = (open) => {
    links.classList.toggle('nav-open', open);
    backdrop?.classList.toggle('active', open);
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close Navigation Menu' : 'Open Navigation Menu');
    toggle.innerHTML = open
      ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i>'
      : '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
  };

  toggle.addEventListener('click', () => {
    setMenuState(!links.classList.contains('nav-open'));
  });

  backdrop?.addEventListener('click', () => setMenuState(false));

  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMenuState(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && links.classList.contains('nav-open')) {
      setMenuState(false);
      toggle.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1180 && links.classList.contains('nav-open')) {
      setMenuState(false);
    }
  }, { passive: true });
}

/* ==========================================================================
   13. PREMIUM SCROLL PROGRESS
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('luxury-scroll-progress-bar');
  if (!progressBar) return;

  const update = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
    progressBar.style.transform = `scaleX(${progress})`;
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  }, { passive: true });

  window.addEventListener('resize', update, { passive: true });
  update();
}

/* ==========================================================================
   14. CINEMATIC SECTION REVEALS
   ========================================================================== */
function initLuxuryReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  const targets = document.querySelectorAll([
    '.section-tag',
    '.section-title',
    '.section-subtitle',
    '.metric-card',
    '.event-card',
    '.eco-card',
    '.timeline-card',
    '.skill-card',
    '.cred-card',
    '.host-skill-item',
    '.contact-info-card',
    '.contact-form-card',
    '.calculator-card',
    '.philosophy-banner'
  ].join(','));

  targets.forEach((el, index) => {
    el.classList.add('luxury-reveal');
    el.style.setProperty('--reveal-delay', `${Math.min((index % 5) * 65, 260)}ms`);

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.96 && rect.bottom > 0) {
      el.classList.add('is-visible');
    }
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

  targets.forEach(el => {
    if (!el.classList.contains('is-visible')) observer.observe(el);
  });

  // Safety fallback: content never remains hidden if an embedded browser throttles IntersectionObserver.
  window.setTimeout(() => {
    targets.forEach(el => el.classList.add('is-visible'));
  }, 2600);
}
