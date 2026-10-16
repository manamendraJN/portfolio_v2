/* Certificate gallery: vertical scroll drives the rail sideways (pinned, every screen size).
   Owner of the rail transform: GSAP (scrubbed). Under reduced motion the rail stays a native scroll-snap row
   (see rail.js). The distance is measured from the real track width, never hardcoded. */
import { gsap, ScrollTrigger } from "../vendor/gsap.js";
import { MEDIA } from "./media.js";

export function initCertificates(mm) {
  const pinEl = document.querySelector("[data-cert-pin]");
  const rail = document.querySelector("[data-rail]");
  const hint = document.querySelector("[data-rail-hint-text]");
  if (!pinEl || !rail) return;
  const nativeHint = hint ? hint.textContent : "";

  mm.add({ driven: MEDIA.motion }, (ctx) => {
    if (!ctx.conditions.driven) return;
    const viewport = rail.parentElement;
    const distance = () => Math.max(0, rail.scrollWidth - viewport.clientWidth);
    pinEl.classList.add("is-driven");
    if (hint) hint.textContent = "Scroll to explore";

    const tween = gsap.to(rail, {
      x: () => -distance(), ease: "none",
      scrollTrigger: {
        trigger: pinEl, start: "top 80px", end: () => "+=" + distance(),
        pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 5,
      },
    });

    // Keyboard: focusing an off-screen card scrolls the page to the matching position.
    const onFocus = (e) => {
      const card = e.target.closest("li");
      if (!card || !rail.contains(card) || !distance()) return;
      const st = tween.scrollTrigger;
      const progress = Math.min(1, Math.max(0, card.offsetLeft / distance()));
      window.scrollTo(0, st.start + progress * (st.end - st.start));
    };
    rail.addEventListener("focusin", onFocus);

    return () => {
      rail.removeEventListener("focusin", onFocus);
      pinEl.classList.remove("is-driven");
      if (hint) hint.textContent = nativeHint;
    };
  });
}
