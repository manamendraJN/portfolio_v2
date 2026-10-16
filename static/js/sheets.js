/* Sheet transitions and per-element depth.
   Owner of transforms here: GSAP (scrubbed). Never applied to an element that contains a pin. */
import { gsap } from "../vendor/gsap.js";
import { MEDIA } from "./media.js";

export function initSheets(mm) {
  mm.add({ motion: MEDIA.motion }, (ctx) => {
    if (!ctx.conditions.motion) return;

    // The contact sheet slides over the certificates, which settle more slowly beneath it.
    const tail = document.getElementById("certificates");
    const contact = document.getElementById("contact");
    if (tail && contact) {
      gsap.fromTo(tail, { y: 0 }, {
        y: () => window.innerHeight * 0.22, ease: "none",
        scrollTrigger: { trigger: contact, start: "top bottom", end: "top top", scrub: 1.2, invalidateOnRefresh: true },
      });
    }

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
