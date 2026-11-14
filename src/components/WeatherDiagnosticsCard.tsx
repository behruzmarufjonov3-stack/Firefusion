import React, { useState, useEffect } from 'react';
import { HarmonizedFireEvent, WeatherTelemetry } from '../types/fire';
import { getEventWeather } from '../utils/weatherEngine';
import { Thermometer, Droplets, Wind, CloudRain } from 'lucide-react';

interface WeatherDiagnosticsCardProps {
  event: HarmonizedFireEvent | null;
  theme: 'dark' | 'light';
  language?: string;
}

export const WeatherDiagnosticsCard: React.FC<WeatherDiagnosticsCardProps> = ({
  event,
  theme,
  language = 'en'
}) => {
  const isDark = theme === 'dark';
  const [weather, setWeather] = useState<WeatherTelemetry | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (event) {
      getEventWeather(event).then((w) => {
        if (isMounted) setWeather(w);
      });
    } else {
      // Default reference coordinate (lat 3.139, lon 101.686)
      const defaultEvent: HarmonizedFireEvent = {
        id: 'REF-IDN-01',
        lat: 3.139,
        lon: 101.686,
        date: '2026-11-14',
        time: '00:00',
        sources: ['MODIS', 'NOAA20'],
        sensor_count: 2,
        raw_detections: 12,
        confidence: 90,
        frp: 450,
        avg_frp: 37.5,
        brightness: 355,
        fai: 90,
        region: 'indonesia'
      };
      getEventWeather(defaultEvent).then((w) => {
        if (isMounted) setWeather(w);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [event]);

  const cardBg = isDark ? 'bg-[#0F1420] border-[#1A2335]' : 'bg-slate-50 border-slate-200';
  const textSub = isDark ? 'text-zinc-400' : 'text-slate-500';
  const textMain = isDark ? 'text-white' : 'text-slate-900';

  if (!weather) return null;

  return (
    <div className={`border rounded-xl p-3 font-mono text-xs transition-colors space-y-2.5 ${cardBg}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800/50">
        <div className="flex items-center space-x-1.5">
          <Wind className="w-3.5 h-3.5 text-orange-500" />
          <span className={`font-bold ${textMain}`}>
            {language === 'uz' ? 'Atmosfera va Yong‘in Ob-havosi' : 'Atmospheric & Fire Weather Telemetry'}
          </span>
        </div>

        <span className="text-[10px] px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 font-bold border border-orange-500/20">
          {weather.spread_risk_category} Spread Risk
        </span>
      </div>

      {/* 4 Metric Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
        {/* Temperature */}
        <div className={`p-2 rounded border ${isDark ? 'bg-black/50 border-zinc-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className={textSub}>Temp (2m)</span>
            <Thermometer className="w-3 h-3 text-orange-400" />
          </div>
          <div className={`font-bold mt-0.5 text-sm ${textMain}`}>
            {weather.temperature_c.toFixed(1)} °C
          </div>
        </div>

        {/* Relative Humidity */}
        <div className={`p-2 rounded border ${isDark ? 'bg-black/50 border-zinc-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className={textSub}>Humidity</span>
            <Droplets className="w-3 h-3 text-cyan-400" />
          </div>
          <div className={`font-bold mt-0.5 text-sm ${textMain}`}>
            {weather.relative_humidity_pct.toFixed(1)}%
          </div>
        </div>

        {/* Wind Speed */}
        <div className={`p-2 rounded border ${isDark ? 'bg-black/50 border-zinc-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className={textSub}>Wind (10m)</span>
            <Wind className="w-3 h-3 text-blue-400" />
          </div>
          <div className={`font-bold mt-0.5 text-sm ${textMain}`}>
            {weather.wind_speed_ms.toFixed(1)} m/s
          </div>
        </div>

        {/* Precipitation */}
        <div className={`p-2 rounded border ${isDark ? 'bg-black/50 border-zinc-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className={textSub}>Precip (1h)</span>
            <CloudRain className="w-3 h-3 text-indigo-400" />
          </div>
          <div className={`font-bold mt-0.5 text-sm ${textMain}`}>
            {weather.precipitation_1h_mm.toFixed(2)} mm
          </div>
        </div>
      </div>

      {/* Atmospheric Interpretation Footer */}
      <div className="flex items-center justify-between text-[10px] pt-1 border-t border-zinc-800/40">
        <span className={textSub}>
          Fuel Moisture: <strong className="text-orange-400">{weather.fuel_moisture_level}</strong> • Model: {weather.source}
        </span>
        <span className="text-[9px] opacity-75">
          {event ? `Lat: ${event.lat.toFixed(3)}, Lon: ${event.lon.toFixed(3)}` : 'Lat: 3.139, Lon: 101.686'}
        </span>
      </div>
    </div>
  );
};
