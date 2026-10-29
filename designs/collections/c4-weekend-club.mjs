// Collection 4 — WEEKEND CLUB: front print + large back print, 2–3 inks per side.
import { contours } from 'd3-contour';
import { createNoise2D } from 'simplex-noise';
import { star, sparkle, arc, pixels, r2 } from '../lib/svg.mjs';

const INK = {
  black: { name: 'Ink Black', hex: '#151515' },
  tomato: { name: 'Tomato', hex: '#FF4B2B' },
  white: { name: 'White', hex: '#FFFFFF' },
  lime: { name: 'Acid Lime', hex: '#D7FF3B' },
  cream: { name: 'Cream', hex: '#FFF1D6' },
  mustard: { name: 'Mustard', hex: '#F2B033' },
  navy: { name: 'Ink Navy', hex: '#1C2340' },
  butter: { name: 'Butter', hex: '#FFE7A3' },
  brown: { name: 'Cocoa', hex: '#3B2418' },
  mint: { name: 'Mint', hex: '#5ED3A0' },
  pink: { name: 'Bubblegum', hex: '#FF8FB8' },
};
const MONO = `font-family="Space Mono" font-weight="700"`;
const XW = `font-family="Archivo" font-weight="900" font-stretch="expanded"`;
const BACK = [300, 380];

// --- Out of Office ---------------------------------------------------------
const oooFront = () => `
  <text x="150" y="150" text-anchor="middle" font-family="Instrument Serif" font-style="italic" font-size="58" fill="${INK.black.hex}">out of office</text>
  <text x="150" y="186" text-anchor="middle" ${MONO} font-size="12" fill="${INK.tomato.hex}" letter-spacing="1">↳ back after snack time</text>`;
const oooBack = () => {
  const { black, tomato } = INK;
  const lines = ["Hi! I'm currently out", 'playing. I will reply', 'after snack time, or', 'when the sun goes down.'];
  return `
  <text x="20" y="28" ${MONO} font-size="12" fill="${tomato.hex}" letter-spacing="2">AUTO-REPLY</text>
  <circle cx="268" cy="24" r="5" fill="${tomato.hex}"/><text x="258" y="28" text-anchor="end" ${MONO} font-size="12" fill="${black.hex}" letter-spacing="1">STATUS: AWAY</text>
  <rect x="20" y="38" width="260" height="2.5" fill="${black.hex}"/>
  ${['OUT', 'OF', 'OFFICE'].map((w, i) => `<text x="18" y="${112 + i * 74}" ${XW} font-size="78" fill="${black.hex}" textLength="${[150, 100, 264][i]}" lengthAdjust="spacingAndGlyphs">${w}</text>`).join('')}
  <g transform="translate(176 86)" fill="none" stroke="${tomato.hex}" stroke-width="5" stroke-linejoin="round">
    <rect x="0" y="0" width="100" height="66" rx="6"/><path d="M4,6 L50,40 L96,6"/>
  </g>
  <rect x="20" y="276" width="260" height="2.5" fill="${black.hex}"/>
  ${lines.map((l, i) => `<text x="20" y="${300 + i * 17}" font-family="Space Mono" font-size="13" fill="${black.hex}">${l}</text>`).join('')}
  <text x="280" y="372" text-anchor="end" font-family="Instrument Serif" font-style="italic" font-size="18" fill="${tomato.hex}">— sent from my imagination</text>`;
};

