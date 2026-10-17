/* Layered, scroll-driven parallax. Owner of every layer transform/opacity here: GSAP (scrubbed).
   - Staged hero (tall desktop): the stage is pinned with CSS sticky; layers sink at different speeds,
     the desk scene rises into place, the copy lifts away and the next paper sheet slides over it.
   - Flat (mobile / short screens): plain per-layer parallax behind the hero.
   - Closing section: plain layered parallax. Disabled under reduced motion. */
import { gsap } from "../vendor/gsap.js";
import { MEDIA } from "./media.js";

const SCRUB = 1.6; // light smoothing: layers ease toward the scroll position

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
  // Phones get a stronger travel so the depth reads clearly on a small screen.
  const boost = window.innerWidth < 900 ? 2.2 : 1;
  flyers.forEach((el) => {
    let [y, z, k] = el.dataset.fly.split(",").map(Number);
    y *= boost;
    z *= boost;
    const base = parseFloat(getComputedStyle(el).opacity) || 1;
    const x = el.dataset.layerX ? () => (parseFloat(el.dataset.layerX) * window.innerWidth) / 100 : 0;
    gsap.set(el, { transformOrigin: ground(el) });
    // Front-loaded: most of the rush toward the viewer happens in the first scroll, then it keeps drifting.
    tl.to(el, { y: vh(y * 0.6), z: z * 0.6, x: typeof x === "function" ? () => x() * 0.6 : 0, opacity: base + (base * k - base) * 0.5, ease: "power2.out", duration: 0.2 }, 0)
      .to(el, { y: vh(y), z, x, opacity: base * k, duration: 0.8 }, 0.2);
  });
  // Distant ridges start small, faint and low in the background, then rise out of it and move forward.
  emergers.forEach((el) => {
    const [y0, z0, finalOpacity] = el.dataset.emerge.split(",").map(Number);
    gsap.set(el, { transformOrigin: "50% 100%" });
    tl.fromTo(el, { y: vh(y0 * (window.innerWidth < 900 ? 0.5 : 1)), z: z0, opacity: window.innerWidth < 900 ? 0.15 : 0 }, { y: vh(-2), z: 0, opacity: window.innerWidth < 900 ? Math.min(1, finalOpacity + 0.3) : finalOpacity, ease: "power1.out", duration: window.innerWidth < 900 ? 0.4 : 0.6 }, 0.02);
  });

  // Scene 1 (introduction): the headline lines leave at their own speed, then the story scenes take over.
  stage.querySelectorAll("[data-hero-line]").forEach((el) =>
    tl.to(el, { y: vh(parseFloat(el.dataset.heroLine)), ease: "power1.in", duration: 0.09 }, 0.1));
  // Portrait pop-up: it rises out of the lower background with a little scale and parallax, holds, then leaves.
  const portrait = stage.querySelector("[data-hero-portrait]");
  const narrow = window.innerWidth < 900;
  if (portrait) {
    gsap.set(portrait, { transformPerspective: 900, autoAlpha: 0 });
    tl.fromTo(portrait, { yPercent: 130, scale: 0.82, z: -250, autoAlpha: 0 },
      { yPercent: 0, scale: 1, z: 0, autoAlpha: 1, ease: "power3.out", duration: 0.09 }, narrow ? 0.05 : 0)
      .to(portrait, { yPercent: -6, ease: "none", duration: 0.1 }, narrow ? 0.14 : 0.09)
      .to(portrait, { autoAlpha: 0, yPercent: -22, scale: 1.06, z: 160, ease: "power1.in", duration: 0.06 }, 0.19);
  }
  tl.to(copy, { autoAlpha: 0, duration: narrow ? 0.05 : 0.07 }, narrow ? 0.05 : 0.11)
    .to(dark, { autoAlpha: 0.55, duration: 0.09 }, narrow ? 0.21 : 0.17); // dims the scenery but keeps its depth layers visible

  // Scene windows: [in-start, in-end, out-start, out-end]. Layers inside move at their own data-depth speed.
  const parallaxIn = (scene, from, to) =>
    scene.querySelectorAll("[data-depth]").forEach((el) => {
      const d = parseFloat(el.dataset.depth);
      gsap.set(el, { transformPerspective: 1000 });
      // Panels rise out of the depth: small and far at first, larger and closer as the scene plays.
      tl.fromTo(el, { y: vh(d * 9), z: -Math.abs(d) * 200 }, { y: vh(-d * 9), z: Math.abs(d) * 140, duration: to - from }, from);
    });

  // Scene 2 (the craft): editor and terminal panels glide at different speeds.
  tl.fromTo(craft, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.06 }, narrow ? 0.25 : 0.21)
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
