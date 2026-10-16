/* Short preloader: <= 1.2s, first visit per session, skippable.
   Owners: GSAP owns the counter text, mark stroke-dashoffset and the preloader clip-path. */
import { gsap } from "../vendor/gsap.js";

export function runPreloader() {
  const root = document.documentElement;
  const el = document.querySelector("[data-preloader]");
  if (!el || !root.classList.contains("js-preload")) return Promise.resolve();

  return new Promise((resolve) => {
    const count = el.querySelector("[data-preloader-count]");
    const mark = el.querySelector("[data-preloader-mark]");
    const skip = el.querySelector("[data-preloader-skip]");
    const len = mark.getTotalLength();
    const state = { n: 0 };
    let finished = false;

    document.body.classList.add("scroll-locked");
    gsap.set(mark, { strokeDasharray: len, strokeDashoffset: len });

    const finish = () => {
      if (finished) return;
      finished = true;
      try { sessionStorage.setItem("nm-seen", "1"); } catch (e) { /* storage unavailable */ }
      document.removeEventListener("keydown", onKey);
      root.classList.remove("js-preload");
      document.body.classList.remove("scroll-locked");
      resolve();
    };

    const tl = gsap.timeline({ onComplete: finish });
    tl.to(state, {
      n: 100, duration: 0.8, ease: "power2.inOut",
      onUpdate: () => { count.textContent = String(Math.round(state.n)).padStart(2, "0"); },
    }, 0)
      .to(mark, { strokeDashoffset: 0, duration: 0.8, ease: "power1.inOut" }, 0)
      .to(el, { clipPath: "inset(0 0 100% 0)", duration: 0.4, ease: "power3.inOut" }, 0.8);

    const skipNow = () => { tl.timeScale(20); };
    const onKey = (e) => { if (e.key === "Escape") skipNow(); };
    skip.addEventListener("click", skipNow);
    el.addEventListener("click", skipNow);
    document.addEventListener("keydown", onKey);
  });
}
