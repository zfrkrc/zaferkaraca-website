/* Zafer KARACA · Hayatı Okuma — editorial scripts (legacy uyumlu) */

// ── MOBILE NAV ─────────────────────────────────────────
function toggleNav() {
  const navLinks = document.getElementById('navLinks');
  const toggle = document.querySelector('.nav-toggle');
  if (navLinks) {
    const willOpen = !navLinks.classList.contains('open');
    navLinks.classList.toggle('open');
    if (toggle) {
      toggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      toggle.classList.toggle('open', willOpen);
    }
    document.body.style.overflow = willOpen ? 'hidden' : '';
  }
}

// ── NEWSLETTER (legacy static handler) ─────────────────
function handleNewsletter(event) {
  event.preventDefault();
  const input = event.target.querySelector('input[type="email"]');
  if (input && input.value) {
    const btn = event.target.querySelector('button');
    const original = btn.textContent;
    btn.textContent = 'Abone Olundu!';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
      input.value = '';
    }, 2000);
  }
}

// ── THEME ──────────────────────────────────────────────
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const btn = document.querySelector('.theme-toggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

updateThemeIcon(document.documentElement.getAttribute('data-theme'));

// ── CLOSE MOBILE MENU ──────────────────────────────────
document.addEventListener('click', (e) => {
  const nav = document.querySelector('.nav');
  const navLinks = document.getElementById('navLinks');
  const toggle = document.querySelector('.nav-toggle');
  if (nav && navLinks && !nav.contains(e.target)) {
    navLinks.classList.remove('open');
    if (toggle) { toggle.setAttribute('aria-expanded', 'false'); toggle.classList.remove('open'); }
    document.body.style.overflow = '';
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const navLinks = document.getElementById('navLinks');
    if (navLinks && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      const toggle = document.querySelector('.nav-toggle');
      if (toggle) { toggle.setAttribute('aria-expanded', 'false'); toggle.classList.remove('open'); }
      document.body.style.overflow = '';
    }
  }
});
// nav-links içindeki link tıklayınca menüyü kapat (fullscreen menü)
document.getElementById('navLinks')?.addEventListener('click', (e) => {
  if (e.target.closest('a')) {
    document.getElementById('navLinks').classList.remove('open');
    const toggle = document.querySelector('.nav-toggle');
    if (toggle) { toggle.setAttribute('aria-expanded', 'false'); toggle.classList.remove('open'); }
    document.body.style.overflow = '';
  }
});

// ── STICKY NAV RAISE ───────────────────────────────────
// scroll'da nav arka planını belirginleştir
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  nav.style.borderBottomColor = window.scrollY > 40 ? 'var(--ed-line)' : 'var(--ed-line-soft)';
}, { passive: true });

// ── SCROLL REVEAL (editorial) ──────────────────────────
(function () {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('visible'));
    return;
  }
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    items.forEach((el) => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  items.forEach((el) => observer.observe(el));
})();