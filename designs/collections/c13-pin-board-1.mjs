// Collection 13 — PIN BOARD vol.1. Boys 30–36 oversized back prints, two original prints
// per founder Pinterest reference (refs 1–4: puff globe, bubble letter + brush slashes,
// painted letters + paint patches, chunky stacked cut-out type). No brands, no dates.
import { sparkle, star, r2 } from '../lib/svg.mjs';
import { rnd, taper, rough, hatch, patch, wear } from '../lib/pin.mjs';

const SIZE = [300, 400];
const FULL = { name: 'DTF / puff', hex: 'conic-gradient(#00c2ff,#ff3da8,#ffe600,#00c2ff)' };
const I = (name, hex) => ({ name, hex });
const MONO = 'font-family="Space Mono" font-weight="700"';
const r3d = (asset, n, x, y, w, h, extra = '') => `<image href="${asset(`output/assets/3d/${n}-crop.png`)}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet" ${extra}/>`;
const arcText = (id, cx, cy, r, from, to, txt, size, fill, font = 'Archivo" font-weight="900') => {
  const p = (d) => [r2(cx + r * Math.cos((d * Math.PI) / 180)), r2(cy + r * Math.sin((d * Math.PI) / 180))];
  const [x0, y0] = p(from), [x1, y1] = p(to);
  return `<path id="${id}" d="M${x0},${y0} A${r},${r} 0 0 ${to > from ? 1 : 0} ${x1},${y1}" fill="none"/>
    <text font-family="${font}" font-size="${size}" fill="${fill}" letter-spacing="2"><textPath href="#${id}" startOffset="50%" text-anchor="middle">${txt}</textPath></text>`;
};
// Continents as noise blobs clipped to the globe, filled with scribble hatching.
const globe = (id, cx, cy, r, sea, land, seed) => `
  <defs><clipPath id="${id('g')}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>
    <filter id="${id('land')}" x="0" y="0" width="300" height="400" filterUnits="userSpaceOnUse">
      <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="4" seed="${seed}"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1.4 0 0 0 -0.2"/>
      <feComponentTransfer><feFuncA type="linear" slope="30" intercept="-15"/></feComponentTransfer></filter>
    <mask id="${id('lm')}" maskUnits="userSpaceOnUse" x="0" y="0" width="300" height="400"><rect width="300" height="400" fill="#fff" filter="url(#${id('land')})"/></mask></defs>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="${sea}"/>
  <g mask="url(#${id('lm')})">${hatch(id('g'), cx - r, cy - r, r * 2, r * 2, land, { gap: 2.6, width: 1.9, seed })}</g>`;

// 1a. World Wide — puff letters over a scribble globe -------------------------------
const worldWide = ({ id, asset }) => `
  <defs>${''}</defs>
  ${arcText(id('a'), 150, 205, 120, 196, 344, 'PLAYING INFINITE', 24, '#E8344E')}
  ${r3d(asset, 'pw-worldwide', 16, 140, 268, 130)}
  ${globe(id, 150, 205, 104, 'none', '#2F7BFF', 7)}
  ${arcText(id('b'), 150, 205, 116, 150, 30, 'EXPLORERS CLUB', 13, '#E8344E', 'Space Mono" font-weight="700')}`;

// 1b. Space Bound — red puff over a banded planet -----------------------------------
const spaceBound = ({ id, asset }) => `
  <image href="${asset('output/assets/3d/planet.png')}" x="50" y="0" width="200" height="200"/>
  ${r3d(asset, 'pw-spacebound', 12, 176, 276, 132)}
  ${[[38, 50, 9], [262, 70, 7], [250, 300, 10], [44, 300, 6]].map(([x, y, r]) => `<path d="${sparkle(x, y, r)}" fill="#FFFFFF"/>`).join('')}
  <text x="150" y="352" text-anchor="middle" ${MONO} font-size="12" fill="#FFFFFF" letter-spacing="4">NEXT STOP · EVERYWHERE</text>`;

// 2a. Go Play — glossy bubble letters on brush slashes -------------------------------
const slashes = (cols, seed) => {
  const R = rnd(seed);
  return Array.from({ length: 9 }, (_, i) => {
    const y = 60 + i * 32 + R() * 10, x0 = 10 + R() * 30, x1 = 290 - R() * 30;
    return `<path d="${taper([x0, y + 30], [150, y + 4], [x1, y - 26], 14 + R() * 22, { head: 0.25, tail: 1.6 })}" fill="${cols[i % cols.length]}"/>`;
  }).join('');
};
const goPlay = ({ id, asset }) => `
  <defs>${rough(id('r'), 6, 0.09)}</defs>
  <g filter="url(#${id('r')})">${slashes(['#2FB8C4', '#FF7A1A', '#2FB8C4'], 5)}</g>
  ${r3d(asset, 'pw-goplay', 34, 70, 232, 200)}
  <text x="150" y="330" text-anchor="middle" font-family="Yellowtail" font-size="44" fill="#FF7A1A" transform="rotate(-6 150 320)">skate crew</text>`;

