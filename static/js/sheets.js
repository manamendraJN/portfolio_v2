/* Sheet transitions: depth shading and per-element drift.
   Owner of transforms here: GSAP (scrubbed). Never applied to an element that contains a pin. */
import { gsap } from "../vendor/gsap.js";
import { MEDIA } from "./media.js";

export function initSheets(mm) {
  mm.add({ motion: MEDIA.motion }, (ctx) => {
    if (!ctx.conditions.motion) return;

    // Depth shading: as the next section rises over a layer, a dark veil on that layer fades in with the
    // overlap (scrubbed opacity, owner: GSAP). The incoming section stays bright until it is covered itself.
    const sections = [...document.querySelectorAll("[data-section]")];
    const shades = [];
    sections.slice(0, -1).forEach((section, i) => {
      const host = section.querySelector(".hero-stage") || section;
      const shade = document.createElement("div");
      shade.className = "layer-shade";
      shade.setAttribute("aria-hidden", "true");
      host.append(shade);
      shades.push(shade);
      gsap.fromTo(shade, { opacity: 0 }, {
        opacity: 0.72, ease: "none",
        scrollTrigger: { trigger: sections[i + 1], start: "top bottom", end: "top top", scrub: true },
      });
    });

    // [data-speed]: elements drift against the scroll for depth (positive = slower).
    document.querySelectorAll("[data-speed]").forEach((el) => {
      const speed = parseFloat(el.dataset.speed);
      gsap.fromTo(el, { y: -speed * 70 }, {
        y: speed * 70, ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1.2 },
      });
    });
    return () => shades.forEach((n) => n.remove());
  });
}
