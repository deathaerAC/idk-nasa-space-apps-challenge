// AI disclosure: this file was written with Claude (Anthropic), an AI tool, for the NASA Space Apps Challenge 2026.
import "./space.css";

const SUIT = "#f3f5fa";
const SUIT_SHADE = "#dfe5f0";
const LINE = "#c3ccdd";
const PACK = "#a9b5cb";
const VISOR = "#101a30";
const PAPER = "#fff7df";
const PAPER_LINE = "#d6c597";
const MARK = "#f1cf7a";

/**
 * One arm: a thick rounded line with a soft outline, and a glove at the end.
 *
 * @param {{ d: string, hand: number[], accent: string, palmUp?: boolean }} props
 */
function Arm({ d, hand, accent, palmUp = false }) {
  return (
    <g>
      <path d={d} fill="none" stroke={LINE} strokeWidth="16" strokeLinecap="round" />
      <path d={d} fill="none" stroke={SUIT} strokeWidth="13" strokeLinecap="round" />
      <ellipse cx={hand[0]} cy={hand[1]} rx="8" ry={palmUp ? 6.2 : 8} fill={accent} />
    </g>
  );
}

/**
 * The astronaut mascot. An original character drawn for this site.
 * The visor is blank, so feelings are shown with a small sign next to the helmet.
 *
 *   mood    "float" (waving), "look" (glancing down), "fly" (on the move),
 *           "read" (looking into a pamphlet) or "shrug" (nothing found)
 *   mark    the sign next to the helmet: "dots" (...), "bang" (!), "ask" (?) or "none".
 *           Left out, it follows the mood: dots when reading, a question mark when shrugging.
 *   size    width in pixels, or any CSS size
 *   accent  the colour of the gloves, boots and ear caps
 *
 * @param {{
 *   mood?: string,
 *   mark?: string,
 *   size?: number | string,
 *   accent?: string,
 *   className?: string,
 *   style?: any,
 * }} props
 */
