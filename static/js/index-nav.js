/* Fixed numbered section index: highlights the section in view.
   Plain DOM (aria-current); no animated properties are owned here. */
import { ScrollTrigger } from "../vendor/gsap.js";

export function initIndex() {
  const links = new Map(
    [...document.querySelectorAll("[data-index-link]")].map((a) => [a.dataset.indexLink, a]),
  );
  if (!links.size) return;
  const set = (id) => links.forEach((a, key) => {
    if (key === id) a.setAttribute("aria-current", "true");
    else a.removeAttribute("aria-current");
  });
  links.forEach((_, id) => {
    const section = document.getElementById(id);
    if (!section) return;
    ScrollTrigger.create({
      trigger: section, start: "top 50%", end: "bottom 50%",
      onToggle: (self) => {
        if (self.isActive) set(id);
        else if (links.get(id).getAttribute("aria-current")) set("");
      },
    });
  });
}
