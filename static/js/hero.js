/* Hero day/night toggle: a plain state swap. No timed animation runs in the hero;
   all hero motion is scroll-driven (parallax.js). */
export function initHero() {
  const scene = document.querySelector("[data-scene]");
  const toggle = document.querySelector("[data-scene-toggle]");
  const label = document.querySelector("[data-scene-toggle-label]");
  if (!scene || !toggle) return;
  const day = scene.querySelector(".scene-day");
  const night = scene.querySelector(".scene-night");
  const labels = { day: "View by night", night: "View by day" };

  // Keep assistive tech pointed at whichever state is visible.
  const sync = () => {
    const isNight = scene.dataset.mode === "night";
    toggle.setAttribute("aria-pressed", String(isNight));
    label.textContent = labels[scene.dataset.mode];
    day.setAttribute("aria-hidden", String(isNight));
    night.setAttribute("aria-hidden", String(!isNight));
    const nightSvg = night.querySelector("svg");
    if (nightSvg) {
      if (isNight) {
        nightSvg.setAttribute("role", "img");
        nightSvg.setAttribute("aria-label", "Illustration, by night: the same desk and landscape under a moon, with the lamp lit.");
      } else {
        nightSvg.removeAttribute("role");
        nightSvg.removeAttribute("aria-label");
      }
    }
  };
  sync();
  toggle.addEventListener("click", () => {
    scene.dataset.mode = scene.dataset.mode === "night" ? "day" : "night";
    sync();
  });
}
