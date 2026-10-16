/* Layered, scroll-driven parallax. Owner of every layer transform/opacity here: GSAP (scrubbed).
   - Staged hero (tall desktop): the stage is pinned with CSS sticky; layers sink at different speeds,
     the desk scene rises into place, the copy lifts away and the next paper sheet slides over it.
   - Flat (mobile / short screens): plain per-layer parallax behind the hero.
   - Closing section: plain layered parallax. Disabled under reduced motion. */
import { gsap } from "../vendor/gsap.js";
import { MEDIA } from "./media.js";

const SCRUB = 0.8; // light smoothing: layers ease toward the scroll position

function plainParallax(scenery) {
  const section = scenery.parentElement;
  scenery.querySelectorAll("[data-parallax]").forEach((layer) => {
    const speed = parseFloat(layer.dataset.parallax);
    const amp = () => speed * section.offsetHeight * 0.25;
    gsap.fromTo(layer, { y: () => -amp() }, {
      y: () => amp(), ease: "none",
      scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: SCRUB, invalidateOnRefresh: true },
    });
  });
}

function stagedHero(track) {
  const stage = track.querySelector("[data-hero-stage]");
  const layers = [...stage.querySelectorAll(".scenery [data-layer]")];
  const wash = stage.querySelector("[data-hero-wash]");
  const copy = stage.querySelector("[data-hero-copy]");
  const figure = stage.querySelector("[data-hero-scene]");
  const vh = (n) => () => (n * window.innerHeight) / 100;

  track.classList.add("is-staged");
  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: track, start: "top top", end: "bottom bottom", scrub: SCRUB, invalidateOnRefresh: true,
      refreshPriority: 20, // first in the page: later triggers must see its spacing
    },
  });
  // Foreground layers sink fastest: depth from different speeds.
  layers.forEach((el) => {
    const x = el.dataset.layerX ? () => (parseFloat(el.dataset.layerX) * window.innerWidth) / 100 : 0;
    tl.to(el, { y: vh(parseFloat(el.dataset.layer)), x, duration: 1 }, 0);
  });
  tl.to(wash, { opacity: 0.4, duration: 1 }, 0);
  tl.fromTo(figure, { yPercent: 135 }, { yPercent: 0, ease: "power2.out", duration: 0.5 }, 0)
    .to(figure, { yPercent: -10, duration: 0.4 }, 0.6)
    .to(copy, { opacity: 0, ease: "power1.in", duration: 0.4 }, 0.55);
  // Each headline line and the intro leave at their own speed: layered text.
  stage.querySelectorAll("[data-hero-line]").forEach((el) =>
    tl.to(el, { y: vh(parseFloat(el.dataset.heroLine)), ease: "power1.in", duration: 0.55 }, 0.4));
  return () => track.classList.remove("is-staged");
}

export function initParallax(mm) {
  mm.add({ motion: MEDIA.motion, stage: MEDIA.stage, flat: MEDIA.flat }, (ctx) => {
    const { motion, stage, flat } = ctx.conditions;
    if (!motion) return;
    const track = document.querySelector("[data-hero-track]");
    const heroScenery = track && track.querySelector(".scenery");
    let cleanup;
    if (stage && track) cleanup = stagedHero(track);
    else if (flat && heroScenery) plainParallax(heroScenery);
    document.querySelectorAll("#contact .scenery").forEach(plainParallax);
    return cleanup;
  });
}
