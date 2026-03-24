/**
 * Universal Apple Keynote-style Presentation Builder
 * Reads slides-config.json and generates a professional PPTX with auto-calculated layouts.
 *
 * Dependencies: npm install pptxgenjs sharp
 * Usage: node build-presentation.js <slides-config.json> [output.pptx]
 */
const pptxgen = require('pptxgenjs');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// ── Apple Light Theme ──
const C = {
  bg: 'FFFFFF', bgSec: 'F5F5F7', white: 'FFFFFF', black: '1D1D1F',
  text: '1D1D1F', textSec: '6E6E73', textTer: 'AEAEB2',
  blue: '0071E3', blueDeep: '0077ED', blueBg: 'EBF5FF',
  cardBg: 'F5F5F7', cardBorder: 'D2D2D7',
  hlBg: 'E8F0FE', hlBorder: '0071E3',
  green: '34C759', greenBg: 'E8FAE8',
  orange: 'FF9500', orangeBg: 'FFF3E0', orangeBorder: 'E0C080',
  tagBg: 'E8E8ED', purple: '5856D6', gray86: '86868B',
};
const FONT = 'Arial';

// ── Icon SVG Paths Registry ──
const ICONS = {
  layers: '<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>',
  calculator: '<rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="8" y2="10.01"/><line x1="12" y1="10" x2="12" y2="10.01"/><line x1="16" y1="10" x2="16" y2="10.01"/><line x1="8" y1="14" x2="8" y2="14.01"/><line x1="12" y1="14" x2="12" y2="14.01"/><line x1="16" y1="14" x2="16" y2="14.01"/><line x1="8" y1="18" x2="16" y2="18"/>',
  box: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
  arrow: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  handshake: '<path d="M20.42 4.58a5.4 5.4 0 00-7.65 0l-.77.78-.77-.78a5.4 5.4 0 00-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/><path d="M12 5.36L8.87 8.5a2.13 2.13 0 000 3h0a2.13 2.13 0 003 0l2.26-2.21a.76.76 0 011 0l2.4 2.4"/><path d="M18 15l-2-2"/><path d="M15 18l-2-2"/>',
  phone: '<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>',
  globe: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>',
  cpu: '<rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>',
  users: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>',
  truck: '<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
  dollar: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>',
  chart: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
  mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
};

// ── Asset Generators ──
async function createGlowImg(color, opacity) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800"><defs><radialGradient id="g" cx="50%" cy="50%" r="50%"><stop offset="0%" style="stop-color:${color};stop-opacity:${opacity}"/><stop offset="50%" style="stop-color:${color};stop-opacity:${opacity*0.3}"/><stop offset="100%" style="stop-color:${color};stop-opacity:0"/></radialGradient></defs><circle cx="400" cy="400" r="400" fill="url(#g)"/></svg>`;
  return 'data:image/png;base64,' + (await sharp(Buffer.from(svg)).png().toBuffer()).toString('base64');
}

async function createIconImg(pathD, color, size = 120) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${pathD}</svg>`;
  return 'data:image/png;base64,' + (await sharp(Buffer.from(svg)).png().toBuffer()).toString('base64');
}

async function createPieChartImg(items, chartTitle) {
  const total = items.reduce((s, d) => s + d.value, 0);
  let paths = '', startAngle = -90;
  const cx = 150, cy = 150, r = 120;
  items.forEach(d => {
    const angle = (d.value / total) * 360;
    const endAngle = startAngle + angle;
    const x1 = cx + r * Math.cos(startAngle * Math.PI / 180);
    const y1 = cy + r * Math.sin(startAngle * Math.PI / 180);
    const x2 = cx + r * Math.cos(endAngle * Math.PI / 180);
    const y2 = cy + r * Math.sin(endAngle * Math.PI / 180);
    const largeArc = angle > 180 ? 1 : 0;
    paths += `<path d="M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z" fill="${d.color}"/>`;
    const midAngle = (startAngle + angle / 2) * Math.PI / 180;
    const lx = cx + (r * 0.65) * Math.cos(midAngle);
    const ly = cy + (r * 0.65) * Math.sin(midAngle);
    paths += `<text x="${lx}" y="${ly}" text-anchor="middle" font-family="Arial" font-size="11" fill="white" font-weight="bold">${d.label}</text>`;
    startAngle = endAngle;
  });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><circle cx="150" cy="150" r="140" fill="#F5F5F7"/>${paths}<text x="150" y="20" text-anchor="middle" font-family="Arial" font-size="10" fill="#86868B">${chartTitle || ''}</text></svg>`;
  return 'data:image/png;base64,' + (await sharp(Buffer.from(svg)).png().toBuffer()).toString('base64');
}

