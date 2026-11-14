import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { matchScore } from '@/lib/analog';

export default function AnalogMap({ entries, target, selectedSlug, onSelect }) {
  return (
    <div className="relative h-[420px] w-full sm:h-[520px] lg:h-[640px]">
      <MapContainer
        center={[12, 4]}
        zoom={2}
        minZoom={2}
        maxZoom={6}
        zoomControl={false}
        attributionControl={false}
        scrollWheelZoom={false}
        worldCopyJump
        className="h-full w-full"
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          maxZoom={6}
        />
        {entries.map(({ site }) => {
          const score = matchScore(site, target);
          const active = site.slug === selectedSlug;
          return (
            <CircleMarker
              key={site.slug}
              center={[site.lat, site.lon]}
              radius={active ? 11 : 5 + score / 18}
              pathOptions={{
                color: active ? '#E8EDF4' : 'hsl(214 74% 72%)',
                weight: active ? 2 : 1,
                fillColor: 'hsl(214 74% 63%)',
                fillOpacity: active ? 0.5 : 0.28,
              }}
              eventHandlers={{ click: () => onSelect(site.slug) }}
            >
              <Tooltip direction="top" offset={[0, -6]} className="atlas-tip">
                {site.name} · {score}
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-background via-background/70 to-transparent p-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full border border-primary/80 bg-primary/30" />
          <span className="label-mono text-muted-foreground">Marker size = match score</span>
        </div>
        <span className="label-mono text-muted-foreground/60">Basemap © Esri</span>
      </div>
    </div>
  );
}