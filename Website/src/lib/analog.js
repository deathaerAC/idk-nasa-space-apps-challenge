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

export function matchScore(site, target) {
  const weights = (TARGETS[target] || TARGETS.mars).weights;
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

export function rankedSites(sites, target) {
  return sites
    .filter((site) => !site.targets || site.targets.includes(target))
    .map((site) => ({ site, score: matchScore(site, target) }))
    .sort((a, b) => b.score - a.score);
}

export function orderedDimensions(target) {
  const weights = (TARGETS[target] || TARGETS.mars).weights;
  return [...DIMENSIONS].sort((a, b) => (weights[b.key] || 0) - (weights[a.key] || 0));
}

export function topDimensions(site, target, count = 3) {
  const weights = (TARGETS[target] || TARGETS.mars).weights;
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