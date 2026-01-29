(() => {
  const el = document.getElementById("expiresAt");
  if (!el) return;
  const iso = el.textContent?.trim();
  if (!iso) return;
  const expires = new Date(iso);
  if (Number.isNaN(expires.getTime())) return;

  const container = document.getElementById("expiresCountdown") || document.createElement("div");
  if (!container.id) {
    container.id = "expiresCountdown";
  }
  if (!container.parentElement && el.parentElement) {
    el.parentElement.appendChild(container);
  }

  function tick() {
    const diff = expires.getTime() - Date.now();
    if (diff <= 0) {
      container.textContent = "00:00";
      return;
    }
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    container.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    window.requestAnimationFrame(() => setTimeout(tick, 250));
  }
  tick();
})();

