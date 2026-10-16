/* Mouse tailer: a wet-paint brush trail. Soft bristle strokes in the site's palette follow the pointer
   and dry out (fade) within a second. Fine pointers only, never under reduced motion, and the native
   cursor stays visible. The canvas loop runs only while paint is visible, so nothing runs when idle. */
export function initCursor() {
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!fine.matches || reduced.matches) return;

  const canvas = document.createElement("canvas");
  canvas.className = "paint-trail";
  canvas.setAttribute("aria-hidden", "true");
  const tip = document.createElement("div");
  tip.className = "cursor-dot";
  tip.setAttribute("aria-hidden", "true");
  document.body.append(canvas, tip);
  const ctx = canvas.getContext("2d");

  const LIGHT = ["#C2411F", "#D9A441", "#6F8FAE", "#7F9477"];
  const DARK = ["#D9A441", "#9DB4C8", "#F5F0E6", "#7F9477"];
  let palette = LIGHT;
  let w = 0;
  let h = 0;
  const resize = () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener("resize", resize);

  let last = null;
  let size = 1;
  let sizeTarget = 1;
  let travelled = 0;
  let idle = 0;
  let raf = 0;
  let queue = [];

  const color = () => palette[Math.floor(travelled / 260) % palette.length];

  const paint = (a, b) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 0.5) return;
    travelled += dist;
    const nx = -dy / dist;
    const ny = dx / dist;
    const width = Math.max(2.5, 13 - dist * 0.18) * size;
    ctx.lineCap = "round";
    ctx.strokeStyle = color();
    // Three bristles of different widths and offsets read as a loaded flat brush.
    [[-0.6, 0.55, 0.8], [0, 1, 0.9], [0.6, 0.5, 0.75]].forEach(([off, k, alpha]) => {
      ctx.globalAlpha = alpha;
      ctx.lineWidth = width * k;
      ctx.beginPath();
      ctx.moveTo(a.x + nx * off * width, a.y + ny * off * width);
      ctx.lineTo(b.x + nx * off * width, b.y + ny * off * width);
      ctx.stroke();
    });
    ctx.globalAlpha = 1;
  };

  const frame = () => {
    size += (sizeTarget - size) * 0.2;
    // Paint dries: fade everything slightly each frame.
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0,0,0,0.04)";
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "source-over";
    for (let i = 1; i < queue.length; i++) paint(queue[i - 1], queue[i]);
    queue = queue.length ? [queue[queue.length - 1]] : [];
    idle++;
    if (idle > 150) {
      ctx.clearRect(0, 0, w, h);
      raf = 0;
      idle = 0;
      return;
    }
    raf = requestAnimationFrame(frame);
  };
  const kick = () => { idle = 0; if (!raf) raf = requestAnimationFrame(frame); };

  window.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    const p = { x: e.clientX, y: e.clientY };
    tip.style.transform = `translate3d(${p.x}px,${p.y}px,0)`;
    document.documentElement.classList.add("has-cursor");
    if (!last) queue.push(p);
    queue.push(p);
    last = p;
    const el = e.target instanceof Element ? e.target : null;
    palette = el && el.closest(".on-dark") ? DARK : LIGHT;
    sizeTarget = el && el.closest("a, button, [role=button], .rail, .nrow") ? 1.6 : 1;
    tip.classList.toggle("is-dark", palette === DARK);
    kick();
  }, { passive: true });

  document.addEventListener("pointerdown", () => { sizeTarget = 0.6; kick(); });
  document.addEventListener("pointerup", () => { sizeTarget = 1; kick(); });
  document.documentElement.addEventListener("pointerleave", () => {
    document.documentElement.classList.remove("has-cursor");
    last = null;
    queue = [];
  });
}
