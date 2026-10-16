/* One continuous narrative line. The SVG path is built from the section positions
   and drawn with scrubbed stroke-dashoffset; a pencil-nib marker travels along it.
   Owners: GSAP owns stroke-dashoffset on the path and the marker transform/opacity. */
import { gsap, ScrollTrigger } from "../vendor/gsap.js";
import { MEDIA } from "./media.js";

export function initThread(mm) {
  const svg = document.querySelector("[data-thread]");
  const path = svg && svg.querySelector("[data-thread-path]");
  const ghost = svg && svg.querySelector("[data-thread-ghost]");
  const marker = svg && svg.querySelector("[data-thread-marker]");
  const main = document.getElementById("main");
  if (!svg || !path || !main) return;

  let len = 0;
  let progress = 0;
  let animated = false;

  const rel = (el) => {
    const r = el.getBoundingClientRect();
    const m = main.getBoundingClientRect();
    return { x: r.left - m.left, y: r.top - m.top, w: r.width, h: r.height };
  };

  function build() {
    const W = main.clientWidth;
    const H = main.scrollHeight;
    svg.setAttribute("width", W);
    svg.setAttribute("height", H);
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);

    // Start where the first paper sheet begins: the pinned hero cannot anchor a scrolling line.
    const sections = [...document.querySelectorAll("[data-section]")].slice(1);
    const first = rel(sections[0]);
    const edge = Math.min(Math.max(W * 0.025, 6), 40);
    const pts = [{ x: edge, y: first.y - 10 }];
    sections.forEach((s, i) => {
      const r = rel(s);
      pts.push({ x: i % 2 === 0 ? W - edge : edge, y: r.y + Math.min(r.h * 0.35, 520) });
    });
    const last = sections[sections.length - 1];
    const lr = rel(last);
    pts.push({ x: W * 0.5, y: lr.y + lr.h * 0.82 });

    let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i];
      const dy = (b.y - a.y) * 0.55;
      d += ` C${a.x.toFixed(1)} ${(a.y + dy).toFixed(1)} ${b.x.toFixed(1)} ${(b.y - dy).toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
    }
    // Closing flourish: the line loops once and settles under the contact headline.
    d += ` c 70 12 110 -40 60 -58 c -50 -16 -92 38 -18 70 c 60 24 150 4 220 -14`;
    path.setAttribute("d", d);
    ghost.setAttribute("d", d);

    len = path.getTotalLength();
    path.style.strokeDasharray = len;
    place();
  }

  function place() {
    if (!len) return;
    path.style.strokeDashoffset = animated ? len * (1 - progress) : 0;
    if (!animated) return;
    const at = Math.max(0.001, len * progress);
    const p = path.getPointAtLength(at);
    const q = path.getPointAtLength(Math.min(len, at + 2));
    const angle = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
    gsap.set(marker, { x: p.x, y: p.y, rotation: angle, transformOrigin: "0 0" });
  }

  mm.add({ motion: MEDIA.motion, reduce: MEDIA.reduce }, (ctx) => {
    animated = !!ctx.conditions.motion;
    build();
    if (!animated) { gsap.set(marker, { opacity: 0 }); return; }

    gsap.set(marker, { opacity: 1 });
    const st = ScrollTrigger.create({
      trigger: main, start: "top top", end: "bottom bottom", scrub: 0.6,
      onUpdate: (self) => { progress = self.progress; place(); },
    });
    const onRefresh = () => { build(); progress = st.progress; place(); };
    ScrollTrigger.addEventListener("refresh", onRefresh);
    return () => {
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      animated = false;
      progress = 0;
      st.kill();
      build();
    };
  });
}
