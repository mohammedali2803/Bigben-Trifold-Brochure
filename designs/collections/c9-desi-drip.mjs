// Collection 9 — DESI DRIP. Boys 30–36 (10–14 yrs), oversized funky streetwear for the
// Indian market: small chest mark + full back. Mixes desi humour and Hindi lettering with
// global streetwear treatments (3D chrome/holo type, puff lettering, receipts, movie posters).
import { sparkle, star, r2 } from '../lib/svg.mjs';

const INK = {
  yellow: { name: 'Truck Yellow', hex: '#FFC72C' },
  red: { name: 'Red', hex: '#E5322D' },
  green: { name: 'Green', hex: '#1FA34A' },
  pink: { name: 'Pink', hex: '#FF5FA2' },
  white: { name: 'White', hex: '#FFFFFF' },
  navy: { name: 'Navy', hex: '#1C2340' },
  cream: { name: 'Cream', hex: '#F3EBDD' },
  blue: { name: 'Windows Blue', hex: '#2F6BFF' },
  black: { name: 'Black', hex: '#151515' },
  lime: { name: 'Acid Lime', hex: '#C6FF3A' },
  orange: { name: 'Orange', hex: '#FF5A1F' },
  bubblegum: { name: 'Bubblegum', hex: '#FF7EB6' },
  cocoa: { name: 'Cocoa', hex: '#3B2418' },
};
const FULL = { name: 'Full colour (DTF)', hex: 'conic-gradient(#00c2ff,#ff3da8,#ffe600,#00c2ff)' };
const BACK = [300, 400];
const MONO = `font-family="Space Mono" font-weight="700"`;
const XW = `font-family="Archivo" font-weight="900" font-stretch="expanded"`;
const fit = (w = 276) => `textLength="${w}" lengthAdjust="spacingAndGlyphs"`;

// 7. Jugaad — iridescent 3D wordmark + sticker tags (DTF) --------------------
const tag = (x, y, rot, w, txt, fill, ink) => `<g transform="rotate(${rot} ${x + w / 2} ${y + 13})">
  <rect x="${x}" y="${y}" width="${w}" height="26" rx="13" fill="${fill}" stroke="#141414" stroke-width="3"/>
  <text x="${x + w / 2}" y="${y + 18}" text-anchor="middle" font-family="Space Mono" font-weight="700" font-size="11" fill="${ink}" letter-spacing="1">${txt}</text></g>`;
const jugaadBack = ({ asset }) => `
  <text x="150" y="30" text-anchor="middle" ${MONO} font-size="11" fill="${INK.lime.hex}" letter-spacing="3">DESI ENGINEERING DEPT.</text>
  <rect x="40" y="38" width="220" height="1.5" fill="${INK.lime.hex}"/>
  ${tag(18, 72, -8, 132, 'WORKS SOMEHOW', INK.lime.hex, '#141414')}
  ${tag(160, 88, 6, 122, "DON'T ASK HOW", INK.bubblegum.hex, '#141414')}
  <image href="${asset('output/assets/3d/jugaad.png')}" x="-16" y="40" width="332" height="332"/>
  ${tag(30, 268, 5, 150, '100% DESI HACK', INK.white.hex, '#141414')}
  ${tag(176, 284, -7, 106, 'NO MANUAL', INK.lime.hex, '#141414')}
  ${[[30, 200, 11, INK.white.hex], [272, 168, 8, INK.lime.hex], [52, 330, 7, INK.bubblegum.hex], [262, 350, 10, INK.white.hex]].map(([x, y, r, f]) => `<path d="${sparkle(x, y, r)}" fill="${f}"/>`).join('')}
  <text x="150" y="358" text-anchor="middle" font-family="Instrument Serif" font-style="italic" font-size="22" fill="${INK.white.hex}">kuch bhi ho jayega.</text>
  <text x="150" y="388" text-anchor="middle" ${MONO} font-size="9" fill="${INK.lime.hex}" letter-spacing="3">PATENT PENDING · SINCE FOREVER</text>`;
const jugaadChest = ({ asset }) => `<image href="${asset('output/assets/3d/jugaad.png')}" x="-30" y="-30" width="360" height="360"/>`;

