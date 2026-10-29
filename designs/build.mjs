// Builds design-proposal sheets: garment flats + placed prints, laid out like
// the in-house "CORE" sheets. Usage: node build.mjs sheets/<sheet>.json
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { GARMENT_VIEWBOX, PLACEMENTS, SILHOUETTES, isDark } from './src/garment.mjs';
import { PRINTS } from './src/prints.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const root = path.dirname(new URL(import.meta.url).pathname);
const FONTS = {
  Anton: 'Anton', Graduate: 'Graduate', 'Press Start 2P': 'PressStart2P', Bungee: 'Bungee',
  Monoton: 'Monoton', 'Permanent Marker': 'PermanentMarker', 'Bowlby One': 'BowlbyOne', 'Racing Sans One': 'RacingSansOne',
};

function fontFaces() {
  return Object.entries(FONTS)
    .map(([family, file]) => {
      const data = readFileSync(path.join(root, 'fonts', `${file}.woff2`)).toString('base64');
      return `@font-face{font-family:'${family}';src:url(data:font/woff2;base64,${data}) format('woff2');}`;
    })
    .join('\n');
}

function printSvg(id, attrs = '') {
  const print = PRINTS[id];
  if (!print) throw new Error(`Unknown print "${id}"`);
  return `<svg viewBox="0 0 300 300" ${attrs}>${print.svg()}</svg>`;
}

function garmentWithPrint(sheet, item) {
  const place = PLACEMENTS[item.placement];
  if (!place) throw new Error(`Unknown placement "${item.placement}"`);
  const garment = SILHOUETTES[sheet.silhouette]({ colour: item.hex, view: sheet.view });
  const { cx, cy, width } = place;
  return `<svg class="garment" viewBox="${GARMENT_VIEWBOX}">${garment}
    ${printSvg(item.print, `x="${cx - width / 2}" y="${cy - width / 2}" width="${width}" height="${width}"`)}</svg>`;
}

function cell(sheet, item) {
  const print = PRINTS[item.print];
  const labelText = isDark(item.hex) ? '#fff' : '#111';
  const chips = print.inks
    .map((ink) => `<li><span class="chip" style="background:${ink.hex}"></span>${ink.name}</li>`)
    .join('');
  return `<figure class="cell">
    <div class="label" style="background:${item.hex};color:${labelText}">${item.colour}</div>
    <div class="row">
      ${garmentWithPrint(sheet, item)}
      <aside>
        <div class="tag">PRINT</div>
        <div class="art" style="background:${item.hex}">${printSvg(item.print)}</div>
        <ul>${chips}</ul>
        <div class="count">${print.inks.length} COL</div>
      </aside>
    </div>
    <figcaption><b>${item.ref}</b> ${print.name}</figcaption>
  </figure>`;
}

function sheetHtml(sheet) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  ${fontFaces()}
  @page { size: A4 landscape; margin: 0; }
  * { box-sizing: border-box; }
  body { margin: 0; background: #fff; font-family: Inter, Arial, sans-serif; }
  .sheet { width: 1600px; height: 1130px; padding: 56px 70px 40px; display: flex; flex-direction: column; }
  h1 { margin: 0; text-align: center; color: #E31E24; font-weight: 900; font-size: 40px; letter-spacing: .5px; }
  .status { text-align: center; color: #777; font-size: 15px; margin: 8px 0 22px; }
  .grid { flex: 1; display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(2, 1fr); gap: 24px 24px; }
  .cell { margin: 0; display: flex; flex-direction: column; align-items: center; }
  .label { width: 190px; text-align: center; font-weight: 700; font-size: 15px; padding: 3px 0; border: 1px solid #333; }
  .row { display: flex; align-items: center; gap: 10px; margin-top: 8px; }
  svg.garment { width: 380px; height: 361px; }
  aside { width: 92px; }
  .tag { color: #E31E24; font-weight: 800; font-size: 13px; text-decoration: underline; }
  .art { width: 86px; height: 86px; padding: 6px; border: 1px solid #ccc; margin: 4px 0 6px; }
  .art svg { width: 100%; height: 100%; display: block; }
  ul { list-style: none; margin: 0; padding: 0; font-size: 11px; color: #333; }
  li { display: flex; align-items: center; gap: 5px; margin: 3px 0; }
  .chip { width: 14px; height: 14px; border: 1px solid #999; flex: none; }
  .count { font-size: 11px; font-weight: 700; margin-top: 4px; }
  figcaption { font-size: 13px; color: #444; margin-top: 2px; }
  </style></head><body><section class="sheet">
  <h1>${sheet.title}</h1><div class="status">${sheet.status}</div>
  <div class="grid">${sheet.items.map((item) => cell(sheet, item)).join('')}</div>
  </section></body></html>`;
}

// Standalone print artwork with embedded fonts, on a transparent background.
function standalonePrint(id) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="3000" height="3000">
<style>${fontFaces()}</style>${PRINTS[id].svg()}</svg>\n`;
}

const sheetPath = process.argv[2];
if (!sheetPath) throw new Error('Usage: node build.mjs sheets/<sheet>.json');
const sheet = JSON.parse(readFileSync(sheetPath, 'utf8'));
const out = path.join(root, 'output', sheet.id);
mkdirSync(path.join(out, 'prints'), { recursive: true });

const html = sheetHtml(sheet);
writeFileSync(path.join(out, `${sheet.id}.html`), html);
for (const item of sheet.items) writeFileSync(path.join(out, 'prints', `${item.ref}-${item.print}.svg`), standalonePrint(item.print));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1130 }, deviceScaleFactor: 2 });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: path.join(out, `${sheet.id}.png`) });
await page.pdf({ path: path.join(out, `${sheet.id}.pdf`), width: '1600px', height: '1130px', printBackground: true });
for (const item of sheet.items) {
  await page.setViewportSize({ width: 1500, height: 1500 });
  await page.setContent(`<body style="margin:0;background:${item.hex}"><style>${fontFaces()}</style>${printSvg(item.print, 'width="1500" height="1500"')}</body>`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(out, 'prints', `${item.ref}-${item.print}-preview.png`) });
}
await browser.close();
console.log(`Built ${path.relative(root, out)}`);
