/* One continuous narrative line. It starts at the Selected projects section (not in the hero) and is drawn to the
   very end of the page. Its drawn tip is kept at a fixed height in the viewport, so you always see the pencil
   drawing where you are reading. Owners: GSAP owns stroke-dashoffset on the path and the marker transform/opacity. */
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
  let yStart = 0;

  const rel = (el) => {
    const r = el.getBoundingClientRect();
    const m = main.getBoundingClientRect();
    return { x: r.left - m.left, y: r.top - m.top, w: r.width, h: r.height };
  };

  function build() {
    const W = main.clientWidth;
    const H = main.scrollHeight;
    const vh = window.innerHeight;
    svg.setAttribute("width", W);
    svg.setAttribute("height", H);
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);

    const sections = [...document.querySelectorAll("[data-section]")].slice(1);
    const edge = Math.min(Math.max(W * 0.025, 6), 40);
    yStart = rel(sections[0]).y + 56; // beside the Selected projects heading
    const pts = [{ x: edge, y: yStart }];
    sections.forEach((s, i) => {
      const r = rel(s);
      pts.push({ x: i % 2 === 0 ? W - edge : edge, y: r.y + Math.min(r.h * 0.3, 480) + (i === 0 ? 200 : 0) });
    });
    // The path must end where the tip sits at the bottom of the page, leaving room for the flourish.
    const endY = H - vh * 0.4;
    const last = pts[pts.length - 1];
    last.y = Math.min(last.y, endY - 40);
    pts.push({ x: W * 0.5, y: endY });

    let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i];
      const dy = (b.y - a.y) * 0.55;
      d += ` C${a.x.toFixed(1)} ${(a.y + dy).toFixed(1)} ${b.x.toFixed(1)} ${(b.y - dy).toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
    }
    // Closing flourish: the line loops once and settles at the end of the page.
    d += " c 70 12 110 -40 60 -58 c -50 -16 -92 38 -18 70 c 60 24 150 4 220 -14";
    path.setAttribute("d", d);
    ghost.setAttribute("d", d);

    len = path.getTotalLength();
    path.style.strokeDasharray = len;
    place();
  }

  // Length at which the path reaches a given y (the path runs downward, so y grows with length).
  function lengthAtY(y) {
    let lo = 0;
    let hi = len;
    for (let i = 0; i < 18; i++) {
      const mid = (lo + hi) / 2;
      if (path.getPointAtLength(mid).y < y) lo = mid; else hi = mid;
    }
    return hi;
  }

  function place() {
    if (!len) return;
    if (!animated) { path.style.strokeDashoffset = 0; return; }
    const vh = window.innerHeight;
    if (progress <= 0) {
      path.style.strokeDashoffset = len; // nothing drawn before the projects section
      gsap.set(marker, { opacity: 0 });
      return;
    }
    gsap.set(marker, { opacity: 1 });
    const tipY = window.scrollY + vh * 0.6;
    const at = progress >= 0.999 ? len : Math.max(1, Math.min(len, lengthAtY(Math.max(yStart, tipY))));
    path.style.strokeDashoffset = len - at;
    const p = path.getPointAtLength(at);
    const q = path.getPointAtLength(Math.min(len, at + 2));
    const angle = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
    gsap.set(marker, { x: p.x, y: p.y, rotation: angle, transformOrigin: "0 0" });
  }

  mm.add({ motion: MEDIA.motion }, (ctx) => {
    animated = !!ctx.conditions.motion;
    build();
    if (!animated) { gsap.set(marker, { opacity: 0 }); return; }

    const st = ScrollTrigger.create({
      trigger: document.getElementById("work"),
      start: "top 60%", end: "max",
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