// 8. Snack Run — kirana store bill -------------------------------------------
const snackBack = () => {
  const { cream, black, red } = INK;
  const K = black.hex;
  const zig = (y, dir) => Array.from({ length: 23 }, (_, i) => `${40 + i * 10},${y + (i % 2 ? dir * 6 : 0)}`).join(' ');
  const items = [['2', 'MAGGI', '28'], ['1', 'CHIPS (MASALA)', '20'], ['1', 'COLD DRINK', '40'], ['5', 'TOFFEE', '05'], ['1', 'CRICKET BALL', '50']];
  const T = (x, y, t, size = 11, extra = '') => `<text x="${x}" y="${y}" ${MONO} font-size="${size}" fill="${K}" ${extra}>${t}</text>`;
  return `<g transform="rotate(-3 150 200)">
    <polygon points="${zig(14, -1)} 260,14 260,386 ${zig(386, 1).split(' ').reverse().join(' ')} 40,386" fill="${cream.hex}"/>
    ${T(150, 40, '★ GALI NO. 4 KIRANA ★', 11, 'text-anchor="middle"')}
    ${T(150, 56, 'BILL NO. 0711 · 5:30 PM', 9, 'text-anchor="middle"')}
    <text x="150" y="104" text-anchor="middle" ${XW} font-size="40" fill="${K}" ${fit(196)}>SNACK</text>
    <text x="150" y="146" text-anchor="middle" ${XW} font-size="40" fill="${K}" ${fit(196)}>RUN</text>
    <path d="M54,160 H246" stroke="${K}" stroke-width="1.5" stroke-dasharray="4 3"/>
    ${items.map(([q, n, p], i) => `${T(56, 182 + i * 19, q)}${T(74, 182 + i * 19, n)}${T(244, 182 + i * 19, p, 11, 'text-anchor="end"')}`).join('')}
    <path d="M54,282 H246" stroke="${K}" stroke-width="1.5" stroke-dasharray="4 3"/>
    ${T(56, 304, 'TOTAL', 14)}${T(244, 304, '₹143', 14, 'text-anchor="end"')}
    ${T(56, 322, 'PAYMENT: MUMMY KA WALLET', 9)}
    ${barcode(70, 334, 22, K)}
    ${T(150, 374, 'THANK YOU · VISIT AGAIN', 9, 'text-anchor="middle"')}
  </g>
  <g transform="rotate(-14 214 344)" fill="none" stroke="${red.hex}">
    <rect x="140" y="318" width="148" height="52" rx="10" stroke-width="4"/>
    <rect x="147" y="325" width="134" height="38" rx="6" stroke-width="1.6"/>
    <text x="214" y="354" text-anchor="middle" font-family="Big Shoulders Display" font-weight="900" font-size="26" fill="${red.hex}" stroke="none" ${fit(124)}>PAID BY MUMMY</text>
  </g>`;
};
const snackChest = () => `
  <g transform="rotate(-10 150 150)" fill="none" stroke="${INK.red.hex}">
    <rect x="22" y="92" width="256" height="116" rx="16" stroke-width="9"/>
    <rect x="36" y="106" width="228" height="88" rx="9" stroke-width="3"/>
    <text x="150" y="146" text-anchor="middle" font-family="Big Shoulders Display" font-weight="900" font-size="44" fill="${INK.red.hex}" stroke="none" letter-spacing="3">PAID BY</text>
    <text x="150" y="186" text-anchor="middle" font-family="Big Shoulders Display" font-weight="900" font-size="44" fill="${INK.red.hex}" stroke="none" letter-spacing="3">MUMMY</text>
  </g>`;
const barcode = (x, y, h, c, n = 34) => {
  let out = '', cx = x;
  for (let i = 0; i < n; i++) { const w = [1, 2, 1, 3, 1, 1, 2][i % 7]; out += `<rect x="${cx}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`; cx += w + [2, 1, 2, 1, 3][i % 5]; }
  return out;
};