// 2b. No.1 — orange gloss number over teal and white slashes -----------------------
const numberOne = ({ id, asset }) => `
  <defs>${rough(id('r'), 6, 0.08, 9)}</defs>
  <g filter="url(#${id('r')})">${slashes(['#2FB8C4', '#FFFFFF', '#2FB8C4'], 11)}</g>
  ${r3d(asset, 'pw-n1', 20, 120, 260, 110)}
  <text x="150" y="276" text-anchor="middle" font-family="Yellowtail" font-size="40" fill="#FFFFFF" transform="rotate(-5 150 270)">champion mode</text>
  <text x="150" y="372" text-anchor="middle" ${MONO} font-size="10" fill="#2FB8C4" letter-spacing="4">FIRST PLACE · EVERY PLACE</text>`;

// 3a/3b. Painted letters over paint patches ------------------------------------------
const painted = (lines, patches, side, inkType) => ({ id }) => `
  <defs>${rough(id('r'), 7, 0.05)}${rough(id('t'), 3, 0.09, 8)}</defs>
  <g filter="url(#${id('r')})">${patches.map(([cx, cy, r, c, s]) => `<path d="${patch(cx, cy, r, s)}" fill="${c}"/>`).join('')}</g>
  <g filter="url(#${id('t')})">${lines.map(([t, x, y, size, rot]) => `<text x="${x}" y="${y}" font-family="Permanent Marker" font-size="${size}" fill="${inkType}" transform="rotate(${rot} ${x} ${y})">${t}</text>`).join('')}</g>
  ${side}`;
const beatKid = painted(
  [['BE', 26, 112, 110, -4], ['AT', 160, 118, 96, 6], ['KI', 60, 262, 112, 3], ['D', 196, 268, 118, -6]],
  [[86, 70, 54, '#4CB963', 2], [210, 110, 50, '#FF9A1F', 4], [96, 230, 52, '#FF9A1F', 6], [226, 250, 46, '#4CB963', 8], [150, 170, 60, '#E9D9B0', 3]],
  `<text x="22" y="304" font-family="Archivo" font-weight="900" font-size="26" fill="#1C2E78">LISTEN</text>
   ${['a song can say what words cannot.', 'turn it up, keep it moving,', 'make every day your own track.'].map((t, i) => `<text x="22" y="${318 + i * 10}" ${MONO} font-size="7" fill="#1C2E78">${t}</text>`).join('')}
   <g transform="translate(232 320)"><circle r="22" fill="none" stroke="#1C2E78" stroke-width="2.2"/><circle r="18" fill="none" stroke="#1C2E78" stroke-width="1.4" transform="rotate(20) scale(1.1 0.9)"/>
   <path d="M-6,8 L-6,-10 L10,-14 L10,4" fill="none" stroke="#FF9A1F" stroke-width="3.5" stroke-linejoin="round"/><circle cx="-9" cy="9" r="4.5" fill="#FF9A1F"/><circle cx="7" cy="5" r="4.5" fill="#FF9A1F"/></g>`,
  '#1C2E78',
);
const playLoud = painted(
  [['PLAY', 20, 130, 104, -6], ['IT LOUD', 18, 238, 60, -3]],
  [[90, 92, 60, '#FF3E9A', 5], [222, 210, 52, '#FFC915', 7], [80, 210, 40, '#FFC915', 9]],
  `<text x="280" y="300" text-anchor="end" font-family="Archivo" font-weight="900" font-size="22" fill="#FFFFFF">VOLUME: MAX</text>
   ${['no skip button.', 'no quiet mode.', 'just good noise.'].map((t, i) => `<text x="280" y="${314 + i * 10}" text-anchor="end" ${MONO} font-size="7" fill="#FFFFFF">${t}</text>`).join('')}
   ${[0, 1, 2, 3, 4].map((i) => `<rect x="${24 + i * 12}" y="${330 - i * 7}" width="8" height="${12 + i * 7}" fill="#FF3E9A"/>`).join('')}`,
  '#FFFFFF',
);

