<role>
You are a senior creative developer and illustrator-minded front-end engineer who builds award-quality editorial websites with server-rendered Django. You write restrained, accessible, high-performance code, and you treat factual accuracy as a hard requirement for a personal portfolio.
</role>

<objective>
Build the complete official portfolio website of Navodya Manamendra (Software Engineer and Full-Stack Developer) as a Django-only project. The finished site should feel like a calm, hand-illustrated digital publication whose scroll tells a single story: from first sketch to software people rely on.

Do not stop at a plan or mockup. Build it, run the checks listed in <acceptance_criteria>, fix what fails, and finish with a short report.
</objective>

<operating_rules>
- Do not ask clarifying questions. Where information is missing, use the placeholder rules in <content_rules> and continue.
- Work in the phases listed in <workflow>. Finish and verify each phase before starting the next.
- If two instructions conflict, follow this priority: (1) factual accuracy, (2) accessibility and no-JS readability, (3) performance, (4) visual ambition.
- Prefer fewer, better-executed effects over many effects. If an effect is not listed in <signature_techniques>, do not add it.
- Never invent facts, metrics, image URLs, screenshots, certificates, or links.
</operating_rules>

<stack>
Django 5.x is the only application framework. Django renders every page.

Required:
- Django templates (base layout, partials, and custom template tags for repeated components such as project card, certificate card, section heading, and `{% icon "name" %}`).
- Tailwind CSS compiled with the standalone Tailwind CLI, plus one small hand-written CSS file for illustration, paper-grain, and animation-state styles.
- GSAP and ScrollTrigger as plain ES modules for all scroll-driven animation. Vendor the files into `static/vendor/`; do not load them from a CDN at runtime.
- Motion (vanilla `motion` package) only for the navigation overlay and button micro-interactions.
- Lucide icons as static SVGs, inlined by the `icon` template tag.
- WhiteNoise for static files, environment-based settings, Gunicorn.

Forbidden: React, Next.js, any Node application server, `@gsap/react`, Motion for React, Lucide React, jQuery, HTMX, Django REST Framework, a smooth-scroll library (use native scrolling), and a database for content.

Content lives in typed, frozen Python dataclasses in a `content/` package (one module per section). It is not stored in a database and needs no admin. Use SQLite only if Django requires a default.

Animation ownership: every animated property on every element has exactly one owner (GSAP, Motion, or CSS). Document the owner in a comment where the animation is created.
</stack>

<design_system>
<intent>
Warm, light, and tactile: paper, ink, and a single confident accent. Calm like a printed monograph, with one memorable hero moment and one continuous narrative thread. This is a deliberate reduction of the earlier seven-color palette; restraint reads as more premium and keeps illustrations cohesive.
</intent>

<palette>
Define as CSS variables and Tailwind tokens.
- paper: #F5F0E6 (page background, with grain)
- surface: #FFFDF8 (cards, panels)
- ink: #1B2438 (text, line art, borders)
- vermilion: #C2411F (the only accent: CTAs, handwritten annotations, key underlines; meets 4.5:1 on paper)
- wash-blue: #9DB4C8 (ink-wash fills, skies, diagram planes)
- sage: #7F9477 (botanical and landscape details; decorative only)
- ochre: #D9A441 (tiny highlights inside illustrations only, under 5% of any illustration)
- dusk: #232C4A (used only inside the hero illustration's "night" state, never as a page background)

Rules: no pure black, no neon, no gradients except soft ink-wash tints inside illustrations. Verify every text/background pair reaches WCAG AA and fix any that do not.
</palette>

<typography>
- Display: Instrument Serif. Use italic for one emphasized phrase per headline (for example, "Thoughtful code. *Intelligent ideas.* Useful software.").
- Body and UI: Manrope.
- Labels and technical details: a restrained monospace (Geist Mono or JetBrains Mono), small, uppercase or tabular, used only for section numbers, tags, and captions.
- Self-host the fonts with `font-display: swap`. Use fluid type with `clamp()`; the hero headline should be very large and the body comfortably readable.
</typography>