// --- Night Riders ----------------------------------------------------------
const bike = (cx, cy, s, colour, accent) => {
  const w = 3.2 / s;
  const wheel = (x) => `<circle cx="${x}" cy="0" r="40" fill="none" stroke="${colour}" stroke-width="${w * 1.6}"/>
    <circle cx="${x}" cy="0" r="33" fill="none" stroke="${colour}" stroke-width="${w * 0.6}"/>
    ${Array.from({ length: 12 }, (_, i) => { const a = (i * Math.PI) / 6; return `<line x1="${x}" y1="0" x2="${r2(x + 33 * Math.cos(a))}" y2="${r2(33 * Math.sin(a))}" stroke="${colour}" stroke-width="${w * 0.4}"/>`; }).join('')}
    <circle cx="${x}" cy="0" r="5" fill="${accent}"/>`;
  return `<g transform="translate(${cx} ${cy}) scale(${s})" stroke-linecap="round" stroke-linejoin="round">
    ${wheel(-62)}${wheel(62)}
    <path d="M-62,0 L-14,0 L30,-50 L-28,-50 Z M-14,0 L-36,-62 M62,0 L36,-66 L30,-50" fill="none" stroke="${accent}" stroke-width="${w * 1.5}"/>
    <path d="M-46,-62 L-24,-62 M36,-66 L26,-80 L48,-84" fill="none" stroke="${colour}" stroke-width="${w * 1.5}"/>
    <circle cx="-14" cy="0" r="9" fill="none" stroke="${colour}" stroke-width="${w}"/>
  </g>`;
};
const nightFront = ({ id }) => `
  <defs><path id="${id('a')}" d="${arc(150, 160, 104, 200, 340)}"/></defs>
  <text ${XW} font-size="25" fill="${INK.white.hex}" letter-spacing="2"><textPath href="#${id('a')}" startOffset="50%" text-anchor="middle">NIGHT RIDERS</textPath></text>
  ${bike(150, 176, 0.9, INK.white.hex, INK.lime.hex)}
  <text x="150" y="252" text-anchor="middle" ${MONO} font-size="12" fill="${INK.lime.hex}" letter-spacing="4">BMX CLUB</text>`;
const nightBack = ({ id }) => {
  const { white, lime } = INK;
  return `
  <defs><path id="${id('a')}" d="${arc(150, 200, 128, 196, 344)}"/>
    <mask id="${id('moon')}"><rect width="300" height="380" fill="#fff"/><circle cx="274" cy="26" r="20" fill="#000"/></mask></defs>
  <circle cx="264" cy="34" r="22" fill="${lime.hex}" mask="url(#${id('moon')})"/>
  ${[[40, 40, 7], [86, 70, 4], [180, 30, 5], [276, 112, 4]].map(([x, y, r]) => `<path d="${sparkle(x, y, r)}" fill="${white.hex}"/>`).join('')}
  <text ${XW} font-size="34" fill="${white.hex}" letter-spacing="1"><textPath href="#${id('a')}" startOffset="50%" text-anchor="middle">NIGHT RIDERS</textPath></text>
  ${bike(150, 200, 1.35, white.hex, lime.hex)}
  <rect x="20" y="276" width="260" height="2" fill="${white.hex}"/>
  <text x="150" y="318" text-anchor="middle" ${XW} font-size="30" fill="${lime.hex}" textLength="260" lengthAdjust="spacingAndGlyphs">RIDE AFTER DARK</text>
  <text x="20" y="352" ${MONO} font-size="11" fill="${white.hex}" letter-spacing="2">BMX CLUB · CREW 07</text>
  <text x="280" y="352" text-anchor="end" ${MONO} font-size="11" fill="${white.hex}" letter-spacing="2">EST. 2026</text>`;
};

