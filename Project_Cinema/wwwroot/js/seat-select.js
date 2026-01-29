(() => {
  const seatButtons = Array.from(document.querySelectorAll(".seat[data-seat-id]"));
  const selectedInput = document.getElementById("selectedSeatIds");
  const summarySeats = document.getElementById("summarySeats");
  const summaryTotal = document.getElementById("summaryTotal");
  const continueBtn = document.getElementById("continueBtn");

  const selected = new Map(); // seatId -> { code, price }

  function formatVnd(n) {
    try {
      return new Intl.NumberFormat("vi-VN").format(n) + "đ";
    } catch {
      return n + "đ";
    }
  }

  function sync() {
    const ids = Array.from(selected.keys());
    selectedInput.value = ids.join(",");

    const codes = Array.from(selected.values()).map((x) => x.code);
    const total = Array.from(selected.values()).reduce((s, x) => s + x.price, 0);

    summarySeats.textContent = codes.length ? codes.join(", ") : "--";
    summaryTotal.textContent = formatVnd(total);

    continueBtn.disabled = ids.length === 0;
  }

  function toggle(btn) {
    const seatId = btn.dataset.seatId;
    const code = btn.dataset.seatCode || "";
    const price = Number(btn.dataset.seatPrice || 0);

    if (selected.has(seatId)) {
      selected.delete(seatId);
      btn.classList.remove("is-selected");
    } else {
      selected.set(seatId, { code, price });
      btn.classList.add("is-selected");
    }
    sync();
  }

  seatButtons.forEach((btn) => {
    if (btn.disabled) return;
    btn.addEventListener("click", () => toggle(btn));
  });

  // Convert comma string to multiple fields on submit so MVC binds List<long>
  const form = document.getElementById("seatForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      const ids = Array.from(selected.keys());
      // remove any previous generated inputs
      form.querySelectorAll('input[name="SelectedSeatIds"]').forEach((el) => el.remove());
      ids.forEach((id) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "SelectedSeatIds";
        input.value = id;
        form.appendChild(input);
      });
      if (ids.length === 0) {
        e.preventDefault();
      }
    });
  }

  sync();
})();