// ── Shape Tracker (auto-incrementing IDs for animation groups) ──
class ShapeTracker {
  constructor(slide, SH) {
    this.slide = slide;
    this.SH = SH;
    this.nextId = 2; // PptxGenJS starts at 2
    this.groups = [];
    this.currentGroup = [];
  }
  addShape(...args) { this.slide.addShape(...args); this.currentGroup.push(this.nextId++); }
  addText(...args) { this.slide.addText(...args); this.currentGroup.push(this.nextId++); }
  addImage(...args) { this.slide.addImage(...args); this.currentGroup.push(this.nextId++); }
  startGroup() { if (this.currentGroup.length) { this.groups.push(this.currentGroup); this.currentGroup = []; } }
  finalize() { if (this.currentGroup.length) this.groups.push(this.currentGroup); return this.groups; }
}

// ── Helper Functions ──
function bg(s, color) { s.background = { color: color || C.bg }; }

function flowBox(t, text, x, y, w, h, hl = false) {
  t.addShape(t.SH.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.12, fill: { color: hl ? C.hlBg : C.cardBg }, line: { color: hl ? C.hlBorder : C.cardBorder, width: 0.75 }, shadow: { type: 'outer', blur: 4, offset: 1, color: '000000', opacity: 0.08 } });
  t.addText(text, { x: x + 0.08, y, w: w - 0.16, h, color: C.text, fontSize: 8.5, fontFace: FONT, align: 'center', valign: 'middle', wrap: true, lineSpacingMultiple: 1.2 });
}

function arrowIcon(t, arrowImg, x, y) {
  t.addImage({ data: arrowImg, x, y, w: 0.22, h: 0.22 });
}

function infoCard(t, title, body, x, y, w, h) {
  t.addShape(t.SH.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.14, fill: { color: C.cardBg }, line: { color: C.cardBorder, width: 0.5 }, shadow: { type: 'outer', blur: 3, offset: 1, color: '000000', opacity: 0.06 } });
  t.addText(title, { x: x + 0.2, y: y + 0.12, w: w - 0.4, h: 0.22, color: C.blue, fontSize: 8.5, fontFace: FONT, bold: true, charSpacing: 1 });
  t.addText(body, { x: x + 0.2, y: y + 0.38, w: w - 0.4, h: h - 0.5, color: C.textSec, fontSize: 8.5, fontFace: FONT, wrap: true, lineSpacingMultiple: 1.35 });
}

function metricBox(t, value, label, x, y, w = 1.8) {
  t.addShape(t.SH.ROUNDED_RECTANGLE, { x, y, w, h: 1.0, fill: { color: C.bgSec }, line: { color: C.cardBorder, width: 0.5 }, rectRadius: 0.12 });
  t.addText(value, { x, y: y + 0.12, w, h: 0.45, color: C.blue, fontSize: 22, fontFace: FONT, bold: true, align: 'center' });
  t.addText(label, { x: x + 0.1, y: y + 0.58, w: w - 0.2, h: 0.35, color: C.textSec, fontSize: 8, fontFace: FONT, align: 'center', wrap: true, lineSpacingMultiple: 1.2 });
}

function numBadge(t, n, x, y, size = 0.5) {
  t.addShape(t.SH.OVAL, { x, y, w: size, h: size, fill: { color: C.blue } });
  t.addText(String(n), { x, y, w: size, h: size, color: C.white, fontSize: size * 28, fontFace: FONT, bold: true, align: 'center', valign: 'middle' });
}

function accentBar(t, x, y, w = 1.2) {
  t.addShape(t.SH.ROUNDED_RECTANGLE, { x, y, w, h: 0.035, fill: { color: C.blue }, rectRadius: 0.02 });
}

function tagPill(t, text, x, y, w = 1.6) {
  t.addShape(t.SH.ROUNDED_RECTANGLE, { x, y, w, h: 0.28, fill: { color: C.tagBg }, rectRadius: 0.04 });
  t.addText(text, { x, y, w, h: 0.28, color: C.textSec, fontSize: 7.5, fontFace: FONT, align: 'center', valign: 'middle' });
}

// ── Layout Calculators ──
function flowRowLayout(steps, leftMargin, rightMargin, arrowW = 0.22, arrowGap = 0.1) {
  const n = steps.length;
  const totalArrow = (n - 1) * (arrowW + 2 * arrowGap);
  const avail = 10 - leftMargin - rightMargin - totalArrow;
  const boxW = avail / n;
  return steps.map((_, i) => ({
    boxX: leftMargin + i * (boxW + arrowW + 2 * arrowGap),
    boxW,
    arrowX: leftMargin + i * (boxW + arrowW + 2 * arrowGap) + boxW + arrowGap,
  }));
}

