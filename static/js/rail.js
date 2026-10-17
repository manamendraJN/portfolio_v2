/* Certificate rail: native overflow-x + scroll-snap (works with touch and keyboard, no JS),
   enhanced with mouse dragging and previous/next arrow buttons. Scroll position is native; no animated properties here. */
export function initRail() {
  const rail = document.querySelector("[data-rail]");
  if (!rail) return;
  let down = false;
  let moved = false;
  let startX = 0;
  let startScroll = 0;

  rail.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    down = true;
    moved = false;
    startX = e.clientX;
    startScroll = rail.scrollLeft;
  });
  window.addEventListener("pointermove", (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 5) {
      moved = true;
      rail.classList.add("is-dragging");
    }
    if (moved) rail.scrollLeft = startScroll - dx;
  });
  const end = () => {
    if (!down) return;
    down = false;
    rail.classList.remove("is-dragging");
  };
  window.addEventListener("pointerup", end);
  window.addEventListener("pointercancel", end);
  // Do not follow a link when the gesture was a drag.
  rail.addEventListener("click", (e) => {
    if (moved) {
      e.preventDefault();
      e.stopPropagation();
      moved = false;
    }
  }, true);
  rail.querySelectorAll("a, img").forEach((n) => n.addEventListener("dragstart", (e) => e.preventDefault()));

  // Arrow buttons: scroll one card (plus gap) at a time; disabled at either end.
  const prev = document.querySelector("[data-rail-prev]");
  const next = document.querySelector("[data-rail-next]");
  if (prev && next) {
    const step = () => {
      const card = rail.querySelector("li");
      const gap = parseFloat(getComputedStyle(rail).columnGap) || 0;
      return card ? card.getBoundingClientRect().width + gap : rail.clientWidth * 0.8;
    };
    const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const go = (dir) => rail.scrollBy({ left: dir * step(), behavior: reduced() ? "auto" : "smooth" });
    const sync = () => {
      const max = rail.scrollWidth - rail.clientWidth - 2;
      prev.disabled = rail.scrollLeft <= 2;
      next.disabled = rail.scrollLeft >= max;
    };
    prev.addEventListener("click", () => go(-1));
    next.addEventListener("click", () => go(1));
    rail.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    rail.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    });
    sync();
  }
}
