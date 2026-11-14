import { FAILevel, HarmonizedFireEvent, SensorType } from '../types/fire';

export interface RawFireRecord {
  latitude: number;
  longitude: number;
  confidence: number | string;
  frp: number;
  brightness: number;
  acq_date: string;
  acq_time: string;
  satellite: string;
  sensor: SensorType;
}

/**
 * Normalizes confidence scores between MODIS (0-100 numeric)
 * and VIIRS ('low', 'nominal', 'high' categorical).
 */
export function normalizeConfidence(conf: number | string): number {
  if (typeof conf === 'number') return Math.max(0, Math.min(100, conf));
  const s = String(conf).trim().toLowerCase();
  if (!isNaN(Number(s))) return Math.max(0, Math.min(100, Number(s)));
  if (s.startsWith('h') || s === 'high') return 95;
  if (s.startsWith('n') || s === 'nominal') return 80;
  if (s.startsWith('l') || s === 'low') return 30;
  return 50;
}

/**
 * Calculates the Fire Agreement Index (FAI) according to the FireFusion Specification:
 * - 100: MODIS + NOAA-20 + NOAA-21 (All three sensor constellations agree)
 * - 90:  MODIS + VIIRS (MODIS + either NOAA-20 or NOAA-21)
 * - 75:  NOAA-20 + NOAA-21 (Both VIIRS sensor systems agree)
 * - 50:  Single Sensor (Confidence >= 50%)
 * - 25:  Low Confidence Detection (Single sensor, confidence < 50%)
 */
export function computeFAI(sources: Set<SensorType> | SensorType[], avgConfidence: number): FAILevel {
  const set = sources instanceof Set ? sources : new Set(sources);
  const hasModis = set.has('MODIS');
  const hasN20 = set.has('NOAA20');
  const hasN21 = set.has('NOAA21');

  if (hasModis && hasN20 && hasN21) return 100;
  if (hasModis && (hasN20 || hasN21)) return 90;
  if (hasN20 && hasN21) return 75;
  if (set.size === 1) {
    return avgConfidence >= 50 ? 50 : 25;
  }
  return 50;
}

/**
 * Dynamic in-browser Harmonization Engine:
 * Clusters arbitrary raw fire records by spatial proximity (~1.5 km) and date.
 */
export function harmonizeRawDetections(
  records: RawFireRecord[],
  gridDegrees: number = 0.015
): HarmonizedFireEvent[] {
  const clusters = new Map<string, {
    date: string;
    lats: number[];
    lons: number[];
    frps: number[];
    confs: number[];
    brightnesses: number[];
    times: string[];
    sources: Set<SensorType>;
  }>();

  for (const r of records) {
    const normConf = normalizeConfidence(r.confidence);
    const gLat = Math.round(r.latitude / gridDegrees) * gridDegrees;
    const gLon = Math.round(r.longitude / gridDegrees) * gridDegrees;
    const key = `${r.acq_date}_${gLat.toFixed(3)}_${gLon.toFixed(3)}`;

    if (!clusters.has(key)) {
      clusters.set(key, {
        date: r.acq_date,
        lats: [],
        lons: [],
        frps: [],
        confs: [],
        brightnesses: [],
        times: [],
        sources: new Set<SensorType>()
      });
    }

    const c = clusters.get(key)!;
    c.lats.push(r.latitude);
    c.lons.push(r.longitude);
    c.frps.push(r.frp || 0);
    c.confs.push(normConf);
    c.brightnesses.push(r.brightness || 300);
    c.times.push(r.acq_time || '12:00');
    c.sources.add(r.sensor);
  }

  let idx = 0;
  const events: HarmonizedFireEvent[] = [];

  for (const [, c] of clusters.entries()) {
    idx++;
    const avgLat = c.lats.reduce((a, b) => a + b, 0) / c.lats.length;
    const avgLon = c.lons.reduce((a, b) => a + b, 0) / c.lons.length;
    const maxFrp = c.frps.reduce((m, v) => (v > m ? v : m), 0);
    const avgFrp = c.frps.reduce((a, b) => a + b, 0) / c.frps.length;
    const avgConf = Math.round(c.confs.reduce((a, b) => a + b, 0) / c.confs.length);
    const maxBright = c.brightnesses.reduce((m, v) => (v > m ? v : m), 0);
    const fai = computeFAI(c.sources, avgConf);
    const earliestTime = c.times.sort()[0] || '00:00';

    events.push({
      id: `LIVE-${c.date.replace(/-/g, '')}-${String(idx).padStart(4, '0')}`,
      lat: Number(avgLat.toFixed(4)),
      lon: Number(avgLon.toFixed(4)),
      date: c.date,
      time: earliestTime,
      sources: Array.from(c.sources),
      sensor_count: c.sources.size,
      raw_detections: c.lats.length,
      confidence: avgConf,
      frp: Number(maxFrp.toFixed(1)),
      avg_frp: Number(avgFrp.toFixed(1)),
      brightness: Number(maxBright.toFixed(1)),
      fai,
      region: 'custom'
    });
  }

  return events;
}