function cardLayout(n, leftMargin = 0.6, rightMargin = 0.6, gap = 0.2) {
  const avail = 10 - leftMargin - rightMargin;
  const w = (avail - (n - 1) * gap) / n;
  return Array.from({ length: n }, (_, i) => ({ x: leftMargin + i * (w + gap), w }));
}

// ── Slide Type Renderers ──

async function renderTitle(pptx, t, cfg, assets) {
  bg(t.slide);
  // Group 1: glows
  t.addImage({ data: assets.glowBlue, x: 1.5, y: -1.5, w: 7, h: 7 });
  t.addImage({ data: assets.glowPurple, x: 5, y: 1, w: 5, h: 5 });
  t.startGroup();
  // Group 2: brand
  t.addText(cfg.brandName || '', { x: 0, y: 1.2, w: 10, h: 0.4, color: C.blue, fontSize: 15, fontFace: FONT, bold: true, align: 'center', charSpacing: 10 });
  t.startGroup();
  // Group 3: accent bar
  accentBar(t, 4.0, 1.75, 2.0);
  t.startGroup();
  // Group 4: main title
  t.addText(cfg.mainTitle || '', { x: 0.5, y: 2.0, w: 9, h: 0.65, color: C.black, fontSize: 46, fontFace: FONT, bold: true, align: 'center' });
  t.startGroup();
  // Group 5: subtitle
  t.addText(cfg.subtitle || '', { x: 0.5, y: 2.65, w: 9, h: 0.6, color: C.text, fontSize: 36, fontFace: FONT, align: 'center' });
  t.startGroup();
  // Group 6: description
  if (cfg.description) {
    t.addText(cfg.description, { x: 0.87, y: 3.55, w: 8.26, h: 0.65, color: C.textSec, fontSize: 12, fontFace: FONT, align: 'center', lineSpacingMultiple: 1.5 });
  }
  return { delays: [0, 200, 600, 800, 1200, 1800], dur: 800 };
}

async function renderOverview(pptx, t, cfg, assets) {
  bg(t.slide);
  // Group 1: accent bar + title
  accentBar(t, 4.0, 0.8, 2.0);
  t.addText(cfg.title, { x: 0.5, y: 1.0, w: 9, h: 0.6, color: C.black, fontSize: 34, fontFace: FONT, bold: true, align: 'center' });
  t.startGroup();
  // Group 2: subtitle
  t.addText(cfg.subtitle || '', { x: 1, y: 1.7, w: 8, h: 0.4, color: C.textSec, fontSize: 13, fontFace: FONT, align: 'center' });
  t.startGroup();
  // Groups 3+: pillar cards
  const pillars = cfg.pillars || [];
  const n = pillars.length;
  const gap = 0.35;
  const totalW = 10 - 1.4;
  const cardW = (totalW - (n - 1) * gap) / n;
  for (let i = 0; i < n; i++) {
    const p = pillars[i];
    const px = 0.7 + i * (cardW + gap);
    t.addShape(t.SH.ROUNDED_RECTANGLE, { x: px, y: 2.4, w: cardW, h: 2.3, rectRadius: 0.18, fill: { color: C.white }, line: { color: C.cardBorder, width: 0.75 }, shadow: { type: 'outer', blur: 6, offset: 2, color: '000000', opacity: 0.08 } });
    numBadge(t, i + 1, px + 0.2, 2.6, 0.38);
    const iconKey = p.icon || 'layers';
    const iconPath = ICONS[iconKey] || ICONS.layers;
    const iconImg = await createIconImg(iconPath, '#0071E3', 160);
    t.addImage({ data: iconImg, x: px + cardW - 0.75, y: 2.55, w: 0.55, h: 0.55 });
    t.addText(p.title, { x: px + 0.2, y: 3.1, w: cardW - 0.4, h: 0.35, color: C.text, fontSize: 14, fontFace: FONT, bold: true });
    t.addText(p.description, { x: px + 0.2, y: 3.5, w: cardW - 0.4, h: 0.9, color: C.textSec, fontSize: 9.5, fontFace: FONT, wrap: true, lineSpacingMultiple: 1.4 });
    t.startGroup();
  }
  const delays = [0, 400];
  for (let i = 0; i < n; i++) delays.push(800 + i * 200);
  return { delays, dur: 600 };
}

