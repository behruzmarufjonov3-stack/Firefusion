import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { HarmonizedFireEvent } from '../types/fire';
import { Crosshair } from 'lucide-react';

interface MockupMapProps {
  events: HarmonizedFireEvent[];
  selectedRegion: 'amazon' | 'indonesia' | 'global';
  theme: 'dark' | 'light';
  selectedEvent?: HarmonizedFireEvent | null;
  onSelectEvent?: (event: HarmonizedFireEvent) => void;
}

const REGION_SETTINGS: Record<string, { center: [number, number]; zoom: number; ringCenter: [number, number]; radii: number[] }> = {
  amazon: {
    center: [-2.6, 115.5],
    zoom: 5,
    ringCenter: [-2.25, 113.82],
    radii: [260000, 520000, 860000]
  },
  indonesia: {
    center: [-2.6, 115.5],
    zoom: 5,
    ringCenter: [-2.25, 113.82],
    radii: [260000, 520000, 860000]
  },
  global: {
    center: [10, 15],
    zoom: 2,
    ringCenter: [-2.25, 113.82],
    radii: [800000, 1600000, 2600000]
  }
};

export const MockupMap: React.FC<MockupMapProps> = ({
  events,
  selectedRegion,
  theme,
  selectedEvent,
  onSelectEvent
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const ringsLayerRef = useRef<L.LayerGroup | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [activeLayer, setActiveLayer] = useState<'Harmonized' | 'MODIS' | 'NOAA-20' | 'NOAA-21'>('Harmonized');
  // Dynamic epicenter for consensus radar rings
  const [activeEpicenter, setActiveEpicenter] = useState<{ lat: number; lon: number; id: string } | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const setting = REGION_SETTINGS[selectedRegion] || REGION_SETTINGS.amazon;
      const map = L.map(mapContainerRef.current, {
        center: setting.center,
        zoom: setting.zoom,
        minZoom: 2,
        maxZoom: 12,
        zoomControl: false,
        attributionControl: false
      });

      const tileUrl = theme === 'light'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
        : 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';

      const tile = L.tileLayer(tileUrl, { maxZoom: 16 }).addTo(map);
      tileLayerRef.current = tile;

      ringsLayerRef.current = L.layerGroup().addTo(map);
      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      // Force recalculate dimensions
      setTimeout(() => {
        map.invalidateSize();
      }, 150);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update tile layer when theme changes (light/dark)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const tileUrl = theme === 'light'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
      : 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const newTile = L.tileLayer(tileUrl, { maxZoom: 16 }).addTo(mapInstanceRef.current);
    newTile.bringToBack();
    tileLayerRef.current = newTile;
    mapInstanceRef.current.invalidateSize();
  }, [theme]);

  // Center on region
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const setting = REGION_SETTINGS[selectedRegion] || REGION_SETTINGS.amazon;
    mapInstanceRef.current.flyTo(setting.center, setting.zoom, { duration: 1.2 });
  }, [selectedRegion]);

  // Set default active hotspot epicenter when events change
  useEffect(() => {
    if (events.length > 0 && !activeEpicenter) {
      const topEvent = [...events].sort((a, b) => b.frp - a.frp)[0];
      if (topEvent) {
        setActiveEpicenter({ lat: topEvent.lat, lon: topEvent.lon, id: topEvent.id });
      }
    }
  }, [events]);

  // CRITICAL FIX: React immediately when selectedEvent changes (e.g. from "Xaritada ko'rish" button)
  useEffect(() => {
    if (!selectedEvent) return;

    setActiveEpicenter({
      lat: selectedEvent.lat,
      lon: selectedEvent.lon,
      id: selectedEvent.id
    });

    if (mapInstanceRef.current) {
      // Smoothly fly camera right to the selected hotspot!
      mapInstanceRef.current.flyTo([selectedEvent.lat, selectedEvent.lon], 6.5, {
        duration: 1.3
      });
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 150);
    }
  }, [selectedEvent]);

  // 1. Draw Concentric Radar Consensus Rings (Dynamic: Centers on the active hotspot)
  useEffect(() => {
    if (!ringsLayerRef.current) return;
    ringsLayerRef.current.clearLayers();

    const setting = REGION_SETTINGS[selectedRegion] || REGION_SETTINGS.amazon;
    const centerCoords: [number, number] = activeEpicenter
      ? [activeEpicenter.lat, activeEpicenter.lon]
      : setting.ringCenter;

    const ringColor = '#FF5722';

    setting.radii.forEach((radius, idx) => {
      const ring = L.circle(centerCoords, {
        radius,
        fillColor: ringColor,
        fillOpacity: idx === 0 ? 0.05 : 0.015,
        color: ringColor,
        weight: idx === 0 ? 2 : 1.5,
        opacity: idx === 0 ? 0.75 : idx === 1 ? 0.45 : 0.28,
        dashArray: idx === 1 ? '6, 6' : undefined
      });
      ringsLayerRef.current?.addLayer(ring);
    });

    // Radar crosshair ping at center
    const ping = L.circleMarker(centerCoords, {
      radius: 4,
      fillColor: '#FFFFFF',
      color: ringColor,
      weight: 2,
      fillOpacity: 1
    });
    ringsLayerRef.current?.addLayer(ping);
  }, [activeEpicenter, selectedRegion]);

  // 2. Render Interactive Fire Hotspots
  useEffect(() => {
    if (!markersLayerRef.current || !mapInstanceRef.current) return;
    markersLayerRef.current.clearLayers();

    // Filter events by selected satellite layer
    const visibleEvents = events.filter((e) => {
      if (activeLayer === 'Harmonized') return true;
      if (activeLayer === 'MODIS') return e.sources.includes('MODIS');
      if (activeLayer === 'NOAA-20') return e.sources.includes('NOAA20');
      if (activeLayer === 'NOAA-21') return e.sources.includes('NOAA21');
      return true;
    });

    visibleEvents.forEach((e) => {
      const baseRadius = Math.min(16, Math.max(5, Math.sqrt(e.frp) * 0.42));
      const isMultiSensor = e.fai >= 90;
      const isSelected = activeEpicenter?.id === e.id;

      // Outer soft glow halo
      const outerGlow = L.circleMarker([e.lat, e.lon], {
        radius: isSelected ? baseRadius * 2.8 : baseRadius * 2.4,
        fillColor: '#FF5722',
        fillOpacity: isSelected ? 0.5 : 0.25,
        stroke: false
      });
      markersLayerRef.current?.addLayer(outerGlow);

      // Mid thermal ember
      const midEmber = L.circleMarker([e.lat, e.lon], {
        radius: baseRadius * 1.35,
        fillColor: '#FF5722',
        fillOpacity: 0.75,
        stroke: false
      });
      markersLayerRef.current?.addLayer(midEmber);

      // Core fire marker
      const coreMarker = L.circleMarker([e.lat, e.lon], {
        radius: baseRadius,
        fillColor: isMultiSensor ? '#FFA726' : '#FF5722',
        color: isSelected ? '#FFFFFF' : isMultiSensor ? '#FFFFFF' : '#FF5722',
        weight: isSelected ? 3 : isMultiSensor ? 2 : 1,
        fillOpacity: 0.95
      });

      // CLICK INTERACTION: Re-center the radar rings on this exact hotspot!
      coreMarker.on('click', () => {
        setActiveEpicenter({ lat: e.lat, lon: e.lon, id: e.id });
        if (onSelectEvent) onSelectEvent(e);
      });

      const tooltipThemeClass = theme === 'light' ? 'leaflet-light-tooltip' : 'leaflet-dark-tooltip';

      coreMarker.bindTooltip(
        `<div class="font-mono text-xs p-1">
          <div class="font-bold text-orange-500 flex items-center justify-between">
            <span>${e.id}</span>
            <span class="text-[10px] bg-orange-500/20 px-1 rounded text-orange-400">Click to Focus</span>
          </div>
          <div class="font-bold mt-0.5">FRP: ${e.frp} MW</div>
          <div class="text-[11px] opacity-80">FAI: ${e.fai}/100 • ${e.sources.join(' + ')}</div>
          <div class="text-[10px] opacity-70">Lat: ${e.lat.toFixed(2)}, Lon: ${e.lon.toFixed(2)}</div>
        </div>`,
        { className: tooltipThemeClass, direction: 'top' }
      );

      markersLayerRef.current?.addLayer(coreMarker);

      // Open tooltip automatically if selected
      if (isSelected) {
        setTimeout(() => {
          coreMarker.openTooltip();
        }, 100);
      }
    });
  }, [events, activeLayer, activeEpicenter, theme]);

  // Cycle to next hotspot
  const handleNextHotspot = () => {
    if (events.length === 0) return;
    const currentIndex = events.findIndex((e) => e.id === activeEpicenter?.id);
    const nextIndex = (currentIndex + 1) % events.length;
    const nextEvent = events[nextIndex];
    if (nextEvent) {
      setActiveEpicenter({ lat: nextEvent.lat, lon: nextEvent.lon, id: nextEvent.id });
      if (onSelectEvent) onSelectEvent(nextEvent);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.panTo([nextEvent.lat, nextEvent.lon], { animate: true, duration: 0.8 });
      }
    }
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`relative w-full h-full min-h-[560px] flex-1 rounded-2xl overflow-hidden ${
        isDark ? 'bg-[#07090E]' : 'bg-[#E2E8F0]'
      }`}
      style={{ position: 'relative', minHeight: '560px', width: '100%', height: '100%' }}
    >
      {/* Map DOM Element */}
      <div
        ref={mapContainerRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          minHeight: '560px',
          zIndex: 0
        }}
      />

      {/* Pill Overlay: Layers Selector (Top-Left) */}
      <div
        className={`absolute top-4 left-4 z-10 backdrop-blur-md border rounded-full p-1 flex items-center space-x-1 text-xs font-mono shadow-2xl ${
          isDark ? 'bg-[#0E131E]/90 border-[#1A2335] text-zinc-300' : 'bg-white/95 border-zinc-300 text-zinc-700'
        }`}
      >
        <span className="px-3 opacity-60">Layers</span>
        {(['Harmonized', 'MODIS', 'NOAA-20', 'NOAA-21'] as const).map((layer) => (
          <button
            key={layer}
            onClick={() => setActiveLayer(layer)}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
              activeLayer === layer
                ? isDark
                  ? 'bg-[#182030] text-white font-medium border border-[#2A3750] shadow-inner'
                  : 'bg-zinc-200 text-zinc-900 font-semibold border border-zinc-300 shadow-inner'
                : 'opacity-70 hover:opacity-100 bg-transparent'
            }`}
          >
            {layer}
          </button>
        ))}
      </div>

      {/* Radar Consensus Focus Pill (Top-Right of Map) */}
      <div
        className={`absolute top-4 right-4 z-10 backdrop-blur-md border rounded-full px-3 py-1.5 flex items-center space-x-2 text-xs font-mono shadow-2xl ${
          isDark ? 'bg-[#0E131E]/90 border-[#1A2335] text-zinc-300' : 'bg-white/95 border-zinc-300 text-zinc-800'
        }`}
      >
        <Crosshair className="w-3.5 h-3.5 text-orange-500 animate-spin" style={{ animationDuration: '6s' }} />
        <span className="text-[11px] font-semibold text-orange-500">
          {activeEpicenter?.id || 'Active Cluster'}
        </span>
        <button
          onClick={handleNextHotspot}
          title="Click to move radar rings to next fire hotspot"
          className="ml-1 px-2.5 py-0.5 rounded-full bg-orange-500/20 hover:bg-orange-500 hover:text-white text-orange-500 font-bold transition-all cursor-pointer text-[10px]"
        >
          Next Hotspot ➔
        </button>
      </div>
    </div>
  );
};
