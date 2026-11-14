export default function EarthArt({ className }) {
  return (
    <svg viewBox="0 0 440 440" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="earthHalo" cx="50%" cy="50%" r="50%">
          <stop offset="46%" stopColor="hsl(214 74% 63%)" stopOpacity="0" />
          <stop offset="72%" stopColor="hsl(214 80% 68%)" stopOpacity="0.16" />
          <stop offset="100%" stopColor="hsl(214 80% 68%)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="earthBody" cx="34%" cy="26%" r="86%">
          <stop offset="0%" stopColor="#8CBDFF" />
          <stop offset="38%" stopColor="#4A7CC4" />
          <stop offset="72%" stopColor="#1E3A63" />
          <stop offset="100%" stopColor="#080F1C" />
        </radialGradient>
        <radialGradient id="earthClouds" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <clipPath id="earthClip">
          <circle cx="220" cy="220" r="140" />
        </clipPath>
      </defs>

      <circle cx="220" cy="220" r="215" fill="url(#earthHalo)" />
      <circle cx="220" cy="220" r="140" fill="url(#earthBody)" />

      <g clipPath="url(#earthClip)">
        <ellipse cx="168" cy="150" rx="58" ry="24" fill="url(#earthClouds)" opacity="0.55" transform="rotate(-18 168 150)" />
        <ellipse cx="250" cy="196" rx="76" ry="18" fill="url(#earthClouds)" opacity="0.4" transform="rotate(9 250 196)" />
        <ellipse cx="196" cy="272" rx="64" ry="22" fill="url(#earthClouds)" opacity="0.3" transform="rotate(-6 196 272)" />
        <ellipse cx="292" cy="300" rx="46" ry="14" fill="url(#earthClouds)" opacity="0.32" transform="rotate(24 292 300)" />
        <rect x="80" y="80" width="280" height="280" fill="#04070D" opacity="0.34" transform="rotate(-26 220 220)" />
      </g>

      <circle cx="220" cy="220" r="140" fill="none" stroke="hsl(210 40% 92% / 0.22)" strokeWidth="0.75" />
    </svg>
  );
}