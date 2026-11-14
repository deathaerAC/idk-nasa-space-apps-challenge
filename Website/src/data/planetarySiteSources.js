const MARS_DEFAULT_SOURCES = [
  {
    label: 'Luzzi et al. (2025), candidate landing sites in northern Amazonis Planitia',
    href: 'https://doi.org/10.1029/2024JE008724',
  },
  {
    label: 'Hassler et al. (2014), Mars surface radiation environment',
    href: 'https://doi.org/10.1126/science.1244797',
  },
  {
    label: 'Martinez et al. (2017), Martian near-surface climate review',
    href: 'https://doi.org/10.1007/s11214-017-0360-x',
  },
];

const MARS_SITE_SOURCES = {
  'mars-meridiani-planum': [
    {
      label: 'Arvidson et al. (2011), Opportunity Mars Rover mission',
      href: 'https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2010JE003746',
    },
    {
      label: 'Arvidson et al. (2006), hematite-bearing plains of Terra Meridiani',
      href: 'https://pubs.usgs.gov/publication/70028845',
    },
    {
      label: 'USGS Astrogeology, soils of Eagle Crater and Meridiani Planum',
      href: 'https://webarchive.library.unt.edu/eot2008/20081107052053/http://astrogeology.usgs.gov/Research/Publications/AAAS-Science/Vol306Page1723.html',
    },
    {
      label: 'Squyres et al. (2006), results from the Opportunity Rover',
      href: 'https://typeset.io/pdf/two-years-at-meridiani-planum-results-from-the-opportunity-538jp73siz.pdf',
    },
  ],
  'mars-oxia-planum': [
    {
      label: 'ESA, ExoMars rover targets clay at Oxia Planum',
      href: 'https://www.esa.int/Science_Exploration/Human_and_Robotic_Exploration/ExoMars_rover_targets_vast_bed_of_clay_in_search_for_life',
    },
    {
      label: 'McNeil et al. (2022), mounds in Oxia Planum',
      href: 'https://oro.open.ac.uk/85891',
    },
    {
      label: 'McNeil et al. (2025), hydrated silica in Oxia Planum',
      href: 'https://elib.dlr.de/217093/1/JGR%20Planets%20-%202025%20-%20McNeil%20-%20Hydrated%20Silica%20in%20Oxia%20Planum%20Mars.pdf',
    },
    {
      label: 'Fawdon et al. (2022), CaSSIS and HiRISE map of Oxia Planum',
      href: 'https://oro.open.ac.uk/82087',
    },
  ],
  'mars-peace-vallis': [
    {
      label: 'Palucis et al. (2014), origin and evolution of the Peace Vallis fan',
      href: 'https://eld.bl.uk/catalog/100024832262_0x000001',
    },
    {
      label: 'Palucis et al. (2013), Peace Vallis fan system',
      href: 'https://ui.adsabs.harvard.edu/abs/2013LPI....44.1607P/abstract',
    },
    {
      label: 'Grant et al. (2014), timing of alluvial activity in Gale crater',
      href: 'https://core.ac.uk/download/216296159.pdf',
    },
    {
      label: 'Smithsonian, alluvial fans on Mars',
      href: 'https://www.airandspace.si.edu/research/projects/alluvial-fans-mars',
    },
  ],
  'mars-schiaparelli-crater': [
    {
      label: 'NASA/JPL, Schiaparelli sedimentary rocks',
      href: 'https://www.jpl.nasa.gov/images/pia04592-schiaparelli-sedimentary-rocks',
    },
    {
      label: 'NASA HiRISE, layers filling Schiaparelli crater',
      href: 'https://www.uahirise.org/PSP_005897_1790',
    },
    {
      label: 'ESA/DLR/FU Berlin, features in Schiaparelli',
      href: 'https://www.dlr.de/en/images_archive/2010/4/features-in-schiaparelli_18104',
    },
    {
      label: 'JGR Planets (2023), Mars surface dose rate',
      href: 'https://e-docs.geo-leo.de/ris/handle/11858/10943',
    },
  ],
  'mars-sumgin-crater': [
    {
      label: 'NASA Science Photojournal, Sumgin Crater',
      href: 'https://science.nasa.gov/photojournal/sumgin-crater-false-color/',
    },
    {
      label: 'USGS Gazetteer of Planetary Nomenclature, Sumgin',
      href: 'https://planetarynames.wr.usgs.gov/Feature/2843',
    },
  ],
  'mars-gale': [
    {
      label: 'Hassler et al. (2014), Mars surface radiation environment',
      href: 'https://doi.org/10.1126/science.1244797',
    },
    {
      label: 'Martinez et al. (2017), Martian near-surface climate review',
      href: 'https://doi.org/10.1007/s11214-017-0360-x',
    },
    {
      label: 'Palucis et al. (2014), origin and evolution of the Peace Vallis fan',
      href: 'https://eld.bl.uk/catalog/100024832262_0x000001',
    },
  ],
  'mars-jezero': [
    {
      label: 'Mashal et al. (2025), preferred exploration zones on Mars',
      href: 'https://doi.org/10.3847/PSJ/ade30e',
    },
    {
      label: 'NASA/JPL Mars 2020, Jezero Crater landing site',
      href: 'https://mars.nasa.gov/mars2020/mission/where-is-the-rover/',
    },
  ],
};

const MOON_TOOLS = [
  { label: 'NASA Moon Trek', href: 'https://trek.nasa.gov/moon/' },
  { label: 'LROC QuickMap', href: 'https://quickmap.lroc.asu.edu/' },
  {
    label: 'NASA Moon Fact Sheet',
    href: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html',
  },
];

const MOON_DEFAULT_CITATIONS = [
  'LOLA terrain and slope',
  'Diviner surface temperatures',
  'Lunar Prospector hydrogen and iron maps',
  'Kaguya Optical Maturity data',
  'M³ mineral data',
];

const MOON_SITE_CITATIONS = {
  'moon-mare-tranquillitatis-plains': [
    'Rosenburg et al. (2011)',
    'Rajsic et al. (2026)',
    'Sato et al. (2017)',
  ],
  'moon-oceanus-procellarum-plains': [
    'Rosenburg et al. (2011)',
    'Rajsic et al. (2026)',
    'Sato et al. (2017)',
  ],
  'moon-descartes-highlands': [
    'Rosenburg et al. (2011)',
    'Rajsic et al. (2026)',
    'Ohtake et al. (2009)',
  ],
  'moon-marius-hills-pit': [
    'Moon Diver team slides',
    'Wagner & Robinson (2019)',
    'Kaku et al. (2017)',
  ],
  'moon-mare-tranquillitatis-pit': [
    'Wagner & Robinson (2019, 2022)',
    'Carrer et al. (2024)',
    'Horvath et al. (2022)',
    'LROC pit catalogue',
  ],
  'moon-mare-ingenii-pit': [
    'Moon Diver team slides',
    'LROC featured imagery',
    'Wagner & Robinson (2019)',
    'Horvath et al. (2022)',
  ],
};

export function getPlanetarySiteSources(site) {
  if (!site) return [];

  if (site.body === 'moon') {
    return [
      ...MOON_TOOLS,
      ...MOON_DEFAULT_CITATIONS.map((label) => ({ label })),
      ...(MOON_SITE_CITATIONS[site.id] || []).map((label) => ({ label })),
    ];
  }

  return MARS_SITE_SOURCES[site.id] || MARS_DEFAULT_SOURCES;
}
