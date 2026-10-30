// Collection 8 — BACK STORY. Boys 30–36 (10–14 yrs), oversized / drop-shoulder streetwear.
// Front: big chest print, 1 ink. Back: full-coverage lettering/number print, 3 inks,
// each with one small icon. Every back uses a different type treatment (playbook §2).
import { sparkle, star, wave, r2 } from '../lib/svg.mjs';

const INK = {
  cream: { name: 'Cream', hex: '#F3EBDD' },
  orange: { name: 'Safety Orange', hex: '#FF5A1F' },
  steel: { name: 'Steel Grey', hex: '#8C9096' },
  black: { name: 'Black', hex: '#151515' },
  butter: { name: 'Butter', hex: '#FFD24A' },
  white: { name: 'White', hex: '#FFFFFF' },
  red: { name: 'Racing Red', hex: '#E5322D' },
  lime: { name: 'Acid Lime', hex: '#C6FF3A' },
  navy: { name: 'Navy', hex: '#1C2340' },
  varsity: { name: 'Varsity Red', hex: '#C8102E' },
  coral: { name: 'Coral', hex: '#FF6B4A' },
};
const BACK = [300, 400];
const MONO = `font-family="Space Mono" font-weight="700"`;
const XW = `font-family="Archivo" font-weight="900" font-stretch="expanded"`;
const fit = (w = 276) => `textLength="${w}" lengthAdjust="spacingAndGlyphs"`;

// Small icons ---------------------------------------------------------------
const runner = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${c}" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="60" cy="13" r="9" fill="${c}" stroke="none"/>
  <path d="M55,26 L44,56" stroke-width="11"/>
  <path d="M53,32 L70,42 L82,32 M51,32 L36,40 L28,53" stroke-width="8"/>
  <path d="M44,56 L60,68 L57,88 L68,90 M44,56 L30,71 L13,66" stroke-width="10"/></g>`;
const sneaker = (x, y, s, fill, line, sole) => `<g transform="translate(${x} ${y}) scale(${s})" stroke="${line}" stroke-width="2.6" stroke-linejoin="round">
  <path d="M4,26 C3,12 14,6 24,8 L38,2 C47,0 55,6 57,14 L68,19 C73,21 73,28 68,30 L4,30 Z" fill="${fill}"/>
  <rect x="2" y="28" width="70" height="9" rx="4.5" fill="${sole}"/>
  <path d="M30,9 L36,16 M36,6 L42,13 M42,4 L47,11" fill="none"/>
  <path d="${star(18, 20, 5, 6, 2.6)}" fill="${line}" stroke="none"/></g>`;
const raceCar = (x, y, s, body, wheel, hub) => `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M2,22 L12,15 L34,12 L44,3 L58,3 L62,12 L88,14 L92,22 Z" fill="${body}"/>
  <path d="M46,5 L56,5 L58,11 L44,11 Z" fill="${wheel}"/>
  <rect x="84" y="6" width="8" height="10" fill="${body}"/>
  <circle cx="20" cy="24" r="8" fill="${wheel}"/><circle cx="74" cy="24" r="8" fill="${wheel}"/>
  <circle cx="20" cy="24" r="3" fill="${hub}"/><circle cx="74" cy="24" r="3" fill="${hub}"/></g>`;
const boombox = (x, y, s, body, dark, accent) => `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M24,8 L24,2 L76,2 L76,8" fill="none" stroke="${body}" stroke-width="4"/>
  <rect x="2" y="8" width="96" height="50" rx="8" fill="${body}"/>
  <circle cx="24" cy="36" r="16" fill="${dark}"/><circle cx="76" cy="36" r="16" fill="${dark}"/>
  <circle cx="24" cy="36" r="6" fill="${accent}"/><circle cx="76" cy="36" r="6" fill="${accent}"/>
  <rect x="42" y="16" width="16" height="8" rx="2" fill="${dark}"/><rect x="42" y="30" width="16" height="4" fill="${accent}"/><rect x="42" y="40" width="16" height="4" fill="${accent}"/></g>`;
const basketball = (x, y, r, fill, line) => `<g>
  <circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>
  <path d="M${x},${y - r} L${x},${y + r} M${x - r},${y} L${x + r},${y} M${x - r * 0.7},${y - r * 0.7} Q${x - r * 0.2},${y} ${x - r * 0.7},${y + r * 0.7} M${x + r * 0.7},${y - r * 0.7} Q${x + r * 0.2},${y} ${x + r * 0.7},${y + r * 0.7}" fill="none" stroke="${line}" stroke-width="${r * 0.12}"/></g>`;
const skateboard = (x, y, s, deck, wheel) => `<g transform="translate(${x} ${y}) scale(${s}) rotate(-14 50 14)">
  <rect x="0" y="6" width="100" height="14" rx="7" fill="${deck}"/>
  <circle cx="22" cy="26" r="6" fill="${wheel}"/><circle cx="78" cy="26" r="6" fill="${wheel}"/></g>`;
const barcode = (x, y, h, c, n = 28) => {
  let out = '', cx = x;
  for (let i = 0; i < n; i++) { const w = [1, 2, 1, 3, 1, 1, 2][i % 7]; out += `<rect x="${cx}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`; cx += w + [2, 1, 2, 1, 3][i % 5]; }
  return out;
};

