import { HarmonizedFireEvent } from '../types/fire';

export const sampleEvents: HarmonizedFireEvent[] = [
  // ==================== INDONESIA (Exact visual match to target mockup) ====================
  // Central & South Kalimantan (Dense glowing cluster inside concentric rings)
  {"id":"HF-IDN-K01","lat":-2.25,"lon":113.82,"date":"2026-11-12","time":"04:30","sources":["MODIS","NOAA20","NOAA21"],"sensor_count":3,"raw_detections":68,"confidence":99,"frp":960.0,"avg_frp":64.0,"brightness":374.0,"fai":100,"region":"indonesia"},
  {"id":"HF-IDN-K02","lat":-2.42,"lon":113.58,"date":"2026-11-12","time":"04:30","sources":["MODIS","NOAA20","NOAA21"],"sensor_count":3,"raw_detections":62,"confidence":98,"frp":910.0,"avg_frp":61.0,"brightness":372.5,"fai":100,"region":"indonesia"},
  {"id":"HF-IDN-K03","lat":-2.12,"lon":114.15,"date":"2026-11-12","time":"04:30","sources":["MODIS","NOAA20","NOAA21"],"sensor_count":3,"raw_detections":55,"confidence":97,"frp":850.0,"avg_frp":56.0,"brightness":370.0,"fai":100,"region":"indonesia"},
  {"id":"HF-IDN-K04","lat":-1.88,"lon":113.45,"date":"2026-11-12","time":"04:30","sources":["MODIS","NOAA20","NOAA21"],"sensor_count":3,"raw_detections":48,"confidence":95,"frp":780.0,"avg_frp":50.0,"brightness":368.5,"fai":100,"region":"indonesia"},
  {"id":"HF-IDN-K05","lat":-2.68,"lon":113.92,"date":"2026-11-13","time":"05:15","sources":["MODIS","NOAA20","NOAA21"],"sensor_count":3,"raw_detections":51,"confidence":96,"frp":810.0,"avg_frp":53.0,"brightness":371.0,"fai":100,"region":"indonesia"},
  {"id":"HF-IDN-K06","lat":-2.52,"lon":114.28,"date":"2026-11-13","time":"05:15","sources":["MODIS","NOAA20"],"sensor_count":2,"raw_detections":38,"confidence":91,"frp":620.0,"avg_frp":41.0,"brightness":363.0,"fai":90,"region":"indonesia"},
  {"id":"HF-IDN-K07","lat":-1.65,"lon":113.15,"date":"2026-11-13","time":"05:15","sources":["NOAA20","NOAA21"],"sensor_count":2,"raw_detections":30,"confidence":88,"frp":510.0,"avg_frp":36.0,"brightness":359.0,"fai":75,"region":"indonesia"},
  {"id":"HF-IDN-K08","lat":-2.85,"lon":113.65,"date":"2026-11-14","time":"04:45","sources":["MODIS","NOAA20","NOAA21"],"sensor_count":3,"raw_detections":45,"confidence":95,"frp":730.0,"avg_frp":47.0,"brightness":367.0,"fai":100,"region":"indonesia"},
  {"id":"HF-IDN-K09","lat":-1.95,"lon":114.05,"date":"2026-11-14","time":"04:45","sources":["MODIS","NOAA21"],"sensor_count":2,"raw_detections":28,"confidence":89,"frp":480.0,"avg_frp":34.0,"brightness":357.0,"fai":90,"region":"indonesia"},
  {"id":"HF-IDN-K10","lat":-0.35,"lon":116.85,"date":"2026-11-14","time":"04:45","sources":["MODIS","NOAA20","NOAA21"],"sensor_count":3,"raw_detections":42,"confidence":93,"frp":650.0,"avg_frp":43.0,"brightness":365.0,"fai":100,"region":"indonesia"},
  {"id":"HF-IDN-K11","lat":-1.18,"lon":116.58,"date":"2026-11-14","time":"04:45","sources":["NOAA20"],"sensor_count":1,"raw_detections":16,"confidence":76,"frp":290.0,"avg_frp":23.0,"brightness":346.0,"fai":50,"region":"indonesia"},
  {"id":"HF-IDN-K12","lat":-0.75,"lon":111.45,"date":"2026-11-14","time":"04:45","sources":["MODIS","NOAA20"],"sensor_count":2,"raw_detections":25,"confidence":88,"frp":430.0,"avg_frp":31.0,"brightness":355.0,"fai":90,"region":"indonesia"},

  // Sumatra Spine Clusters (Scattered natural hotspot trail)
  {"id":"HF-IDN-S01","lat":0.65,"lon":99.85,"date":"2026-11-11","time":"06:10","sources":["MODIS","NOAA20"],"sensor_count":2,"raw_detections":24,"confidence":87,"frp":410.0,"avg_frp":30.0,"brightness":354.0,"fai":90,"region":"indonesia"},
  {"id":"HF-IDN-S02","lat":0.15,"lon":100.45,"date":"2026-11-11","time":"06:10","sources":["MODIS","NOAA20","NOAA21"],"sensor_count":3,"raw_detections":39,"confidence":94,"frp":630.0,"avg_frp":43.0,"brightness":366.0,"fai":100,"region":"indonesia"},
  {"id":"HF-IDN-S03","lat":-0.55,"lon":101.20,"date":"2026-11-11","time":"06:10","sources":["MODIS","NOAA20","NOAA21"],"sensor_count":3,"raw_detections":46,"confidence":96,"frp":740.0,"avg_frp":48.0,"brightness":369.0,"fai":100,"region":"indonesia"},
  {"id":"HF-IDN-S04","lat":-1.15,"lon":101.95,"date":"2026-11-12","time":"05:50","sources":["MODIS","NOAA20","NOAA21"],"sensor_count":3,"raw_detections":53,"confidence":97,"frp":830.0,"avg_frp":54.0,"brightness":371.0,"fai":100,"region":"indonesia"},
  {"id":"HF-IDN-S05","lat":-1.85,"lon":102.75,"date":"2026-11-12","time":"05:50","sources":["MODIS","NOAA20","NOAA21"],"sensor_count":3,"raw_detections":59,"confidence":98,"frp":890.0,"avg_frp":58.0,"brightness":373.0,"fai":100,"region":"indonesia"},
  {"id":"HF-IDN-S06","lat":-2.45,"lon":103.45,"date":"2026-11-12","time":"05:50","sources":["MODIS","NOAA20","NOAA21"],"sensor_count":3,"raw_detections":64,"confidence":99,"frp":940.0,"avg_frp":61.0,"brightness":374.0,"fai":100,"region":"indonesia"},
  {"id":"HF-IDN-S07","lat":-3.15,"lon":104.15,"date":"2026-11-13","time":"06:00","sources":["MODIS","NOAA20","NOAA21"],"sensor_count":3,"raw_detections":51,"confidence":96,"frp":810.0,"avg_frp":51.0,"brightness":370.0,"fai":100,"region":"indonesia"},
  {"id":"HF-IDN-S08","lat":-3.85,"lon":104.85,"date":"2026-11-13","time":"06:00","sources":["MODIS","NOAA20"],"sensor_count":2,"raw_detections":34,"confidence":91,"frp":580.0,"avg_frp":39.0,"brightness":362.0,"fai":90,"region":"indonesia"},
  {"id":"HF-IDN-S09","lat":-4.65,"lon":105.35,"date":"2026-11-13","time":"06:00","sources":["MODIS","NOAA20","NOAA21"],"sensor_count":3,"raw_detections":44,"confidence":95,"frp":700.0,"avg_frp":45.0,"brightness":368.0,"fai":100,"region":"indonesia"},
  {"id":"HF-IDN-S10","lat":-5.15,"lon":105.65,"date":"2026-11-14","time":"05:40","sources":["NOAA20","NOAA21"],"sensor_count":2,"raw_detections":26,"confidence":87,"frp":450.0,"avg_frp":32.0,"brightness":356.0,"fai":75,"region":"indonesia"},

  // Java & Eastern Arc (Java, Bali, Timor)
  {"id":"HF-IDN-J01","lat":-6.85,"lon":107.55,"date":"2026-11-12","time":"05:30","sources":["MODIS","NOAA20"],"sensor_count":2,"raw_detections":23,"confidence":89,"frp":390.0,"avg_frp":29.0,"brightness":354.0,"fai":90,"region":"indonesia"},
  {"id":"HF-IDN-J02","lat":-7.35,"lon":109.95,"date":"2026-11-12","time":"05:30","sources":["MODIS","NOAA20","NOAA21"],"sensor_count":3,"raw_detections":37,"confidence":94,"frp":570.0,"avg_frp":38.0,"brightness":363.0,"fai":100,"region":"indonesia"},
  {"id":"HF-IDN-J03","lat":-7.85,"lon":112.65,"date":"2026-11-13","time":"05:20","sources":["MODIS","NOAA20","NOAA21"],"sensor_count":3,"raw_detections":42,"confidence":95,"frp":660.0,"avg_frp":42.0,"brightness":366.0,"fai":100,"region":"indonesia"},
  {"id":"HF-IDN-E01","lat":-8.55,"lon":120.45,"date":"2026-11-13","time":"05:10","sources":["MODIS","NOAA20","NOAA21"],"sensor_count":3,"raw_detections":33,"confidence":92,"frp":520.0,"avg_frp":35.0,"brightness":360.0,"fai":100,"region":"indonesia"},
  {"id":"HF-IDN-E02","lat":-9.75,"lon":124.45,"date":"2026-11-14","time":"05:00","sources":["MODIS","NOAA20","NOAA21"],"sensor_count":3,"raw_detections":39,"confidence":94,"frp":610.0,"avg_frp":40.0,"brightness":364.0,"fai":100,"region":"indonesia"},

  // Sulawesi & Maluku
  {"id":"HF-IDN-M01","lat":-2.45,"lon":121.25,"date":"2026-11-12","time":"04:40","sources":["MODIS","NOAA20","NOAA21"],"sensor_count":3,"raw_detections":35,"confidence":93,"frp":540.0,"avg_frp":36.0,"brightness":361.0,"fai":100,"region":"indonesia"},
  {"id":"HF-IDN-M02","lat":-3.55,"lon":120.15,"date":"2026-11-12","time":"04:40","sources":["MODIS","NOAA20"],"sensor_count":2,"raw_detections":25,"confidence":88,"frp":410.0,"avg_frp":30.0,"brightness":354.0,"fai":90,"region":"indonesia"},
  {"id":"HF-IDN-M03","lat":-3.45,"lon":128.25,"date":"2026-11-13","time":"04:20","sources":["NOAA20","NOAA21"],"sensor_count":2,"raw_detections":19,"confidence":85,"frp":340.0,"avg_frp":26.0,"brightness":349.0,"fai":75,"region":"indonesia"},

  // ==================== AMAZON BASIN CLUSTERS ====================
  {"id":"HF-AMZ-001","lat":-3.52,"lon":-55.12,"date":"2026-11-12","time":"13:45","sources":["MODIS","NOAA20","NOAA21"],"sensor_count":3,"raw_detections":42,"confidence":96,"frp":640.5,"avg_frp":42.5,"brightness":368.1,"fai":100,"region":"amazon"},
  {"id":"HF-AMZ-002","lat":-3.75,"lon":-55.35,"date":"2026-11-12","time":"13:45","sources":["MODIS","NOAA20","NOAA21"],"sensor_count":3,"raw_detections":38,"confidence":94,"frp":580.2,"avg_frp":38.2,"brightness":367.0,"fai":100,"region":"amazon"},
  {"id":"HF-AMZ-003","lat":-4.10,"lon":-55.80,"date":"2026-11-12","time":"14:10","sources":["MODIS","NOAA20"],"sensor_count":2,"raw_detections":25,"confidence":88,"frp":420.0,"avg_frp":32.1,"brightness":358.4,"fai":90,"region":"amazon"},
  {"id":"HF-AMZ-004","lat":-2.90,"lon":-54.60,"date":"2026-11-13","time":"13:30","sources":["NOAA20","NOAA21"],"sensor_count":2,"raw_detections":19,"confidence":85,"frp":310.4,"avg_frp":28.0,"brightness":352.0,"fai":75,"region":"amazon"},
  {"id":"HF-AMZ-005","lat":-5.20,"lon":-56.40,"date":"2026-11-13","time":"14:20","sources":["MODIS","NOAA20","NOAA21"],"sensor_count":3,"raw_detections":51,"confidence":98,"frp":780.0,"avg_frp":55.0,"brightness":372.5,"fai":100,"region":"amazon"},
  {"id":"HF-AMZ-006","lat":-6.10,"lon":-54.90,"date":"2026-11-14","time":"13:50","sources":["MODIS","NOAA21"],"sensor_count":2,"raw_detections":22,"confidence":89,"frp":390.6,"avg_frp":31.4,"brightness":360.2,"fai":90,"region":"amazon"}
];
