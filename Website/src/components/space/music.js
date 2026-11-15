// AI disclosure: this file was written with Claude (Anthropic), an AI tool, for the NASA Space Apps Challenge 2026.
/*
  Background music. One track that starts again by itself each time it ends.

  - The file is music/ambient.mp3. To change the music, replace that file (keep the name).
  - MUSIC_VOLUME below is how loud it plays: 0 is silent, 1 is the file at full volume.
  - Browsers do not allow sound before the visitor has clicked or pressed something,
    so the music begins on their first click, tap or key press (see SoundToggle.jsx).
  - Nothing is downloaded until then, so the music does not slow the page down.
*/

import { getAudioContext } from "./sfx.js";

export const MUSIC_VOLUME = 0.47;

const STORAGE_KEY = "atlas-music";
const MUSIC_URL = new URL("./music/ambient.mp3", import.meta.url).href;

/** @type {HTMLAudioElement | null} */
let player = null;
/** @type {GainNode | null} */
let knob = null; // the volume control, when the music can go through the shared audio engine
let enabled = readEnabled();
let fadeTimer = 0;

function readEnabled() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true; // storage can be blocked, for example in private windows
  }
}

export function isMusicOn() {
  return enabled;
}

export function isMusicPlaying() {
  return Boolean(player && !player.paused);
}

function sameOrigin() {
  try {
    return new URL(MUSIC_URL, window.location.href).origin === window.location.origin;
  } catch {
    return false;
  }
}

function getPlayer() {
  if (player) return player;
  player = new Audio();
  player.loop = true; // start again when the track ends
  player.preload = "none"; // download only when it is first played
  player.src = MUSIC_URL;
  // iPhones ignore player.volume, so send the music through the audio engine where a volume
  // control always works. That is only allowed when the file comes from the site's own address.
  try {
    const audio = sameOrigin() ? getAudioContext() : null;
    if (audio) {
      knob = audio.createGain();
      knob.gain.value = 0;
      audio.createMediaElementSource(player).connect(knob);
      knob.connect(audio.destination);
    }
  } catch {
    knob = null;
  }
  if (!knob) player.volume = 0;
  return player;
}

/** Glides the volume to `target` over `seconds`, so the music never starts or stops abruptly. */
function fadeTo(target, seconds) {
  window.clearInterval(fadeTimer);
  if (!player) return;
  const audio = knob ? getAudioContext() : null;
  if (knob && audio) {
    const now = audio.currentTime;
    knob.gain.cancelScheduledValues(now);
    knob.gain.setValueAtTime(knob.gain.value, now);
    knob.gain.linearRampToValueAtTime(target, now + seconds);
    return;
  }
  const steps = Math.max(Math.round(seconds * 20), 1);
  const startVolume = player.volume;
  let step = 0;
  fadeTimer = window.setInterval(() => {
    step += 1;
    if (player) player.volume = Math.min(Math.max(startVolume + ((target - startVolume) * step) / steps, 0), 1);
    if (step >= steps) window.clearInterval(fadeTimer);
  }, 50);
}

/**
 * Starts the music if it is switched on. Must be called from a click, tap or key press.
 * Gives back a promise that says whether the browser really let it start.
 *
 * @returns {Promise<boolean>}
 */
export function startMusic() {
  if (!enabled) return Promise.resolve(false);
  try {
    const music = getPlayer();
    getAudioContext(); // wakes the audio engine if the browser had it asleep
    fadeTo(MUSIC_VOLUME, 1.6);
    const attempt = music.play();
    if (attempt && typeof attempt.then === "function") {
      return attempt.then(
        () => true,
        () => false
      );
    }
    return Promise.resolve(true);
  } catch {
    return Promise.resolve(false); // music is a nice extra: never let it break the page
  }
}

/** Fades the music out and pauses it. */
export function stopMusic() {
  if (!player) return;
  fadeTo(0, 0.4);
  const music = player;
  window.setTimeout(() => {
    if (!enabled || document.hidden) music.pause();
  }, 450);
}

/**
 * Switches the music on or off and remembers the choice.
 * Gives back a promise that says whether the music is now really playing.
 *
 * @param {boolean} value
 * @returns {Promise<boolean>}
 */
export function setMusicOn(value) {
  enabled = Boolean(value);
  try {
    window.localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
  } catch {
    // not being able to remember the choice is fine
  }
  if (enabled) return startMusic();
  stopMusic();
  return Promise.resolve(false);
}

/** Pauses while the tab is in the background and carries on when the visitor comes back. */
export function followTabVisibility() {
  const onChange = () => {
    if (!player) return;
    if (document.hidden) {
      if (!player.paused) stopMusic();
    } else if (enabled) {
      startMusic();
    }
  };
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}
