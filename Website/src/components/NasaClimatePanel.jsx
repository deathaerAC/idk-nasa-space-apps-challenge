// AI disclosure: the part of this file that reads NASA POWER (readNasaAnswer and fetchClimate) was written with Claude (Anthropic), an AI tool.
import { useEffect, useState } from 'react';

const NASA_PARAMS = 'T2M,T2M_MIN,T2M_MAX,WS2M,RH2M,PRECTOTCORR,ALLSKY_SFC_SW_DWN';

// Picks the yearly figures out of a NASA POWER answer. Returns null when there is nothing usable in it.
function readNasaAnswer(json) {
  const parameter = json?.properties?.parameter || {};
  const annual = (name) => {
    const value = parameter?.[name]?.ANN;
    return typeof value === 'number' ? value : null;
  };
  const values = {
    temp_mean: annual('T2M'),
    temp_min: annual('T2M_MIN'),
    temp_max: annual('T2M_MAX'),
    wind_speed: annual('WS2M'),
    humidity: annual('RH2M'),
    precipitation: annual('PRECTOTCORR'),
    solar_irradiance: annual('ALLSKY_SFC_SW_DWN'),
  };
  if (Object.values(values).every((value) => value === null)) return null;
  const rawElevation = json?.geometry?.coordinates?.[2];
  return { ...values, elevation_m: typeof rawElevation === 'number' ? Math.round(rawElevation) : null };
}

// Gets the climate figures for one place. It tries two ways, in this order:
//   1. this site's own server (the /api/nasa-climate route in Backend/src/server.ts), which asks NASA for us
//   2. NASA POWER directly from the visitor's browser
// Returns null when neither gives an answer.
async function fetchClimate(lat, lon) {
  const latitude = Number(lat).toFixed(3);
  const longitude = Number(lon).toFixed(3);
  const sources = [
    `/api/nasa-climate?lat=${latitude}&lon=${longitude}`,
    'https://power.larc.nasa.gov/api/temporal/climatology/point' +
      `?parameters=${NASA_PARAMS}&community=RE&longitude=${longitude}&latitude=${latitude}&format=JSON`,
  ];
  for (const url of sources) {
    try {
      const response = await fetch(url);
      if (!response.ok) continue;
      const data = readNasaAnswer(await response.json());
      if (data) return data;
    } catch {
      // not reachable, or not a NASA answer: try the next way
    }
  }
  return null;
}

const METRICS = [
  { key: 'temp_mean', label: 'Mean air temp', unit: '°C', digits: 1 },
  { key: 'wind_speed', label: 'Wind speed', unit: 'm/s', digits: 1 },
  { key: 'precipitation', label: 'Precipitation', unit: 'mm/day', digits: 2 },
  { key: 'solar_irradiance', label: 'Solar irradiance', unit: 'kWh/m²/d', digits: 2 },
];

export default function NasaClimatePanel({ site }) {
  const [state, setState] = useState({ status: 'loading', data: null });

  useEffect(() => {
    let active = true;
    setState({ status: 'loading', data: null });

    fetchClimate(site.lat, site.lon)
      .then((data) => {
        if (!active) return;
        setState(data ? { status: 'ready', data } : { status: 'error', data: null });
      })
      .catch(() => {
        if (active) setState({ status: 'error', data: null });
      });

    return () => {
      active = false;
    };
  }, [site.lat, site.lon]);

  if (state.status === 'loading') {
    return (
      <div className="grid grid-cols-2 gap-px overflow-hidden border border-border bg-border/60">
        {METRICS.map((metric) => (
          <div key={metric.key} className="h-[74px] animate-pulse bg-secondary/50" />
        ))}
      </div>
    );
  }

  if (state.status === 'error' || !state.data) {
    return (
      <p className="border border-border px-4 py-3 text-[12px] leading-relaxed text-muted-foreground">
        NASA POWER climatology is unavailable for this coordinate right now.
      </p>
    );
  }

  const data = state.data;

  return (
    <div>
      <dl className="grid grid-cols-2 gap-px overflow-hidden border border-border bg-border/60">
        {METRICS.map((metric) => {
          const value = data[metric.key];
          return (
            <div key={metric.key} className="bg-card px-4 py-3">
              <dt className="label-mono text-muted-foreground/70">{metric.label}</dt>
              <dd className="mt-1.5 font-mono text-[15px] tabular-nums text-foreground/90">
                {typeof value === 'number' ? value.toFixed(metric.digits) : '—'}
                <span className="ml-1 text-[10px] text-muted-foreground">{metric.unit}</span>
              </dd>
            </div>
          );
        })}
      </dl>

      <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
        Annual normals{typeof data.elevation_m === 'number' ? ` at ${data.elevation_m.toLocaleString()} m (model DEM)` : ''} · range{' '}
        {typeof data.temp_min === 'number' ? data.temp_min.toFixed(1) : '—'} to{' '}
        {typeof data.temp_max === 'number' ? data.temp_max.toFixed(1) : '—'} °C ·{' '}
        {typeof data.humidity === 'number' ? data.humidity.toFixed(0) : '—'}% RH
      </p>
      <p className="label-mono mt-2 text-muted-foreground/50">Source · NASA POWER climatology</p>
    </div>
  );
}