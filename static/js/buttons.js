/* Button micro-interactions. Owner of the transform on [data-btn] elements (and their icon): Motion. */
import { animate } from "../vendor/motion.js";

export function initButtons() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const spring = { type: "spring", stiffness: 420, damping: 22 };
  document.querySelectorAll("[data-btn]").forEach((btn) => {
    const icon = btn.querySelector(".icon");
    const to = (scale, shift) => {
      animate(btn, { scale }, spring);
      if (icon) animate(icon, { x: shift, y: -shift * 0.4 }, spring);
    };
    btn.addEventListener("pointerenter", () => to(1.04, 3));
    btn.addEventListener("pointerleave", () => to(1, 0));
    btn.addEventListener("focus", () => to(1.04, 3));
    btn.addEventListener("blur", () => to(1, 0));
    btn.addEventListener("pointerdown", () => animate(btn, { scale: 0.96 }, spring));
    btn.addEventListener("pointerup", () => animate(btn, { scale: 1.04 }, spring));
  });
}
