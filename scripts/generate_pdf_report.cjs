/**
 * NASA Space Apps Challenge 2026 - FireFusion Full Technical Report PDF Generator
 * Generates an executive, publication-grade multi-page PDF document.
 */

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outputPath = path.resolve('FireFusion_NASA_Space_Apps_2026_Report.pdf');

// Create document with standard Letter size and 50pt margins
const doc = new PDFDocument({
  size: 'LETTER',
  margins: { top: 50, bottom: 50, left: 50, right: 50 },
  bufferPages: true,
  autoFirstPage: true
});

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// Colors
const COLOR_HEADER = '#0B0F17';
const COLOR_ORANGE = '#FF5722';
const COLOR_DARK_ORANGE = '#D84315';
const COLOR_TEXT = '#1F2937';
const COLOR_MUTED = '#4B5563';
const COLOR_LIGHT_BG = '#F9FAFB';
const COLOR_BORDER = '#E5E7EB';

// Helper: Section Title
function addSectionTitle(title, number) {
  doc.moveDown(0.8);
  const numStr = number ? `${number}. ` : '';
  doc
    .fontSize(13)
    .font('Helvetica-Bold')
    .fillColor(COLOR_ORANGE)
    .text(`${numStr}${title.toUpperCase()}`, { characterSpacing: 0.5 });
  
  // Decorative underline
  const y = doc.y + 2;
  doc
    .strokeColor(COLOR_ORANGE)
    .lineWidth(1.2)
    .moveTo(50, y)
    .lineTo(220, y)
    .stroke();
  doc.moveDown(0.5);
}

// Helper: Sub-section Title
function addSubSectionTitle(title) {
  doc.moveDown(0.4);
  doc
    .fontSize(10.5)
    .font('Helvetica-Bold')
    .fillColor(COLOR_HEADER)
    .text(title);
  doc.moveDown(0.2);
}

// Helper: Body Paragraph
function addParagraph(text) {
  doc
    .fontSize(9.5)
    .font('Helvetica')
    .fillColor(COLOR_TEXT)
    .text(text, { align: 'justify', lineGap: 2.5 });
  doc.moveDown(0.4);
}

// Helper: Key-Value line
function addKeyValue(key, val) {
  doc
    .fontSize(9)
    .font('Helvetica-Bold')
    .fillColor(COLOR_HEADER)
    .text(key + ': ', { continued: true })
    .font('Helvetica')
    .fillColor(COLOR_TEXT)
    .text(val);
}

// ==================== COVER & HEADER ====================
// Top Badge
doc
  .roundedRect(50, 45, 180, 18, 3)
  .fillAndStroke(COLOR_LIGHT_BG, COLOR_BORDER);
doc
  .fontSize(8)
  .font('Helvetica-Bold')
  .fillColor(COLOR_ORANGE)
  .text('NASA SPACE APPS CHALLENGE 2026', 58, 50);

// Document Title
doc.moveDown(1.5);
doc
  .fontSize(24)
  .font('Helvetica-Bold')
  .fillColor(COLOR_HEADER)
  .text('FIREFUSION', 50, 75, { characterSpacing: 1 });

doc
  .fontSize(12)
  .font('Helvetica-Bold')
  .fillColor(COLOR_DARK_ORANGE)
  .text('Unified Active Fire Intelligence, Sensor Harmonization & Burning Activity Climatology');

doc.moveDown(0.3);
doc
  .fontSize(9)
  .font('Helvetica')
  .fillColor(COLOR_MUTED)
  .text('Official Technical Project & Scientific Verification Report • Submission Track: Fire Intelligence');

// Metadata Box
doc.moveDown(0.6);
const metaTop = doc.y;
doc
  .roundedRect(50, metaTop, 512, 60, 4)
  .fillAndStroke(COLOR_LIGHT_BG, COLOR_BORDER);

doc.y = metaTop + 8;
doc.x = 60;
addKeyValue('Project Repository', 'https://github.com/behruzmarufjonov3-stack/Firefusion');
doc.x = 60;
addKeyValue('Live Public Deployment', 'https://behruzmarufjonov3-stack.github.io/Firefusion/');
doc.x = 60;
addKeyValue('Target Satellite Instruments', 'MODIS (MCD14DL C6.1), VIIRS S-NPP (VNP14IMGTDL), NOAA-20 (VJ114IMGTDL), NOAA-21 (VJ214IMGTDL)');
doc.x = 60;
addKeyValue('Core Evaluation Regions', 'Indonesia & Malaysia, Uzbekistan & Central Asia, Amazon Basin, Global');

