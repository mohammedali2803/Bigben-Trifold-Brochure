// Builds print-design collections: each print as a transparent production PNG,
// a preview on its garment colour, and one overview sheet per collection.
// Usage: node build-collections.mjs [collection-id ...]   (default: all)
import { mkdirSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { ROOT, openBrowser, svgToPng, htmlToPng } from './lib/render.mjs';

const COLLECTION_DIR = path.join(ROOT, 'collections');
const OUT = path.join(ROOT, 'output', 'collections');

const SIDE_LABEL = { front: 'FRONT', back: 'BACK', chest: 'CHEST', tile: 'REPEAT TILE' };
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function artBody(item, side, ctx) {
  const art = item.art[side];
  const id = (s) => `${item.ref}-${side}-${s}`;
  return art.svg({ id, asset: (p) => `${ctx.base}/${p}`, colour: item.colour });
}

// Optional placement guide (e.g. a garment-front outline) drawn under the artwork
// in previews and sheets only, never in the production PNG.
const guide = (item, side) => item.art[side].guide?.(item.colour.hex) ?? '';

function inlineSvg(item, side, ctx, attrs = '') {
  const art = item.art[side];
  const [w, h] = art.size ?? [300, 300];
  return `<svg viewBox="0 0 ${w} ${h}" ${attrs}>${guide(item, side)}${artBody(item, side, ctx)}</svg>`;
}

function aopTile(item, ctx, w, h) {
  const art = item.art.tile;
  const [tw, th] = art.size;
  const scale = art.preview ?? 0.5;
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
    <defs><pattern id="${item.ref}-pat" width="${tw * scale}" height="${th * scale}" patternUnits="userSpaceOnUse">
      <g transform="scale(${scale})">${artBody(item, 'tile', ctx)}</g></pattern></defs>
    <rect width="${w}" height="${h}" fill="url(#${item.ref}-pat)"/></svg>`;
}

function tileVisual(collection, item, ctx) {
  if (collection.layout === 'aop') return `<div class="swatch">${aopTile(item, ctx, 475, 370)}</div>`;
  if (collection.layout === 'single')
    return `<div class="swatch"><div class="art single" style="aspect-ratio:${(item.art.front.size ?? [1, 1]).join('/')}">${inlineSvg(item, 'front', ctx)}</div></div>`;
  const [a, b] = collection.layout === 'front-back' ? ['front', 'back'] : ['chest', 'back'];
  return `<div class="swatch split">
    <div class="panel ${a}"><span>${SIDE_LABEL[a]}</span><div class="art">${inlineSvg(item, a, ctx)}</div></div>
    <div class="panel ${b}"><span>${SIDE_LABEL[b]}</span><div class="art">${inlineSvg(item, b, ctx)}</div></div>
  </div>`;
}

function inkList(item, collection) {
  const sides = Object.keys(item.art);
  const groups = sides
    .filter((s) => item.art[s].inks)
    .map((s) => ({ label: sides.length > 1 ? SIDE_LABEL[s] : '', inks: item.art[s].inks }));
  return groups
    .map(
      (g) => `<div class="inks">${g.label ? `<b>${g.label}</b>` : ''}${g.inks
        .map((ink) => `<i style="background:${ink.hex}" title="${ink.name}"></i><em>${ink.name}</em>`)
        .join('')}${collection.countInks ? `<strong>${g.inks.some((i) => i.name.startsWith('Full colour')) ? 'DTF' : `${g.inks.length} COL`}</strong>` : ''}</div>`,
    )
    .join('');
}

function sheetHtml(collection, ctx) {
  const tiles = collection.items
    .map(
      (item) => `<figure style="--bg:${item.colour.hex}">
      ${tileVisual(collection, item, ctx)}
      <figcaption>
        <div class="line"><span class="ref">${item.ref}</span><span class="name">${item.name}</span>
          <span class="garment"><i style="background:${item.colour.hex}"></i>${item.colour.name}</span></div>
        ${inkList(item, collection)}
      </figcaption></figure>`,
    )
    .join('');
  return `<style>
    body { font-family: 'Space Mono', monospace; }
    .sheet { width: 1600px; height: 1130px; background: #F3F1EC; padding: 44px 56px 36px; box-sizing: border-box; display: flex; flex-direction: column; color: #151515; }
    header { display: flex; align-items: flex-end; justify-content: space-between; border-bottom: 2px solid #151515; padding-bottom: 14px; }
    .kicker { font-size: 13px; letter-spacing: 3px; text-transform: uppercase; color: #555; }
    h1 { font-family: 'Unbounded'; font-weight: 900; font-size: 54px; line-height: 1; margin: 6px 0 0; letter-spacing: -1px; }
    .meta { text-align: right; font-size: 13px; line-height: 1.6; }
    .pill { display: inline-block; background: #151515; color: #F3F1EC; padding: 6px 14px; border-radius: 99px; font-weight: 700; letter-spacing: 1px; font-size: 13px; }
    .grid { flex: 1; display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(2, 1fr); gap: 22px 26px; margin-top: 22px; }
    figure { margin: 0; display: flex; flex-direction: column; min-height: 0; }
    .swatch { flex: 1; background: var(--bg); border-radius: 14px; display: flex; align-items: center; justify-content: center; overflow: hidden; min-height: 0; position: relative; }
    .art.single { height: 86%; aspect-ratio: 1; }
    .art svg { width: 100%; height: 100%; }
    .split { gap: 0; }
    .panel { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; flex: 1; }
    .panel + .panel { border-left: 1.5px dashed rgba(127,127,127,.45); }
    .panel span { position: absolute; top: 10px; left: 12px; font-size: 10px; letter-spacing: 2px; font-weight: 700; color: #fff; background: rgba(0,0,0,.38); padding: 2px 8px; border-radius: 99px; }
    .panel .art { width: 88%; height: 80%; display: flex; align-items: center; justify-content: center; }
    .panel.chest { flex: .62; }
    .panel.chest .art { width: 34%; height: auto; aspect-ratio: 1; margin: -40% 0 0 18%; }
    figcaption { padding-top: 9px; font-size: 12px; }
    .line { display: flex; align-items: baseline; gap: 10px; }
    .ref { font-weight: 700; }
    .name { font-family: 'Unbounded'; font-weight: 700; font-size: 16px; flex: 1; }
    .garment { display: flex; align-items: center; gap: 6px; color: #444; }
    i { display: inline-block; width: 13px; height: 13px; border-radius: 50%; border: 1px solid rgba(0,0,0,.25); vertical-align: -2px; flex: none; }
    .inks { display: flex; align-items: center; gap: 5px; margin-top: 5px; color: #555; flex-wrap: wrap; font-size: 11px; }
    .inks b { font-size: 10px; letter-spacing: 1px; margin-right: 2px; color: #151515; }
    .inks em { font-style: normal; margin-right: 8px; }
    .inks strong { margin-left: auto; color: #151515; }
    footer { margin-top: 14px; font-size: 11px; color: #777; display: flex; justify-content: space-between; }
  </style>
  <section class="sheet">
    <header>
      <div><div class="kicker">Bigben · print development · ${collection.code}</div><h1>${collection.title}</h1></div>
      <div class="meta"><span class="pill">${collection.technique}</span><br>${collection.items.length} colourways · ${collection.subtitle}</div>
    </header>
    <div class="grid">${tiles}</div>
    <footer><span>Design proposal — for approval, not for production. Garment colours on screen are approximate; match to fabric swatches.</span><span>${collection.footer ?? ''}</span></footer>
  </section>`;
}

async function buildCollection(ctx, collection) {
  const dir = path.join(OUT, collection.id);
  mkdirSync(path.join(dir, 'prints'), { recursive: true });
  for (const item of collection.items) {
    for (const [side, art] of Object.entries(item.art)) {
      const [w, h] = art.size ?? [300, 300];
      const name = `${item.ref}-${slug(item.name)}${Object.keys(item.art).length > 1 || side === 'tile' ? `-${side}` : ''}`;
      const body = artBody(item, side, ctx);
      await svgToPng(ctx, { w, h, body }, path.join(dir, 'prints', `${name}.png`), art.px ?? 3000);
      // Preview on the garment colour: prints get a margin, repeat tiles show a 3 x 3 repeat.
      const preview =
        side === 'tile'
          ? { w: w * 3, h: h * 3, body: `<rect width="${w * 3}" height="${h * 3}" fill="${item.colour.hex}"/>${[0, 1, 2].flatMap((i) => [0, 1, 2].map((j) => `<g transform="translate(${i * w} ${j * h})">${body}</g>`)).join('')}` }
          : { w: w * 1.24, h: h + w * 0.24, body: `<rect width="${w * 1.24}" height="${h + w * 0.24}" fill="${item.colour.hex}"/><g transform="translate(${w * 0.12} ${w * 0.12})">${guide(item, side)}${body}</g>` };
      await svgToPng(ctx, preview, path.join(dir, 'prints', `${name}-preview.png`), 1400);
    }
  }
  await htmlToPng(ctx, sheetHtml(collection, ctx), path.join(dir, `${collection.id}-overview.png`), { width: 1600, height: 1130 });
  console.log(`built ${collection.id}`);
}

const wanted = process.argv.slice(2);
const files = readdirSync(COLLECTION_DIR).filter((f) => f.endsWith('.mjs')).sort();
const ctx = await openBrowser();
try {
  for (const file of files) {
    const collection = (await import(path.join(COLLECTION_DIR, file))).default;
    if (wanted.length && !wanted.includes(collection.id)) continue;
    await buildCollection(ctx, collection);
  }
} finally {
  await ctx.close();
}
