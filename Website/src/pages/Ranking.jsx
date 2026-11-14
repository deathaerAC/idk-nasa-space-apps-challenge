import { useMemo, useState } from 'react';
import SiteHeader from '@/components/SiteHeader';
import SiteSheet from '@/components/SiteSheet';
import PlanetarySitePicker from '@/components/PlanetarySitePicker';
import { Footer } from '@/pages/Explorer';
import { ANALOG_SITES } from '@/data/analogSites';
import { PLANETARY_SITES } from '@/data/planetarySites';
import { DIMENSIONS, TARGETS, band, matchWeights, rankedSites } from '@/lib/analog';
import { cn } from '@/lib/utils';

export default function Ranking() {
  const [target, setTarget] = useState('mars');
  const [destinationSite, setDestinationSite] = useState(
    PLANETARY_SITES.find((site) => site.id === 'mars-jezero'),
  );
  const [selectedSlug, setSelectedSlug] = useState(null);
  const rows = useMemo(
    () => rankedSites(ANALOG_SITES, target, destinationSite),
    [target, destinationSite],
  );
  const weights = matchWeights(target, destinationSite);
  const selected = ANALOG_SITES.find((site) => site.slug === selectedSlug) || null;

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

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-[1440px] px-5 pb-10 pt-14 sm:px-8 sm:pt-20">
        <p className="label-mono text-primary">Similarity matrix</p>
        <h1 className="mt-5 max-w-[22ch] font-display text-[clamp(2.4rem,5vw,4rem)] leading-[0.98]">
          Every site, every dimension.
        </h1>
        <p className="mt-5 max-w-[62ch] text-[15px] leading-[1.75] text-muted-foreground">
          {TARGETS[target].blurb} Earth analogs are ranked for {destinationSite.name}. Select a row to read the full field characterization.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex border border-border">
            {Object.values(TARGETS).map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => changeTarget(option.id)}
                className={cn(
                  'px-4 py-2 text-[12px] tracking-tight transition-colors',
                  target === option.id ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="label-mono text-muted-foreground">Scores 0–100 · weights shown per column</p>
        </div>

        <PlanetarySitePicker
          body={target}
          selectedSiteId={destinationSite.id}
          onSelect={selectDestination}
        />

        <div className="mt-6 overflow-x-auto border border-border">
          <table className="w-full min-w-[860px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border bg-card">
                <th className="label-mono px-4 py-3 font-normal text-muted-foreground">Site</th>
                {DIMENSIONS.map((dimension) => (
                  <th key={dimension.key} className="px-2 py-3 text-center font-normal">
                    <span className="block text-[10px] tracking-tight text-foreground/70">{dimension.short}</span>
                    <span className="mt-0.5 block font-mono text-[9px] text-muted-foreground/60">
                      {Math.round((weights[dimension.key] || 0) * 100)}%
                    </span>
                  </th>
                ))}
                <th className="label-mono px-4 py-3 text-right font-normal text-muted-foreground">Match</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ site, score }, index) => (
                <tr
                  key={site.slug}
                  onClick={() => setSelectedSlug(site.slug)}
                  className="cursor-pointer border-b border-border/60 transition-colors last:border-b-0 hover:bg-secondary/40"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-[10px] text-muted-foreground/60">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <span className="block text-[13px] tracking-tight">{site.name}</span>
                        <span className="block text-[11px] text-muted-foreground">{site.country}</span>
                      </div>
                    </div>
                  </td>
                  {DIMENSIONS.map((dimension) => {
                    const value = site.scores[dimension.key];
                    return (
                      <td key={dimension.key} className="px-2 py-3">
                        <div className="mx-auto w-10">
                          <div className="h-[3px] w-full bg-secondary">
                            <div className="h-full bg-primary/70" style={{ width: `${Math.max(3, value)}%` }} />
                          </div>
                          <span className="mt-1 block text-center font-mono text-[9px] text-muted-foreground">
                            {value}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-right">
                    <span className="font-display text-xl tabular-nums">{score}</span>
                    <span className="ml-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                      {band(score)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
      <SiteSheet site={selected} target={target} destinationSite={destinationSite} onClose={() => setSelectedSlug(null)} />
    </div>
  );
}