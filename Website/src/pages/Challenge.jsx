// AI disclosure: the animation, graphics and sound parts of this file were written with Claude (Anthropic), an AI tool.
import SiteHeader from '@/components/SiteHeader';
import { PlanetIcon } from '@/components/space';
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

const MARS_REFERENCES = [
  {
    authors: 'Luzzi, E., et al. (2025)',
    title: 'Geomorphological evidence of near-surface ice at candidate landing sites in northern Amazonis Planitia, Mars',
    publication: 'Journal of Geophysical Research: Planets',
    href: 'https://doi.org/10.1029/2024JE008724',
  },
  {
    authors: 'Mashal, et al. (2025)',
    title: 'Multi-criteria overlay analysis for identifying preferred exploration zones on Mars',
    publication: 'The Planetary Science Journal',
    href: 'https://doi.org/10.3847/PSJ/ade30e',
  },
  {
    authors: 'Hassler, D. M., et al. (2014)',
    title: "Mars' surface radiation environment measured with the Mars Science Laboratory's Curiosity rover",
    publication: 'Science, 343, 1244797',
    href: 'https://doi.org/10.1126/science.1244797',
  },
  {
    authors: 'Martinez, G. M., et al. (2017)',
    title: 'The modern near-surface Martian climate: A review of in-situ meteorological data from Viking to Curiosity',
    publication: 'Space Science Reviews, 212, 295–338',
    href: 'https://doi.org/10.1007/s11214-017-0360-x',
  },
  {
    authors: 'Guzewich, S. D., et al. (2019)',
    title: 'Mars Science Laboratory observations of the 2018/Mars Year 34 global dust storm',
    publication: 'Geophysical Research Letters, 46, 71–79',
    href: 'https://doi.org/10.1029/2018GL080839',
  },
  {
    authors: 'Hecht, M. H., et al. (2009)',
    title: 'Detection of perchlorate and the soluble chemistry of Martian soil at the Phoenix lander site',
    publication: 'Science, 325, 64–67',
    href: 'https://doi.org/10.1126/science.1172466',
  },
  {
    authors: 'Christensen, P. R., et al. (2000)',
    title: 'Detection of crystalline hematite mineralization on Mars by the Thermal Emission Spectrometer',
    publication: 'Journal of Geophysical Research, 105(E4), 9623–9642',
    href: 'https://doi.org/10.1029/1999JE001093',
  },
  {
    authors: 'Quantin-Nataf, C., et al. (2021)',
    title: 'Oxia Planum: The landing site for the ExoMars Rosalind Franklin rover mission',
    publication: 'Astrobiology, 21(3), 345–366',
    href: 'https://doi.org/10.1089/ast.2019.2191',
  },
  {
    authors: 'Landis, G. A. (1996)',
    title: 'Dust obscuration of Mars solar arrays',
    publication: 'Acta Astronautica, 38(11), 885–891',
    href: 'https://doi.org/10.1016/S0094-5765(96)00088-4',
  },
  {
    authors: 'Naser, M. Z. (2019)',
    title: 'Extraterrestrial construction materials',
    publication: 'Progress in Materials Science, 105, 100577',
    href: 'https://www.x-mol.com/paper/5746846',
    note: 'Source record notes that this link is not DOI-confirmed.',
  },
  {
    authors: 'Schuerger, A. C., et al. (2003)',
    title: 'Survival of endospores of Bacillus subtilis on spacecraft surfaces under simulated martian environments',
    publication: 'Icarus, 165',
    href: 'https://scilit.com/publications/6d8a3ffbf34c965d5caf6a6474fb97f4',
    note: 'Source record notes that no DOI was supplied.',
  },
];

