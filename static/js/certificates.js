/* Certificate gallery: vertical scroll drives the cards from right to left (pinned, every screen size),
   with layered parallax: every certificate illustration drifts against its card while the row stays aligned.
   Everything is scroll-linked and user-controlled (no autonomous motion), so it also runs when the system
   asks for reduced motion. Owner of these transforms: GSAP (scrubbed). The distance is measured from the real
   track width, never hardcoded. Without JavaScript the rail stays a native scroll-snap row. */
import { gsap } from "../vendor/gsap.js";

export function initCertificates(mm) {
  const pinEl = document.querySelector("[data-cert-pin]");
  const rail = document.querySelector("[data-rail]");
  const hint = document.querySelector("[data-rail-hint-text]");
  if (!pinEl || !rail) return;
  const nativeHint = hint ? hint.textContent : "";

  mm.add("(min-width: 0px)", () => {
    const viewport = rail.parentElement;
    const cards = [...rail.children];
    // Layout-based track width (ignores the parallax transforms): last card edge plus the end padding.
    const distance = () => {
      const last = cards[cards.length - 1];
      const padEnd = parseFloat(getComputedStyle(rail).paddingRight) || 0;
      return Math.max(0, last.offsetLeft + last.offsetWidth + padEnd - viewport.clientWidth);
    };
    pinEl.classList.add("is-driven");
    if (hint) hint.textContent = "Scroll to explore";

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: pinEl, start: "top 80px", end: () => "+=" + distance(),
        pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 5,
      },
    });
    // The whole track moves right to left in step with the scroll.
    tl.to(rail, { x: () => -distance(), duration: 1 }, 0);
    // Parallax depth: the cards stay in one clean row; each certificate illustration drifts against its card.
    cards.forEach((card, i) => {
      const depth = i % 3;
      const art = card.querySelector(".cert-art > svg, .cert-art > img");
      if (art) tl.fromTo(art, { x: -16 * (depth + 1), scale: 1.2 }, { x: 16 * (depth + 1), scale: 1.2, duration: 1 }, 0);
    });

    // Keyboard: focusing an off-screen card scrolls the page to the matching position.
    const onFocus = (e) => {
      const card = e.target.closest("li");
      if (!card || !rail.contains(card) || !distance()) return;
      const st = tl.scrollTrigger;
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
