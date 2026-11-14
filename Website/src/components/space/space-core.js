/*
  Small helpers for space.css. No libraries needed.

    createStars(box)      fills a box with twinkling stars and a few shooting stars
    bindParallax(el)      shifts an element a little as the mouse moves
    startOrbit(box)       moves the Moon around Earth inside an .sp-orbit box
    sleepWhenHidden(el)   pauses the animations inside an element while it is off screen

  Each one gives back a way to switch itself off again.
*/

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/* ---------- Resting while off screen ---------- */

/**
  Pauses every CSS animation inside `el` while it is scrolled out of view, so the browser
  is not animating things nobody can see. It works by putting the attribute data-sp-asleep
  on the element (see the matching rule in space.css).
*/
export function sleepWhenHidden(el, { margin = "150px" } = {}) {
  if (!el || typeof IntersectionObserver !== "function") return () => {};
  const watcher = new IntersectionObserver(
    (entries) => {
      const latest = entries[entries.length - 1];
      if (latest.isIntersecting) el.removeAttribute("data-sp-asleep");
      else el.setAttribute("data-sp-asleep", "");
    },
    { rootMargin: margin }
  );
  watcher.observe(el);
  return () => {
    watcher.disconnect();
    el.removeAttribute("data-sp-asleep");
  };
}

// A tiny random number generator, so the stars land in the same places on every visit.
function seeded(seed) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- Mouse parallax ---------- */

const listeners = new Set();
let pending = 0;
let lastX = 0;
let lastY = 0;

function onPointerMove(event) {
  lastX = (event.clientX / window.innerWidth) * 2 - 1; // -1 at the left edge, 1 at the right edge
  lastY = (event.clientY / window.innerHeight) * 2 - 1;
  if (pending) return;
  pending = requestAnimationFrame(() => {
    pending = 0;
    listeners.forEach((update) => update(lastX, lastY));
  });
}

// Calls `update(x, y)` at most once per frame while the mouse moves. x and y run from -1 to 1.
function followPointer(update) {
  if (listeners.size === 0) window.addEventListener("pointermove", onPointerMove, { passive: true });
  listeners.add(update);
  return () => {
    listeners.delete(update);
    if (listeners.size === 0) window.removeEventListener("pointermove", onPointerMove);
  };
}

/** Moves `el` up to `strength` pixels the opposite way to the mouse (sets --sp-px and --sp-py). */
export function bindParallax(el, { strength = 10 } = {}) {
  if (!el || prefersReducedMotion()) return () => {};
  return followPointer((x, y) => {
    if (el.closest("[data-sp-asleep]")) return; // nothing to do while it is off screen
    el.style.setProperty("--sp-px", (-x * strength).toFixed(2));
    el.style.setProperty("--sp-py", (-y * strength).toFixed(2));
  });
}

/* ---------- Stars ---------- */

// Each time a shooting star finishes, it picks a new start point and angle.
function placeShootingStar(el) {
  const degrees = 24 + Math.random() * 18; // how steeply it falls
  const distance = 320 + Math.random() * 260; // how far it travels
  const radians = (degrees * Math.PI) / 180;
  el.style.setProperty("--x", (4 + Math.random() * 62).toFixed(1) + "%");
  el.style.setProperty("--y", (3 + Math.random() * 42).toFixed(1) + "%");
  el.style.setProperty("--rot", degrees.toFixed(1) + "deg");
  el.style.setProperty("--dx", (Math.cos(radians) * distance).toFixed(0) + "px");
  el.style.setProperty("--dy", (Math.sin(radians) * distance).toFixed(0) + "px");
  el.style.setProperty("--len", (90 + Math.random() * 90).toFixed(0) + "px");
}

/**
  Fills `box` (an element with the class sp-stars) with stars in three depths.
  Far stars are small and dim, near stars are bigger and shift more with the mouse.
*/
export function createStars(box, { count = 180, shooting = 3, seed = 11, parallax = 24 } = {}) {
  if (!box) return () => {};
  // Phones get fewer stars: the screen is small and every star is something to draw.
  if (typeof window !== "undefined" && window.innerWidth < 640) count = Math.round(count * 0.6);
  const rand = seeded(seed);
  const between = (low, high) => low + (high - low) * rand();
  const tints = ["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#cfe0ff", "#ffe6c4"];
  const depths = [
    { k: 0.12, share: 0.6, size: [1.1, 1.8], opacity: [0.4, 0.8], glow: false },
    { k: 0.35, share: 0.3, size: [1.8, 2.6], opacity: [0.55, 0.9], glow: false },
    { k: 0.75, share: 0.1, size: [2.6, 3.6], opacity: [0.85, 1], glow: true },
  ];

  box.textContent = "";
  const fragment = document.createDocumentFragment();
  const layers = [];

  depths.forEach((depth) => {
    const layer = document.createElement("div");
    layer.className = "sp-stars__layer";
    layers.push({ el: layer, k: depth.k });
    const total = Math.max(1, Math.round(count * depth.share));
    for (let i = 0; i < total; i += 1) {
      const star = document.createElement("i");
      star.className = depth.glow ? "sp-star sp-star--glow" : "sp-star";
      star.style.cssText =
        "left:" + (rand() * 100).toFixed(2) + "%;" +
        "top:" + (rand() * 100).toFixed(2) + "%;" +
        "--s:" + between(depth.size[0], depth.size[1]).toFixed(2) + "px;" +
        "--o:" + between(depth.opacity[0], depth.opacity[1]).toFixed(2) + ";" +
        "--t:" + between(2.8, 7).toFixed(2) + "s;" +
        "--d:" + (-rand() * 7).toFixed(2) + "s;" + // negative, so stars start at different points
        "--c:" + tints[Math.floor(rand() * tints.length)];
      layer.appendChild(star);
    }
    fragment.appendChild(layer);
  });

  if (!prefersReducedMotion()) {
    for (let i = 0; i < shooting; i += 1) {
      const streak = document.createElement("span");
      streak.className = "sp-shoot";
      placeShootingStar(streak);
      streak.style.setProperty("--delay", (2.5 + i * 4.2 + rand() * 3).toFixed(1) + "s");
      streak.style.setProperty("--dur", (11 + rand() * 7).toFixed(1) + "s");
      streak.addEventListener("animationiteration", () => placeShootingStar(streak));
      fragment.appendChild(streak);
    }
  }

  box.appendChild(fragment);
  // Near layers shift more than far ones. Only the three layers are touched, never the stars themselves.
  const stopParallax =
    parallax && !prefersReducedMotion()
      ? followPointer((x, y) => {
          if (box.hasAttribute("data-sp-asleep")) return;
          layers.forEach(({ el, k }) => {
            el.style.transform =
              "translate3d(" + (-x * parallax * k).toFixed(2) + "px," + (-y * parallax * k).toFixed(2) + "px,0)";
          });
        })
      : () => {};
  const stopSleeping = sleepWhenHidden(box);

  return function destroy() {
    stopParallax();
    stopSleeping();
    box.textContent = "";
  };
}

