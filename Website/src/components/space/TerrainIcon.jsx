import "./space.css";

/* Each drawing sits on a 24 x 24 grid. Parts with a class such as sp-ti__sun are the ones that move. */
/** @type {Record<string, any>} */
const DRAWINGS = {
  // a globe whose middle line turns
  all: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12 H20.5" />
      <ellipse className="sp-ti__turn" cx="12" cy="12" rx="3.8" ry="8.5" />
    </>
  ),
  // dunes under a sun that swells
  desert: (
    <>
      <circle className="sp-ti__sun" cx="17.5" cy="6.5" r="2.6" />
      <path d="M2 16.5 Q7 10.5 12 14.5 T22 13.5" />
      <path d="M2 20.5 Q9 16.5 15 19.5 T22 19" />
    </>
  ),
  // a snowflake that slowly spins
  polar: (
    <g className="sp-ti__spin">
      <path d="M12 3 V21 M4.2 7.5 L19.8 16.5 M19.8 7.5 L4.2 16.5" />
      <path d="M9.8 4.8 L12 7 L14.2 4.8 M9.8 19.2 L12 17 L14.2 19.2" />
    </g>
  ),
  // a volcano puffing
  volcanic: (
    <>
      <path d="M2.5 20.5 L9.3 10 H14.7 L21.5 20.5" />
      <path d="M9.3 10 Q12 12.4 14.7 10" />
      <circle className="sp-ti__solid sp-ti__puff" style={{ animationDelay: "0.00s" }} cx="12" cy="6.3" r="1.1" />
      <circle className="sp-ti__solid sp-ti__puff" style={{ animationDelay: "0.35s" }} cx="9.6" cy="4.2" r="0.9" />
      <circle className="sp-ti__solid sp-ti__puff" style={{ animationDelay: "0.70s" }} cx="14.6" cy="3.6" r="0.9" />
    </>
  ),
  // a meteor coming down into a crater, then a ripple
  impact: (
    <>
      <ellipse cx="12" cy="17" rx="9" ry="3.6" />
      <path d="M6.2 16.8 Q12 20.6 17.8 16.8" />
      <ellipse className="sp-ti__ripple" cx="12" cy="17" rx="9" ry="3.6" opacity="0" />
      <g className="sp-ti__meteor">
        <path d="M18.5 3.5 L14 9.5" />
        <circle className="sp-ti__solid" cx="13.4" cy="10.3" r="1.5" />
      </g>
    </>
  ),
  // a cave mouth with a drip
  cave: (
    <>
      <path d="M2.5 20.5 H21.5" />
      <path d="M4 20.5 V13 Q4 4.5 12 4.5 Q20 4.5 20 13 V20.5" />
      <path d="M8.5 20.5 V15 Q8.5 10.5 12 10.5 Q15.5 10.5 15.5 15 V20.5" />
      <circle className="sp-ti__solid sp-ti__drop" cx="12" cy="13" r="1" />
    </>
  ),
  // cracked salt tiles with a glint
  salt: (
    <>
      <path d="M12 7 L16.3 9.5 V14.5 L12 17 L7.7 14.5 V9.5 Z" />
      <path d="M12 7 V2.8 M16.3 9.5 L20.2 7.3 M16.3 14.5 L20.2 16.7 M12 17 V21.2 M7.7 14.5 L3.8 16.7 M7.7 9.5 L3.8 7.3" />
      <path className="sp-ti__spark" d="M12 10 V14 M10 12 H14" />
    </>
  ),
  // a hot pool with steam
  hydrothermal: (
    <>
      <ellipse cx="12" cy="18.6" rx="8.5" ry="2.6" />
      <path className="sp-ti__steam" style={{ animationDelay: "0.00s" }} d="M7.8 14 q-1.6 -2 0 -4 t0 -4" />
      <path className="sp-ti__steam" style={{ animationDelay: "0.40s" }} d="M12 14.6 q1.6 -2 0 -4.2 t0 -4.4" />
      <path className="sp-ti__steam" style={{ animationDelay: "0.80s" }} d="M16.2 14 q-1.6 -2 0 -4 t0 -4" />
    </>
  ),
  // peaks with wind blowing past
  alpine: (
    <>
      <path d="M2 20.5 L9 7.5 L13 14.5 L16 10.5 L22 20.5 Z" />
      <path d="M7 11.2 L9 10 L10.7 11.6" />
      <path className="sp-ti__wind" style={{ animationDelay: "0.00s" }} d="M14.5 4.5 H19" />
      <path className="sp-ti__wind" style={{ animationDelay: "0.30s" }} d="M17 7.3 H21.5" />
    </>
  ),
};

/**
 * A small line icon for a terrain, with a little movement in it.
 *
 *   type  "desert", "polar", "volcanic", "impact", "cave", "salt", "hydrothermal", "alpine",
 *         or "all" for every terrain. Anything else falls back to "all".
 *   size  pixels
 *   live  true keeps it moving. Otherwise it only moves while the button around it is hovered.
 *
 * @param {{
 *   type?: string,
 *   size?: number,
 *   live?: boolean,
 *   className?: string,
 *   style?: any,
 * }} props
 */
export default function TerrainIcon({ type = "all", size = 16, live = false, className = "", style }) {
  return (
    <svg
      className={`sp-ti${live ? " sp-ti--live" : ""} ${className}`.trim()}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      {DRAWINGS[type] ?? DRAWINGS.all}
    </svg>
  );
}
