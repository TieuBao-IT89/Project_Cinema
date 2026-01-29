(() => {
  const data = Array.isArray(window.__movieShowtimes) ? window.__movieShowtimes : [];
  const cinemaEl = document.getElementById("md-cinema");
  const dateEl = document.getElementById("md-date");
  const showtimeEl = document.getElementById("md-showtime");
  const bookBtn = document.getElementById("md-bookNow");
  const hintEl = document.getElementById("md-hint");

  if (!cinemaEl || !dateEl || !showtimeEl || !bookBtn) return;

  function uniqBy(arr, keyFn) {
    const seen = new Set();
    const out = [];
    arr.forEach((x) => {
      const k = keyFn(x);
      if (seen.has(k)) return;
      seen.add(k);
      out.push(x);
    });
    return out;
  }

  function setHint(text) {
    if (!hintEl) return;
    if (!text) {
      hintEl.style.display = "none";
      hintEl.textContent = "";
      return;
    }
    hintEl.style.display = "block";
    hintEl.textContent = text;
  }

  function populateDates() {
    const dates = uniqBy(
      data
        .slice()
        .sort((a, b) => String(a.dateKey).localeCompare(String(b.dateKey))),
      (x) => x.dateKey
    );

    dateEl.innerHTML = "";
    const fmt = new Intl.DateTimeFormat("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit" });

    dates.forEach((d) => {
      const opt = document.createElement("option");
      opt.value = d.dateKey;
      const dt = new Date(d.dateKey + "T00:00:00");
      opt.textContent = Number.isNaN(dt.getTime()) ? d.dateKey : fmt.format(dt);
      dateEl.appendChild(opt);
    });

    if (dates.length === 0) {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "Chưa có lịch chiếu";
      dateEl.appendChild(opt);
    }
  }

  function cinemasForDate(dateKey) {
    const list = data.filter((x) => x.dateKey === dateKey);
    const cinemas = uniqBy(list, (x) => String(x.cinemaId)).sort((a, b) =>
      String(a.cinemaName).localeCompare(String(b.cinemaName))
    );
    return cinemas;
  }

  function populateCinemas() {
    const dateKey = dateEl.value;
    const cinemas = cinemasForDate(dateKey);
    cinemaEl.innerHTML = "";

    cinemas.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = String(c.cinemaId);
      opt.textContent = c.cinemaName;
      cinemaEl.appendChild(opt);
    });

    if (cinemas.length === 0) {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "Chưa có rạp";
      cinemaEl.appendChild(opt);
    }
  }

  function showtimesForSelection() {
    const dateKey = dateEl.value;
    const cinemaId = cinemaEl.value;
    return data
      .filter((x) => x.dateKey === dateKey && String(x.cinemaId) === String(cinemaId))
      .slice()
      .sort((a, b) => String(a.time).localeCompare(String(b.time)));
  }

  function populateShowtimes() {
    const slots = showtimesForSelection();
    showtimeEl.innerHTML = "";

    slots.forEach((s) => {
      const opt = document.createElement("option");
      opt.value = String(s.showtimeId);
      const room = s.roomName ? `${s.roomName} (${s.roomType || ""})` : "";
      const price = s.basePrice != null ? `${Number(s.basePrice).toLocaleString("vi-VN")}đ` : "";
      opt.textContent = `${s.time}${room ? " • " + room : ""}${price ? " • " + price : ""}`;
      showtimeEl.appendChild(opt);
    });

    if (slots.length === 0) {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "Chưa có suất";
      showtimeEl.appendChild(opt);
      bookBtn.disabled = true;
      setHint("Hiện chưa có lịch chiếu cho lựa chọn này.");
      return;
    }

    bookBtn.disabled = false;
    setHint("");
  }

  function init() {
    populateDates();
    if (!dateEl.value && dateEl.options.length > 0) dateEl.value = dateEl.options[0].value;
    populateCinemas();
    if (!cinemaEl.value && cinemaEl.options.length > 0) cinemaEl.value = cinemaEl.options[0].value;
    populateShowtimes();
  }

  dateEl.addEventListener("change", () => {
    populateCinemas();
    if (cinemaEl.options.length > 0) cinemaEl.value = cinemaEl.options[0].value;
    populateShowtimes();
  });

  cinemaEl.addEventListener("change", () => {
    populateShowtimes();
  });

  showtimeEl.addEventListener("change", () => {
    bookBtn.disabled = !showtimeEl.value;
  });

  bookBtn.addEventListener("click", () => {
    const showtimeId = showtimeEl.value;
    if (!showtimeId) return;

    const selected = data.find((x) => String(x.showtimeId) === String(showtimeId));
    if (selected) {
      const bookingData = {
        movie: document.querySelector(".movie-banner-title")?.textContent?.trim() || document.title || "",
        cinema: selected.cinemaName || "",
        date: selected.dateKey || "",
        time: selected.time || "",
        format: selected.roomName ? `${selected.roomName} (${selected.roomType || ""})` : "",
        price: selected.basePrice != null ? `${Number(selected.basePrice).toLocaleString("vi-VN")}đ` : "",
        showtimeId: showtimeId,
      };
      try {
        sessionStorage.setItem("bookingData", JSON.stringify(bookingData));
      } catch {}
    }

    window.location.href = `/Seat/Index?showtimeId=${encodeURIComponent(showtimeId)}`;
  });

  init();
})();