// 4a/4b. Chunky stacked cut-out type with paper shapes --------------------------------
const chunky = (lines, shapes, sub, ink) => ({ id }) => `
  <defs>${wear(id('w'), 0.12)}</defs>
  ${shapes}
  <g filter="url(#${id('w')})">${lines.map(([t, y, size, w]) => `<text x="30" y="${y}" font-family="Dela Gothic One" font-size="${size}" fill="${ink}" textLength="${w}" lengthAdjust="spacingAndGlyphs">${t}</text>`).join('')}</g>
  ${sub}`;
const splat = (cx, cy, r, c, n = 7, rot = 0) => `<g transform="rotate(${rot} ${cx} ${cy})">${Array.from({ length: n }, (_, i) => `<rect x="${cx - r * 0.18}" y="${cy - r}" width="${r * 0.36}" height="${r * 2}" rx="${r * 0.18}" fill="${c}" transform="rotate(${(i * 180) / n} ${cx} ${cy})"/>`).join('')}</g>`;
const bestBuds = chunky(
  [['BEST', 118, 96, 210], ['BUD', 214, 96, 168], ['DIES!', 310, 96, 236]],
  `${splat(90, 300, 52, '#FFC915', 7, 10)}<rect x="232" y="150" width="22" height="70" rx="4" fill="#E8634A" transform="rotate(10 243 185)"/>
   <text x="240" y="98" font-family="Dela Gothic One" font-size="74" fill="#6B8E3A">#</text>`,
  `<text x="30" y="344" font-family="Archivo" font-weight="900" font-size="20" fill="#151515">MY CREW /// MY PEOPLE</text>
   ${['some friends are for a day. some are for every', 'single match, every single summer.'].map((t, i) => `<text x="30" y="${358 + i * 9}" ${MONO} font-size="6.4" fill="#151515">${t}</text>`).join('')}`,
  '#151515',
);
const goodTimes = chunky(
  [['GOOD', 118, 96, 220], ['TIMES', 214, 96, 236], ['ONLY.', 310, 96, 220]],
  `${splat(240, 92, 40, '#FF5A1F', 6, 0)}<circle cx="70" cy="300" r="34" fill="#2F7BFF"/>
   <path d="M196,250 l30,-48 l30,48 Z" fill="#FFC915"/>`,
  `<text x="30" y="344" font-family="Archivo" font-weight="900" font-size="20" fill="#FFFFFF">NO BAD VIBES ALLOWED</text>
   ${['snacks shared, games won, stories made.', 'that is the whole plan.'].map((t, i) => `<text x="30" y="${358 + i * 9}" ${MONO} font-size="6.4" fill="#FFFFFF">${t}</text>`).join('')}`,
  '#FFFFFF',
);

const item = (ref, name, colour, svg, inks) => ({ ref, name, colour, art: { front: { svg, size: SIZE, inks } } });

export default {
  id: 'c13-pin-board-1',
  code: 'BOYS · 30–36 · OVERSIZED BACK · REFS 1–4',
  title: 'PIN BOARD 1',
  technique: 'PUFF / DTF + SCREEN',
  subtitle: 'puff globe · bubble + slashes · painted · chunky type',
  layout: 'single',
  countInks: true,
  cols: 4,
  footer: 'Two original prints per reference. 3D / puff letters print as puff or DTF.',
  items: [
    item('PB-01', 'World Wide', { name: 'Black', hex: '#141414' }, worldWide, [FULL]),
    item('PB-02', 'Space Bound', { name: 'Navy', hex: '#1C2340' }, spaceBound, [FULL]),
    item('PB-03', 'Go Play', { name: 'Black', hex: '#141414' }, goPlay, [FULL]),
    item('PB-04', 'No.1', { name: 'Black', hex: '#141414' }, numberOne, [FULL]),
    item('PB-05', 'Beat Kid', { name: 'White', hex: '#F7F6F2' }, beatKid, [I('Navy', '#1C2E78'), I('Green', '#4CB963'), I('Orange', '#FF9A1F'), I('Sand', '#E9D9B0')]),
    item('PB-06', 'Play It Loud', { name: 'Charcoal', hex: '#3A3A3C' }, playLoud, [I('White', '#FFFFFF'), I('Pink', '#FF3E9A'), I('Yellow', '#FFC915')]),
    item('PB-07', 'Best Buddies', { name: 'Cream', hex: '#F3EAD2' }, bestBuds, [I('Black', '#151515'), I('Yellow', '#FFC915'), I('Olive', '#6B8E3A'), I('Coral', '#E8634A')]),
    item('PB-08', 'Good Times Only', { name: 'Bottle Green', hex: '#1F3A2E' }, goodTimes, [I('White', '#FFFFFF'), I('Orange', '#FF5A1F'), I('Blue', '#2F7BFF'), I('Yellow', '#FFC915')]),
  ],
};
