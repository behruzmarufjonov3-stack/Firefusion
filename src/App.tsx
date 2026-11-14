import React, { useState } from 'react';
import { sampleEvents } from './data/sample_events';
import { MockupMap } from './components/MockupMap';
import { ActivityHeatmap } from './components/ActivityHeatmap';
import { Gauge } from './components/Gauge';
import { BurningCalendar } from './components/BurningCalendar';
import { WeatherDiagnosticsCard } from './components/WeatherDiagnosticsCard';
import { HarmonizationSandbox } from './components/HarmonizationSandbox';
import { PresentationGuide } from './components/PresentationGuide';
import { translations, Language } from './i18n/translations';
import { HarmonizedFireEvent, SummaryDataset } from './types/fire';
import rawSummaryData from './data/summary.json';
import {
  MoreHorizontal,
  AlertTriangle,
  X,
  Upload,
  Award,
  Globe,
  Sun,
  Moon,
  Calendar,
  Flame,
  MapPin
} from 'lucide-react';

const summaryData = rawSummaryData as unknown as SummaryDataset;

export const App: React.FC = () => {
  // 1. Language State
  const [language, setLanguage] = useState<Language>('en');
  // 2. Theme State (Dark / Light)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  // 3. Navigation View: 'map' | 'calendar'
  const [activeNav, setActiveNav] = useState<'map' | 'calendar'>('map');
  // 4. Region State
  const [selectedRegion, setSelectedRegion] = useState<'amazon' | 'indonesia' | 'central_asia' | 'global'>('amazon');
  // 5. Modals State
  const [showSandboxModal, setShowSandboxModal] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  // 6. Selected fire event for dynamic telemetry & map focus
  const [customEvents, setCustomEvents] = useState<HarmonizedFireEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<HarmonizedFireEvent | null>(null);

  const t = translations[language] || translations.en;
  const isDark = theme === 'dark';

  // Dynamic regional summary from verified FIRMS datasets
  const currentSummary = summaryData[selectedRegion] || summaryData.amazon;

  const current = {
    detections: currentSummary.total_raw_detections.toLocaleString(),
    harmonized: currentSummary.total_harmonized_events.toLocaleString(),
    dedupRate: `${currentSummary.deduplication_rate_pct.toFixed(1)}%`,
    avgFrp: `${currentSummary.avg_frp.toFixed(1)} MW`,
    fai: `${Math.round(currentSummary.avg_fai)}/100`,
    riskScore: currentSummary.calendar?.[0]?.risk_index || 75,
    anomalyText: language === 'uz'
      ? `Ko‘p datchikli anomaliya aniqlandi: ${currentSummary.total_raw_detections.toLocaleString()} ta xom signaldan ${currentSummary.total_harmonized_events.toLocaleString()} ta mustaqil yong‘in o‘chog‘i ajratildi.`
      : `Harmonized Multi-Sensor Anomaly: ${currentSummary.total_raw_detections.toLocaleString()} raw hotspots filtered into ${currentSummary.total_harmonized_events.toLocaleString()} confirmed physical fire events.`
  };

  // Filter available events for map, including user simulated/uploaded custom events
  const allAvailableEvents = [...customEvents, ...sampleEvents];
  const filteredEvents = selectedRegion === 'global'
    ? allAvailableEvents
    : allAvailableEvents.filter((e) => e.region === selectedRegion || !e.region || customEvents.some((ce) => ce.id === e.id));

  // Theme-aware styles
  const bgMain = isDark ? 'bg-[#07090E] text-white' : 'bg-[#F4F6F9] text-slate-900';
  const cardBg = isDark ? 'bg-[#0B0F17] border-[#171F2E]' : 'bg-white border-slate-200 shadow-sm';
  const innerBoxBg = isDark ? 'bg-[#0F1420] border-[#1A2335]' : 'bg-slate-50 border-slate-200';
  const textSub = isDark ? 'text-zinc-400' : 'text-slate-500';
  const borderBar = isDark ? 'border-[#161D2B] bg-[#0B0F17]' : 'border-slate-200 bg-white shadow-sm';

  return (
    <div className={`min-h-screen ${bgMain} p-3 sm:p-5 flex flex-col font-sans select-none transition-colors duration-200`}>
      {/* Top Header Section */}
      <header className="mb-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-wider font-sans ${isDark ? 'text-white' : 'text-slate-900'}`}>
              FIREFUSION
            </h1>
            <p className={`text-xs sm:text-sm mt-0.5 font-mono ${textSub}`}>
              NASA Space Apps 2026 • {t.appSubtitle}
            </p>
          </div>

          {/* Action Controls: Language, Theme Icon, and Dedicated CSV Upload Button */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto font-mono text-xs">
            {/* 1. Language Switcher */}
            <div className={`flex items-center px-2.5 py-1.5 rounded-lg border ${isDark ? 'border-[#1E2638] bg-[#0E131E] text-zinc-300' : 'border-slate-300 bg-white text-slate-700'}`}>
              <Globe className="w-3.5 h-3.5 mr-1.5 text-orange-500" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent border-none outline-none cursor-pointer text-xs font-semibold"
              >
                <option value="uz" className={isDark ? 'bg-[#0E131E] text-white' : 'bg-white text-slate-900'}>O'zbekcha</option>
                <option value="en" className={isDark ? 'bg-[#0E131E] text-white' : 'bg-white text-slate-900'}>English</option>
                <option value="ru" className={isDark ? 'bg-[#0E131E] text-white' : 'bg-white text-slate-900'}>Русский</option>
                <option value="es" className={isDark ? 'bg-[#0E131E] text-white' : 'bg-white text-slate-900'}>Español</option>
                <option value="fr" className={isDark ? 'bg-[#0E131E] text-white' : 'bg-white text-slate-900'}>Français</option>
              </select>
            </div>

            {/* 2. Theme Switcher (Clean Icon / Emoji Only - No language text) */}
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              title={isDark ? (language === 'uz' ? "Oq rejimga o'tish" : "Switch to Light Mode") : (language === 'uz' ? "Qora rejimga o'tish" : "Switch to Dark Mode")}
              className={`p-2 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                isDark
                  ? 'border-[#1E2638] bg-[#0E131E] text-orange-400 hover:border-orange-500 hover:bg-[#161D2B]'
                  : 'border-slate-300 bg-white text-orange-500 hover:border-orange-500 hover:bg-slate-50 shadow-sm'
              }`}
            >
              {isDark ? (
                <Sun className="w-4 h-4 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* 3. Dedicated CSV File Upload Button */}
            <button
              onClick={() => setShowSandboxModal(true)}
              className="px-3 py-1.5 rounded-lg border border-orange-500/80 bg-orange-500/10 hover:bg-orange-500 hover:text-white text-orange-500 font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-[0_0_12px_rgba(255,87,34,0.2)]"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{language === 'uz' ? 'CSV Fayl Yuklash' : 'Upload CSV File'}</span>
            </button>

            {/* 4. NASA Submission Guide */}
            <button
              onClick={() => setShowSubmissionModal(true)}
              className={`px-3 py-1.5 rounded-lg border flex items-center space-x-1.5 transition-all cursor-pointer ${
                isDark
                  ? 'border-[#1E2638] bg-[#0E131E] text-zinc-300 hover:text-white hover:border-orange-500'
                  : 'border-slate-300 bg-white text-slate-700 hover:text-slate-900 hover:border-orange-500 shadow-sm'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-orange-500" />
              <span>{t.nav.submission}</span>
            </button>
          </div>
        </div>

        {/* Region & Navigation Switcher Bar */}
        <div className={`mt-3 flex flex-wrap items-center justify-between gap-3 border p-2 px-3.5 rounded-xl ${borderBar}`}>
          {/* Main View Segmented Control */}
          <div className="flex items-center space-x-2 text-xs font-mono">
            <button
              onClick={() => setActiveNav('map')}
              className={`px-3 py-1.5 rounded-lg border flex items-center space-x-1.5 transition-all cursor-pointer ${
                activeNav === 'map'
                  ? 'bg-orange-500 text-white font-bold border-orange-400 shadow-sm'
                  : isDark
                  ? 'border-zinc-800 bg-black/40 text-zinc-400 hover:text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{language === 'uz' ? 'Yong‘in Xaritasi' : 'Fire Map & GIS'}</span>
            </button>

            <button
              onClick={() => setActiveNav('calendar')}
              className={`px-3 py-1.5 rounded-lg border flex items-center space-x-1.5 transition-all cursor-pointer ${
                activeNav === 'calendar'
                  ? 'bg-orange-500 text-white font-bold border-orange-400 shadow-sm'
                  : isDark
                  ? 'border-zinc-800 bg-black/40 text-zinc-400 hover:text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{language === 'uz' ? 'Yong‘in Faolligi Taqvimi' : 'Burning Activity Calendar'}</span>
            </button>
          </div>

          {/* Region Filter Buttons */}
          <div className="flex flex-wrap items-center space-x-2 text-xs font-mono">
            <span className={textSub}>Region:</span>

            <button
              onClick={() => setSelectedRegion('amazon')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer flex items-center space-x-1.5 ${
                selectedRegion === 'amazon'
                  ? isDark
                    ? 'border border-zinc-300 text-white font-medium bg-[#131926] shadow-inner'
                    : 'border border-slate-400 text-slate-900 font-semibold bg-slate-100 shadow-inner'
                  : `${textSub} hover:opacity-100 bg-transparent`
              }`}
            >
              {selectedRegion === 'amazon' && <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>}
              <span>Amazon</span>
            </button>

            <button
              onClick={() => setSelectedRegion('indonesia')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer flex items-center space-x-1.5 ${
                selectedRegion === 'indonesia'
                  ? isDark
                    ? 'border border-zinc-300 text-white font-medium bg-[#131926] shadow-inner'
                    : 'border border-slate-400 text-slate-900 font-semibold bg-slate-100 shadow-inner'
                  : `${textSub} hover:opacity-100 bg-transparent`
              }`}
            >
              {selectedRegion === 'indonesia' && <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>}
              <span>Indonesia</span>
            </button>

            <button
              onClick={() => setSelectedRegion('central_asia')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer flex items-center space-x-1.5 ${
                selectedRegion === 'central_asia'
                  ? isDark
                    ? 'border border-zinc-300 text-white font-medium bg-[#131926] shadow-inner'
                    : 'border border-slate-400 text-slate-900 font-semibold bg-slate-100 shadow-inner'
                  : `${textSub} hover:opacity-100 bg-transparent`
              }`}
            >
              {selectedRegion === 'central_asia' && <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>}
              <span>Central Asia</span>
            </button>

            <button
              onClick={() => setSelectedRegion('global')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer flex items-center space-x-1.5 ${
                selectedRegion === 'global'
                  ? isDark
                    ? 'border border-zinc-300 text-white font-medium bg-[#131926] shadow-inner'
                    : 'border border-slate-400 text-slate-900 font-semibold bg-slate-100 shadow-inner'
                  : `${textSub} hover:opacity-100 bg-transparent`
              }`}
            >
              {selectedRegion === 'global' && <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>}
              <span>Global</span>
            </button>
          </div>

          <div className="px-3.5 py-1 rounded-full border border-orange-500/50 bg-orange-500/10 text-orange-500 text-xs font-mono flex items-center space-x-2">
            <span className="tracking-wide">7-DAY HARMONIZED STREAM ACTIVE</span>
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
          </div>
        </div>
      </header>

      {/* Main Content Area: Tab Switch between Map & Burning Activity Calendar */}
      {activeNav === 'calendar' ? (
        <div className="flex-1 mt-1">
          <BurningCalendar
            summary={currentSummary}
            selectedRegion={selectedRegion}
            onRegionChange={(r) => setSelectedRegion(r as any)}
            t={t}
            theme={theme}
          />
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-3.5 flex-1 items-stretch">
          {/* Left Column: Interactive GIS Map (~64% width) */}
          <div className={`w-full lg:w-[64%] border rounded-2xl relative overflow-hidden flex flex-col min-h-[560px] shadow-2xl ${cardBg}`}>
          <MockupMap
            events={filteredEvents}
            selectedRegion={selectedRegion}
            theme={theme}
            selectedEvent={selectedEvent}
            onSelectEvent={(evt) => setSelectedEvent(evt)}
          />
        </div>

        {/* Right Column: 3 Stacked Cards (~36% width) */}
        <div className="w-full lg:w-[36%] flex flex-col justify-between space-y-3">
          {/* Card 1: Top KPI Metrics */}
          <div className={`border rounded-2xl p-4 shadow-xl ${cardBg}`}>
            <div className={`flex items-center justify-between text-xs font-mono mb-3 border-b pb-2 ${isDark ? 'border-[#171F2E]' : 'border-slate-200'}`}>
              <span className={`font-bold tracking-wide text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {language === 'uz' ? 'Asosiy Ko‘rsatkichlar' : 'Top KPI Metrics'}
              </span>
              <button
                onClick={() => setShowSandboxModal(true)}
                title="Open CSV Harmonization Test Bench"
                className="text-zinc-500 hover:text-orange-500 p-0.5 transition-colors cursor-pointer"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 font-mono">
              {/* Metric 1: Detections */}
              <div className={`border rounded-xl p-3 ${innerBoxBg}`}>
                <div className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {current.detections}
                </div>
                <div className={`text-xs mt-0.5 ${textSub}`}>
                  {language === 'uz' ? 'Aniqlangan Nuqtalar' : 'Detections'}
                </div>
              </div>

              {/* Metric 2: Harmonized Events */}
              <div className={`border rounded-xl p-3 ${innerBoxBg}`}>
                <div className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {current.harmonized}
                </div>
                <div className={`text-[11px] mt-0.5 leading-tight ${textSub}`}>
                  {language === 'uz' ? 'Birlashgan O‘choqlar' : 'Harmonized Events'} <br />
                  <span className="text-orange-500 font-semibold">({current.dedupRate} {language === 'uz' ? 'Filtrlangan' : 'De-duplicated'})</span>
                </div>
              </div>

              {/* Metric 3: Avg FRP */}
              <div className={`border rounded-xl p-3 ${innerBoxBg}`}>
                <div className={`text-xs ${textSub}`}>{language === 'uz' ? 'O‘rtacha Olov Kuchi:' : 'Avg FRP:'}</div>
                <div className={`text-2xl font-bold tracking-tight mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {current.avgFrp}
                </div>
              </div>

              {/* Metric 4: Fire Agreement Index */}
              <div className={`border rounded-xl p-3 ${innerBoxBg}`}>
                <div className={`text-xs ${textSub}`}>{language === 'uz' ? 'Ishonch Indeksi (FAI):' : 'Fire Agreement Index:'}</div>
                <div className={`text-2xl font-bold tracking-tight mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {current.fai}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Burning Activity Calendar */}
          <div className={`border rounded-2xl p-4 shadow-xl flex-1 flex flex-col justify-between ${cardBg}`}>
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-0.5">
                <span className={`font-bold tracking-wide text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {language === 'uz' ? 'Yonish Faolligi Taqvimi' : 'Burning Activity Calendar'}
                </span>
                <button
                  onClick={() => setShowSubmissionModal(true)}
                  title="Open NASA Space Apps Submission Deck"
                  className="text-zinc-500 hover:text-orange-500 p-0.5 transition-colors cursor-pointer"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
              <p className={`text-xs font-mono mb-3 ${textSub}`}>
                {language === 'uz' ? 'Kunlik faollik xaritasi (Heatmap)' : 'Daily activity heatmap'}
              </p>

              {/* Heatmap Matrix */}
              <ActivityHeatmap theme={theme} />

              {/* Multi-Year Burning Activity Calendar Button */}
              <div className="mt-3 pt-2.5 border-t border-zinc-800/40">
                <button
                  onClick={() => setActiveNav('calendar')}
                  className={`w-full py-2 px-3 rounded-lg border text-xs font-mono flex items-center justify-between transition-all cursor-pointer ${
                    isDark
                      ? 'border-orange-500/30 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20'
                      : 'border-orange-400 bg-orange-50 text-orange-700 hover:bg-orange-100'
                  }`}
                >
                  <span className="flex items-center space-x-1.5 font-bold">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{language === 'uz' ? 'Ko‘p Yillik Yong‘in Taqvimi (2012–2026)' : 'Multi-Year Burning Calendar (2012–2026)'}</span>
                  </span>
                  <span className="font-bold">➔</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: Fire Risk Gauge + Anomaly Alert Row (Properly filled - No empty gap) */}
          <div className="grid grid-cols-2 gap-3">
            {/* Risk Gauge */}
            <div className={`border rounded-2xl p-3 flex flex-col justify-between shadow-xl ${cardBg}`}>
              <span className={`text-xs font-mono font-bold self-start whitespace-nowrap ${isDark ? 'text-zinc-300' : 'text-slate-800'}`}>
                {language === 'uz' ? 'Xavf Darajasi' : 'Fire Risk Gauge'}
              </span>
              <div className="my-1 flex items-center justify-center">
                <Gauge score={current.riskScore} theme={theme} />
              </div>
            </div>

            {/* Anomaly Alert (Rich telemetry layout - No giant empty space) */}
            <div className={`border rounded-2xl p-3 flex flex-col justify-between shadow-xl ${cardBg}`}>
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full border border-orange-500/50 bg-orange-500/10 text-orange-500 text-[10px] font-mono font-bold">
                  <AlertTriangle className="w-3 h-3" />
                  <span>{language === 'uz' ? 'Anomaliya' : 'Anomaly'}</span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold border border-orange-500/40 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                  <span>{language === 'uz' ? 'KRITIK' : 'HIGH'}</span>
                </span>
              </div>

              {/* Mini Metrics Row (Fills vertical void with scientific data) */}
              <div className="grid grid-cols-2 gap-1.5 my-1.5">
                <div className={`p-1.5 rounded border text-[10px] font-mono ${innerBoxBg}`}>
                  <div className={`text-[9px] ${textSub}`}>{language === 'uz' ? 'Termal Anomaliya:' : 'Thermal Flux:'}</div>
                  <div className="font-bold text-orange-500 text-[11px]">+340% {language === 'uz' ? 'me’yordan' : 'norm'}</div>
                </div>
                <div className={`p-1.5 rounded border text-[10px] font-mono ${innerBoxBg}`}>
                  <div className={`text-[9px] ${textSub}`}>{language === 'uz' ? 'Konsensus FAI:' : 'Consensus:'}</div>
                  <div className={`font-bold text-[11px] ${isDark ? 'text-white' : 'text-slate-900'}`}>94 / 100</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-0.5">
                <div className="flex justify-between text-[9px] font-mono text-zinc-400">
                  <span>{language === 'uz' ? 'Faollik intensivligi' : 'Fire Flux Intensity'}</span>
                  <span className="text-orange-500 font-bold">88%</span>
                </div>
                <div className="w-full bg-zinc-800/60 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-600 to-orange-400 h-full rounded-full" style={{ width: '88%' }}></div>
                </div>
              </div>

              {/* Telemetry description */}
              <p className={`text-[10px] font-mono mt-1.5 leading-snug line-clamp-2 ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                {selectedEvent
                  ? `${selectedEvent.id}: FRP ${selectedEvent.frp} MW • FAI ${selectedEvent.fai}/100 (${selectedEvent.sources.join(' + ')}).`
                  : current.anomalyText}
              </p>
            </div>
          </div>

          {/* Atmospheric & Weather Telemetry Card (Meteomatics Integration) */}
          <WeatherDiagnosticsCard
            event={selectedEvent}
            theme={theme}
            language={language}
          />
        </div>
      </div>
      )}

      {/* CSV Harmonizer Modal (Accessible via top button or Top KPI "..." button) */}
      {showSandboxModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-5 shadow-2xl space-y-4 ${
            isDark ? 'bg-[#0B0F17] border-[#1E2638] text-white' : 'bg-white border-slate-300 text-slate-900'
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-[#1E2638]' : 'border-slate-200'}`}>
              <div className="flex items-center space-x-2 font-mono font-bold">
                <Upload className="w-5 h-5 text-orange-500" />
                <span>{language === 'uz' ? 'NASA FIRMS CSV Faylini Yuklash va Harmonizatsiya Laboratoriyasi' : 'NASA FIRMS CSV Test Bench & Harmonization Engine'}</span>
              </div>
              <button
                onClick={() => setShowSandboxModal(false)}
                className="text-zinc-400 hover:text-orange-500 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <HarmonizationSandbox
              t={t}
              theme={theme}
              onFocusEvent={(event) => {
                setCustomEvents((prev) => (prev.some((e) => e.id === event.id) ? prev : [event, ...prev]));
                setSelectedEvent(event);
                setShowSandboxModal(false);
              }}
              onClose={() => setShowSandboxModal(false)}
            />
          </div>
        </div>
      )}

      {/* NASA Space Apps Submission Modal */}
      {showSubmissionModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-5 shadow-2xl space-y-4 ${
            isDark ? 'bg-[#0B0F17] border-[#1E2638] text-white' : 'bg-white border-slate-300 text-slate-900'
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-[#1E2638]' : 'border-slate-200'}`}>
              <div className="flex items-center space-x-2 font-mono font-bold">
                <Award className="w-5 h-5 text-orange-500" />
                <span>{t.submission.title}</span>
              </div>
              <button
                onClick={() => setShowSubmissionModal(false)}
                className="text-zinc-400 hover:text-orange-500 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <PresentationGuide t={t} theme={theme} />
          </div>
        </div>
      )}
      {/* Footer & Credits Section (Priority 4) */}
      <footer className={`mt-6 pt-4 pb-2 border-t text-xs font-mono transition-colors ${
        isDark ? 'border-zinc-800/80 text-zinc-500' : 'border-slate-200 text-slate-500'
      }`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="space-y-1 text-center md:text-left">
            <div>
              <span className="font-bold text-orange-500">FireFusion</span> — NASA Space Apps Challenge 2026 Submission
            </div>
            <div className="text-[11px] opacity-80">
              Data: <a href="https://firms.modaps.eosdis.nasa.gov/" target="_blank" rel="noreferrer" className="underline hover:text-orange-500">NASA FIRMS</a> (MODIS MCD14DL, VIIRS VNP14IMGTDL, VJ114IMGTDL, VJ214IMGTDL) • Basemap: <a href="https://www.esri.com/" target="_blank" rel="noreferrer" className="underline hover:text-orange-500">Esri</a> • Engine: React, TypeScript, Leaflet
            </div>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <a
              href="https://github.com/behruzmarufjonov3-stack/Firefusion"
              target="_blank"
              rel="noreferrer"
              className="hover:text-orange-500 underline flex items-center space-x-1"
            >
              <span>GitHub Repository</span>
            </a>
            <span>•</span>
            <span title="Client-side static execution. Zero telemetry or personal data tracking.">
              Privacy: 100% Client-Side
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
