// Collection 12 — REAL INK (preview). Boys 30–36 oversized, realistic texture prints.
// Textures are generated procedurally (textures/*.py) and separated into flat inks,
// so they look like real poured / worn ink yet stay screen-printable.
const SIZE = [300, 400];
const INK = {
  mint: { name: 'Mint', hex: '#7DF0C2' },
  white: { name: 'White', hex: '#FFFFFF' },
  navy: { name: 'Ink Navy', hex: '#1C2340' },
};
const tex = (asset, name) => `<image href="${asset(`output/assets/textures/${name}.png`)}" x="0" y="0" width="300" height="400" preserveAspectRatio="none"/>`;
const MONO = 'font-family="Space Mono"';

// 1. Unreal — marbled pour (front, full coverage) --------------------------------
const unreal = ({ asset }) => `
  ${tex(asset, 'marble-sample')}
  <text x="40" y="118" ${MONO} font-size="7" fill="${INK.navy.hex}">07 MAY</text>
  <text x="40" y="127" ${MONO} font-size="7" fill="${INK.navy.hex}">2026</text>
  <text x="150" y="176" text-anchor="middle" font-family="Archivo" font-weight="800" font-stretch="normal" font-size="30" fill="${INK.navy.hex}" textLength="196" lengthAdjust="spacingAndGlyphs">UNREAL</text>
  ${['when something is so good it feels', 'like it cannot be real. that is you.'].map((t, i) => `<text x="150" y="${188 + i * 8}" text-anchor="middle" ${MONO} font-size="5.6" fill="${INK.navy.hex}">${t}</text>`).join('')}
  <text x="34" y="250" ${MONO} font-weight="700" font-size="6" fill="${INK.navy.hex}">ORIGINAL</text>
  <text x="34" y="257" ${MONO} font-size="5.5" fill="${INK.navy.hex}">one of one</text>
  <text x="120" y="244" ${MONO} font-weight="700" font-size="6" fill="${INK.navy.hex}">FEARLESS</text>
  <text x="120" y="251" ${MONO} font-size="5.5" fill="${INK.navy.hex}">no second thoughts</text>`;

const item = (ref, name, colour, svg, inks) => ({ ref, name, colour, art: { front: { svg, size: SIZE, inks } } });

export default {
  id: 'c12-real-ink',
  code: 'BOYS · 30–36 · OVERSIZED · PREVIEW',
  title: 'REAL INK',
  technique: 'SCREEN PRINT · 3 COL',
  subtitle: 'realistic texture prints — sample for approval',
  layout: 'single',
  countInks: true,
  items: [
    item('RI-01', 'Unreal (marble pour)', { name: 'Lavender', hex: '#969FDC' }, unreal, [INK.mint, INK.white, INK.navy]),
  ],
};