async function renderSection(pptx, t, cfg, assets) {
  bg(t.slide, C.bgSec);
  // Group 1: glow
  t.addImage({ data: assets.glowBlue, x: 2, y: -0.5, w: 6, h: 6 });
  t.startGroup();
  // Group 2: badge
  numBadge(t, cfg.number || 1, 4.75, 1.4, 0.55);
  t.startGroup();
  // Group 3: title
  t.addText(cfg.title, { x: 0.5, y: 2.15, w: 9, h: 0.8, color: C.black, fontSize: 48, fontFace: FONT, bold: true, align: 'center' });
  t.startGroup();
  // Group 4: accent bar
  accentBar(t, 3.5, 3.05, 3.0);
  t.startGroup();
  // Group 5: subtitle
  t.addText(cfg.subtitle || '', { x: 0.5, y: 3.2, w: 9, h: 0.5, color: C.blue, fontSize: 24, fontFace: FONT, align: 'center' });
  return { delays: [0, 300, 700, 1100, 1300], dur: 900 };
}

async function renderProcessFlow(pptx, t, cfg, assets) {
  bg(t.slide);
  const labelColor = cfg.labelColor === 'accent' ? C.blue : C.textSec;

  // Group 1: label + title
  t.addText(cfg.label || '', { x: 0.9, y: 0.35, w: 8, h: 0.25, color: labelColor, fontSize: 10, fontFace: FONT, bold: true, charSpacing: 4 });
  t.addText(cfg.title || '', { x: 0.9, y: 0.62, w: 8.2, h: 0.5, color: C.text, fontSize: 26, fontFace: FONT, bold: true });
  t.startGroup();

  const delays = [0, 400];
  const rows = cfg.flowRows || [];

  // Group 2+: flow rows
  for (let ri = 0; ri < rows.length; ri++) {
    const row = rows[ri];
    const steps = row.steps || [];
    const lm = rows.length === 1 ? 0.4 : (ri === 0 ? 0.25 : 0.9);
    const rm = rows.length === 1 ? 0.4 : (ri === 0 ? 0.25 : 0.9);
    const layout = flowRowLayout(steps, lm, rm);
    const rowY = 1.3 + ri * 1.15;
    const rowH = ri === 0 ? 0.82 : 0.72;

    steps.forEach((step, i) => {
      flowBox(t, step.text, layout[i].boxX, rowY, layout[i].boxW, rowH, step.highlighted || false);
      if (i < steps.length - 1) arrowIcon(t, assets.arrowImg, layout[i].arrowX, rowY + rowH / 2 - 0.11);
    });
    t.startGroup();
    delays.push(400 + (ri + 1) * 500);
  }

  // Running cursor for Y positioning of optional elements below flow rows
  let cursorY = 1.3 + rows.length * 1.15 + 0.15;

  // Warning bar (inline or grid)
  if (cfg.warningBar) {
    const wb = cfg.warningBar;
    if (wb.layout === 'grid') {
      const wbH = 1.2;
      const items = wb.items || [];
      t.addShape(t.SH.ROUNDED_RECTANGLE, { x: 0.9, y: cursorY, w: 8.2, h: wbH, fill: { color: C.orangeBg }, line: { color: C.orangeBorder, width: 0.5 }, rectRadius: 0.1 });
      items.forEach((p, i) => {
        const col = i % 2, row = Math.floor(i / 2);
        t.addImage({ data: assets.starImg, x: 1.1 + col * 4, y: cursorY + 0.15 + row * 0.42, w: 0.18, h: 0.18 });
        t.addText(p, { x: 1.35 + col * 4, y: cursorY + 0.1 + row * 0.42, w: 3.5, h: 0.3, color: C.textSec, fontSize: 9, fontFace: FONT });
      });
      cursorY += wbH + 0.15;
    } else {
      // inline
      const wbH = 0.85;
      t.addShape(t.SH.ROUNDED_RECTANGLE, { x: 0.9, y: cursorY, w: 8.2, h: wbH, fill: { color: C.orangeBg }, line: { color: C.orangeBorder, width: 0.5 }, rectRadius: 0.1 });
      t.addImage({ data: assets.starImg, x: 1.1, y: cursorY + 0.15, w: 0.22, h: 0.22 });
      t.addText(wb.title || '', { x: 1.4, y: cursorY + 0.07, w: 1.5, h: 0.3, color: C.orange, fontSize: 9, fontFace: FONT, bold: true });
      t.addText((wb.items || []).join('  |  '), { x: 1.4, y: cursorY + 0.35, w: 7.5, h: 0.3, color: C.textSec, fontSize: 8.5, fontFace: FONT });
      cursorY += wbH + 0.15;
    }
    t.startGroup();
    delays.push(delays[delays.length - 1] + 500);
  }

  // Tags
  if (cfg.tags && cfg.tags.length) {
    const tagH = 0.28;
    const tagW = (8.6 - (cfg.tags.length - 1) * 0.1) / cfg.tags.length;
    cfg.tags.forEach((text, i) => tagPill(t, text, 0.6 + i * (tagW + 0.1), cursorY, tagW));
    cursorY += tagH + 0.15;
    t.startGroup();
    delays.push(delays[delays.length - 1] + 400);
  }

  // Cost bar
  if (cfg.costBar) {
    t.addShape(t.SH.ROUNDED_RECTANGLE, { x: 0.6, y: cursorY, w: 8.8, h: 0.4, fill: { color: C.bgSec }, rectRadius: 0.06 });
    t.addText(cfg.costBar.text, { x: 0.8, y: cursorY, w: 8.4, h: 0.4, color: C.textSec, fontSize: 8.5, fontFace: FONT, align: 'center', valign: 'middle' });
    t.startGroup();
    delays.push(delays[delays.length - 1] + 400);
  }

  return { delays, dur: 600 };
}

