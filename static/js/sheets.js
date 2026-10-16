/* Sheet transitions and per-element depth.
   Owner of transforms here: GSAP (scrubbed). Never applied to an element that contains a pin. */
import { gsap } from "../vendor/gsap.js";
import { MEDIA } from "./media.js";

export function initSheets(mm) {
  mm.add({ motion: MEDIA.motion }, (ctx) => {
    if (!ctx.conditions.motion) return;

    // [data-speed]: elements drift against the scroll for depth (positive = slower).
    document.querySelectorAll("[data-speed]").forEach((el) => {
      const speed = parseFloat(el.dataset.speed);
      gsap.fromTo(el, { y: -speed * 70 }, {
        y: speed * 70, ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1.2 },
      });
    });
  });
}
