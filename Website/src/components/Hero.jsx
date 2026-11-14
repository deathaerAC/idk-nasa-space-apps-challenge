import { motion } from 'framer-motion';
import EarthArt from './EarthArt';

const EASE = [0.22, 1, 0.36, 1];

export default function Hero({ siteCount = 15 }) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-28 h-[440px] w-[440px] opacity-80 sm:-right-24 sm:h-[600px] sm:w-[600px] lg:-top-40"
        animate={{ y: [0, -18, 0], rotate: [0, 4, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      >
        <EarthArt className="h-full w-full" />
      </motion.div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,transparent_0%,hsl(220_45%_4%/0.85)_58%)]" />

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
          Rehearsing the Moon
          <span className="block italic text-muted-foreground">on Earth.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="mt-8 max-w-[58ch] text-[15px] leading-[1.75] text-muted-foreground sm:text-[17px]"
        >
          Fifteen terrestrial sites, scored across eight dimensions of planetary analogy and ranked
          against the conditions crews will actually meet at a permanent lunar base or a crewed Mars
          landing site. Where the match holds — and exactly where it breaks.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.32, ease: EASE }}
          className="mt-11 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="flex flex-wrap items-center gap-x-10 gap-y-5">
            <Stat value={siteCount} label="Sites" />
            <Stat value="8" label="Dimensions" />
            <Stat value="2" label="Destinations" />
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

function Stat({ value, label }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-display text-3xl leading-none tabular-nums">{value}</span>
      <span className="label-mono text-muted-foreground">{label}</span>
    </div>
  );
}