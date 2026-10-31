// Collection 10 — TOY BOX. Summer program · Boys Core · R/N half sleeve · Kids 16–20 (1–3 yrs).
// v2 after founder feedback ("too hand-drawn"): realistic 3D-rendered toys (3d/scenes.js,
// rendered by render-3d.mjs and cropped by crop-renders.py) with polished type, in the
// finish of the founder's reference packs (0951 K, 0822 K). Block Party kept from v1.
// Artboard = the garment front panel (240 x 300), so placement is part of the artwork.
import { halftone, sparkle, star, wave, r2 } from '../lib/svg.mjs';

const W = 240, H = 300, SIZE = [W, H];
const INK = {
  tomato: { name: 'Tomato', hex: '#FF4B2B' },
  blue: { name: 'Royal Blue', hex: '#2B6BFF' },
  yellow: { name: 'Sun Yellow', hex: '#FFC93C' },
  green: { name: 'Leaf Green', hex: '#2DB46B' },
};
const FULL = { name: 'Full colour (DTF)', hex: 'conic-gradient(#00c2ff,#ff3da8,#ffe600,#00c2ff)' };
const BAGEL = `font-family="Bagel Fat One"`;
const NAVY = '#1C2340';
// A cropped toy render placed inside a box (keeps its aspect ratio).
const toy = (asset, name, x, y, w, h, extra = '') =>
  `<image href="${asset(`output/assets/3d/${name}-crop.png`)}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet" ${extra}/>`;
// Painted-brush lettering: gradient fill with roughened edges.
const brushDefs = (id, from, to) => `
  <linearGradient id="${id}-g" x1="0" y1="0" x2="1" y2="0.4"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient>
  <filter id="${id}-f" x="-5%" y="-10%" width="110%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="2.6"/></filter>`;
const brush = (id, x, y, size, txt, extra = '') =>
  `<text x="${x}" y="${y}" font-family="Permanent Marker" font-size="${size}" fill="url(#${id}-g)" filter="url(#${id}-f)" ${extra}>${txt}</text>`;
const dots = (pts, fills) => pts.map(([x, y, r], i) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fills[i % fills.length]}"/>`).join('');

// 1. Rescue Squad — toy fire truck (chest) -------------------------------------
const rescue = ({ asset }) => `
  ${toy(asset, 'firetruck', 30, 34, 180, 124)}
  <text x="120" y="190" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="30" fill="${NAVY}" textLength="176" lengthAdjust="spacingAndGlyphs">RESCUE</text>
  <text x="120" y="222" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="30" fill="#E8322A" textLength="176" lengthAdjust="spacingAndGlyphs">SQUAD</text>
  <rect x="66" y="232" width="108" height="18" rx="9" fill="${NAVY}"/>
  <text x="120" y="245" text-anchor="middle" font-family="Space Mono" font-weight="700" font-size="9" fill="#FFFFFF" letter-spacing="1.5">STATION Nº 1</text>
  ${dots([[30, 60, 3], [210, 52, 4], [24, 150, 2.5], [216, 160, 3]], ['#E8322A', '#FFD23F', NAVY])}`;

// 2. Pool Party — rubber duck in a swim ring (full front) ----------------------
const poolParty = ({ id, asset }) => `
  <defs>${brushDefs(id('b'), '#2FB6FF', '#2B4BFF')}<path id="${id('arc')}" d="M6,100 Q120,20 234,100"/></defs>
  <text font-family="Permanent Marker" font-size="38" fill="url(#${id('b')}-g)" filter="url(#${id('b')}-f)"><textPath href="#${id('arc')}" startOffset="50%" text-anchor="middle">Pool Party</textPath></text>
  ${toy(asset, 'duck', 22, 92, 196, 136)}
  ${[0, 1, 2].map((i) => `<path d="${wave(26 + i * 10, 214 - i * 10, 238 + i * 14, 4, 34, i)}" fill="none" stroke="${i === 1 ? '#2FB6FF' : '#FFFFFF'}" stroke-width="5" stroke-linecap="round"/>`).join('')}
  <text x="120" y="292" text-anchor="middle" ${BAGEL} font-size="18" fill="${NAVY}" letter-spacing="2">splish · splash</text>
  ${[[34, 120, 9, '#FFFFFF'], [208, 132, 7, '#FFD23F'], [196, 64, 6, '#FFFFFF']].map(([x, y, r, f]) => `<path d="${sparkle(x, y, r)}" fill="${f}"/>`).join('')}`;

