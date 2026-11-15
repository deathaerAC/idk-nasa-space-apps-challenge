// AI disclosure: this file was written with Claude (Anthropic), an AI tool, for the NASA Space Apps Challenge 2026.
/*
  Tiny sci-fi click sounds, made by the browser itself. There are no sound files to load.

    playSound("tap")     a short falling chirp, for ordinary buttons
    playSound("switch")  a rising two-note blip, for switching between the Moon and Mars
    setMuted(true)       turn sounds off. The choice is remembered on this device.
*/

const STORAGE_KEY = "atlas-sound";

/** @type {AudioContext | null} */
let context = null;
let muted = readMuted();

function readMuted() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "off";
  } catch {
    return false; // storage can be blocked, for example in private windows
  }
}

export function isMuted() {
  return muted;
}

/** @param {boolean} value */
export function setMuted(value) {
  muted = Boolean(value);
  try {
    window.localStorage.setItem(STORAGE_KEY, muted ? "off" : "on");
  } catch {
    // not being able to remember the choice is fine
  }
}

/** The one audio engine shared by the click sounds and the music. */
export function getAudioContext() {
  if (!context) {
    const anyWindow = /** @type {any} */ (window);
    const Maker = anyWindow.AudioContext || anyWindow.webkitAudioContext;
    if (!Maker) return null;
    context = new Maker();
  }
  // Browsers keep sound asleep until the first click. Wake it up.
  if (context && context.state === "suspended") context.resume();
  return context;
}

/*
  The notes of each sound: wave shape, start pitch and end pitch in hertz,
  when it starts and how long it lasts in seconds, and how loud it gets (0 to 1).
*/
export const SOUNDS = {
  tap: [
    { wave: "sine", from: 1250, to: 820, start: 0, length: 0.09, loud: 0.1 },
    { wave: "sine", from: 2500, to: 1640, start: 0, length: 0.06, loud: 0.025 },
  ],
  switch: [
    { wave: "sine", from: 520, to: 1040, start: 0, length: 0.11, loud: 0.1 },
    { wave: "triangle", from: 1040, to: 1560, start: 0.06, length: 0.1, loud: 0.05 },
  ],
};

/**
 * Plays the notes of one sound on any audio context. Kept separate so it can be tested.
 *
 * @param {BaseAudioContext} audio
 * @param {string} kind
 */
export function scheduleSound(audio, kind) {
  const notes = SOUNDS[/** @type {keyof typeof SOUNDS} */ (kind)] || SOUNDS.tap;
  const now = audio.currentTime;
  notes.forEach((note) => {
    const begin = now + note.start;
    const end = begin + note.length;
    const oscillator = audio.createOscillator();
    const volume = audio.createGain();
    oscillator.type = /** @type {OscillatorType} */ (note.wave);
    oscillator.frequency.setValueAtTime(note.from, begin);
    oscillator.frequency.exponentialRampToValueAtTime(note.to, end);
    // quick fade in and out, so there is no click or pop
    volume.gain.setValueAtTime(0.0001, begin);
    volume.gain.exponentialRampToValueAtTime(note.loud, begin + 0.008);
    volume.gain.exponentialRampToValueAtTime(0.0001, end);
    oscillator.connect(volume);
    volume.connect(audio.destination);
    oscillator.start(begin);
    oscillator.stop(end + 0.02);
  });
}

/** @param {string} [kind] */
export function playSound(kind = "tap") {
  if (muted) return;
  try {
    const audio = getAudioContext();
    if (audio) scheduleSound(audio, kind);
  } catch {
    // a missing sound should never break a click
  }
}
