// ========== COUNTDOWN TIMER ==========
// Counts down 60 minutes from page load — resets on refresh (intentional for UX)

(function () {
  const DURATION_MS = 60 * 60 * 1000; // 60 minutes
  const endTime = Date.now() + DURATION_MS;

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function update() {
    const el = document.getElementById('timer');
    if (!el) return;

    const remaining = endTime - Date.now();

    if (remaining <= 0) {
      el.textContent = '00:00';
      return;
    }

    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    el.textContent = pad(minutes) + ':' + pad(seconds);
  }

  update();
  setInterval(update, 1000);
})();
