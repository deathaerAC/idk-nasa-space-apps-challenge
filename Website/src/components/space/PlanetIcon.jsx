// AI disclosure: this file was written with Claude (Anthropic), an AI tool, for the NASA Space Apps Challenge 2026.
import { PLANET_ICONS } from "./planets.js";
import "./space.css";

/**
 * A small still picture of a planet, for buttons and labels.
 *
 *   planet  "earth", "moon" or "mars"
 *   size    pixels
 *   alt     leave empty when the words next to it already name the planet
 *
 * @param {{
 *   planet?: string,
 *   size?: number,
 *   alt?: string,
 *   className?: string,
 *   style?: any,
 * }} props
 */
export default function PlanetIcon({ planet = "earth", size = 16, alt = "", className, style }) {
  return (
    <img
      src={PLANET_ICONS[planet]}
      alt={alt}
      width={size}
      height={size}
      draggable={false}
      className={className}
      style={{ width: size, height: size, flex: "none", ...style }}
    />
  );
}
