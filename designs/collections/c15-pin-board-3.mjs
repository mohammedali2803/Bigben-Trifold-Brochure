// Collection 15 — PIN BOARD vol.3. Boys 30–36 oversized, two original prints per founder
// reference (refs 9–13: stacked word + line art, two-tone blob type, lettering burst,
// bold type + scribble + icons, 3D keychain). No brands, no dates.
import { sparkle, star, r2 } from '../lib/svg.mjs';
import { rnd, wear, rough } from '../lib/pin.mjs';

const SIZE = [300, 400];
const FULL = { name: 'DTF', hex: 'conic-gradient(#00c2ff,#ff3da8,#ffe600,#00c2ff)' };
const I = (name, hex) => ({ name, hex });
const MONO = 'font-family="Space Mono" font-weight="700"';
const tex = (asset, n) => `<image href="${asset(`output/assets/textures/${n}.png`)}" x="0" y="0" width="300" height="400" preserveAspectRatio="none"/>`;
const r3d = (asset, n, x, y, w, h) => `<image href="${asset(`output/assets/3d/${n}-crop.png`)}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"/>`;

// 9a/9b. Repeated stacked word + clean line art on top ---------------------------------
const stacked = (word, sub, fill, line, art) => () => `
  ${[0, 1, 2].map((i) => `<text x="150" y="${150 + i * 96}" text-anchor="middle" font-family="Bagel Fat One" font-size="112" fill="${fill}" textLength="270" lengthAdjust="spacingAndGlyphs">${word}</text>`).join('')}
  <text x="150" y="372" text-anchor="middle" font-family="Unbounded" font-weight="700" font-size="22" fill="none" stroke="${fill}" stroke-width="1.6" letter-spacing="6">${sub}</text>
  <g fill="none" stroke="${line}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${art}</g>`;
const ring = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}"/><ellipse cx="${x}" cy="${y}" rx="${r * 1.8}" ry="${r * 0.5}" transform="rotate(-18 ${x} ${y})"/><path d="M${x - r * 0.7},${y - r * 0.3} h${r * 1.4} M${x - r * 0.8},${y + r * 0.2} h${r * 1.6}"/>`;
const moon = (x, y, r) => `<path d="M${x},${y - r} A${r},${r} 0 1 0 ${x},${y + r} A${r * 0.75},${r * 0.75} 0 1 1 ${x},${y - r} Z"/>`;
const comet = (x, y) => `<circle cx="${x}" cy="${y}" r="9"/><path d="M${x + 7},${y - 6} l20,-12 M${x + 9},${y} l24,-4 M${x + 6},${y + 6} l20,6"/>`;
const dreamerArt = `
  <path d="M150,96 C176,120 176,176 166,206 L134,206 C124,176 124,120 150,96 Z"/><circle cx="150" cy="146" r="10"/>
  <path d="M134,186 L114,214 L134,206 M166,186 L186,214 L166,206 M140,212 Q150,246 160,212"/>
  <path d="M150,212 C150,250 120,262 100,300" stroke-dasharray="3 6"/>
  ${ring(240, 110, 16)}${moon(62, 120, 18)}${comet(60, 250)}
  <circle cx="220" cy="280" r="26"/><circle cx="212" cy="272" r="5"/><circle cx="230" cy="290" r="4"/><circle cx="214" cy="292" r="3"/>
  ${[[100, 70], [210, 200], [40, 190], [260, 330]].map(([x, y]) => `<path d="${star(x, y, 5, 8, 3.4)}"/>`).join('')}`;
