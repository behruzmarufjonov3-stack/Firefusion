export type SensorType = 'MODIS' | 'NOAA20' | 'NOAA21';

export type FAILevel = 100 | 90 | 75 | 50 | 25;

export type RiskCategory = 'Low' | 'Moderate' | 'High' | 'Extreme';

export interface HarmonizedFireEvent {
  id: string;
  lat: number;
  lon: number;
  date: string;
  time: string;
  sources: SensorType[];
  sensor_count: number;
  raw_detections: number;
  confidence: number;
  frp: number;
  avg_frp: number;
  brightness: number;
  fai: FAILevel;
  region: string;
}

export interface AnomalyItem {
  type: 'EXTREME_FRP' | 'DENSE_CLUSTER' | 'RAPID_INCREASE';
  message: string;
}

export interface CalendarDay {
  date: string;
  raw_detections: number;
  harmonized_events: number;
  sensor_breakdown: {
    modis: number;
    noaa20: number;
    noaa21: number;
  };
  avg_frp: number;
  max_frp: number;
  avg_fai: number;
  avg_confidence: number;
  risk_index: number;
  risk_category: RiskCategory;
  anomalies: AnomalyItem[];
}

export interface RegionSummary {
  region_name: string;
  total_raw_detections: number;
  total_harmonized_events: number;
  deduplication_rate_pct: number;
  avg_frp: number;
  max_frp: number;
  avg_confidence: number;
  avg_fai: number;
  fai_distribution: {
    '25': number;
    '50': number;
    '75': number;
    '90': number;
    '100': number;
  };
  sensor_contributions: {
    modis: number;
    noaa20: number;
    noaa21: number;
  };
  calendar: CalendarDay[];
}

export type SummaryDataset = Record<string, RegionSummary>;
