/* The storyline: one continuous line fixed to the viewport edge, "from first sketch to software people rely on".
   It is drawn as you read (stroke-dashoffset), a pencil-nib marker travels along it, and a numbered node
   lights up for every chapter. Progress is the sum of how far each section has been read, so it stays correct
   with the pinned hero and the stacking sections.
   Owners: GSAP owns stroke-dashoffset on the path and the marker transform/opacity; node state is plain classes. */
import { gsap, ScrollTrigger } from "../vendor/gsap.js";
import { MEDIA } from "./media.js";

const NS = "http://www.w3.org/2000/svg";

export function initThread(mm) {
  const svg = document.querySelector("[data-thread]");
  const path = svg && svg.querySelector("[data-thread-path]");
  const ghost = svg && svg.querySelector("[data-thread-ghost]");
  const marker = svg && svg.querySelector("[data-thread-marker]");
  const nodesG = svg && svg.querySelector("[data-thread-nodes]");
  const sections = [...document.querySelectorAll("[data-section]")];
  if (!svg || !path || !marker || !nodesG || sections.length < 2) return;

  const N = sections.length;
  const labels = ["Start", ...[...document.querySelectorAll("[data-index-link] .idx-label")].map((n) => n.textContent)];
  const scratch = document.createElementNS(NS, "path");
  const read = new Array(N).fill(0);
  let cum = [];
  let total = 0;
  let animated = false;
  let nodes = [];

  function build() {
    const W = window.innerWidth;
    const H = window.innerHeight;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    const small = W < 768;
    const xa = small ? 9 : 20;
    const xb = small ? 20 : 46;
    const y0 = small ? 84 : 92;
    const y1 = H - 56;
    const pts = sections.map((_, i) => ({ x: i % 2 ? xb : xa, y: y0 + ((y1 - y0) * i) / (N - 1) }));

    let d = `M${pts[0].x} ${pts[0].y}`;
    cum = [0];
    for (let i = 1; i < N; i++) {
      const a = pts[i - 1];
      const b = pts[i];
      const dy = (b.y - a.y) * 0.5;
      d += ` C${a.x} ${a.y + dy} ${b.x} ${b.y - dy} ${b.x} ${b.y}`;
      scratch.setAttribute("d", d);
      cum.push(scratch.getTotalLength());
    }
    // Closing flourish: the line loops once and settles at the end of the page.
    d += " c 22 -4 44 -24 26 -40 c -16 -14 -46 8 -20 30 c 16 12 40 4 58 -10";
    path.setAttribute("d", d);
    ghost.setAttribute("d", d);
    total = path.getTotalLength();
    cum.push(total);
    path.style.strokeDasharray = total;

    nodesG.replaceChildren();
    nodes = pts.map((pt, i) => {
      const g = document.createElementNS(NS, "g");
      g.setAttribute("class", "thread-node");
      const c = document.createElementNS(NS, "circle");
      c.setAttribute("cx", pt.x);
      c.setAttribute("cy", pt.y);
      c.setAttribute("r", 5);
      const t = document.createElementNS(NS, "text");
      t.setAttribute("x", pt.x + 14);
      t.setAttribute("y", pt.y + 3.5);
      t.textContent = `${String(i).padStart(2, "0")} ${labels[i] || ""}`;
      g.append(c, t);
      nodesG.append(g);
      return g;
    });
    place(progress());
  }

  const progress = () => read.reduce((a, b) => a + b, 0) / N;
  const lengthAt = (p) => {
    const s = p * N;
    const k = Math.min(N - 1, Math.floor(s));
    return cum[k] + (cum[k + 1] - cum[k]) * (s - k);
  };

  function place(p) {
    if (!total) return;
    const L = animated ? lengthAt(p) : total;
    path.style.strokeDashoffset = total - L;
    let current = 0;
    nodes.forEach((g, i) => {
      const lit = L >= cum[i] - 0.5;
      g.classList.toggle("is-lit", lit);
      if (lit) current = i;
    });
    nodes.forEach((g, i) => g.classList.toggle("is-current", animated && i === current));
    if (!animated) return;
    const at = Math.max(0.01, L);
    const a = path.getPointAtLength(at);
    const b = path.getPointAtLength(Math.min(total, at + 2));
    const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
    gsap.set(marker, { x: a.x, y: a.y, rotation: angle, transformOrigin: "0 0" });
  }

  mm.add({ motion: MEDIA.motion }, (ctx) => {
    animated = !!ctx.conditions.motion;
    if (!animated) {
      build();
      gsap.set(marker, { opacity: 0 });
      return;
    }
    gsap.set(marker, { opacity: 1 });
    const triggers = sections.map((section, i) => {
      const update = (self) => { read[i] = self.progress; place(progress()); };
      return ScrollTrigger.create({
        trigger: section, start: i === 0 ? "top top" : "top 55%", end: "bottom 55%",
        onUpdate: update, onRefresh: update,
      });
    });
    build();
    const onRefresh = () => build();
    ScrollTrigger.addEventListener("refresh", onRefresh);
    return () => {
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      triggers.forEach((t) => t.kill());
      animated = false;
      build();
    };
  });
}
