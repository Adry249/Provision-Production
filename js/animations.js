// ========== SCROLL ANIMATIONS ==========

// Scroll-to-top button
const scrollBtn = document.getElementById('scrollTop');
if (scrollBtn) {
  scrollBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

window.addEventListener('scroll', function () {
  if (scrollBtn) scrollBtn.classList.toggle('visible', window.scrollY > 400);
});

// Fade-up
const fadeSelectors = [
  '.fw-card', '.svc-card', '.case-card', '.price-card',
  '.about-num-card', '.process-step', '.faq-item',
  '.founder-card', '.value-item',
].join(', ');

const observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll(fadeSelectors).forEach(function (el) {
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(22px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// Smooth anchor scrolling
document.querySelectorAll('a[href^="#"]').forEach(function (a) {
  a.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top: top, behavior: 'smooth' });
  });
});

function openImage(src)
{
    document.getElementById("modalImage").src = src;

    document
        .getElementById("imageModal")
        .classList.add("active");
}

document
.getElementById("imageModal")
.addEventListener("click", function(e)
{
    if(
        e.target === this ||
        e.target.classList.contains("close-modal")
    )
    {
        this.classList.remove("active");
    }
});