// 4. Chill Out — watermelon ice lolly (chest) -----------------------------------
const chillOut = ({ id, asset }) => `
  <defs>${brushDefs(id('b'), '#FF2E63', '#FF8A3D')}</defs>
  ${toy(asset, 'lolly', 18, 34, 92, 178)}
  ${brush(id('b'), 108, 104, 50, 'Chill', 'textLength="118" lengthAdjust="spacingAndGlyphs"')}
  ${brush(id('b'), 118, 158, 50, 'Out!', 'textLength="98" lengthAdjust="spacingAndGlyphs"')}
  <text x="114" y="186" font-family="Space Mono" font-weight="700" font-size="9" fill="${NAVY}" letter-spacing="2">100% SUMMER</text>
  ${[[214, 56, 8, '#FF3D57'], [104, 200, 6, '#2FBF5B'], [222, 196, 5, '#FFFFFF']].map(([x, y, r, f]) => `<path d="${sparkle(x, y, r)}" fill="${f}"/>`).join('')}`;

// 5. Zoom Zoom — toy race car along the hem + small chest flag ------------------
const zoom = ({ asset }) => {
  const flag = (x, y, s) => `<g transform="translate(${x} ${y}) rotate(-12) scale(${s})">
    <rect x="-2" y="0" width="3" height="36" rx="1.5" fill="${NAVY}"/>
    ${Array.from({ length: 4 }, (_, r) => Array.from({ length: 5 }, (_, c) => `<rect x="${1 + c * 6}" y="${r * 6}" width="6" height="6" fill="${(r + c) % 2 ? NAVY : '#FFFFFF'}"/>`).join('')).join('')}</g>`;
  return `
  ${flag(170, 52, 1)}
  <text x="168" y="112" font-family="Racing Sans One" font-size="24" fill="${NAVY}">ZOOM!</text>
  ${[0, 1, 2, 3].map((i) => `<rect x="${4 + i * 6}" y="${236 + i * 11}" width="${46 - i * 8}" height="4" rx="2" fill="${i % 2 ? '#2B6BFF' : NAVY}"/>`).join('')}
  ${toy(asset, 'racecar', 34, 210, 204, 84)}
  <text x="40" y="206" font-family="Racing Sans One" font-size="26" fill="#2B6BFF" transform="skewX(-8)">zoom zoom</text>`;
};

// 6. Sky High — hot-air balloon (full front) ------------------------------------
const skyHigh = ({ asset }) => `
  ${dots([[30, 40, 2.5], [60, 90, 1.8], [206, 30, 2.2], [214, 120, 1.8], [24, 170, 2], [190, 80, 1.5], [44, 230, 1.6], [220, 200, 2.4]], ['#FFFFFF', '#FFD23F'])}
  ${[[40, 64, 9, '#FFD23F'], [200, 60, 7, '#FFFFFF'], [214, 168, 6, '#2FB6FF']].map(([x, y, r, f]) => `<path d="${sparkle(x, y, r)}" fill="${f}"/>`).join('')}
  ${toy(asset, 'balloon', 34, 22, 172, 200)}
  <text x="120" y="258" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="34" fill="#FFFFFF" textLength="188" lengthAdjust="spacingAndGlyphs">SKY HIGH</text>
  <text x="120" y="282" text-anchor="middle" font-family="Instrument Serif" font-style="italic" font-size="18" fill="#FFD23F">little adventures, big skies</text>`;

const shade = (id, clipShape, box, fill, toneFn, cell = 4.2) =>
  `<clipPath id="${id}">${clipShape}</clipPath>${halftone({ ...box, cell, fill, clip: id, angle: 45, tone: toneFn })}`;

