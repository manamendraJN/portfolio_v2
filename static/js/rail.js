/* Certificate rail: native overflow-x + scroll-snap (works with touch and keyboard, no JS),
   enhanced with mouse dragging. Scroll position is native; no animated properties here. */
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
}
