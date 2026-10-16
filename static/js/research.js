/* Research pipeline: connector paths draw on scroll (desktop, motion allowed).
   Owner of the connectors' stroke-dashoffset: GSAP (scrubbed). Final state is the fully drawn diagram. */
import { gsap } from "../vendor/gsap.js";
import { MEDIA } from "./media.js";

export function initResearch(mm) {
  const figure = document.querySelector("[data-pipeline]");
  if (!figure) return;
  mm.add({ wide: MEDIA.wide }, (ctx) => {
    if (!ctx.conditions.wide) return;
    const paths = [...figure.querySelectorAll("[data-pipe-path]")];
    paths.forEach((p) => {
      const len = p.getTotalLength();
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
    });
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: figure, start: "top 75%", end: "center 45%", scrub: 0.6 },
    });
    paths.forEach((p) => tl.to(p, { strokeDashoffset: 0, duration: 1 }));
    return () => paths.forEach((p) => { p.style.strokeDasharray = ""; p.style.strokeDashoffset = ""; });
  });
}
