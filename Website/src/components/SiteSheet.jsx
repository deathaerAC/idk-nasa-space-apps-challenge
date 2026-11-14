import { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, MapPin, ArrowRight } from 'lucide-react';
import { band, envLabel, formatCoord, matchScore, matchWeights, orderedDimensions, TARGETS, TARGET_CONDITIONS } from '@/lib/analog';
import { getPlanetarySiteSources } from '@/data/planetarySiteSources';
import DimensionBar from './DimensionBar';
import NasaClimatePanel from './NasaClimatePanel';

export default function SiteSheet({ site: activeSite, target, destinationSite, onClose }) {
  const lastSite = useRef(activeSite);
  if (activeSite) lastSite.current = activeSite;
  const site = activeSite || lastSite.current;

  const score = site ? matchScore(site, target, destinationSite) : 0;
  const weights = matchWeights(target, destinationSite);
  const planetarySources = getPlanetarySiteSources(destinationSite);

  return (
    <AnimatePresence>
      {activeSite ? (
        <motion.div
          key="site-sheet"
          className="fixed inset-0 z-50 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <button
            type="button"
            aria-label="Close site detail"
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="relative flex h-full w-full max-w-[560px] flex-col overflow-y-auto border-l border-border bg-card"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/95 px-6 py-4 backdrop-blur">
              <span className="label-mono text-muted-foreground">{envLabel(site.env_type)} · {site.country}</span>
              <button
                type="button"
                onClick={onClose}
                className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <motion.div
              key={site.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="px-6 pb-14 pt-7"
            >
              <h2 className="font-display text-[clamp(1.9rem,4vw,2.6rem)] leading-[1.05]">{site.name}</h2>
              <p className="mt-2 flex items-center gap-1.5 text-[12px] text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {site.region} · {formatCoord(site.lat, 'lat')} {formatCoord(site.lon, 'lon')} · {site.elevation_m.toLocaleString()} m
              </p>

              <div className="mt-7 flex items-end justify-between gap-4 border-y border-border py-5">
                <div>
                  <p className="label-mono text-muted-foreground">Match · {TARGETS[target].label}</p>
                  <div className="mt-1 flex items-baseline gap-3">
                    <motion.span
                      key={`${site.slug}-${target}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="font-display text-5xl leading-none tabular-nums"
                    >
                      {score}
                    </motion.span>
                    <span className="text-[12px] text-primary">{band(score)}</span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>

              <p className="mt-6 text-[14px] leading-[1.8] text-foreground/85">{site.summary}</p>

              <Section title="Dimension scores">
                <div className="space-y-3">
                  {orderedDimensions(target, destinationSite).map((dimension, index) => (
                    <DimensionBar
                      key={dimension.key}
                      label={dimension.label}
                      value={site.scores[dimension.key]}
                      weight={weights[dimension.key]}
                      compact
                      delay={0.05 * index}
                    />
                  ))}
                </div>
              </Section>

              <Section title="Where the analogy holds">
                <ul className="space-y-3">
                  {site.why.map((item) => (
                    <li key={item} className="flex gap-3 text-[13px] leading-relaxed text-foreground/80">
                      <span className="mt-1.5 h-1 w-1 shrink-0 bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Section>

              <Section title="Where it breaks">
                <ul className="space-y-3">
                  {site.limits.map((item) => (
                    <li key={item} className="flex gap-3 text-[13px] leading-relaxed text-muted-foreground">
                      <span className="mt-1.5 h-1 w-1 shrink-0 bg-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Section>

              <Section title="Surface record">
                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Meta label="Substrate" value={site.substrate} />
                  <Meta label="Temperature" value={site.temp_range} />
                  <Meta label="Precipitation" value={site.precipitation} />
                  <Meta label="Field campaigns" value={site.missions.join(' · ')} />
                </dl>
              </Section>

              <Section title="Measured climate · NASA POWER">
                <NasaClimatePanel site={site} />
              </Section>

              <Section title={`${TARGETS[target].long} conditions`}>
                <ul className="divide-y divide-border/60 border border-border">
                  {TARGET_CONDITIONS[target].map((condition) => (
                    <li key={condition.label} className="flex items-baseline justify-between gap-4 px-4 py-2.5">
                      <span className="text-[11px] text-muted-foreground">{condition.label}</span>
                      <span className="text-right font-mono text-[11px] text-foreground/80">{condition.value}</span>
                    </li>
                  ))}
                </ul>
              </Section>

              <Section title={`${destinationSite.name} references`}>
                <ul className="mt-4 space-y-2">
                  {planetarySources.map((source) => (
                    <li key={source.label} className="text-[11px] leading-relaxed">
                      {source.href ? (
                        <a
                          href={source.href}
                          target="_blank"
                          rel="noreferrer"
                          className="text-muted-foreground underline decoration-border underline-offset-2 transition-colors hover:text-primary"
                        >
                          {source.label}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">{source.label}</span>
                      )}
                    </li>
                  ))}
                </ul>
                {destinationSite.body === 'moon' ? (
                  <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground/70">
                    Some lunar citations are recorded without a full title or URL in the source files.
                  </p>
                ) : null}
              </Section>
            </motion.div>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-10">
      <h3 className="label-mono mb-4 text-muted-foreground">{title}</h3>
      {children}
    </section>
  );
}

function Meta({ label, value }) {
  return (
    <div>
      <dt className="label-mono text-muted-foreground/70">{label}</dt>
      <dd className="mt-1 text-[12px] leading-relaxed text-foreground/80">{value}</dd>
    </div>
  );
}