const legendArt = `
  <rect x="96" y="150" width="108" height="56" rx="26"/><path d="M118,170 v16 M110,178 h16"/><circle cx="178" cy="172" r="4"/><circle cx="188" cy="182" r="4"/>
  <path d="M126,150 C126,120 160,130 150,100 C142,80 166,70 170,60" />
  <path d="M40,90 l10,-24 l10,24 l24,4 l-18,16 l6,24 l-22,-12 l-22,12 l6,-24 l-18,-16 Z" transform="scale(0.8) translate(10 20)"/>
  <rect x="226" y="240" width="40" height="52" rx="4"/><path d="M234,252 h24 M234,262 h24 M234,272 h14"/>
  <path d="M50,240 h44 l-8,-8 M94,240 l-8,8"/><path d="M60,300 c10,-14 26,-14 36,0"/>
  ${[[240, 90], [120, 250], [70, 180]].map(([x, y]) => `<path d="M${x},${y - 9} L${x + 3},${y - 3} L${x + 9},${y} L${x + 3},${y + 3} L${x},${y + 9} L${x - 3},${y + 3} L${x - 9},${y} L${x - 3},${y - 3} Z"/>`).join('')}`;
const dreamer = stacked('DREAMER', 'SPACE KID', '#A9CCF0', '#1F4C9A', dreamerArt);
const legend = stacked('LEGEND', 'PLAYER ONE', '#BFE7D2', '#1E5A44', legendArt);

// 10a/10b. Type over two-tone liquid blobs, with a garment-coloured loop cutting through --
const blobType = (lines, texA, texB, ink, loopCol, d) => ({ asset }) => `
  ${tex(asset, texA)}${tex(asset, texB)}
  ${lines.map(([t, y, s, w]) => `<text x="150" y="${y}" text-anchor="middle" font-family="Anton" font-size="${s}" fill="${ink}" textLength="${w}" lengthAdjust="spacingAndGlyphs">${t}</text>`).join('')}
  <path d="${d}" fill="none" stroke="${loopCol}" stroke-width="9" stroke-linecap="round"/>`;
const soGood = blobType([['OH SO', 140, 110, 260], ['GOOD!', 262, 120, 270], ['SUMMER', 356, 80, 230]], 'blobs-o2', 'blobs-y2', '#123A5A', '#F7F6F2',
  'M30,90 C120,60 250,80 250,150 C250,210 60,200 70,260 C80,320 230,300 270,350');
const gameOn = blobType([['GAME', 150, 130, 270], ['ON', 300, 150, 200]], 'blobs-t2', 'blobs-p2', '#141414', '#F7F6F2',
  'M20,200 C80,120 140,280 200,180 S280,130 290,210 M40,330 C120,300 180,370 270,320');

