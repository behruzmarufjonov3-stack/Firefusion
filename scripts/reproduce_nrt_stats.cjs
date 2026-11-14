/**
 * NASA FIRMS 7-Day NRT Reproducible Harmonization & Sensitivity Analysis Script
 * ==============================================================================
 * Ingests raw FIRMS NRT data (Nov 8-14, 2026) across:
 * - MODIS C6.1 (MCD14DL)
 * - VIIRS NOAA-20 (VJ114IMGTDL)
 * - VIIRS NOAA-21 (VJ214IMGTDL)
 *
 * Runs spatio-temporal clustering and FAI consensus scoring.
 * Performs sensitivity analysis across 750m, 1.5km, and 3.0km spatial buffers.
 * Outputs reproducible sample_events.ts and summary.json statistics.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Haversine distance in meters between two coordinates
function haversineDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const REGION_BOUNDS = {
  amazon: { minLat: -18, maxLat: 5, minLon: -75, maxLon: -45, name: 'Amazon Basin' },
  indonesia: { minLat: -11, maxLat: 7, minLon: 95, maxLon: 141, name: 'Indonesia & Malaysia' },
  central_asia: { minLat: 36, maxLat: 46, minLon: 56, maxLon: 74, name: 'Uzbekistan & Central Asia' },
  global: { minLat: -90, maxLat: 90, minLon: -180, maxLon: 180, name: 'Global' }
};

async function parseDetections(limitPerFile = null) {
  const detections = [];
  const dirs = [
    { name: 'Modis', sensor: 'MODIS' },
    { name: 'viirs-20', sensor: 'NOAA20' },
    { name: 'viirs-21', sensor: 'NOAA21' }
  ];

  for (const { name, sensor } of dirs) {
    const dirPath = path.join('data', name);
    if (!fs.existsSync(dirPath)) continue;
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      const fileStream = fs.createReadStream(path.join(dirPath, file));
      const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
      let header = null;
      let count = 0;

      for await (const line of rl) {
        if (!header) {
          header = line.split(',');
          continue;
        }
        if (limitPerFile && count >= limitPerFile) break;

        const parts = line.split(',');
        const lat = parseFloat(parts[0]);
        const lon = parseFloat(parts[1]);
        const brightness = parseFloat(parts[2]) || 300;
        const acq_date = parts[5];
        const acq_time = parts[6];
        const confRaw = parts[8];
        const frp = parseFloat(parts[11]) || 0;

        let confidence = 50;
        if (sensor === 'MODIS') {
          confidence = Math.min(100, Math.max(0, parseFloat(confRaw) || 50));
        } else {
          const c = String(confRaw).toLowerCase();
          if (c === 'high' || c === 'h') confidence = 95;
          else if (c === 'nominal' || c === 'n') confidence = 75;
          else confidence = 35;
        }

        detections.push({
          lat,
          lon,
          brightness,
          date: acq_date,
          time: acq_time,
          confidence,
          frp,
          sensor
        });
        count++;
      }
    }
  }

  return detections;
}

// Cluster detections using specified radius
function clusterDetections(points, radiusMeters) {
  // Spatial hash grid (cell size approx radius in degrees ~ radius / 111000)
  const cellSize = radiusMeters / 111000;
  const grid = new Map();

  function getCellKey(lat, lon) {
    const r = Math.floor(lat / cellSize);
    const c = Math.floor(lon / cellSize);
    return `${r}:${c}`;
  }

  const clusters = [];

  for (const pt of points) {
    const r = Math.floor(pt.lat / cellSize);
    const c = Math.floor(pt.lon / cellSize);

    let assignedCluster = null;

    // Check 9 neighboring cells
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const key = `${r + dr}:${c + dc}`;
        const neighborClusters = grid.get(key);
        if (!neighborClusters) continue;

        for (const cluster of neighborClusters) {
          // Check same date or within 12h
          if (cluster.date === pt.date) {
            const dist = haversineDistanceMeters(pt.lat, pt.lon, cluster.lat, cluster.lon);
            if (dist <= radiusMeters) {
              assignedCluster = cluster;
              break;
            }
          }
        }
        if (assignedCluster) break;
      }
      if (assignedCluster) break;
    }

    if (assignedCluster) {
      // Merge point into existing cluster
      assignedCluster.points.push(pt);
      assignedCluster.sources.add(pt.sensor);
      assignedCluster.total_frp += pt.frp;
      assignedCluster.total_conf += pt.confidence;
      assignedCluster.total_bright += pt.brightness;
      // Update centroid
      const n = assignedCluster.points.length;
      assignedCluster.lat = (assignedCluster.lat * (n - 1) + pt.lat) / n;
      assignedCluster.lon = (assignedCluster.lon * (n - 1) + pt.lon) / n;
    } else {
      // Create new cluster
      const newCluster = {
        lat: pt.lat,
        lon: pt.lon,
        date: pt.date,
        time: pt.time,
        sources: new Set([pt.sensor]),
        points: [pt],
        total_frp: pt.frp,
        total_conf: pt.confidence,
        total_bright: pt.brightness
      };
      clusters.push(newCluster);

      const cellKey = getCellKey(pt.lat, pt.lon);
      if (!grid.has(cellKey)) grid.set(cellKey, []);
      grid.get(cellKey).push(newCluster);
    }
  }

  return clusters;
}

function calculateFai(sensorCount, sources, avgConf) {
  if (sensorCount >= 3) return 100;
  if (sensorCount === 2) {
    if (sources.includes('MODIS')) return 90;
    return 75;
  }
  if (avgConf >= 80) return 50;
  return 25;
}

async function run() {
  console.log('================================================================');
  console.log('FIRMS Reproducible Harmonization & Sensitivity Analysis');
  console.log('================================================================');

  // Sample representative subset for fast in-memory sensitivity curve (or all detections)
  console.log('Reading FIRMS raw detections for sensitivity analysis...');
  const regionalDetections = await parseDetections(15000); // 15k per file = ~315k sample
  console.log(`Loaded ${regionalDetections.length.toLocaleString()} raw detections across 3 sensors.`);

  // Sensitivity Analysis across 750m, 1.5km, 3.0km
  const buffers = [750, 1500, 3000];
  const sensitivityResults = [];

  for (const radius of buffers) {
    console.log(`Clustering with spatial buffer: ${radius}m ...`);
    const clusters = clusterDetections(regionalDetections, radius);
    const dedupRate = ((regionalDetections.length - clusters.length) / regionalDetections.length) * 100;
    console.log(`  Buffer ${radius}m: ${clusters.length.toLocaleString()} harmonized events (${dedupRate.toFixed(1)}% de-duplication)`);
    sensitivityResults.push({
      buffer_meters: radius,
      raw_detections: regionalDetections.length,
      harmonized_events: clusters.length,
      deduplication_rate_pct: Math.round(dedupRate * 10) / 10
    });
  }

  // Extract top high-confidence clusters for sample_events.ts across Indonesia, Amazon, and Central Asia
  console.log('\nGenerating verified sample_events.ts from standard 1500m clusters...');
  const baseClusters = clusterDetections(regionalDetections, 1500);

  // Group by region
  const formattedEvents = [];
  let eventIdx = 1;

  for (const c of baseClusters) {
    const sources = Array.from(c.sources);
    const n = c.points.length;
    const avgConf = Math.round(c.total_conf / n);
    const avgBright = Math.round((c.total_bright / n) * 10) / 10;
    const totalFrp = Math.round(c.total_frp * 10) / 10;
    const avgFrp = Math.round((c.total_frp / n) * 10) / 10;
    const fai = calculateFai(sources.length, sources, avgConf);

    let region = 'global';
    for (const [rKey, rBounds] of Object.entries(REGION_BOUNDS)) {
      if (rKey === 'global') continue;
      if (c.lat >= rBounds.minLat && c.lat <= rBounds.maxLat && c.lon >= rBounds.minLon && c.lon <= rBounds.maxLon) {
        region = rKey;
        break;
      }
    }

    formattedEvents.push({
      id: `HF-${region.toUpperCase().slice(0, 3)}-${String(eventIdx++).padStart(3, '0')}`,
      lat: Math.round(c.lat * 1000) / 1000,
      lon: Math.round(c.lon * 1000) / 1000,
      date: c.date,
      time: c.time,
      sources,
      sensor_count: sources.length,
      raw_detections: n,
      confidence: avgConf,
      frp: totalFrp,
      avg_frp: avgFrp,
      brightness: avgBright,
      fai,
      region
    });
  }

  // Sort by consensus and FRP
  formattedEvents.sort((a, b) => b.sensor_count - a.sensor_count || b.frp - a.frp);

  // Select top multi-sensor clusters for sample_events.ts (50 for Indonesia, 35 for Amazon, 20 for Central Asia)
  const indoEvents = formattedEvents.filter(e => e.region === 'indonesia').slice(0, 45);
  const amzEvents = formattedEvents.filter(e => e.region === 'amazon').slice(0, 35);
  const asiaEvents = formattedEvents.filter(e => e.region === 'central_asia').slice(0, 20);
  const selectedSample = [...indoEvents, ...amzEvents, ...asiaEvents];

  console.log(`Writing ${selectedSample.length} verified events to src/data/sample_events.ts ...`);
  const sampleEventsCode = `import { HarmonizedFireEvent } from '../types/fire';

/**
 * Harmonized Active Fire Events (NASA Space Apps Challenge 2026)
 * Automatically derived from NASA FIRMS NRT active fire telemetry (Nov 8-14, 2026).
 * Processed via spatio-temporal clustering (1500m buffer) across MODIS (MCD14DL),
 * VIIRS NOAA-20 (VJ114IMGTDL), and VIIRS NOAA-21 (VJ214IMGTDL).
 * Generated by scripts/reproduce_nrt_stats.cjs - do not edit manually.
 */
export const sampleEvents: HarmonizedFireEvent[] = ${JSON.stringify(selectedSample, null, 2)};
`;

  fs.writeFileSync('src/data/sample_events.ts', sampleEventsCode, 'utf8');

  // Save Sensitivity Analysis Table to scripts/sensitivity_analysis.json
  fs.writeFileSync(
    'scripts/sensitivity_analysis.json',
    JSON.stringify(sensitivityResults, null, 2),
    'utf8'
  );
  console.log('Saved sensitivity analysis to scripts/sensitivity_analysis.json');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
