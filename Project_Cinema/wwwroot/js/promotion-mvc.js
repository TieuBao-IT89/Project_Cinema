(() => {
  const form = document.querySelector(".filter-bar");
  const typeFilter = document.getElementById("type-filter");
  const statusFilter = document.getElementById("status-filter");
  const searchInput = document.getElementById("search-input");
  const resetBtn = document.getElementById("resetFilterBtn");

  function submit() {
    if (!form) return;
    form.submit();
  }

  if (typeFilter) typeFilter.addEventListener("change", submit);
  if (statusFilter) statusFilter.addEventListener("change", submit);
  if (searchInput) {
    let t;
    searchInput.addEventListener("input", () => {
      window.clearTimeout(t);
      t = window.setTimeout(submit, 350);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (!form) return;
      if (typeFilter) typeFilter.value = "all";
      if (statusFilter) statusFilter.value = "all";
      if (searchInput) searchInput.value = "";
      submit();
    });
  }
})();

window.openPromotionModal = function (btn) {
  const modal = document.getElementById("promoModal");
  if (!modal) return;

  const title = btn?.dataset?.title || "Chi tiết khuyến mãi";
  const desc = btn?.dataset?.desc || "";
  const code = btn?.dataset?.code || "--";
  const range = btn?.dataset?.range || "--";

  const titleEl = document.getElementById("promoModalTitle");
  const codeEl = document.getElementById("promoModalCode");
  const rangeEl = document.getElementById("promoModalRange");
  const descEl = document.getElementById("promoModalDesc");

  if (titleEl) titleEl.textContent = title;
  if (codeEl) codeEl.textContent = code || "--";
  if (rangeEl) rangeEl.textContent = range;
  if (descEl) descEl.textContent = desc;

  modal.style.display = "block";
  document.body.style.overflow = "hidden";
};

window.closePromotionModal = function () {
  const modal = document.getElementById("promoModal");
  if (!modal) return;
  modal.style.display = "none";
  document.body.style.overflow = "";
};

window.copyPromotionCodeFromModal = async function () {
  const codeEl = document.getElementById("promoModalCode");
  const code = codeEl?.textContent?.trim() || "";
  if (!code || code === "--") return;
  try {
    await navigator.clipboard.writeText(code);
    alert("Đã sao chép mã: " + code);
  } catch {
    alert("Không thể sao chép. Mã: " + code);
  }
};

window.usePromotion = async function (code) {
  const c = (code || "").trim();
  if (!c) {
    window.location.href = "/Showtime/Index";
    return;
  }
  try {
    await navigator.clipboard.writeText(c);
  } catch {
    // ignore
  }
  // Redirect to showtime page (later we can auto-apply at checkout)
  window.location.href = "/Showtime/Index";
};

