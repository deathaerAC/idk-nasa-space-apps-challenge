export const DIMENSIONS = [
  { key: 'geology', label: 'Geology & surface materials', short: 'Geology', note: 'Mineralogy, alteration products, regolith and soil chemistry' },
  { key: 'terrain', label: 'Terrain & topography', short: 'Terrain', note: 'Slope, roughness, relief, landform inventory' },
  { key: 'temperature', label: 'Temperature & extremes', short: 'Thermal', note: 'Diurnal and seasonal range, illumination, thermal stress' },
  { key: 'water', label: 'Water, ice & volatiles', short: 'Volatiles', note: 'Ice, permafrost, brines, hydrated minerals' },
  { key: 'dust', label: 'Dust, wind & atmosphere', short: 'Dust', note: 'Aeolian transport, dust devils, aerosols, near-surface winds' },
  { key: 'habitability', label: 'Habitability & biosignatures', short: 'Biology', note: 'Extremophiles, organic preservation, biosignature record' },
  { key: 'subsurface', label: 'Caves & subsurface', short: 'Subsurface', note: 'Lava tubes, voids, stratigraphy, shielded environments' },
  { key: 'operations', label: 'Landing & operations', short: 'Ops', note: 'Trafficability, navigation, comms, logistics, construction' },
];

export const TARGETS = {
  moon: {
    id: 'moon',
    label: 'Lunar base',
    long: 'Permanent Moon base',
    weights: { geology: 0.18, terrain: 0.18, temperature: 0.1, water: 0.04, dust: 0.14, habitability: 0.04, subsurface: 0.16, operations: 0.16 },
    blurb: 'Weighted toward regolith, terrain trafficability, vacuum dust behaviour and subsurface shelter — the constraints of a sustained surface base.',
  },
  mars: {
    id: 'mars',
    label: 'Mars landing',
    long: 'Mars landing site',
    weights: { geology: 0.18, terrain: 0.12, temperature: 0.1, water: 0.14, dust: 0.14, habitability: 0.1, subsurface: 0.08, operations: 0.14 },
    blurb: 'Weighted toward mineralogy, volatile inventory, dust activity and biosignature potential — the science case for a crewed landing site.',
  },
};

export const ENV_TYPES = {
  desert: 'Desert',
  polar: 'Polar',
  volcanic: 'Volcanic',
  impact: 'Impact crater',
  cave: 'Cave & lava tube',
  salt: 'Salt flat',
  hydrothermal: 'Hydrothermal',
  alpine: 'High altitude',
};

export const TARGET_CONDITIONS = {
  moon: [
    { label: 'Gravity', value: '1.62 m/s² (1/6 g)' },
    { label: 'Atmosphere', value: 'Vacuum, ~10⁻¹² torr' },
    { label: 'Surface temperature', value: '−173 °C to +127 °C' },
    { label: 'Day length', value: '29.5 Earth days' },
    { label: 'Radiation', value: 'No magnetic field, GCR + SEP exposure' },
    { label: 'Regolith', value: 'Angular, glass-rich, electrostatically charged' },
  ],
  mars: [
    { label: 'Gravity', value: '3.72 m/s² (0.38 g)' },
    { label: 'Atmosphere', value: '~6 mbar, 95% CO₂' },
    { label: 'Surface temperature', value: '−125 °C to +20 °C' },
    { label: 'Sol', value: '24 h 39 m' },
    { label: 'Radiation', value: 'Thin atmosphere, ~0.7 mSv/day at surface' },
    { label: 'Dust', value: 'Global storms, perchlorate-laden fines' },
  ],
};

const SITE_WEIGHT_PROFILES = {
  lunarPolarCrater: { geology: 0.18, terrain: 0.17, temperature: 0.12, water: 0.18, dust: 0.1, habitability: 0.03, subsurface: 0.08, operations: 0.14 },
  lunarMare: { geology: 0.2, terrain: 0.22, temperature: 0.1, water: 0.03, dust: 0.16, habitability: 0.03, subsurface: 0.08, operations: 0.18 },
  lunarHighlands: { geology: 0.2, terrain: 0.22, temperature: 0.11, water: 0.04, dust: 0.16, habitability: 0.03, subsurface: 0.09, operations: 0.15 },
  lunarPit: { geology: 0.16, terrain: 0.14, temperature: 0.08, water: 0.02, dust: 0.1, habitability: 0.02, subsurface: 0.3, operations: 0.18 },
  martianPlain: { geology: 0.16, terrain: 0.25, temperature: 0.1, water: 0.05, dust: 0.16, habitability: 0.08, subsurface: 0.03, operations: 0.17 },
  martianClayPlain: { geology: 0.25, terrain: 0.12, temperature: 0.08, water: 0.16, dust: 0.08, habitability: 0.17, subsurface: 0.04, operations: 0.1 },
  martianAlluvialFan: { geology: 0.22, terrain: 0.16, temperature: 0.08, water: 0.18, dust: 0.08, habitability: 0.14, subsurface: 0.04, operations: 0.1 },
  martianImpact: { geology: 0.21, terrain: 0.2, temperature: 0.1, water: 0.06, dust: 0.12, habitability: 0.08, subsurface: 0.08, operations: 0.15 },
  martianLanding: { geology: 0.12, terrain: 0.33, temperature: 0.15, water: 0.06, dust: 0.13, habitability: 0.04, subsurface: 0.02, operations: 0.15 },
  martianCrater: { geology: 0.21, terrain: 0.2, temperature: 0.1, water: 0.12, dust: 0.1, habitability: 0.1, subsurface: 0.07, operations: 0.1 },
};

