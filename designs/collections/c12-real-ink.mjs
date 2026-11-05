// Collection 12 — REAL INK. Boys 30–36 (10–14 yrs), oversized, realistic texture prints.
// Built from the founder's Pinterest references (marble pour, torn carpet, blackletter,
// hem flames, worn shoulder ornament, grunge bandana). Textures are generated
// procedurally (textures/*.py, lib/ornament.mjs) and separated into flat screen inks.
// House rule: no dates or years in any print.
import { carpet, rosette, paisley, band, wear, torn } from '../lib/ornament.mjs';
import { r2 } from '../lib/svg.mjs';

const SIZE = [300, 400];
const INK = {
  mint: { name: 'Mint', hex: '#7DF0C2' },
  white: { name: 'White', hex: '#FFFFFF' },
  navy: { name: 'Ink Navy', hex: '#1C2340' },
  brown: { name: 'Espresso', hex: '#3A2A22' },
  black: { name: 'Black', hex: '#141414' },
  cream: { name: 'Off White', hex: '#F4F1EA' },
  orange: { name: 'Flame Orange', hex: '#FF7A1A' },
  grey: { name: 'Slate Grey', hex: '#8A8F96' },
};
const tex = (asset, name) => `<image href="${asset(`output/assets/textures/${name}.png`)}" x="0" y="0" width="300" height="400" preserveAspectRatio="none"/>`;
const MONO = 'font-family="Space Mono"';
const rnd = (seed) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const splatter = (seed, n, box, fill, maxR = 2.6) => {
  const R = rnd(seed);
  return Array.from({ length: n }, () => `<circle cx="${r2(box[0] + R() * box[2])}" cy="${r2(box[1] + R() * box[3])}" r="${r2(0.4 + R() ** 4 * maxR)}" fill="${fill}"/>`).join('');
};

// 1. Unreal — marbled pour (front, full coverage) ---------------------------------
const unreal = ({ asset }) => `
  ${tex(asset, 'marble-sample')}
  <text x="150" y="176" text-anchor="middle" font-family="Archivo" font-weight="800" font-size="30" fill="${INK.navy.hex}" textLength="196" lengthAdjust="spacingAndGlyphs">UNREAL</text>
  ${['when something is so good it feels', 'like it cannot be real. that is you.'].map((t, i) => `<text x="150" y="${188 + i * 8}" text-anchor="middle" ${MONO} font-size="5.6" fill="${INK.navy.hex}">${t}</text>`).join('')}
  <text x="34" y="250" ${MONO} font-weight="700" font-size="6" fill="${INK.navy.hex}">ORIGINAL</text>
  <text x="34" y="257" ${MONO} font-size="5.5" fill="${INK.navy.hex}">one of one</text>
  <text x="120" y="244" ${MONO} font-weight="700" font-size="6" fill="${INK.navy.hex}">FEARLESS</text>
  <text x="120" y="251" ${MONO} font-size="5.5" fill="${INK.navy.hex}">no second thoughts</text>`;

// 2. Old Soul — torn vintage carpet with script (back) -----------------------------
const oldSoul = ({ id }) => {
  const B = INK.brown.hex;
  const holes = [
    'M70,120 C120,96 200,110 238,150 C262,176 250,230 214,250 C176,270 120,262 86,236 C56,212 40,150 70,120 Z',
    'M222,90 C236,84 246,96 240,108 C232,120 216,114 214,104 Z',
    'M62,258 C78,250 94,262 88,276 C80,290 60,284 58,272 Z',
  ];
  return `
  <defs>${torn(id('t'), 22, 6)}${wear(id('w'), { amount: 0.3 })}
    <mask id="${id('m')}" maskUnits="userSpaceOnUse" x="0" y="0" width="300" height="400">
      <rect x="30" y="56" width="240" height="300" fill="#fff"/>
      <g>${carpet(30, 56, 240, 300, '#000', 5)}</g>
      <g fill="#000" filter="url(#${id('t')})">${holes.map((d) => `<path d="${d}"/>`).join('')}</g>
    </mask></defs>
  <g filter="url(#${id('w')})"><rect x="20" y="40" width="260" height="330" fill="${B}" mask="url(#${id('m')})"/></g>
  <g filter="url(#${id('w')})">
    <text x="150" y="182" text-anchor="middle" font-family="Pinyon Script" font-size="62" fill="${B}" transform="rotate(-8 150 180)">Old Soul</text>
    <text x="150" y="214" text-anchor="middle" font-family="Instrument Serif" font-size="15" fill="${B}">Made of stories</text>
    ${['every scratch, every adventure, every friend.', 'carried with you, wherever you go.'].map((t, i) => `<text x="150" y="${226 + i * 7}" text-anchor="middle" font-family="Instrument Serif" font-size="5.6" fill="${B}">${t}</text>`).join('')}
  </g>`;
};

