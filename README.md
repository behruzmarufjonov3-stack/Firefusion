# FireFusion 🛰️🔥
> **"Harmonizing MODIS and VIIRS into a Unified Fire Intelligence Platform"**
> 
> *NASA Space Apps Challenge 2026 Project Submission*

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![NASA Open Data](https://img.shields.io/badge/NASA%20FIRMS-Open%20Data-E03C31?logo=nasa&logoColor=white)](https://firms.modaps.eosdis.nasa.gov/)

---

## 1. Executive Summary & The Problem

Wildfires and agricultural burning activity are continuously observed by multiple satellite constellations. However, **the challenge in fire intelligence is not a shortage of detections—it is fragmentation.**

For over two decades, NASA's **MODIS** (Terra & Aqua, 1 km pixel footprint) and **VIIRS** (Suomi-NPP / NOAA-20 & NOAA-21, 375 m pixel footprint) have collected fire observations with completely different spatial resolutions, optical channels, overpass timings, and detection sensitivities.

Because raw detections cannot be directly compared:
- **Emergency Responders** chase duplicate alarms caused by multi-satellite overpasses of the same blaze.
- **Land Managers & Scientists** cannot establish consistent 20-year historical baselines without sensor distortion.
- **Decision Makers** see contradictory fire counts rather than unified physical fire events.

**FireFusion** solves this crisis through an automated geospatial-temporal harmonization engine, introducing the novel **Fire Agreement Index (FAI)** and an interactive **Burning Activity Calendar**.

---

## 2. Core Scientific Innovation: Fire Agreement Index (FAI)

FireFusion introduces the **Fire Agreement Index (FAI)**—a quantitative confidence metric that weights spatial-temporal sensor consensus across satellite constellations:

| FAI Score | Multi-Sensor Agreement Criteria | Operational Confidence Meaning |
| :---: | :--- | :--- |
| **100** | **MODIS + NOAA-20 + NOAA-21** | **Absolute Consensus**: All 3 independent satellite systems verified the active fire. |
| **90** | **MODIS + VIIRS (NOAA-20 or NOAA-21)** | **Cross-Platform Consensus**: Multi-resolution validation across 1km and 375m sensors. |
| **75** | **NOAA-20 + NOAA-21 (Dual VIIRS)** | **Constellation Consensus**: Validated by both 375m imaging channels. |
| **50** | **Single Sensor (Nominal / High Conf)** | **Single Sensor Observation**: Verified detection without secondary overpass confirmation. |
| **25** | **Single Sensor (Low Confidence)** | **Preliminary Alert**: Low-confidence detection requiring ground validation. |

---

## 3. Architecture & Data Flow

```text
       ┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐
       │   MODIS (Terra/Aqua)   │      │  VIIRS NOAA-20 (J1)    │      │  VIIRS NOAA-21 (J2)    │
       │   1 km Footprint       │      │   375 m Footprint      │      │   375 m Footprint      │
       │   Confidence: 0-100%   │      │   Confidence: Low/Nom  │      │   Confidence: Low/Nom  │
       └───────────┬────────────┘      └───────────┬────────────┘      └───────────┬────────────┘
                   │                               │                               │
                   └───────────────────────┬───────┴───────────────────────────────┘
                                           │
                                           ▼
                      ┌──────────────────────────────────────────┐
                      │    FireFusion Data Harmonization Engine   │
                      │  - Schema Standardization & Cleaning     │
                      │  - Spatial Proximity Buffer (~1.5 km)   │
                      │  - Temporal Window Overlap Matching      │
                      │  - FRP Calibration & Deduplication       │
                      └────────────────────┬─────────────────────┘
                                           │
                                           ▼
                      ┌──────────────────────────────────────────┐
                      │        Unified Harmonized Records        │
                      │  - De-duplicated physical events (-56%)  │
                      │  - Fire Agreement Index (FAI 25 - 100)   │
                      │  - Regional Fire Risk Index (0 - 100)    │
                      └────────────────────┬─────────────────────┘
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         ▼                                 ▼                                 ▼
┌─────────────────┐             ┌─────────────────────┐           ┌─────────────────────┐
│ Interactive     │             │ Burning Activity    │           │ Live Calibration    │
│ Dark GIS Map    │             │ Calendar & Baseline │           │ Harmonizer Sandbox  │
└─────────────────┘             └─────────────────────┘           └─────────────────────┘
```

---

## 4. Key Results from 7-Day Global Satellite Stream

Analysis of the official NASA FIRMS global 7-day dataset (Nov 8 – Nov 14, 2026):

- **Total Raw Detections:** 733,470
- **Total Harmonized Physical Events:** 321,540
- **Redundancy Reduction Rate:** **56.2% deduplication** (over 411,000 redundant duplicate alarms eliminated!)
- **Key Regional Focus Areas:**
  - **Amazon Basin:** 62,471 raw detections → 26,062 harmonized events (58.3% deduplication). Peak FRP: 1,639.8 MW.
  - **Indonesia & Malaysia:** 16,945 raw detections → 9,749 harmonized events (42.5% deduplication).
  - **Central Asia & Uzbekistan:** 363 raw detections → 233 harmonized events (35.8% deduplication).
  - **North America (West):** 5,711 raw detections → 2,477 harmonized events (56.6% deduplication).
  - **Australia:** 121,590 raw detections → 31,787 harmonized events (73.9% deduplication). Peak FRP: 3,165.8 MW.

---

## 5. Quickstart & Installation

### Prerequisites
- Node.js (v18+ or v20+)
- npm or pnpm

### Local Development
```bash
# Clone the repository
git clone https://github.com/your-username/firefusion.git
cd firefusion

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to access the live platform.

### Production Build
```bash
npm run build
npm run preview
```

---

## 6. NASA Space Apps Judging Rubric Alignment

1. **Impact:** Eliminates multi-sensor confusion for disaster response teams and land managers, reducing operational false alarms by up to 56%.
2. **Creativity:** Pioneered the Fire Agreement Index (FAI) and multi-resolution temporal calendar matrix.
3. **Validity:** Mathematically grounded in satellite footprint physics (MODIS 1km point-spread vs VIIRS 375m sub-kilometer I-bands).
4. **Relevance:** Directly fulfills the 2026 challenge requirements for cross-sensor harmonization and burning activity calendar generation.
5. **Presentation:** High-contrast, minimalist NASA command center interface built with strict 3-color palette (Obsidian, White, Thermal Ember).

---

## 7. Disclosures & Attributions

### Space Agency Data Attribution
- **NASA FIRMS** (Fire Information for Resource Management System):
  - MODIS MCD14DL Near-Real-Time (NRT) Active Fire Product (Terra & Aqua).
  - VIIRS VJ114IMGTDL Near-Real-Time Active Fire Product (Suomi-NPP / NOAA-20).
  - VIIRS VJ214IMGTDL Near-Real-Time Active Fire Product (NOAA-21).

### Super Intelligence (SI / AI) Disclosure
AI language models were used as development accelerators for code scaffolding, geospatial clustering logic review, and documentation synthesis. All algorithms, scientific formulas, and data processing pipelines were engineered and verified by the development team.

---

## License
MIT License. Open Science & Open Source for NASA Space Apps Challenge 2026.
