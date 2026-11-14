import { AnomalyItem, RiskCategory } from '../types/fire';

/**
 * Calculates Fire Risk Index (0-100)
 * Weighted formula:
 * - 40% Hotspot Cluster Density
 * - 35% Average Fire Radiative Power (FRP in MW)
 * - 25% Fire Agreement Index (FAI)
 */
export function calculateFireRiskIndex(
  hotspotCount: number,
  avgFrp: number,
  avgFai: number,
  maxExpectedHotspots: number = 2000
): { score: number; category: RiskCategory; colorClass: string } {
  const densityScore = Math.min(100, (hotspotCount / maxExpectedHotspots) * 100);
  const frpScore = Math.min(100, (avgFrp / 40) * 100);
  const rawScore = 0.4 * densityScore + 0.35 * frpScore + 0.25 * avgFai;
  const score = Math.min(100, Math.max(0, Math.round(rawScore)));

  let category: RiskCategory = 'Low';
  let colorClass = 'text-slate-400 border-slate-700';

  if (score > 75) {
    category = 'Extreme';
    colorClass = 'text-ember-500 border-ember-500';
  } else if (score > 50) {
    category = 'High';
    colorClass = 'text-orange-400 border-orange-500';
  } else if (score > 25) {
    category = 'Moderate';
    colorClass = 'text-slate-200 border-slate-600';
  }

  return { score, category, colorClass };
}

/**
 * Detects operational anomalies across time series and spatial events.
 */
export function detectAnomalies(
  eventsCount: number,
  previousEventsCount: number,
  maxFrp: number,
  avgFrp: number
): AnomalyItem[] {
  const list: AnomalyItem[] = [];

  if (maxFrp > 500) {
    list.push({
      type: 'EXTREME_FRP',
      message: `Extreme thermal signature detected (${maxFrp.toFixed(0)} MW FRP). Indicates severe crown wildfire behavior.`
    });
  }

  if (previousEventsCount > 0 && eventsCount > previousEventsCount * 1.5) {
    const pct = Math.round(((eventsCount - previousEventsCount) / previousEventsCount) * 100);
    list.push({
      type: 'RAPID_INCREASE',
      message: `Rapid surge alert: +${pct}% increase in active fire clusters within 24 hours.`
    });
  }

  if (eventsCount > 3000) {
    list.push({
      type: 'DENSE_CLUSTER',
      message: `Regional saturation alert: Over ${eventsCount.toLocaleString()} harmonized events active simultaneously.`
    });
  }

  return list;
}
