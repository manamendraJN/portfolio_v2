// Media queries shared by every gsap.matchMedia() context.
export const MEDIA = {
  reduce: "(prefers-reduced-motion: reduce)",
  motion: "(prefers-reduced-motion: no-preference)",
  // Pinned project stack: desktop only, tall enough for a full plate.
  pin: "(min-width: 1024px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)",
  // Staged hero (pinned layered scene): tall desktop screens only.
  stage: "(min-width: 900px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)",
  // Everything with motion allowed that is not staged.
  flat: "(prefers-reduced-motion: no-preference) and (max-width: 899px), (prefers-reduced-motion: no-preference) and (max-height: 699px)",
  wide: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
};
