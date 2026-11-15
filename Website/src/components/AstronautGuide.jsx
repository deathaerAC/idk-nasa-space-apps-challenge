// AI disclosure: this file was written with Claude (Anthropic), an AI tool, for the NASA Space Apps Challenge 2026.
import { useEffect, useRef, useState } from 'react';
import { Astronaut } from '@/components/space';
import { prefersReducedMotion, sleepWhenHidden } from '@/components/space/space-core.js';

const NOTICE_MS = 480; // how long the astronaut looks down before setting off
const LAG_SECONDS = 0.36; // bigger = trails further behind the scrolling

/**
 * The astronaut that travels down the Atlas page.
 *
 * It waits beside the title (at the element marked data-astronaut-home in Hero.jsx).
 * When the page is scrolled it looks down, notices, and then flies after the visitor,
 * arriving a moment later at the comparison strip (the element marked
 * data-astronaut-landing in DestinationBand.jsx), where it reads its pamphlet.
 * Scrolling back up sends it home again.
 *
 *   empty     true when no sites match: the astronaut shrugs with a question mark
 *   pulseKey  change this when the choice changes: an exclamation mark pops up for a moment
 *
 * The box this sits in needs "relative" on it (see pages/Explorer.jsx).
 */
export default function AstronautGuide({ empty = false, pulseKey = '' }) {
  const box = useRef(null);
  const [phase, setPhase] = useState('home'); // home, notice, travel or landed
  const [look, setLook] = useState('ahead'); // ahead, down or up
  const [surprised, setSurprised] = useState(false);
  const remeasure = useRef(() => {});

  useEffect(() => {
    const el = box.current;
    if (!el) return undefined;
    const instant = prefersReducedMotion(); // no chasing for people who asked for less motion

    let spots = null; // where home and the landing spot are, worked out once and reused
    let x = 0;
    let y = 0;
    let placed = false;
    let state = 'home';
    let noticeUntil = 0;
    let frame = 0;
    let lastTime = 0;

    const enter = (next) => {
      if (state === next) return;
      state = next;
      setPhase(next);
    };

    // Measuring the page is the expensive part, so it only happens when the layout changes.
    const measure = () => {
      const home = document.querySelector('[data-astronaut-home]');
      const landing = document.querySelector('[data-astronaut-landing]');
      const page = el.parentElement;
      if (!home || !landing || !page) return null;
      const origin = page.getBoundingClientRect();
      const start = home.getBoundingClientRect();
      const finish = landing.getBoundingClientRect();
      const width = el.offsetWidth;
      const height = el.offsetHeight;
      const maxX = Math.max(origin.width - width - 4, 0); // never poke out past the edge of the page
      return {
        // Start: just to the right of the title's last line, a touch low so the helmet clears the line above.
        fromX: Math.min(start.left - origin.left, maxX),
        fromY: start.top - origin.top - height * 0.4,
        // Finish: the middle of the landing spot.
        toX: Math.min(finish.left - origin.left + (finish.width - width) / 2, maxX),
        toY: finish.top - origin.top + (finish.height - height) / 2,
        // The trip is over once the landing spot is a little above the middle of the screen.
        distance: Math.max(finish.top + window.scrollY - window.innerHeight * 0.55, 120),
      };
    };

    const step = (now) => {
      frame = 0;
      if (!spots) spots = measure();
      if (!spots) {
        el.style.opacity = '0';
        return;
      }
      const seconds = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0.016;
      lastTime = now;

      // Where the scrolling says the astronaut should be.
      const progress = Math.min(Math.max(window.scrollY / spots.distance, 0), 1);
      const eased = progress * progress * (3 - 2 * progress);
      const goalX = spots.fromX + (spots.toX - spots.fromX) * eased;
      const goalY = spots.fromY + (spots.toY - spots.fromY) * eased;

      let moving = false;
      if (!placed || instant) {
        x = goalX;
        y = goalY;
        placed = true;
        if (instant) enter(progress > 0.92 ? 'landed' : progress < 0.05 ? 'home' : 'travel');
      } else if (state === 'home') {
        if (progress > 0.05) {
          // The page has moved: stay put and look down first, then set off in a moment.
          enter('notice');
          setLook('down');
          noticeUntil = now + NOTICE_MS;
          moving = true;
        } else {
          x = goalX;
          y = goalY;
        }
      } else if (state === 'notice') {
        moving = true;
        if (progress <= 0.02) {
          enter('home');
          setLook('ahead');
        } else if (now >= noticeUntil) {
          enter('travel');
        }
      } else {
        // travel or landed: close part of the gap each frame, so it trails a little behind
        const share = 1 - Math.exp(-seconds / LAG_SECONDS);
        x += (goalX - x) * share;
        y += (goalY - y) * share;
        const gap = Math.hypot(goalX - x, goalY - y);
        if (gap < 0.6) {
          x = goalX;
          y = goalY;
        } else {
          moving = true;
        }
        if (state === 'travel') {
          if (progress >= 0.92 && gap < 8) {
            enter('landed');
            setLook('ahead');
          } else if (progress <= 0.03 && gap < 8) {
            enter('home');
            setLook('ahead');
          } else if (Math.abs(goalY - y) > 4) {
            setLook(goalY > y ? 'down' : 'up');
          }
        } else if (progress < 0.8) {
          enter('travel');
          setLook('up');
          moving = true;
        }
      }

      // Lean into the flight: the further behind, the steeper the dive.
      const lean = state === 'travel' ? Math.max(-14, Math.min(14, (goalY - y) * 0.06)) : 0;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${lean.toFixed(1)}deg)`;
      el.style.opacity = '1';
      if (moving) frame = requestAnimationFrame(step);
    };

    // Frames are only requested while something is changing. A settled astronaut costs nothing.
    const request = () => {
      if (frame) return;
      lastTime = 0;
      frame = requestAnimationFrame(step);
    };
    const relayout = () => {
      spots = null;
      request();
    };
    remeasure.current = relayout;

    request();
    // The title slides in when the page opens, so measure again once it has settled.
    const timers = [300, 900, 1600].map((delay) => window.setTimeout(relayout, delay));
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', relayout);
    const watcher = typeof ResizeObserver === 'function' ? new ResizeObserver(relayout) : null;
    if (watcher) watcher.observe(document.body);
    const stopSleeping = sleepWhenHidden(el);

    return () => {
      cancelAnimationFrame(frame);
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', relayout);
      if (watcher) watcher.disconnect();
      stopSleeping();
    };
  }, []);

  // When the choice changes: measure again (the strip may have changed height) and look surprised for a moment.
  const firstRun = useRef(true);
  useEffect(() => {
    remeasure.current();
    if (firstRun.current) {
      firstRun.current = false;
      return undefined;
    }
    setSurprised(true);
    const timer = window.setTimeout(() => setSurprised(false), 1500);
    return () => window.clearTimeout(timer);
  }, [pulseKey]);

  let mood = 'float';
  let mark = 'none';
  if (phase === 'notice') {
    mood = 'look';
    mark = 'bang';
  } else if (phase === 'travel') {
    mood = 'fly';
  } else if (phase === 'landed') {
    mood = empty ? 'shrug' : 'read';
    mark = empty ? 'ask' : surprised ? 'bang' : 'dots';
  }

  return (
    <div
      ref={box}
      aria-hidden="true"
      data-look={look === 'ahead' ? undefined : look}
      className="pointer-events-none absolute left-0 top-0 z-30 w-[76px] opacity-0 transition-opacity duration-500 sm:w-[90px] lg:w-[96px] xl:w-[108px]"
      style={{ willChange: 'transform' }}
    >
      <Astronaut mood={mood} mark={mark} size="100%" />
    </div>
  );
}