// 9. Dhamaal — retro Bollywood poster ----------------------------------------
const dhamaalBack = ({ id }) => {
  const { yellow, orange, pink, cream } = INK;
  const rays = Array.from({ length: 24 }, (_, i) => {
    const a = (i * Math.PI) / 12, b = a + Math.PI / 24;
    return `<path d="M150,170 L${r2(150 + 260 * Math.cos(a))},${r2(170 + 260 * Math.sin(a))} L${r2(150 + 260 * Math.cos(b))},${r2(170 + 260 * Math.sin(b))} Z"/>`;
  }).join('');
  const word = (attrs) => `<text x="150" y="214" text-anchor="middle" font-family="Rozha One" font-size="150" ${fit(268)} ${attrs}>धमाल</text>`;
  return `
  <defs><clipPath id="${id('c')}"><rect x="0" y="60" width="300" height="220"/></clipPath></defs>
  <g clip-path="url(#${id('c')})" fill="${orange.hex}" opacity=".55">${rays}</g>
  <text x="150" y="28" text-anchor="middle" font-family="Teko" font-weight="600" font-size="20" fill="${cream.hex}" letter-spacing="3">A GALI TALKIES PRESENTATION</text>
  <text x="150" y="54" text-anchor="middle" font-family="Teko" font-weight="600" font-size="26" fill="${yellow.hex}" letter-spacing="8">★ NOW SHOWING ★</text>
  ${word(`fill="none" stroke="${pink.hex}" stroke-width="30" stroke-linejoin="round"`)}
  ${word(`fill="none" stroke="${orange.hex}" stroke-width="18" stroke-linejoin="round"`)}
  ${word(`fill="${yellow.hex}" stroke="${cream.hex}" stroke-width="3"`)}
  <text x="150" y="258" text-anchor="middle" ${XW} font-size="22" fill="${cream.hex}" letter-spacing="10">DHAMAAL</text>
  <text x="150" y="290" text-anchor="middle" font-family="Teko" font-weight="600" font-size="19" fill="${cream.hex}" ${fit(272)}>STARRING  YOU · YOUR FRIENDS · ONE CRICKET BALL</text>
  <text x="150" y="312" text-anchor="middle" font-family="Teko" font-weight="600" font-size="19" fill="${cream.hex}" ${fit(272)}>DIRECTED BY  MUMMY · CHAI BY  TAPRI CLUB</text>
  <text x="150" y="350" text-anchor="middle" font-family="Teko" font-weight="600" font-size="34" fill="${yellow.hex}" ${fit(260)}>IN CINEMAS THIS SUMMER</text>
  <text x="150" y="384" text-anchor="middle" font-family="Teko" font-weight="600" font-size="20" fill="${pink.hex}" letter-spacing="4">★★★★★  BLOCKBUSTER</text>`;
};
const dhamaalChest = () => `
  <text x="150" y="196" text-anchor="middle" font-family="Rozha One" font-size="132" fill="none" stroke="${INK.pink.hex}" stroke-width="22" stroke-linejoin="round" ${fit(260)}>धमाल</text>
  <text x="150" y="196" text-anchor="middle" font-family="Rozha One" font-size="132" fill="${INK.yellow.hex}" ${fit(260)}>धमाल</text>`;

// 4. No Stress — liquid chrome + Y2K tribal flame (DTF) ----------------------
const TRIBAL = 'M150,30 C168,86 232,92 286,56 C252,112 204,124 182,152 C228,150 262,172 292,212 C236,196 190,196 164,222 L150,262 L136,222 C110,196 64,196 8,212 C38,172 72,150 118,152 C96,124 48,112 14,56 C68,92 132,86 150,30 Z';
const stressBack = ({ asset }) => `
  <text x="150" y="26" text-anchor="middle" ${MONO} font-size="11" fill="${INK.white.hex}" letter-spacing="3">★ LEVEL: UNBOTHERED ★</text>
  <path d="${TRIBAL}" transform="translate(0 30)" fill="${INK.lime.hex}"/>
  <path d="${TRIBAL}" transform="translate(150 166) scale(0.6) translate(-150 -146)" fill="${'#1C2340'}"/>
  <image href="${asset('output/assets/3d/nostress.png')}" x="-14" y="38" width="328" height="328"/>
  ${[[34, 300, 12, INK.white.hex], [262, 290, 9, INK.bubblegum.hex], [44, 90, 8, INK.bubblegum.hex], [258, 70, 10, INK.white.hex]].map(([x, y, r, f]) => `<path d="${sparkle(x, y, r)}" fill="${f}"/>`).join('')}
  <rect x="62" y="340" width="176" height="28" rx="14" fill="none" stroke="${INK.lime.hex}" stroke-width="2.5"/>
  <text x="150" y="359" text-anchor="middle" ${MONO} font-size="12" fill="${INK.lime.hex}" letter-spacing="3">CHILL MODE 100%</text>
  <text x="150" y="390" text-anchor="middle" font-family="Instrument Serif" font-style="italic" font-size="18" fill="${INK.white.hex}">tension lene ka nahi</text>`;
