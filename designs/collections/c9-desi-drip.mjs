// Collection 9 — DESI DRIP. Boys 30–36 (10–14 yrs), oversized funky streetwear for the
// Indian market: small chest mark + full back. Mixes desi references (truck art, gully
// cricket, Hindi lettering) with global streetwear treatments (Y2K UI, chrome, album art).
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
};
const FULL = { name: 'Full colour (DTF)', hex: 'conic-gradient(#00c2ff,#ff3da8,#ffe600,#00c2ff)' };
const BACK = [300, 400];
const MONO = `font-family="Space Mono" font-weight="700"`;
const XW = `font-family="Archivo" font-weight="900" font-stretch="expanded"`;
const fit = (w = 276) => `textLength="${w}" lengthAdjust="spacingAndGlyphs"`;
const flower = (x, y, r, petal, centre) =>
  Array.from({ length: 8 }, (_, i) => `<ellipse cx="${x}" cy="${y - r}" rx="${r * 0.42}" ry="${r * 0.7}" fill="${petal}" transform="rotate(${i * 45} ${x} ${y})"/>`).join('') +
  `<circle cx="${x}" cy="${y}" r="${r * 0.42}" fill="${centre}"/>`;

// 1. Horn OK Please — Indian truck art ---------------------------------------
const auto = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M8,22 Q10,4 34,4 L70,4 Q80,4 82,14 L82,46 L8,46 Z" fill="${c.yellow}"/>
  <rect x="8" y="28" width="74" height="18" fill="${c.green}"/>
  <path d="M82,20 L98,30 L98,46 L82,46 Z" fill="${c.green}"/>
  <path d="M20,12 L44,12 L44,28 L16,28 Z M50,12 L74,12 L74,28 L50,28 Z" fill="#141414"/>
  <circle cx="95" cy="30" r="4" fill="${c.yellow}"/>
  <path d="M10,38 h70" stroke="${c.red}" stroke-width="3" stroke-dasharray="4 3"/>
  ${[24, 86].map((cx) => `<circle cx="${cx}" cy="48" r="9" fill="#141414" stroke="${c.white}" stroke-width="2.5"/><circle cx="${cx}" cy="48" r="3" fill="${c.white}"/>`).join('')}</g>`;
const hornBack = () => {
  const c = Object.fromEntries(Object.entries(INK).map(([k, v]) => [k, v.hex]));
  const bunting = Array.from({ length: 14 }, (_, i) => `<path d="M${18 + i * 19},40 l9.5,14 l9.5,-14 Z" fill="${[c.red, c.green, c.pink, c.yellow][i % 4]}"/>`).join('');
  return `
  <rect x="8" y="8" width="284" height="384" rx="18" fill="none" stroke="${c.yellow}" stroke-width="5"/>
  <rect x="16" y="16" width="268" height="368" rx="12" fill="none" stroke="${c.pink}" stroke-width="2" stroke-dasharray="2 6" stroke-linecap="round"/>
  <path d="M18,40 L282,40" stroke="${c.white}" stroke-width="1.5"/>${bunting}
  <path d="M70,96 Q150,58 230,96 L230,104 Q150,70 70,104 Z" fill="${c.red}"/>
  <text x="150" y="94" text-anchor="middle" font-family="Yatra One" font-size="26" fill="${c.white}">धीरे चलें</text>
  ${flower(40, 86, 14, c.pink, c.yellow)}${flower(260, 86, 14, c.pink, c.yellow)}
  <text x="150" y="186" text-anchor="middle" font-family="Rozha One" font-size="96" fill="${c.red}" ${fit(250)} transform="translate(5 5)">HORN</text>
  <text x="150" y="186" text-anchor="middle" font-family="Rozha One" font-size="96" fill="${c.yellow}" ${fit(250)}>HORN</text>
  <path d="M150,196 L192,232 L150,268 L108,232 Z" fill="${c.green}" stroke="${c.yellow}" stroke-width="4"/>
  <text x="150" y="246" text-anchor="middle" font-family="Rozha One" font-size="40" fill="${c.white}">OK</text>
  <text x="150" y="318" text-anchor="middle" font-family="Rozha One" font-size="66" fill="${c.green}" ${fit(250)} transform="translate(4 4)">PLEASE</text>
  <text x="150" y="318" text-anchor="middle" font-family="Rozha One" font-size="66" fill="${c.pink}" ${fit(250)}>PLEASE</text>
  ${[[60, 232], [240, 232]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${c.yellow}"/><circle cx="${x - 16}" cy="${y}" r="3" fill="${c.pink}"/><circle cx="${x + 16}" cy="${y}" r="3" fill="${c.pink}"/>`).join('')}
  ${auto(24, 322, 0.86, c)}
  <text x="276" y="350" text-anchor="end" font-family="Teko" font-weight="600" font-size="22" fill="${c.white}" letter-spacing="1">USE DIPPER</text>
  <text x="276" y="372" text-anchor="end" font-family="Teko" font-weight="600" font-size="22" fill="${c.yellow}" letter-spacing="1">AT NIGHT</text>`;
};
const hornChest = () => `
  ${flower(150, 64, 34, INK.pink.hex, INK.yellow.hex)}
  <text x="150" y="190" text-anchor="middle" font-family="Rozha One" font-size="78" fill="${INK.yellow.hex}" ${fit(260)}>HORN OK</text>
  <text x="150" y="266" text-anchor="middle" font-family="Rozha One" font-size="78" fill="${INK.pink.hex}" ${fit(260)}>PLEASE</text>`;

// 2. Gully Cricket Club -------------------------------------------------------
const gullyBack = () => {
  const { navy, red, white } = INK;
  const rules = ['ONE TIP ONE HAND', 'NO LBW', 'BALL IN HOUSE = OUT', 'BAT OWNER BATS FIRST'];
  return `
  <text x="150" y="104" text-anchor="middle" font-family="Big Shoulders Display" font-weight="900" font-size="128" fill="${navy.hex}" ${fit()}>GULLY</text>
  <text x="150" y="142" text-anchor="middle" ${XW} font-size="30" fill="${red.hex}" ${fit()}>CRICKET CLUB</text>
  <g transform="translate(150 208)">
    ${[0, 1, 2].map((r) => [0, 1].map((k) => `<rect x="${-34 + k * 34 + (r % 2) * 17 - 8}" y="${22 - r * 15}" width="32" height="13" rx="2" fill="${red.hex}" stroke="${navy.hex}" stroke-width="2.5"/>`).join('')).join('')}
    <g transform="rotate(-38)">
      <rect x="-12" y="-62" width="24" height="76" rx="8" fill="${white.hex}" stroke="${navy.hex}" stroke-width="4"/>
      <rect x="-4.5" y="12" width="9" height="34" rx="3" fill="${navy.hex}"/>
      <path d="M-4.5,20 h9 M-4.5,28 h9 M-4.5,36 h9" stroke="${white.hex}" stroke-width="2"/>
    </g>
    <circle cx="48" cy="-38" r="16" fill="${red.hex}" stroke="${navy.hex}" stroke-width="3.5"/>
    <path d="M38,-50 Q48,-38 38,-26 M58,-50 Q48,-38 58,-26" fill="none" stroke="${white.hex}" stroke-width="2.4" stroke-dasharray="3 2.5"/>
    <path d="M74,-56 l14,-6 M76,-44 l16,0 M74,-32 l14,6" stroke="${navy.hex}" stroke-width="3" stroke-linecap="round"/>
  </g>
  <rect x="12" y="268" width="276" height="2.5" fill="${navy.hex}"/>
  <text x="12" y="290" ${MONO} font-size="11" fill="${red.hex}" letter-spacing="3">HOUSE RULES</text>
  <text x="288" y="290" text-anchor="end" ${MONO} font-size="11" fill="${navy.hex}" letter-spacing="2">EST. ANY EVENING</text>
  ${rules.map((r, i) => `
    <text x="12" y="${318 + i * 22}" font-family="Teko" font-weight="600" font-size="22" fill="${red.hex}">0${i + 1}</text>
    <text x="40" y="${318 + i * 22}" font-family="Teko" font-weight="600" font-size="22" fill="${navy.hex}" letter-spacing="1">${r}</text>`).join('')}
  <circle cx="262" cy="350" r="22" fill="none" stroke="${navy.hex}" stroke-width="2.5"/>
  <text x="262" y="346" text-anchor="middle" ${MONO} font-size="8" fill="${navy.hex}">NO</text>
  <text x="262" y="358" text-anchor="middle" ${MONO} font-size="8" fill="${red.hex}">ROTI</text>`;
};
const gullyChest = ({ id }) => `
  <defs><path id="${id('a')}" d="M44,150 A106,106 0 0 1 256,150"/><path id="${id('b')}" d="M36,150 A114,114 0 0 0 264,150"/></defs>
  <circle cx="150" cy="150" r="128" fill="none" stroke="${INK.navy.hex}" stroke-width="7"/>
  <text font-family="Big Shoulders Display" font-weight="900" font-size="46" fill="${INK.navy.hex}" letter-spacing="4"><textPath href="#${id('a')}" startOffset="50%" text-anchor="middle">GULLY</textPath></text>
  <text font-family="Big Shoulders Display" font-weight="900" font-size="30" fill="${INK.navy.hex}" letter-spacing="5"><textPath href="#${id('b')}" startOffset="50%" text-anchor="middle">CRICKET CLUB</textPath></text>
  <g transform="translate(150 158) rotate(-38)"><rect x="-12" y="-60" width="24" height="74" rx="8" fill="${INK.red.hex}"/><rect x="-4.5" y="12" width="9" height="32" rx="3" fill="${INK.red.hex}"/></g>
  <circle cx="196" cy="118" r="13" fill="${INK.navy.hex}"/>`;

// 3. brain.exe — Y2K error windows -------------------------------------------
const win = (x, y, w, h, title, body, c) => `
  <rect x="${x + 6}" y="${y + 6}" width="${w}" height="${h}" fill="${c.black}"/>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c.cream}" stroke="${c.black}" stroke-width="2.5"/>
  <rect x="${x}" y="${y}" width="${w}" height="22" fill="${c.blue}" stroke="${c.black}" stroke-width="2.5"/>
  <text x="${x + 8}" y="${y + 16}" font-family="Silkscreen" font-weight="700" font-size="12" fill="${c.cream}">${title}</text>
  ${[0, 1, 2].map((i) => `<rect x="${x + w - 18 - i * 16}" y="${y + 5}" width="12" height="12" fill="${c.cream}" stroke="${c.black}" stroke-width="1.5"/>`).join('')}
  <path d="M${x + w - 15},${y + 8} l6,6 m0,-6 l-6,6" stroke="${c.black}" stroke-width="2"/>
  <g transform="translate(${x} ${y + 22})">${body}</g>`;
const brainBack = () => {
  const c = { cream: INK.cream.hex, blue: INK.blue.hex, black: INK.black.hex, lime: INK.lime.hex };
  const T = (x, y, s, t, fill = c.black, extra = '') => `<text x="${x}" y="${y}" font-family="Space Mono" font-weight="700" font-size="${s}" fill="${fill}" ${extra}>${t}</text>`;
  const btn = (x, y, w, t) => `<rect x="${x}" y="${y}" width="${w}" height="20" fill="${c.cream}" stroke="${c.black}" stroke-width="2"/>${T(x + w / 2, y + 14, 10, t, c.black, 'text-anchor="middle"')}`;
  return `
  ${win(12, 14, 270, 150, 'brain.exe', `
    <path d="M30,22 L54,64 L6,64 Z" fill="${c.lime}" stroke="${c.black}" stroke-width="2.5" stroke-linejoin="round"/>
    <text x="30" y="58" text-anchor="middle" font-family="Archivo" font-weight="900" font-size="26" fill="${c.black}">!</text>
    ${T(68, 34, 12, 'brain.exe is not')}${T(68, 50, 12, 'responding.')}
    ${T(68, 74, 10, 'Too much homework detected.')}
    ${btn(68, 96, 70, 'WAIT')}${btn(148, 96, 108, 'FORCE QUIT')}`, c)}
  ${win(34, 182, 252, 104, 'update.exe', `
    ${T(12, 24, 10.5, 'Installing:')}${T(12, 42, 12, 'SUMMER_VACATION.zip')}
    <rect x="12" y="54" width="226" height="20" fill="none" stroke="${c.black}" stroke-width="2"/>
    ${Array.from({ length: 9 }, (_, i) => `<rect x="${16 + i * 18.6}" y="58" width="15" height="12" fill="${c.blue}"/>`).join('')}
    ${T(238, 24, 12, '87%', c.blue, 'text-anchor="end"')}`, c)}
  ${win(12, 304, 140, 78, 'note.txt', `${T(10, 24, 11, 'drink water.')}${T(10, 42, 11, 'touch grass.')}`, c)}
  <text x="288" y="324" text-anchor="end" font-family="Silkscreen" font-weight="700" font-size="15" fill="${c.lime}">ERROR 404:</text>
  <text x="288" y="344" text-anchor="end" font-family="Silkscreen" font-weight="700" font-size="13" fill="${c.lime}">SLEEP NOT</text>
  <text x="288" y="362" text-anchor="end" font-family="Silkscreen" font-weight="700" font-size="13" fill="${c.lime}">FOUND</text>
  <path d="M232,366 l0,26 l7,-7 l5,11 l5,-2 l-5,-11 l10,0 Z" fill="${c.cream}" stroke="${c.black}" stroke-width="2" stroke-linejoin="round"/>`;
};
const brainChest = () => {
  const c = { cream: INK.cream.hex, blue: INK.blue.hex, black: INK.cream.hex };
  return `
  <rect x="30" y="70" width="240" height="128" fill="none" stroke="${c.cream}" stroke-width="6"/>
  <rect x="30" y="70" width="240" height="34" fill="${c.blue}"/>
  <text x="44" y="95" font-family="Silkscreen" font-weight="700" font-size="20" fill="${c.cream}">brain.exe</text>
  <text x="150" y="166" text-anchor="middle" font-family="Silkscreen" font-weight="700" font-size="30" fill="${c.cream}">LOADING...</text>
  <path d="M220,180 l0,52 l14,-14 l10,22 l10,-4 l-10,-22 l20,0 Z" fill="${c.cream}"/>`;
};

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

// 5. Bedroom Tapes Vol. 1 — album-cover cassette -----------------------------
const bedroomBack = () => {
  const { black, orange, blue } = INK;
  const K = black.hex;
  const tracks = [['HOMEWORK (SKIP)', '0:07'], ['SNACK RUN', '2:45'], ['ONE MORE GAME', '6:00:00'], ['MOM IS CALLING', '0:30'], ['FIVE MIN MORE', '∞']];
  const reel = (x) => `<circle cx="${x}" cy="0" r="17" fill="none" stroke="${K}" stroke-width="3"/>${[0, 60, 120, 180, 240, 300].map((a) => `<path d="M${x},0 L${r2(x + 12 * Math.cos((a * Math.PI) / 180))},${r2(12 * Math.sin((a * Math.PI) / 180))}" stroke="${K}" stroke-width="3"/>`).join('')}`;
  return `
  <text x="12" y="70" ${XW} font-size="64" fill="${K}" ${fit()}>BEDROOM</text>
  <text x="12" y="124" ${XW} font-size="64" fill="none" stroke="${K}" stroke-width="2" ${fit(196)}>TAPES</text>
  <rect x="216" y="86" width="72" height="38" rx="19" fill="${orange.hex}"/><text x="252" y="111" text-anchor="middle" ${MONO} font-size="14" fill="${K}">VOL.1</text>
  <g transform="translate(20 140)">
    <rect x="0" y="0" width="260" height="140" rx="14" fill="none" stroke="${K}" stroke-width="4"/>
    <rect x="16" y="14" width="228" height="80" rx="6" fill="${orange.hex}"/>
    <rect x="16" y="14" width="228" height="18" fill="${blue.hex}"/>
    <text x="26" y="28" ${MONO} font-size="11" fill="${K}">SIDE A</text><text x="234" y="28" text-anchor="end" ${MONO} font-size="11" fill="${K}">C-60</text>
    <text x="130" y="60" text-anchor="middle" font-family="Caveat Brush" font-size="26" fill="${K}">mixtape 2026</text>
    <rect x="62" y="64" width="136" height="26" rx="13" fill="#EFE8DA" stroke="${K}" stroke-width="2.5"/>
    <g transform="translate(0 77)">${reel(88)}${reel(172)}</g>
    <path d="M60,140 L76,112 L184,112 L200,140" fill="none" stroke="${K}" stroke-width="3"/>
    ${[[12, 12], [248, 12], [12, 128], [248, 128]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="${K}"/>`).join('')}
  </g>
  ${tracks.map(([t, d], i) => `
    <text x="12" y="${306 + i * 18}" ${MONO} font-size="12" fill="${orange.hex}">0${i + 1}</text>
    <text x="40" y="${306 + i * 18}" ${MONO} font-size="12" fill="${K}">${t}</text>
    <text x="288" y="${306 + i * 18}" text-anchor="end" ${MONO} font-size="12" fill="${blue.hex}">${d}</text>`).join('')}
  <text x="150" y="396" text-anchor="middle" ${MONO} font-size="9" fill="${K}" letter-spacing="3">℗ BEDROOM RECORDS · STEREO</text>`;
};
const bedroomChest = () => `
  <rect x="40" y="70" width="220" height="118" rx="14" fill="none" stroke="${INK.black.hex}" stroke-width="7"/>
  <rect x="62" y="90" width="176" height="44" rx="6" fill="${INK.orange.hex}"/>
  ${[106, 194].map((x) => `<circle cx="${x}" cy="158" r="14" fill="none" stroke="${INK.black.hex}" stroke-width="6"/>`).join('')}
  <text x="150" y="250" text-anchor="middle" ${XW} font-size="34" fill="${INK.black.hex}" ${fit(240)}>BEDROOM TAPES</text>`;

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
  subtitle: 'funky Indian streetwear, oversized',
  layout: 'chest-back',
  countInks: true,
  items: [
    item('DD-01', 'Horn OK Please', { name: 'Black', hex: '#141414' }, hornChest, hornBack, [INK.yellow, INK.pink], [INK.yellow, INK.red, INK.green, INK.pink, INK.white]),
    item('DD-02', 'Gully Cricket Club', { name: 'Sand', hex: '#C9B88E' }, gullyChest, gullyBack, [INK.navy, INK.red], [INK.navy, INK.red, INK.white]),
    item('DD-03', 'brain.exe', { name: 'Charcoal', hex: '#3A3A3C' }, brainChest, brainBack, [INK.cream, INK.blue], [INK.cream, INK.blue, INK.black, INK.lime]),
    item('DD-04', 'No Stress', { name: 'Navy', hex: '#1C2340' }, stressChest, stressBack, [FULL], [FULL]),
    item('DD-05', 'Bedroom Tapes', { name: 'Off White', hex: '#EFE8DA' }, bedroomChest, bedroomBack, [INK.black, INK.orange], [INK.black, INK.orange, INK.blue]),
    item('DD-06', 'Bindaas', { name: 'Coffee', hex: '#4A3428' }, bindaasChest, bindaasBack, [INK.lime, INK.cream], [INK.lime, INK.bubblegum, INK.cream]),
  ],
};
