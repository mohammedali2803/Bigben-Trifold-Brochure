// Collection 5 — CREST & CO.: small chest print + large back print.
import { star, sparkle, arc, halftone, r2 } from '../lib/svg.mjs';

const INK = {
  navy: { name: 'Ink Navy', hex: '#1C2340' },
  tomato: { name: 'Tomato', hex: '#FF4B2B' },
  cream: { name: 'Cream', hex: '#FFF1D6' },
  mustard: { name: 'Mustard', hex: '#F2B033' },
  forest: { name: 'Forest', hex: '#1E3A2B' },
  volt: { name: 'Volt Yellow', hex: '#FFE600' },
  white: { name: 'White', hex: '#FFFFFF' },
  butter: { name: 'Butter', hex: '#FFE7A3' },
  coral: { name: 'Coral', hex: '#FF7A6B' },
};
const MONO = `font-family="Space Mono" font-weight="700"`;
const XW = `font-family="Archivo" font-weight="900" font-stretch="expanded"`;
const BACK = [300, 380];

// --- Moon Unit -------------------------------------------------------------
const moonPhase = (cx, cy, r, k, ink, id) => `
  <mask id="${id}"><rect x="${cx - r - 2}" y="${cy - r - 2}" width="${r * 2 + 4}" height="${r * 2 + 4}" fill="#fff"/><circle cx="${cx + k * r}" cy="${cy}" r="${r}" fill="#000"/></mask>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${ink}" stroke-width="1.6"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="${ink}" mask="url(#${id})"/>`;
const moonChest = ({ id }) => `
  <defs><mask id="${id('m')}"><rect width="300" height="300" fill="#fff"/><circle cx="182" cy="112" r="82" fill="#000"/></mask></defs>
  <circle cx="150" cy="140" r="92" fill="${INK.navy.hex}" mask="url(#${id('m')})"/>
  <path d="${star(214, 176, 4, 30, 9)}" fill="${INK.tomato.hex}"/>
  <text x="150" y="282" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="38" fill="${INK.navy.hex}" letter-spacing="2">MU</text>`;
const moonBack = ({ id }) => {
  const { navy, tomato } = INK;
  const craters = [[-30, -24, 20], [28, 10, 26], [-18, 40, 14], [40, -40, 10], [-50, 14, 9]];
  return `
  ${[2, 1.3, 0.6, -0.6, -1.3].map((k, i) => moonPhase(54 + i * 48, 32, 15, k, navy.hex, id(`p${i}`))).join('')}
  <defs><clipPath id="${id('moon')}"><circle cx="150" cy="160" r="94"/></clipPath></defs>
  ${halftone({ x: 56, y: 66, w: 188, h: 188, cell: 7.5, fill: navy.hex, clip: id('moon'), angle: 30,
    tone: (x, y) => {
      let t = 0.12 + Math.max(0, (x - 150) / 94) * 0.75;
      for (const [cx, cy, r] of craters) if (Math.hypot(x - 150 - cx, y - 160 - cy) < r) t += 0.35;
      return t;
    } })}
  <circle cx="150" cy="160" r="98" fill="none" stroke="${navy.hex}" stroke-width="2.5"/>
  <path d="${star(258, 104, 4, 16, 4)}" fill="${tomato.hex}"/><path d="${star(38, 210, 4, 11, 3)}" fill="${tomato.hex}"/>
  <text x="150" y="314" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="44" fill="${navy.hex}" textLength="262" lengthAdjust="spacingAndGlyphs">MOON UNIT</text>
  <text x="150" y="342" text-anchor="middle" ${MONO} font-size="11" fill="${tomato.hex}" letter-spacing="3">NIGHT SHIFT EXPLORERS</text>
  <text x="150" y="366" text-anchor="middle" ${MONO} font-size="10" fill="${navy.hex}" letter-spacing="4">DEPT. 07 · LIGHTS ON</text>`;
};

// --- Academy ---------------------------------------------------------------
const SHIELD = 'M0,-100 L84,-78 L84,10 C84,64 40,92 0,110 C-40,92 -84,64 -84,10 L-84,-78 Z';
const academyChest = () => `
  <g transform="translate(150 140) scale(1.15)">
    <path d="${SHIELD}" fill="${INK.cream.hex}"/>
    <path d="${SHIELD}" transform="scale(0.86)" fill="none" stroke="${INK.navy.hex}" stroke-width="6"/>
    <text x="0" y="28" text-anchor="middle" font-family="Graduate" font-size="84" fill="${INK.navy.hex}">AC</text>
  </g>`;