const stressChest = ({ asset }) => `
  <path d="${TRIBAL}" transform="translate(150 150) scale(0.9) translate(-150 -146)" fill="${INK.lime.hex}"/>
  <image href="${asset('output/assets/3d/nostress.png')}" x="-30" y="-30" width="360" height="360"/>`;

// 10. Chai Break — puff bubble letters + cutting chai ------------------------
const COCOA = '#3B2418';
const puff = (txt, y, size, fill) => `
  <text x="150" y="${y + 7}" text-anchor="middle" font-family="Bagel Fat One" font-size="${size}" fill="${COCOA}" stroke="${COCOA}" stroke-width="12" stroke-linejoin="round" ${fit(266)} transform="translate(5 0)">${txt}</text>
  <text x="150" y="${y}" text-anchor="middle" font-family="Bagel Fat One" font-size="${size}" fill="${fill}" stroke="${COCOA}" stroke-width="10" stroke-linejoin="round" paint-order="stroke" ${fit(266)}>${txt}</text>`;
const chaiBack = () => {
  const { orange, bubblegum: pink } = INK;
  return `
  <text x="150" y="24" text-anchor="middle" ${MONO} font-size="11" fill="${COCOA}" letter-spacing="3">★ TAPRI CLUB · OPEN 24/7 ★</text>
  ${puff('CHAI', 132, 128, orange.hex)}
  <g transform="translate(150 222)">
    <path d="M-22,-54 q-8,-9 0,-18 M0,-54 q-8,-9 0,-18 M22,-54 q-8,-9 0,-18" fill="none" stroke="${pink.hex}" stroke-width="5" stroke-linecap="round"/>
    <path d="M-36,-14 L36,-14 L30,48 L-30,48 Z" fill="${orange.hex}"/>
    ${[-24, -12, 0, 12, 24].map((x) => `<path d="M${x},-40 L${x * 0.8},46" stroke="${COCOA}" stroke-width="2" opacity=".55"/>`).join('')}
    <path d="M-36,-14 L36,-14" stroke="${COCOA}" stroke-width="3"/>
    <path d="M-40,-46 L40,-46 L30,52 L-30,52 Z" fill="none" stroke="${COCOA}" stroke-width="5" stroke-linejoin="round"/>
  </g>
  <g transform="translate(236 204) rotate(12)">
    <circle r="30" fill="${pink.hex}" stroke="${COCOA}" stroke-width="3.5"/>
    <text y="-3" text-anchor="middle" ${MONO} font-size="10" fill="${COCOA}">100%</text>
    <text y="12" text-anchor="middle" font-family="Bagel Fat One" font-size="14" fill="${COCOA}">KADAK</text>
  </g>
  ${[[52, 194, 12, orange.hex], [64, 248, 7, pink.hex], [262, 270, 9, orange.hex]].map(([x, y, r, f]) => `<path d="${sparkle(x, y, r)}" fill="${f}" stroke="${COCOA}" stroke-width="2"/>`).join('')}
  ${puff('BREAK', 336, 92, pink.hex)}
  <text x="150" y="386" text-anchor="middle" font-family="Instrument Serif" font-style="italic" font-size="22" fill="${COCOA}">ek cutting, full vibes.</text>`;
};
const chaiChest = () => `
  <text x="150" y="186" text-anchor="middle" font-family="Bagel Fat One" font-size="118" fill="${INK.orange.hex}" stroke="${COCOA}" stroke-width="12" stroke-linejoin="round" paint-order="stroke" ${fit(250)}>CHAI</text>
  <text x="150" y="250" text-anchor="middle" ${MONO} font-size="16" fill="${COCOA}" letter-spacing="5">TAPRI CLUB</text>`;