<illustration_style>
All illustrations are original inline SVG stored as template partials in `templates/illustrations/`.
- Ink-wash and line-art look: confident ink strokes in `ink`, loose washes in `wash-blue` and `sage`, hand-drawn wobble from a small SVG `feTurbulence`/`feDisplacementMap` filter applied sparingly.
- Motifs: topographic contour lines, blueprint grids, architectural sections, circuit-like terrain, botanical line drawings, technical doodles of code, databases, neural networks, cameras, and browsers.
- Backgrounds must have depth: a subtle paper grain (small SVG noise, not a large image), faint contour or grid layers, and layered scenery. No large flat empty areas.
- Do not copy any existing artwork, character, or brand. Do not use stock imagery. Clearly label original illustrations versus real screenshots in captions.
</illustration_style>
</design_system>

<signature_techniques>
These are the only advanced techniques to implement. Each is adapted from patterns seen in two reference sites (an architectural real-estate site and a Sri Lankan software studio site), reinterpreted with original artwork and original copy. Do not replicate their imagery, wording, or layouts.

1. **Short preloader with progress counter.** A brief paper-colored intro (maximum 1.2 seconds, first visit per session only, skippable, never blocks content when JavaScript is off) showing a two-digit counter and a line-drawn mark, then lifting away with a clip-path reveal.
2. **Hero with a day/night illustration crossfade.** The headline stays exactly as specified. Beneath or beside it, one large original illustrated scene of an engineer's desk and landscape has two states, "by day" and "by night", toggled by a labeled button and also crossfaded gently once on load. The night state uses `dusk` only inside the illustration frame. Respect reduced motion by switching instantly.
3. **Staggered headline reveals.** Split headlines by line and word, reveal with masked upward motion and a small stagger.
4. **One continuous narrative line.** A single SVG "thread" path runs down the page through the sections, drawn progressively with scrubbed `stroke-dashoffset`. A small original marker (for example, a pencil nib or drafting compass) travels along it. Caption near the hero: "From first sketch to software people rely on." (Original phrasing; do not reuse a boat or any other motif from the reference sites.)
5. **Fixed numbered section index.** A slim side or edge index (`01 Work`, `02 Skills`, and so on) in the monospace face, with the active section highlighted through ScrollTrigger. Hidden on small screens, where the navigation overlay serves the same purpose.
6. **Full-screen navigation overlay.** Motion-driven menu with staggered links and a clip-path open and close. Focus trap, Escape to close, `aria-expanded`, and body scroll lock.
7. **Layered parallax scenery.** Two or three stacked SVG layers (contours, hills, botanical shapes) move at different speeds behind the hero and the closing section, and overlap as the user scrolls.
8. **Pinned project storytelling (project stack).** The projects section pins once on desktop and stacks project panels so each new panel slides over the previous one. Each panel has its own illustration treatment, big numeric index, technology tags, and clip-path image reveal. On mobile and in reduced motion, panels are plain stacked cards.
9. **Stacked focus cards.** Three sticky cards for the three themes in the About text (practical web applications, reliable architecture and thoughtful experience, intelligent applications). Use only claims already in the About copy.
10. **Draggable horizontal rail with native fallback.** The certificate gallery is a horizontal rail with a "Drag to explore" hint, built on native `overflow-x` plus scroll-snap so keyboard and touch work without JavaScript, enhanced with pointer dragging. Images or panels may also drift right to left on scroll in the projects intro.
11. **Research pipeline diagram drawn on scroll.** In the research section, an SVG path with labels draws itself: front and side photographs, EfficientNet-B3 feature extraction, body measurements, garment-size scoring, confidence-rated size recommendation with fit advice. Tint the author's own module in vermilion and the wider group modules in a muted ink tone, with an explicit legend.
12. **Numbered list with hover detail.** Skills and experience use big-numeral rows (`01`, `02`) with a hover/focus state that reveals an illustrated detail; the content is always visible without hover.
13. **Floating contact pill.** A small "Get in touch" button appears after the hero, hides near the contact section, and is keyboard reachable.
14. **Closing section with presence.** A large serif headline over a layered illustrated landscape, with the final line drawing completing the narrative thread.

