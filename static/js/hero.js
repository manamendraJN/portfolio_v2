/* Hero: intro reveal + day/night scene crossfade.
   Owners: GSAP owns opacity of both scene states, the hero intro opacity/transform and the scene clip-path.
   The toggle button's label/aria state is plain DOM (no animation). */
import { gsap } from "../vendor/gsap.js";
import { MEDIA } from "./media.js";

export function initHero(mm) {
  const scene = document.querySelector("[data-scene]");
  const night = scene && scene.querySelector(".scene-night");
  const day = scene && scene.querySelector(".scene-day");
  const toggle = document.querySelector("[data-scene-toggle]");
  const label = document.querySelector("[data-scene-toggle-label]");
  if (!scene || !night || !toggle) return;

  let mode = "day";
  let reduced = false;
  const labels = { day: "View by night", night: "View by day" };

  const apply = (next, animate) => {
    mode = next;
    scene.dataset.mode = next;
    toggle.setAttribute("aria-pressed", String(next === "night"));
    label.textContent = labels[next];
    const target = next === "night" ? 1 : 0;
    gsap.killTweensOf(night);
    if (!animate || reduced) gsap.set(night, { opacity: target });
    else gsap.to(night, { opacity: target, duration: 1.1, ease: "power2.inOut" });
    night.setAttribute("aria-hidden", "true");
    day.setAttribute("aria-hidden", String(next === "night"));
  };

  toggle.addEventListener("click", () => apply(mode === "day" ? "night" : "day", true));

  mm.add({ motion: MEDIA.motion, reduce: MEDIA.reduce }, (ctx) => {
    reduced = !!ctx.conditions.reduce;
    if (reduced) { apply(mode, false); return; }

    // Crossfade once on load: the scene wakes from night into day.
    gsap.set(night, { opacity: 1 });
    gsap.to(night, { opacity: 0, duration: 1.8, delay: 0.5, ease: "power2.inOut" });

    gsap.from("[data-hero-scene]", { clipPath: "inset(0 0 100% 0)", duration: 1.2, ease: "power3.out", delay: 0.2 });
    gsap.from("[data-hero-intro]", { opacity: 0, y: 24, duration: 0.9, ease: "power2.out", delay: 0.5 });
  });
}
