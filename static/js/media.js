// Media queries shared by every gsap.matchMedia() context.
export const MEDIA = {
  reduce: "(prefers-reduced-motion: reduce)",
  motion: "(prefers-reduced-motion: no-preference)",
  // Pinned project stack: desktop only, tall enough for a full plate.
  pin: "(min-width: 1024px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)",
  // Staged hero (pinned layered scene): every screen at least 420px tall, phones included.
  stage: "(prefers-reduced-motion: no-preference) and (min-height: 420px)",
  // Everything with motion allowed that is not staged.
  flat: "(prefers-reduced-motion: no-preference) and (max-height: 419px)",
  wide: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
};
