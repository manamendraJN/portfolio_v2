/* Staggered headline reveals: split by line and word, masked upward motion.
   Owner of the words' transform: GSAP. Splitting happens only when motion is allowed,
   so the markup stays intact without JavaScript and under reduced motion. */
import { gsap, ScrollTrigger } from "../vendor/gsap.js";
import { MEDIA } from "./media.js";

function wrapWords(node) {
  const words = [];
  const walk = (parent) => {
    [...parent.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(document.createTextNode(" ")); return; }
          const mask = document.createElement("span");
          mask.className = "mask-line";
          mask.setAttribute("aria-hidden", "true");
          const inner = document.createElement("span");
          inner.className = "mask-word";
          inner.textContent = part;
          mask.append(inner);
          frag.append(mask);
          words.push(inner);
        });
        parent.replaceChild(frag, child);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child);
      }
    });
  };
  walk(node);
  return words;
}

function lineDelays(words) {
  // Group words by rendered line (offsetTop) to build a line-then-word stagger.
  const tops = [];
  return words.map((w) => {
    const top = Math.round(w.parentElement.offsetTop);
    let line = tops.indexOf(top);
    if (line === -1) { tops.push(top); line = tops.length - 1; }
    return line;
  }).map((line, i, lines) => {
    const first = lines.indexOf(line);
    return line * 0.14 + (i - first) * 0.045;
  });
}

export function initReveal(mm) {
  mm.add({ motion: MEDIA.motion }, (ctx) => {
    if (!ctx.conditions.motion) return;
    const heads = [...document.querySelectorAll("[data-split], [data-hero-title]")];
    const restore = [];

    heads.forEach((h) => {
      const original = h.innerHTML;
      const label = h.textContent.replace(/\s+/g, " ").trim();
      const hero = h.hasAttribute("data-hero-title");
      h.setAttribute("aria-label", label);
      const words = wrapWords(h);
      const delays = lineDelays(words);
      restore.push(() => { h.innerHTML = original; h.removeAttribute("aria-label"); });

      gsap.set(words, { yPercent: 115 });
      const play = () => gsap.to(words, {
        yPercent: 0, duration: hero ? 1.1 : 0.9, ease: "power4.out",
        delay: (i) => delays[i],
      });
      if (hero) play();
      else ScrollTrigger.create({ trigger: h, start: "top 88%", once: true, onEnter: play });
    });

    return () => restore.forEach((fn) => fn());
  });
}