// 6. Bindaas — Hindi puff lettering ------------------------------------------
const bindaasBack = ({ id }) => {
  const { lime, bubblegum: pink, cream } = INK;
  return `
  ${[0, 1, 2, 3, 4].map((i) => `<text x="${i % 2 ? -40 : 0}" y="${304 + i * 22}" font-family="Anton" font-size="26" fill="none" stroke="${pink.hex}" stroke-width="1.2" letter-spacing="2">NO TENSION · NO TENSION · NO TENSION</text>`).join('')}
  <text x="150" y="30" text-anchor="middle" ${XW} font-size="18" fill="${cream.hex}" letter-spacing="10">BINDAAS</text>
  <path d="${star(40, 24, 5, 9, 3.6)}" fill="${pink.hex}"/><path d="${star(260, 24, 5, 9, 3.6)}" fill="${pink.hex}"/>
  <text x="150" y="200" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="150" fill="${pink.hex}" stroke="${pink.hex}" stroke-width="16" stroke-linejoin="round" ${fit(280)} transform="translate(6 7)">बिंदास</text>
  <text x="150" y="200" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="150" fill="${lime.hex}" stroke="${cream.hex}" stroke-width="14" stroke-linejoin="round" paint-order="stroke" ${fit(280)}>बिंदास</text>
  <text x="150" y="238" text-anchor="middle" font-family="Instrument Serif" font-style="italic" font-size="20" fill="${cream.hex}">bin·daas (adj.) — carefree, fearless,</text>
  <text x="150" y="260" text-anchor="middle" font-family="Instrument Serif" font-style="italic" font-size="20" fill="${cream.hex}">zero tension. see also: you.</text>`;
};
const bindaasChest = () => `
  <text x="150" y="196" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="130" fill="${INK.lime.hex}" stroke="${INK.cream.hex}" stroke-width="12" stroke-linejoin="round" paint-order="stroke" ${fit(270)}>बिंदास</text>
  <text x="150" y="252" text-anchor="middle" ${XW} font-size="18" fill="${INK.cream.hex}" letter-spacing="8">BINDAAS</text>`;

const item = (ref, name, colour, chest, back, chestInks, backInks) => ({
  ref, name, colour,
  art: { chest: { svg: chest, inks: chestInks }, back: { svg: back, size: BACK, inks: backInks } },
});

export default {
  id: 'c9-desi-drip',
  code: 'C9 · BOYS · 30–36 (10–14 YRS) · OVERSIZED',
  title: 'DESI DRIP',
  technique: 'CHEST + FULL BACK',
  subtitle: 'funky Indian streetwear, oversized (v2)',
  layout: 'chest-back',
  countInks: true,
  items: [
    item('DD-04', 'No Stress', { name: 'Navy', hex: '#1C2340' }, stressChest, stressBack, [FULL], [FULL]),
    item('DD-10', 'Chai Break', { name: 'Off White', hex: '#EFE8DA' }, chaiChest, chaiBack, [INK.orange, INK.cocoa], [INK.cocoa, INK.orange, INK.bubblegum]),
    item('DD-06', 'Bindaas', { name: 'Coffee', hex: '#4A3428' }, bindaasChest, bindaasBack, [INK.lime, INK.cream], [INK.lime, INK.bubblegum, INK.cream]),
    item('DD-07', 'Jugaad', { name: 'Black', hex: '#141414' }, jugaadChest, jugaadBack, [FULL], [FULL]),
    item('DD-08', 'Snack Run', { name: 'Sand', hex: '#C9B88E' }, snackChest, snackBack, [INK.red], [INK.cream, INK.black, INK.red]),
    item('DD-09', 'Dhamaal', { name: 'Charcoal', hex: '#3A3A3C' }, dhamaalChest, dhamaalBack, [INK.yellow, INK.pink], [INK.yellow, INK.orange, INK.pink, INK.cream]),
  ],
};