async function renderWorkflow(pptx, t, cfg, assets) {
  bg(t.slide);

  // Group 1: badge + title + subtitle
  t.addShape(t.SH.ROUNDED_RECTANGLE, { x: 0.9, y: 0.3, w: 1.15, h: 0.3, fill: { color: C.blue }, rectRadius: 0.06 });
  t.addText(`Workflow ${cfg.workflowNumber || ''}`, { x: 0.9, y: 0.3, w: 1.15, h: 0.3, color: C.white, fontSize: 9, fontFace: FONT, bold: true, align: 'center', valign: 'middle' });
  t.addText(cfg.title, { x: 2.15, y: 0.25, w: 5, h: 0.4, color: C.text, fontSize: 22, fontFace: FONT, bold: true });
  t.addText(cfg.subtitle || '', { x: 0.9, y: 0.7, w: 8, h: 0.25, color: C.blue, fontSize: 11, fontFace: FONT });
  t.startGroup();

  // Group 2: flow steps
  const steps = cfg.flowSteps || [];
  const layout = flowRowLayout(steps, 0.15, 0.15);
  steps.forEach((step, i) => {
    flowBox(t, step.text, layout[i].boxX, 1.15, layout[i].boxW, 0.82, step.highlighted !== false);
    if (i < steps.length - 1) arrowIcon(t, assets.arrowImg, layout[i].arrowX, 1.4);
  });
  t.startGroup();

  // Group 3: info cards
  const cards = cfg.infoCards || [];
  if (cards.length) {
    const cl = cardLayout(cards.length, 0.6, 0.6, 0.2);
    const cardH = cfg.metrics ? 1.25 : 1.15;
    cards.forEach((c, i) => infoCard(t, c.title, c.body, cl[i].x, 2.35, cl[i].w, cardH));
    t.startGroup();
  }

  // Group 4: metrics or warning
  const delays = [0, 300, 800];
  if (cfg.metrics && cfg.metrics.length) {
    const ml = cardLayout(cfg.metrics.length, 0.6, 0.6, 0.4);
    const metricY = cards.length ? 3.8 : 2.35;
    cfg.metrics.forEach((m, i) => metricBox(t, m.value, m.label, ml[i].x, metricY, ml[i].w));
    delays.push(1300);
  } else if (cfg.warningBar) {
    const wbY = cards.length ? 3.8 : 2.35;
    t.addShape(t.SH.ROUNDED_RECTANGLE, { x: 0.6, y: wbY, w: 8.8, h: 0.55, fill: { color: C.orangeBg }, line: { color: C.orangeBorder, width: 0.5 }, rectRadius: 0.08 });
    t.addImage({ data: assets.starImg, x: 0.85, y: wbY + 0.12, w: 0.2, h: 0.2 });
    t.addText(cfg.warningBar.text || (cfg.warningBar.items || []).join(' '), { x: 1.15, y: wbY - 0.02, w: 8, h: 0.5, color: C.orange, fontSize: 8.5, fontFace: FONT, wrap: true, lineSpacingMultiple: 1.3 });
    delays.push(1200);
  } else {
    delays.push(1300);
  }

  return { delays, dur: 600 };
}

