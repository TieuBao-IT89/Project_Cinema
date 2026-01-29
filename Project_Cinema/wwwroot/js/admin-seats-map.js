(() => {
  const roomSelect = document.getElementById("roomSelect");
  const seatButtons = Array.from(document.querySelectorAll(".seat-btn"));
  const tokenInput = document.querySelector('input[name="__RequestVerificationToken"]');

  const seatCodeEl = document.getElementById("seatCode");
  const seatTypeEl = document.getElementById("seatType");
  const seatStatusEl = document.getElementById("seatStatus");
  const saveBtn = document.getElementById("saveSeatBtn");
  const toast = document.getElementById("editorToast");

  let selectedSeatBtn = seatButtons.find((b) => b.classList.contains("is-selected")) || seatButtons[0] || null;

  function showToast(message, kind = "info") {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    toast.style.borderColor = kind === "success" ? "#bbf7d0" : kind === "error" ? "#fecaca" : "#e2e8f0";
    toast.style.background = kind === "success" ? "#f0fdf4" : kind === "error" ? "#fef2f2" : "#f8fafc";
    toast.style.color = kind === "success" ? "#166534" : kind === "error" ? "#991b1b" : "#334155";
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => toast.classList.remove("show"), 2200);
  }

  function applySelected(btn) {
    if (!btn) return;
    seatButtons.forEach((b) => b.classList.remove("is-selected"));
    btn.classList.add("is-selected");
    selectedSeatBtn = btn;

    const row = btn.dataset.seatRow || "";
    const number = btn.dataset.seatNumber || "";
    const type = btn.dataset.seatType || "regular";
    const status = btn.dataset.seatStatus || "active";

    if (seatCodeEl) seatCodeEl.textContent = `${row}${number}`;
    if (seatTypeEl) seatTypeEl.value = type;
    if (seatStatusEl) seatStatusEl.value = status;
  }

  async function saveSeat() {
    if (!selectedSeatBtn) return;
    const seatId = selectedSeatBtn.dataset.seatId;
    const seatType = seatTypeEl ? seatTypeEl.value : "regular";
    const status = seatStatusEl ? seatStatusEl.value : "active";

    try {
      saveBtn && (saveBtn.disabled = true);

      const body = new URLSearchParams();
      body.set("SeatId", String(seatId));
      body.set("SeatType", String(seatType));
      body.set("Status", String(status));
      if (tokenInput?.value) body.set("__RequestVerificationToken", tokenInput.value);

      const res = await fetch("/Admin/Seats/UpdateSeat", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body,
      });

      if (!res.ok) {
        showToast("Lưu thất bại. Thử lại nhé.", "error");
        return;
      }

      // Update dataset + classes on the button
      selectedSeatBtn.dataset.seatType = seatType;
      selectedSeatBtn.dataset.seatStatus = status;

      selectedSeatBtn.classList.remove("seat-type-regular", "seat-type-vip", "seat-type-couple");
      selectedSeatBtn.classList.add(`seat-type-${seatType}`);

      selectedSeatBtn.classList.remove("seat-status-active", "seat-status-inactive");
      selectedSeatBtn.classList.add(`seat-status-${status}`);

      showToast("Đã lưu ghế.", "success");
    } catch (e) {
      showToast("Có lỗi khi lưu.", "error");
    } finally {
      saveBtn && (saveBtn.disabled = false);
    }
  }

  // Auto-submit room filter
  if (roomSelect) {
    roomSelect.addEventListener("change", () => {
      roomSelect.form && roomSelect.form.submit();
    });
  }

  seatButtons.forEach((btn) => {
    btn.addEventListener("click", () => applySelected(btn));
  });

  if (saveBtn) {
    saveBtn.addEventListener("click", saveSeat);
  }

  // Init editor
  if (selectedSeatBtn) applySelected(selectedSeatBtn);
})();

