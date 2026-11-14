import React, { useState, useEffect } from 'react';
import { HarmonizedFireEvent, WeatherTelemetry } from '../types/fire';
import { getEventWeather } from '../utils/weatherEngine';
import { Thermometer, Droplets, Wind, CloudRain, ShieldAlert, Key, Check, X } from 'lucide-react';

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
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [userKey, setUserKey] = useState('');
  const [passKey, setPassKey] = useState('');
  const [hasSessionKey, setHasSessionKey] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const u = sessionStorage.getItem('METEOMATICS_USER');
      setHasSessionKey(!!u);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (event) {
      getEventWeather(event).then((w) => {
        if (isMounted) setWeather(w);
      });
    } else {
      // Default sample coordinate (lat 3.139, lon 101.686)
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

  const handleSaveKeys = () => {
    if (userKey && passKey) {
      sessionStorage.setItem('METEOMATICS_USER', userKey.trim());
      sessionStorage.setItem('METEOMATICS_PASS', passKey.trim());
      setHasSessionKey(true);
      setShowKeyModal(false);
      // Re-trigger weather query
      if (event) {
        getEventWeather(event).then(setWeather);
      }
    }
  };

  const handleClearKeys = () => {
    sessionStorage.removeItem('METEOMATICS_USER');
    sessionStorage.removeItem('METEOMATICS_PASS');
    setHasSessionKey(false);
    setUserKey('');
    setPassKey('');
  };

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
            {language === 'uz' ? 'Atmosfera va Yong‘in Ob-havosi (Meteomatics)' : 'Atmospheric & Fire Weather Telemetry'}
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setShowKeyModal(true)}
            title="Configure Secure Meteomatics Credentials (Saved to browser session only)"
            className={`p-1 rounded transition-colors cursor-pointer ${
              hasSessionKey
                ? 'text-emerald-400 hover:text-emerald-300'
                : 'text-zinc-500 hover:text-orange-500'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 font-bold">
            {weather.spread_risk_category} Spread Risk
          </span>
        </div>
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
          Fuel Moisture: <strong className="text-orange-400">{weather.fuel_moisture_level}</strong> • Source: {weather.source}
        </span>
        <span className="text-[9px] opacity-75">
          {event ? `Lat: ${event.lat}, Lon: ${event.lon}` : 'Lat: 3.139, Lon: 101.686'}
        </span>
      </div>

      {/* Secure Credential Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-xl max-w-md w-full p-4 shadow-2xl space-y-3 ${
            isDark ? 'bg-[#0B0F17] border-zinc-800 text-white' : 'bg-white border-slate-300 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div className="flex items-center space-x-1.5 font-bold text-xs text-orange-500">
                <Key className="w-4 h-4" />
                <span>Secure Meteomatics Weather Credentials</span>
              </div>
              <button onClick={() => setShowKeyModal(false)} className="text-zinc-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className={`text-[11px] leading-relaxed ${textSub}`}>
              Credentials entered here are stored <strong>strictly in your browser session memory</strong> (sessionStorage). They are never transmitted to our servers or committed to Git.
            </p>

            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                  Meteomatics Username
                </label>
                <input
                  type="text"
                  placeholder="e.g. hackathon_nasa_space_apps_user"
                  value={userKey}
                  onChange={(e) => setUserKey(e.target.value)}
                  className={`w-full p-2 rounded border text-xs font-mono outline-none ${
                    isDark ? 'bg-black border-zinc-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                  Meteomatics Password / Token
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••••••"
                  value={passKey}
                  onChange={(e) => setPassKey(e.target.value)}
                  className={`w-full p-2 rounded border text-xs font-mono outline-none ${
                    isDark ? 'bg-black border-zinc-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
              {hasSessionKey ? (
                <button
                  onClick={handleClearKeys}
                  className="text-red-400 hover:text-red-300 text-[11px] underline cursor-pointer"
                >
                  Clear Stored Credentials
                </button>
              ) : <div></div>}

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowKeyModal(false)}
                  className="px-3 py-1.5 rounded border border-zinc-700 text-xs text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveKeys}
                  className="px-3 py-1.5 rounded bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center space-x-1 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save to Session</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
