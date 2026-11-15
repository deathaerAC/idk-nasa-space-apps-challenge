// AI disclosure: this file was written with Claude (Anthropic), an AI tool, for the NASA Space Apps Challenge 2026.
// The planet pictures. Vite turns these into the right file paths when the site is built.
/** @type {Record<string, string>} */
export const PLANET_IMAGES = {
  earth: new URL("./planets/earth.webp", import.meta.url).href,
  moon: new URL("./planets/moon.webp", import.meta.url).href,
  mars: new URL("./planets/mars.webp", import.meta.url).href,
};

// Medium versions (384 px) for planets shown small, up to about 190 px wide. Much lighter to download.
/** @type {Record<string, string>} */
export const PLANET_MEDIUM = {
  earth: new URL("./planets/earth-md.webp", import.meta.url).href,
  moon: new URL("./planets/moon-md.webp", import.meta.url).href,
  mars: new URL("./planets/mars-md.webp", import.meta.url).href,
};

// Small versions for buttons and labels.
/** @type {Record<string, string>} */
export const PLANET_ICONS = {
  earth: new URL("./planets/earth-sm.webp", import.meta.url).href,
  moon: new URL("./planets/moon-sm.webp", import.meta.url).href,
  mars: new URL("./planets/mars-sm.webp", import.meta.url).href,
};

/** @type {Record<string, string>} */
export const PLANET_ALT = {
  earth: "Earth, showing the Atlantic Ocean, Africa and Europe",
  moon: "The Moon's near side with dark maria and craters",
  mars: "Mars, showing the Tharsis volcanoes, Valles Marineris and the north polar cap",
};