const MARS_SITE_REFERENCES = [
  {
    site: 'Meridiani Planum',
    references: [
      {
        title: 'Arvidson et al. (2011), Opportunity Mars Rover mission: Overview and selected results',
        href: 'https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2010JE003746',
      },
      {
        title: 'Arvidson et al. (2006), Nature and origin of the hematite-bearing plains of Terra Meridiani',
        href: 'https://pubs.usgs.gov/publication/70028845',
      },
      {
        title: 'USGS Astrogeology, Soils of Eagle Crater and Meridiani Planum',
        href: 'https://webarchive.library.unt.edu/eot2008/20081107052053/http://astrogeology.usgs.gov/Research/Publications/AAAS-Science/Vol306Page1723.html',
      },
      {
        title: 'Squyres et al. (2006), Two Years at Meridiani Planum: Results from the Opportunity Rover',
        href: 'https://typeset.io/pdf/two-years-at-meridiani-planum-results-from-the-opportunity-538jp73siz.pdf',
      },
    ],
  },
  {
    site: 'Oxia Planum',
    references: [
      {
        title: 'ESA, ExoMars rover targets vast bed of clay in search for life',
        href: 'https://www.esa.int/Science_Exploration/Human_and_Robotic_Exploration/ExoMars_rover_targets_vast_bed_of_clay_in_search_for_life',
      },
      {
        title: 'Astronomy Now (2026), Europe’s Mars rover may land in the remains of a vast ancient water system',
        href: 'https://astronomynow.com/2026/06/04/europes-mars-rover-may-land-in-the-remains-of-a-vast-ancient-water-system/',
      },
      {
        title: 'Fawdon et al. (2024), Detailed geological map of Oxia Planum',
        href: 'https://phys.org/news/2024-03-geologic-european-rover-mars.pdf',
      },
      {
        title: 'McNeil et al. (2022), Mounds in Oxia Planum',
        href: 'https://oro.open.ac.uk/85891',
      },
      {
        title: 'McNeil et al. (2025), Hydrated Silica in Oxia Planum, Mars',
        href: 'https://elib.dlr.de/217093/1/JGR%20Planets%20-%202025%20-%20McNeil%20-%20Hydrated%20Silica%20in%20Oxia%20Planum%20Mars.pdf',
      },
      {
        title: 'Mandon et al., Morphological and Spectral Diversity of the Clay-Bearing Unit at Oxia Planum',
        href: 'https://hal.sorbonne-universite.fr/hal-03263480/document',
      },
      {
        title: 'Turner, Fawdon & Davis (2021), Mineralogy of the Oxia Planum Catchment Area',
        href: 'https://core.ac.uk/download/477907441.pdf',
      },
      {
        title: 'Quantin-Nataf et al. / Pacifici et al. (2021), Oxia Planum: Geological Context and Prelanding Interpretation',
        href: 'https://oro.open.ac.uk/74820',
      },
      {
        title: 'Fawdon et al. (2022), A CaSSIS and HiRISE map of the clay-bearing unit at Oxia Planum',
        href: 'https://oro.open.ac.uk/82087',
      },
    ],
  },
  {
    site: 'Peace Vallis (Gale Crater)',
    references: [
      {
        title: 'Wikipedia, Peace Vallis',
        href: 'https://en.wikipedia.org/wiki/Peace_Vallis',
      },
      {
        title: 'Palucis et al. (2014), The origin and evolution of the Peace Vallis fan system',
        href: 'https://eld.bl.uk/catalog/100024832262_0x000001',
      },
      {
        title: 'Palucis et al. (2013), Origin and Evolution of the Peace Vallis Fan System',
        href: 'https://ui.adsabs.harvard.edu/abs/2013LPI....44.1607P/abstract',
      },
      {
        title: 'Grant et al. (2014), The timing of alluvial activity in Gale crater, Mars',
        href: 'https://core.ac.uk/download/216296159.pdf',
      },
      {
        title: 'Grant et al. (2014), The timing of alluvial activity in Gale crater (abstract)',
        href: 'https://core.ac.uk/works/61075318',
      },
      {
        title: 'Geological Society of America (2013), The relative timing of alluvial activity in Gale crater',
        href: 'https://gsa.confex.com/gsa/2013AM/webprogram/Paper229840.html',
      },
      {
        title: 'Peace Vallis fan and Curiosity landing site context',
        href: 'https://escholarship.org/content/qt9j07p0zg/qt9j07p0zg.pdf',
      },
      {
        title: 'Smithsonian, Alluvial Fans on Mars',
        href: 'https://www.airandspace.si.edu/research/projects/alluvial-fans-mars',
      },
      {
        title: 'Amazonian Groundwater Springline at Peace Vallis Fan (2019 abstract)',
        href: 'https://www.hou.usra.edu/meetings/lifeonmars2019/pdf/5043.pdf',
      },
    ],
  },
  {
    site: 'Schiaparelli Crater',
    references: [
      {
        title: 'ESA/DLR/FU Berlin, Features in Schiaparelli',
        href: 'https://www.dlr.de/en/images_archive/2010/4/features-in-schiaparelli_18104',
      },
      {
        title: 'ESA, Schiaparelli on Mars shaped by wind and water',
        href: 'https://phys.org/news/2010-12-schiaparelli-mars.pdf',
      },
      {
        title: 'ESA/DLR/FU Berlin, Schiaparelli impact basin filled with deposits',
        href: 'https://www.dlr.de/en/latest/news/2026/bird-s-eye-view-of-schiaparelli-flying-around-a-giant-martian-crater/schiaparelli-impact-basin-on-mars-filled-with-deposits',
      },
      {
        title: 'NASA/JPL, Schiaparelli Sedimentary Rocks (MGS MOC)',
        href: 'https://www.jpl.nasa.gov/images/pia04592-schiaparelli-sedimentary-rocks',
      },
      {
        title: 'NASA/JPL, Schiaparelli’s Sedimentary Rocks (PIA06929)',
        href: 'https://www.jpl.nasa.gov/images/pia06929-schiaparellis-sedimentary-rocks',
      },
      {
        title: 'NASA/JPL/MSSS, Ancient Layered Rocks in Schiaparelli Crater',
        href: 'https://pds-rings.seti.org/press_releases/pages/PIA03xxx/PIA03177.html',
      },
      {
        title: 'NASA/JPL-Caltech/UArizona HiRISE, Layers Filling Crater in Schiaparelli',
        href: 'https://www.uahirise.org/PSP_005897_1790',
      },
      {
        title: 'Curiosity RAD radiation measurements',
        href: 'https://phys.org/news/2012-11-humans-mars.pdf',
      },
      {
        title: 'JGR Planets (2023), Zenith-angle dependence of Mars surface dose rate',
        href: 'https://e-docs.geo-leo.de/ris/handle/11858/10943',
      },
      {
        title: 'The Martian Wiki, Schiaparelli crater overview',
        href: 'https://the-martian.fandom.com/wiki/Schiaparelli_crater',
      },
    ],
  },
  {
    site: 'Sumgin Crater',
    references: [
      {
        title: 'NASA Science Photojournal, Sumgin Crater',
        href: 'https://science.nasa.gov/photojournal/sumgin-crater-false-color/',
      },
      {
        title: 'USGS Gazetteer of Planetary Nomenclature, Sumgin',
        href: 'https://planetarynames.wr.usgs.gov/Feature/2843',
      },
    ],
  },
];

