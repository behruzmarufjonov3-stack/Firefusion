import React from 'react';

interface ActivityHeatmapProps {
  theme?: 'dark' | 'light';
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ theme = 'dark' }) => {
  const isDark = theme === 'dark';
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'San'];
  const cols = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 16, 17, 18, 19, 20, 21, 22, 23, 24];

  // Mockup color mapping: light/dark gray on left, intense glowing orange on peak burning hours (16-24)
  const getCellColor = (col: number, rowIdx: number) => {
    if (col >= 16) {
      if (col >= 21) return 'bg-[#FF5722] shadow-[0_0_8px_rgba(255,87,34,0.45)]';
      if (col >= 18) return 'bg-[#F97316]';
      return 'bg-[#EA580C]';
    }
    if (col >= 11 && (rowIdx === 2 || rowIdx === 3 || rowIdx === 4)) {
      return isDark ? 'bg-[#9A3412]/80' : 'bg-orange-300';
    }
    if (col >= 8) {
      return isDark ? 'bg-[#283245]' : 'bg-slate-300';
    }
    return isDark ? 'bg-[#182030]' : 'bg-slate-200';
  };

  const textMuted = isDark ? 'text-zinc-500' : 'text-slate-400';
  const textSub = isDark ? 'text-zinc-400' : 'text-slate-600';
  const borderCol = isDark ? 'border-[#182030]' : 'border-slate-200';

  return (
    <div className="font-mono text-xs select-none">
      {/* Hours Column Header */}
      <div className={`flex items-center pl-8 pr-1 justify-between text-[10px] ${textMuted} mb-1.5`}>
        {cols.map((c) => (
          <span key={c} className="w-2.5 text-center">{c}</span>
        ))}
      </div>

      {/* Rows Grid */}
      <div className="space-y-1">
        {days.map((day, rIdx) => (
          <div key={day} className="flex items-center space-x-1.5">
            <span className={`w-7 text-[10px] ${textSub} font-mono text-right pr-1`}>
              {day}
            </span>
            <div className="flex-1 flex items-center justify-between">
              {cols.map((c) => (
                <div
                  key={c}
                  title={`${day} Hour ${c}:00`}
                  className={`w-2.5 h-2.5 rounded-[2px] transition-all cursor-pointer hover:scale-125 ${getCellColor(c, rIdx)}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend Footer */}
      <div className={`flex items-center justify-between text-[10px] ${textSub} mt-3 pt-2.5 border-t ${borderCol}`}>
        <span className={textMuted}>Deep Activity</span>
        <div className="flex items-center space-x-1">
          <span className={`w-2.5 h-2 rounded-[2px] ${isDark ? 'bg-[#182030]' : 'bg-slate-200'}`}></span>
          <span className={`w-2.5 h-2 rounded-[2px] ${isDark ? 'bg-[#283245]' : 'bg-slate-300'}`}></span>
          <span className={`w-2.5 h-2 rounded-[2px] ${isDark ? 'bg-[#9A3412]' : 'bg-orange-300'}`}></span>
          <span className="w-2.5 h-2 rounded-[2px] bg-[#EA580C]"></span>
          <span className="w-2.5 h-2 rounded-[2px] bg-[#FF5722]"></span>
        </div>
        <span className="text-orange-500 font-semibold">Bright</span>
      </div>
    </div>
  );
};
