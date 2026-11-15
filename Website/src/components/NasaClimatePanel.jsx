import { useEffect, useState } from 'react';
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

    // is this important?
/*     base44.functions
      .invoke('nasaSiteClimate', { lat: site.lat, lon: site.lon })
      .then((response) => {
        if (!active) return;
        const data = response?.data?.data;
        setState(data ? { status: 'ready', data } : { status: 'error', data: null });
      })
      .catch(() => {
        if (active) setState({ status: 'error', data: null });
      }); */

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