function profileForSite(site) {
  if (!site) return null;
  if (site.body === 'moon') {
    if (site.type === 'Lava tube / pit') return SITE_WEIGHT_PROFILES.lunarPit;
    if (site.type === 'Mare plains') return SITE_WEIGHT_PROFILES.lunarMare;
    if (site.type === 'Highlands' || site.type === 'Polar highland') return SITE_WEIGHT_PROFILES.lunarHighlands;
    return SITE_WEIGHT_PROFILES.lunarPolarCrater;
  }
  if (site.type === 'Very flat, low-relief plain') return SITE_WEIGHT_PROFILES.martianPlain;
  if (site.type === 'Low-relief, clay-bearing plain with fractured bedrock') return SITE_WEIGHT_PROFILES.martianClayPlain;
  if (site.type === 'Ancient stream valley / alluvial fan') return SITE_WEIGHT_PROFILES.martianAlluvialFan;
  if (site.type === 'Candidate landing site') return SITE_WEIGHT_PROFILES.martianLanding;
  if (site.type === 'Crater (studied site)') return SITE_WEIGHT_PROFILES.martianCrater;
  return SITE_WEIGHT_PROFILES.martianImpact;
}

export function matchWeights(target, destinationSite) {
  const profile = profileForSite(destinationSite);
  if (!profile) return (TARGETS[target] || TARGETS.mars).weights;

  const weights = { ...profile };
  if (destinationSite.body === 'moon' && destinationSite.hydrogen_ug_g_mean) {
    weights.water += Math.max(0, Math.min(0.08, (destinationSite.hydrogen_ug_g_mean - 130) / 600));
  }
  if (destinationSite.slope_deg_mean) {
    weights.terrain += Math.min(0.06, Math.max(0, destinationSite.slope_deg_mean - 2) / 100);
  }
  if (destinationSite.relief_m) {
    weights.terrain += Math.min(0.08, destinationSite.relief_m / 50000);
  }
  if (destinationSite.pit_depth_m) {
    weights.subsurface += Math.min(0.08, destinationSite.pit_depth_m / 1500);
  }

  const total = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  return Object.fromEntries(
    Object.entries(weights).map(([dimension, weight]) => [dimension, weight / total]),
  );
}

export function matchScore(site, target, destinationSite) {
  const weights = matchWeights(target, destinationSite);
  let sum = 0;
  let total = 0;
  DIMENSIONS.forEach((dimension) => {
    const weight = weights[dimension.key] || 0;
    sum += (site.scores[dimension.key] || 0) * weight;
    total += weight;
  });
  return Math.round(sum / (total || 1));
}

export function band(score) {
  if (score >= 78) return 'Exceptional';
  if (score >= 70) return 'Strong';
  if (score >= 58) return 'Workable';
  return 'Partial';
}

export function rankedSites(sites, target, destinationSite) {
  return sites
    .filter((site) => !site.targets || site.targets.includes(target))
    .map((site) => ({ site, score: matchScore(site, target, destinationSite) }))
    .sort((a, b) => b.score - a.score);
}

export function orderedDimensions(target, destinationSite) {
  const weights = matchWeights(target, destinationSite);
  return [...DIMENSIONS].sort((a, b) => (weights[b.key] || 0) - (weights[a.key] || 0));
}

export function topDimensions(site, target, count = 3, destinationSite) {
  const weights = matchWeights(target, destinationSite);
  return [...DIMENSIONS]
    .sort((a, b) => (site.scores[b.key] || 0) * (weights[b.key] || 0) - (site.scores[a.key] || 0) * (weights[a.key] || 0))
    .slice(0, count);
}

export function envLabel(value) {
  return ENV_TYPES[value] || value;
}

export function formatCoord(value, axis) {
  const hemisphere = axis === 'lat' ? (value >= 0 ? 'N' : 'S') : value >= 0 ? 'E' : 'W';
  return `${Math.abs(value).toFixed(2)}° ${hemisphere}`;
}