async function renderComparison(pptx, t, cfg, assets) {
  bg(t.slide);

  // Group 1: title
  t.addText(cfg.title, { x: 0.9, y: 0.35, w: 8.2, h: 0.5, color: C.text, fontSize: 24, fontFace: FONT, bold: true });
  if (cfg.subtitle) t.addText(cfg.subtitle, { x: 0.9, y: 0.85, w: 8.2, h: 0.3, color: C.textSec, fontSize: 11, fontFace: FONT });
  t.startGroup();

  // Groups 2-3: option cards
  const options = cfg.options || [];
  const delays = [0, 400];
  const optionLayout = cardLayout(options.length, 0.6, 0.6, 0.4);
  const cardY = cfg.subtitle ? 1.5 : 1.3;

  options.forEach((opt, i) => {
    const x = optionLayout[i].x;
    const w = optionLayout[i].w;
    const isRec = opt.recommended;
    t.addShape(t.SH.ROUNDED_RECTANGLE, { x, y: cardY, w, h: 2.75, fill: { color: isRec ? C.blueBg : C.white }, line: { color: isRec ? C.blue : C.cardBorder, width: isRec ? 1.5 : 0.75 }, rectRadius: 0.18, shadow: isRec ? { type: 'outer', blur: 6, offset: 2, color: '000000', opacity: 0.08 } : undefined });
    if (isRec) {
      // Subtle accent bar at top of recommended card
      t.addShape(t.SH.ROUNDED_RECTANGLE, { x: x + 0.08, y: cardY + 0.06, w: w - 0.16, h: 0.035, fill: { color: C.blue }, rectRadius: 0.02 });
      t.addShape(t.SH.ROUNDED_RECTANGLE, { x: x + w - 1.4, y: cardY + 0.15, w: 1.2, h: 0.25, fill: { color: C.green }, rectRadius: 0.04 });
      t.addText('Рекомендуем', { x: x + w - 1.4, y: cardY + 0.15, w: 1.2, h: 0.25, color: C.white, fontSize: 7.5, fontFace: FONT, bold: true, align: 'center', valign: 'middle' });
    }
    t.addText(opt.name, { x: x + 0.25, y: cardY + 0.2, w: w - 1.8, h: 0.4, color: C.text, fontSize: 20, fontFace: FONT, bold: true });
    t.addText(opt.subtitle || '', { x: x + 0.25, y: cardY + 0.6, w: w - 0.5, h: 0.25, color: C.blue, fontSize: 11, fontFace: FONT, bold: true });
    t.addText(opt.features, { x: x + 0.25, y: cardY + 0.95, w: w - 0.5, h: 1.3, color: C.textSec, fontSize: 9, fontFace: FONT, wrap: true, lineSpacingMultiple: 1.3 });
    const priceColor = opt.priceStyle === 'accent' ? C.blue : C.tagBg;
    const priceTextColor = opt.priceStyle === 'accent' ? C.white : C.textSec;
    const priceW = Math.min(w - 0.5, Math.max(2.2, opt.price.length * 0.13));
    t.addShape(t.SH.ROUNDED_RECTANGLE, { x: x + 0.25, y: cardY + 2.56, w: priceW, h: 0.3, fill: { color: priceColor }, rectRadius: 0.06 });
    t.addText(opt.price, { x: x + 0.25, y: cardY + 2.56, w: priceW, h: 0.3, color: priceTextColor, fontSize: opt.priceStyle === 'accent' ? 11 : 9.5, fontFace: FONT, bold: true, align: 'center', valign: 'middle' });
    t.startGroup();
    delays.push(400 + (i + 1) * 300);
  });

  // Group 4: footer
  if (cfg.footer) {
    t.addText(cfg.footer, { x: 0.6, y: 4.75, w: 8.8, h: 0.25, color: C.textTer, fontSize: 9, fontFace: FONT, align: 'center' });
    delays.push(delays[delays.length - 1] + 500);
  }

  return { delays, dur: 700 };
}

async function renderBudget(pptx, t, cfg, assets) {
  bg(t.slide);

  // Group 1: title
  t.addText(cfg.title, { x: 0.83, y: 0.42, w: 8.5, h: 0.55, color: C.text, fontSize: 22, fontFace: FONT, bold: true });
  t.startGroup();

  // Group 2: pie chart + summary
  if (cfg.pieChart) {
    const pieImg = await createPieChartImg(cfg.pieChart.items, cfg.pieChart.title || '');
    t.addImage({ data: pieImg, x: 5.5, y: 0.9, w: 3.5, h: 3.5 });
  }
  const s = cfg.summary || {};
  t.addShape(t.SH.ROUNDED_RECTANGLE, { x: 0.8, y: 1.1, w: 4.0, h: 1.2, fill: { color: C.bgSec }, rectRadius: 0.12 });
  t.addText(s.label || '', { x: 1.02, y: 1.24, w: 3.6, h: 0.3, color: C.gray86, fontSize: 10, fontFace: FONT, align: 'center' });
  t.addText(s.value || '', { x: 1.02, y: 1.45, w: 3.6, h: 0.55, color: C.blue, fontSize: 28, fontFace: FONT, bold: true, align: 'center' });
  if (s.note) t.addText(s.note, { x: 1.02, y: 1.96, w: 3.6, h: 0.25, color: C.gray86, fontSize: 9, fontFace: FONT, align: 'center' });
  t.startGroup();

  // Group 3: line items
  const items = cfg.lineItems || [];
  const startY = 2.6;
  const step = 0.38;
  items.forEach((item, i) => {
    const y = startY + i * step;
    t.addText(item.label, { x: 1.0, y, w: 3.0, h: 0.3, color: C.text, fontSize: 9, fontFace: FONT });
    t.addText(item.value, { x: 4.0, y, w: 1.5, h: 0.3, color: C.gray86, fontSize: 9, fontFace: FONT, align: 'right' });
    t.addShape(t.SH.LINE, { x: 1.0, y: y + 0.3, w: 4.5, h: 0, line: { color: C.cardBorder, width: 0.3 } });
  });

  return { delays: [0, 400, 900], dur: 600 };
}

