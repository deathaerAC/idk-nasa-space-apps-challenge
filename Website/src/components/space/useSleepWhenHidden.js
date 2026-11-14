import { useEffect, useRef } from "react";
import { sleepWhenHidden } from "./space-core.js";

/**
 * Give the ref this returns to any element. The animations inside that element then
 * pause while it is scrolled out of view, which saves the visitor's battery.
 *
 *   const restRef = useSleepWhenHidden();
 *   <section ref={restRef}> ... </section>
 */
export default function useSleepWhenHidden() {
  const ref = useRef(null);
  useEffect(() => sleepWhenHidden(ref.current), []);
  return ref;
}
