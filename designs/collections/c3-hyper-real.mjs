// Collection 3 — HYPER REAL: full-colour photo/digital prints (DTF or sublimation).
// Imagery is original 3D / procedural rendering from ../3d (run render-3d.mjs first),
// so there are no third-party photo rights involved.
import { sparkle } from '../lib/svg.mjs';

const ASSET = 'output/assets/3d';
const NAVY = '#1C2340';
const MONO = `font-family="Space Mono" font-weight="700"`;
const img = (asset, name, x, y, w, extra = '') =>
  `<image href="${asset(`${ASSET}/${name}.png`)}" x="${x}" y="${y}" width="${w}" height="${w}" ${extra}/>`;
const FULL = [{ name: 'Full colour (CMYK + white)', hex: 'conic-gradient(#00c2ff,#ff3da8,#ffe600,#00c2ff)' }];

const lostInSpace = ({ id, asset }) => `
  <defs>
    <clipPath id="${id('c')}"><circle cx="150" cy="124" r="98"/></clipPath>
    <linearGradient id="${id('fade')}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9FE8FF"/><stop offset="1" stop-color="#FF8AD8"/></linearGradient>
  </defs>
  <g clip-path="url(#${id('c')})">${img(asset, 'nebula', 52, 26, 196)}</g>
  <circle cx="150" cy="124" r="108" fill="none" stroke="url(#${id('fade')})" stroke-width="1.5" stroke-dasharray="1 5" stroke-linecap="round"/>
  ${img(asset, 'planet', 96, -26, 236)}
  <text x="150" y="268" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="30" fill="#FFFFFF" textLength="262" lengthAdjust="spacingAndGlyphs">LOST IN SPACE</text>
  <text x="150" y="292" text-anchor="middle" ${MONO} font-size="10" fill="url(#${id('fade')})" letter-spacing="3">COORDINATES UNKNOWN · 00:24:07</text>`;

const playInflated = ({ asset }) => `
  <text x="150" y="70" text-anchor="middle" ${MONO} font-size="11" fill="#FFFFFF" letter-spacing="5">PRESS START TO</text>
  ${img(asset, 'play', -14, -2, 328)}
  <text x="150" y="252" text-anchor="middle" font-family="Instrument Serif" font-style="italic" font-size="34" fill="#FFFFFF">rule the playground</text>
  ${[[34, 60, 10, '#FFD23F'], [270, 54, 8, '#FF7FB0'], [276, 282, 9, '#52D99A'], [24, 280, 7, '#5FB8FF']].map(([x, y, r, c]) => `<path d="${sparkle(x, y, r)}" fill="${c}"/>`).join('')}`;

const future = ({ id, asset }) => `
  <defs><linearGradient id="${id('g')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#2B5BFF"/></linearGradient></defs>
  <text x="150" y="92" text-anchor="middle" ${MONO} font-size="12" fill="${NAVY}" letter-spacing="6">WELCOME TO THE</text>
  ${img(asset, 'future', -6, -4, 312)}
  <text x="150" y="232" text-anchor="middle" font-family="Instrument Serif" font-style="italic" font-size="40" fill="${NAVY}">is now.</text>
  <path d="${sparkle(48, 214, 13)}" fill="url(#${id('g')})"/><path d="${sparkle(258, 98, 10)}" fill="url(#${id('g')})"/><path d="${sparkle(244, 220, 6)}" fill="#FFFFFF"/>
  <text x="150" y="282" text-anchor="middle" ${MONO} font-size="10" fill="${NAVY}" letter-spacing="3">EST. 2026 · BUILT FOR TOMORROW</text>`;

const rollWithIt = ({ asset }) => `
  ${img(asset, 'dice', 0, -44, 300)}
  <text x="150" y="250" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="38" fill="${NAVY}" textLength="262" lengthAdjust="spacingAndGlyphs">ROLL WITH IT</text>
  <rect x="98" y="264" width="104" height="24" rx="12" fill="#FF7FB0"/>
  <text x="150" y="281" text-anchor="middle" ${MONO} font-size="11" fill="${NAVY}" letter-spacing="2">LUCKY DAY</text>`;

const blastOff = ({ asset }) => {
  const cloud = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" fill="#FFFFFF"><circle cx="0" cy="0" r="22"/><circle cx="26" cy="-10" r="28"/><circle cx="56" cy="2" r="20"/><rect x="-10" y="0" width="74" height="20" rx="10"/></g>`;
  return `
  ${img(asset, 'rocket', -34, -38, 330)}
  ${cloud(28, 214, 0.9)}${cloud(196, 206, 0.75)}
  <text x="150" y="270" text-anchor="middle" font-family="Archivo" font-weight="900" font-stretch="expanded" font-size="44" fill="${NAVY}" textLength="262" lengthAdjust="spacingAndGlyphs">BLAST OFF</text>
  <text x="150" y="292" text-anchor="middle" ${MONO} font-size="11" fill="${NAVY}" letter-spacing="4">3 · 2 · 1 · GO TEAM</text>`;
};

const dreamBig = ({ asset }) => `
  ${img(asset, 'shapes', -8, -8, 316)}
  <text x="150" y="146" text-anchor="middle" font-family="Instrument Serif" font-style="italic" font-size="64" fill="${NAVY}">dream</text>
  <text x="150" y="196" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="54" fill="${NAVY}" letter-spacing="2">BIG</text>`;

export default {
  id: 'c3-hyper-real',
  code: 'C3',
  title: 'HYPER REAL',
  technique: 'PHOTO / DIGITAL PRINT (DTF)',
  subtitle: 'full-colour 3D & photographic renders',
  layout: 'single',
  footer: 'Imagery: original 3D renders, no stock photos.',
  items: [
    { ref: 'HR-01', name: 'Lost In Space', colour: { name: 'Jet Black', hex: '#141414' }, art: { front: { svg: lostInSpace, inks: FULL } } },
    { ref: 'HR-02', name: 'Play (Inflated)', colour: { name: 'Ink Navy', hex: '#1C2340' }, art: { front: { svg: playInflated, inks: FULL } } },
    { ref: 'HR-03', name: 'Future Chrome', colour: { name: 'Dusty Lilac', hex: '#B9A7D6' }, art: { front: { svg: future, inks: FULL } } },
    { ref: 'HR-04', name: 'Roll With It', colour: { name: 'Sage', hex: '#B5C4A8' }, art: { front: { svg: rollWithIt, inks: FULL } } },
    { ref: 'HR-05', name: 'Blast Off', colour: { name: 'Sky Blue', hex: '#A8D4F0' }, art: { front: { svg: blastOff, inks: FULL } } },
    { ref: 'HR-06', name: 'Dream Big', colour: { name: 'Cream', hex: '#F3E8D6' }, art: { front: { svg: dreamBig, inks: FULL } } },
  ],
};
