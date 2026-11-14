import { PLANET_MEDIUM } from "./planets.js";
import "./space.css";

/** @type {Record<string, string>} */
const DEFAULT_LABELS = { moon: "Moon", earth: "Earth", mars: "Mars" };

/**
 * The Moon, Earth and Mars in a row, with Earth in the middle.
 * The chosen planet pops up big and bright next to Earth and a dotted line joins the two.
 * The other planet stays small and faded, and can be clicked to choose it instead.
 *
 *   active    "moon" or "mars": the planet being compared with Earth
 *   onSelect  called with "moon" or "mars" when someone clicks a planet
 *   pulseKey  change this value (any text or number) to play the pop again,
 *             for example when a different terrain is picked
 *   labels    the words under each planet
 *
 * @param {{
 *   active?: string,
 *   onSelect?: (planet: string) => void,
 *   pulseKey?: string | number,
 *   labels?: Record<string, string>,
 *   className?: string,
 *   style?: any,
 * }} props
 */
export default function PlanetStage({
  active = "mars",
  onSelect,
  pulseKey = "",
  labels = DEFAULT_LABELS,
  className = "",
  style,
}) {
  // A new value here makes React rebuild the animated parts, which restarts the pop.
  const burst = `${active}:${pulseKey}`;

  /** @param {string} planet */
  const destination = (planet) => {
    const chosen = planet === active;
    const label = labels[planet] ?? DEFAULT_LABELS[planet];
    return (
      <button
        type="button"
        className={`sp-stage__body sp-stage__body--${planet}${chosen ? " is-active" : ""}`}
        aria-pressed={chosen}
        aria-label={`Compare Earth with ${label}`}
        data-sound={chosen ? "none" : "switch"}
        onClick={() => {
          if (!chosen && onSelect) onSelect(planet);
        }}
      >
        <span className="sp-stage__slot">
          <span className="sp-stage__size">
            <span className="sp-stage__disc" key={chosen ? burst : planet}>
              <span className="sp-planet__glow" />
              <img className="sp-planet__img" src={PLANET_MEDIUM[planet]} alt="" draggable={false} decoding="async" />
            </span>
          </span>
        </span>
        <span className="sp-stage__label">{label}</span>
      </button>
    );
  };

  return (
    <div className={`sp-stage sp-stage--${active} ${className}`.trim()} style={style}>
      {destination("moon")}
      <span className="sp-stage__link sp-stage__link--moon" aria-hidden="true">
        <i />
      </span>

      <div className="sp-stage__body sp-stage__body--earth">
        <span className="sp-stage__slot">
          <span className="sp-stage__size">
            <span className="sp-stage__disc" key={burst}>
              <span className="sp-planet__glow" />
              <img className="sp-planet__img" src={PLANET_MEDIUM.earth} alt="" draggable={false} decoding="async" />
            </span>
          </span>
        </span>
        <span className="sp-stage__label">{labels.earth ?? DEFAULT_LABELS.earth}</span>
      </div>

      <span className="sp-stage__link sp-stage__link--mars" aria-hidden="true">
        <i />
      </span>
      {destination("mars")}
    </div>
  );
}