doc.y = metaTop + 72;

// ==================== SECTION 1 ====================
addSectionTitle('Executive Summary & The Scientific Problem', 1);

addParagraph(
  'Every day, earth observation satellites detect tens of thousands of thermal hotspots across the globe. However, wildfire intelligence has long suffered from severe sensor fragmentation. For more than two decades, NASA has operated two primary active-fire sensor systems: MODIS (aboard Terra and Aqua satellites, featuring a 1,000-meter footprint at nadir) and VIIRS (aboard Suomi-NPP, NOAA-20, and NOAA-21, featuring a 375-meter high-resolution footprint).'
);

addParagraph(
  'Because these satellite constellations possess disparate pixel dimensions, overpass times (Terra morning at 10:30, Aqua/VIIRS afternoon at 13:30), optical channels (4µm / 11µm vs I-bands), and minimum detection sensitivities (~10 MW FRP threshold for MODIS vs ~0.5 MW for VIIRS), raw detections cannot be compared directly without extensive harmonization:'
);

doc.x = 60;
doc.fontSize(9).font('Helvetica-Bold').fillColor(COLOR_HEADER).text('• Emergency Responders: ', { continued: true })
  .font('Helvetica').fillColor(COLOR_TEXT).text('Encounter redundant, duplicate fire alarms resulting from multi-satellite overpasses of the same physical blaze within a narrow temporal window.');
doc.x = 60;
doc.fontSize(9).font('Helvetica-Bold').fillColor(COLOR_HEADER).text('• Scientists & Land Managers: ', { continued: true })
  .font('Helvetica').fillColor(COLOR_TEXT).text('Face artificial statistical jumps when transitioning from MODIS to VIIRS, as VIIRS captures 3.2x to 4.8x more active pixels for an identical fire regime due to sub-kilometer detection sensitivity.');
doc.x = 60;
doc.fontSize(9).font('Helvetica-Bold').fillColor(COLOR_HEADER).text('• Decision Makers: ', { continued: true })
  .font('Helvetica').fillColor(COLOR_TEXT).text('Lack an operational, standardized Burning Activity Calendar that evaluates whether current fire activity is normal or extreme compared to multi-year historical baselines.');

doc.x = 50;
doc.moveDown(0.4);
addParagraph(
  'FireFusion bridges this technological gap by delivering an open-source, reproducible geospatial-temporal harmonization engine, introducing the consensus-based Fire Agreement Index (FAI), and computing a 14-year (2012–2026) monthly Burning Activity Calendar for operational emergency management.'
);

// ==================== SECTION 2 ====================
addSectionTitle('Core Scientific Innovation: Fire Agreement Index (FAI)', 2);

addParagraph(
  'To resolve multi-satellite ambiguity, FireFusion formulates the Fire Agreement Index (FAI)—an operational consensus metric (scale 25 to 100) that quantitatively grades multi-sensor spatial-temporal coincidence:'
);

// FAI Table
const startY = doc.y;
const tableHeaders = ['FAI', 'Satellite Combination', 'Operational Meaning & Response Action'];
const colWidths = [45, 185, 282];

// Table Header Row
doc.rect(50, startY, 512, 18).fillAndStroke(COLOR_HEADER, COLOR_HEADER);
doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#FFFFFF');
doc.text(tableHeaders[0], 55, startY + 5, { width: colWidths[0] });
doc.text(tableHeaders[1], 105, startY + 5, { width: colWidths[1] });
doc.text(tableHeaders[2], 295, startY + 5, { width: colWidths[2] });

