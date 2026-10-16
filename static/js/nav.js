/* Full-screen navigation overlay. Owner of the overlay clip-path and item opacity/transform: Motion.
   Focus trap, Escape to close, aria-expanded and body scroll lock. */
import { animate, stagger } from "../vendor/motion.js";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function initNav() {
  const overlay = document.querySelector("[data-overlay]");
  const opener = document.querySelector("[data-menu-open]");
  const closer = document.querySelector("[data-menu-close]");
  if (!overlay || !opener || !closer) return;

  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const items = overlay.querySelectorAll("[data-overlay-item]");
  const ease = [0.76, 0, 0.24, 1];
  const hiddenClip = "circle(0% at calc(100% - 3rem) 2.5rem)";
  const shownClip = "circle(150% at calc(100% - 3rem) 2.5rem)";
  let open = false;
  let busy = false;

  function show() {
    if (open || busy) return;
    open = true;
    overlay.dataset.open = "true";
    opener.setAttribute("aria-expanded", "true");
    document.body.classList.add("scroll-locked");
    if (!reduced()) {
      overlay.style.clipPath = hiddenClip;
      items.forEach((n) => { n.style.opacity = "0"; });
      animate(overlay, { clipPath: [hiddenClip, shownClip] }, { duration: 0.7, ease });
      animate(items, { opacity: [0, 1], transform: ["translateY(24px)", "translateY(0px)"] },
        { duration: 0.5, delay: stagger(0.06, { startDelay: 0.3 }), ease: "easeOut" });
    }
    closer.focus({ preventScroll: true });
  }

  async function hide({ restoreFocus = true } = {}) {
    if (!open || busy) return;
    busy = true;
    if (!reduced()) {
      await animate(overlay, { clipPath: [shownClip, hiddenClip] }, { duration: 0.55, ease }).finished;
    }
    open = false;
    delete overlay.dataset.open;
    overlay.style.clipPath = "";
    items.forEach((n) => { n.style.opacity = ""; n.style.transform = ""; });
    opener.setAttribute("aria-expanded", "false");
    document.body.classList.remove("scroll-locked");
    if (restoreFocus) opener.focus({ preventScroll: true });
    busy = false;
  }

  opener.addEventListener("click", show);
  closer.addEventListener("click", () => hide());

  overlay.addEventListener("click", async (e) => {
    const link = e.target.closest("a[href^='#']");
    if (!link) return;
    e.preventDefault();
    const href = link.getAttribute("href");
    const target = document.querySelector(href);
    await hide({ restoreFocus: false });
    if (target) {
      target.scrollIntoView({ behavior: "auto", block: "start" });
      history.replaceState(null, "", href);
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }
  });

  document.addEventListener("keydown", (e) => {
    if (!open) return;
    if (e.key === "Escape") {
      e.preventDefault();
      hide();
      return;
    }
    if (e.key !== "Tab") return;
    const nodes = [...overlay.querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null);
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}
