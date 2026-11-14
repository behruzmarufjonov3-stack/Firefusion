import React, { useState } from 'react';
import { CalendarDay, RegionSummary } from '../types/fire';
import { Translations } from '../i18n/translations';
import { Calendar, Flame, AlertCircle } from 'lucide-react';

interface BurningCalendarProps {
  summary: RegionSummary;
  selectedRegion: string;
  t: Translations;
  theme: 'dark' | 'light';
}

const REGION_SEASONS: Record<string, { peakMonth: string; dangerSeason: string }> = {
  global: { peakMonth: 'August', dangerSeason: 'July – October' },
  amazon: { peakMonth: 'September', dangerSeason: 'August – November' },
  indonesia: { peakMonth: 'September', dangerSeason: 'August – October' },
  central_asia: { peakMonth: 'July', dangerSeason: 'June – August' },
  north_america: { peakMonth: 'August', dangerSeason: 'July – September' },
  australia: { peakMonth: 'November', dangerSeason: 'October – January' }
};

export const BurningCalendar: React.FC<BurningCalendarProps> = ({ summary, selectedRegion, t, theme }) => {
  const isDark = theme === 'dark';
  const [activeDay, setActiveDay] = useState<CalendarDay | null>(
    summary.calendar.length > 0 ? summary.calendar[0] : null
  );

  const seasonInfo = REGION_SEASONS[selectedRegion] || REGION_SEASONS.global;

  const months = [
    { name: 'Jan', val: 20 },
    { name: 'Feb', val: 25 },
    { name: 'Mar', val: 30 },
    { name: 'Apr', val: 40 },
    { name: 'May', val: 50 },
    { name: 'Jun', val: 65 },
    { name: 'Jul', val: 85 },
    { name: 'Aug', val: 95 },
    { name: 'Sep', val: 100 },
    { name: 'Oct', val: 70 },
    { name: 'Nov', val: 40 },
    { name: 'Dec', val: 25 },
  ];

  const cardBg = isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200 shadow-sm';
  const innerCardBg = isDark ? 'bg-black border-zinc-800' : 'bg-slate-50 border-slate-200';
  const mainTextColor = isDark ? 'text-white' : 'text-slate-900';
  const subTextColor = isDark ? 'text-zinc-400' : 'text-slate-500';

  return (
    <div className="space-y-5 font-mono">
      {/* Seasonal Profile Header */}
      <div className={`border rounded-lg p-4 transition-colors ${cardBg}`}>
        <div className={`flex items-center space-x-2 text-sm font-bold mb-2 ${mainTextColor}`}>
          <Calendar className="w-4 h-4 text-orange-500" />
          <span>{t.calendar.bannerTitle}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs">
          <div className={`p-3 border rounded transition-colors ${innerCardBg}`}>
            <span className={`block text-[11px] ${subTextColor}`}>{t.calendar.peakMonthLabel}</span>
            <span className="text-orange-500 font-bold text-sm">{seasonInfo.peakMonth}</span>
          </div>
          <div className={`p-3 border rounded transition-colors ${innerCardBg}`}>
            <span className={`block text-[11px] ${subTextColor}`}>{t.calendar.dangerSeasonLabel}</span>
            <span className={`font-bold text-sm ${mainTextColor}`}>{seasonInfo.dangerSeason}</span>
          </div>
        </div>
      </div>

      {/* 12-Month Annual Distribution Matrix */}
      <div className={`border rounded-lg p-4 transition-colors ${cardBg}`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-bold ${mainTextColor}`}>{t.calendar.distributionTitle}</span>
          <span className="text-xs text-orange-500">{t.calendar.distributionHint}</span>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 text-center text-xs">
          {months.map((m) => {
            const isHot = m.val >= 70;
            return (
              <div
                key={m.name}
                className={`p-2.5 rounded border transition-all ${
                  isHot
                    ? 'bg-orange-500 text-white font-bold border-orange-400 shadow-sm'
                    : isDark
                    ? 'bg-black text-zinc-400 border-zinc-800'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <div>{m.name}</div>
                <div className="text-[10px] mt-1 opacity-90">{m.val}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7-Day Operational Matrix */}
      <div className={`border rounded-lg p-4 transition-colors ${cardBg}`}>
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
    </div>
  );
};
