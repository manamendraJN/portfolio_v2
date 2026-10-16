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

  toggle.addEventListener("click", () => {
    const next = scene.dataset.mode === "night" ? "day" : "night";
    scene.dataset.mode = next;
    toggle.setAttribute("aria-pressed", String(next === "night"));
    label.textContent = labels[next];
    day.setAttribute("aria-hidden", String(next === "night"));
    night.setAttribute("aria-hidden", "true");
  });
}
