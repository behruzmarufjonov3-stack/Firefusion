import React, { useState } from 'react';
import { AnomalyItem } from '../types/fire';
import { AlertTriangle, X } from 'lucide-react';

interface AnomalyAlertsProps {
  anomalies: AnomalyItem[];
}

export const AnomalyAlerts: React.FC<AnomalyAlertsProps> = ({ anomalies }) => {
  const [dismissed, setDismissed] = useState(false);

  if (anomalies.length === 0 || dismissed) return null;

  const topAnomaly = anomalies[0];

  return (
    <div className="bg-space-900 border border-ember-500/50 rounded-lg p-3 px-4 flex items-center justify-between shadow-[0_0_15px_rgba(255,87,34,0.15)] font-mono text-xs">
      <div className="flex items-center space-x-3">
        <div className="w-7 h-7 rounded bg-ember-500/20 flex items-center justify-center text-ember-400">
          <AlertTriangle className="w-4 h-4 animate-bounce" />
        </div>
        <div>
          <span className="text-ember-400 font-bold uppercase tracking-wider mr-2">
            CRITICAL ANOMALY ALERT [{topAnomaly.type}]:
          </span>
          <span className="text-slate-200 font-sans">
            {topAnomaly.message}
          </span>
        </div>
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="text-slate-400 hover:text-white p-1 transition-colors"
        aria-label="Dismiss anomaly banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
