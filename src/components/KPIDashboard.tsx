import React from 'react';
import { RegionSummary } from '../types/fire';
import { Translations } from '../i18n/translations';
import { Flame, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface KPIDashboardProps {
  summary: RegionSummary;
  t: Translations;
  theme: 'dark' | 'light';
}

export const KPIDashboard: React.FC<KPIDashboardProps> = ({ summary, t, theme }) => {
  const isDark = theme === 'dark';

  const currentRisk = summary.calendar.length > 0
    ? summary.calendar[summary.calendar.length - 1].risk_index
    : 60;

  let riskCategoryText = t.kpi.riskLevels.low;
  if (currentRisk > 75) riskCategoryText = t.kpi.riskLevels.extreme;
  else if (currentRisk > 50) riskCategoryText = t.kpi.riskLevels.high;
  else if (currentRisk > 25) riskCategoryText = t.kpi.riskLevels.moderate;

  const cardBg = isDark
    ? 'bg-zinc-950 border-zinc-800'
    : 'bg-white border-slate-200 shadow-sm';

  const subTextColor = isDark ? 'text-zinc-400' : 'text-slate-500';
  const metaTextColor = isDark ? 'text-zinc-500' : 'text-slate-400';
  const mainTextColor = isDark ? 'text-white' : 'text-slate-900';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {/* Card 1: Harmonized Fire Count */}
      <div className={`border rounded-lg p-4 transition-colors ${cardBg}`}>
        <div className={`flex items-center justify-between text-xs mb-1 font-mono ${subTextColor}`}>
          <span>{t.kpi.trueFiresTitle}</span>
          <Flame className="w-4 h-4 text-orange-500" />
        </div>
        <div className={`text-2xl font-bold font-mono mt-1 ${mainTextColor}`}>
          {summary.total_harmonized_events.toLocaleString()}{' '}
          <span className={`text-xs font-normal ${subTextColor}`}>events</span>
        </div>
        <p className="text-xs text-orange-500 mt-2 font-mono font-medium">
          ✓ {summary.deduplication_rate_pct}% {t.kpi.trueFiresSubtitle}
        </p>
        <p className={`text-[11px] mt-0.5 ${metaTextColor}`}>
          ({summary.total_raw_detections.toLocaleString()} {t.kpi.rawSignificance})
        </p>
      </div>

      {/* Card 2: Risk Index */}
      <div className={`border rounded-lg p-4 transition-colors ${cardBg}`}>
        <div className={`flex items-center justify-between text-xs mb-1 font-mono ${subTextColor}`}>
          <span>{t.kpi.riskTitle}</span>
          <ShieldAlert className="w-4 h-4 text-orange-500" />
        </div>
        <div className="text-2xl font-bold text-orange-500 font-mono mt-1">
          {riskCategoryText}
        </div>
        <p className={`text-xs mt-2 font-mono ${mainTextColor}`}>
          {t.kpi.riskLevel}: <span className="font-bold">{currentRisk} / 100</span>
        </p>
        <p className={`text-[11px] mt-0.5 ${metaTextColor}`}>
          {t.kpi.riskFRP}: {summary.avg_frp} MW (peak: {summary.max_frp} MW)
        </p>
      </div>

      {/* Card 3: Fire Agreement Index (FAI) */}
      <div className={`border rounded-lg p-4 transition-colors ${cardBg}`}>
        <div className={`flex items-center justify-between text-xs mb-1 font-mono ${subTextColor}`}>
          <span>{t.kpi.faiTitle}</span>
          <CheckCircle2 className="w-4 h-4 text-orange-500" />
        </div>
        <div className={`text-2xl font-bold font-mono mt-1 ${mainTextColor}`}>
          {summary.avg_fai} / 100{' '}
          <span className={`text-xs font-normal ${subTextColor}`}>score</span>
        </div>
        <p className="text-xs text-orange-500 mt-2 font-mono font-medium">
          {t.kpi.faiSubtitle}
        </p>
        <p className={`text-[11px] mt-0.5 ${metaTextColor}`}>
          {summary.fai_distribution['100'].toLocaleString()} {t.kpi.tripleConfirmed}
        </p>
      </div>
    </div>
  );
};
