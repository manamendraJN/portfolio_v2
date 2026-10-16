/* Entry point. Only scroll-driven motion runs on this site (GSAP ScrollTrigger, scrubbed transforms,
   opacity, clip-path and stroke-dashoffset). No timed or load animations, no animation library besides GSAP.
   Ownership: GSAP owns scroll-driven transforms; CSS owns the nav overlay, pill and list-row hover states. */
import { gsap, ScrollTrigger } from "../vendor/gsap.js";
import "./media.js";
import { initHero } from "./hero.js";
import { initParallax } from "./parallax.js";
import { initSheets } from "./sheets.js";
import { initThread } from "./thread.js";
import { initIndex } from "./index-nav.js";
import { initProjects } from "./projects.js";
import { initRail } from "./rail.js";
import { initResearch } from "./research.js";
import { initPill } from "./pill.js";
import { initNav } from "./nav.js";

const root = document.documentElement;
const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const syncReduced = () => root.classList.toggle("is-reduced", reducedQuery.matches);
syncReduced();
reducedQuery.addEventListener("change", syncReduced);

ScrollTrigger.config({ ignoreMobileResize: true });

// gsap.matchMedia() separates desktop, mobile and reduced-motion behaviour (see media.js).
const mm = gsap.matchMedia();

initNav();
initHero();
initRail();

initParallax(mm);
initProjects(mm);
initSheets(mm);
initIndex(); // created after the pin so positions include its spacer
initPill();
initResearch(mm);
initThread(mm); // last: its path is measured from the final layout
ScrollTrigger.refresh();

// Layout shifts after fonts and images load move every trigger.
const refresh = () => ScrollTrigger.refresh();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
window.addEventListener("load", refresh);
document.querySelectorAll("img[loading=lazy]").forEach((img) => img.addEventListener("load", refresh, { once: true }));