// 1. Run The City — race-bib numbers -----------------------------------------
const runBack = () => {
  const { cream, orange, steel } = INK;
  return `
  <text x="12" y="24" ${MONO} font-size="10" fill="${steel.hex}" letter-spacing="1.5">CITY MARATHON · DIV. B</text>
  <text x="288" y="24" text-anchor="end" ${MONO} font-size="10" fill="${orange.hex}" letter-spacing="1.5">★ 2026</text>
  <rect x="12" y="32" width="276" height="2" fill="${steel.hex}"/>
  <text x="150" y="238" text-anchor="middle" font-family="Big Shoulders Display" font-weight="900" font-size="224" fill="${orange.hex}" ${fit()}>07</text>
  <text x="150" y="292" text-anchor="middle" ${XW} font-size="44" fill="${cream.hex}" ${fit()}>RUN THE CITY</text>
  <rect x="12" y="306" width="276" height="2" fill="${steel.hex}"/>
  ${[['DIST', '21.1 KM'], ['PACE', '4\'20"/KM'], ['TIME', '01:31:07']].map(([k, v], i) => `
    <text x="12" y="${328 + i * 20}" ${MONO} font-size="10" fill="${steel.hex}" letter-spacing="1">${k}</text>
    <text x="58" y="${328 + i * 20}" ${MONO} font-size="12" fill="${cream.hex}" letter-spacing="1">${v}</text>`).join('')}
  ${barcode(12, 376, 14, steel.hex)}
  <rect x="196" y="314" width="92" height="80" rx="8" fill="none" stroke="${cream.hex}" stroke-width="2.5"/>
  ${runner(204, 316, 0.78, orange.hex)}`;
};
const runFront = () => `
  ${runner(104, 6, 0.95, INK.cream.hex)}
  <text x="150" y="168" text-anchor="middle" ${XW} font-size="52" fill="${INK.cream.hex}" ${fit(270)}>RUN THE</text>
  <text x="150" y="246" text-anchor="middle" ${XW} font-size="84" fill="${INK.cream.hex}" ${fit(270)}>CITY</text>
  <text x="150" y="282" text-anchor="middle" ${MONO} font-size="14" fill="${INK.cream.hex}" letter-spacing="4">DIV. B · Nº 07</text>`;

// 2. No Days Off — inflated bubble letters ----------------------------------
const bubble = (txt, y, size, fill, line, shadow) => `
  <text x="150" y="${y + 7}" text-anchor="middle" font-family="Bagel Fat One" font-size="${size}" fill="${shadow}" stroke="${shadow}" stroke-width="12" stroke-linejoin="round" ${fit()} transform="translate(5 0)">${txt}</text>
  <text x="150" y="${y}" text-anchor="middle" font-family="Bagel Fat One" font-size="${size}" fill="${fill}" stroke="${line}" stroke-width="10" stroke-linejoin="round" paint-order="stroke" ${fit()}>${txt}</text>`;
