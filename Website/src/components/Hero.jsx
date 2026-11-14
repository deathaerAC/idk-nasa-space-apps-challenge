import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedPlanet, OrbitScene, Starfield, useSleepWhenHidden } from '@/components/space';

const EASE = [0.22, 1, 0.36, 1];

export default function Hero({ siteCount = 15 }) {
  // The stars and planets stop animating while the Hero is scrolled out of view.
  const restRef = useSleepWhenHidden();

  return (
    <section ref={restRef} className="relative overflow-hidden border-b border-border">
      <Starfield fixed={false} count={140} shooting={2} />
      {/* sp-drift is the slow float. It is plain CSS, so the browser runs it without any script work. */}
      <div
        aria-hidden="true"
        className="sp-drift pointer-events-none absolute -right-32 -top-28 h-[440px] w-[440px] opacity-40 sm:-right-24 sm:h-[600px] sm:w-[600px] lg:-top-40 lg:opacity-80"
      >
        {/* Earth with the Moon going around it. It is drawn 34% bigger than this box so Earth keeps the size the old drawing had. */}
        <div className="absolute left-1/2 top-1/2 w-[134%] -translate-x-1/2 -translate-y-1/2">
          <OrbitScene size="100%" float={false} reach={0.36} />
        </div>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,transparent_0%,hsl(220_45%_4%/0.85)_58%)]" />

      {/* Mars, floating further out. Hidden on tablets, where there is no free space for it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-9 bottom-9 w-[128px] opacity-60 sm:hidden lg:bottom-auto lg:right-[7%] lg:top-[57%] lg:block lg:w-[132px] lg:opacity-100 xl:right-[28%] xl:w-[150px]"
      >
        <AnimatedPlanet planet="mars" size="100%" detail="medium" parallax={14} enter enterDelay={0.5} alt="" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-5 pb-14 pt-14 sm:px-8 sm:pb-20 sm:pt-24">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="label-mono text-primary"
        >
          NASA Space Apps Challenge · 2026
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.08, ease: EASE }}
          className="mt-6 max-w-[16ch] font-display text-[clamp(2.9rem,7vw,5.9rem)] font-normal leading-[0.92] tracking-[-0.015em]"
        >
          <span className="block">Rehearsing the</span>
          <span className="block">Moon and Mars</span>
          <span className="block italic text-muted-foreground">
            on Earth.
            {/* The astronaut starts here, just after the last word. See AstronautGuide.jsx. */}
            <span data-astronaut-home aria-hidden="true" className="ml-[0.3em] inline-block h-0 w-0 align-middle" />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="mt-8 max-w-[58ch] text-[15px] leading-[1.75] text-muted-foreground sm:text-[17px]"
        >
          Before anyone lives on the Moon or lands on Mars, crews practise in places on Earth that
          come close. We looked at {siteCount} of them, from the Atacama Desert to Antarctica&apos;s dry
          valleys, and scored each one on eight things that matter out there, like the ground, the
          cold, the dust and the ice. Pick where you are headed and see which places on Earth match
          best, and where they don&apos;t.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.32, ease: EASE }}
          className="mt-11 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="flex flex-wrap items-center gap-x-10 gap-y-5">
            <Stat value={siteCount} label="Sites" />
            <Stat value={8} label="Dimensions" />
            <Stat value={2} label="Destinations" />
          </div>

          <a
            href="#atlas"
            className="group inline-flex items-center gap-3 self-start border border-border bg-card px-6 py-3.5 text-[13px] tracking-tight transition-colors hover:border-primary/60 hover:bg-secondary sm:self-auto"
          >
            Open the atlas
            <span className="h-1 w-6 bg-primary transition-all duration-300 group-hover:w-9" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// Counts from 0 up to the number when the page opens. People who asked for less motion see the number straight away.
function useCountUp(end, duration = 1300) {
  const [shown, setShown] = useState(end);

  useEffect(() => {
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !Number.isFinite(end) || end <= 0) {
      setShown(end);
      return undefined;
    }
    let frame = 0;
    let startTime = 0;
    const step = (now) => {
      if (!startTime) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      setShown(Math.round(end * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    setShown(0);
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [end, duration]);

  return shown;
}

function Stat({ value, label }) {
  const shown = useCountUp(value);

  return (
    <div className="flex items-baseline gap-2">
      <span className="font-display text-3xl leading-none tabular-nums">{shown}</span>
      <span className="label-mono text-muted-foreground">{label}</span>
    </div>
  );
}
