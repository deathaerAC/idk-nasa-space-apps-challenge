// AI disclosure: the satellite imagery setup, zoom buttons and fly-to-site parts of this file were written with Claude (Anthropic), an AI tool.
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { matchScore } from '@/lib/analog';

const HOME_CENTER = [12, 4]; // where the map starts: the whole world
const HOME_ZOOM = 2;
const FOCUS_ZOOM = 8; // how close the map goes when a site is picked
const MAX_ZOOM = 12; // how far in the + button can go

// Hands the live map to the component below, so buttons outside the map can move it.
function MapHandle({ onReady }) {
  const map = useMap();
  useEffect(() => {
    onReady(map);
  }, [map, onReady]);
  return null;
}

/**
 *   selectedSlug  the site the map should look at. When it changes, the map flies there.
 *   onSelect      called with a site's slug when its marker is clicked
 *   onReset       called when the "World view" button is pressed
 */
export default function AnalogMap({ entries, target, destinationSite, selectedSlug, onSelect, onReset }) {
  const [map, setMap] = useState(null);
  const [zoom, setZoom] = useState(HOME_ZOOM);

  // Keep track of how far in the map is, to know when to offer the "World view" button.
  useEffect(() => {
    if (!map) return undefined;
    const update = () => setZoom(map.getZoom());
    map.on('zoomend', update);
    update();
    return () => {
      map.off('zoomend', update);
    };
  }, [map]);

  // When a site is picked (from the list or by clicking its marker), travel to it.
  const focused = entries.find(({ site }) => site.slug === selectedSlug);
  const focusLat = focused ? focused.site.lat : null;
  const focusLon = focused ? focused.site.lon : null;
  useEffect(() => {
    if (!map || focusLat === null || focusLon === null) return;
    const calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    map.flyTo([focusLat, focusLon], Math.max(map.getZoom(), FOCUS_ZOOM), { animate: !calm, duration: 1.2 });
  }, [map, focusLat, focusLon]);

  const showWorld = () => {
    if (map) map.flyTo(HOME_CENTER, HOME_ZOOM, { duration: 1 });
    if (onReset) onReset();
  };

  return (
    // "isolate" keeps the map's own buttons underneath the site detail panel and the page header.
    <div className="relative isolate h-[420px] w-full sm:h-[520px] lg:h-[640px]">
      <MapContainer
        center={HOME_CENTER}
        zoom={HOME_ZOOM}
        minZoom={2}
        maxZoom={MAX_ZOOM}
        zoomControl={false}
        attributionControl={false}
        scrollWheelZoom={false}
        worldCopyJump
        className="h-full w-full"
      >
        <MapHandle onReady={setMap} />
        <ZoomControl position="topright" />

        {/* Satellite pictures of the real ground, dimmed a little so the markers stand out. */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          maxZoom={MAX_ZOOM}
          className="brightness-[0.82] saturate-[0.9]"
        />
        {/* Country borders and place names on top. */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          maxZoom={MAX_ZOOM}
          opacity={0.75}
        />

        {entries.map(({ site }) => {
          const score = matchScore(site, target, destinationSite);
          const active = site.slug === selectedSlug;
          return (
            <CircleMarker
              // a new key when a marker becomes the chosen one, so its name label can stay open
              key={active ? `${site.slug}:chosen` : site.slug}
              center={[site.lat, site.lon]}
              radius={active ? 11 : 5 + score / 18}
              pathOptions={{
                color: '#E8EDF4',
                weight: active ? 2.5 : 1.5,
                fillColor: 'hsl(214 74% 63%)',
                fillOpacity: active ? 0.75 : 0.55,
              }}
              eventHandlers={{ click: () => onSelect(site.slug) }}
            >
              <Tooltip direction="top" offset={[0, -6]} className="atlas-tip" permanent={active}>
                {site.name} · {score}
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {zoom > HOME_ZOOM ? (
        <button
          type="button"
          onClick={showWorld}
          className="absolute left-3 top-3 z-[1000] border border-border bg-card/90 px-3 py-1.5 text-[11px] tracking-tight text-muted-foreground backdrop-blur transition-colors hover:border-primary/60 hover:text-foreground"
        >
          World view
        </button>
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-background via-background/70 to-transparent p-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full border border-primary/80 bg-primary/30" />
          <span className="label-mono text-muted-foreground">Marker size = match score</span>
        </div>
        <span className="label-mono text-muted-foreground/60">Imagery © Esri, Maxar, Earthstar Geographics</span>
      </div>
    </div>
  );
}