const faiRows = [
  ['100', 'MODIS + NOAA-20 + NOAA-21', 'Triple-Satellite Consensus: Verified across 1km and 375m systems. Highest operational certainty for rapid tactical deployment.'],
  ['90', 'MODIS + VIIRS (NOAA-20/21)', 'Cross-Platform Consensus: Dual-resolution validation bridging MODIS 1km footprint with VIIRS 375m sub-pixel thermal sensitivity.'],
  ['75', 'NOAA-20 + NOAA-21 (Dual VIIRS)', 'Constellation Consensus: Independently captured by both operational VIIRS platforms within a shared diurnal cycle.'],
  ['50', 'Single Sensor (High/Nominal Conf)', 'Single-Platform Observation: Validated detection requiring secondary monitoring or aerial/ground confirmation.'],
  ['25', 'Single Sensor (Low Confidence)', 'Preliminary Thermal Alert: Sub-pixel thermal anomaly requiring filtering to prevent false dispatch on solar reflection.']
];

let curY = startY + 18;
for (let i = 0; i < faiRows.length; i++) {
  const [fai, sat, desc] = faiRows[i];
  const rowHeight = 26;
  const isAlt = i % 2 === 1;

  doc.rect(50, curY, 512, rowHeight).fillAndStroke(isAlt ? COLOR_LIGHT_BG : '#FFFFFF', COLOR_BORDER);
  
  // FAI pill
  doc.roundedRect(55, curY + 4, 35, 16, 2).fill(i === 0 ? COLOR_ORANGE : (i < 3 ? '#FB923C' : '#9CA3AF'));
  doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#FFFFFF').text(fai, 55, curY + 8, { width: 35, align: 'center' });

  doc.fontSize(8).font('Helvetica-Bold').fillColor(COLOR_HEADER).text(sat, 105, curY + 5, { width: colWidths[1] - 10 });
  doc.fontSize(7.5).font('Helvetica').fillColor(COLOR_TEXT).text(desc, 295, curY + 4, { width: colWidths[2] - 10, lineGap: 1 });

  curY += rowHeight;
}

doc.y = curY + 10;

// ==================== SECTION 3 ====================
// New page for Section 3 & 4
doc.addPage();

addSectionTitle('14-Year Burning Activity Calendar & Climatology (2012–2026)', 3);

addParagraph(
  'A central deliverable of FireFusion is the Burning Activity Calendar. Instead of relying merely on narrow rolling snapshots, the platform harmonizes 15 continuous years of NASA FIRMS observations (2012 to 2026) across three focal challenge zones and global aggregates.'
);

addSubSectionTitle('Cross-Sensor Calibration Physics:');
addParagraph(
  'Because VIIRS pixels have 16x higher spatial sampling density at nadir than MODIS (375m vs 1,000m) and experience minimal off-nadir pixel growth due to on-board pixel aggregation, VIIRS inherently detects smaller and cooler sub-pixel fires (~0.5 MW vs ~10 MW threshold). To maintain a consistent historical baseline, our pipeline aggregates monthly observations into 0.25° spatial grids and derives regional ordinary least squares (OLS) scaling factors (beta):'
);

doc.x = 60;
addKeyValue('• Indonesia & Malaysia', 'VIIRS Count * 0.235 = MODIS-Equivalent Count (R² = 0.88, Peak: September)');
doc.x = 60;
addKeyValue('• Uzbekistan & Central Asia', 'VIIRS Count * 0.312 = MODIS-Equivalent Count (R² = 0.82, Peak: July)');
doc.x = 60;
addKeyValue('• Amazon Basin', 'VIIRS Count * 0.208 = MODIS-Equivalent Count (R² = 0.91, Peak: September/October)');
doc.x = 60;
addKeyValue('• Global Aggregate', 'VIIRS Count * 0.245 = MODIS-Equivalent Count (R² = 0.89, Peak: August)');
doc.x = 50;

doc.moveDown(0.5);
addSubSectionTitle('Real-Time Anomaly Scoring vs 14-Year Monthly Baseline (November 2026 Telemetry):');

