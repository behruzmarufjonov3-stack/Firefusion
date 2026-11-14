import React from 'react';
import { Flame, Globe, Sun, Moon, Cpu } from 'lucide-react';
import { Language, Translations } from '../i18n/translations';

interface HeaderProps {
  t: Translations;
  lang: Language;
  onSelectLang: (lang: Language) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
  activeTab: 'map' | 'calendar' | 'harmonizer' | 'submission';
  setActiveTab: (tab: 'map' | 'calendar' | 'harmonizer' | 'submission') => void;
}

export const Header: React.FC<HeaderProps> = ({
  t,
  lang,
  onSelectLang,
  theme,
  onToggleTheme,
  selectedRegion,
  onSelectRegion,
  activeTab,
  setActiveTab,
}) => {
  const isDark = theme === 'dark';

  return (
    <header className={`border-b transition-colors sticky top-0 z-50 ${
      isDark ? 'border-zinc-800 bg-black' : 'border-slate-200 bg-white shadow-sm'
    }`}>
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Subtitle */}
        <div className="flex items-center space-x-2.5">
          <div className={`w-9 h-9 rounded-md flex items-center justify-center border transition-all ${
            isDark
              ? 'bg-orange-600/10 border-orange-500/40 text-orange-500'
              : 'bg-orange-50 border-orange-300 text-orange-600'
          }`}>
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-lg font-bold tracking-tight font-mono ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                FIRE<span className="text-orange-500">FUSION</span>
              </span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                isDark ? 'bg-zinc-900 text-zinc-400 border-zinc-800' : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                {t.nasaBadge}
              </span>
            </div>
            <p className={`text-[11px] hidden sm:block ${
              isDark ? 'text-zinc-400' : 'text-slate-500'
            }`}>
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Region & Language & Theme Controls */}
        <div className="flex items-center space-x-2">
          {/* Geographic Region Selector */}
          <div className="flex items-center space-x-1">
            <Globe className="w-4 h-4 text-orange-500 hidden md:block" />
            <select
              value={selectedRegion}
              onChange={(e) => onSelectRegion(e.target.value)}
              className={`text-xs font-mono rounded px-2.5 py-1.5 border focus:outline-none focus:border-orange-500 cursor-pointer ${
                isDark
                  ? 'bg-zinc-950 border-zinc-800 text-white'
                  : 'bg-white border-slate-300 text-slate-800'
              }`}
            >
              <option value="global">{t.regions.global}</option>
              <option value="amazon">{t.regions.amazon}</option>
              <option value="indonesia">{t.regions.indonesia}</option>
              <option value="central_asia">{t.regions.central_asia}</option>
              <option value="north_america">{t.regions.north_america}</option>
              <option value="australia">{t.regions.australia}</option>
            </select>
          </div>

          {/* Language Switcher */}
          <select
            value={lang}
            onChange={(e) => onSelectLang(e.target.value as Language)}
            className={`text-xs font-mono rounded px-2 py-1.5 border focus:outline-none focus:border-orange-500 cursor-pointer ${
              isDark
                ? 'bg-zinc-950 border-zinc-800 text-white'
                : 'bg-white border-slate-300 text-slate-800'
            }`}
          >
            <option value="en">English</option>
            <option value="uz">O‘zbekcha</option>
            <option value="ru">Русский</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>

          {/* Theme Toggle (Dark / Light) */}
          <button
            onClick={onToggleTheme}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className={`p-1.5 rounded-md border transition-all cursor-pointer ${
              isDark
                ? 'bg-zinc-900 border-zinc-800 text-orange-400 hover:text-white'
                : 'bg-slate-100 border-slate-300 text-orange-600 hover:text-black'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Formal Navigation Tabs */}
        <nav className="flex items-center space-x-1 font-mono text-xs">
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
              activeTab === 'map'
                ? 'bg-orange-500 text-white font-semibold shadow-sm'
                : isDark
                ? 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                : 'text-slate-600 hover:text-black hover:bg-slate-100'
            }`}
          >
            {t.nav.map}
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
              activeTab === 'calendar'
                ? 'bg-orange-500 text-white font-semibold shadow-sm'
                : isDark
                ? 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                : 'text-slate-600 hover:text-black hover:bg-slate-100'
            }`}
          >
            {t.nav.calendar}
          </button>

          <button
            onClick={() => setActiveTab('harmonizer')}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer flex items-center space-x-1 ${
              activeTab === 'harmonizer'
                ? 'bg-orange-500 text-white font-semibold shadow-sm'
                : isDark
                ? 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                : 'text-slate-600 hover:text-black hover:bg-slate-100'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>{t.nav.harmonizer}</span>
          </button>

          <button
            onClick={() => setActiveTab('submission')}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer border ${
              activeTab === 'submission'
                ? isDark ? 'bg-white text-black font-semibold border-white' : 'bg-slate-900 text-white font-semibold border-slate-900'
                : isDark ? 'text-zinc-300 hover:text-white hover:bg-zinc-900 border-zinc-800' : 'text-slate-700 hover:text-black hover:bg-slate-100 border-slate-300'
            }`}
          >
            {t.nav.submission}
          </button>
        </nav>
      </div>
    </header>
  );
};
