/* Hover / focus / tap labels for the objects on the island. Plain DOM and one small tooltip element: no animation owned here. */
export function initIsland() {
  const scene = document.querySelector("[data-island]");
  const tip = scene && scene.querySelector("[data-hot-tip]");
  if (!scene || !tip) return;
  const hots = [...scene.querySelectorAll("[data-hot]")];
  let current = null;

  const show = (el) => {
    current = el;
    tip.textContent = el.dataset.hot;
    tip.hidden = false;
    const s = scene.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const w = tip.offsetWidth;
    const left = Math.min(Math.max(r.left + r.width / 2 - s.left - w / 2, 4), Math.max(4, s.width - w - 4));
    tip.style.left = `${left}px`;
    tip.style.top = `${Math.max(2, r.top - s.top - tip.offsetHeight - 10)}px`;
  };
  const hide = (el) => {
    if (current === el || !el) {
      tip.hidden = true;
      current = null;
    }
  };
  hots.forEach((el) => {
    el.addEventListener("pointerenter", () => show(el));
    el.addEventListener("pointerleave", () => hide(el));
    el.addEventListener("focus", () => show(el));
    el.addEventListener("blur", () => hide(el));
    el.addEventListener("click", () => (current === el && !tip.hidden && el.matches(":not(:hover)") ? hide(el) : show(el)));
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") hide(current); });
}