export default function Astronaut({ mood = "float", mark, size = 120, accent = "#6ea2ee", className = "", style }) {
  const reading = mood === "read";
  const shrugging = mood === "shrug";
  const waving = mood === "float";
  const sign = mark ?? (reading ? "dots" : shrugging ? "ask" : "none");

  return (
    <svg
      className={`sp-astro sp-astro--${mood} ${className}`.trim()}
      viewBox="0 0 140 160"
      width={size}
      style={style}
      role="img"
      aria-label={reading ? "Astronaut reading a pamphlet" : shrugging ? "Astronaut shrugging" : waving ? "Astronaut waving" : "Astronaut"}
    >
      <desc>AI-generated graphic, made with Claude (Anthropic).</desc>
      <g className="sp-astro__all">
        {/* A new key when the mood changes makes the little hop play again. */}
        <g className="sp-astro__pose" key={reading ? "read" : shrugging ? "shrug" : "free"}>
          {/* backpack */}
          <rect x="39" y="84" width="62" height="40" rx="13" fill={PACK} />

          {/* legs and boots */}
          <g className="sp-astro__leg sp-astro__leg--l">
            <rect x="50" y="118" width="17" height="24" rx="8.5" fill={SUIT} stroke={LINE} strokeWidth="1.5" />
            <rect x="46.5" y="136" width="23" height="12" rx="6" fill={accent} />
          </g>
          <g className="sp-astro__leg sp-astro__leg--r">
            <rect x="73" y="118" width="17" height="24" rx="8.5" fill={SUIT} stroke={LINE} strokeWidth="1.5" />
            <rect x="70.5" y="136" width="23" height="12" rx="6" fill={accent} />
          </g>

          {/* body */}
          <rect x="44" y="84" width="52" height="45" rx="17" fill={SUIT} stroke={LINE} strokeWidth="1.5" />
          <path d="M86 86 Q96 90 95 110 Q95 124 84 128 Q90 118 90 106 Q90 94 86 86 Z" fill={SUIT_SHADE} />
          <rect x="58.5" y="99" width="23" height="13" rx="4" fill={SUIT_SHADE} stroke={LINE} strokeWidth="1" />
          <circle cx="64.5" cy="105.5" r="2.3" fill={accent} />
          <circle cx="70" cy="105.5" r="2.3" fill="#e58a5a" />
          <circle cx="75.5" cy="105.5" r="2.3" fill={MARK} />

          {/* the pamphlet sits in front of the chest when reading */}
          {reading ? (
            <g className="sp-astro__paper">
              <path d="M70 97 L51 93 L51 116 L70 120 Z" fill={PAPER} stroke={PAPER_LINE} strokeWidth="1.2" strokeLinejoin="round" />
              <path d="M70 97 L89 93 L89 116 L70 120 Z" fill={PAPER} stroke={PAPER_LINE} strokeWidth="1.2" strokeLinejoin="round" />
              <circle cx="79.5" cy="102" r="3.4" fill="#e58a5a" />
              <path d="M74.5 110 L85 108 M74.5 114 L82 112.6" stroke={PAPER_LINE} strokeWidth="1.4" strokeLinecap="round" />
              <path
                d="M55.5 99.5 L66 101.6 M55.5 104 L66 106.1 M55.5 108.5 L62.5 109.9"
                stroke={PAPER_LINE}
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </g>
          ) : null}

          {/* arms */}
          {reading ? (
            <g className="sp-astro__arms">
              <Arm d="M47 95 Q35 112 50 111" hand={[50, 110]} accent={accent} />
              <Arm d="M93 95 Q105 112 90 111" hand={[90, 110]} accent={accent} />
            </g>
          ) : shrugging ? (
            <g className="sp-astro__arms sp-astro__arms--shrug">
              <Arm d="M47 95 Q29 103 25 86" hand={[24.5, 82]} accent={accent} palmUp />
              <Arm d="M93 95 Q111 103 115 86" hand={[115.5, 82]} accent={accent} palmUp />
            </g>
          ) : waving ? (
            <g className="sp-astro__arms">
              <Arm d="M47 95 Q36 105 33 117" hand={[32.5, 120]} accent={accent} />
              <g className="sp-astro__wave">
                <Arm d="M93 95 Q109 90 113 72" hand={[114, 68]} accent={accent} />
              </g>
            </g>
          ) : (
            <g className="sp-astro__arms">
              <Arm d="M47 95 Q36 105 33 117" hand={[32.5, 120]} accent={accent} />
              <Arm d="M93 95 Q104 105 107 117" hand={[107.5, 120]} accent={accent} />
            </g>
          )}

          {/* helmet with a plain dark visor */}
          <g className="sp-astro__head">
            <path d="M70 15 L70 7" stroke={LINE} strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="70" cy="5.5" r="3.6" fill="#e58a5a" />
            <rect x="28" y="41" width="11" height="19" rx="5.5" fill={accent} />
            <rect x="101" y="41" width="11" height="19" rx="5.5" fill={accent} />
            <circle cx="70" cy="50" r="36" fill={SUIT} stroke={LINE} strokeWidth="1.5" />
            <path d="M97 27 A36 36 0 0 1 90 80 A42 42 0 0 0 97 27 Z" fill={SUIT_SHADE} />
            {/* the visor slides down or up a little to show where the astronaut is looking */}
            <g className="sp-astro__visor">
              <ellipse cx="70" cy="52" rx="26.5" ry="22.5" fill={VISOR} stroke={accent} strokeOpacity="0.75" strokeWidth="1.6" />
              <path d="M50 45 Q53 35 65 32.5" fill="none" stroke="#fff" strokeOpacity="0.34" strokeWidth="3" strokeLinecap="round" />
              <circle cx="51.5" cy="51" r="1.7" fill="#fff" fillOpacity="0.34" />
              <path d="M62 69.5 Q74 73 87 63" fill="none" stroke={accent} strokeOpacity="0.28" strokeWidth="2.4" strokeLinecap="round" />
            </g>
          </g>
        </g>

        {/* the sign next to the helmet */}
        {sign === "dots" ? (
          <g className="sp-astro__mark sp-astro__mark--dots" key="dots">
            <circle cx="113" cy="22" r="3.1" fill={MARK} />
            <circle cx="123" cy="19" r="3.1" fill={MARK} />
            <circle cx="133" cy="22" r="3.1" fill={MARK} />
          </g>
        ) : null}
        {sign === "bang" ? (
          <g className="sp-astro__mark sp-astro__mark--pop" key="bang">
            <path d="M123 8 L123 26" stroke={MARK} strokeWidth="4.6" strokeLinecap="round" />
            <circle cx="123" cy="35" r="2.7" fill={MARK} />
          </g>
        ) : null}
        {sign === "ask" ? (
          <g className="sp-astro__mark sp-astro__mark--pop" key="ask">
            <path
              d="M115 20 Q115 11.5 123 11.5 Q131 11.5 131 19 Q131 24 126 26.5 Q123.5 28 123.5 31.5"
              fill="none"
              stroke={MARK}
              strokeWidth="3.6"
              strokeLinecap="round"
            />
            <circle cx="123.5" cy="38.5" r="2.5" fill={MARK} />
          </g>
        ) : null}
      </g>
    </svg>
  );
}