// 3. Block Party — tumbling toy blocks, full front -------------------------------
const block = (x, y, s, colour, label, labelColour, shadeInk, id) => {
  const d = s * 0.32;
  const top = `M${x},${y} L${x + d},${y - d} L${x + s + d},${y - d} L${x + s},${y} Z`;
  const side = `M${x + s},${y} L${x + s + d},${y - d} L${x + s + d},${y + s - d} L${x + s},${y + s} Z`;
  return `
    <path d="${top}" fill="${colour}"/><path d="${side}" fill="${colour}"/><rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${colour}"/>
    ${shade(id, `<path d="${side}"/>`, { x: x + s, y: y - d, w: d, h: s + d }, shadeInk, () => 0.55, 3.4)}
    ${halftone({ x, y: y - d, w: s + d, h: d, cell: 3.4, fill: '#FFFFFF', tone: () => 0, clip: '' })}
    <rect x="${x + s * 0.12}" y="${y + s * 0.12}" width="${s * 0.76}" height="${s * 0.76}" rx="${s * 0.1}" fill="none" stroke="${labelColour}" stroke-width="${s * 0.06}"/>
    <text x="${x + s / 2}" y="${y + s * 0.72}" text-anchor="middle" ${BAGEL} font-size="${s * 0.58}" fill="${labelColour}">${label}</text>`;
};
const blocks = ({ id }) => {
  const { tomato, blue, yellow, green } = INK;
  const B = blue.hex;
  const list = [
    [70, 220, 64, tomato.hex, 'A', yellow.hex, 0], [130, 232, 54, yellow.hex, 'B', B, 6], [96, 156, 58, green.hex, 'C', yellow.hex, -8],
    [154, 168, 50, B, '1', yellow.hex, 10], [118, 98, 52, tomato.hex, '2', yellow.hex, 4], [18, 238, 44, B, '3', yellow.hex, -12],
    [190, 96, 40, green.hex, '★', yellow.hex, 14], [20, 112, 40, yellow.hex, '♥', tomato.hex, -10], [186, 238, 42, green.hex, 'Z', yellow.hex, 8],
  ];
  const ring = (x, y, r, c) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${c}" stroke-width="${r * 0.45}"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.3}" r="${r * 0.12}" fill="#FFFFFF"/>`;
  return `
  ${list.map(([x, y, s, c, l, lc, rot], i) => `<g transform="rotate(${rot} ${x + s / 2} ${y + s / 2})">${block(x, y, s, c, l, lc, c === B ? green.hex : B, id(`b${i}`))}</g>`).join('')}
  ${ring(52, 70, 16, tomato.hex)}${ring(196, 56, 12, B)}${ring(70, 196, 9, yellow.hex)}
  ${[[30, 40], [120, 44], [212, 150], [16, 176], [228, 210], [150, 62]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${3 + (i % 3)}" fill="${[tomato.hex, B, green.hex, yellow.hex][i % 4]}"/>`).join('')}
  ${[[92, 40, 9, yellow.hex], [222, 112, 8, tomato.hex], [40, 150, 7, green.hex]].map(([x, y, r, f]) => `<path d="${star(x, y, 5, r, r * 0.45)}" fill="${f}"/>`).join('')}`;
};

const item = (ref, name, colour, svg, inks) => ({ ref, name, colour, art: { front: { svg, size: SIZE, inks } } });

export default {
  id: 'c10-toy-box',
  code: 'SUMMER · BOYS CORE · R/N H/S · KIDS 16–20 (1–3 YRS)',
  title: 'TOY BOX',
  technique: 'DIGITAL PRINT (DTF) + SCREEN',
  subtitle: 'realistic toy prints · chest / hem / full front',
  layout: 'single',
  countInks: true,
  footer: 'Artboard = garment front panel, so each print sits where it prints (chest / hem / full).',
  items: [
    item('TB-07', 'Rescue Squad', { name: 'Sky Blue', hex: '#A9D6F5' }, rescue, [FULL]),
    item('TB-08', 'Pool Party', { name: 'Mint', hex: '#BFE6D1' }, poolParty, [FULL]),
    item('TB-03', 'Block Party', { name: 'Off White', hex: '#F4EFE6' }, blocks, [INK.tomato, INK.blue, INK.yellow, INK.green]),
    item('TB-09', 'Chill Out', { name: 'Peach', hex: '#FFC8A8' }, chillOut, [FULL]),
    item('TB-10', 'Zoom Zoom', { name: 'Lemon', hex: '#FFF0A8' }, zoom, [FULL]),
    item('TB-11', 'Sky High', { name: 'Navy', hex: '#1F2A44' }, skyHigh, [FULL]),
  ],
};
