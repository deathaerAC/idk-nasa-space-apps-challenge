const PARAMS = 'T2M,T2M_MIN,T2M_MAX,WS2M,RH2M,PRECTOTCORR,ALLSKY_SFC_SW_DWN';

export default async function (req) {
  try {
    const payload = await req.json().catch(() => ({}));
    const lat = Number(payload.lat);
    const lon = Number(payload.lon);

    if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
      return Response.json({ error: 'Valid lat and lon are required' }, { status: 400 });
    }

    const url =
      'https://power.larc.nasa.gov/api/temporal/climatology/point' +
      `?parameters=${PARAMS}&community=RE&longitude=${lon.toFixed(3)}&latitude=${lat.toFixed(3)}&format=JSON`;

    const res = await fetch(url, { signal: AbortSignal.timeout(25000) });
    if (!res.ok) {
      return Response.json({ error: `NASA POWER responded ${res.status}` }, { status: 502 });
    }

    const json = await res.json();
    const parameter = json?.properties?.parameter || {};
    const annual = (name) => {
      const value = parameter?.[name]?.ANN;
      return typeof value === 'number' ? Number(value) : null;
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

    if (Object.values(values).every((value) => value === null)) {
      return Response.json({ error: 'No climatology available for this coordinate' }, { status: 404 });
    }

    const rawElevation = json?.geometry?.coordinates?.[2];

    return Response.json({
      data: {
        ...values,
        elevation_m: typeof rawElevation === 'number' ? Math.round(rawElevation) : null,
        source: 'NASA POWER climatology, 2 m above surface, MERRA-2 / CERES reanalysis',
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}