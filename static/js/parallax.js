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
  const story = track.querySelector("[data-hero-story]");
  const flyers = [...stage.querySelectorAll(".scenery [data-fly]")];
  const emergers = [...stage.querySelectorAll(".scenery [data-emerge]")];
  const copy = stage.querySelector("[data-hero-copy]");
  const figure = stage.querySelector("[data-hero-scene]");
  const dark = story.querySelector("[data-hero-dark]");
  const scenes = [...story.querySelectorAll(".story-scene")];
  const [craft, creation, mindset] = scenes;
  const vh = (n) => () => (n * window.innerHeight) / 100;

  // The story joins the pinned stage while staged; it returns to the flow (a plain dark band) otherwise.
  stage.append(story);
  track.classList.add("is-staged");
  gsap.set(scenes, { autoAlpha: 0 });
  gsap.set(dark, { autoAlpha: 0 });

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: track, start: "top top", end: "bottom bottom", scrub: SCRUB, invalidateOnRefresh: true,
      refreshPriority: 20, // first in the page: later triggers must see its spacing
    },
  });

  // Background, 3D depth: every layer has its own perspective so z reads as distance from the viewer.
  const ground = (el) => (el.hasAttribute("data-ground") ? "50% 100%" : "50% 50%"); // ground layers grow upward from the horizon
  gsap.set([...flyers, ...emergers], { transformPerspective: 900 });
  // Layers present from the start rise and come toward the viewer (nearer layers travel further and grow more).
  flyers.forEach((el) => {
    const [y, z, k] = el.dataset.fly.split(",").map(Number);
    const base = parseFloat(getComputedStyle(el).opacity) || 1;
    const x = el.dataset.layerX ? () => (parseFloat(el.dataset.layerX) * window.innerWidth) / 100 : 0;
    gsap.set(el, { transformOrigin: ground(el) });
    tl.to(el, { y: vh(y), z, x, opacity: base * k, duration: 1 }, 0);
  });
  // Distant ridges start small, faint and low in the background, then rise out of it and move forward.
  emergers.forEach((el) => {
    const [y0, z0, finalOpacity] = el.dataset.emerge.split(",").map(Number);
    gsap.set(el, { transformOrigin: "50% 100%" });
    tl.fromTo(el, { y: vh(y0), z: z0, opacity: 0 }, { y: vh(-2), z: 0, opacity: finalOpacity, ease: "power1.out", duration: 0.66 }, 0.12);
  });

  // Scene 1 (introduction): the desk scene rises in, then everything lifts away at its own speed.
  // On phones the desk scene takes the place of the copy instead of sitting beside it, so it rises a little later.
  const narrow = window.innerWidth < 900;
  tl.fromTo(figure, { yPercent: 135 }, { yPercent: 0, ease: "power2.out", duration: narrow ? 0.07 : 0.09 }, narrow ? 0.07 : 0);
  stage.querySelectorAll("[data-hero-line]").forEach((el) =>
    tl.to(el, { y: vh(parseFloat(el.dataset.heroLine)), ease: "power1.in", duration: 0.09 }, 0.1));
  tl.to(copy, { autoAlpha: 0, duration: 0.07 }, narrow ? 0.07 : 0.11)
    .to(figure, { autoAlpha: 0, yPercent: -16, duration: 0.07 }, 0.11)
    .to(dark, { autoAlpha: 0.55, duration: 0.09 }, 0.12); // dims the scenery but keeps its depth layers visible

  // Scene windows: [in-start, in-end, out-start, out-end]. Layers inside move at their own data-depth speed.
  const parallaxIn = (scene, from, to) =>
    scene.querySelectorAll("[data-depth]").forEach((el) => {
      const d = parseFloat(el.dataset.depth);
      gsap.set(el, { transformPerspective: 1000 });
      // Panels rise out of the depth: small and far at first, larger and closer as the scene plays.
      tl.fromTo(el, { y: vh(d * 9), z: -Math.abs(d) * 200 }, { y: vh(-d * 9), z: Math.abs(d) * 140, duration: to - from }, from);
    });

  // Scene 2 (the craft): editor and terminal panels glide at different speeds.
  tl.fromTo(craft, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.06 }, 0.18)
    .to(craft, { autoAlpha: 0, duration: 0.06 }, 0.34);
  parallaxIn(craft, 0.18, 0.4);

  // Scene 3 (the creation): browser, API and database connect as the lines draw.
  const links = [...creation.querySelectorAll("[data-link]")];
  links.forEach((p) => { p.setAttribute("pathLength", "1"); gsap.set(p, { strokeDasharray: 1, strokeDashoffset: 1 }); });
  tl.fromTo(creation, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.06 }, 0.4)
    .to(creation, { autoAlpha: 0, duration: 0.06 }, 0.54);
  parallaxIn(creation, 0.4, 0.6);
  links.forEach((p, i) => tl.to(p, { strokeDashoffset: 0, duration: 0.05 }, 0.44 + i * 0.05));

  // Scene 4 (the mindset): the call to action stays until the next sheet covers the hero.
  tl.fromTo(mindset, { autoAlpha: 0, scale: 0.96 }, { autoAlpha: 1, scale: 1, duration: 0.07 }, 0.6);
  parallaxIn(mindset, 0.6, 0.82);

  return () => {
    track.append(story);
    track.classList.remove("is-staged");
  };
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