// --- Trail Mix (topographic) ----------------------------------------------
function topo(w, h, seed = 3) {
  let s = seed;
  const noise = createNoise2D(() => ((s = (s * 16807) % 2147483647) / 2147483647));
  const n = 4, gw = Math.ceil(w / n) + 1, gh = Math.ceil(h / n) + 1;
  const values = new Float64Array(gw * gh);
  for (let y = 0; y < gh; y++)
    for (let x = 0; x < gw; x++)
      values[y * gw + x] = noise(x * 0.035, y * 0.035) + 0.5 * noise(x * 0.08 + 10, y * 0.08) + 0.25 * noise(x * 0.16, y * 0.16 + 5);
  const levels = contours().size([gw, gh]).thresholds(Array.from({ length: 16 }, (_, i) => -1.4 + i * 0.18))(values);
  return levels.map((lvl, i) => {
    const d = lvl.coordinates.flatMap((poly) => poly.map((ring) => `M${ring.map(([x, y]) => `${r2(x * n)},${r2(y * n)}`).join('L')}Z`)).join('');
    return { d, major: i % 4 === 0 };
  });
}
const TOPO = topo(260, 230);
const trailFront = () => `
  <path d="M96,170 L132,112 L150,138 L170,104 L210,170 Z" fill="none" stroke="${INK.cream.hex}" stroke-width="5" stroke-linejoin="round"/>
  <path d="M132,112 L124,126 M170,104 L178,118" stroke="${INK.mustard.hex}" stroke-width="5" stroke-linecap="round"/>
  <text x="150" y="214" text-anchor="middle" font-family="Big Shoulders Display" font-weight="900" font-size="46" fill="${INK.cream.hex}" letter-spacing="4">TRAIL MIX</text>
  <text x="150" y="236" text-anchor="middle" ${MONO} font-size="10" fill="${INK.mustard.hex}" letter-spacing="3">EXPLORE THE UNKNOWN</text>`;
const trailBack = ({ id }) => {
  const { cream, mustard } = INK;
  return `
  <defs><clipPath id="${id('arch')}"><path d="M20,250 L20,140 A130,130 0 0 1 280,140 L280,250 Z"/></clipPath></defs>
  <g clip-path="url(#${id('arch')})" transform="translate(20 20)">
    ${TOPO.map((c) => `<path d="${c.d}" fill="none" stroke="${cream.hex}" stroke-width="${c.major ? 2 : 0.9}"/>`).join('')}
  </g>
  <path d="M20,250 L20,140 A130,130 0 0 1 280,140 L280,250" fill="none" stroke="${cream.hex}" stroke-width="3"/>
  <path d="M60,222 C96,200 104,160 146,150 S196,96 224,84" fill="none" stroke="${mustard.hex}" stroke-width="4" stroke-dasharray="1 9" stroke-linecap="round"/>
  <path d="M224,62 a12,12 0 0 1 12,12 c0,10 -12,22 -12,22 c0,0 -12,-12 -12,-22 a12,12 0 0 1 12,-12z" fill="${mustard.hex}"/><circle cx="224" cy="74" r="4.5" fill="#2F4A3A"/>
  <text x="150" y="318" text-anchor="middle" font-family="Big Shoulders Display" font-weight="900" font-size="72" fill="${cream.hex}" textLength="262" lengthAdjust="spacingAndGlyphs">TRAIL MIX</text>
  <text x="20" y="350" ${MONO} font-size="10.5" fill="${mustard.hex}" letter-spacing="1">28.6139° N · 77.2090° E</text>
  <text x="280" y="350" text-anchor="end" ${MONO} font-size="10.5" fill="${cream.hex}" letter-spacing="1">ALT. 216 M</text>
  <text x="150" y="372" text-anchor="middle" ${MONO} font-size="10.5" fill="${cream.hex}" letter-spacing="4">EXPLORE THE UNKNOWN</text>`;
};

// --- Cloud 9 ---------------------------------------------------------------
const cloudShape = (cx, cy, s) => `<g transform="translate(${cx} ${cy}) scale(${s})">
  <circle cx="-70" cy="20" r="42"/><circle cx="-22" cy="-18" r="58"/><circle cx="44" cy="-6" r="50"/><circle cx="88" cy="26" r="36"/><rect x="-112" y="20" width="236" height="42" rx="21"/></g>`;
const cloudFront = () => `
  <g fill="${INK.white.hex}">${cloudShape(150, 140, 0.62)}</g>
  <text x="150" y="160" text-anchor="middle" font-family="Instrument Serif" font-style="italic" font-size="44" fill="${INK.navy.hex}">cloud 9</text>`;
