// Media queries shared by every gsap.matchMedia() context.
export const MEDIA = {
  reduce: "(prefers-reduced-motion: reduce)",
  motion: "(prefers-reduced-motion: no-preference)",
  // Pinned project stack: desktop only, tall enough for a full plate.
  pin: "(min-width: 1024px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)",
  wide: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
};
