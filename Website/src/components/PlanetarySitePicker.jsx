import { PLANETARY_SITES } from '@/data/planetarySites';
import { cn } from '@/lib/utils';

export default function PlanetarySitePicker({ body, selectedSiteId, onSelect }) {
  const sites = PLANETARY_SITES.filter((site) => site.body === body);

  return (
    <section aria-label={`Select a ${body === 'moon' ? 'Moon' : 'Mars'} site to compare`} className="border-b border-border py-5">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="label-mono text-muted-foreground">Choose a {body === 'moon' ? 'Moon' : 'Mars'} site to compare</h2>
        <span className="text-[11px] text-muted-foreground/70">
          Indicative ranking by site type and available slope, relief, hydrogen, and pit measurements
        </span>
      </div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {sites.map((site) => (
          <button
            key={site.id}
            type="button"
            aria-pressed={site.id === selectedSiteId}
            onClick={() => onSelect(site)}
            className={cn(
              'min-w-[180px] border px-3 py-2.5 text-left transition-colors',
              site.id === selectedSiteId
                ? 'border-primary/70 bg-primary/10 text-foreground'
                : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
            )}
          >
            <span className="block text-[12px] leading-snug">{site.name}</span>
            <span className="mt-1 block text-[10px] text-muted-foreground">{site.type}</span>
            {site.latitude != null && site.longitude != null ? (
              <span className="mt-1 block font-mono text-[9px] text-muted-foreground/70">
                {site.latitude}°, {site.longitude}°
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </section>
  );
}
