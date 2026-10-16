/* Stacking layers: sets --stick-top on every section so each one sticks (top edge when shorter than the
   viewport, bottom edge when taller) while the next section slides over it. Pure layout: no animation,
   no scroll listeners. Recomputed when a section or the viewport resizes. */
export function initLayers() {
  const layers = [...document.querySelectorAll(".layer, [data-hero-track]")];
  if (!layers.length) return;
  const apply = () => {
    const vh = window.innerHeight;
    layers.forEach((el) => {
      el.style.setProperty("--stick-top", `${Math.min(0, vh - el.offsetHeight)}px`);
    });
  };
  apply();
  window.addEventListener("resize", apply);
  if ("ResizeObserver" in window) {
    const ro = new ResizeObserver(apply);
    layers.forEach((el) => ro.observe(el));
  }
}