const MOON_CITATIONS = [
  'Rosenburg et al. (2011)',
  'Rajsic et al. (2026)',
  'Sato et al. (2017)',
  'Ohtake et al. (2009)',
  'Moon Diver team slides',
  'Wagner & Robinson (2019, 2022)',
  'Kaku et al. (2017)',
  'Carrer et al. (2024)',
  'Horvath et al. (2022)',
  'LROC featured imagery and pit catalogue',
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
                <p className="label-mono flex items-center gap-2.5 text-primary">
                  <PlanetIcon planet={target.id} size={20} className="sp-bob" />
                  {target.long}
                </p>
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
                <p className="label-mono flex items-center gap-2.5 border-b border-border px-5 py-3 text-muted-foreground">
                  <PlanetIcon planet={target.id} size={20} className="sp-bob" />
                  {target.long}
                </p>
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
          <div className="mt-10 grid gap-8 border-t border-border pt-8 lg:grid-cols-2">
            <section>
              <h3 className="label-mono text-primary">Mars references</h3>
              <ul className="mt-4 space-y-3">
                {MARS_REFERENCES.map((reference) => (
                  <li key={reference.title} className="text-[11px] leading-relaxed text-muted-foreground">
                    <a
                      href={reference.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-foreground/85 underline decoration-border underline-offset-2 transition-colors hover:text-primary"
                    >
                      {reference.authors}. {reference.title}.
                    </a>{' '}
                    <span>{reference.publication}.</span>
                    {reference.note ? <span className="block text-muted-foreground/70">{reference.note}</span> : null}
                  </li>
                ))}
              </ul>
              <details className="mt-6 border-t border-border pt-4">
                <summary className="label-mono cursor-pointer text-muted-foreground hover:text-foreground">
                  Additional site-specific source links
                </summary>
                <div className="mt-5 space-y-5">
                  {MARS_SITE_REFERENCES.map((group) => (
                    <div key={group.site}>
                      <h4 className="text-[11px] font-medium text-foreground/85">{group.site}</h4>
                      <ul className="mt-2 space-y-2">
                        {group.references.map((reference) => (
                          <li key={reference.href} className="text-[11px] leading-relaxed">
                            <a
                              href={reference.href}
                              target="_blank"
                              rel="noreferrer"
                              className="text-muted-foreground underline decoration-border underline-offset-2 transition-colors hover:text-primary"
                            >
                              {reference.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </details>
            </section>

            <section>
              <h3 className="label-mono text-primary">Moon references and datasets</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href="https://trek.nasa.gov/moon/"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-border px-3 py-1.5 text-[10px] text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
                >
                  NASA Moon Trek
                </a>
                <a
                  href="https://quickmap.lroc.asu.edu/"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-border px-3 py-1.5 text-[10px] text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
                >
                  LROC QuickMap
                </a>
                <a
                  href="https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-border px-3 py-1.5 text-[10px] text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
                >
                  NASA Moon Fact Sheet
                </a>
              </div>
              <p className="mt-5 text-[11px] leading-relaxed text-muted-foreground">
                The lunar site records use LOLA terrain and slope, Diviner temperatures, Lunar Prospector hydrogen and iron maps,
                Kaguya optical maturity, and M³ mineral data.
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {MOON_CITATIONS.map((citation) => (
                  <li key={citation} className="rounded-full border border-border px-3 py-1.5 text-[10px] text-muted-foreground">
                    {citation}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground/70">
                Some Moon citations are recorded without a full title or URL in the source files.
              </p>
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}