const cloudBack = () => {
  const { white, navy } = INK;
  return `
  ${[0, 1, 2].map((i) => `<text x="150" y="${44 + i * 22}" text-anchor="middle" ${MONO} font-size="13" fill="${i === 1 ? navy.hex : white.hex}" letter-spacing="4">${i === 1 ? '✦ HEAD IN THE CLOUDS ✦' : 'HEAD IN THE CLOUDS'}</text>`).join('')}
  <g fill="${white.hex}">${cloudShape(150, 196, 1.08)}</g>
  <text x="150" y="230" text-anchor="middle" font-family="Bagel Fat One" font-size="66" fill="${navy.hex}" textLength="236" lengthAdjust="spacingAndGlyphs">CLOUD 9</text>
  ${[[34, 300, 12], [266, 296, 9], [70, 344, 6], [230, 350, 7]].map(([x, y, r], i) => `<path d="${sparkle(x, y, r)}" fill="${i % 2 ? navy.hex : white.hex}"/>`).join('')}
  <text x="150" y="334" text-anchor="middle" font-family="Instrument Serif" font-style="italic" font-size="26" fill="${navy.hex}">happiest place up here</text>`;
};

// --- Sunshine Society ------------------------------------------------------
const sun = (cx, cy, r, rays, long, short, fill) =>
  `${Array.from({ length: rays }, (_, i) => {
    const a = (i * 2 * Math.PI) / rays, len = i % 2 ? short : long, w = i % 2 ? 0.05 : 0.08;
    const p = (rad, ang) => `${r2(cx + rad * Math.cos(ang))},${r2(cy + rad * Math.sin(ang))}`;
    return `<path d="M${p(r + 8, a - w)} L${p(r + 8 + len, a)} L${p(r + 8, a + w)} Z" fill="${fill}"/>`;
  }).join('')}<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;
const sunFront = () => `
  ${sun(150, 128, 34, 16, 26, 14, INK.butter.hex)}
  <text x="150" y="232" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="34" fill="${INK.butter.hex}" letter-spacing="3">SUN CLUB</text>`;
const sunBack = ({ id }) => {
  const { butter, brown } = INK;
  return `
  <defs><path id="${id('a')}" d="${arc(150, 186, 140, 190, 350)}"/><path id="${id('b')}" d="${arc(150, 186, 156, 162, 18)}"/></defs>
  <text font-family="Unbounded" font-weight="900" font-size="27" fill="${butter.hex}" letter-spacing="3"><textPath href="#${id('a')}" startOffset="50%" text-anchor="middle">SUNSHINE SOCIETY</textPath></text>
  ${sun(150, 186, 62, 24, 46, 24, butter.hex)}
  <path d="M124,180 q8,-10 16,0 M160,180 q8,-10 16,0" fill="none" stroke="${brown.hex}" stroke-width="5" stroke-linecap="round"/>
  <path d="M128,202 q22,22 44,0" fill="none" stroke="${brown.hex}" stroke-width="5.5" stroke-linecap="round"/>
  <text font-family="Space Mono" font-weight="700" font-size="11.5" fill="${butter.hex}" letter-spacing="3"><textPath href="#${id('b')}" startOffset="50%" text-anchor="middle">MEMBERS ONLY · KIDS WHO PLAY OUTSIDE</textPath></text>
  <text x="150" y="372" text-anchor="middle" font-family="Instrument Serif" font-style="italic" font-size="22" fill="${butter.hex}">est. every summer</text>`;
};

// --- Game Night (pixel) ----------------------------------------------------
const PAD = [
  '....##########....',
  '..##############..',
  '.################.',
  '##################',
  '##################',
  '##################',
  '#######....#######',
  '######......######',
  '.####........####.',
  '..##..........##..',
];
const padButtons = (x0, y0, s, a, b) => `
  ${pixels(['.#.', '###', '.#.'], s, x0 + 3 * s, y0 + 2 * s, a)}
  ${pixels(['#.', '.#'], s, x0 + 12 * s, y0 + 2 * s, b)}
  ${pixels(['.#', '#.'], s, x0 + 13 * s, y0 + 2 * s, a)}`;
const gameFront = () => `
  ${pixels(PAD, 8, 150 - 9 * 8, 100, INK.white.hex)}
  ${padButtons(150 - 9 * 8, 100, 8, INK.mint.hex, INK.mint.hex)}
  <text x="150" y="222" text-anchor="middle" font-family="Silkscreen" font-weight="700" font-size="26" fill="${INK.white.hex}">P1 READY</text>`;
const gameBack = () => {
  const { white, mint, pink } = INK;
  const heart = ['.##.##.', '#######', '#######', '.#####.', '..###..', '...#...'];
  return `
  <text x="20" y="36" font-family="Silkscreen" font-size="14" fill="${white.hex}">HI-SCORE</text>
  <text x="280" y="36" text-anchor="end" font-family="Silkscreen" font-weight="700" font-size="14" fill="${mint.hex}">999,999</text>
  ${[0, 1, 2].map((i) => pixels(heart, 3.6, 20 + i * 30, 50, pink.hex)).join('')}
  ${pixels(PAD, 14, 150 - 9 * 14, 92, mint.hex)}
  ${padButtons(150 - 9 * 14, 92, 14, white.hex, pink.hex)}
  <text x="150" y="294" text-anchor="middle" font-family="Silkscreen" font-weight="700" font-size="58" fill="${white.hex}" textLength="262" lengthAdjust="spacingAndGlyphs">GAME NIGHT</text>
  <text x="150" y="334" text-anchor="middle" font-family="Silkscreen" font-size="17" fill="${pink.hex}" letter-spacing="1">PRESS ANY BUTTON</text>
  <text x="150" y="364" text-anchor="middle" font-family="Silkscreen" font-size="12" fill="${mint.hex}" letter-spacing="2">LEVEL 99 · NO SAVE POINTS</text>`;
};

const item = (ref, name, colour, front, back, frontInks, backInks) => ({
  ref, name, colour,
  art: { front: { svg: front, inks: frontInks }, back: { svg: back, size: BACK, inks: backInks } },
});

export default {
  id: 'c4-weekend-club',
  code: 'C4',
  title: 'WEEKEND CLUB',
  technique: 'FRONT + BACK PRINT',
  subtitle: 'front print + large back print, 2–3 inks',
  layout: 'front-back',
  countInks: true,
  items: [
    item('WC-01', 'Out Of Office', { name: 'Stone', hex: '#D8CFC0' }, oooFront, oooBack, [INK.black, INK.tomato], [INK.black, INK.tomato]),
    item('WC-02', 'Night Riders', { name: 'Jet Black', hex: '#141414' }, nightFront, nightBack, [INK.white, INK.lime], [INK.white, INK.lime]),
    item('WC-03', 'Trail Mix', { name: 'Forest', hex: '#2F4A3A' }, trailFront, trailBack, [INK.cream, INK.mustard], [INK.cream, INK.mustard]),
    item('WC-04', 'Cloud 9', { name: 'Sky Blue', hex: '#A9CDEB' }, cloudFront, cloudBack, [INK.white, INK.navy], [INK.white, INK.navy]),
    item('WC-05', 'Sunshine Society', { name: 'Terracotta', hex: '#C0643F' }, sunFront, sunBack, [INK.butter], [INK.butter, INK.brown]),
    item('WC-06', 'Game Night', { name: 'Charcoal', hex: '#3A3A3C' }, gameFront, gameBack, [INK.white, INK.mint], [INK.white, INK.mint, INK.pink]),
  ],
};
