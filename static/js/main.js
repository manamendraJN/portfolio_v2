/* Entry point. Animation ownership (one owner per animated property):
   - GSAP + ScrollTrigger: all scroll-driven motion, preloader, headline reveals, hero scene opacity.
   - Motion: navigation overlay (clip-path, item opacity/transform) and [data-btn] scale.
   - CSS: floating pill show/hide, list-row detail reveal, link underline states. */
import { gsap, ScrollTrigger } from "../vendor/gsap.js";
import { MEDIA } from "./media.js";
import { runPreloader } from "./preloader.js";
import { initReveal } from "./reveal.js";
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
import { initButtons } from "./buttons.js";

const root = document.documentElement;
const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const syncReduced = () => root.classList.toggle("is-reduced", reducedQuery.matches);
syncReduced();
reducedQuery.addEventListener("change", syncReduced);

ScrollTrigger.config({ ignoreMobileResize: true });

// gsap.matchMedia() separates desktop, mobile and reduced-motion behaviour (see media.js).
const mm = gsap.matchMedia();

// Accessibility-first modules that work regardless of motion preference.
initNav();
initButtons();
initRail();

const start = () => {
  initReveal(mm);
  initHero(mm);
  initParallax(mm);
  initProjects(mm);
  initSheets(mm);
  initIndex(); // created after the pin so positions include its spacer
  initPill();
  initResearch(mm);
  initThread(mm); // last: its path is measured from the final layout
  ScrollTrigger.refresh();
};

runPreloader().then(start);

// Layout shifts after fonts and images load move every trigger.
const refresh = () => ScrollTrigger.refresh();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
window.addEventListener("load", refresh);
document.querySelectorAll("img[loading=lazy]").forEach((img) => img.addEventListener("load", refresh, { once: true }));