/* ---------- Moon orbit ---------- */

/**
  Moves the Moon around Earth inside `root` (an element with the class sp-orbit).
  The path is a flattened, slightly tilted circle. When the Moon is on the near half
  it is drawn in front of Earth and a little bigger. On the far half it goes behind.

  Options: period (seconds per orbit), tilt (degrees), flatten (0 = edge on, 1 = from above),
  reach (how far out, as a share of the box width), phase (where it starts, 0 to 1).

  Returns { stop, setPaused, seek }.
*/
export function startOrbit(
  root,
  { period = 24, tilt = -10, flatten = 0.42, reach = 0.4, phase = 0.1, paused = false } = {}
) {
  const idle = { stop() {}, setPaused(_value) {}, seek(_seconds) {} };
  const moon = root && root.querySelector(".sp-orbit__moon");
  if (!moon) return idle;

  // Draw the two halves of the dotted path. The box is 200 units wide whatever its pixel size.
  const rx = reach * 200;
  const ry = rx * flatten;
  const back = root.querySelector(".sp-orbit__ring--back path");
  const front = root.querySelector(".sp-orbit__ring--front path");
  if (back) back.setAttribute("d", "M " + -rx + " 0 A " + rx + " " + ry + " 0 0 1 " + rx + " 0");
  if (front) front.setAttribute("d", "M " + -rx + " 0 A " + rx + " " + ry + " 0 0 0 " + rx + " 0");
  [back, front].forEach((path) => path && path.setAttribute("transform", "rotate(" + tilt + ")"));

  const angle = (tilt * Math.PI) / 180;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  let width = root.clientWidth || 1;
  let moonWidth = moon.offsetWidth || 1;
  let seconds = 0;
  let lastTime = 0;
  let raf = 0;
  let stopped = false;
  let isPaused = paused || prefersReducedMotion();
  let onScreen = true;
  let inFront = null;

  function place() {
    const theta = 2 * Math.PI * (phase - seconds / period);
    const radius = reach * width;
    const flatX = Math.cos(theta) * radius;
    const flatY = Math.sin(theta) * radius * flatten;
    const x = flatX * cos - flatY * sin;
    const y = flatX * sin + flatY * cos;
    const nearness = Math.sin(theta); // 1 = nearest to us, -1 = farthest
    const scale = 1 + 0.16 * nearness;
    moon.style.transform =
      "translate3d(" + (width / 2 + x - moonWidth / 2).toFixed(1) + "px," +
      (width / 2 + y - moonWidth / 2).toFixed(1) + "px,0) scale(" + scale.toFixed(3) + ")";
    const near = nearness > 0;
    if (near !== inFront) {
      moon.style.zIndex = near ? "5" : "2";
      inFront = near;
    }
  }

  function tick(now) {
    raf = 0;
    if (stopped) return;
    if (!lastTime) lastTime = now;
    seconds += Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;
    place();
    if (!isPaused && onScreen) raf = requestAnimationFrame(tick);
  }

  function kick() {
    if (raf || isPaused || !onScreen || stopped) return;
    lastTime = 0;
    raf = requestAnimationFrame(tick);
  }

  const resizeWatcher = typeof ResizeObserver === "function"
    ? new ResizeObserver(() => {
        width = root.clientWidth || 1;
        moonWidth = moon.offsetWidth || 1;
        place();
      })
    : null;
  if (resizeWatcher) resizeWatcher.observe(root);

  // Stop working while the box is scrolled out of view.
  const viewWatcher = typeof IntersectionObserver === "function"
    ? new IntersectionObserver((entries) => {
        onScreen = entries[0].isIntersecting;
        if (onScreen) kick();
      })
    : null;
  if (viewWatcher) viewWatcher.observe(root);

  place();
  kick();

  return {
    stop() {
      stopped = true;
      cancelAnimationFrame(raf);
      raf = 0;
      if (resizeWatcher) resizeWatcher.disconnect();
      if (viewWatcher) viewWatcher.disconnect();
    },
    setPaused(value) {
      isPaused = Boolean(value) || prefersReducedMotion();
      if (!isPaused) kick();
    },
    seek(secondsIn) {
      seconds = secondsIn;
      place();
    },
  };
}
