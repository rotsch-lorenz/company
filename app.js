/* Rotsch & Lorenz — Reveal beim Scrollen + mobiles Menue */
(function () {
  // ---- Mobiles Burger-Menue ----
  var burger = document.querySelector('.burger');
  var body = document.body;
  function closeMenu() {
    body.classList.remove('menu-open');
    if (burger) burger.setAttribute('aria-expanded', 'false');
  }
  function toggleMenu() {
    var open = body.classList.toggle('menu-open');
    if (burger) burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (burger) {
    burger.addEventListener('click', toggleMenu);
    document.querySelectorAll('.nav-m a, .menu-backdrop').forEach(function (el) {
      el.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', function () { if (window.innerWidth > 760) closeMenu(); });
  }

  // ---- Reveal beim Scrollen ----
  var els = [].slice.call(document.querySelectorAll('.reveal'));
  if (!els.length) return;
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion:reduce)').matches) {
    els.forEach(function (e) { e.classList.add('in'); });
    return;
  }
  var groups = {};
  els.forEach(function (e) {
    var p = e.parentElement; var k = p ? (p.className || 'root') : 'root';
    groups[k] = (groups[k] || 0);
    e.dataset.d = Math.min(groups[k] * 70, 280);
    groups[k]++;
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        var el = en.target;
        setTimeout(function () { el.classList.add('in'); }, +el.dataset.d || 0);
        io.unobserve(el);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
  els.forEach(function (e) { io.observe(e); });
  // Failsafe: was beim Laden schon sichtbar ist, sofort zeigen (kein leerer Hero)
  requestAnimationFrame(function () {
    var h = window.innerHeight || document.documentElement.clientHeight;
    els.forEach(function (e) {
      if (!e.classList.contains('in') && e.getBoundingClientRect().top < h * 0.92) {
        e.classList.add('in'); io.unobserve(e);
      }
    });
  });
})();
