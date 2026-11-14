export type SensorType = 'MODIS' | 'NOAA20' | 'NOAA21';

export type FAILevel = 100 | 90 | 75 | 50 | 25;

export type RiskCategory = 'Low' | 'Moderate' | 'High' | 'Extreme';

export interface WeatherTelemetry {
  temperature_c: number;
  wind_speed_ms: number;
  relative_humidity_pct: number;
  precipitation_1h_mm: number;
  spread_risk_score: number; // 0 to 100
  spread_risk_category: 'Low' | 'Moderate' | 'High' | 'Extreme';
  fuel_moisture_level: 'High' | 'Moderate' | 'Dry' | 'Critical';
  source: string;
}

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
  weather?: WeatherTelemetry;
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

export interface MonthlyRecord {
  year: number;
  month: number;
  month_name: string;
  raw_modis_count: number;
  raw_viirs_count: number;
  total_raw_count: number;
  calibrated_count: number;
  total_frp: number;
  avg_frp: number;
  relative_intensity: number; // 0.0 to 1.0 for heatmap coloring
}

export interface MonthlyClimatology {
  month: number;
  month_name: string;
  mean_count: number;
  median_count: number;
  p10_count: number;
  p25_count: number;
  p75_count: number;
  p90_count: number;
  min_count: number;
  max_count: number;
  mean_frp: number;
}

export interface RecordYearInfo {
  year: number;
  annual_calibrated_count: number;
  is_highest: boolean;
  note: string;
}

export interface CurrentPeriodStatus {
  period: string;
  month: number;
  year: number;
  raw_7day_detections: number;
  raw_7day_frp: number;
  month_projected_calibrated: number;
  baseline_mean: number;
  baseline_median: number;
  baseline_p90: number;
  anomaly_pct: number;
  percentile_rank: number;
  is_above_average: boolean;
  risk_category: RiskCategory;
}

export interface HistoricalRegionData {
  region_id: string;
  region_name: string;
  bounds: { minLat: number; maxLat: number; minLon: number; maxLon: number };
  peak_season: string;
  peak_month: string;
  calibration: {
    factor: number;
    r_squared: number;
    note: string;
  };
  current_status: CurrentPeriodStatus;
  record_years: RecordYearInfo[];
  climatology: MonthlyClimatology[];
  monthly_records: MonthlyRecord[];
}

export interface HistoricalCalendarData {
  metadata: {
    generated_at: string;
    version: string;
    description: string;
    sensors: Array<{ code: string; platform: string; sensor: string; resolution: string; period: string }>;
    calibration_methodology: string;
    risk_thresholds: Record<string, string>;
  };
  regions: Record<string, HistoricalRegionData>;
}
