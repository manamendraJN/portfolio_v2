/* Projects: intro drift + pinned stack (desktop only).
   Owners: GSAP owns .drift-row transform, each plate's yPercent (stack) and plate-art clip-path.
   On mobile and under reduced motion the plates stay plain stacked cards. */
import { gsap } from "../vendor/gsap.js";
import { MEDIA } from "./media.js";

export function initProjects(mm) {
  const stack = document.querySelector("[data-stack]");
  const drift = document.querySelector("[data-drift]");

  mm.add({ motion: MEDIA.motion }, (ctx) => {
    if (!ctx.conditions.motion || !drift) return;
    gsap.fromTo(drift, { x: () => window.innerWidth * 0.15 }, {
      x: () => -(drift.scrollWidth - window.innerWidth * 0.85),
      ease: "none",
      scrollTrigger: { trigger: drift, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true },
    });
  });

  mm.add({ pin: MEDIA.pin }, (ctx) => {
    if (!ctx.conditions.pin || !stack) return;
    const plates = gsap.utils.toArray("[data-plate]", stack);
    const arts = plates.map((p) => p.querySelector("[data-plate-art]"));
    stack.classList.add("is-pinned");

    plates.forEach((p, i) => gsap.set(p, { zIndex: i + 1, yPercent: i === 0 ? 0 : 100 }));
    arts.slice(1).forEach((a) => gsap.set(a, { clipPath: "inset(0 0 100% 0)" }));

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: stack,
        start: "top top",
        end: () => "+=" + (plates.length - 1) * window.innerHeight * 0.9,
        pin: true, scrub: 0.5, anticipatePin: 1, invalidateOnRefresh: true,
        refreshPriority: 10, // measure the pin first so later triggers include its spacer
      },
    });
    plates.forEach((p, i) => {
      if (i === 0) return;
      tl.to(p, { yPercent: 0, duration: 1 })
        .to(arts[i], { clipPath: "inset(0 0 0% 0)", duration: 0.6, ease: "power2.out" }, "<0.4");
    });

    // First plate: clip-path reveal as the stack enters.
    gsap.from(arts[0], {
      clipPath: "inset(0 0 100% 0)", duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: stack, start: "top 70%", once: true },
    });

    return () => stack.classList.remove("is-pinned");
  });
}
