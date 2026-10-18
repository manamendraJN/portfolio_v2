/* Scroll-driven hero and closing parallax. Owner of every property animated here: GSAP (scrubbed).
   - Staged hero: the stage is pinned with CSS sticky and ONE timeline tells the story: intro, profile, then a house
     built from code (house.js), then the finished house while the next paper sheet slides over it.
   - Flat (very short screens): the hero is a plain readable layout; the finished house is shown as-is.
   - Closing section: plain layered parallax. Disabled under reduced motion. */
import { gsap, ScrollTrigger } from "../vendor/gsap.js";
import { MEDIA } from "./media.js";
import { buildHouse } from "./house.js";

const SCRUB = 2.4; // light smoothing: layers ease toward the scroll position

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
  const house = stage.querySelector("[data-house]");
  const copy = stage.querySelector("[data-hero-copy]");
  const portrait = stage.querySelector("[data-hero-portrait]");
  const scenes = [...story.querySelectorAll(".story-scene")];
  const [craft, creation, mindset] = scenes;
  const narrow = window.innerWidth < 900;
  const vh = (n) => () => (n * window.innerHeight) / 100;

  // The story text joins the pinned stage while staged; it returns to the flow (a plain dark band) otherwise.
  stage.append(story);
  track.classList.add("is-staged");
  gsap.set(scenes, { autoAlpha: 0 });

  // ONE timeline for the whole hero: every stage below is a window on it, so the house keeps its progress
  // from stage to stage and scrolling back un-builds it in reverse.
  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: track, start: "top top", end: "bottom bottom", scrub: SCRUB, invalidateOnRefresh: true,
      refreshPriority: 20, // first in the page: later triggers must see its spacing
    },
  });
  tl.to({}, { duration: 1 }, 0); // the timeline spans the whole pinned scroll; the story uses the first 70% of it

  // Milestones (fractions of the pinned scroll). The last 30% holds the finished house while 01 slides over it.
  const T = { s2: 0.09, craft: 0.205, creation: 0.345, mindset: 0.505 };

  // Stage 1 - introduction: the headline lines leave at their own speed, the copy fades
  stage.querySelectorAll("[data-hero-line]").forEach((el) =>
    tl.to(el, { y: vh(parseFloat(el.dataset.heroLine)), ease: "power1.in", duration: 0.06 }, 0.035));
  tl.to(copy, { autoAlpha: 0, duration: 0.04 }, 0.06);

  // Stage 2 - profile: a blueprint plate slides in beside the early drawing, holds, then makes room for the build
  if (portrait) {
    gsap.set(portrait, { autoAlpha: 0 });
    tl.fromTo(portrait, { yPercent: narrow ? 30 : 12, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, ease: "power2.out", duration: 0.04 }, T.s2 + 0.01)
      .to(portrait, { yPercent: -2, ease: "none", duration: 0.06 }, T.s2 + 0.05)
      .to(portrait, { autoAlpha: 0, yPercent: -6, ease: "power1.in", duration: 0.035 }, T.craft - 0.04);
  }

  // Stages 3-5: each story text enters, holds and leaves in step with the construction milestone beside it
  const textWindow = (scene, at, until) => {
    tl.fromTo(scene, { autoAlpha: 0, y: vh(3) }, { autoAlpha: 1, y: 0, duration: 0.025 }, at);
    if (until != null) tl.to(scene, { autoAlpha: 0, y: vh(-3), duration: 0.02 }, until);
  };
  textWindow(craft, T.craft, T.creation - 0.025);
  textWindow(creation, T.creation, T.mindset - 0.025);
  textWindow(mindset, T.mindset, null); // the final message and buttons stay with the finished house

  // The house itself
  if (house) buildHouse(tl, house, T, narrow);

  // Slow entry of 01 — Selected projects: it rises over the hero at a slow, eased pace.
  // The track has extra height for this (see CSS); the section is lifted and eased down (scrubbed).
  const work = document.getElementById("work");
  const naturalTop = () => track.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
  const nativeTimeline = window.CSS && CSS.supports && CSS.supports("animation-timeline: scroll()");
  if (work && nativeTimeline) {
    // Chrome/Edge/Safari 26+: the slow entry and the hero darkening run as native scroll-linked CSS animations
    // (compositor thread), so they cannot lag behind the scroll the way JavaScript-scrubbed motion can.
    const root = document.documentElement;
    const setRange = () => {
      const vh = window.innerHeight;
      root.style.setProperty("--ws", `${Math.round(naturalTop() - 3 * vh)}px`);
      root.style.setProperty("--we", `${Math.round(naturalTop())}px`);
      root.style.setProperty("--wd", `${Math.round(2 * vh)}px`);
    };
    setRange();
    root.classList.add("css-slow");
    ScrollTrigger.addEventListener("refresh", setRange);
    window.__workSlow = { native: true };
    return () => {
      ScrollTrigger.removeEventListener("refresh", setRange);
      root.classList.remove("css-slow");
      window.__workSlow = null;
      track.append(story);
      track.classList.remove("is-staged");
    };
  }
  if (work) {
    window.__workSlow = { start: () => naturalTop() - 3 * window.innerHeight, end: () => naturalTop() };
    // Fallback (no native scroll timelines): JavaScript-scrubbed, one constant speed (ease none).
    gsap.fromTo(work, { y: () => -2 * window.innerHeight, force3D: true }, {
      y: 0, ease: "none", force3D: true,
      scrollTrigger: { start: window.__workSlow.start, end: window.__workSlow.end, scrub: 1, invalidateOnRefresh: true, refreshPriority: 15 },
    });
  }

  return () => {
    window.__workSlow = null;
    track.append(story);
    track.classList.remove("is-staged");
    if (work) gsap.set(work, { clearProps: "transform" });
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
