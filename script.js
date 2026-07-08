// ============================================
// THEME TOGGLE
// ============================================
const body = document.body;
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('.theme-icon');

function setTheme(theme) {
  body.setAttribute('data-theme', theme);
  themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('portfolio-theme', theme);
}

const savedTheme = localStorage.getItem('portfolio-theme') ||
  (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = body.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

// ============================================
// TAB NAVIGATION
// ============================================
const tabs = document.querySelectorAll('.tab');
const sections = document.querySelectorAll('.section');
const tabBar = document.querySelector('.tab-bar');
const mobileNavToggle = document.getElementById('mobile-nav-toggle');

function goToSection(targetId) {
  const el = document.getElementById(targetId);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
  tabBar.classList.remove('open');
}

document.querySelectorAll('[data-target]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    goToSection(el.getAttribute('data-target'));
  });
});

mobileNavToggle.addEventListener('click', () => {
  tabBar.classList.toggle('open');
});

// Highlight active tab based on scroll position
const observerOptions = { root: null, rootMargin: '-45% 0px -45% 0px', threshold: 0 };
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      tabs.forEach(tab => {
        tab.classList.toggle('active', tab.getAttribute('data-target') === id);
      });
    }
  });
}, observerOptions);
sections.forEach(section => sectionObserver.observe(section));

// ============================================
// SCROLL REVEAL
// ============================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.section:not(.hero-section)').forEach(sec => revealObserver.observe(sec));

// ============================================
// TYPING ANIMATION (hero role)
// ============================================
const roles = [
  'Full-Stack Developer (in training)',
  'B.Tech IT Student',
  'Frontend Enthusiast',
  'Fast Learner'
];
const typedEl = document.getElementById('typed-role');
let roleIndex = 0, charIndex = 0, deleting = false;

function typeLoop() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    typedEl.textContent = roles[0];
    return;
  }
  const current = roles[roleIndex];
  if (!deleting) {
    charIndex++;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1400);
      return;
    }
  } else {
    charIndex--;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 40 : 65);
}
typeLoop();

// ============================================
// PROJECT SEARCH
// ============================================
const searchInput = document.getElementById('project-search');
const projectCards = document.querySelectorAll('.project-card');
const noResults = document.getElementById('no-results');

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;
  projectCards.forEach(card => {
    const match = card.getAttribute('data-search').includes(query);
    card.style.display = match ? '' : 'none';
    if (match) visibleCount++;
  });
  noResults.hidden = visibleCount !== 0;
});

// ============================================
// CONTACT FORM (mailto fallback, no backend)
// ============================================
const contactForm = document.getElementById('contact-form');
const formNote = document.getElementById('form-note');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  const subject = encodeURIComponent(`Portfolio contact from ${name}`);
  const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
  const mailtoLink = `mailto:harshrpatel14491@gmail.com?subject=${subject}&body=${body}`;

  formNote.hidden = false;
  window.location.href = mailtoLink;
});

// ============================================
// FOOTER YEAR
// ============================================
document.getElementById('footer-year').textContent = new Date().getFullYear();

// ============================================
// INTERACTIVE BACKGROUND CANVAS (subtle circuit-grid dots that drift toward cursor)
// ============================================
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let width, height, dots = [];
let mouse = { x: null, y: null };
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  initDots();
}

function initDots() {
  const spacing = 46;
  dots = [];
  for (let x = spacing / 2; x < width; x += spacing) {
    for (let y = spacing / 2; y < height; y += spacing) {
      dots.push({ baseX: x, baseY: y, x, y });
    }
  }
}

function getAccentColor() {
  const theme = body.getAttribute('data-theme');
  return theme === 'dark' ? 'rgba(179,136,255,' : 'rgba(124,58,237,';
}

// ============================================
// GLOW BLOB — follows the cursor for ambient light
// ============================================
const glowBlob = document.getElementById('glow-blob');
if (glowBlob && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let blobX = window.innerWidth / 2, blobY = window.innerHeight / 2;
  let targetX = blobX, targetY = blobY;
  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });
  function animateBlob() {
    blobX += (targetX - blobX) * 0.06;
    blobY += (targetY - blobY) * 0.06;
    glowBlob.style.transform = `translate(${blobX}px, ${blobY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateBlob);
  }
  animateBlob();
}

function animateDots() {
  ctx.clearRect(0, 0, width, height);
  const accent = getAccentColor();
  dots.forEach(dot => {
    let dx = 0, dy = 0, dist = Infinity;
    if (mouse.x !== null) {
      dx = mouse.x - dot.baseX;
      dy = mouse.y - dot.baseY;
      dist = Math.sqrt(dx * dx + dy * dy);
    }
    const influence = Math.max(0, 1 - dist / 180);
    const targetX = dot.baseX - dx * influence * 0.15;
    const targetY = dot.baseY - dy * influence * 0.15;
    dot.x += (targetX - dot.x) * 0.08;
    dot.y += (targetY - dot.y) * 0.08;

    const radius = 1 + influence * 1.8;
    const alpha = 0.12 + influence * 0.35;
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = accent + alpha + ')';
    ctx.fill();
  });
  requestAnimationFrame(animateDots);
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
window.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

resizeCanvas();
if (!prefersReducedMotion) {
  animateDots();
} else {
  // static, minimal render for reduced-motion users
  ctx.clearRect(0, 0, width, height);
  const accent = getAccentColor();
  dots.forEach(dot => {
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, 1, 0, Math.PI * 2);
    ctx.fillStyle = accent + '0.15)';
    ctx.fill();
  });
}
