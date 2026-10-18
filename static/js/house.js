/* The house story: adds the construction of the house to the hero's single scrubbed timeline.
   One scene, one timeline: each build step is drawn with the scroll (stroke-dashoffset / opacity / clip-path) and a code
   fragment is "written" beside it. Nothing is ever removed once built, so scrolling back un-builds it step by step.
   Owner of every property touched here: GSAP (scrubbed). `T` holds the milestone times (fractions of the timeline). */
import { gsap } from "../vendor/gsap.js";

export function buildHouse(tl, house, T, narrow) {
  const q = (sel) => [...house.querySelectorAll(sel)];
  const grp = (name) => q(`[data-h="${name}"]`);
  const strokes = (name) => q(`[data-h="${name}"] [data-d]`);

  // --- initial state: everything is built from nothing except the guides, the slab outline and the first idea
  const drawable = q("[data-d]");
  drawable.forEach((el) => el.setAttribute("pathLength", "1"));
  gsap.set(drawable, { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.set(q("[data-slab]"), { strokeDashoffset: 0 });
  gsap.set(grp("foundation"), { opacity: 0.4 });
  gsap.set(grp("guides"), { opacity: 0.55 });
  gsap.set(grp("grid"), { opacity: 0.55 });
  gsap.set(q("[data-fill]"), { opacity: 0 });
  gsap.set(grp("light"), { opacity: 0 });
  gsap.set(grp("halo"), { opacity: 1 });
  gsap.set(q("[data-halo]"), { opacity: 0 });
  gsap.set(q(".hs-star"), { opacity: 0 });
  gsap.set(grp("labels"), { opacity: 0 });
  const cfs = q(".cf");
  cfs.forEach((el) => gsap.set(el, { clipPath: "inset(0 100% 0 0)", autoAlpha: 1 }));
  const cf = (id) => house.querySelector(`[data-cf="${id}"]`);
  gsap.set(cf("idea"), { clipPath: "inset(0 0% 0 0)", autoAlpha: narrow ? 0 : 1 });

  // --- helpers
  const draw = (els, at, total) => {
    if (!els.length) return;
    const dur = total / (1 + (els.length - 1) * 0.5);
    tl.to(els, { strokeDashoffset: 0, duration: dur, stagger: dur * 0.5, ease: "none" }, at);
  };
  const fade = (els, at, dur, to = 1) => tl.to(els, { opacity: to, duration: dur, ease: "none" }, at);
  // The code fragment is written (clip-path reveal) as its step starts, then dims once the next step takes over.
  const write = (id, at, dur) => {
    const el = cf(id);
    if (!el) return;
    if (narrow) tl.to(el, { autoAlpha: 1, clipPath: "inset(0 0% 0 0)", duration: dur, ease: "none" }, at);
    else tl.to(el, { clipPath: "inset(0 0% 0 0)", duration: dur, ease: "none" }, at);
  };
  const dim = (id, at, dur, to = 0.42) => {
    const el = cf(id);
    if (!el) return;
    if (narrow) tl.to(el, { autoAlpha: 0, duration: dur, ease: "none" }, at); // phones: one fragment at a time
    else tl.to(el, { opacity: to, duration: dur, ease: "none" }, at);
  };

  // --- Stage 1 -> 2: the idea fades back, the construction guides stay
  dim("idea", T.s2, 0.03, 0.45);

  // --- Stage 3: the craft: foundation, vertical supports, beams
  fade(grp("foundation"), T.craft, 0.02, 1);
  fade(grp("guides"), T.craft, 0.03, 0.3);
  write("foundation", T.craft + 0.01, 0.025);
  draw(strokes("foundation").filter((e) => !e.hasAttribute("data-slab")), T.craft + 0.01, 0.035);
  dim("idea", T.craft, 0.02, 0.2);
  write("frame", T.craft + 0.045, 0.025);
  dim("foundation", T.craft + 0.045, 0.02);
  draw(strokes("frame"), T.craft + 0.045, 0.05);
  write("beams", T.craft + 0.1, 0.025);
  dim("frame", T.craft + 0.1, 0.02);
  draw(strokes("beams"), T.craft + 0.1, 0.06);

  // --- Stage 4: the creation: walls, windows and door, roof
  dim("beams", T.creation, 0.02);
  fade(grp("guides"), T.creation, 0.04, 0.16);
  write("walls", T.creation + 0.005, 0.025);
  draw(strokes("walls"), T.creation + 0.005, 0.055);
  fade(q('[data-h="walls"] [data-fill]'), T.creation + 0.03, 0.04, 1);
  write("openings", T.creation + 0.06, 0.025);
  dim("walls", T.creation + 0.06, 0.02);
  draw(strokes("windows"), T.creation + 0.06, 0.04);
  fade(q('[data-h="door"] [data-fill]'), T.creation + 0.095, 0.02, 1);
  draw(strokes("door"), T.creation + 0.085, 0.03);
  write("roof", T.creation + 0.12, 0.025);
  dim("openings", T.creation + 0.12, 0.02);
  draw(strokes("roof"), T.creation + 0.12, 0.075);

  // --- Stage 5: the finished house: lights, details, landscaping, the AI touch
  dim("roof", T.mindset, 0.02);
  fade(grp("light"), T.mindset + 0.01, 0.05, 1);
  draw(strokes("details"), T.mindset + 0.02, 0.05);
  fade(q('[data-h="details"] [data-fill]'), T.mindset + 0.05, 0.02, 1);
  draw(strokes("landscape"), T.mindset + 0.05, 0.07);
  fade(q(".hs-star"), T.mindset + 0.09, 0.04, 0.8);
  write("final", T.mindset + 0.08, 0.03);
  draw(strokes("ai"), T.mindset + 0.1, 0.04);
  fade(q('[data-h="ai"] [data-fill]'), T.mindset + 0.12, 0.02, 1);
  fade(grp("guides"), T.mindset + 0.05, 0.04, 0.07);
  fade(grp("grid"), T.mindset + 0.05, 0.05, 0.3);
  // three themes light up in turn: full-stack (the whole structure), problem-solving (the door), AI (the node)
  const halos = (n) => q(`[data-halo="${n}"]`);
  tl.to(halos("stack"), { opacity: 0.1, duration: 0.02, ease: "none" }, T.mindset + 0.13)
    .to(halos("door"), { opacity: 0.35, duration: 0.02, ease: "none" }, T.mindset + 0.15)
    .to(halos("ai"), { opacity: 0.35, duration: 0.02, ease: "none" }, T.mindset + 0.17);
  fade(grp("labels"), T.mindset + 0.15, 0.03, 1);
}
