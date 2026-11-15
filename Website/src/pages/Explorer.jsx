// AI disclosure: the animation, graphics and sound parts of this file were written with Claude (Anthropic), an AI tool.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SiteHeader from '@/components/SiteHeader';
import Hero from '@/components/Hero';
import ExplorerControls from '@/components/ExplorerControls';
import DestinationBand from '@/components/DestinationBand';
import AstronautGuide from '@/components/AstronautGuide';
import { AiTag, AnimatedPlanet, PlanetIcon, SoundToggle } from '@/components/space';
import AnalogMap from '@/components/AnalogMap';
import SiteCard from '@/components/SiteCard';
import SiteSheet from '@/components/SiteSheet';
import PlanetarySitePicker from '@/components/PlanetarySitePicker';
import { ANALOG_SITES } from '@/data/analogSites';
import { PLANETARY_SITES } from '@/data/planetarySites';
import { matchScore, rankedSites, TARGETS } from '@/lib/analog';

export default function Explorer() {
  const [target, setTarget] = useState('mars');
  const [destinationSite, setDestinationSite] = useState(
    PLANETARY_SITES.find((site) => site.id === 'mars-jezero'),
  );
  const [env, setEnv] = useState('all');
  const [selectedSlug, setSelectedSlug] = useState(null); // the site whose details panel is open
  const [focusSlug, setFocusSlug] = useState(null); // the site the map is looking at
  const openTimer = useRef(0);

  const ranked = useMemo(
    () => rankedSites(ANALOG_SITES, target, destinationSite),
    [target, destinationSite],
  );
  const visible = useMemo(
    () => (env === 'all' ? ranked : ranked.filter((entry) => entry.site.env_type === env)),
    [ranked, env],
  );

  const selected = ANALOG_SITES.find((site) => site.slug === selectedSlug) || null;
  const lead = ranked[0];

  function changeTarget(nextTarget) {
    setTarget(nextTarget);
    if (destinationSite.body !== nextTarget) {
      setDestinationSite(PLANETARY_SITES.find((site) => site.body === nextTarget));
    }
  }

  function selectDestination(site) {
    setTarget(site.body);
    setDestinationSite(site);
  }

  // Picking an Earth site (from the list or the map): the map flies to its marker straight away,
  // and the details panel opens a moment later so the trip can be seen first.
  function selectSite(slug) {
    window.clearTimeout(openTimer.current);
    setFocusSlug(slug);
    const box = document.getElementById('atlas-map');
    const edges = box ? box.getBoundingClientRect() : null;
    const mapOnScreen = Boolean(edges) && edges.bottom > 120 && edges.top < window.innerHeight - 120;
    const calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (mapOnScreen && !calm) openTimer.current = window.setTimeout(() => setSelectedSlug(slug), 750);
    else setSelectedSlug(slug);
  }

  useEffect(() => () => window.clearTimeout(openTimer.current), []);

  return (
    <div className="relative min-h-screen">
      <SiteHeader />
      <Hero siteCount={ANALOG_SITES.length} />
      <AstronautGuide empty={visible.length === 0} pulseKey={`${target}:${env}:${destinationSite.id}`} />

      <main id="atlas" className="mx-auto max-w-[1440px] scroll-mt-20 px-5 sm:px-8">
        <ExplorerControls
          target={target}
          onTargetChange={changeTarget}
          env={env}
          onEnvChange={setEnv}
          count={visible.length}
        />

        <DestinationBand
          target={target}
          onTargetChange={changeTarget}
          env={env}
          destinationSite={destinationSite}
          count={visible.length}
          best={visible[0]}
        />

        <PlanetarySitePicker
          body={target}
          selectedSiteId={destinationSite.id}
          onSelect={selectDestination}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 grid gap-px overflow-hidden rounded-sm border border-border bg-border lg:grid-cols-[1.35fr_1fr]"
        >
          <div id="atlas-map" className="bg-background">
            <AnalogMap
              entries={visible}
              target={target}
              destinationSite={destinationSite}
              selectedSlug={focusSlug}
              onSelect={selectSite}
              onReset={() => setFocusSlug(null)}
            />
          </div>

          <div className="flex max-h-[420px] flex-col bg-background sm:max-h-[520px] lg:max-h-[640px]">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <span className="label-mono text-muted-foreground">Earth analogs for {destinationSite.name}</span>
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
                    destinationSite={destinationSite}
                    index={index}
                    active={site.slug === focusSlug}
                    onSelect={selectSite}
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
              <div className="flex shrink-0 items-center gap-5">
                <div className="relative">
                  <AnimatedPlanet key={target} planet={target} size={92} parallax={6} enter alt="" />
                  <AiTag className="absolute left-1/2 top-full mt-1 -translate-x-1/2">AI-generated</AiTag>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-6xl leading-none tabular-nums">{matchScore(lead.site, target, destinationSite)}</span>
                  <span className="label-mono text-muted-foreground">match for {destinationSite.name}</span>
                </div>
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

      <SiteSheet site={selected} target={target} destinationSite={destinationSite} onClose={() => setSelectedSlug(null)} />
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mx-auto mt-20 max-w-[1440px] border-t border-border px-5 pb-20 pt-10 sm:px-8">
      <div className="flex flex-col gap-4 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
          {/* Earth, the Moon and Mars, bobbing one after the other */}
          <span aria-hidden="true" className="flex items-center gap-2.5">
            <PlanetIcon planet="earth" size={22} className="sp-bob" />
            <PlanetIcon planet="moon" size={16} className="sp-bob" style={{ animationDelay: '-1.8s' }} />
            <PlanetIcon planet="mars" size={19} className="sp-bob" style={{ animationDelay: '-3.6s' }} />
          </span>
          <p>Terra Analog Atlas · NASA Space Apps Challenge 2026 · Open Earth, Moon and Mars data</p>
        </div>
        <p className="font-mono">Dataset v0.1 · curated from published field campaigns</p>
      </div>
      {/* Credits. NASA Space Apps asks teams to show where AI was used and to list outside resources. */}
      <div className="mt-6 flex flex-col gap-3 text-[11px] leading-[1.6] text-muted-foreground sm:flex-row sm:items-center">
        <AiTag className="self-start sm:self-auto">AI-generated</AiTag>
        <p>
          The planet, astronaut and icon graphics, and the animation and sound code, were made with Claude, an AI
          tool. Music: Space Cinematic Ambient by Tunetank.
        </p>
      </div>
      {/* Click sounds for every button, plus the round sound on / off button in the corner. The footer is on every page. */}
      <SoundToggle />
    </footer>
  );
}