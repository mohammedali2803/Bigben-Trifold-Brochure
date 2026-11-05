// Collection 11 — STREET INK. Boys 30–36 (10–14 yrs), oversized back prints, max 3 inks.
// Founder references (Pinterest, Nov 2026): distressed stacked type ripped by paint
// "claw" slashes, and a drippy word-collage ribbon. Original wording and art, no brands.
import { r2 } from '../lib/svg.mjs';

const SIZE = [300, 400];
const INK = {
  white: { name: 'White', hex: '#F4F1EA' },
  yellow: { name: 'Yellow', hex: '#FFC915' },
  red: { name: 'Red', hex: '#E5322D' },
  pink: { name: 'Hot Pink', hex: '#FF3E9A' },
  cyan: { name: 'Cyan', hex: '#2FB8F2' },
  lime: { name: 'Lime', hex: '#35D46A' },
  orange: { name: 'Orange', hex: '#FF7A1A' },
  blue: { name: 'Royal Blue', hex: '#2450D6' },
  black: { name: 'Black', hex: '#141414' },
};

// --- Texture filters (all single-ink: they only remove or roughen ink) --------
// Distress: knocks worn specks out of the artwork.
const distress = (id, { freq = 0.9, cut = 0.55, seed = 2 } = {}) => `
  <filter id="${id}" x="-5%" y="-5%" width="110%" height="110%">
    <feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="3" seed="${seed}"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0"/>
    <feComponentTransfer><feFuncA type="linear" slope="7" intercept="${-7 * (1 - cut) + 1.6}"/></feComponentTransfer>
    <feComposite in="SourceGraphic" operator="in"/>
  </filter>`;
// Rough: dry-brush edges.
const rough = (id, scale = 6, freq = 0.06, seed = 5) => `
  <filter id="${id}" x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="3" seed="${seed}"/>
    <feDisplacementMap in="SourceGraphic" scale="${scale}"/>
  </filter>`;
// Mottle: keeps only blotchy patches (for the second/third ink inside a slash).
const mottle = (id, { freq = 0.05, keep = 0.45, seed = 9, grain = 0.9 } = {}) => `
  <filter id="${id}" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="${freq} ${freq * 2.4}" numOctaves="4" seed="${seed}" result="n"/>
    <feTurbulence type="fractalNoise" baseFrequency="${grain}" numOctaves="2" seed="${seed + 3}" result="g"/>
    <feComposite in="n" in2="g" operator="arithmetic" k2="1" k3="0.35" result="m"/>
    <feColorMatrix in="m" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0"/>
    <feComponentTransfer><feFuncA type="linear" slope="9" intercept="${-9 * (1 - keep) - 0.6}"/></feComponentTransfer>
    <feComposite in="SourceGraphic" operator="in"/>
  </filter>`;

