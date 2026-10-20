/* Scroll-driven hero and closing parallax. Owner of every property animated here: GSAP (scrubbed).
   - Staged hero: the stage is pinned with CSS sticky and ONE timeline plays: the headline lifts away, the view zooms into the
     laptop on the island, the screen opens into the story, and the next paper sheet slides over it.
   - Flat (very short screens, reduced motion): a plain readable hero with the island below the copy.*/
import { gsap, ScrollTrigger } from "../vendor/gsap.js";
import { MEDIA } from "./media.js";
import { buildHouse } from "./house.js";

const SCRUB = 0.85; // keep the camera responsive without making the laptop handoff trail behind the scroll

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
  const island = stage.querySelector("[data-island]");
  const house = stage.querySelector("[data-house]");
  const screenRect = island.querySelector("[data-island-screen]");
  const clouds = stage.querySelector("[data-sky-clouds]");
  const copy = stage.querySelector("[data-hero-copy]");
  const scenes = [...story.querySelectorAll(".story-scene")];
  const [craft, creation, mindset] = scenes;
  const vh = (n) => () => (n * window.innerHeight) / 100;

  // The story (the laptop's screen) joins the pinned stage while staged; otherwise it stays a plain dark band under the hero.
  stage.append(story);
  track.classList.add("is-staged");
  gsap.set(scenes, { autoAlpha: 0 });

  // ONE timeline for the whole hero. Everything below is a window on it, so it reverses exactly when scrolling back.
  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: track, start: "top top", end: "bottom bottom", scrub: SCRUB, invalidateOnRefresh: true,
      refreshPriority: 20, // first in the page: later triggers must see its spacing
    },
  });
  tl.to({}, { duration: 1 }, 0); // spans the whole pinned scroll; the story uses the first ~70% of it
  const T = { zoom: 0.07, craft: 0.33, creation: 0.47, mindset: 0.61 };
  const ZOOM = 0.24;

  // Stage 1 - hero: the headline lines drift up at their own speed and the copy fades
  stage.querySelectorAll("[data-hero-line]").forEach((el) =>
    tl.to(el, { y: vh(parseFloat(el.dataset.heroLine)), ease: "power1.in", duration: 0.1 }, 0.02));
  tl.to(copy, { autoAlpha: 0, duration: 0.07 }, 0.045);
  tl.to(clouds, { opacity: 0, duration: ZOOM * 0.8 }, T.zoom); // opacity only: scaling filtered clouds would re-render them every frame

  // Stage 2 - zoom into the laptop: the island scales about the laptop screen and glides to the middle of the view while the
  // story (the screen's contents) opens from the exact screen rectangle. Everything is a function of one progress value.
  const geo = () => {
    const k = island.offsetWidth / 900; // svg viewBox is 900 wide; the svg fills the scene
    const sx = parseFloat(screenRect.getAttribute("x")), sy = parseFloat(screenRect.getAttribute("y"));
    const sw = parseFloat(screenRect.getAttribute("width")), sh = parseFloat(screenRect.getAttribute("height"));
    const w0 = sw * k, h0 = sh * k;
    const lx = sx * k + w0 / 2, ly = sy * k + h0 / 2; // screen centre inside the scene
    const P0x = island.offsetLeft + lx, P0y = island.offsetTop + ly;
    const vw = stage.clientWidth, vhh = stage.clientHeight;
    const S = Math.max(vw / w0, vhh / h0) * 1.04;
    return { w0, h0, lx, ly, P0x, P0y, vw, vhh, S };
  };
  let g = geo();
  const remeasure = () => { g = geo(); };
  const proxy = { p: 0 };
  let zooming = false;
  const apply = () => {
    const p = proxy.p;
    const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    const s = Math.exp(Math.log(g.S) * e);
    const Pdx = g.P0x + (g.vw / 2 - g.P0x) * e, Pdy = g.P0y + (g.vhh / 2 - g.P0y) * e;
    gsap.set(island, { x: Pdx - g.P0x, y: Pdy - g.P0y, scale: s, transformOrigin: `${g.lx}px ${g.ly}px`, force3D: true });
    const l = Math.max(0, Pdx - (g.w0 * s) / 2), t = Math.max(0, Pdy - (g.h0 * s) / 2);
    const r = Math.max(0, g.vw - (Pdx + (g.w0 * s) / 2)), b = Math.max(0, g.vhh - (Pdy + (g.h0 * s) / 2));
    const rad = 4 * (g.w0 / 188) * s * (1 - e);
    story.style.clipPath = `inset(${t}px ${r}px ${b}px ${l}px round ${rad}px)`;
    // The story only takes over once the screen nearly fills the view; before that the laptop's own code is what you zoom into.
    story.style.opacity = String(Math.min(1, Math.max(0, (p - 0.7) / 0.22)));
    story.style.visibility = p < 0.68 ? "hidden" : "visible";
    story.style.pointerEvents = p > 0.97 ? "auto" : "none";
    // Ambient SVG animations (island bob, steam, caret) repaint the scene every frame: pause them while it is zooming.
    const z = p > 0.002 && p < 0.998;
    if (z !== zooming) { zooming = z; stage.classList.toggle("is-zooming", z); }
  };
  tl.to(proxy, { p: 1, duration: ZOOM, ease: "none", onUpdate: apply }, T.zoom);
  apply();
  if (house) {
    gsap.set(house, { autoAlpha: 0 });
    tl.to(island, { autoAlpha: 0, duration: 0.025 }, T.craft - 0.02);
    tl.to(house, { autoAlpha: 1, duration: 0.025 }, T.craft - 0.015);
    buildHouse(tl, house, { craft: T.craft, creation: T.creation, mindset: T.mindset }, window.innerWidth < 900);
  }

  // Stages 3-5: the story text enters, holds and leaves inside the open screen
  const textWindow = (scene, at, until) => {
    tl.fromTo(scene, { autoAlpha: 0, y: vh(3) }, { autoAlpha: 1, y: 0, duration: 0.025 }, at);
    if (until != null) tl.to(scene, { autoAlpha: 0, y: vh(-3), duration: 0.02 }, until);
  };
  textWindow(craft, T.craft, T.creation - 0.025);
  textWindow(creation, T.creation, T.mindset - 0.025);
  textWindow(mindset, T.mindset, null); // the final message and buttons stay until the next sheet covers the hero

  // Slow entry of 01 — Selected projects over the hero
  const work = document.getElementById("work");
  const naturalTop = () => track.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
  const nativeTimeline = window.CSS && CSS.supports && CSS.supports("animation-timeline: scroll()");
  const onResize = () => { remeasure(); apply(); };
  window.addEventListener("resize", onResize);
  ScrollTrigger.addEventListener("refresh", onResize);
  const finish = () => {
    window.removeEventListener("resize", onResize);
    ScrollTrigger.removeEventListener("refresh", onResize);
    stage.classList.remove("is-zooming");
    window.__workSlow = null;
    story.style.clipPath = "";
    story.style.visibility = "";
    story.style.opacity = "";
    story.style.pointerEvents = "";
    gsap.set(island, { clearProps: "transform" });
    track.append(story);
    track.classList.remove("is-staged");
  };
  if (work && nativeTimeline) {
    // Chrome/Edge/Safari 26+: the slow entry and the hero darkening run as native scroll-linked CSS animations
    // (compositor thread), so they cannot lag behind the scroll the way JavaScript-scrubbed motion can.
    const root = document.documentElement;
    const setRange = () => {
      const vhp = window.innerHeight;
      root.style.setProperty("--ws", `${Math.round(naturalTop() - 3 * vhp)}px`);
      root.style.setProperty("--we", `${Math.round(naturalTop())}px`);
      root.style.setProperty("--wd", `${Math.round(2 * vhp)}px`);
    };
    setRange();
    root.classList.add("css-slow");
    ScrollTrigger.addEventListener("refresh", setRange);
    window.__workSlow = { native: true };
    return () => {
      ScrollTrigger.removeEventListener("refresh", setRange);
      root.classList.remove("css-slow");
      finish();
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
    if (work) gsap.set(work, { clearProps: "transform" });
    finish();
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
