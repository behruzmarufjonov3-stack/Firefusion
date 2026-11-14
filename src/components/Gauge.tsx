import React from 'react';

interface GaugeProps {
  score: number;
  theme?: 'dark' | 'light';
}

export const Gauge: React.FC<GaugeProps> = ({ score, theme = 'dark' }) => {
  const isDark = theme === 'dark';
  const radius = 48;
  const circumference = Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="relative w-32 h-18 flex items-center justify-center overflow-hidden">
        <svg className="w-32 h-32" viewBox="0 0 130 130">
          {/* Background Semi-Circle Track */}
          <path
            d="M 17,65 A 48,48 0 0,1 113,65"
            fill="none"
            stroke={isDark ? '#182030' : '#E2E8F0'}
            strokeWidth="11"
            strokeLinecap="round"
          />
          {/* Active Orange Semi-Circle Arc */}
          <path
            d="M 17,65 A 48,48 0 0,1 113,65"
            fill="none"
            stroke="#FF5722"
            strokeWidth="11"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Score Number in Center */}
        <div className="absolute top-7 flex flex-col items-center">
          <span className={`text-2xl font-bold font-mono tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {score}
          </span>
        </div>
      </div>

      <div className="text-[11px] font-mono text-orange-500 mt-0.5 whitespace-nowrap">
        High Risk: <span className={`font-bold ${isDark ? 'text-zinc-200' : 'text-slate-700'}`}>{score}/100</span>
      </div>
    </div>
  );
};