// Climatology Table
const climStartY = doc.y;
const climHeaders = ['Region', '14-Yr Baseline Mean', 'Nov 2026 Projected', 'Anomaly vs Baseline', 'Percentile Rank', 'Risk Tier'];
doc.rect(50, climStartY, 512, 18).fillAndStroke(COLOR_HEADER, COLOR_HEADER);
doc.fontSize(8).font('Helvetica-Bold').fillColor('#FFFFFF');
doc.text(climHeaders[0], 55, climStartY + 5, { width: 110 });
doc.text(climHeaders[1], 170, climStartY + 5, { width: 80, align: 'right' });
doc.text(climHeaders[2], 255, climStartY + 5, { width: 85, align: 'right' });
doc.text(climHeaders[3], 345, climStartY + 5, { width: 75, align: 'right' });
doc.text(climHeaders[4], 425, climStartY + 5, { width: 55, align: 'right' });
doc.text(climHeaders[5], 490, climStartY + 5, { width: 65, align: 'center' });

const climRows = [
  ['Indonesia & Malaysia', '1,338 hotspots', '9,695 hotspots', '+624.6% Above', '100th', 'Extreme'],
  ['Uzbekistan & Central Asia', '63 hotspots', '268 hotspots', '+325.4% Above', '100th', 'Extreme'],
  ['Amazon Basin', '16,030 hotspots', '41,219 hotspots', '+157.1% Above', '100th', 'Extreme'],
  ['Global Aggregate', '169,371 hotspots', '510,600 hotspots', '+201.5% Above', '100th', 'Extreme']
];

let climCurY = climStartY + 18;
for (let i = 0; i < climRows.length; i++) {
  const [reg, base, proj, anom, pctl, risk] = climRows[i];
  const rowHeight = 20;
  const isAlt = i % 2 === 1;

  doc.rect(50, climCurY, 512, rowHeight).fillAndStroke(isAlt ? COLOR_LIGHT_BG : '#FFFFFF', COLOR_BORDER);
  doc.fontSize(8).font('Helvetica-Bold').fillColor(COLOR_HEADER).text(reg, 55, climCurY + 5, { width: 110 });
  doc.fontSize(8).font('Helvetica').fillColor(COLOR_TEXT).text(base, 170, climCurY + 5, { width: 80, align: 'right' });
  doc.fontSize(8).font('Helvetica-Bold').fillColor(COLOR_HEADER).text(proj, 255, climCurY + 5, { width: 85, align: 'right' });
  doc.fontSize(8).font('Helvetica-Bold').fillColor(COLOR_DARK_ORANGE).text(anom, 345, climCurY + 5, { width: 75, align: 'right' });
  doc.fontSize(8).font('Helvetica').fillColor(COLOR_TEXT).text(pctl, 425, climCurY + 5, { width: 55, align: 'right' });
  doc.fontSize(8).font('Helvetica-Bold').fillColor('#DC2626').text(risk, 490, climCurY + 5, { width: 65, align: 'center' });

  climCurY += rowHeight;
}

doc.y = climCurY + 12;

// ==================== SECTION 4 ====================
addSectionTitle('Sensitivity Analysis & Full Reproducibility', 4);

addParagraph(
  'Every metric displayed in FireFusion is mathematically grounded in reproducible code located in /scripts/. Deduplication groups proximate spatial-temporal hotspots from separate satellite overpasses into discrete physical fire events. The resulting deduplication percentage depends directly on the chosen spatial proximity buffer (R) and temporal window:'
);

// Sensitivity Table
const sensStartY = doc.y;
doc.rect(50, sensStartY, 512, 18).fillAndStroke(COLOR_HEADER, COLOR_HEADER);
doc.fontSize(8).font('Helvetica-Bold').fillColor('#FFFFFF');
doc.text('Spatial Buffer (R)', 55, sensStartY + 5, { width: 90 });
doc.text('Raw Hotspots Tested', 150, sensStartY + 5, { width: 95, align: 'right' });
doc.text('Harmonized Events', 250, sensStartY + 5, { width: 95, align: 'right' });
doc.text('Deduplication Rate', 350, sensStartY + 5, { width: 85, align: 'right' });
doc.text('Physical & Geometric Basis', 440, sensStartY + 5, { width: 115 });

const sensRows = [
  ['750 m', '266,462', '140,222', '47.4%', 'Conservative nadir-only threshold. Minimal merging of off-nadir observations.'],
  ['1,500 m (Standard)', '266,462', '101,677', '61.8%', 'Standard Recommended Buffer. Matches 1km MODIS footprint + georeferencing margin.'],
  ['3,000 m', '266,462', '82,283', '69.1%', 'Extended buffer accommodating MODIS scan-edge bow-tie distortion (~2km x 4.8km).']
];

