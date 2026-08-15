/* Zafer KARACA · Hayatı Okuma — editorial scripts (legacy uyumlu) */

// JS aktif işareti — .reveal gizlemesi yalnızca bu sınıf varken uygulanır
document.documentElement.classList.add('js-ready');

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
  }, { threshold: 0.05, rootMargin: '0px 0px 0px 0px' });
  items.forEach((el) => observer.observe(el));
})();

// ── PIN'LENEN BÜTÜNSEL YAKLAŞIM (Novocura ScrollTrigger) ──
(function () {
  const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (rm) return; // pin ve timeline kurma; 4 adım normal akışta alt alta okunur

  if (!(window.gsap && window.ScrollTrigger)) return;
  const stageSection = document.getElementById('stageSection');
  if (!stageSection) return;

  gsap.registerPlugin(ScrollTrigger);
  document.body.classList.add('anim');

  const jpath = stageSection.querySelector('.journey-path .jline');
  const jsvg = stageSection.querySelector('.journey-path');
  let jlen = 0;

  function buildJourneyPath() {
    const w = jsvg.clientWidth, h = jsvg.clientHeight;
    const x = w * 0.5;
    const d = `M ${x.toFixed(1)} ${(-h * 0.06).toFixed(1)} L ${x.toFixed(1)} ${(h * 1.06).toFixed(1)}`;
    jsvg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    jpath.setAttribute('d', d);
    jlen = jpath.getTotalLength();
    jpath.style.strokeDasharray = jlen;
    jpath.style.strokeDashoffset = jlen;
  }
  buildJourneyPath();

  // başlangıçta tüm istasyonlar gizli
  gsap.set('.jstep .jbadge', { opacity: 0, scale: 0.3 });
  gsap.set('.jstep .jtext', { opacity: 0, y: 16 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#stageSection', start: 'top top', end: '+=4200',
      pin: true, scrub: 1.2,
      onUpdate: self => { document.getElementById('progressBar').style.width = (self.progress * 100) + '%'; }
    }
  });

  tl.to(jpath, { strokeDashoffset: 0, duration: 10, ease: 'none' }, 0);

  let jresize;
  window.addEventListener('resize', () => {
    clearTimeout(jresize);
    jresize = setTimeout(() => { buildJourneyPath(); tl.invalidate(); ScrollTrigger.refresh(); }, 250);
  });

  // 4 adım: ilk adım pin %0'ında görünür, her adım ~%25 pay alır.
  // Adım N, N+1 girmeden hemen önce söner → aynı anda tek adım görünür.
  const stationAt = [0, 2.6, 5.1, 7.6];
  gsap.utils.toArray('.jstep').forEach((step, i) => {
    const badge = step.querySelector('.jbadge');
    const text = step.querySelector('.jtext');
    const enter = stationAt[i];
    const exit = (i < stationAt.length - 1) ? stationAt[i + 1] - 0.4 : 10.2;
    tl.to(badge, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2.2)' }, enter);
    tl.to(badge, { opacity: 0, scale: 0.6, duration: 0.35, ease: 'power1.in', overwrite: 'auto' }, exit);
    tl.to(text, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, enter + 0.2);
    tl.to(text, { opacity: 0, duration: 0.35, ease: 'power1.in', overwrite: 'auto' }, exit);
  });
  tl.to({}, { duration: 0.5 }, 10.5);
})();