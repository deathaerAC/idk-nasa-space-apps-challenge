import SiteHeader from '@/components/SiteHeader';
import { Footer } from '@/pages/Explorer';
import { DIMENSIONS, TARGETS, TARGET_CONDITIONS } from '@/lib/analog';

const PRINCIPLES = [
  {
    title: 'Process over picture',
    body: 'Two places can look alike and behave nothing alike. Every score is driven by measured process and material — soil chemistry, dune migration, thermal range, alteration mineralogy — not by resemblance in a photograph.',
  },
  {
    title: 'Partial matches are the honest result',
    body: 'No site scores above 90 across the board, and that is the finding. An analogue is only useful when you can say which characteristics transfer and which do not.',
  },
  {
    title: 'Scale matters',
    body: 'A desert is not an analogue. A crater floor, a tube segment, a salt polygon or a single outcrop is. Each site is characterized at the scale where the comparison actually holds.',
  },
  {
    title: 'Earth has hard limits',
    body: 'Reduced gravity, vacuum, the thin Martian atmosphere and the radiation environment cannot be reproduced anywhere on this planet. Every entry names where the analogy fails.',
  },
];

export default function Challenge() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-[1440px] px-5 pb-10 pt-14 sm:px-8 sm:pt-20">
        <p className="label-mono text-primary">2026 NASA Space Apps Challenge</p>
        <h1 className="mt-5 max-w-[26ch] font-display text-[clamp(2.4rem,5.4vw,4.4rem)] leading-[0.98]">
          Identify Earth locations that analog permanent Moon base sites and Mars.
        </h1>
        <p className="mt-7 max-w-[68ch] text-[15px] leading-[1.8] text-muted-foreground sm:text-base">
          Selecting future landing sites and lunar base locations depends on topography, geology,
          environment and available resources. Terrestrial analogue sites let mission teams test
          instruments and methods before they fly — but they are rarely characterized systematically.
          This atlas scores fifteen candidate sites against the same eight dimensions of analogy, for
          both destinations, so the strongest matches and the weakest links are visible at a glance.
        </p>

        <div className="mt-14 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {PRINCIPLES.map((item) => (
            <div key={item.title} className="bg-background p-6">
              <h2 className="text-[13px] font-medium tracking-tight">{item.title}</h2>
              <p className="mt-3 text-[12px] leading-[1.75] text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>

        <section className="mt-20 border-t border-border pt-12">
          <h2 className="font-display text-[clamp(1.8rem,3.4vw,2.6rem)] leading-tight">How a match is scored</h2>
          <p className="mt-4 max-w-[64ch] text-[14px] leading-[1.8] text-muted-foreground">
            Each site is rated 0–100 on all eight dimensions. A destination assigns a weight to each
            dimension; the match score is the weighted mean. Change the destination and the same site
            can lead the ranking — or fall away from it.
          </p>

          <div className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-2">
            {Object.values(TARGETS).map((target) => (
              <div key={target.id} className="bg-background p-6">
                <p className="label-mono text-primary">{target.long}</p>
                <ul className="mt-4 space-y-2">
                  {DIMENSIONS.map((dimension) => (
                    <li key={dimension.key} className="flex items-baseline justify-between gap-4">
                      <span className="text-[12px] text-foreground/80">{dimension.short}</span>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {Math.round((target.weights[dimension.key] || 0) * 100)}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 border-t border-border pt-12">
          <h2 className="font-display text-[clamp(1.8rem,3.4vw,2.6rem)] leading-tight">The eight dimensions</h2>
          <div className="mt-8 grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
            {DIMENSIONS.map((dimension) => (
              <div key={dimension.key} className="border-t border-border pt-4">
                <h3 className="text-[13px] font-medium tracking-tight">{dimension.label}</h3>
                <p className="mt-2 text-[12px] leading-[1.7] text-muted-foreground">{dimension.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 border-t border-border pt-12">
          <h2 className="font-display text-[clamp(1.8rem,3.4vw,2.6rem)] leading-tight">The conditions we are matching</h2>
          <div className="mt-8 grid gap-px border border-border bg-border lg:grid-cols-2">
            {Object.values(TARGETS).map((target) => (
              <div key={target.id} className="bg-background">
                <p className="label-mono border-b border-border px-5 py-3 text-muted-foreground">{target.long}</p>
                <ul className="divide-y divide-border/60">
                  {TARGET_CONDITIONS[target.id].map((condition) => (
                    <li key={condition.label} className="flex items-baseline justify-between gap-6 px-5 py-3">
                      <span className="text-[11px] text-muted-foreground">{condition.label}</span>
                      <span className="text-right font-mono text-[11px] text-foreground/80">{condition.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 border-t border-border pt-12">
          <h2 className="font-display text-[clamp(1.8rem,3.4vw,2.6rem)] leading-tight">Open data behind the atlas</h2>
          <p className="mt-4 max-w-[64ch] text-[14px] leading-[1.8] text-muted-foreground">
            Site characterizations draw on open Earth observation — land surface temperature,
            multispectral mineral indices, elevation and radar topography, aerosol and dust products —
            alongside published field campaigns at each analogue, and lunar and Martian datasets from
            NASA and partner agencies: LRO Diviner and LROC, MRO HiRISE and CTX, MOLA, and the MSL REMS
            environmental record.
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {[
              'Landsat 8/9', 'Sentinel-2 MSI', 'ASTER GDEM', 'MODIS', 'ECOSTRESS', 'ArcticDEM',
              'Copernicus DEM', 'LRO Diviner', 'LROC', 'MRO HiRISE / CTX', 'MOLA', 'MSL REMS',
            ].map((source) => (
              <span key={source} className="rounded-full border border-border px-3 py-1.5 text-[10px] text-muted-foreground">
                {source}
              </span>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}