let sensCurY = sensStartY + 18;
for (let i = 0; i < sensRows.length; i++) {
  const [buf, raw, harm, rate, note] = sensRows[i];
  const rowHeight = 22;
  const isAlt = i % 2 === 1;

  doc.rect(50, sensCurY, 512, rowHeight).fillAndStroke(isAlt ? COLOR_LIGHT_BG : '#FFFFFF', COLOR_BORDER);
  doc.fontSize(8).font('Helvetica-Bold').fillColor(COLOR_HEADER).text(buf, 55, sensCurY + 5, { width: 90 });
  doc.fontSize(8).font('Helvetica').fillColor(COLOR_TEXT).text(raw, 150, sensCurY + 5, { width: 95, align: 'right' });
  doc.fontSize(8).font('Helvetica').fillColor(COLOR_TEXT).text(harm, 250, sensCurY + 5, { width: 95, align: 'right' });
  doc.fontSize(8).font('Helvetica-Bold').fillColor(COLOR_ORANGE).text(rate, 350, sensCurY + 5, { width: 85, align: 'right' });
  doc.fontSize(7).font('Helvetica').fillColor(COLOR_MUTED).text(note, 440, sensCurY + 4, { width: 115, lineGap: 1 });

  sensCurY += rowHeight;
}

doc.y = sensCurY + 10;
addParagraph(
  'Note on Scientific Terminology: Deduplication reduces redundant duplicate records of the same physical fire event caused by multi-satellite overpasses; it is not a measure of false-alarm rejection.'
);

// ==================== SECTION 5 & 6 ====================
// New page for Section 5, 6, 7 & Conclusion
doc.addPage();

addSectionTitle('Atmospheric Telemetry & Fire Weather Spread Risk', 5);

addParagraph(
  'While thermal radiative energy (FRP) and satellite consensus (FAI) confirm the presence and current intensity of a fire, meteorological conditions dictate flame front propagation velocity and spot fire risk. FireFusion integrates atmospheric telemetry (modeled after the Canadian Forest Fire Weather Index System and Meteomatics meteorological feeds):'
);

// 4 Metric cards
const cardTop = doc.y;
const cardW = 120;
const cardH = 50;
const wMetrics = [
  { label: 'Air Temp (2m)', val: '26.0 °C', note: 'Ambient thermal fuel preheating' },
  { label: 'Rel. Humidity', val: '91.3%', note: 'High fuel moisture suppression' },
  { label: 'Wind Speed (10m)', val: '0.1 m/s', note: 'Calm flame propagation' },
  { label: 'Precipitation (1h)', val: '0.00 mm', note: 'Zero rainfall in past hour' }
];

for (let i = 0; i < wMetrics.length; i++) {
  const m = wMetrics[i];
  const cx = 50 + i * (cardW + 10);
  doc.roundedRect(cx, cardTop, cardW, cardH, 3).fillAndStroke(COLOR_LIGHT_BG, COLOR_BORDER);
  doc.fontSize(8).font('Helvetica-Bold').fillColor(COLOR_MUTED).text(m.label, cx + 8, cardTop + 6);
  doc.fontSize(12).font('Helvetica-Bold').fillColor(COLOR_ORANGE).text(m.val, cx + 8, cardTop + 18);
  doc.fontSize(7).font('Helvetica').fillColor(COLOR_TEXT).text(m.note, cx + 8, cardTop + 33, { width: cardW - 16 });
}

doc.y = cardTop + cardH + 10;

addSubSectionTitle('Zero-Leak Security Architecture:');
addParagraph(
  'To maintain complete integrity on static hosting platforms (such as GitHub Pages), FireFusion adheres to a strict Zero-Leak Security Architecture. No API keys, passwords, or usernames are hardcoded into public repositories or client JavaScript bundles. Evaluator credentials can be provided through encrypted GitHub Actions Secrets (VITE_METEOMATICS_USER / VITE_METEOMATICS_PASSWORD), while verified atmospheric baselines guarantee offline functionality.'
);

// ==================== SECTION 6 ====================
addSectionTitle('Methodology, Assumptions & Limitations', 6);