const noDaysBack = () => {
  const { cream, black, butter } = INK;
  return `
  ${bubble('NO', 116, 128, cream.hex, black.hex, black.hex)}
  ${bubble('DAYS', 226, 128, cream.hex, black.hex, black.hex)}
  ${bubble('OFF', 336, 128, butter.hex, black.hex, black.hex)}
  ${[[30, 40, 12], [272, 150, 10], [26, 262, 9]].map(([x, y, r]) => `<path d="${sparkle(x, y, r)}" fill="${butter.hex}"/>`).join('')}
  ${sneaker(14, 354, 0.86, butter.hex, black.hex, cream.hex)}
  <rect x="100" y="362" width="188" height="26" rx="13" fill="${black.hex}"/>
  <text x="194" y="380" text-anchor="middle" ${MONO} font-size="11" fill="${cream.hex}" letter-spacing="2">TRAINING ARC · EP.365</text>`;
};
const noDaysFront = () => `
  <text x="150" y="136" text-anchor="middle" font-family="Bagel Fat One" font-size="96" fill="${INK.cream.hex}" ${fit(270)}>NO DAYS</text>
  <text x="150" y="236" text-anchor="middle" font-family="Bagel Fat One" font-size="96" fill="${INK.cream.hex}" ${fit(270)}>OFF</text>
  ${sneaker(196, 244, 1.1, 'none', INK.cream.hex, 'none')}`;

// 3. Full Throttle 35 — racing livery ---------------------------------------
const throttleBack = ({ id }) => {
  const { white, black, red } = INK;
  return `
  <defs><clipPath id="${id('c')}"><rect width="300" height="400"/></clipPath></defs>
  <g clip-path="url(#${id('c')})">
    <path d="M-20,120 L180,-20 L222,-20 L22,120 Z" fill="${red.hex}"/>
    <path d="M30,120 L230,-20 L246,-20 L46,120 Z" fill="${white.hex}"/>
    <path d="M58,120 L258,-20 L268,-20 L68,120 Z" fill="${black.hex}"/>
  </g>
  <text x="12" y="24" ${MONO} font-size="10" fill="${white.hex}" letter-spacing="1.5">GRID P1</text><text x="12" y="38" ${MONO} font-size="10" fill="${white.hex}" letter-spacing="1.5">LAP 35/35</text>
  <g transform="skewX(-12) translate(48 0)">
    <text x="150" y="258" text-anchor="middle" ${XW} font-size="210" fill="${red.hex}" ${fit(250)} transform="translate(8 7)">35</text>
    <text x="150" y="258" text-anchor="middle" ${XW} font-size="210" fill="${white.hex}" stroke="${black.hex}" stroke-width="6" paint-order="stroke" ${fit(250)}>35</text>
  </g>
  <text x="150" y="304" text-anchor="middle" font-family="Racing Sans One" font-size="46" fill="${white.hex}" ${fit()}>FULL THROTTLE</text>
  ${Array.from({ length: 2 }, (_, r) => Array.from({ length: 23 }, (_, c) => `<rect x="${12 + c * 12}" y="${314 + r * 12}" width="12" height="12" fill="${(r + c) % 2 ? black.hex : white.hex}"/>`).join('')).join('')}
  <rect x="12" y="350" width="104" height="22" rx="4" fill="${red.hex}"/><text x="64" y="365" text-anchor="middle" ${MONO} font-size="10" fill="${white.hex}">TURBO KIDS</text>
  <rect x="12" y="376" width="104" height="18" rx="4" fill="none" stroke="${white.hex}" stroke-width="1.6"/><text x="64" y="389" text-anchor="middle" ${MONO} font-size="9" fill="${white.hex}">PIT CREW Nº35</text>
  ${raceCar(150, 352, 1.48, red.hex, black.hex, white.hex)}`;
};
const throttleFront = () => `
  ${Array.from({ length: 2 }, (_, r) => Array.from({ length: 23 }, (_, c) => ((r + c) % 2 ? '' : `<rect x="${12 + c * 12}" y="${50 + r * 12}" width="12" height="12" fill="${INK.white.hex}"/>`)).join('')).join('')}
  <text x="150" y="150" text-anchor="middle" font-family="Racing Sans One" font-size="64" fill="${INK.white.hex}" ${fit()}>FULL</text>
  <text x="150" y="222" text-anchor="middle" font-family="Racing Sans One" font-size="64" fill="${INK.white.hex}" ${fit()}>THROTTLE</text>
  <text x="150" y="262" text-anchor="middle" ${MONO} font-size="14" fill="${INK.white.hex}" letter-spacing="5">Nº 35 · GRID P1</text>`;

