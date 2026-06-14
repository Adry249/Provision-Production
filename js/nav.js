// ========== NAVIGATION ==========

const burger   = document.getElementById('burger');
const navMobile = document.getElementById('navMobile');

burger.addEventListener('click', function () {
  burger.classList.toggle('open');
  navMobile.classList.toggle('open');
  document.body.style.overflow = navMobile.classList.contains('open') ? 'hidden' : '';
});

// Close on any nav-mobile link click
navMobile.querySelectorAll('a').forEach(function (a) {
  a.addEventListener('click', function () {
    burger.classList.remove('open');
    navMobile.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close when clicking outside
document.addEventListener('click', function (e) {
  const nav = document.getElementById('navbar');
  if (navMobile.classList.contains('open') && !nav.contains(e.target) && !navMobile.contains(e.target)) {
    burger.classList.remove('open');
    navMobile.classList.remove('open');
    document.body.style.overflow = '';
  }
});
