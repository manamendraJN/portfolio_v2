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
    // Own scroll animation: independent of browser smooth-scroll and scroll-snap quirks, so both buttons and keys always move it.
    let anim = 0;
    const go = (dir) => {
      const max = rail.scrollWidth - rail.clientWidth;
      const from = rail.scrollLeft;
      const to = Math.max(0, Math.min(max, Math.round(from / step()) * step() + dir * step()));
      cancelAnimationFrame(anim);
      if (reduced()) { rail.scrollLeft = to; sync(); return; }
      rail.style.scrollSnapType = "none";
      const t0 = performance.now();
      const dur = 450;
      const tick = (now) => {
        const k = Math.min(1, (now - t0) / dur);
        rail.scrollLeft = from + (to - from) * (1 - Math.pow(1 - k, 3));
        if (k < 1) anim = requestAnimationFrame(tick);
        else { rail.style.scrollSnapType = ""; sync(); }
      };
      anim = requestAnimationFrame(tick);
    };
    const sync = () => {
      const max = rail.scrollWidth - rail.clientWidth - 2;
      prev.disabled = rail.scrollLeft <= 2;
      next.disabled = rail.scrollLeft >= max;
    };
    prev.addEventListener("click", () => go(-1));
    next.addEventListener("click", () => go(1));
    rail.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    // Left/Right arrow keys move the slider whenever the gallery is on screen (no need to focus it first).
    const section = document.getElementById("certificates");
    let visible = false;
    if (section && "IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0.35 }).observe(section);
    }
    document.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const t = e.target;
      const typing = t instanceof Element && t.closest("input, textarea, select, [contenteditable]");
      if (typing || (!visible && !rail.contains(t))) return;
      if (document.querySelector("[data-overlay][data-open]")) return;
      e.preventDefault();
      go(e.key === "ArrowRight" ? 1 : -1);
    });
    sync();
  }
}