const laurel = (side, colour) => {
  const leaves = Array.from({ length: 8 }, (_, i) => {
    const t = 0.15 + i * 0.105;
    const a = Math.PI * (0.62 + t * 0.85);
    const x = 128 * Math.cos(a), y = 128 * Math.sin(a) - 4;
    const deg = (a * 180) / Math.PI + 70;
    return `<ellipse cx="${r2(x)}" cy="${r2(y)}" rx="6" ry="15" transform="rotate(${r2(deg)} ${r2(x)} ${r2(y)})" fill="${colour}"/>`;
  }).join('');
  return `<g transform="translate(150 182) scale(${side} 1)">${leaves}<path d="${arc(0, -4, 128, 118, 200)}" fill="none" stroke="${colour}" stroke-width="3"/></g>`;
};
const academyBack = ({ id }) => {
  const { cream, mustard, tomato, navy } = INK;
  return `
  <defs><path id="${id('a')}" d="${arc(150, 182, 150, 205, 335)}"/></defs>
  <text font-family="Graduate" font-size="26" fill="${cream.hex}" letter-spacing="4"><textPath href="#${id('a')}" startOffset="50%" text-anchor="middle">ACADEMY OF</textPath></text>
  ${laurel(1, mustard.hex)}${laurel(-1, mustard.hex)}
  <g transform="translate(150 166) scale(0.92)">
    <path d="${SHIELD}" fill="${cream.hex}"/>
    <path d="M0,-100 L0,110 M-84,-14 L84,-14" stroke="${navy.hex}" stroke-width="5"/>
    <path d="${star(-42, -52, 5, 22, 9)}" fill="${tomato.hex}"/>
    <path d="M44,-80 L28,-48 L42,-48 L32,-22 L58,-58 L44,-58 L54,-80 Z" fill="${mustard.hex}" stroke="${navy.hex}" stroke-width="2.5" stroke-linejoin="round"/>
    <g fill="none" stroke="${navy.hex}" stroke-width="4" stroke-linejoin="round"><path d="M-66,22 L-42,14 L-18,22 L-18,60 L-42,52 L-66,60 Z M-42,14 L-42,52"/></g>
    <circle cx="42" cy="36" r="20" fill="${tomato.hex}"/><path d="M28,24 Q42,36 28,50 M56,24 Q42,36 56,50" fill="none" stroke="${cream.hex}" stroke-width="3"/>
  </g>
  <path d="M60,268 L240,268 L250,282 L240,296 L60,296 L50,282 Z" fill="${tomato.hex}"/>
  <text x="150" y="288" text-anchor="middle" ${MONO} font-size="13" fill="${cream.hex}" letter-spacing="4">EST. 2026</text>
  <text x="150" y="350" text-anchor="middle" font-family="Graduate" font-size="50" fill="${cream.hex}" textLength="262" lengthAdjust="spacingAndGlyphs">COOL KIDS</text>
  <text x="150" y="374" text-anchor="middle" ${MONO} font-size="10" fill="${mustard.hex}" letter-spacing="3">CLASS OF FOREVER · VARSITY</text>`;
};

// --- Mushroom Society ------------------------------------------------------
const mushroom = (x, y, s, cap, spot, stem, line) => `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M-16,0 C-20,30 -14,56 -18,70 L18,70 C14,56 20,30 16,0 Z" fill="${stem}" stroke="${line}" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M-58,2 C-58,-44 -26,-66 0,-66 C26,-66 58,-44 58,2 C30,10 -30,10 -58,2 Z" fill="${cap}" stroke="${line}" stroke-width="3.5" stroke-linejoin="round"/>
  <circle cx="-26" cy="-30" r="9" fill="${spot}"/><circle cx="12" cy="-44" r="7" fill="${spot}"/><circle cx="30" cy="-16" r="8" fill="${spot}"/><circle cx="-6" cy="-14" r="5" fill="${spot}"/>
</g>`;
const mushroomChest = () => mushroom(150, 150, 1.6, INK.tomato.hex, INK.cream.hex, INK.cream.hex, INK.forest.hex);
const mushroomBack = ({ id }) => {
  const { cream, tomato, forest } = INK;
  const grass = Array.from({ length: 22 }, (_, i) => {
    const x = 24 + i * 12, h = 14 + ((i * 37) % 17);
    return `<path d="M${x},262 q${i % 2 ? 6 : -6},-${h / 2} ${i % 2 ? 2 : -2},-${h}" fill="none" stroke="${forest.hex}" stroke-width="3" stroke-linecap="round"/>`;
  }).join('');
  return `
  <defs><path id="${id('a')}" d="${arc(150, 200, 146, 196, 344)}"/></defs>
  <text font-family="Unbounded" font-weight="900" font-size="21" fill="${forest.hex}" letter-spacing="1.5"><textPath href="#${id('a')}" startOffset="50%" text-anchor="middle">MUSHROOM SOCIETY</textPath></text>
  ${mushroom(206, 200, 0.95, cream.hex, tomato.hex, cream.hex, forest.hex)}
  ${mushroom(108, 168, 1.35, tomato.hex, cream.hex, cream.hex, forest.hex)}
  ${mushroom(232, 236, 0.45, tomato.hex, cream.hex, cream.hex, forest.hex)}
  ${grass}
  <rect x="20" y="262" width="260" height="3" rx="1.5" fill="${forest.hex}"/>
  <text x="150" y="318" text-anchor="middle" font-family="Instrument Serif" font-style="italic" font-size="38" fill="${forest.hex}">grow at your own pace</text>
  <text x="150" y="352" text-anchor="middle" ${MONO} font-size="11" fill="${forest.hex}" letter-spacing="3">FOREST FLOOR · MEMBER 012</text>`;
};