// 11a/11b. Lettering burst: glossy 3D word + patterned extruded block letters -------------
const burst = (cx, cy, r, c) => { let d = ''; for (let i = 0; i < 28; i++) { const a = (i * Math.PI) / 14, rr = i % 2 ? r * 0.72 : r; d += `${i ? 'L' : 'M'}${r2(cx + rr * Math.cos(a) * 1.15)},${r2(cy + rr * Math.sin(a))}`; } return `<path d="${d}Z" fill="${c}"/>`; };
const blockWord = (id, word, y, size, face, side, patterns) => {
  const chars = word.split(''), cw = 270 / chars.length;
  return chars.map((ch, i) => {
    const x = 15 + cw * (i + 0.5), pid = id(`p${i}`), pat = patterns[i % patterns.length];
    return `<pattern id="${pid}" width="6" height="6" patternUnits="userSpaceOnUse">${pat === 'grid' ? `<rect width="6" height="6" fill="${face}"/><path d="M0,0 h6 M0,0 v6" stroke="#141414" stroke-width="0.8"/>` : pat === 'dots' ? `<rect width="6" height="6" fill="${face}"/><circle cx="3" cy="3" r="1.2" fill="#141414"/>` : `<rect width="6" height="6" fill="${pat}"/>`}</pattern>
      ${[6, 5, 4, 3, 2, 1].map((k) => `<text x="${x + k}" y="${y + k}" text-anchor="middle" font-family="Dela Gothic One" font-size="${size}" fill="${side}">${ch}</text>`).join('')}
      <text x="${x}" y="${y}" text-anchor="middle" font-family="Dela Gothic One" font-size="${size}" fill="url(#${pid})" stroke="#141414" stroke-width="2.2" paint-order="stroke">${ch}</text>`;
  }).join('');
};
const beBold = ({ id, asset }) => `
  ${burst(150, 220, 120, '#FFC915')}${burst(150, 220, 92, '#FF5A1F')}
  ${r3d(asset, 'pw-bebold', 40, 30, 220, 130)}
  ${blockWord(id, 'ALWAYS', 300, 44, '#FFFFFF', '#1FB5A8', ['grid', '#FFFFFF', 'dots', '#1FB5A8'])}
  <g fill="none" stroke="#1FB5A8" stroke-width="7">${[[40, 120], [266, 170]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="12" ry="18"/>`).join('')}</g>
  <path d="M266,80 l14,14 m0,-14 l-14,14" stroke="#141414" stroke-width="5"/><path d="M28,330 l12,12 m0,-12 l-12,12" stroke="#141414" stroke-width="4"/>`;
const stayCurious = ({ id, asset }) => `
  ${burst(150, 230, 124, '#2F7BFF')}${burst(150, 230, 94, '#FFC915')}
  ${r3d(asset, 'pw-stay', 50, 40, 200, 90)}
  ${blockWord(id, 'CURIOUS', 280, 38, '#FFFFFF', '#FF5A1F', ['dots', '#FFFFFF', 'grid', '#FF5A1F'])}
  <path d="M40,350 C80,330 110,370 150,350" fill="none" stroke="#141414" stroke-width="2.5"/>
  <path d="M250,110 l12,12 m0,-12 l-12,12" stroke="#141414" stroke-width="4"/>`;

// 12a/12b. Bold condensed type, hand scribble line, icons in circles, sticker label -------
const icon = {
  ball: (c) => `<circle r="10" fill="none" stroke="${c}" stroke-width="2.4"/><path d="M-10,0 h20 M0,-10 C-8,-4 -8,4 0,10 M0,-10 C8,-4 8,4 0,10" fill="none" stroke="${c}" stroke-width="1.6"/>`,
  bolt: (c) => `<path d="M2,-12 L-7,2 L0,2 L-3,12 L7,-3 L0,-3 Z" fill="${c}"/>`,
  shoe: (c) => `<path d="M-12,4 C-12,-4 -6,-6 -2,-5 L4,-10 C8,-8 8,-2 12,0 C14,2 14,6 12,6 L-12,6 Z" fill="${c}"/>`,
  pad: (c) => `<rect x="-12" y="-7" width="24" height="14" rx="7" fill="${c}"/><circle cx="5" cy="-1" r="2" fill="#F7F6F2"/><path d="M-6,-3 v6 M-9,0 h6" stroke="#F7F6F2" stroke-width="1.6"/>`,
};
const boldType = (lines, scribble, badges, sticker) => () => `
  <path d="${scribble}" fill="none" stroke="#FFC915" stroke-width="3.5" stroke-linecap="round"/>
  ${lines.map(([t, y, w, colourful]) => `<text x="150" y="${y}" text-anchor="middle" font-family="Anton" font-size="64" fill="#141414" textLength="${w}" lengthAdjust="spacingAndGlyphs">${colourful ? t.split('').map((c, i) => (i === colourful[0] ? `<tspan fill="#E5322D" font-family="Permanent Marker">${c}</tspan>` : c)).join('') : t}</text>`).join('')}
  ${badges.map(([x, y, bg, ic]) => `<g transform="translate(${x} ${y})"><circle r="20" fill="${bg}"/>${icon[ic]('#141414')}</g>`).join('')}
  <g transform="translate(${sticker[0]} ${sticker[1]}) rotate(-6)"><rect x="-28" y="-11" width="56" height="22" fill="#FFC915"/><text y="6" text-anchor="middle" font-family="Yellowtail" font-size="17" fill="#141414">${sticker[2]}</text></g>`;
const wherePlay = boldType([['WHERE', 150, 170], ['PLAY MEETS', 214, 260, [1]], ['PRACTICE', 278, 240]],
  'M40,300 C60,120 110,90 120,200 C130,310 170,320 190,180 C210,60 260,90 262,300', [[34, 104, '#FFC915', 'ball'], [268, 104, '#E5322D', 'bolt'], [262, 318, '#8FD3FF', 'shoe']], [150, 308, 'the']);
const bornLoud = boldType([['BORN TO', 150, 220], ['PLAY', 214, 170, [2]], ['IT LOUD', 278, 230]],
  'M30,140 C90,320 140,60 160,250 S240,90 276,300', [[36, 318, '#8FD3FF', 'pad'], [268, 100, '#FFC915', 'bolt'], [32, 100, '#E5322D', 'ball']], [228, 310, 'loud']);

// 13a/13b. 3D keychain bundle + small print text ---------------------------------------
const keychain = (n, line1, line2, sparkCol) => ({ asset }) => `
  ${r3d(asset, n, 50, 20, 200, 300)}
  ${[[60, 80, 10], [244, 70, 8], [70, 250, 7], [250, 230, 9]].map(([x, y, r]) => `<path d="${sparkle(x, y, r)}" fill="${sparkCol}"/>`).join('')}
  <text x="150" y="346" text-anchor="middle" ${MONO} font-size="9" fill="#141414" letter-spacing="1">${line1}</text>
  <text x="150" y="360" text-anchor="middle" ${MONO} font-size="7.5" fill="#141414" letter-spacing="1">${line2}</text>`;
const schoolOut = keychain('kc1', 'RETURN TO THE NEAREST PLAYGROUND IF FOUND', 'ALL ACCESS PASS · SUMMER EDITION', '#FFC915');
const gameRoom = keychain('kc2', 'KEYS TO THE GAME ROOM · DO NOT LOSE', 'PLAYER ONE ONLY · HIGH SCORES INSIDE', '#8B5CFF');

const item = (ref, name, colour, svg, inks) => ({ ref, name, colour, art: { front: { svg, size: SIZE, inks } } });

export default {
  id: 'c15-pin-board-3',
  code: 'BOYS · 30–36 · OVERSIZED BACK · REFS 9–13',
  title: 'PIN BOARD 3',
  technique: 'SCREEN + DTF',
  subtitle: 'stacked + line art · blob type · burst · scribble · keychain',
  layout: 'single',
  countInks: true,
  cols: 5,
  footer: 'Two original prints per reference.',
  items: [
    item('PB-17', 'Dreamer', { name: 'Off White', hex: '#F4F1EA' }, dreamer, [I('Sky', '#A9CCF0'), I('Blue', '#1F4C9A')]),
    item('PB-18', 'Legend', { name: 'Cream', hex: '#F3EAD2' }, legend, [I('Mint', '#BFE7D2'), I('Forest', '#1E5A44')]),
    item('PB-19', 'Oh So Good', { name: 'White', hex: '#F7F6F2' }, soGood, [I('Orange', '#FF7A1A'), I('Yellow', '#FFC21F'), I('Teal Navy', '#123A5A')]),
    item('PB-20', 'Game On', { name: 'White', hex: '#F7F6F2' }, gameOn, [I('Teal', '#1FB5A8'), I('Pink', '#FF3E9A'), I('Black', '#141414')]),
    item('PB-21', 'Be Bold', { name: 'Off White', hex: '#F1EDE4' }, beBold, [FULL]),
    item('PB-22', 'Stay Curious', { name: 'Off White', hex: '#F1EDE4' }, stayCurious, [FULL]),
    item('PB-23', 'Play Meets Practice', { name: 'White', hex: '#F7F6F2' }, wherePlay, [I('Black', '#141414'), I('Yellow', '#FFC915'), I('Red', '#E5322D'), I('Sky', '#8FD3FF')]),
    item('PB-24', 'Born To Play', { name: 'White', hex: '#F7F6F2' }, bornLoud, [I('Black', '#141414'), I('Yellow', '#FFC915'), I('Red', '#E5322D'), I('Sky', '#8FD3FF')]),
    item('PB-25', "School's Out", { name: 'White', hex: '#F7F6F2' }, schoolOut, [FULL]),
    item('PB-26', 'Game Room', { name: 'White', hex: '#F7F6F2' }, gameRoom, [FULL]),
  ],
};