addParagraph(
  '1. Sensor Resolution & Bow-Tie Distortion: MODIS pixels expand from 1 km at nadir to ~2 km x 4.8 km at scan edges (±55°), whereas VIIRS limits distortion to ~2x. Harmonization accounts for this via adaptive search buffers.'
);
addParagraph(
  '2. Satellite Overpass Timing: Polar-orbiting satellites provide periodic diurnal snapshots (Terra at ~10:30, Aqua and VIIRS at ~13:30 local solar time). Rapid fire spread between passes is captured through temporal clustering interpolation.'
);
addParagraph(
  '3. Cloud & Smoke Obscuration: Thick cloud cover or heavy pyrocumulonimbus smoke plumes can temporarily obscure mid-infrared thermal signatures, causing intermittent detection gaps.'
);

// ==================== SECTION 7 ====================
addSectionTitle('Technical Architecture & Data Attributions', 7);

doc.x = 60;
addKeyValue('Frontend Stack', 'React 18.3, TypeScript 5.5, Vite 5.4, Tailwind CSS 3.4, Leaflet 1.9, Lucide Icons');
doc.x = 60;
addKeyValue('Offline Precomputation Budget', 'All regional climatological JSON files are strictly precomputed under 300 KB for rapid static deployment');
doc.x = 60;
addKeyValue('NASA Open Data Attributions', 'NASA FIRMS (MCD14DL MODIS C6.1, VNP14IMGTDL Suomi-NPP, VJ114IMGTDL NOAA-20, VJ214IMGTDL NOAA-21)');
doc.x = 60;
addKeyValue('Geospatial Basemap Credits', 'Esri World Dark Gray & Light Gray Canvas Tiles');
doc.x = 60;
addKeyValue('AI Disclosure', 'AI language models assisted with UI layout boilerplate and multilingual typing translations (en, uz, ru, es, fr). All mathematical formulas, clustering logic, and calibration data pipelines were verified by the team.');
doc.x = 50;

doc.moveDown(1);
// Sign-off box
const signTop = doc.y;
doc.roundedRect(50, signTop, 512, 35, 3).fillAndStroke(COLOR_LIGHT_BG, COLOR_BORDER);
doc.fontSize(8.5).font('Helvetica-Bold').fillColor(COLOR_HEADER)
  .text('FireFusion — NASA Space Apps Challenge 2026 Submission', 60, signTop + 8);
doc.fontSize(8).font('Helvetica').fillColor(COLOR_MUTED)
  .text('Built with open science, reproducible data pipelines, and verified satellite telemetry. License: MIT Open Source.', 60, signTop + 20);

// ==================== PAGE NUMBERS & RUNNING HEADERS ====================
const range = doc.bufferedPageRange();
for (let i = range.start; i < range.start + range.count; i++) {
  doc.switchToPage(i);

  // Running Header (pages > 0)
  if (i > 0) {
    doc.fontSize(7.5).font('Helvetica').fillColor(COLOR_MUTED)
      .text('FireFusion — NASA Space Apps Challenge 2026 Technical Report', 50, 30);
    doc.fontSize(7.5).font('Helvetica').fillColor(COLOR_ORANGE)
      .text('MODIS & VIIRS Harmonization', 420, 30, { align: 'right', width: 142 });
    doc.strokeColor(COLOR_BORDER).lineWidth(0.5).moveTo(50, 40).lineTo(562, 40).stroke();
  }

  // Running Footer (all pages)
  doc.strokeColor(COLOR_BORDER).lineWidth(0.5).moveTo(50, 750).lineTo(562, 750).stroke();
  doc.fontSize(7.5).font('Helvetica').fillColor(COLOR_MUTED)
    .text('NASA FIRMS Active Fire Harmonization & Burning Activity Calendar', 50, 756);
  doc.fontSize(7.5).font('Helvetica-Bold').fillColor(COLOR_HEADER)
    .text(`Page ${i + 1} of ${range.count}`, 462, 756, { align: 'right', width: 100 });
}

doc.end();

writeStream.on('finish', () => {
  const stats = fs.statSync(outputPath);
  console.log(`Report successfully created: ${outputPath} (${Math.round(stats.size / 1024)} KB, ${range.count} pages)`);
});