// 4. Make Noise — graffiti drip --------------------------------------------
const makeNoiseBack = () => {
  const { black, lime, white } = INK;
  let s = 9;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const dots = Array.from({ length: 70 }, () => `<circle cx="${r2(rnd() * 300)}" cy="${r2(60 + rnd() * 300)}" r="${r2(0.8 + rnd() * 2.4)}" fill="${rnd() > 0.5 ? white.hex : lime.hex}"/>`).join('');
  const drips = [[34, 52], [78, 34], [118, 70], [168, 44], [214, 62], [258, 38]];
  const dripPath = drips.map(([x, len]) => `<rect x="${x}" y="196" width="14" height="${len + 34}" rx="7"/><circle cx="${x + 7}" cy="${226 + len}" r="10"/>`).join('');
  return `
  ${dots}
  <text x="150" y="104" text-anchor="middle" font-family="Sedgwick Ave Display" font-size="96" fill="${white.hex}" transform="rotate(-6 150 80)" ${fit(240)}>Make</text>
  <g fill="${black.hex}" stroke="${black.hex}" stroke-width="12">${dripPath}</g>
  <g fill="${lime.hex}">${dripPath}</g>
  ${[6, 5, 4, 3, 2, 1].map((d) => `<text x="${150 + d}" y="${236 + d}" text-anchor="middle" font-family="Bungee" font-size="94" fill="${black.hex}" ${fit(280)}>NOISE</text>`).join('')}
  <text x="150" y="236" text-anchor="middle" font-family="Bungee" font-size="94" fill="${lime.hex}" stroke="${black.hex}" stroke-width="6" paint-order="stroke" ${fit(280)}>NOISE</text>
  ${boombox(18, 318, 0.9, white.hex, black.hex, lime.hex)}
  <text x="120" y="344" font-family="Sedgwick Ave Display" font-size="34" fill="${lime.hex}">turn it up</text>
  <text x="120" y="372" ${MONO} font-size="11" fill="${white.hex}" letter-spacing="2">VOL. 11 · NO SKIPS</text>
  <path d="M262,58 l14,-14 m-6,0 l6,0 l0,6 M30,170 l-8,8 M270,300 l12,-6" stroke="${white.hex}" stroke-width="3" stroke-linecap="round" fill="none"/>`;
};
const makeNoiseFront = () => {
  let s = 4;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  return `
  ${Array.from({ length: 40 }, () => `<circle cx="${r2(20 + rnd() * 260)}" cy="${r2(40 + rnd() * 220)}" r="${r2(0.8 + rnd() * 2)}" fill="${INK.white.hex}"/>`).join('')}
  <text x="150" y="140" text-anchor="middle" font-family="Sedgwick Ave Display" font-size="110" fill="${INK.white.hex}" transform="rotate(-5 150 120)" ${fit(250)}>Make</text>
  <text x="150" y="238" text-anchor="middle" font-family="Sedgwick Ave Display" font-size="110" fill="${INK.white.hex}" transform="rotate(-5 150 220)" ${fit(270)}>Noise</text>`;
};

// 5. Westside Athletics 23 — varsity ----------------------------------------
const varsityBack = ({ id }) => {
  const { navy, varsity: red, cream } = INK;
  return `
  <defs><path id="${id('arc')}" d="M18,128 Q150,10 282,128"/></defs>
  <text font-family="Graduate" font-size="50" fill="${navy.hex}" stroke="${cream.hex}" stroke-width="5" paint-order="stroke" letter-spacing="2"><textPath href="#${id('arc')}" startOffset="50%" text-anchor="middle">WESTSIDE</textPath></text>
  ${basketball(150, 112, 22, red.hex, navy.hex)}
  <text x="150" y="168" text-anchor="middle" font-family="Graduate" font-size="30" fill="${navy.hex}" letter-spacing="8">ATHLETICS</text>
  <text x="150" y="342" text-anchor="middle" font-family="Graduate" font-size="214" fill="${red.hex}" stroke="${navy.hex}" stroke-width="10" paint-order="stroke" stroke-linejoin="round" ${fit(258)} transform="translate(8 8)">23</text>
  <text x="150" y="342" text-anchor="middle" font-family="Graduate" font-size="214" fill="${cream.hex}" stroke="${navy.hex}" stroke-width="10" paint-order="stroke" stroke-linejoin="round" ${fit(258)}>23</text>
  ${[22, 40, 260, 278].map((x) => `<path d="${star(x, 377, 5, 8, 3.4)}" fill="${navy.hex}"/>`).join('')}
  <rect x="62" y="364" width="176" height="26" rx="13" fill="${navy.hex}"/>
  <text x="150" y="382" text-anchor="middle" ${MONO} font-size="11" fill="${cream.hex}" letter-spacing="3">EST. 2026 · DIV. B</text>`;
};
const varsityFront = ({ id }) => `
  <defs><path id="${id('arc')}" d="M20,170 Q150,40 280,170"/></defs>
  <text font-family="Graduate" font-size="56" fill="${INK.navy.hex}" letter-spacing="2"><textPath href="#${id('arc')}" startOffset="50%" text-anchor="middle">WESTSIDE</textPath></text>
  <text x="150" y="206" text-anchor="middle" font-family="Graduate" font-size="34" fill="${INK.navy.hex}" letter-spacing="9">ATHLETICS</text>
  <text x="150" y="276" text-anchor="middle" font-family="Graduate" font-size="64" fill="none" stroke="${INK.navy.hex}" stroke-width="3">23</text>`;

