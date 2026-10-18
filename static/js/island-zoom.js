/* Smooth zoom: while the camera dives into the laptop, the vector island is swapped for two pre-decoded bitmaps of the same art.
   Re-rasterising a large vector scene on every scroll frame is what made the zoom lag; a bitmap is just a textured quad the GPU
   scales for free. Bitmap A is the whole island; bitmap B is a high-resolution close-up of the laptop that takes over once the
   zoom is deep. Everything here is a pure function of the zoom progress, so scrolling back restores the vector art exactly.
   Owner of the opacity/visibility of the vector svg and the two bitmaps: this module (driven by parallax.js). */

const NS = "http://www.w3.org/2000/svg";
const clamp = (n) => Math.min(1, Math.max(0, n));

export function prepareIslandBitmaps(island) {
  const svg = island.querySelector(".island-svg");
  const state = { ready: false, a: null, b: null, svg };
  if (!svg || !window.XMLSerializer) return { update() {}, release() {} };

  const small = window.innerWidth < 900;
  const mul = small ? 2 : 3; // pixels per svg unit
  const mulB = small ? 7 : 10;
  const clone = svg.cloneNode(true);
  ["class", "role", "aria-label"].forEach((a) => clone.removeAttribute(a));
  clone.setAttribute("xmlns", NS);
  clone.querySelectorAll("[tabindex]").forEach((n) => n.removeAttribute("tabindex"));
  clone.querySelectorAll("[class]").forEach((n) => n.removeAttribute("class")); // no CSS animation/transition state in the bitmap

  const make = (viewBox, w, h, cls, box) => {
    const c = clone.cloneNode(true);
    c.setAttribute("viewBox", viewBox);
    c.setAttribute("width", w);
    c.setAttribute("height", h);
    const img = new Image();
    img.className = `zoom-img ${cls}`;
    img.alt = "";
    img.setAttribute("aria-hidden", "true");
    img.decoding = "async";
    img.draggable = false;
    Object.assign(img.style, box);
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(c))}`;
    return img.decode().then(() => {
      island.appendChild(img);
      return img;
    });
  };

  Promise.all([
    make("0 0 900 640", 900 * mul, 640 * mul, "zoom-a", {}),
    make("300 220 300 220", 300 * mulB, 220 * mulB, "zoom-b", {}),
  ]).then(([a, b]) => {
    state.a = a;
    state.b = b;
    state.ready = true;
    state.apply && state.apply();
  }).catch(() => { /* keep the vector art */ });

  const set = (el, op) => {
    el.style.opacity = String(op);
    el.style.visibility = op > 0.001 ? "visible" : "hidden";
  };
  const update = (p, s) => {
    state.apply = () => update(p, s);
    if (!state.ready) return;
    const swap = clamp(p / 0.012); // vector -> bitmap A, a short cross-fade right as the zoom starts
    const deep = clamp((s - 4.4) / 0.9); // bitmap A -> close-up B once the laptop fills most of the view
    set(svg, 1 - swap);
    set(state.a, swap * (deep >= 1 ? 0 : 1));
    set(state.b, swap * deep);
  };
  const release = () => {
    [state.a, state.b].forEach((el) => el && el.remove());
    svg.style.opacity = "";
    svg.style.visibility = "";
  };
  return { update, release };
}
