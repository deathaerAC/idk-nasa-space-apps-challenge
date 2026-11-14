import { useEffect, useState } from "react";
import { isMuted, playSound, setMuted } from "./sfx.js";
import { followTabVisibility, isMusicOn, setMusicOn, startMusic } from "./music.js";
import "./space.css";

/**
 * Put this on a page once. It looks after all the sound:
 *   1. background music that loops, starting on the visitor's first click, tap or key press
 *   2. a very short sound whenever any button on the page is clicked
 *   3. two small round buttons in the bottom left corner: music on / off and click sounds on / off
 *
 * Both choices are remembered on the visitor's device.
 * A button can pick its sound with data-sound="switch", or stay silent with data-sound="none".
 */
export default function SoundToggle() {
  const [muted, setMutedState] = useState(() => isMuted());
  const [music, setMusicState] = useState(() => isMusicOn());

  // Click sounds for every button on the page.
  useEffect(() => {
    /** @param {MouseEvent} event */
    const onClick = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const control = target.closest("button, [data-sound]");
      if (!control || control.hasAttribute("disabled")) return;
      const kind = control.getAttribute("data-sound") || "tap";
      if (kind !== "none") playSound(kind);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Music: browsers only allow it after the visitor has done something, so wait for that.
  useEffect(() => {
    /** @param {Event} event */
    const onFirstAction = (event) => {
      const target = event.target;
      if (target instanceof Element && target.closest(".sp-sound-dock")) return; // the buttons below handle themselves
      if (!isMusicOn()) {
        stopWaiting(); // music is switched off: the music button will start it if the visitor wants it
        return;
      }
      // Keep listening until the browser really lets the music start (phones can refuse the first try).
      startMusic().then((started) => {
        if (started) stopWaiting();
      });
    };
    const events = ["click", "touchend", "keydown"];
    const stopWaiting = () => events.forEach((name) => document.removeEventListener(name, onFirstAction, true));
    events.forEach((name) => document.addEventListener(name, onFirstAction, true));
    const stopFollowing = followTabVisibility();
    return () => {
      stopWaiting();
      stopFollowing();
    };
  }, []);

  const toggleMusic = () => {
    const next = !music;
    setMusicOn(next);
    setMusicState(next);
  };

  const toggleSounds = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
    if (!next) playSound("switch"); // a little hello when sounds come back on
  };

  return (
    <div className="sp-sound-dock">
      <button
        type="button"
        className="sp-sound"
        data-sound="none"
        onClick={toggleMusic}
        aria-pressed={music}
        aria-label={music ? "Turn music off" : "Turn music on"}
        title={music ? "Music is on" : "Music is off"}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M9 17.5 V6 L19 4 V15.5" />
          <circle cx="6.8" cy="17.5" r="2.2" />
          <circle cx="16.8" cy="15.5" r="2.2" />
          {music ? null : <path d="M4 3.5 L20.5 20.5" />}
        </svg>
      </button>
      <button
        type="button"
        className="sp-sound"
        data-sound="none"
        onClick={toggleSounds}
        aria-pressed={!muted}
        aria-label={muted ? "Turn click sounds on" : "Turn click sounds off"}
        title={muted ? "Click sounds are off" : "Click sounds are on"}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M4 9.5 H7.5 L12 5.5 V18.5 L7.5 14.5 H4 Z" />
          {muted ? (
            <path d="M16 9.5 L21 14.5 M21 9.5 L16 14.5" />
          ) : (
            <path d="M15.5 9 Q17.5 12 15.5 15 M18 6.5 Q21.5 12 18 17.5" />
          )}
        </svg>
      </button>
    </div>
  );
}
