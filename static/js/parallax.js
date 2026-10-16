/* Layered parallax scenery behind the hero and the closing section.
   Owner of each layer's transform: GSAP (scrubbed). Disabled under reduced motion. */
import { gsap } from "../vendor/gsap.js";
import { MEDIA } from "./media.js";

export function initParallax(mm) {
  mm.add({ motion: MEDIA.motion }, (ctx) => {
    if (!ctx.conditions.motion) return;
    document.querySelectorAll(".scenery").forEach((scenery) => {
      const section = scenery.parentElement;
      scenery.querySelectorAll("[data-parallax]").forEach((layer) => {
        const speed = parseFloat(layer.dataset.parallax);
        const amp = () => speed * section.offsetHeight * 0.25;
        gsap.fromTo(layer, { y: () => -amp() }, {
          y: () => amp(), ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true },
        });
      });
    });
  });
}