Performance and safety for all techniques:
- Animate only `transform`, `opacity`, `clip-path`, and `stroke-dashoffset`.
- Use `gsap.matchMedia()` to separate desktop, mobile, and `prefers-reduced-motion: reduce`. Under reduced motion, disable pinning, parallax, scrubbing, and the preloader; show final states.
- Reveal states (hidden-before-animation) are applied by JavaScript only. With JavaScript disabled, all content is visible and readable.
- Pin at most two sections (the projects stack and, optionally, the research pipeline), desktop only. No continuous looping effects.
- Call `ScrollTrigger.refresh()` after fonts and images load.
</signature_techniques>

<page_structure>
Single-page home (`/`) with anchor navigation, in this order:
1. Navigation (logo mark, menu button, overlay)
2. Hero
3. Selected projects (pinned stack)
4. Technical skills
5. About (with stacked focus cards)
6. Professional experience
7. Education
8. Featured academic research
9. Certificate gallery
10. Contact
11. Footer (small line such as "Drawn and coded by Navodya Manamendra", a back-to-top link, social links)

Remove or avoid: testimonials, blog, newsletter, analytics or cookie banners, a contact form, skill proficiency bars or percentages, stock photography, background video, and any section not listed above.
</page_structure>

<content_rules>
- Include only the facts in <content>. If a detail is not there, omit it or use an illustration.
- Placeholders: `[ADD EMAIL]`, `[ADD CV URL]`, and `[ADD CONFIRMED DATE]` are read from environment settings or content config. If a value is unset, do not render a broken link or visible bracket text; hide that item.
- Certificate image URLs are built from an `IMAGEKIT_URL_ENDPOINT` setting plus a per-certificate path. Leave paths empty until real assets are supplied, and render an original illustrated placeholder, never a fake certificate.
- Use real screenshots only if files are supplied. Otherwise use original illustrations and label them "Illustration".
- If you can read the project repositories, verify descriptions against them and correct anything that does not match. If you cannot, use only the text below.

<examples>
<example type="good">
"Reported 20% reduction in operational delays (figure from the project description, not independently verified)."
</example>
<example type="bad">
"Cut delays by 20% and boosted warehouse efficiency." (states an unverified figure as fact and invents a second claim)
</example>
<example type="good">
"Experience: Broadcast Ad Insertion & Playout Operator — broadcast operations, not software engineering."
</example>
<example type="bad">
"Software Engineer at Dialog Axiata." (misrepresents the role)
</example>
</examples>
</content_rules>

<content>
<person>
Name: Navodya Manamendra. Software Engineer and Full-Stack Developer. Fourth-year BSc (Hons) in Information Technology at the Sri Lanka Institute of Information Technology (SLIIT). Expected graduation: [ADD CONFIRMED DATE]. Do not invent grades or awards.
GitHub: https://github.com/manamendraJN
LinkedIn: https://www.linkedin.com/in/navodya-manamendra-35a309248/
Email: [ADD EMAIL]
Résumé: [ADD CV URL]
</person>

<hero>
Headline (exact): "Thoughtful code. Intelligent ideas. Useful software."
Intro: Navodya Manamendra, a Software Engineer building practical web applications and exploring intelligent solutions through AI and computer vision.
Buttons: "Explore My Work" (to projects), "Get in Touch" (to contact). Links: GitHub, LinkedIn.
</hero>

<about>
I'm a Software Engineer and Full-Stack Developer pursuing a BSc (Hons) in Information Technology at SLIIT. I enjoy turning complex problems into practical, well-designed software that improves real-world workflows.

My experience spans web application development, business-oriented systems, computer vision, and AI research. I'm particularly interested in reliable software architecture, thoughtful user experiences, and intelligent applications that solve meaningful problems.

I'm working toward becoming a well-rounded Software Engineer and AI Developer who can design, build, and deploy scalable, reliable, and intelligent software.
</about>

<projects>
These technologies describe the projects themselves, not this website.