// Tapered stroke along a quadratic curve: a paint slash / brush swipe shape.
function taper([x0, y0], [cx, cy], [x1, y1], width, { head = 0.6, tail = 1.4 } = {}) {
  const n = 40, left = [], right = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = (1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * x1;
    const y = (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t * t * y1;
    const dx = 2 * (1 - t) * (cx - x0) + 2 * t * (x1 - cx), dy = 2 * (1 - t) * (cy - y0) + 2 * t * (y1 - cy);
    const len = Math.hypot(dx, dy) || 1;
    const w = (width / 2) * Math.sin(Math.PI * t) ** (t < 0.5 ? head : tail);
    left.push(`${r2(x - (dy / len) * w)},${r2(y + (dx / len) * w)}`);
    right.unshift(`${r2(x + (dy / len) * w)},${r2(y - (dx / len) * w)}`);
  }
  return `M${left.join('L')}L${right.join('L')}Z`;
}
const drip = (x, y, len, w) => `<rect x="${x - w / 2}" y="${y - 2}" width="${w}" height="${len}" rx="${w / 2}"/><circle cx="${x}" cy="${y + len - w * 0.2}" r="${w * 0.8}"/>`;
const ANTON = 'font-family="Anton"';
const MONO = 'font-family="Space Mono" font-weight="700"';

// 1. Never Back Down — distressed stacked type + paint claw slashes ----------
const neverBack = ({ id }) => {
  const { white, yellow, red } = INK;
  const claws = [
    [[110, 30], [160, 110], [222, 206], 44], [[78, 86], [134, 168], [204, 262], 50],
    [[46, 148], [104, 224], [172, 318], 42], [[164, 10], [208, 74], [272, 162], 36],
  ].map(([a, c, b, w]) => taper(a, c, b, w, { head: 0.35, tail: 1.6 }));
  const d = claws.join('');
  return `
  <defs>${distress(id('d'), { cut: 0.6 })}${rough(id('r'), 7, 0.08)}${mottle(id('m1'), { seed: 4 })}${mottle(id('m2'), { seed: 11, keep: 0.32 })}</defs>
  <g filter="url(#${id('d')})" fill="${white.hex}">
    <text x="292" y="132" text-anchor="end" ${ANTON} font-size="122" textLength="170" lengthAdjust="spacingAndGlyphs">NEVER</text>
    <text x="292" y="250" text-anchor="end" ${ANTON} font-size="122" textLength="140" lengthAdjust="spacingAndGlyphs">BACK</text>
    <text x="292" y="368" text-anchor="end" ${ANTON} font-size="122" textLength="170" lengthAdjust="spacingAndGlyphs">DOWN.</text>
  </g>
  <g filter="url(#${id('r')})">
    <path d="${d}" fill="${yellow.hex}" filter="url(#${id('d')})"/>
    <path d="${d}" fill="${red.hex}" filter="url(#${id('m1')})"/>
    <path d="${d}" fill="${white.hex}" filter="url(#${id('m2')})" opacity=".9"/>
  </g>
  <rect x="150" y="304" width="104" height="18" fill="${yellow.hex}" transform="rotate(-4 202 313)"/>
  <text x="202" y="317" text-anchor="middle" ${MONO} font-size="10" fill="${INK.black.hex}" transform="rotate(-4 202 313)" letter-spacing="1">ROUND 07 · NO QUIT</text>`;
};

// 2. Howzat! — gully cricket word-collage ribbon with drips ----------------------
const howzat = ({ id }) => {
  const { pink, cyan, lime } = INK;
  const bands = [
    ['M-10,150 Q120,98 312,150', 40, pink.hex, 'HOWZAT!', 30, 'Bagel Fat One'],
    ['M-10,190 Q140,150 312,196', 34, cyan.hex, 'SIXER · BOUNDARY · SIXER', 22, 'Anton'],
    ['M-10,228 Q150,198 312,240', 44, lime.hex, 'CENTURY', 34, 'Racing Sans One'],
    ['M-10,270 Q160,236 312,282', 36, pink.hex, 'MATCH DAY · GULLY RULES', 22, 'Anton'],
  ];
  const masks = bands.map(([d, w, , txt, size, font], i) => `
    <path id="${id(`p${i}`)}" d="${d}"/>
    <mask id="${id(`m${i}`)}" maskUnits="userSpaceOnUse" x="-20" y="0" width="340" height="400">
      <use href="#${id(`p${i}`)}" stroke="#fff" stroke-width="${w}" fill="none"/>
      <text font-family="${font}" font-size="${size}" fill="#000" dominant-baseline="central" letter-spacing="1">
        <textPath href="#${id(`p${i}`)}" startOffset="50%" text-anchor="middle">${txt}</textPath></text>
    </mask>`).join('');
  const drips = [[30, 262, 46, 8, pink.hex], [64, 254, 70, 9, lime.hex], [104, 258, 34, 7, pink.hex], [142, 252, 84, 10, lime.hex],
    [182, 262, 52, 8, pink.hex], [222, 272, 66, 9, cyan.hex], [262, 282, 40, 7, pink.hex], [292, 288, 58, 8, lime.hex]];
  return `
  <defs>${masks}${rough(id('r'), 4, 0.05)}</defs>
  <g filter="url(#${id('r')})">
    ${drips.map(([x, y, l, w, c]) => `<g fill="${c}">${drip(x, y, l, w)}</g>`).join('')}
    ${bands.map(([, , c], i) => `<rect x="-20" y="0" width="340" height="400" fill="${c}" mask="url(#${id(`m${i}`)})"/>`).join('')}
  </g>
  <g transform="translate(240 44) rotate(-20)">
    <circle r="26" fill="none" stroke="${cyan.hex}" stroke-width="4"/>
    <path d="M-10,-24 Q-2,0 -10,24 M10,-24 Q2,0 10,24" fill="none" stroke="${cyan.hex}" stroke-width="2.4" stroke-dasharray="4 3"/>
  </g>
  <path d="M200,52 l-30,6 M204,66 l-32,8 M206,80 l-26,10" stroke="${cyan.hex}" stroke-width="3" stroke-linecap="round"/>
  <text x="40" y="372" font-family="Yellowtail" font-size="40" fill="${cyan.hex}" transform="rotate(-6 100 360)">gully legends</text>`;
};

// 3. Mumbai — distressed collegiate type in a burst of brush strokes ---------------
const mumbai = ({ id }) => {
  const { white, yellow, cyan } = INK;
  const strokes = [];
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2 + (i % 2) * 0.12;
    const r0 = 112 + (i % 3) * 8, r1 = r0 + 34 + (i % 4) * 8;
    const cx = 150, cy = 196;
    const p = (r, da = 0) => [cx + r * Math.cos(a + da) * 1.05, cy + r * Math.sin(a + da) * 1.25];
    strokes.push([taper(p(r0), p((r0 + r1) / 2, 0.18), p(r1, 0.1), 16 + (i % 3) * 4, { head: 0.3, tail: 1.2 }), i % 2 ? yellow.hex : cyan.hex]);
  }
  return `
  <defs>${rough(id('r'), 5, 0.09)}${distress(id('d'), { cut: 0.62, freq: 1.1 })}</defs>
  <g filter="url(#${id('r')})">${strokes.map(([d, c]) => `<path d="${d}" fill="${c}"/>`).join('')}</g>
  <g filter="url(#${id('d')})">
    <text x="150" y="230" text-anchor="middle" font-family="Graduate" font-size="64" fill="${white.hex}" textLength="200" lengthAdjust="spacingAndGlyphs">MUMBAI</text>
    <text x="150" y="168" text-anchor="middle" ${MONO} font-size="12" fill="${white.hex}" letter-spacing="3">EST. 1507 · BOM</text>
    <text x="150" y="258" text-anchor="middle" ${MONO} font-size="12" fill="${yellow.hex}" letter-spacing="1" textLength="190" lengthAdjust="spacingAndGlyphs">CITY THAT NEVER SLEEPS</text>
  </g>`;
};