async function renderNextSteps(pptx, t, cfg, assets) {
  bg(t.slide);

  // Group 1: icon
  const iconKey = cfg.icon || 'handshake';
  const iconPath = ICONS[iconKey] || ICONS.handshake;
  const iconImg = await createIconImg(iconPath, '#0071E3', 200);
  t.addImage({ data: iconImg, x: 4.2, y: 1.0, w: 1.6, h: 1.6 });
  t.startGroup();

  // Group 2: title + subtitle
  t.addText(cfg.title || '', { x: 2, y: 2.01, w: 6, h: 0.55, color: C.text, fontSize: 30, fontFace: FONT, bold: true, align: 'center' });
  t.addText(cfg.subtitle || '', { x: 2, y: 2.59, w: 6, h: 0.4, color: C.blue, fontSize: 16, fontFace: FONT, align: 'center' });
  t.startGroup();

  // Group 3: step cards
  const steps = cfg.steps || [];
  const layout = cardLayout(steps.length, 1.0, 1.0, 0.3);
  steps.forEach((step, i) => {
    const x = layout[i].x;
    const w = layout[i].w;
    t.addShape(t.SH.ROUNDED_RECTANGLE, { x, y: 3.2, w, h: 1.1, fill: { color: C.bgSec }, rectRadius: 0.1 });
    t.addText(step.number || String(i + 1), { x, y: 3.28, w, h: 0.22, color: C.blue, fontSize: 11, fontFace: FONT, bold: true, align: 'center' });
    t.addText(step.title, { x, y: 3.5, w, h: 0.22, color: C.black, fontSize: 11, fontFace: FONT, bold: true, align: 'center' });
    t.addText(step.description || '', { x, y: 3.72, w, h: 0.45, color: C.gray86, fontSize: 8.5, fontFace: FONT, align: 'center', wrap: true });
  });

  return { delays: [0, 300, 700], dur: 800 };
}

async function renderQuestions(pptx, t, cfg, assets) {
  bg(t.slide);

  // Group 1: title + accent bar
  t.addText(cfg.title || 'Questions', { x: 0.9, y: 0.3, w: 8.2, h: 0.5, color: C.text, fontSize: 24, fontFace: FONT, bold: true });
  accentBar(t, 0.9, 0.75, 1.5);
  t.startGroup();

  // Groups 2+: each question row
  const items = cfg.items || [];
  const delays = [0];
  items.forEach((q, i) => {
    const y = 1.0 + i * 0.68;
    t.addShape(t.SH.ROUNDED_RECTANGLE, { x: 0.6, y, w: 8.8, h: 0.56, fill: { color: i % 2 === 0 ? C.bgSec : C.white }, rectRadius: 0.08 });
    t.addImage({ data: assets.checkImg, x: 0.8, y: y + 0.15, w: 0.22, h: 0.22 });
    t.addText(q.title, { x: 1.15, y: y + 0.05, w: 2.2, h: 0.45, color: C.blue, fontSize: 10, fontFace: FONT, bold: true, valign: 'middle' });
    t.addText(q.body, { x: 3.5, y: y + 0.05, w: 5.7, h: 0.45, color: C.textSec, fontSize: 9, fontFace: FONT, wrap: true, valign: 'middle', lineSpacingMultiple: 1.25 });
    t.startGroup();
    delays.push(400 + i * 250);
  });

  return { delays, dur: 500 };
}

// ── Renderer Dispatch ──
const RENDERERS = {
  title: renderTitle,
  overview: renderOverview,
  section: renderSection,
  'process-flow': renderProcessFlow,
  workflow: renderWorkflow,
  comparison: renderComparison,
  budget: renderBudget,
  'next-steps': renderNextSteps,
  questions: renderQuestions,
};