1. Warehouse Management System. Repo: https://github.com/Shiranakther/Warehouse_Management_Syatem. MongoDB, Express, React, Node.js. Built for a client to streamline inventory, employee, and shipping operations. Navodya's contribution: secure login, staff management, and a shift scheduling algorithm. Features: inventory monitoring, low-stock alerts, purchase orders, shipping, wastage tracking, supplier management, staff scheduling. The supplied description reports a 20% reduction in operational delays; present it as a reported outcome, not verified.
2. IssueSync. Repo: https://github.com/manamendraJN/issue-tracker. Live: https://issuesync.netlify.app/. React, Vite, Tailwind CSS, Node.js, Express, MongoDB, JWT, Netlify, Render. Issue tracker with authentication, CRUD operations, reusable navigation, toast notifications, and separately deployed frontend and backend.
3. HandGestureControl. Repo: https://github.com/manamendraJN/HandGestureControl. Python, OpenCV, MediaPipe, PyAutoGUI, Win32 API. Controls the mouse through right-hand webcam gestures: cursor movement, adjustable speed, gesture-based clicking, calibration, real-time hand tracking.
4. Collab Hub. Repo: https://github.com/manamendraJN/Collab-Hub. React, Node.js, Express, MongoDB, Socket.IO, JWT. Remote-work platform for task distribution, project management, and file sharing. Its Smart Workload Balancer considers workload, deadlines, and task complexity.
5. SkillSphere. Repo: https://github.com/manamendraJN/SkillSphere. React, Spring Boot, MySQL, WebRTC, OAuth 2.0. Learning platform with learning paths, progress tracking, interactive video sessions, community forums, and gamification.
</projects>

<skills>
No percentages, no years of experience. Group them as follows.
- Languages: Java, JavaScript, PHP, Python, C, TypeScript
- Frontend: HTML5, CSS3, React, Tailwind CSS, Bootstrap
- Backend: Node.js, Express, Spring Boot
- Mobile: Kotlin
- Databases: MongoDB, MySQL, SQLite, PostgreSQL
- AI/ML and computer vision: OpenCV, MediaPipe, EfficientNet-B3
- Application technologies: MERN Stack, JWT, OAuth 2.0, Socket.IO, WebRTC
- Tools: Git, GitHub, Postman, GitHub Actions, Docker
- Cloud: AWS-related learning and credentials
- Design: Figma, UI/UX, responsive design
</skills>

<experience>
1. Broadcast Ad Insertion & Playout Operator, Dialog Axiata PLC. May 2026 to present. Contract role, Colombo District, Sri Lanka, per the supplied profile. Supported advertisement insertion, commercial playout, server operations, broadcast monitoring, and advertisement management for satellite television services through a recruitment assignment with Sara Creation. State clearly that this is broadcast operations experience, not software engineering employment.
2. Full Stack Engineer Intern, Department of Agrarian Development, Sri Lanka. August 2025 to February 2026. Practical experience building web-based systems with PHP, JavaScript, SQL, HTML, CSS, and XAMPP.
Do not publish any other role. A Full Stack Developer position at Heritage Crops Plantations (Pvt) Ltd is unconfirmed: keep it out of the rendered site and out of public templates.
</experience>