// 4. Unstoppable — big multicolour brush script + zigzag (light garment) ----------
const unstoppable = ({ id }) => {
  const { red, blue, yellow } = INK;
  const word = 'Unstoppable'.split('');
  const cols = [red.hex, blue.hex, yellow.hex];
  const zig = Array.from({ length: 16 }, (_, i) => `${18 + i * 17.6},${i % 2 ? 196 : 176}`).join(' ');
  return `
  <defs>${rough(id('r'), 3, 0.08)}</defs>
  <g filter="url(#${id('r')})" transform="rotate(-10 150 140)">
    <text x="150" y="156" text-anchor="middle" font-family="Permanent Marker" font-size="58" textLength="276" lengthAdjust="spacingAndGlyphs">${word.map((ch, i) => `<tspan fill="${cols[i % 3]}" ${i === 0 ? 'font-size="76"' : ''}>${ch}</tspan>`).join('')}</text>
  </g>
  <polyline points="${zig}" fill="none" stroke="${yellow.hex}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" filter="url(#${id('r')})"/>
  <text x="150" y="250" text-anchor="middle" ${ANTON} font-size="30" fill="${blue.hex}" textLength="250" lengthAdjust="spacingAndGlyphs">THE POINT IS TO KEEP GOING</text>
  ${['EVERY FALL IS PRACTICE.', 'EVERY MATCH IS A LESSON.', 'EVERY DAY IS ANOTHER SHOT.'].map((t, i) => `<text x="150" y="${276 + i * 16}" text-anchor="middle" ${MONO} font-size="10" fill="${blue.hex}" letter-spacing="1.5">${t}</text>`).join('')}
  <rect x="122" y="334" width="56" height="18" fill="${red.hex}"/>
  <text x="150" y="347" text-anchor="middle" ${MONO} font-size="10" fill="#FFFFFF">Nº 14</text>`;
};

