import { useEffect, useRef } from "react";
import { bindParallax, sleepWhenHidden } from "./space-core.js";
import { PLANET_IMAGES, PLANET_MEDIUM, PLANET_ALT } from "./planets.js";
import "./space.css";

// Gives each planet its own point in the float cycle so they do not bob in step.
/** @type {Record<string, number>} */
const START_OFFSET = { earth: 0, moon: 2.7, mars: 5.3 };

/**
 * A planet that floats, has a softly pulsing glow, grows a little on hover
 * and shifts slightly as the mouse moves.
 *
 *   planet    "earth", "moon" or "mars"
 *   size      pixels (320) or any CSS size ("20vw")
 *   float     false keeps it still
 *   parallax  how far it follows the mouse, in pixels. 0 turns it off
 *   enter     true makes it fade and grow in when the page loads
 *   src, alt  use your own picture instead
 *   detail    "medium" loads the lighter 384 px picture. Planets up to 190 px wide do this by themselves.
 *
 * @param {{
 *   planet?: string,
 *   size?: number | string,
 *   src?: string,
 *   detail?: string,
 *   alt?: string,
 *   float?: boolean,
 *   parallax?: number,
 *   enter?: boolean,
 *   enterDelay?: number,
 *   className?: string,
 *   style?: any,
 * }} props
 */
export default function AnimatedPlanet({
  planet = "earth",
  size = 320,
  src,
  detail,
  alt,
  float = true,
  parallax = 10,
  enter = false,
  enterDelay = 0,
  className = "",
  style,
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!parallax) return undefined;
    return bindParallax(ref.current, { strength: parallax });
  }, [parallax]);

  // Rest while scrolled out of view.
  useEffect(() => sleepWhenHidden(ref.current), []);

  const small = detail === "medium" || (typeof size === "number" && size <= 190);
  const picture = src || (small ? PLANET_MEDIUM[planet] : PLANET_IMAGES[planet]);

  const classes = [
    "sp-planet",
    `sp-planet--${planet}`,
    float ? "" : "sp-planet--still",
    enter ? "sp-planet--enter" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={ref}
      className={classes}
      style={{
        "--sp-size": typeof size === "number" ? `${size}px` : size,
        "--sp-phase": `${-(START_OFFSET[planet] ?? 0)}s`,
        "--sp-enter-delay": `${enterDelay}s`,
        ...style,
      }}
    >
      <div className="sp-planet__body">
        <div className="sp-planet__glow" />
        <img
          className="sp-planet__img"
          src={picture}
          alt={alt ?? PLANET_ALT[planet]}
          draggable={false}
          decoding="async"
        />
      </div>
    </div>
  );
}
