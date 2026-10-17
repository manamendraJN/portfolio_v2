/* Floating "Get in touch" pill: visible after the hero, hidden near the contact section.
   Show/hide (opacity, transform, visibility) is owned by CSS; JS only toggles .is-visible. */
import { ScrollTrigger } from "../vendor/gsap.js";

export function initPill() {
  const pill = document.querySelector("[data-pill]");
  const hero = document.getElementById("hero");
  const contact = document.getElementById("contact");
  if (!pill || !hero || !contact) return;
  let pastHero = false;
  let nearContact = false;
  const apply = () => pill.classList.toggle("is-visible", pastHero && !nearContact);
  ScrollTrigger.create({
    trigger: hero, start: "bottom 20%",
    onEnter: () => { pastHero = true; document.documentElement.classList.add("past-hero"); apply(); },
    onLeaveBack: () => { pastHero = false; document.documentElement.classList.remove("past-hero"); apply(); },
  });
  ScrollTrigger.create({
    trigger: contact, start: "top 75%",
    onEnter: () => { nearContact = true; apply(); },
    onLeaveBack: () => { nearContact = false; apply(); },
  });
}
