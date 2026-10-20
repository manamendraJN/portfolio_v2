import { gsap } from "../vendor/gsap.js";

export function buildHouse(tl, house, T, narrow) {
  const q = (sel) => [...house.querySelectorAll(sel)];
  const group = (name) => q(`[data-h="${name}"]`);
  const strokes = (name) => q(`[data-h="${name}"] [data-d]`);
  q("[data-d]").forEach((el) => el.setAttribute("pathLength", "1"));
  gsap.set(q("[data-d]"), { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.set(q("[data-slab]"), { strokeDashoffset: 0 });
  gsap.set(group("foundation"), { opacity: 0.4 });
  gsap.set(group("guides"), { opacity: 0.55 });
  gsap.set(group("grid"), { opacity: 0.55 });
  gsap.set(q("[data-fill], [data-h='light'], [data-h='labels'], [data-halo]"), { opacity: 0 });
  gsap.set(group("halo"), { opacity: 1 });
  const cf = (id) => house.querySelector(`[data-cf="${id}"]`);
  gsap.set(q(".cf"), { clipPath: "inset(0 100% 0 0)", autoAlpha: 1 });
  gsap.set(cf("idea"), { clipPath: "inset(0 0% 0 0)", autoAlpha: narrow ? 0 : 1 });
  const draw = (els, at, total) => {
    if (!els.length) return;
    const duration = total / (1 + (els.length - 1) * 0.5);
    tl.to(els, { strokeDashoffset: 0, duration, stagger: duration * 0.5, ease: "none" }, at);
  };
  const fade = (els, at, duration, opacity = 1) => tl.to(els, { opacity, duration, ease: "none" }, at);
  const write = (id, at, duration) => {
    const el = cf(id);
    if (!el) return;
    const vars = { clipPath: "inset(0 0% 0 0)", duration, ease: "none" };
    if (narrow) vars.autoAlpha = 1;
    tl.to(el, vars, at);
  };
  const dim = (id, at, duration) => {
    const el = cf(id);
    if (!el) return;
    const vars = { duration, ease: "none" };
    if (narrow) vars.autoAlpha = 0;
    else vars.opacity = 0.38;
    tl.to(el, vars, at);
  };
  fade(group("foundation"), T.craft, 0.02);
  fade(group("guides"), T.craft, 0.03, 0.3);
  write("foundation", T.craft + 0.01, 0.025);
  draw(strokes("foundation").filter((el) => !el.hasAttribute("data-slab")), T.craft + 0.01, 0.035);
  dim("idea", T.craft, 0.02);
  write("frame", T.craft + 0.045, 0.025); dim("foundation", T.craft + 0.045, 0.02); draw(strokes("frame"), T.craft + 0.045, 0.05);
  write("beams", T.craft + 0.1, 0.025); dim("frame", T.craft + 0.1, 0.02); draw(strokes("beams"), T.craft + 0.1, 0.06);
  dim("beams", T.creation, 0.02); fade(group("guides"), T.creation, 0.04, 0.16);
  write("walls", T.creation + 0.005, 0.025); draw(strokes("walls"), T.creation + 0.005, 0.055); fade(q('[data-h="walls"] [data-fill]'), T.creation + 0.03, 0.04);
  write("openings", T.creation + 0.06, 0.025); dim("walls", T.creation + 0.06, 0.02); draw(strokes("windows"), T.creation + 0.06, 0.04); fade(q('[data-h="door"] [data-fill]'), T.creation + 0.095, 0.02); draw(strokes("door"), T.creation + 0.085, 0.03);
  write("roof", T.creation + 0.12, 0.025); dim("openings", T.creation + 0.12, 0.02); draw(strokes("roof"), T.creation + 0.12, 0.075);
  dim("roof", T.mindset, 0.02); fade(group("light"), T.mindset + 0.01, 0.05); draw(strokes("details"), T.mindset + 0.02, 0.05); draw(strokes("landscape"), T.mindset + 0.05, 0.07); fade(group("guides"), T.mindset + 0.05, 0.04, 0.07); fade(q('[data-h="ai"] [data-fill]'), T.mindset + 0.12, 0.02); write("final", T.mindset + 0.08, 0.03); draw(strokes("ai"), T.mindset + 0.1, 0.04); fade(q("[data-h='labels']"), T.mindset + 0.15, 0.03);
}
