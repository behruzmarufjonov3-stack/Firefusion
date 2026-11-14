# FireFusion 🛰️🔥
> **Harmonizing NASA MODIS and VIIRS Telemetry into Unified Active Fire Intelligence and Historical Climatology**
> 
> *NASA Space Apps Challenge 2026 Project Submission*

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Live Deployment:** [https://behruzmarufjonov3-stack.github.io/Firefusion/](https://behruzmarufjonov3-stack.github.io/Firefusion/)  
**Source Repository:** [https://github.com/behruzmarufjonov3-stack/Firefusion.git](https://github.com/behruzmarufjonov3-stack/Firefusion.git)  
**Data Sources:** NASA FIRMS Open Data (MODIS MCD14DL, VIIRS VNP14IMGTDL, VJ114IMGTDL, VJ214IMGTDL)

---

## 1. Executive Summary & The Problem

Earth observation satellites capture thousands of thermal hotspots daily. However, **fire intelligence has historically suffered from multi-satellite sensor fragmentation:**

For over two decades, NASA's **MODIS** (Terra and Aqua, 1 km pixel footprint at nadir) and **VIIRS** (Suomi-NPP, NOAA-20, and NOAA-21, 375 m pixel footprint) have collected fire observations across different spatial resolutions, optical channels, equatorial overpass times, and detection sensitivity thresholds.

Because raw detections from overlapping orbits cannot be directly aggregated without calibration:
1. **Emergency Responders** encounter duplicate alarms caused by multiple satellite passes detecting the same physical blaze within minutes or hours.
2. **Scientists & Land Managers** cannot construct continuous multi-decadal historical burning calendars without sensor bias (VIIRS detects ~3.2x–4.8x more active fire pixels than MODIS for identical fire regimes due to sub-pixel sensitivity).
3. **Decision Makers** lack a standardized metric to determine whether the current month's fire activity is normal or an anomalous extreme compared to multi-year climatology.

**FireFusion** addresses this challenge through:
- An open, reproducible **Geospatial-Temporal Harmonization Engine** that clusters multi-sensor hotspots into discrete physical fire events and calculates the **Fire Agreement Index (FAI)**.
- A multi-year **Burning Activity Calendar** (2012–2026) covering three critical global regions (Indonesia & Malaysia, Uzbekistan & Central Asia, and the Amazon Basin) that evaluates current burning against a 14-year monthly climatology baseline.

---

## 2. Harmonization Architecture & Sensor Characteristics

### Satellite Instruments & Datasets Used
- **MODIS C6.1 (`MCD14DL`):** Terra (10:30 AM/PM overpass) & Aqua (13:30 PM/AM overpass). 1,000 m nadir resolution. Continuous baseline since 2000.
- **VIIRS Suomi-NPP (`VNP14IMGTDL`):** 375 m I-band active fire product. 13:30 PM/AM overpass. Operational since 2012.
- **VIIRS NOAA-20 / JPSS-1 (`VJ114IMGTDL`):** 375 m I-band active fire product. Same orbit ~50 minutes separated from S-NPP. Operational since 2018.
- **VIIRS NOAA-21 / JPSS-2 (`VJ214IMGTDL`):** 375 m I-band active fire product. Operational since 2023.

```text
       ┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐
       │   MODIS (Terra/Aqua)   │      │  VIIRS NOAA-20 (J1)    │      │  VIIRS NOAA-21 (J2)    │
       │   1,000 m Footprint    │      │   375 m Footprint      │      │   375 m Footprint      │
       │   Confidence: 0-100%   │      │   Confidence: Low/Nom  │      │   Confidence: Low/Nom  │
       └───────────┬────────────┘      └───────────┬────────────┘      └───────────┬────────────┘
                   │                               │                               │
                   └───────────────────────┬───────┴───────────────────────────────┘
                                           │
                                           ▼
                      ┌──────────────────────────────────────────┐
                      │   FireFusion Harmonization Pipeline      │
                      │  - Normalized Confidence (0-100 Scale)   │
                      │  - Geodesic Clustering (Haversine Grid)  │
                      │  - Multi-Sensor Consensus Scoring (FAI)  │
                      │  - VIIRS-to-MODIS Sensor Calibration     │
                      └────────────────────┬─────────────────────┘
                                           │
                                           ▼
                      ┌──────────────────────────────────────────┐
                      │        Unified Harmonized Records        │
                      │  - Deduplicated Physical Fire Events     │
                      │  - Consensus FAI Score (25 to 100)       │
                      │  - Climatological Anomaly & Risk Tier    │
                      └────────────────────┬─────────────────────┘
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         ▼                                 ▼                                 ▼
┌─────────────────┐             ┌─────────────────────┐           ┌─────────────────────┐
│ Interactive     │             │ Multi-Year Burning  │           │ In-Browser CSV      │
│ Leaflet GIS Map │             │ Activity Calendar   │           │ Harmonizer Sandbox  │
└─────────────────┘             └─────────────────────┘           └─────────────────────┘
```

---

## 3. Core Metrics: Fire Agreement Index (FAI) & Climatology

### Fire Agreement Index (FAI)
The **Fire Agreement Index (FAI)** is an operational consensus score (0–100) reflecting multi-satellite observational agreement:

| FAI Score | Multi-Sensor Criteria | Operational Meaning |
| :---: | :--- | :--- |
| **100** | **MODIS + NOAA-20 + NOAA-21** | **Triple-Sensor Consensus:** Highest operational confidence; independently verified across both 1 km and 375 m instruments. |
| **90** | **MODIS + VIIRS (NOAA-20 or 21)** | **Cross-Platform Consensus:** Multi-resolution validation across MODIS and VIIRS platforms. |
| **75** | **NOAA-20 + NOAA-21 (Dual VIIRS)** | **Constellation Consensus:** Confirmed by both 375m VIIRS instruments within a single diurnal window. |
| **50** | **Single Sensor (High / Nominal)** | **Single Sensor Detection:** Standard detection without concurrent overpass validation. |
| **25** | **Single Sensor (Low Confidence)** | **Preliminary Alert:** Sub-pixel detection requiring additional operational verification. |

### Burning Activity Calendar & Climatological Risk
For any selected region, monthly records from 2012 to 2026 are evaluated against the 14-year baseline distribution (mean $\mu$, median $M$, 10th percentile $p_{10}$, and 90th percentile $p_{90}$):
- **Anomaly Percentage:** $\Delta = \frac{X_{\text{current}} - \mu}{\mu} \times 100\%$
- **Percentile Rank:** Percentage of historical years whose burning was below the current period.
- **Risk Tiers:**
  - `Low`: Below 10th percentile of historical baseline.
  - `Moderate`: 10th to 75th percentile (within normal seasonal range).
  - `High`: 75th to 90th percentile (significantly above historical average).
  - `Extreme`: $\ge 90\text{th}$ percentile (approaching or exceeding historical records).

### Atmospheric Telemetry & Fire Weather Index (Meteomatics Integration)
While satellite FRP confirms where fires are currently burning, atmospheric conditions determine flame front progression and fuel flammability:
- **2m Air Temperature (`t_2m:C`):** Ambient thermal conditions driving fuel pre-heating.
- **2m Relative Humidity (`relative_humidity_2m:p`):** Directly controls fine dead fuel moisture content ($RH > 80\%$ suppresses ignition; $RH < 30\%$ triggers red-flag flammability).
- **10m Wind Speed (`wind_speed_10m:ms`):** Dictates flame tilt angle, convective oxygen supply, and ember spotting range.
- **1h Precipitation (`precip_1h:mm`):** Surface rain suppression and canopy dampening.

FireFusion calculates a physical **Fire Weather Spread Risk Index (0–100)** and fuel moisture classification (`High`, `Moderate`, `Dry`, `Critical`).

#### Zero-Leak Security Architecture for Weather APIs:
- **Zero API Key Exposure:** No credentials, usernames, or passwords are hardcoded in source code, committed to Git, or exposed in public bundles.
- **Session-Only Memory Storage:** Evaluators and operators may enter Meteomatics credentials on-demand through the secure UI key modal. Credentials reside strictly in browser `sessionStorage` in client memory and are wiped when the tab closes.
- **Offline Meteorological Fallback:** Verified atmospheric station profiles are precomputed for all sample event clusters so the site operates seamlessly without requiring external credentials.

---

## 4. Reproducibility & Sensitivity Analysis

All statistics shown in FireFusion originate from automated scripts located in `/scripts/` that can be executed directly.

### Sensitivity Analysis for Spatial Clustering Buffer
Deduplication clusters proximate detections of the same fire event across multiple satellite overpasses. The resulting deduplication rate depends directly on the chosen spatial buffer threshold $R$ and temporal window:

| Spatial Buffer ($R$) | Raw Detections Tested | Harmonized Events | Deduplication Rate | Physical Basis & Characteristics |
| :---: | :---: | :---: | :---: | :--- |
| **750 m** | 266,462 | 140,222 | **47.4%** | Conservative nadir-only threshold. Minimal merging of off-nadir observations. |
| **1,500 m** *(Standard)* | 266,462 | 101,677 | **61.8%** | **Standard Recommended Buffer.** Matches 1 km MODIS footprint plus geo-referencing tolerance. |
| **3,000 m** | 266,462 | 82,283 | **69.1%** | Extended buffer accommodating MODIS scan-edge bow-tie pixel expansion (~2 km × 4.8 km). |

*Note: Deduplication reduces redundant duplicate records of the same physical fire; it is not a measure of false-alarm rejection.*

### How to Re-Run the Pipelines

#### 1. Reproduce 7-Day NRT Clustering & Sensitivity Analysis
```bash
# In Node.js environment
node scripts/reproduce_nrt_stats.cjs

# Or in Python environment
python scripts/reproduce_nrt_stats.py
```
*Outputs: `src/data/sample_events.ts` and `scripts/sensitivity_analysis.json`.*

#### 2. Reproduce Multi-Year Burning Calendar & Climatology
```bash
# In Node.js environment
node scripts/generate_historical_calendar.cjs

# Or in Python pipeline (with pandas / DuckDB)
python scripts/firms_pipeline.py
```
*Outputs: `src/data/historical_calendar.json` (< 300 KB static JSON consumed by frontend).*

---

## 5. Methodology & Limitations

### 1. Spatial Resolution Differences
- MODIS pixels are $1,000\text{ m} \times 1,000\text{ m}$ at nadir, expanding up to ~10x in area towards scan edge ($\pm 55^\circ$) due to Earth curvature and sensor optical projection (the "bow-tie" effect).
- VIIRS pixels are $375\text{ m} \times 375\text{ m}$ at nadir, with an on-board pixel aggregation scheme that limits pixel area growth to ~2x at scan edge ($\pm 56^\circ$).
- As a consequence, VIIRS detects significantly more small, fragmented active fire pixels than MODIS. Cross-calibration models this resolution difference using regional linear scaling factors ($\beta \approx 0.21 - 0.31$, $R^2 \approx 0.82 - 0.91$).

### 2. Overpass Timing & Cloud Obscuration
- Polar-orbiting satellites provide periodic snapshot observations (MODIS ~10:30/22:30 and ~13:30/01:30 local solar time; VIIRS ~13:30/01:30).
- Rapid fire spread or short-lived agricultural burns occurring between overpasses are not detected.
- Heavy cloud cover and thick smoke plumes can obscure thermal infrared signatures, temporarily reducing detection counts.

### 3. Metric Interpretation
- **FAI Consensus:** Measures agreement across independent satellite instruments; it does not measure burn severity or total consumed acreage.
- **Fire Radiative Power (FRP):** Measures instantaneous thermal radiation output in megawatts (MW). Peak FRP depends on fuel type, flame front geometry, and atmospheric attenuation.

---

## 6. Quickstart & Installation

### Prerequisites
- Node.js (v18, v20, or v24)
- npm or pnpm

### Local Development Setup
```bash
# Clone the repository
git clone https://github.com/behruzmarufjonov3-stack/Firefusion.git
cd Firefusion

# Install dependencies
npm install

# Start development server
npm run dev
```
Open `http://localhost:3000` in your browser.

### Production Build
```bash
npm run build
npm run preview
```

---

## 7. Attributions & Disclosures

### Open Data Attributions
- **NASA FIRMS** (Fire Information for Resource Management System):
  - MODIS MCD14DL Collection 6.1 Active Fire Product (Terra & Aqua).
  - VIIRS VNP14IMGTDL Active Fire 375m Product (Suomi-NPP).
  - VIIRS VJ114IMGTDL Active Fire 375m Product (NOAA-20 / JPSS-1).
  - VIIRS VJ214IMGTDL Active Fire 375m Product (NOAA-21 / JPSS-2).
- **Basemap:** Esri World Dark Gray & Light Gray Canvas.
- **Meteorology:** Meteomatics Weather API (2m Temperature, 10m Wind Speed, 2m Relative Humidity, 1h Precipitation).

### Artificial Intelligence (AI) Disclosure
In compliance with NASA Space Apps Challenge guidelines:
- **AI-Assisted Components:** AI language assistants were utilized for UI layout boilerplate, TypeScript typing scaffolding, and multilingual dictionary drafting (`en`, `uz`, `ru`, `es`, `fr`).
- **Team Verification:** All mathematical formulas, geospatial clustering algorithms, sensor calibration scaling factors, and FIRMS NRT data ingestion pipelines were engineered, validated, and tested by the team.

### Privacy Notice
FireFusion runs entirely client-side in the browser. Zero telemetry, cookies, or user identifiers are collected, stored, or transmitted to any remote servers.

---

## License
MIT License. Open Science & Open Source for NASA Space Apps Challenge 2026.
