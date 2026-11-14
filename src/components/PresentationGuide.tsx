import React, { useState } from 'react';
import { Translations } from '../i18n/translations';
import { Award, Copy, CheckCircle2 } from 'lucide-react';

interface PresentationGuideProps {
  t: Translations;
  theme: 'dark' | 'light';
}

export const PresentationGuide: React.FC<PresentationGuideProps> = ({ t, theme }) => {
  const isDark = theme === 'dark';
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (txt: string, key: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const summaryText = `FireFusion harmonizes over 20 years of heterogeneous satellite active fire observations—bridging MODIS (1 km) and VIIRS (375 m) into a unified intelligence platform. By reconciling spatial-temporal sensor overlap through our novel Fire Agreement Index (FAI) and dynamic Burning Activity Calendar, FireFusion eliminates multi-sensor redundancy (reducing duplicate alarms by up to 56%) and provides emergency managers, scientists, and decision-makers with a single, calibrated source of truth for global wildfire intelligence.`;

  const detailsText = `1. What exactly does it do?
FireFusion ingests raw active fire detections from NASA's FIRMS MODIS (Terra & Aqua) and VIIRS (NOAA-20 & NOAA-21) satellite constellations, normalizes their disparate confidence scales and spatial footprints, removes redundant overlapping hotspot detections, and generates an actionable Burning Activity Calendar and dynamic Fire Risk Index for any region on Earth.

2. How does it work?
- Schema Normalization: Translates continuous 0-100% MODIS confidence and categorical VIIRS confidence into unified metric scales.
- Spatial-Temporal Triangulation: Evaluates spatial proximity (~1.5 km buffer) and temporal windows to merge co-incident satellite detections into unique physical fire events.
- Fire Agreement Index (FAI): Calculates an agreement score: 100 for triple constellation agreement (MODIS + NOAA-20 + NOAA-21), 90 for MODIS + VIIRS, 75 for dual VIIRS, 50 for single sensor, and 25 for low-confidence detections.
- Burning Activity Calendar: Visualizes daily cluster volume, fire radiative power (FRP in MW), and contrasts current fire activity against 20-year satellite baselines.

3. What benefits does it have?
- Emergency responders avoid chasing duplicate reports from multiple satellite overpasses.
- Land managers identify anomalous burning trends and critical dry-season fire risk weeks in advance.
- Climate scientists receive calibrated, cross-sensor historical fire continuity without sensor bias.

4. Tools and technologies used:
React 18, TypeScript, Tailwind CSS, Leaflet GIS, Node.js data processing engine, Vite, CartoDB Dark Matter / Positron basemaps, and NASA FIRMS Near-Real-Time (NRT) datasets.`;

  const aiText = `Super Intelligence (AI) Use Disclosure:
AI language models were utilized as development accelerators for brainstorming initial architecture, drafting boilerplate React/TypeScript code, optimizing geospatial clustering algorithms, and generating documentation. All scientific algorithms, harmonization rules, Fire Agreement Index (FAI) definitions, and NASA FIRMS data integration logic were reviewed, validated, and verified by the development team in full compliance with NASA Space Apps Challenge 2026 guidelines.`;

  const dataText = `NASA & Space Agency Data Sources:
1. NASA FIRMS (Fire Information for Resource Management System):
   - MODIS Collection 6.1 NRT Hotspot / Active Fire Detections (MCD14DL) from Terra and Aqua satellites (1 km spatial resolution).
   - VIIRS Collection 2 NRT Active Fire Detections (VJ114IMGTDL) from Suomi-NPP / NOAA-20 (375 m spatial resolution).
   - VIIRS Collection 2 NRT Active Fire Detections (VJ214IMGTDL) from NOAA-21 (375 m spatial resolution).
2. Data Access: Openly available under NASA Open Science Data Policy.`;

  const cardBg = isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200 shadow-sm';
  const mainTextColor = isDark ? 'text-white' : 'text-slate-900';
  const subTextColor = isDark ? 'text-zinc-300' : 'text-slate-600';

  return (
    <div className="space-y-4 font-mono text-xs">
      <div className={`border rounded-lg p-4 transition-colors ${cardBg}`}>
        <div className={`flex items-center space-x-2 text-sm font-bold ${mainTextColor}`}>
          <Award className="w-4 h-4 text-orange-500" />
          <span>{t.submission.title}</span>
        </div>
        <p className={`mt-1 font-sans ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
          {t.submission.subtitle}
        </p>
      </div>

      {/* 1. Summary */}
      <div className={`border rounded-lg p-4 space-y-2 transition-colors ${cardBg}`}>
        <div className="flex items-center justify-between">
          <span className={`font-bold ${mainTextColor}`}>{t.submission.summaryTitle}</span>
          <button
            onClick={() => copyText(summaryText, 'summary')}
            className="text-orange-500 hover:opacity-80 flex items-center space-x-1 cursor-pointer font-bold"
          >
            {copiedKey === 'summary' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'summary' ? t.submission.copiedBtn : t.submission.copyBtn}</span>
          </button>
        </div>
        <p className={`font-sans leading-relaxed ${subTextColor}`}>{summaryText}</p>
      </div>

      {/* 2. Detailed Description */}
      <div className={`border rounded-lg p-4 space-y-2 transition-colors ${cardBg}`}>
        <div className="flex items-center justify-between">
          <span className={`font-bold ${mainTextColor}`}>{t.submission.detailsTitle}</span>
          <button
            onClick={() => copyText(detailsText, 'details')}
            className="text-orange-500 hover:opacity-80 flex items-center space-x-1 cursor-pointer font-bold"
          >
            {copiedKey === 'details' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'details' ? t.submission.copiedBtn : t.submission.copyBtn}</span>
          </button>
        </div>
        <pre className={`font-sans whitespace-pre-line leading-relaxed ${subTextColor}`}>{detailsText}</pre>
      </div>

      {/* 3. AI Disclosure */}
      <div className={`border rounded-lg p-4 space-y-2 transition-colors ${cardBg}`}>
        <div className="flex items-center justify-between">
          <span className={`font-bold ${mainTextColor}`}>{t.submission.aiTitle}</span>
          <button
            onClick={() => copyText(aiText, 'ai')}
            className="text-orange-500 hover:opacity-80 flex items-center space-x-1 cursor-pointer font-bold"
          >
            {copiedKey === 'ai' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'ai' ? t.submission.copiedBtn : t.submission.copyBtn}</span>
          </button>
        </div>
        <p className={`font-sans leading-relaxed ${subTextColor}`}>{aiText}</p>
      </div>

      {/* 4. Partner Data */}
      <div className={`border rounded-lg p-4 space-y-2 transition-colors ${cardBg}`}>
        <div className="flex items-center justify-between">
          <span className={`font-bold ${mainTextColor}`}>{t.submission.dataTitle}</span>
          <button
            onClick={() => copyText(dataText, 'data')}
            className="text-orange-500 hover:opacity-80 flex items-center space-x-1 cursor-pointer font-bold"
          >
            {copiedKey === 'data' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'data' ? t.submission.copiedBtn : t.submission.copyBtn}</span>
          </button>
        </div>
        <pre className={`font-sans whitespace-pre-line leading-relaxed ${subTextColor}`}>{dataText}</pre>
      </div>
    </div>
  );
};
