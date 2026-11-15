// AI disclosure: this file was written with Claude (Anthropic), an AI tool, for the NASA Space Apps Challenge 2026.
import "./space.css";

/**
 * A small visible label that says a graphic was made with AI.
 * NASA Space Apps asks for AI-generated images to be marked where people can see it.
 *
 *   children  the words on the label. Left out, it says "AI-generated"
 *
 * @param {{ children?: any, className?: string, style?: any }} props
 */
export default function AiTag({ children = "AI-generated", className = "", style }) {
  return (
    <span className={`sp-ai-tag ${className}`.trim()} style={style}>
      {children}
    </span>
  );
}
