/* ================================================================
   SOTHEAREACH Sambath — Portfolio JS
   ================================================================ */

'use strict';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Navbar scroll state ───────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', onScroll, { passive: true });

function onScroll() {
  nav.classList.toggle('scrolled', window.scrollY > 40);
  updateActiveNav();
}

// ── Active nav link tracking ──────────────────────────────────────
const sectionIds = ['home', 'about', 'skills', 'projects', 'education', 'contact'];
const navItems   = {
  about:    document.getElementById('ni-about'),
  skills:   document.getElementById('ni-skills'),
  projects: document.getElementById('ni-projects'),
  education: document.getElementById('ni-education'),
  contact:  document.getElementById('ni-contact'),
};

function updateActiveNav() {
  const mid = window.scrollY + window.innerHeight * 0.4;
  sectionIds.forEach(id => {
    const sec = document.getElementById(id);
    const ni  = navItems[id];
    if (!sec || !ni) return;
    const inView = mid >= sec.offsetTop && mid < sec.offsetTop + sec.offsetHeight;
    ni.classList.toggle('active', inView);
  });
}

// ── Mobile burger ─────────────────────────────────────────────────
const burger  = document.getElementById('burger');
const navMenu = document.getElementById('navMenu');

burger.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
});

navMenu.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    navMenu.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// ── Scroll reveal ─────────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (!entry.isIntersecting) return;
    const el    = entry.target;
    const delay = parseFloat(el.dataset.delay || el.style.getPropertyValue('--i') || 0) * 80;
    setTimeout(() => el.classList.add('visible'), delay);
    revealObserver.unobserve(el);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Contact form ──────────────────────────────────────────────────
const form    = document.getElementById('contactForm');
const sendBtn = document.getElementById('send-message-btn');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const orig = sendBtn.innerHTML;
  sendBtn.disabled = true;
  sendBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
    Message sent!`;
  
  setTimeout(() => {
    sendBtn.innerHTML = orig;
    sendBtn.disabled = false;
    form.reset();
  }, 3200);
});

// ── Smooth scroll for anchor links ───────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ── Number counter on hero stats ─────────────────────────────────
function animateCounter(el, target, duration = 1000, suffix = '') {
  let start = null;
  const isSymbol = isNaN(parseInt(target));
  if (isSymbol) return; // skip ∞

  const end = parseInt(target);
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const val = Math.floor(progress * end);
    el.textContent = val + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = end + suffix;
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.hstat-num').forEach(num => {
      const val = num.textContent.trim();
      const suffix = val.includes('+') ? '+' : '';
      animateCounter(num, parseInt(val), 1000, suffix);
    });
    statsObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });

const statsRow = document.querySelector('.hero-stats');
if (statsRow) statsObserver.observe(statsRow);

// ── Diag steps stagger on enter ───────────────────────────────────
const diagSteps = document.querySelectorAll('.diag-step');
const diagObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    diagSteps.forEach((step, i) => {
      setTimeout(() => {
        step.style.opacity = '1';
        step.style.transform = 'translateY(0)';
      }, i * 120);
    });
    diagObserver.disconnect();
  });
}, { threshold: 0.4 });

if (!reduceMotion) diagSteps.forEach(s => {
  s.style.opacity = '0';
  s.style.transform = 'translateY(16px)';
  s.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});
const diagWrap = document.querySelector('.diag-flow');
if (diagWrap) diagObserver.observe(diagWrap);

// ── Init ──────────────────────────────────────────────────────────
onScroll(); // set initial active state

console.log(
  '%c SR %c SOTHEAREACH Sambath — Front-End Developer ',
  'background:#2f7d32;color:#fff;font-weight:900;padding:4px 8px;border-radius:4px 0 0 4px',
  'background:#f2f6ea;color:#2f7d32;font-weight:600;padding:4px 8px;border-radius:0 4px 4px 0;border:1px solid rgba(255,255,255,0.15)'
);
