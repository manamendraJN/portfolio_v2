/* Full-screen navigation overlay. Open/close motion is a CSS clip-path transition (site.css).
   JS handles focus trap, Escape to close, aria-expanded and body scroll lock. */
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function initNav() {
  const overlay = document.querySelector("[data-overlay]");
  const opener = document.querySelector("[data-menu-open]");
  const closer = document.querySelector("[data-menu-close]");
  if (!overlay || !opener || !closer) return;

  const items = [...overlay.querySelectorAll("[data-overlay-item]")];
  items.forEach((n, i) => n.style.setProperty("--i", i));
  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = () => new Promise((r) => setTimeout(r, reduced() ? 0 : 900));
  let open = false;

  function show() {
    if (open) return;
    open = true;
    overlay.dataset.open = "true";
    opener.setAttribute("aria-expanded", "true");
    document.body.classList.add("scroll-locked");
    closer.focus({ preventScroll: true });
  }

  async function hide({ restoreFocus = true } = {}) {
    if (!open) return;
    open = false;
    delete overlay.dataset.open;
    opener.setAttribute("aria-expanded", "false");
    document.body.classList.remove("scroll-locked");
    await wait();
    if (restoreFocus) opener.focus({ preventScroll: true });
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
