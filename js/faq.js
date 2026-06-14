// ========== FAQ ACCORDION ==========

document.querySelectorAll('.faq-item').forEach(function (item) {
  item.addEventListener('click', function () {
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-item.open').forEach(function (i) {
      i.classList.remove('open');
    });
    // Toggle clicked
    if (!isOpen) item.classList.add('open');
  });
});
