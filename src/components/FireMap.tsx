import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { HarmonizedFireEvent } from '../types/fire';
import { Translations } from '../i18n/translations';
import { Flame, Filter } from 'lucide-react';

interface FireMapProps {
  events: HarmonizedFireEvent[];
  selectedRegion: string;
  t: Translations;
  theme: 'dark' | 'light';
}

const REGION_COORDS: Record<string, { center: [number, number]; zoom: number }> = {
  global: { center: [10, 10], zoom: 2 },
  amazon: { center: [-3.5, -55.0], zoom: 5 },
  indonesia: { center: [-2.5, 118.0], zoom: 5 },
  central_asia: { center: [41.3, 64.5], zoom: 6 },
  north_america: { center: [39.0, -115.0], zoom: 5 },
  australia: { center: [-23.5, 133.0], zoom: 4 }
};

export const FireMap: React.FC<FireMapProps> = ({ events, selectedRegion, t, theme }) => {
  const isDark = theme === 'dark';
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [filterMode, setFilterMode] = useState<'all' | 'high'>('all');
  const [selectedEvent, setSelectedEvent] = useState<HarmonizedFireEvent | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: REGION_COORDS[selectedRegion]?.center || [10, 10],
        zoom: REGION_COORDS[selectedRegion]?.zoom || 2,
        minZoom: 2,
        maxZoom: 13,
        zoomControl: false
      });

      const tileUrl = isDark
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
        : 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';

      const tile = L.tileLayer(tileUrl, {
        attribution: '&copy; Esri, Garmin, FAO, NOAA &copy; NASA FIRMS',
        maxZoom: 16
      }).addTo(map);

      tileLayerRef.current = tile;
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tiles on Theme Toggle
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    const tileUrl = isDark
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
      : 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';

    const newTile = L.tileLayer(tileUrl, {
      attribution: '&copy; Esri, Garmin, FAO, NOAA &copy; NASA FIRMS',
      maxZoom: 16
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newTile;
  }, [isDark]);

  // Center on region
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const target = REGION_COORDS[selectedRegion];
    if (target) {
      mapInstanceRef.current.flyTo(target.center, target.zoom, { duration: 1.2 });
    }
  }, [selectedRegion]);

  // Render markers
  useEffect(() => {
    if (!markersLayerRef.current || !mapInstanceRef.current) return;

    markersLayerRef.current.clearLayers();

    const filtered = events.filter((e) => {
      if (filterMode === 'high') {
        return e.fai >= 75 || e.frp > 30;
      }
      return true;
    });

    filtered.forEach((e) => {
      const radius = Math.min(14, Math.max(5, Math.sqrt(e.frp) * 1.3));
      const isTriple = e.fai === 100;

      const circle = L.circleMarker([e.lat, e.lon], {
        radius,
        fillColor: '#FF5722',
        color: isTriple ? (isDark ? '#FFFFFF' : '#0F172A') : '#FF5722',
        weight: isTriple ? 2 : 1,
        fillOpacity: 0.85
      });

      circle.on('click', () => {
        setSelectedEvent(e);
      });

      circle.bindTooltip(
        `<div class="font-mono text-xs">
          <div class="font-bold ${isDark ? 'text-white' : 'text-slate-900'}">${e.id}</div>
          <div class="text-orange-500 font-bold">FRP: ${e.frp} MW</div>
          <div class="${isDark ? 'text-zinc-300' : 'text-slate-600'}">Sensors: ${e.sources.join(', ')}</div>
        </div>`,
        { className: isDark ? 'leaflet-dark-tooltip' : 'leaflet-light-tooltip', direction: 'top' }
      );

      markersLayerRef.current?.addLayer(circle);
    });
  }, [events, filterMode, isDark]);

  const hudBg = isDark
    ? 'bg-black/90 border-zinc-800 text-zinc-300'
    : 'bg-white/95 border-slate-300 text-slate-800 shadow-md';

  return (
    <div className={`relative w-full h-[calc(100vh-250px)] min-h-[580px] rounded-lg overflow-hidden border transition-colors ${
      isDark ? 'border-zinc-800 bg-black' : 'border-slate-300 bg-slate-100'
    }`}>
      {/* Map */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Filter HUD */}
      <div className={`absolute top-3 left-3 z-10 backdrop-blur border rounded-lg p-2.5 font-mono text-xs shadow-lg flex items-center space-x-2 ${hudBg}`}>
        <span className="flex items-center space-x-1">
          <Filter className="w-3.5 h-3.5 text-orange-500" />
          <span>{t.map.filterLabel}</span>
        </span>
        <button
          onClick={() => setFilterMode('all')}
          className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${
            filterMode === 'all'
              ? 'bg-orange-500 text-white font-bold'
              : isDark ? 'text-zinc-400 hover:text-white bg-zinc-900' : 'text-slate-600 hover:text-black bg-slate-100'
          }`}
        >
          {t.map.filterAll} ({events.length})
        </button>
        <button
          onClick={() => setFilterMode('high')}
          className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${
            filterMode === 'high'
              ? 'bg-orange-500 text-white font-bold'
              : isDark ? 'text-zinc-400 hover:text-white bg-zinc-900' : 'text-slate-600 hover:text-black bg-slate-100'
          }`}
        >
          {t.map.filterHigh}
        </button>
      </div>

      {/* Simple Legend */}
      <div className={`absolute bottom-3 left-3 z-10 backdrop-blur border rounded-lg px-3 py-2 text-xs font-mono flex items-center space-x-4 ${hudBg}`}>
        <div className="flex items-center space-x-1.5">
          <span className={`w-3 h-3 rounded-full bg-orange-500 border ${isDark ? 'border-white' : 'border-slate-900'}`}></span>
          <span>{t.map.legendTriple}</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
          <span>{t.map.legendActive}</span>
        </div>
      </div>

      {/* Selected Event Detail Modal */}
      {selectedEvent && (
        <div className={`absolute top-3 right-3 z-10 backdrop-blur border border-orange-500 rounded-lg p-4 font-mono text-xs shadow-2xl max-w-xs space-y-2 ${
          isDark ? 'bg-black/95 text-white' : 'bg-white/95 text-slate-900'
        }`}>
          <div className={`flex items-center justify-between border-b pb-2 ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
            <span className="font-bold flex items-center space-x-1 text-orange-500">
              <Flame className="w-4 h-4 fill-orange-500" />
              <span>{t.map.inspectorTitle}</span>
            </span>
            <button
              onClick={() => setSelectedEvent(null)}
              className={`cursor-pointer ${isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-500 hover:text-black'}`}
            >
              ✕
            </button>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className={isDark ? 'text-zinc-400' : 'text-slate-500'}>{t.map.inspectorCoords}</span>
              <span>{selectedEvent.lat.toFixed(3)}, {selectedEvent.lon.toFixed(3)}</span>
            </div>
            <div className="flex justify-between">
              <span className={isDark ? 'text-zinc-400' : 'text-slate-500'}>{t.map.inspectorDate}</span>
              <span>{selectedEvent.date} {selectedEvent.time}</span>
            </div>
            <div className="flex justify-between">
              <span className={isDark ? 'text-zinc-400' : 'text-slate-500'}>{t.map.inspectorFRP}</span>
              <span className="text-orange-500 font-bold">{selectedEvent.frp} MW</span>
            </div>
            <div className="flex justify-between">
              <span className={isDark ? 'text-zinc-400' : 'text-slate-500'}>{t.map.inspectorSensors}</span>
              <span className="text-orange-500">{selectedEvent.sources.join(' + ')}</span>
            </div>
            <div className="flex justify-between">
              <span className={isDark ? 'text-zinc-400' : 'text-slate-500'}>{t.map.inspectorMerged}</span>
              <span>{selectedEvent.raw_detections}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