// 6. Keep Moving — Swiss grid poster ----------------------------------------
const movingBack = () => {
  const { cream, lime, coral } = INK;
  return `
  ${[75, 150, 225].map((x) => `<rect x="${x}" y="0" width="1" height="400" fill="${cream.hex}" opacity=".5"/>`).join('')}
  <text x="12" y="22" ${MONO} font-size="10" fill="${cream.hex}" letter-spacing="1.5">VOL. 02</text>
  <text x="162" y="22" ${MONO} font-size="10" fill="${cream.hex}" letter-spacing="1.5">FORWARD ONLY</text>
  <text x="12" y="172" font-family="Anton" font-size="150" fill="${cream.hex}" ${fit()}>KEEP</text>
  <text x="12" y="272" font-family="Anton" font-size="112" fill="${lime.hex}" ${fit()}>MOVING</text>
  <text x="12" y="336" font-family="Anton" font-size="62" fill="none" stroke="${cream.hex}" stroke-width="1.4" ${fit()}>MOVING MOVING</text>
  <path d="M200,358 L262,358 M246,344 L264,358 L246,372" fill="none" stroke="${coral.hex}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  ${skateboard(12, 352, 0.78, coral.hex, cream.hex)}
  <text x="106" y="372" ${MONO} font-size="9" fill="${cream.hex}" letter-spacing="1">CH. 02</text>
  <text x="12" y="394" ${MONO} font-size="9" fill="${cream.hex}" letter-spacing="1.5">NO PAUSE · NO REWIND · JUST ROLL</text>`;
};
const movingFront = () => `
  <text x="12" y="150" font-family="Anton" font-size="140" fill="${INK.cream.hex}" ${fit()}>KEEP</text>
  <text x="12" y="252" font-family="Anton" font-size="96" fill="${INK.cream.hex}" ${fit()}>MOVING</text>
  <path d="M206,282 L270,282 M252,268 L272,282 L252,296" fill="none" stroke="${INK.cream.hex}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="12" y="288" ${MONO} font-size="12" fill="${INK.cream.hex}" letter-spacing="3">VOL. 02 · FORWARD</text>`;

const item = (ref, name, colour, front, back, frontInk, backInks) => ({
  ref, name, colour,
  art: { front: { svg: front, inks: [frontInk] }, back: { svg: back, size: BACK, inks: backInks } },
});

export default {
  id: 'c8-back-story',
  code: 'C8 · BOYS · 30–36 (10–14 YRS) · OVERSIZED',
  title: 'BACK STORY',
  technique: 'FRONT 1-COL + BACK 3-COL',
  subtitle: 'big chest print + full back, streetwear',
  layout: 'front-back',
  countInks: true,
  items: [
    item('BS-01', 'Run The City', { name: 'Black', hex: '#141414' }, runFront, runBack, INK.cream, [INK.cream, INK.orange, INK.steel]),
    item('BS-02', 'No Days Off', { name: 'Rust', hex: '#8B3A24' }, noDaysFront, noDaysBack, INK.cream, [INK.cream, INK.black, INK.butter]),
    item('BS-03', 'Full Throttle', { name: 'Mouse', hex: '#6F6A62' }, throttleFront, throttleBack, INK.white, [INK.white, INK.black, INK.red]),
    item('BS-04', 'Make Noise', { name: 'CK Blue', hex: '#3E6E80' }, makeNoiseFront, makeNoiseBack, INK.white, [INK.black, INK.lime, INK.white]),
    item('BS-05', 'Westside 23', { name: 'Sand', hex: '#B5A47A' }, varsityFront, varsityBack, INK.navy, [INK.navy, INK.varsity, INK.cream]),
    item('BS-06', 'Keep Moving', { name: 'Bottle Green', hex: '#1F3A2E' }, movingFront, movingBack, INK.cream, [INK.cream, INK.lime, INK.coral]),
  ],
};