// ── Main ──
async function build() {
  const configPath = process.argv[2];
  if (!configPath || !fs.existsSync(configPath)) {
    console.error('Usage: node build-presentation.js <slides-config.json> [output.pptx]');
    process.exit(1);
  }
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const outputPath = process.argv[3] || config.meta?.outputFileName || 'Presentation.pptx';

  // ── Config Validation ──
  const validTypes = Object.keys(RENDERERS);
  if (!config.slides || !Array.isArray(config.slides)) {
    console.error('Validation error: config.slides must be an array');
    process.exit(1);
  }
  const typeCounts = {};
  config.slides.forEach((s, i) => {
    const label = `Slide ${i + 1}`;
    if (!s.type) {
      console.error(`${label}: missing required field "type"`);
      process.exit(1);
    }
    if (!validTypes.includes(s.type)) {
      console.error(`${label}: unknown type "${s.type}" (valid: ${validTypes.join(', ')})`);
      process.exit(1);
    }
    typeCounts[s.type] = (typeCounts[s.type] || 0) + 1;
    // Type-specific required fields
    if (s.type === 'process-flow') {
      if (!s.flowRows || !Array.isArray(s.flowRows) || s.flowRows.length < 1) {
        console.error(`${label} (process-flow): "flowRows" must be an array with at least 1 step row`);
        process.exit(1);
      }
    }
    if (s.type === 'workflow') {
      if (!s.flowSteps || !Array.isArray(s.flowSteps)) {
        console.error(`${label} (workflow): "flowSteps" must be an array`);
        process.exit(1);
      }
    }
    if (s.type === 'comparison') {
      if (!s.options || !Array.isArray(s.options) || s.options.length !== 2) {
        console.error(`${label} (comparison): "options" must be an array with exactly 2 items`);
        process.exit(1);
      }
    }
    if (s.type === 'budget') {
      if (!s.pieChart || !s.pieChart.items) console.warn(`${label} (budget): missing "pieChart.items"`);
      if (!s.lineItems) console.warn(`${label} (budget): missing "lineItems"`);
    }
    // Optional field warnings
    if (!s.title && !['title'].includes(s.type)) console.warn(`${label} (${s.type}): missing optional "title"`);
    if (!s.subtitle && ['overview', 'section', 'workflow', 'comparison'].includes(s.type)) console.warn(`${label} (${s.type}): missing optional "subtitle"`);
    if (!s.description && s.type === 'title') console.warn(`${label} (title): missing optional "description"`);
  });
  const typeList = Object.entries(typeCounts).map(([t, c]) => `${t}:${c}`).join(', ');
  console.log(`Config validated: ${config.slides.length} slides (${typeList})\n`);

  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = config.meta?.author || 'AI Automation';
  pptx.title = config.meta?.title || 'Presentation';
  const SH = pptx.shapes;

  // Pre-generate shared assets
  const assets = {
    glowBlue: await createGlowImg('#0071E3', 0.08),
    glowPurple: await createGlowImg('#AF52DE', 0.06),
    arrowImg: await createIconImg(ICONS.arrow, '#0071E3', 80),
    checkImg: await createIconImg(ICONS.check, '#34C759', 80),
    starImg: await createIconImg(ICONS.star, '#FF9500', 80),
  };

  const animConfig = {};
  const slides = config.slides || [];

  for (let si = 0; si < slides.length; si++) {
    const slideCfg = slides[si];
    const renderer = RENDERERS[slideCfg.type];
    if (!renderer) {
      console.warn(`Unknown slide type: ${slideCfg.type}, skipping`);
      continue;
    }

    const slide = pptx.addSlide();
    const tracker = new ShapeTracker(slide, SH);

    const timing = await renderer(pptx, tracker, slideCfg, assets);
    const groups = tracker.finalize();

    // Add page number indicator directly to slide (not through tracker, so it's not animated)
    if (slideCfg.type !== 'title' && slideCfg.type !== 'section') {
      slide.addText(String(si + 1), { x: 9.2, y: 5.25, w: 0.5, h: 0.2, color: C.textTer, fontSize: 7, fontFace: FONT, align: 'right' });
    }

    animConfig[si + 1] = {
      groups,
      delays: timing.delays.slice(0, groups.length),
      dur: timing.dur,
    };

    console.log(`Slide ${si + 1} (${slideCfg.type}): ${groups.length} groups, ${groups.reduce((s, g) => s + g.length, 0)} shapes`);
  }

  // Write PPTX
  const absOut = path.resolve(outputPath);
  await pptx.writeFile({ fileName: absOut });
  console.log(`\nPresentation saved: ${absOut}`);

  // Write animation config (sidecar JSON)
  const animPath = absOut.replace(/\.pptx$/i, '_animation-config.json');
  fs.writeFileSync(animPath, JSON.stringify(animConfig, null, 2));
  console.log(`Animation config: ${animPath}`);
}

build().catch(console.error);
