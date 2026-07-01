(function () {
  const EVENT_ISO = (typeof CONFIG !== 'undefined' && CONFIG.EVENT?.iso)
    ? CONFIG.EVENT.iso
    : '2026-08-08T15:00:00';

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  if (!daysEl) return;

  const target = new Date(EVENT_ISO);

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function tick() {
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    daysEl.textContent = pad(days);
    hoursEl.textContent = pad(hours);
    minsEl.textContent = pad(mins);
    secsEl.textContent = pad(secs);
  }

  tick();
  setInterval(tick, 1000);
})();
