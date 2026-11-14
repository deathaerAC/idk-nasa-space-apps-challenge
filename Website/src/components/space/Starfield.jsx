import { useEffect, useRef } from "react";
import { createStars } from "./space-core.js";
import "./space.css";

/**
 * Twinkling stars with the odd shooting star.
 * By default it fills the whole page behind everything (position: fixed).
 * Pass fixed={false} to keep the stars inside a box that has position: relative.
 *
 * @param {{
 *   count?: number,
 *   shooting?: number,
 *   parallax?: number,
 *   fixed?: boolean,
 *   className?: string,
 *   style?: any,
 * }} props
 */
export default function Starfield({
  count = 180,
  shooting = 3,
  parallax = 24,
  fixed = true,
  className = "",
  style,
}) {
  const ref = useRef(null);

  // createStars returns a clean-up function, which React calls when the page closes.
  useEffect(() => createStars(ref.current, { count, shooting, parallax }), [count, shooting, parallax]);

  return (
    <div
      ref={ref}
      className={`sp-stars${fixed ? "" : " sp-stars--contained"} ${className}`.trim()}
      style={style}
      aria-hidden="true"
    />
  );
}
