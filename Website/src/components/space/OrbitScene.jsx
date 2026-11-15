// AI disclosure: this file was written with Claude (Anthropic), an AI tool, for the NASA Space Apps Challenge 2026.
import { useEffect, useRef } from "react";
import { startOrbit } from "./space-core.js";
import { PLANET_IMAGES, PLANET_ALT } from "./planets.js";
import "./space.css";

/**
 * Earth with the Moon going around it. The Moon passes in front of Earth, then behind it.
 *
 *   size     pixels (520) or any CSS size ("min(100%, 500px)")
 *   period   seconds for one trip around
 *   tilt     tilt of the path in degrees
 *   flatten  0 = seen edge on, 1 = seen from above
 *   reach    how far out the Moon goes, as a share of the box width (0.4 by default)
 *   float    false stops the whole scene from drifting up and down
 *
 * @param {{
 *   size?: number | string,
 *   period?: number,
 *   tilt?: number,
 *   flatten?: number,
 *   reach?: number,
 *   float?: boolean,
 *   className?: string,
 *   style?: any,
 * }} props
 */
export default function OrbitScene({
  size = 520,
  period = 24,
  tilt = -10,
  flatten = 0.42,
  reach = 0.4,
  float = true,
  className = "",
  style,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const orbit = startOrbit(ref.current, { period, tilt, flatten, reach });
    return () => orbit.stop();
  }, [period, tilt, flatten, reach]);

  return (
    <div
      ref={ref}
      className={`sp-orbit${float ? "" : " sp-orbit--still"} ${className}`.trim()}
      style={{ "--sp-size": typeof size === "number" ? `${size}px` : size, ...style }}
    >
      <svg className="sp-orbit__ring sp-orbit__ring--back" viewBox="-100 -100 200 200" aria-hidden="true">
        <path />
      </svg>
      <div className="sp-orbit__earth">
        <div className="sp-planet__glow" />
        <img className="sp-planet__img" src={PLANET_IMAGES.earth} alt={PLANET_ALT.earth} draggable={false} decoding="async" />
      </div>
      <svg className="sp-orbit__ring sp-orbit__ring--front" viewBox="-100 -100 200 200" aria-hidden="true">
        <path />
      </svg>
      <img className="sp-orbit__moon" src={PLANET_IMAGES.moon} alt={PLANET_ALT.moon} draggable={false} decoding="async" />
    </div>
  );
}