<research>
Title: Temporal Personal Fashion AI System with Multi-Component Integration
Venue: 2026 IEEE International Research Conference on Smart Computing and Systems Engineering (SCSE 2026), 26 March 2026, University of Kelaniya (per the supplied certificate details).
DOI: 10.1109/SCSE70081.2026.11499770 (link: https://doi.org/10.1109/SCSE70081.2026.11499770). ISBN: 979-8-3315-4791-2. Supervisor: Mr. S M B Harshanath, SLIIT.
Navodya's contribution: Dual-View Anthropometric Measurement System and Garment Size Recommendation. The module extracts body measurements from front and side photographs using an EfficientNet-B3 backbone. A custom scoring algorithm evaluates compatibility with available garment sizes and produces confidence-rated recommendations with personalized fit advice.
Wider group project (not Navodya's contribution): Temporal Wardrobe Intelligence, Personalized Accessories Recommendation, Integrated Grooming Recommendation.
Do not invent accuracy figures or results. Visually separate "My contribution" from "Wider group research".
</research>

<certificates>
Reusable certificate card with issuer, title, credential details, optional issue date, optional preview image, and verification link where supplied.
1. AI/ML Engineer, SLIIT: https://code.sliit.org/certificates/muy9c4mfjv
2. Python (Basic), SoloLearn: https://www.sololearn.com/en/certificates/CC-S7UZM0GN
3. JavaScript (Basic), HackerRank: https://www.hackerrank.com/certificates/ef62b645d0bd
4. React (Basic), HackerRank: https://www.hackerrank.com/certificates/206119c6659f
5. SQL (Basic), HackerRank: https://hackerrank.com/certificates/12e449396716
6. Java (Basic), HackerRank: https://www.hackerrank.com/certificates/768a9f87f70c
7. AWS Academy Graduate, Cloud Web Application Builder: https://www.credly.com/badges/230d6cf1-20b6-4433-b23c-0159a704e218
8. AWS SimuLearn: Computing Solutions. Issued August 2025. Credential ID: dd070d49-7895-4e47-8c11-841964fdb44e. No verification URL supplied.
9. IEEE SCSE 2026, Author Certificate. No verification URL supplied.
</certificates>

<contact>
Headline (exact): "Have an interesting problem to solve?"
Links: GitHub, LinkedIn, email (`mailto:`, only if configured), résumé (only if configured). No form and no fake contact functionality.
</contact>
</content>

<project_visuals>
Give each project a distinct illustrated treatment so the stack feels like five different plates in one book, all within the shared palette:
1. Warehouse Management System: isometric warehouse and shelving blueprint.
2. IssueSync: kanban-like cards and a ticket thread drawn as a technical sketch, plus a "Live demo" link.
3. HandGestureControl: line-drawn hand with landmark points and a cursor trail.
4. Collab Hub: connected nodes and a balanced scale or workload bars drawn as a diagram.
5. SkillSphere: a winding learning path with milestones and a video-call frame.
Each plate includes the label "Illustration" unless a genuine screenshot is supplied.
</project_visuals>

<accessibility_and_quality>
- Semantic landmarks, one `h1`, ordered headings, skip link, visible focus styles, meaningful `alt` text (decorative SVGs `aria-hidden="true"`).
- Fully usable by keyboard and screen reader; the overlay menu traps focus and restores it on close.
- Responsive from 320px to ultrawide; simplify pinning, drag, and parallax on touch devices and small screens.
- Lazy-load below-the-fold images with explicit dimensions; keep JavaScript small; no layout-shifting animation.
- External links use `rel="noopener noreferrer"`. Add page title, meta description, Open Graph tags, and favicon. No analytics.
- Production settings: `DEBUG` off, `ALLOWED_HOSTS`, secrets from the environment.
</accessibility_and_quality>

<workflow>
Phase 1, Foundation: create the Django project, settings split, base template, Tailwind build, fonts, design tokens, template tags (including `icon`), and the `content/` dataclasses with all content above.
Gate: `python manage.py check` passes and the home page renders every section with real content and no animation.

Phase 2, Static design: build all sections, illustrations, and responsive layouts using only CSS. The page must already look finished and be fully readable.
Gate: view at 360px, 768px, and 1440px; no horizontal scroll; all text legible.

Phase 3, Motion: implement the techniques in <signature_techniques> in the listed order, with `gsap.matchMedia()` and reduced-motion handling, using JavaScript-applied reveal states.
Gate: with JavaScript disabled and with reduced motion enabled, all content remains visible and correct.

Phase 4, Hardening: accessibility pass, performance pass, content-accuracy pass against <content>, and the checks below.
</workflow>

<acceptance_criteria>
Run and pass each of these, fixing problems until they pass:
1. `python manage.py check` and `python manage.py check --deploy` (with production-style environment variables).
2. `python manage.py test`, with tests that confirm: the home view returns 200; all required section ids exist; the headline text is exact; unset email and résumé links are not rendered; the unverified Heritage Crops role is absent from the HTML; the 20% figure appears with its "reported" wording.
3. `python manage.py collectstatic --noinput` and a successful production Tailwind build.
4. Contrast check: all text/background pairs meet WCAG AA.
5. Manual or automated checks with JavaScript disabled and with reduced motion on, plus a Lighthouse run targeting 90+ for accessibility, best practices, and SEO, and as high as practical for performance.
6. No console errors; no property animated by more than one owner; no broken links among those supplied.
</acceptance_criteria>

<output_format>
Deliver the working repository, a README (setup, environment variables, how to add content, how to build CSS, how to run checks), and a final report of at most 15 lines that lists what was built, which checks passed, and any item left as a placeholder or that you could not verify.
</output_format>

Begin with Phase 1 now.
