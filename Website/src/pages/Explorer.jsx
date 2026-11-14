import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SiteHeader from '@/components/SiteHeader';
import Hero from '@/components/Hero';
import ExplorerControls from '@/components/ExplorerControls';
import AnalogMap from '@/components/AnalogMap';
import SiteCard from '@/components/SiteCard';
import SiteSheet from '@/components/SiteSheet';
import { ANALOG_SITES } from '@/data/analogSites';
import { matchScore, rankedSites, TARGETS } from '@/lib/analog';

export default function Explorer() {
  const [target, setTarget] = useState('mars');
  const [env, setEnv] = useState('all');
  const [selectedSlug, setSelectedSlug] = useState(null);

  const ranked = useMemo(() => rankedSites(ANALOG_SITES, target), [target]);
  const visible = useMemo(
    () => (env === 'all' ? ranked : ranked.filter((entry) => entry.site.env_type === env)),
    [ranked, env],
  );

  const selected = ANALOG_SITES.find((site) => site.slug === selectedSlug) || null;
  const lead = ranked[0];

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <Hero siteCount={ANALOG_SITES.length} />

      <main id="atlas" className="mx-auto max-w-[1440px] scroll-mt-20 px-5 sm:px-8">
        <ExplorerControls
          target={target}
          onTargetChange={setTarget}
          env={env}
          onEnvChange={setEnv}
          count={visible.length}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 grid gap-px overflow-hidden rounded-sm border border-border bg-border lg:grid-cols-[1.35fr_1fr]"
        >
          <div className="bg-background">
            <AnalogMap
              entries={visible}
              target={target}
              selectedSlug={selectedSlug}
              onSelect={setSelectedSlug}
            />
          </div>

          <div className="flex max-h-[420px] flex-col bg-background sm:max-h-[520px] lg:max-h-[640px]">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <span className="label-mono text-muted-foreground">{TARGETS[target].long} ranking</span>
              <span className="label-mono text-muted-foreground/60">match / 100</span>
            </div>
            <div className="no-scrollbar flex-1 overflow-y-auto">
              {visible.length === 0 ? (
                <p className="px-5 py-10 text-[13px] text-muted-foreground">
                  No curated analogs in this terrain yet for {TARGETS[target].label.toLowerCase()}.
                </p>
              ) : (
                visible.map(({ site, score }, index) => (
                  <SiteCard
                    key={site.slug}
                    site={site}
                    score={score}
                    target={target}
                    index={index}
                    active={site.slug === selectedSlug}
                    onSelect={setSelectedSlug}
                  />
                ))
              )}
            </div>
          </div>
        </motion.div>

        {lead ? (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16 border-t border-border pt-12"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-[54ch]">
                <p className="label-mono text-primary">Leading candidate</p>
                <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,3rem)] leading-[1.05]">{lead.site.name}</h2>
                <p className="mt-4 text-[14px] leading-[1.8] text-muted-foreground">{lead.site.summary}</p>
              </div>
              <div className="flex shrink-0 items-baseline gap-3">
                <span className="font-display text-6xl leading-none tabular-nums">{matchScore(lead.site, target)}</span>
                <span className="label-mono text-muted-foreground">{TARGETS[target].label} match</span>
              </div>
            </div>
            <Link
              to="/ranking"
              className="mt-9 inline-flex items-center gap-3 border border-border px-5 py-3 text-[12px] tracking-tight text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
            >
              See the full similarity matrix
              <span className="h-1 w-6 bg-primary transition-all duration-300 hover:w-9" />
            </Link>
          </motion.section>
        ) : null}
      </main>

      <Footer />

      <SiteSheet site={selected} target={target} onClose={() => setSelectedSlug(null)} />
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mx-auto mt-20 max-w-[1440px] border-t border-border px-5 py-10 sm:px-8">
      <div className="flex flex-col gap-4 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>Terra Analog Atlas · NASA Space Apps Challenge 2026 · Open Earth, Moon and Mars data</p>
        <p className="font-mono">Dataset v0.1 · curated from published field campaigns</p>
      </div>
    </footer>
  );
}