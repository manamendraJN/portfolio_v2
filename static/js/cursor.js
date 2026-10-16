/* Mouse tailer: a small dot plus a lagging ring that grows over interactive elements.
   Fine pointers only, never under reduced motion, and the native cursor stays visible.
   Owner of the transform on the two cursor elements: this module. The loop runs only while the
   ring is still catching up with the pointer, so nothing runs when the mouse is idle. */
export function initCursor() {
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!fine.matches || reduced.matches) return;

  const ring = document.createElement("div");
  const dot = document.createElement("div");
  ring.className = "cursor-ring";
  dot.className = "cursor-dot";
  // Hand-drawn, slightly open ring: the stroke overshoots its start like a pen circle.
  ring.innerHTML = '<svg viewBox="0 0 40 40" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 3.5C31 4 37.5 11 36.5 21.5C35.5 31 28 37 19 36.5C10 36 3.5 29 4.5 19.5C5.5 11 12 5 20.5 4.5C24 4.3 27 5.5 29.5 7.5"/></svg>';
  [ring, dot].forEach((n) => n.setAttribute("aria-hidden", "true"));
  document.body.append(ring, dot);

  const pos = { x: -100, y: -100 };
  const rpos = { x: -100, y: -100 };
  let scale = 1;
  let target = 1;
  let raf = 0;
  let seen = false;

  const draw = () => {
    rpos.x += (pos.x - rpos.x) * 0.16;
    rpos.y += (pos.y - rpos.y) * 0.16;
    scale += (target - scale) * 0.2;
    ring.style.transform = `translate3d(${rpos.x}px,${rpos.y}px,0) scale(${scale})`;
    const settled = Math.abs(pos.x - rpos.x) < 0.1 && Math.abs(pos.y - rpos.y) < 0.1 && Math.abs(target - scale) < 0.01;
    raf = settled ? 0 : requestAnimationFrame(draw);
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(draw); };

  window.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    pos.x = e.clientX;
    pos.y = e.clientY;
    dot.style.transform = `translate3d(${pos.x}px,${pos.y}px,0)`;
    if (!seen) {
      seen = true;
      rpos.x = pos.x;
      rpos.y = pos.y;
      document.documentElement.classList.add("has-cursor");
    }
    const el = e.target instanceof Element ? e.target : null;
    const interactive = el && el.closest("a, button, [role=button], summary, .rail, .nrow");
    target = interactive ? (el.closest(".rail") && !el.closest("a") ? 1.7 : 1.9) : 1;
    ring.classList.toggle("is-dark", !!(el && el.closest(".on-dark")));
    kick();
  }, { passive: true });

  document.addEventListener("pointerdown", () => { target = 0.7; kick(); });
  document.addEventListener("pointerup", () => { target = 1; kick(); });
  document.documentElement.addEventListener("pointerleave", () => document.documentElement.classList.remove("has-cursor"));
  document.documentElement.addEventListener("pointerenter", () => { if (seen) document.documentElement.classList.add("has-cursor"); });
}
