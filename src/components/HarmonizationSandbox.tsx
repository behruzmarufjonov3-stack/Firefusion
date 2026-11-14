import React, { useState, useEffect } from 'react';
import { RawFireRecord, harmonizeRawDetections } from '../utils/harmonization';
import { HarmonizedFireEvent } from '../types/fire';
import { Translations } from '../i18n/translations';
import { Cpu, Upload, Play, Sliders, MapPin } from 'lucide-react';

interface HarmonizationSandboxProps {
  t: Translations;
  theme: 'dark' | 'light';
  onFocusEvent?: (event: HarmonizedFireEvent) => void;
  onClose?: () => void;
}

export const HarmonizationSandbox: React.FC<HarmonizationSandboxProps> = ({
  t,
  theme,
  onFocusEvent,
  onClose
}) => {
  const isDark = theme === 'dark';
  const [gridRadiusKm, setGridRadiusKm] = useState<number>(1.5);
  const [minConfidence, setMinConfidence] = useState<number>(40);
  const [liveEvents, setLiveEvents] = useState<HarmonizedFireEvent[]>([]);
  const [rawRecordsCount, setRawRecordsCount] = useState<number>(0);
  const [currentRawRecords, setCurrentRawRecords] = useState<RawFireRecord[]>([]);
  const [selectedHarmonizedEvent, setSelectedHarmonizedEvent] = useState<HarmonizedFireEvent | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Language-aware status messages
  const getInitialStatus = () => {
    switch (t.submission.copyBtn) {
      case 'Nusxalash':
        return 'Tayyor. "Sun\'iy Yong\'in Portlashini Sinash" tugmasini bosing yoki CSV fayl yuklang.';
      case 'Копировать':
        return 'Готово. Нажмите «Симулировать всплеск» или загрузите CSV-файл.';
      case 'Copiar':
        return 'Listo. Haga clic en simular o suba un archivo CSV.';
      case 'Copier':
        return 'Prêt. Cliquez sur simuler ou importez un fichier CSV.';
      default:
        return 'Ready. Click "Simulate Multi-Satellite Fire Burst" or upload a CSV file.';
    }
  };

  const getSuccessStatus = (rawCount: number, eventCount: number, dedupRate: string) => {
    switch (t.submission.copyBtn) {
      case 'Nusxalash':
        return `Muvaffaqiyatli: ${rawCount} ta xom signal tahlil qilindi → ${eventCount} ta yagona o'choqqa birlashtirildi (${dedupRate}% takroriylik tozalandi). Qatorni tanlab xaritada ko'rishingiz mumkin.`;
      case 'Копировать':
        return `Успешно: ${rawCount} сырых сигналов → ${eventCount} очагов (${dedupRate}% устранено дублирование). Выберите строку для показа на карте.`;
      case 'Copiar':
        return `Éxito: ${rawCount} señales sin procesar → ${eventCount} eventos (${dedupRate}% deduplicado). Seleccione una fila para ver en el mapa.`;
      case 'Copier':
        return `Succès : ${rawCount} détections brutes → ${eventCount} événements (${dedupRate}% dédupliqué). Sélectionnez une ligne pour voir sur la carte.`;
      default:
        return `Success: ${rawCount} raw detections analyzed → ${eventCount} unified clusters (${dedupRate}% deduplicated). Select a row to view on map.`;
    }
  };

  const [statusMsg, setStatusMsg] = useState<string>(getInitialStatus());

  useEffect(() => {
    setStatusMsg(getInitialStatus());
  }, [t]);

  const cardBg = isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200 shadow-sm';
  const innerCardBg = isDark ? 'bg-black border-zinc-800' : 'bg-slate-50 border-slate-200';
  const mainTextColor = isDark ? 'text-white' : 'text-slate-900';
  const subTextColor = isDark ? 'text-zinc-400' : 'text-slate-500';

  // Helper to re-harmonize with current slider settings
  const reHarmonize = (records: RawFireRecord[], radiusKm: number, minConf: number) => {
    const filtered = records.filter((r) => {
      if (typeof r.confidence === 'number') return r.confidence >= minConf;
      if (typeof r.confidence === 'string') {
        const c = r.confidence.toLowerCase();
        if (c === 'high') return true;
        if (c === 'nominal') return minConf <= 70;
        if (c === 'low') return minConf <= 30;
      }
      return true;
    });

    const degrees = radiusKm / 111.0;
    const harmonized = harmonizeRawDetections(filtered, degrees);
    setLiveEvents(harmonized);
    if (harmonized.length > 0 && (!selectedHarmonizedEvent || !harmonized.some(e => e.id === selectedHarmonizedEvent.id))) {
      setSelectedHarmonizedEvent(harmonized[0]);
    }
    return harmonized;
  };

  // Run multi-sensor simulation
  const handleRunSimulation = () => {
    setIsProcessing(true);
    setStatusMsg(t.submission.copyBtn === 'Nusxalash' ? 'Multi-sensorli sun\'iy yo\'ldoshlar klasteri birlashtirilmoqda...' : 'Harmonizing multi-satellite fire burst...');

    setTimeout(() => {
      const baseLat = -2.250;
      const baseLon = 113.820;
      const records: RawFireRecord[] = [];

      // MODIS (1km)
      for (let i = 0; i < 6; i++) {
        records.push({
          latitude: baseLat + (Math.random() - 0.5) * 0.012,
          longitude: baseLon + (Math.random() - 0.5) * 0.012,
          confidence: Math.round(65 + Math.random() * 30),
          frp: Math.round(15 + Math.random() * 60),
          brightness: 335,
          acq_date: '2026-11-14',
          acq_time: '01:30',
          satellite: 'Terra',
          sensor: 'MODIS'
        });
      }

      // VIIRS NOAA-20 (375m)
      for (let i = 0; i < 11; i++) {
        records.push({
          latitude: baseLat + (Math.random() - 0.5) * 0.009,
          longitude: baseLon + (Math.random() - 0.5) * 0.009,
          confidence: 'high',
          frp: Math.round(20 + Math.random() * 70),
          brightness: 355,
          acq_date: '2026-11-14',
          acq_time: '01:45',
          satellite: 'NOAA-20',
          sensor: 'NOAA20'
        });
      }

      // VIIRS NOAA-21 (375m)
      for (let i = 0; i < 12; i++) {
        records.push({
          latitude: baseLat + (Math.random() - 0.5) * 0.008,
          longitude: baseLon + (Math.random() - 0.5) * 0.008,
          confidence: 'high',
          frp: Math.round(25 + Math.random() * 80),
          brightness: 360,
          acq_date: '2026-11-14',
          acq_time: '02:15',
          satellite: 'NOAA-21',
          sensor: 'NOAA21'
        });
      }

      setCurrentRawRecords(records);
      setRawRecordsCount(records.length);
      const harmonized = reHarmonize(records, gridRadiusKm, minConfidence);
      setIsProcessing(false);
      const dedupRate = ((1 - harmonized.length / records.length) * 100).toFixed(1);
      setStatusMsg(getSuccessStatus(records.length, harmonized.length, dedupRate));
    }, 250);
  };

  // Upload Custom CSV
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setStatusMsg(`${file.name}...`);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n');
        if (lines.length < 2) throw new Error('File empty or invalid');

        const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
        const latIdx = headers.indexOf('latitude');
        const lonIdx = headers.indexOf('longitude');
        const confIdx = headers.indexOf('confidence');
        const frpIdx = headers.indexOf('frp');
        const dateIdx = headers.indexOf('acq_date');
        const timeIdx = headers.indexOf('acq_time');
        const satIdx = headers.indexOf('satellite');

        const records: RawFireRecord[] = [];
        const maxRows = Math.min(lines.length, 2500);
        for (let i = 1; i < maxRows; i++) {
          const parts = lines[i].split(',');
          if (parts.length < 4) continue;

          const lat = parseFloat(parts[latIdx]);
          const lon = parseFloat(parts[lonIdx]);
          if (isNaN(lat) || isNaN(lon)) continue;

          const sat = satIdx !== -1 && parts[satIdx] ? parts[satIdx].trim() : 'MODIS';
          const sensor = sat.includes('20') ? 'NOAA20' : sat.includes('21') ? 'NOAA21' : 'MODIS';

          records.push({
            latitude: lat,
            longitude: lon,
            confidence: confIdx !== -1 ? parts[confIdx]?.trim() : 80,
            frp: frpIdx !== -1 ? parseFloat(parts[frpIdx]) || 12 : 12,
            brightness: 335,
            acq_date: dateIdx !== -1 ? parts[dateIdx]?.trim() : '2026-11-14',
            acq_time: timeIdx !== -1 ? parts[timeIdx]?.trim() : '12:00',
            satellite: sat,
            sensor
          });
        }

        setCurrentRawRecords(records);
        setRawRecordsCount(records.length);
        const harmonized = reHarmonize(records, gridRadiusKm, minConfidence);
        setIsProcessing(false);
        const dedupRate = ((1 - harmonized.length / records.length) * 100).toFixed(1);
        setStatusMsg(getSuccessStatus(records.length, harmonized.length, dedupRate));
      } catch (err) {
        setIsProcessing(false);
        setStatusMsg(`Error: ${(err as Error).message}`);
      }
    };
    reader.readAsText(file);
  };

  const handleRadiusChange = (val: number) => {
    setGridRadiusKm(val);
    if (currentRawRecords.length > 0) {
      reHarmonize(currentRawRecords, val, minConfidence);
    }
  };

  const handleConfChange = (val: number) => {
    setMinConfidence(val);
    if (currentRawRecords.length > 0) {
      reHarmonize(currentRawRecords, gridRadiusKm, val);
    }
  };

  // Focus event on live map
  const handleFocusOnMap = (event: HarmonizedFireEvent) => {
    if (onFocusEvent) {
      onFocusEvent(event);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="space-y-4 font-mono">
      {/* Title */}
      <div className={`border rounded-lg p-3.5 transition-colors ${cardBg}`}>
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/40 flex items-center justify-center text-orange-500">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h2 className={`text-sm font-bold tracking-wide ${mainTextColor}`}>{t.harmonizer.title}</h2>
            <p className={`text-xs mt-0.5 ${subTextColor}`}>{t.harmonizer.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Controls Column (5 cols) */}
        <div className={`lg:col-span-5 border rounded-lg p-4 space-y-4 transition-colors ${cardBg}`}>
          <div className={`flex items-center space-x-1.5 text-xs font-bold border-b pb-2 ${mainTextColor} ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
            <Sliders className="w-4 h-4 text-orange-500" />
            <span>{t.harmonizer.paramsTitle}</span>
          </div>

          <div>
            <div className={`flex justify-between text-xs mb-1 ${subTextColor}`}>
              <span>{t.harmonizer.radiusLabel}</span>
              <span className="text-orange-500 font-bold">{gridRadiusKm.toFixed(1)} km</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="4.0"
              step="0.1"
              value={gridRadiusKm}
              onChange={(e) => handleRadiusChange(parseFloat(e.target.value))}
              className="w-full accent-orange-500 h-1.5 rounded cursor-pointer"
            />
            <p className={`text-[11px] mt-1 ${subTextColor}`}>{t.harmonizer.radiusDesc}</p>
          </div>

          <div>
            <div className={`flex justify-between text-xs mb-1 ${subTextColor}`}>
              <span>{t.harmonizer.confLabel}</span>
              <span className="text-orange-500 font-bold">{minConfidence}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="90"
              step="5"
              value={minConfidence}
              onChange={(e) => handleConfChange(parseInt(e.target.value))}
              className="w-full accent-orange-500 h-1.5 rounded cursor-pointer"
            />
            <p className={`text-[11px] mt-1 ${subTextColor}`}>{t.harmonizer.confDesc}</p>
          </div>

          <div className={`pt-2 border-t space-y-2 ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
            <button
              onClick={handleRunSimulation}
              disabled={isProcessing}
              className="w-full py-2.5 px-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{t.harmonizer.simulateBtn}</span>
            </button>

            <label className={`w-full py-2.5 px-3 rounded-lg border text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              isDark
                ? 'bg-zinc-900 border-zinc-700 hover:border-orange-500 text-zinc-200'
                : 'bg-slate-100 border-slate-300 hover:border-orange-500 text-slate-800'
            }`}>
              <Upload className="w-3.5 h-3.5 text-orange-500" />
              <span className="font-semibold">{t.harmonizer.uploadBtn}</span>
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className={`p-2.5 rounded-lg border text-[11px] ${innerCardBg} ${subTextColor}`}>
            <span className={`font-bold block mb-0.5 ${mainTextColor}`}>{t.harmonizer.statusLabel}</span>
            {statusMsg}
          </div>
        </div>

        {/* Results & Event Inspector Column (7 cols) */}
        <div className={`lg:col-span-7 border rounded-lg p-4 space-y-3 transition-colors flex flex-col justify-between ${cardBg}`}>
          <div>
            <div className={`flex items-center justify-between border-b pb-2 ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-bold ${mainTextColor}`}>{t.harmonizer.resultsTitle}</span>
                <span className="text-[10px] text-zinc-500">{t.harmonizer.selectRowHint}</span>
              </div>
              {liveEvents.length > 0 && (
                <span className="text-xs text-orange-500 font-bold">
                  {rawRecordsCount} pts → {liveEvents.length} events
                </span>
              )}
            </div>

            {liveEvents.length > 0 ? (
              <div className="overflow-x-auto max-h-[220px] mt-2 border rounded-lg">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className={`border-b text-[10px] uppercase tracking-wider ${subTextColor} ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-100 border-slate-200'}`}>
                      <th className="py-2 px-2.5">{t.harmonizer.colId}</th>
                      <th className="py-2 px-2">{t.harmonizer.colCoords}</th>
                      <th className="py-2 px-2">{t.harmonizer.colSensors}</th>
                      <th className="py-2 px-2">{t.harmonizer.colMerged}</th>
                      <th className="py-2 px-2">{t.harmonizer.colFrp}</th>
                      <th className="py-2 px-2 text-right">{t.harmonizer.colFai}</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y text-[11px] ${isDark ? 'divide-zinc-900' : 'divide-slate-100'}`}>
                    {liveEvents.map((ev) => {
                      const isSelected = selectedHarmonizedEvent?.id === ev.id;
                      return (
                        <tr
                          key={ev.id}
                          onClick={() => setSelectedHarmonizedEvent(ev)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-orange-500/15 border-l-4 border-orange-500 font-bold'
                              : isDark
                                ? 'hover:bg-zinc-900/50'
                                : 'hover:bg-slate-100'
                          }`}
                        >
                          <td className={`py-2 px-2.5 font-bold ${isSelected ? 'text-orange-400' : mainTextColor}`}>
                            {ev.id}
                          </td>
                          <td className={`py-2 px-2 ${subTextColor}`}>{ev.lat.toFixed(2)}, {ev.lon.toFixed(2)}</td>
                          <td className="py-2 px-2 text-orange-500 font-semibold">{ev.sources.join(' + ')}</td>
                          <td className={`py-2 px-2 ${subTextColor}`}>{ev.raw_detections}</td>
                          <td className={`py-2 px-2 font-bold ${mainTextColor}`}>{ev.frp} MW</td>
                          <td className="py-2 px-2 text-right">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              ev.fai === 100
                                ? 'bg-orange-500 text-white'
                                : isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {ev.fai}/100
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={`h-48 flex flex-col items-center justify-center border border-dashed rounded-lg text-xs space-y-1.5 mt-2 ${
                isDark ? 'border-zinc-800 text-zinc-500' : 'border-slate-200 text-slate-400'
              }`}>
                <Cpu className="w-6 h-6 opacity-40 text-orange-500" />
                <span>{t.harmonizer.emptyText}</span>
              </div>
            )}
          </div>

          {/* Interactive Event Inspector Box (Multilingual & Linked to Live Map) */}
          {selectedHarmonizedEvent && (
            <div className={`mt-3 p-3 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              isDark ? 'bg-[#0E1420] border-orange-500/40' : 'bg-orange-50/50 border-orange-300'
            }`}>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-orange-500 font-mono">
                    {t.harmonizer.eventDetails}: {selectedHarmonizedEvent.id}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold">
                    FAI {selectedHarmonizedEvent.fai}/100
                  </span>
                </div>
                <p className={`text-[11px] font-mono leading-tight ${subTextColor}`}>
                  {t.harmonizer.colCoords}: <strong className={mainTextColor}>{selectedHarmonizedEvent.lat.toFixed(3)}, {selectedHarmonizedEvent.lon.toFixed(3)}</strong> • {t.harmonizer.colFrp}: <strong className="text-orange-500">{selectedHarmonizedEvent.frp} MW</strong> • {t.harmonizer.colSensors}: <strong className={mainTextColor}>{selectedHarmonizedEvent.sources.join(' + ')}</strong>
                </p>
                <p className="text-[10px] text-zinc-400 font-mono">
                  {selectedHarmonizedEvent.raw_detections} {t.harmonizer.mergedDetectionsHint}
                </p>
              </div>

              <button
                onClick={() => handleFocusOnMap(selectedHarmonizedEvent)}
                className="px-3.5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-md whitespace-nowrap self-start sm:self-auto"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{t.harmonizer.viewOnMap}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