// 5. No Limits — dripping spray letters with splatter ------------------------------
const noLimits = ({ id }) => {
  const { lime, white, black } = INK;
  let s = 7;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const splat = Array.from({ length: 90 }, () => {
    const a = rnd() * Math.PI * 2, r = 70 + rnd() ** 1.5 * 120;
    return `<circle cx="${r2(150 + r * Math.cos(a))}" cy="${r2(200 + r * Math.sin(a) * 0.9)}" r="${r2(0.8 + rnd() ** 3 * 6)}"/>`;
  }).join('');
  const drips = [[44, 2, 50], [80, 3, 82], [118, 2, 40], [156, 3, 104], [196, 2, 60], [236, 3, 88], [266, 2, 44]];
  return `
  <defs>${rough(id('r'), 4, 0.07)}</defs>
  <g fill="${white.hex}">${splat}</g>
  <g filter="url(#${id('r')})">
    <g fill="${lime.hex}">${drips.map(([x, , l]) => drip(x, 244, l, 9)).join('')}</g>
    ${[5, 4, 3, 2, 1].map((k) => `<text x="${150 + k}" y="${150 + k}" text-anchor="middle" font-family="Bungee" font-size="96" fill="${black.hex}" textLength="276" lengthAdjust="spacingAndGlyphs">NO</text>
      <text x="${150 + k}" y="${252 + k}" text-anchor="middle" font-family="Bungee" font-size="74" fill="${black.hex}" textLength="276" lengthAdjust="spacingAndGlyphs">LIMITS</text>`).join('')}
    <text x="150" y="150" text-anchor="middle" font-family="Bungee" font-size="96" fill="${white.hex}" stroke="${black.hex}" stroke-width="3" paint-order="stroke" textLength="276" lengthAdjust="spacingAndGlyphs">NO</text>
    <text x="150" y="252" text-anchor="middle" font-family="Bungee" font-size="74" fill="${lime.hex}" stroke="${black.hex}" stroke-width="3" paint-order="stroke" textLength="276" lengthAdjust="spacingAndGlyphs">LIMITS</text>
  </g>
  <text x="150" y="384" text-anchor="middle" font-family="Sedgwick Ave Display" font-size="30" fill="${white.hex}">push past it</text>`;
};

// 6. Stay Hungry 24 — giant outline number, roller swipe, distressed type ----------
const stayHungry = ({ id }) => {
  const { orange, white, black } = INK;
  const swipe = taper([-10, 236], [150, 196], [312, 222], 92, { head: 0.15, tail: 0.15 });
  return `
  <defs>${rough(id('r'), 9, 0.04)}${distress(id('d'), { cut: 0.58 })}${distress(id('d2'), { cut: 0.35, freq: 0.6, seed: 8 })}</defs>
  <text x="150" y="292" text-anchor="middle" ${ANTON} font-size="330" fill="none" stroke="${white.hex}" stroke-width="4" textLength="272" lengthAdjust="spacingAndGlyphs" filter="url(#${id('d2')})">24</text>
  <path d="${swipe}" fill="${orange.hex}" filter="url(#${id('r')})"/>
  <g filter="url(#${id('d')})">
    <text x="150" y="236" text-anchor="middle" ${ANTON} font-size="70" fill="${black.hex}" textLength="262" lengthAdjust="spacingAndGlyphs">STAY HUNGRY</text>
    <text x="150" y="350" text-anchor="middle" ${ANTON} font-size="24" fill="${white.hex}" textLength="250" lengthAdjust="spacingAndGlyphs">TRAIN · EAT · SLEEP · REPEAT</text>
  </g>
  <text x="18" y="390" ${MONO} font-size="10" fill="${white.hex}" letter-spacing="2">SQUAD 24</text>
  <text x="282" y="390" text-anchor="end" ${MONO} font-size="10" fill="${orange.hex}" letter-spacing="2">EST. 2026</text>`;
};

const item = (ref, name, colour, svg, inks) => ({ ref, name, colour, art: { front: { svg, size: SIZE, inks } } });

export default {
  id: 'c11-street-ink',
  code: 'BOYS · 30–36 (10–14 YRS) · OVERSIZED BACK PRINTS',
  title: 'STREET INK',
  technique: 'SCREEN PRINT · MAX 3 COL',
  subtitle: 'distressed type · paint slashes · drip collage',
  layout: 'single',
  countInks: true,
  footer: 'Back prints. Garment colour shows through knock-outs and is not counted as an ink.',
  items: [
    item('SI-01', 'Never Back Down', { name: 'Black', hex: '#141414' }, neverBack, [INK.white, INK.yellow, INK.red]),
    item('SI-02', 'Howzat!', { name: 'Black', hex: '#141414' }, howzat, [INK.pink, INK.cyan, INK.lime]),
    item('SI-03', 'Mumbai', { name: 'Navy', hex: '#1C2340' }, mumbai, [INK.white, INK.yellow, INK.cyan]),
    item('SI-04', 'Unstoppable', { name: 'Off White', hex: '#F1EDE4' }, unstoppable, [INK.red, INK.blue, INK.yellow]),
    item('SI-05', 'No Limits', { name: 'Charcoal', hex: '#3A3A3C' }, noLimits, [INK.lime, INK.white, INK.black]),
    item('SI-06', 'Stay Hungry', { name: 'Olive', hex: '#4D4A2A' }, stayHungry, [INK.orange, INK.white, INK.black]),
  ],
};