// --- Volt ------------------------------------------------------------------
const BOLT = 'M58,0 L10,104 L46,104 L24,190 L104,70 L64,70 L92,0 Z';
const voltChest = () => `
  <path d="${BOLT}" transform="translate(98 26) scale(0.92)" fill="${INK.volt.hex}"/>
  <text x="150" y="280" text-anchor="middle" ${XW} font-size="46" fill="${INK.white.hex}" textLength="190" lengthAdjust="spacingAndGlyphs">VOLT</text>`;
const voltBack = () => {
  const { volt, white } = INK;
  return `
  <text x="20" y="30" ${MONO} font-size="11" fill="${white.hex}" letter-spacing="2">⚠ HIGH ENERGY</text>
  <text x="280" y="30" text-anchor="end" ${MONO} font-size="11" fill="${volt.hex}" letter-spacing="2">240V</text>
  ${[0, 1, 2, 3].map((i) => `<text x="150" y="${112 + i * 70}" text-anchor="middle" ${XW} font-size="92" ${i === 1 ? `fill="${volt.hex}"` : `fill="none" stroke="${white.hex}" stroke-width="1.6"`} textLength="264" lengthAdjust="spacingAndGlyphs">VOLT</text>`).join('')}
  <path d="${BOLT}" transform="translate(118 96) rotate(8) scale(1.2)" fill="${volt.hex}" stroke="#141414" stroke-width="6" paint-order="stroke" stroke-linejoin="round"/>
  <rect x="20" y="340" width="260" height="2" fill="${white.hex}"/>
  <text x="20" y="366" ${MONO} font-size="11" fill="${white.hex}" letter-spacing="2">HANDLE WITH CARE</text>
  <text x="280" y="366" text-anchor="end" ${MONO} font-size="11" fill="${volt.hex}" letter-spacing="2">100% CHARGED</text>`;
};

// --- Court Club ------------------------------------------------------------
const ball = (cx, cy, r, line, w) => `<g fill="none" stroke="${line}" stroke-width="${w}">
  <circle cx="${cx}" cy="${cy}" r="${r}"/>
  <path d="M${cx - r * 0.95},${cy - r * 0.3} C${cx - r * 0.3},${cy - r * 0.1} ${cx - r * 0.3},${cy + r * 0.6} ${cx - r * 0.55},${cy + r * 0.82}"/>
  <path d="M${cx + r * 0.95},${cy + r * 0.3} C${cx + r * 0.3},${cy + r * 0.1} ${cx + r * 0.3},${cy - r * 0.6} ${cx + r * 0.55},${cy - r * 0.82}"/></g>`;
const racket = (x, y, deg, line, accent, id) => `<g transform="translate(${x} ${y}) rotate(${deg})">
  <clipPath id="${id}"><ellipse cx="0" cy="-70" rx="40" ry="52"/></clipPath>
  <g clip-path="url(#${id})" stroke="${line}" stroke-width="1.6">${Array.from({ length: 9 }, (_, i) => `<line x1="${-40 + i * 10}" y1="-130" x2="${-40 + i * 10}" y2="-10"/><line x1="-50" y1="${-120 + i * 12}" x2="50" y2="${-120 + i * 12}"/>`).join('')}</g>
  <ellipse cx="0" cy="-70" rx="40" ry="52" fill="none" stroke="${line}" stroke-width="7"/>
  <path d="M-8,-20 L-6,10 L6,10 L8,-20" fill="${line}"/>
  <rect x="-8" y="10" width="16" height="56" rx="5" fill="${accent}"/></g>`;
const courtChest = () => `${ball(150, 130, 84, INK.forest.hex, 9)}
  <text x="150" y="282" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="38" fill="${INK.forest.hex}" letter-spacing="4">CC</text>`;