// 3. Legacy — blackletter words stacked along a crescent, black + white (back) ------
const legacy = ({ id }) => {
  const at = (y) => { const t = (y - 210) / 175; return [r2(120 + 110 * (1 - t * t)), r2(-t * 22)]; };
  const line = (w, y, size, fill, dx = 0) => { const [x, rot] = at(y); return `<text x="${x + dx}" y="${y}" text-anchor="middle" font-family="UnifrakturMaguntia" font-size="${size}" fill="${fill}" transform="rotate(${rot} ${x} ${y})">${w}</text>`; };
  const black = [['Honour', 70], ['Loyalty', 124], ['Strength', 232], ['Courage', 340]];
  const white = [['Legacy', 186, 66], ['Pride', 288, 50]];
  return `
  <defs>${wear(id('w'), { amount: 0.18 })}${wear(id('w2'), { amount: 0.26, seed: 7 })}</defs>
  <g filter="url(#${id('w2')})">${black.map(([w, y]) => line(w, y, 54, INK.black.hex)).join('')}</g>
  <g filter="url(#${id('w')})">${white.map(([w, y, sz]) => line(w, y, sz, INK.cream.hex, -6)).join('')}</g>
  ${splatter(11, 50, [150, 30, 150, 340], INK.cream.hex, 2)}${splatter(13, 40, [120, 30, 180, 340], INK.black.hex, 2.2)}`;
};

// 4. Untamed — hem flames + spray embers, small chest word (front) -----------------
const untamed = ({ asset }) => `
  ${tex(asset, 'flames-sample')}
  <text x="214" y="96" text-anchor="middle" font-family="UnifrakturMaguntia" font-size="26" fill="${INK.cream.hex}">Untamed</text>
  <text x="214" y="108" text-anchor="middle" ${MONO} font-size="5.5" fill="${INK.cream.hex}" letter-spacing="2">BORN TO BURN BRIGHT</text>`;

// 5. Wanderer — worn ornament spilling off the shoulder with drips (front) ---------
const wanderer = ({ id }) => {
  const K = INK.black.hex;
  const shape = 'M-10,-10 L150,-10 C150,30 120,40 128,70 C136,100 100,110 108,150 C114,186 80,200 86,236 C90,260 60,270 40,262 C20,256 10,240 -10,250 Z';
  const R = rnd(21);
  const drips = Array.from({ length: 11 }, () => {
    const x = 18 + R() * 92, y = 150 + R() * 90, l = 12 + R() ** 2 * 60, w = 2 + R() * 3.5;
    return `<rect x="${r2(x - w / 2)}" y="${r2(y)}" width="${r2(w)}" height="${r2(l)}" rx="${r2(w / 2)}"/><circle cx="${r2(x)}" cy="${r2(y + l)}" r="${r2(w * 0.8)}"/>`;
  }).join('');
  return `
  <defs>${torn(id('t'), 26, 9)}${wear(id('w'), { amount: 0.36, freq: 1.4 })}
    <clipPath id="${id('c')}"><path d="${shape}" filter="url(#${id('t')})"/></clipPath>
    <mask id="${id('m')}" maskUnits="userSpaceOnUse" x="-20" y="-20" width="340" height="440"><path d="${shape}" fill="#fff" filter="url(#${id('t')})"/></mask></defs>
  <g filter="url(#${id('w')})">
    <mask id="${id('neg')}" maskUnits="userSpaceOnUse" x="-20" y="-20" width="340" height="440">
      <path d="${shape}" fill="#fff" filter="url(#${id('t')})"/>
      ${carpet(-6, -8, 128, 150, '#000', 4)}${carpet(-6, 136, 104, 130, '#000', 9)}
      ${band(112, -10, 20, 120, '#000', true)}
    </mask>
    <rect x="-20" y="-20" width="340" height="440" fill="${K}" mask="url(#${id('neg')})"/>
    <g fill="${K}">${drips}</g>
  </g>
  ${splatter(31, 40, [20, 200, 110, 90], K, 1.8)}
  <text x="214" y="104" text-anchor="middle" font-family="Archivo" font-weight="800" font-size="13" fill="${K}" letter-spacing="2">WANDERER</text>`;
};

