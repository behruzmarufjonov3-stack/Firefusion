import React, { useState, useMemo } from 'react';
import { CalendarDay, RegionSummary, HistoricalCalendarData, MonthlyRecord, MonthlyClimatology } from '../types/fire';
import { Translations } from '../i18n/translations';
import { Calendar, Flame, AlertCircle, TrendingUp, Info, BarChart3, Award, Sparkles } from 'lucide-react';
import rawHistoricalData from '../data/historical_calendar.json';

const historicalData = rawHistoricalData as unknown as HistoricalCalendarData;

interface BurningCalendarProps {
  summary: RegionSummary;
  selectedRegion: string;
  onRegionChange?: (region: string) => void;
  t: Translations;
  theme: 'dark' | 'light';
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const BurningCalendar: React.FC<BurningCalendarProps> = ({
  summary,
  selectedRegion,
  onRegionChange,
  t,
  theme
}) => {
  const isDark = theme === 'dark';

  // Normalize region key to one present in historical calendar (indonesia, central_asia, amazon, global)
  const currentRegionKey = useMemo(() => {
    if (selectedRegion.includes('indo')) return 'indonesia';
    if (selectedRegion.includes('asia') || selectedRegion.includes('uzb')) return 'central_asia';
    if (selectedRegion.includes('amaz')) return 'amazon';
    return 'global';
  }, [selectedRegion]);

  const regionData = historicalData.regions[currentRegionKey] || historicalData.regions.global;
  const currentStatus = regionData.current_status;

  // Selected cell for month inspector
  const [selectedMonthRecord, setSelectedMonthRecord] = useState<MonthlyRecord | null>(null);

  // Active 7-day operational item
  const [activeDay, setActiveDay] = useState<CalendarDay | null>(
    summary.calendar && summary.calendar.length > 0 ? summary.calendar[0] : null
  );

  // Active sub-tab: 'matrix' (Year x Month) | 'climatology' (12-Mo Trend) | 'operational' (7-Day NRT)
  const [activeView, setActiveView] = useState<'matrix' | 'climatology' | 'operational'>('matrix');

  // Group monthly records by year
  const recordsByYear = useMemo(() => {
    const map = new Map<number, MonthlyRecord[]>();
    for (const rec of regionData.monthly_records) {
      if (!map.has(rec.year)) {
        map.set(rec.year, []);
      }
      map.get(rec.year)!.push(rec);
    }
    // Return sorted years descending (2026 down to 2012)
    return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
  }, [regionData]);

  // Color helper for relative burning intensity
  const getHeatmapColor = (intensity: number, isSelected: boolean) => {
    if (isSelected) {
      return 'bg-white text-black font-bold ring-2 ring-orange-500 scale-105 z-10 shadow-lg';
    }
    if (intensity >= 0.75) {
      return isDark
        ? 'bg-orange-600 text-white font-bold hover:bg-orange-500'
        : 'bg-orange-600 text-white font-bold hover:bg-orange-500';
    }
    if (intensity >= 0.45) {
      return isDark
        ? 'bg-orange-500/80 text-white font-bold hover:bg-orange-500'
        : 'bg-orange-500 text-white font-bold hover:bg-orange-600';
    }
    if (intensity >= 0.20) {
      return isDark
        ? 'bg-orange-950/70 text-orange-300 hover:bg-orange-900/80'
        : 'bg-orange-100 text-orange-900 hover:bg-orange-200';
    }
    if (intensity > 0.05) {
      return isDark
        ? 'bg-zinc-900/90 text-zinc-300 hover:bg-zinc-800'
        : 'bg-slate-100 text-slate-700 hover:bg-slate-200';
    }
    return isDark
      ? 'bg-black/60 text-zinc-500 hover:bg-zinc-900'
      : 'bg-slate-50 text-slate-400 hover:bg-slate-100';
  };

  const cardBg = isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200 shadow-sm';
  const innerCardBg = isDark ? 'bg-black border-zinc-800' : 'bg-slate-50 border-slate-200';
  const mainTextColor = isDark ? 'text-white' : 'text-slate-900';
  const subTextColor = isDark ? 'text-zinc-400' : 'text-slate-500';

  // Format large numbers cleanly
  const formatNum = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Real-Time Risk & Climatological Anomaly Alert Banner */}
      <div className={`border rounded-lg p-5 transition-colors relative overflow-hidden ${cardBg}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800/60">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">
              <Calendar className="w-4 h-4" />
              <span>{t.calendar.bannerTitle}</span>
            </div>
            <h2 className={`text-xl font-bold ${mainTextColor}`}>
              {regionData.region_name}
            </h2>
            <div className={`text-xs mt-1 ${subTextColor}`}>
              {t.calendar.dangerSeasonLabel} <span className="text-orange-500 font-bold">{regionData.peak_season}</span> (Peak: {regionData.peak_month})
            </div>
          </div>

          {/* Current Period Anomaly Badge */}
          <div className="flex flex-wrap items-center gap-3">
            <div className={`px-4 py-2.5 rounded-lg border text-right ${
              currentStatus.risk_category === 'Extreme'
                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                : currentStatus.risk_category === 'High'
                ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <div className="text-[10px] font-bold tracking-wider uppercase opacity-80">
                {currentStatus.period} • {currentStatus.risk_category} Risk
              </div>
              <div className="text-sm font-bold mt-0.5 flex items-center justify-end space-x-1">
                <span>
                  {currentStatus.is_above_average ? '+' : ''}{currentStatus.anomaly_pct}%
                </span>
                <span className="text-[11px] opacity-90 font-normal">
                  {currentStatus.is_above_average ? t.calendar.statusAboveAverage : t.calendar.statusBelowAverage}
                </span>
              </div>
            </div>

            <div className={`p-2.5 px-3 rounded-lg border text-center ${innerCardBg}`}>
              <span className={`block text-[10px] uppercase ${subTextColor}`}>{t.calendar.percentileRank}</span>
              <span className="text-orange-500 font-bold text-sm">{currentStatus.percentile_rank}th</span>
            </div>
          </div>
        </div>

        {/* Region Quick Selector Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-1">
          <span className={`text-xs font-bold mr-1 ${subTextColor}`}>Region:</span>
          {[
            { id: 'indonesia', label: 'Indonesia & Malaysia' },
            { id: 'central_asia', label: 'Uzbekistan & Central Asia' },
            { id: 'amazon', label: 'Amazon Basin' },
            { id: 'global', label: 'Global Aggregate' }
          ].map(r => {
            const isSelected = currentRegionKey === r.id;
            return (
              <button
                key={r.id}
                onClick={() => onRegionChange && onRegionChange(r.id)}
                className={`text-xs px-3 py-1.5 rounded border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-orange-500 text-white font-bold border-orange-400 shadow-sm'
                    : isDark
                    ? 'bg-black text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>

        {/* Navigation Tabs (Heatmap Matrix vs Climatology Curve vs 7-Day NRT) */}
        <div className="flex items-center space-x-2 mt-5 border-t border-zinc-800/60 pt-4">
          <button
            onClick={() => setActiveView('matrix')}
            className={`flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded transition-all cursor-pointer ${
              activeView === 'matrix'
                ? 'bg-orange-500 text-white font-bold'
                : isDark
                ? 'text-zinc-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{t.calendar.heatmapMatrixTitle}</span>
          </button>

          <button
            onClick={() => setActiveView('climatology')}
            className={`flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded transition-all cursor-pointer ${
              activeView === 'climatology'
                ? 'bg-orange-500 text-white font-bold'
                : isDark
                ? 'text-zinc-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{t.calendar.climatologyTitle}</span>
          </button>

          <button
            onClick={() => setActiveView('operational')}
            className={`flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded transition-all cursor-pointer ${
              activeView === 'operational'
                ? 'bg-orange-500 text-white font-bold'
                : isDark
                ? 'text-zinc-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>{t.calendar.recent7DaysTitle}</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: Multi-Year Year x Month Heatmap Matrix (2012 - 2026) */}
      {activeView === 'matrix' && (
        <div className={`border rounded-lg p-5 transition-colors ${cardBg}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-zinc-800/40">
            <div>
              <span className={`text-xs font-bold block ${mainTextColor}`}>
                {t.calendar.heatmapMatrixTitle}
              </span>
              <span className={`text-[11px] ${subTextColor}`}>
                {t.calendar.selectMonthHint}
              </span>
            </div>
            {/* Heatmap Legend */}
            <div className="flex items-center space-x-1.5 text-[10px] mt-2 sm:mt-0">
              <span className={subTextColor}>Low</span>
              <div className="w-3 h-3 rounded bg-zinc-900 border border-zinc-800"></div>
              <div className="w-3 h-3 rounded bg-orange-950/70 border border-orange-900/80"></div>
              <div className="w-3 h-3 rounded bg-orange-500"></div>
              <div className="w-3 h-3 rounded bg-orange-600"></div>
              <span className="text-orange-500 font-bold ml-1">Extreme</span>
            </div>
          </div>

          {/* Matrix Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr>
                  <th className={`p-1.5 text-left font-bold ${subTextColor}`}>Year</th>
                  {MONTH_NAMES.map(m => (
                    <th key={m} className={`p-1.5 text-center font-bold ${subTextColor}`}>
                      {m}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recordsByYear.map(([year, months]) => (
                  <tr key={year} className="border-t border-zinc-800/40">
                    <td className={`p-1.5 font-bold ${mainTextColor}`}>
                      {year}
                      {year === 2026 && (
                        <span className="ml-1 px-1 py-0.2 text-[9px] bg-orange-500/20 text-orange-400 rounded">
                          NRT
                        </span>
                      )}
                    </td>
                    {months.map(rec => {
                      const isSelected = selectedMonthRecord?.year === rec.year && selectedMonthRecord?.month === rec.month;
                      return (
                        <td key={rec.month} className="p-1">
                          <button
                            onClick={() => setSelectedMonthRecord(rec)}
                            className={`w-full py-2 px-1 rounded text-center transition-all cursor-pointer ${getHeatmapColor(
                              rec.relative_intensity,
                              isSelected
                            )}`}
                            title={`${rec.year} ${rec.month_name}: ${rec.calibrated_count.toLocaleString()} calibrated hotspots`}
                          >
                            <span className="block text-[11px] leading-tight">
                              {formatNum(rec.calibrated_count)}
                            </span>
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Selected Month Inspector Details */}
          {selectedMonthRecord && (
            <div className={`mt-5 p-4 border rounded-lg text-xs space-y-3 transition-colors ${innerCardBg}`}>
              <div className="flex items-center justify-between">
                <div className="text-orange-500 font-bold flex items-center space-x-2 text-sm">
                  <Flame className="w-4 h-4 fill-orange-500" />
                  <span>
                    {selectedMonthRecord.year} {selectedMonthRecord.month_name} — {t.calendar.monthDetailsTitle}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedMonthRecord(null)}
                  className={`text-[11px] underline cursor-pointer ${subTextColor}`}
                >
                  Close
                </button>
              </div>

              <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 ${subTextColor}`}>
                <div className={`p-2.5 rounded border ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200'}`}>
                  <span className="block text-[10px] uppercase opacity-75">{t.calendar.calibratedCount}</span>
                  <span className={`text-base font-bold ${mainTextColor}`}>
                    {selectedMonthRecord.calibrated_count.toLocaleString()}
                  </span>
                </div>

                <div className={`p-2.5 rounded border ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200'}`}>
                  <span className="block text-[10px] uppercase opacity-75">Raw MODIS Detections:</span>
                  <span className={`text-base font-bold ${mainTextColor}`}>
                    {selectedMonthRecord.raw_modis_count.toLocaleString()}
                  </span>
                </div>

                <div className={`p-2.5 rounded border ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200'}`}>
                  <span className="block text-[10px] uppercase opacity-75">Raw VIIRS Detections:</span>
                  <span className={`text-base font-bold ${mainTextColor}`}>
                    {selectedMonthRecord.raw_viirs_count.toLocaleString()}
                  </span>
                </div>

                <div className={`p-2.5 rounded border ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200'}`}>
                  <span className="block text-[10px] uppercase opacity-75">{t.calendar.totalFrpLabel}</span>
                  <span className="text-orange-500 font-bold text-base">
                    {selectedMonthRecord.total_frp.toLocaleString()} MW
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: 14-Year Climatology & Seasonal Envelope */}
      {activeView === 'climatology' && (
        <div className={`border rounded-lg p-5 transition-colors ${cardBg}`}>
          <div className="pb-3 mb-4 border-b border-zinc-800/40">
            <span className={`text-xs font-bold block ${mainTextColor}`}>
              {t.calendar.climatologyTitle}
            </span>
            <span className={`text-[11px] ${subTextColor}`}>
              Historical baseline (2012–2025) 10th to 90th percentile envelope compared against 2026.
            </span>
          </div>

          {/* 12-Month Climatology Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {regionData.climatology.map(c => {
              const nov2026 = regionData.monthly_records.find(r => r.year === 2026 && r.month === c.month);
              const isPeak = c.month_name === regionData.peak_month.slice(0, 3);

              return (
                <div
                  key={c.month}
                  className={`p-3.5 rounded border transition-all ${
                    isPeak
                      ? isDark
                        ? 'border-orange-500/50 bg-orange-500/5'
                        : 'border-orange-400 bg-orange-50/50'
                      : innerCardBg
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-orange-500">{c.month_name}</span>
                    {isPeak && (
                      <span className="text-[9px] bg-orange-500 text-white font-bold px-1.5 py-0.5 rounded">
                        PEAK
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className={subTextColor}>Mean:</span>
                      <span className={`font-bold ${mainTextColor}`}>{c.mean_count.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={subTextColor}>10th–90th:</span>
                      <span className={subTextColor}>{formatNum(c.p10_count)} – {formatNum(c.p90_count)}</span>
                    </div>

                    {nov2026 && (
                      <div className="pt-2 mt-2 border-t border-zinc-800/50 flex justify-between font-bold">
                        <span className="text-orange-400">2026:</span>
                        <span className={nov2026.calibrated_count > c.mean_count ? 'text-red-400' : 'text-emerald-400'}>
                          {nov2026.calibrated_count.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: 7-Day Operational Matrix (Granular Telemetry) */}
      {activeView === 'operational' && (
        <div className={`border rounded-lg p-5 transition-colors ${cardBg}`}>
          <span className={`text-xs font-bold block mb-3 ${mainTextColor}`}>
            {t.calendar.recent7DaysTitle}
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {summary.calendar.map((day) => {
              const isSelected = activeDay?.date === day.date;
              return (
                <button
                  key={day.date}
                  onClick={() => setActiveDay(day)}
                  className={`p-3 rounded border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-orange-500 text-white border-orange-400 font-bold shadow-sm'
                      : isDark
                      ? 'bg-black text-zinc-300 border-zinc-800 hover:border-zinc-700'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-[11px] opacity-80">{day.date.slice(5)}</div>
                  <div className="text-base font-bold mt-1">
                    {day.harmonized_events.toLocaleString()}
                  </div>
                  <div className="text-[10px] opacity-80 mt-1">
                    {day.risk_category}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Day Inspector */}
          {activeDay && (
            <div className={`mt-4 p-4 border rounded-lg text-xs space-y-2 transition-colors ${innerCardBg}`}>
              <div className="text-orange-500 font-bold flex items-center space-x-1.5">
                <Flame className="w-4 h-4 fill-orange-500" />
                <span>{activeDay.date} — {t.calendar.dayAnalysis}</span>
              </div>
              <div className={`grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 ${subTextColor}`}>
                <div>
                  {t.calendar.trueEventsLabel}{' '}
                  <span className={`font-bold ${mainTextColor}`}>{activeDay.harmonized_events.toLocaleString()}</span>
                </div>
                <div>
                  {t.calendar.rawDetectionsLabel}{' '}
                  <span className={`font-bold ${mainTextColor}`}>{activeDay.raw_detections.toLocaleString()}</span>
                </div>
                <div>
                  {t.calendar.avgFrpLabel}{' '}
                  <span className={`font-bold ${mainTextColor}`}>{activeDay.avg_frp} MW</span>
                </div>
              </div>
              {activeDay.anomalies.length > 0 && (
                <div className={`mt-2 border-t pt-2 flex items-center space-x-2 text-orange-500 ${isDark ? 'border-zinc-900' : 'border-slate-200'}`}>
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{t.calendar.anomalyAlert} {activeDay.anomalies[0].message}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Historical Record Seasons Cards */}
      <div className={`border rounded-lg p-5 transition-colors ${cardBg}`}>
        <div className="flex items-center space-x-2 text-xs font-bold mb-3 text-orange-500">
          <Award className="w-4 h-4" />
          <span>{t.calendar.recordYearsTitle} — {regionData.region_name}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {regionData.record_years.map(ry => (
            <div
              key={ry.year}
              className={`p-3.5 border rounded-lg transition-colors ${
                ry.is_highest
                  ? isDark
                    ? 'border-orange-500/40 bg-orange-500/5'
                    : 'border-orange-400 bg-orange-50/60'
                  : innerCardBg
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`font-bold text-base ${mainTextColor}`}>{ry.year}</span>
                {ry.is_highest && (
                  <span className="text-[10px] bg-orange-500 text-white font-bold px-2 py-0.5 rounded">
                    ALL-TIME RECORD
                  </span>
                )}
              </div>
              <div className="text-xs text-orange-500 font-bold mb-1">
                {ry.annual_calibrated_count.toLocaleString()} hotspots
              </div>
              <p className={`text-[11px] leading-relaxed ${subTextColor}`}>
                {ry.note}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Sensor Calibration & Physics Footnote */}
      <div className={`border rounded-lg p-4 transition-colors text-xs space-y-2 ${innerCardBg}`}>
        <div className="flex items-center space-x-2 text-orange-500 font-bold">
          <Info className="w-4 h-4" />
          <span>{t.calendar.sensorCalibrationTitle}</span>
        </div>
        <p className={`text-[11px] leading-relaxed ${subTextColor}`}>
          {regionData.calibration.note} VIIRS 375m pixels sample ~16x smaller ground area at nadir than MODIS 1km, detecting sub-pixel fires down to ~0.5 MW (compared to MODIS ~10 MW threshold). Cross-calibration models this sensor resolution shift to preserve long-term climate continuity while leveraging modern high-resolution constellation telemetry.
        </p>
      </div>
    </div>
  );
};