const courtBack = ({ id }) => {
  const { forest, tomato } = INK;
  return `
  <defs><path id="${id('a')}" d="${arc(150, 200, 136, 200, 340)}"/></defs>
  <text font-family="Unbounded" font-weight="900" font-size="34" fill="${forest.hex}" letter-spacing="3"><textPath href="#${id('a')}" startOffset="50%" text-anchor="middle">COURT CLUB</textPath></text>
  ${racket(118, 250, -32, forest.hex, tomato.hex, id('r1'))}
  ${racket(182, 250, 32, forest.hex, tomato.hex, id('r2'))}
  <circle cx="150" cy="196" r="38" fill="${tomato.hex}"/>${ball(150, 196, 38, forest.hex, 4.5)}
  <text x="150" y="338" text-anchor="middle" font-family="Instrument Serif" font-style="italic" font-size="34" fill="${forest.hex}">fifteen – love</text>
  <text x="150" y="366" text-anchor="middle" ${MONO} font-size="9.5" fill="${tomato.hex}" letter-spacing="1.5">TENNIS DEPT. · SERVE · VOLLEY · SMASH</text>`;
};

// --- Endless Summer --------------------------------------------------------
const WAVE = 'M10,250 C40,240 60,200 80,160 C104,110 150,82 196,92 C240,102 262,140 248,172 C238,196 206,200 196,182 C186,164 204,148 218,156 C206,138 176,134 160,150 C138,172 150,214 184,230 C210,242 250,240 290,236 L290,262 L10,262 Z';
const surfChest = ({ id }) => `
  <defs><clipPath id="${id('c')}"><circle cx="150" cy="140" r="104"/></clipPath></defs>
  <circle cx="150" cy="140" r="110" fill="none" stroke="${INK.cream.hex}" stroke-width="10"/>
  <g clip-path="url(#${id('c')})"><path d="${WAVE}" transform="translate(-6 -70) scale(1.04)" fill="${INK.cream.hex}"/></g>
  <circle cx="102" cy="88" r="22" fill="${INK.butter.hex}"/>`;
const surfBack = ({ id }) => {
  const { cream, butter, coral } = INK;
  return `
  <defs><clipPath id="${id('w')}"><path d="${WAVE}"/></clipPath><path id="${id('a')}" d="${arc(150, 172, 132, 205, 335)}"/></defs>
  <circle cx="226" cy="74" r="40" fill="${butter.hex}"/>
  ${[1, 0.8, 0.62, 0.44].map((k, i) => `<path d="${WAVE}" transform="translate(205 172) scale(${k}) translate(-205 -172)" fill="${i % 2 ? coral.hex : cream.hex}"/>`).join('')}
  ${[0, 1, 2].map((i) => `<rect x="${30 + i * 20}" y="${272 + i * 10}" width="${240 - i * 40}" height="4" rx="2" fill="${cream.hex}"/>`).join('')}
  <text x="150" y="340" text-anchor="middle" font-family="Shrikhand" font-size="44" fill="${cream.hex}" textLength="262" lengthAdjust="spacingAndGlyphs">endless summer</text>
  <text x="150" y="368" text-anchor="middle" ${MONO} font-size="11" fill="${butter.hex}" letter-spacing="3">SURF SCHOOL · CATCH THE NEXT ONE</text>`;
};

const item = (ref, name, colour, chest, back, chestInks, backInks) => ({
  ref, name, colour,
  art: { chest: { svg: chest, inks: chestInks }, back: { svg: back, size: BACK, inks: backInks } },
});

export default {
  id: 'c5-crest-co',
  code: 'C5',
  title: 'CREST & CO.',
  technique: 'CHEST + BACK PRINT',
  subtitle: 'small chest mark + large back print',
  layout: 'chest-back',
  countInks: true,
  items: [
    item('CR-01', 'Moon Unit', { name: 'Off White', hex: '#F1EDE4' }, moonChest, moonBack, [INK.navy, INK.tomato], [INK.navy, INK.tomato]),
    item('CR-02', 'Academy', { name: 'Navy', hex: '#1F2A44' }, academyChest, academyBack, [INK.cream, INK.navy], [INK.cream, INK.mustard, INK.tomato, INK.navy]),
    item('CR-03', 'Mushroom Society', { name: 'Sage', hex: '#A9B89A' }, mushroomChest, mushroomBack, [INK.tomato, INK.cream, INK.forest], [INK.cream, INK.tomato, INK.forest]),
    item('CR-04', 'Volt', { name: 'Jet Black', hex: '#141414' }, voltChest, voltBack, [INK.volt, INK.white], [INK.volt, INK.white]),
    item('CR-05', 'Court Club', { name: 'Butter', hex: '#F6E7A1' }, courtChest, courtBack, [INK.forest], [INK.forest, INK.tomato]),
    item('CR-06', 'Endless Summer', { name: 'Washed Teal', hex: '#3E8A8E' }, surfChest, surfBack, [INK.cream, INK.butter], [INK.cream, INK.butter, INK.coral]),
  ],
};