// 6. Brotherhood — grunge bandana panels + script (back) ----------------------------
const brotherhood = ({ id }) => {
  const G = INK.grey.hex, K = INK.black.hex;
  const panel = (x, y, s, rot, seed) => `<g transform="rotate(${rot} ${x + s / 2} ${y + s / 2})">
    <rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${G}" mask="url(#${id(`pm${seed}`)})"/>
    <g filter="url(#${id('w2')})">${carpet(x, y, s, s, K, seed)}</g></g>`;
  const pmask = (x, y, s, seed) => `<mask id="${id(`pm${seed}`)}" maskUnits="userSpaceOnUse" x="-50" y="-50" width="400" height="500">
    <rect x="${x}" y="${y}" width="${s}" height="${s}" fill="#fff" filter="url(#${id('t')})"/>
    <rect x="${x}" y="${y}" width="${s}" height="${s}" fill="#000" filter="url(#${id('holes')})"/></mask>`;
  return `
  <defs>${torn(id('t'), 30, 12)}${wear(id('w2'), { amount: 0.5, freq: 0.9, seed: 5 })}
    <filter id="${id('holes')}" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="4" seed="17"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0"/>
      <feComponentTransfer><feFuncA type="linear" slope="9" intercept="-4.8"/></feComponentTransfer>
      <feComposite in="SourceGraphic" operator="in"/></filter>
    ${pmask(-30, -24, 150, 3)}${pmask(150, 226, 170, 8)}</defs>
  ${panel(-30, -24, 150, -12, 3)}${panel(150, 226, 170, 14, 8)}
  ${splatter(41, 70, [0, 0, 300, 400], G, 2.2)}
  <defs>${wear(id('ws'), { amount: 0.18, seed: 3 })}</defs>
  <g filter="url(#${id('ws')})">
    <text x="150" y="200" text-anchor="middle" font-family="Mrs Saint Delafield" font-size="78" fill="${K}">Brotherhood</text>
  </g>
  <text x="150" y="224" text-anchor="middle" ${MONO} font-size="6" fill="${K}" letter-spacing="3">THROUGH EVERYTHING · TOGETHER</text>`;
};

const item = (ref, name, colour, svg, inks) => ({ ref, name, colour, art: { front: { svg, size: SIZE, inks } } });

export default {
  id: 'c12-real-ink',
  code: 'BOYS · 30–36 (10–14 YRS) · OVERSIZED',
  title: 'REAL INK',
  technique: 'SCREEN PRINT · MAX 3 COL',
  subtitle: 'marble · torn carpet · blackletter · flames · ornament · bandana',
  layout: 'single',
  countInks: true,
  footer: 'Front: Unreal, Untamed, Wanderer. Back: Old Soul, Legacy, Brotherhood.',
  items: [
    item('RI-01', 'Unreal', { name: 'Lavender', hex: '#969FDC' }, unreal, [INK.mint, INK.white, INK.navy]),
    item('RI-02', 'Old Soul', { name: 'White', hex: '#F7F6F2' }, oldSoul, [INK.brown]),
    item('RI-03', 'Legacy', { name: 'Beige', hex: '#D8CBB5' }, legacy, [INK.black, INK.cream]),
    item('RI-04', 'Untamed', { name: 'Black', hex: '#141414' }, untamed, [INK.cream, INK.orange]),
    item('RI-05', 'Wanderer', { name: 'Stone', hex: '#CFCAC0' }, wanderer, [INK.black]),
    item('RI-06', 'Brotherhood', { name: 'White', hex: '#F7F6F2' }, brotherhood, [INK.grey, INK.black]),
  ],
};
