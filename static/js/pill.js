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
  let inGallery = false; // the pinned certificate gallery needs the full viewport height
  const apply = () => pill.classList.toggle("is-visible", pastHero && !nearContact && !inGallery);
  ScrollTrigger.create({
    trigger: hero, start: "bottom 20%",
    onEnter: () => { pastHero = true; apply(); },
    onLeaveBack: () => { pastHero = false; apply(); },
  });
  ScrollTrigger.create({
    trigger: contact, start: "top 75%",
    onEnter: () => { nearContact = true; apply(); },
    onLeaveBack: () => { nearContact = false; apply(); },
  });
  const gallery = document.getElementById("certificates");
  if (gallery) {
    ScrollTrigger.create({
      trigger: gallery, start: "top 35%", end: "bottom 80%",
      onToggle: (self) => { inGallery = self.isActive; apply(); },
    });
  }
}
