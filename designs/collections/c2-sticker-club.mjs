// Collection 2 — STICKER CLUB: flat, graphic illustrations in exactly four inks.
import { star, sparkle, arc, r2 } from '../lib/svg.mjs';

const INK = {
  cobalt: { name: 'Cobalt', hex: '#2B4BFF' },
  tomato: { name: 'Tomato', hex: '#FF4B2B' },
  sun: { name: 'Sunflower', hex: '#FFC93C' },
  black: { name: 'Ink Black', hex: '#151515' },
  cream: { name: 'Cream', hex: '#FFF1D6' },
  sky: { name: 'Sky', hex: '#8FD3FF' },
  mint: { name: 'Mint', hex: '#5ED3A0' },
  pink: { name: 'Bubblegum', hex: '#FF8FB8' },
  white: { name: 'White', hex: '#FFFFFF' },
  forest: { name: 'Forest', hex: '#1E3A2B' },
};
const MONO = `font-family="Space Mono" font-weight="700"`;

const bauhaus = ({ id }) => {
  const { cobalt, tomato, sun, black } = INK;
  const s = 84, g = 6, x0 = 21, y0 = 18;
  const at = (c, r) => [x0 + c * (s + g), y0 + r * (s + g)];
  const tile = (c, r, inner) => {
    const [x, y] = at(c, r);
    return `<g transform="translate(${x} ${y})"><clipPath id="${id(`t${c}${r}`)}"><rect width="${s}" height="${s}"/></clipPath><g clip-path="url(#${id(`t${c}${r}`)})">${inner}</g></g>`;
  };
  return `
  ${tile(0, 0, `<rect width="${s}" height="${s}" fill="${cobalt.hex}"/><circle cx="0" cy="${s}" r="${s}" fill="${sun.hex}"/>`)}
  ${tile(1, 0, `<rect width="${s}" height="${s}" fill="${sun.hex}"/><circle cx="${s / 2}" cy="${s / 2}" r="28" fill="${black.hex}"/>`)}
  ${tile(2, 0, `<rect width="${s}" height="${s}" fill="${tomato.hex}"/><circle cx="${s / 2}" cy="0" r="${s / 2}" fill="${cobalt.hex}"/><circle cx="${s / 2}" cy="${s}" r="14" fill="${sun.hex}"/>`)}
  ${tile(0, 1, `<rect width="${s}" height="${s}" fill="${black.hex}"/><path d="M0,${s} L${s / 2},8 L${s},${s} Z" fill="${tomato.hex}"/>`)}
  ${tile(1, 1, `<path d="M0,0 A${s / 2},${s / 2} 0 0 1 ${s},0 Z" transform="translate(0 ${s / 2})" fill="${tomato.hex}"/><path d="M0,0 A${s / 2},${s / 2} 0 0 0 ${s},0 Z" transform="translate(0 ${s / 2})" fill="${sun.hex}"/><circle cx="${s / 2}" cy="${s / 2}" r="10" fill="${black.hex}"/>`)}
  ${tile(2, 1, `<rect width="${s}" height="${s}" fill="${sun.hex}"/><circle cx="${s}" cy="0" r="${s * 0.8}" fill="${black.hex}"/><circle cx="24" cy="${s - 24}" r="12" fill="${cobalt.hex}"/>`)}
  <text x="150" y="262" text-anchor="middle" font-family="Rubik Mono One" font-size="64" fill="${black.hex}" textLength="264" lengthAdjust="spacingAndGlyphs">PLAY</text>
  <rect x="21" y="274" width="12" height="12" fill="${tomato.hex}"/><circle cx="47" cy="280" r="6" fill="${cobalt.hex}"/><path d="M59,286 l6,-12 l6,12z" fill="${sun.hex}"/>
  <text x="285" y="285" text-anchor="end" ${MONO} font-size="10" fill="${black.hex}" letter-spacing="1.2">SHAPE SCHOOL · EST. TODAY</text>`;
};

const spaceClub = ({ id }) => {
  const { cream, tomato, sun, sky } = INK;
  const px = 200, py = 108, pr = 52;
  const rocket = `
    <path d="M-18,12 L-38,48 L-18,40 Z M18,12 L38,48 L18,40 Z" fill="${tomato.hex}"/>
    <path d="M-12,46 Q0,104 12,46 Z" fill="${sun.hex}"/><path d="M-6,46 Q0,78 6,46 Z" fill="${tomato.hex}"/>
    <path d="M0,-62 C24,-40 25,12 18,42 L-18,42 C-25,12 -24,-40 0,-62 Z" fill="${cream.hex}"/>
    <path d="M0,-62 C10,-53 15,-46 18,-38 L-18,-38 C-15,-46 -10,-53 0,-62 Z" fill="${tomato.hex}"/>
    <circle cx="0" cy="-10" r="14" fill="${tomato.hex}"/><circle cx="0" cy="-10" r="10" fill="${sky.hex}"/>
    <rect x="-3" y="18" width="6" height="24" fill="${tomato.hex}"/>`;
  return `
  <defs>
    <clipPath id="${id('planet')}"><circle cx="${px}" cy="${py}" r="${pr}"/></clipPath>
    <clipPath id="${id('front')}"><rect x="${px - 120}" y="${py}" width="240" height="120"/></clipPath>
  </defs>
  <g transform="rotate(-16 ${px} ${py})"><ellipse cx="${px}" cy="${py}" rx="90" ry="20" fill="none" stroke="${cream.hex}" stroke-width="7"/></g>
  <circle cx="${px}" cy="${py}" r="${pr}" fill="${sun.hex}"/>
  <g clip-path="url(#${id('planet')})" fill="${tomato.hex}">
    <rect x="${px - 60}" y="${py - 30}" width="120" height="10" transform="rotate(-16 ${px} ${py})"/>
    <rect x="${px - 60}" y="${py + 22}" width="120" height="16" transform="rotate(-16 ${px} ${py})"/>
    <circle cx="${px + 22}" cy="${py - 16}" r="7"/>
  </g>
  <g transform="rotate(-16 ${px} ${py})"><ellipse cx="${px}" cy="${py}" rx="90" ry="20" fill="none" stroke="${cream.hex}" stroke-width="7" clip-path="url(#${id('front')})"/></g>
  <g transform="translate(76 162) rotate(32) scale(1.05)">${rocket}</g>
  ${[[36, 40, 10], [140, 30, 7], [262, 196, 9], [40, 214, 6], [276, 40, 6]].map(([x, y, r]) => `<path d="${sparkle(x, y, r)}" fill="${cream.hex}"/>`).join('')}
  ${[[110, 70], [250, 180], [160, 200], [20, 120]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${sky.hex}"/>`).join('')}
  <text x="150" y="266" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="34" fill="${cream.hex}" textLength="262" lengthAdjust="spacingAndGlyphs">SPACE CLUB</text>
  <text x="150" y="292" text-anchor="middle" ${MONO} font-size="11" fill="${sky.hex}" letter-spacing="3">OFFICIAL MEMBER · Nº 024</text>`;
};

const dinoDept = () => {
  const { mint, black, pink, sun } = INK;
  const spikes = [-158, -134, -110, -86, -62]
    .map((deg) => {
      const t = (deg * Math.PI) / 180;
      const bx = 140 + 76 * Math.cos(t), by = 172 + 54 * Math.sin(t);
      const nx = Math.cos(t), ny = Math.sin(t);
      const tx = -ny, ty = nx;
      return `M${r2(bx + tx * 15)},${r2(by + ty * 15)} L${r2(bx + nx * 32)},${r2(by + ny * 32)} L${r2(bx - tx * 15)},${r2(by - ty * 15)} Z`;
    })
    .join(' ');
  const shapes = `
    <ellipse cx="140" cy="172" rx="78" ry="56"/>
    <ellipse cx="214" cy="100" rx="46" ry="36"/>
    <path d="M172,150 L190,104 L236,116 L214,172 Z"/>
    <path d="M74,160 Q30,176 12,128 Q44,160 84,140 Z"/>
    <rect x="96" y="200" width="28" height="54" rx="12"/><rect x="160" y="200" width="28" height="54" rx="12"/>`;
  return `
  <path d="${spikes}" fill="${sun.hex}" stroke="${black.hex}" stroke-width="5" stroke-linejoin="round"/>
  <g fill="${black.hex}" stroke="${black.hex}" stroke-width="10" stroke-linejoin="round">${shapes}</g>
  <g fill="${mint.hex}">${shapes}</g>
  <ellipse cx="128" cy="186" rx="44" ry="26" fill="${sun.hex}"/>
  ${[[110, 150, 7], [168, 142, 5], [92, 178, 4]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${black.hex}"/>`).join('')}
  <circle cx="226" cy="90" r="7" fill="${black.hex}"/>
  <circle cx="240" cy="112" r="8" fill="${pink.hex}"/>
  <path d="M214,118 q12,10 24,2" fill="none" stroke="${black.hex}" stroke-width="4" stroke-linecap="round"/>
  <g transform="translate(18 22) rotate(-8)">
    <path d="M0,10 Q0,0 10,0 L84,0 Q94,0 94,10 L94,34 Q94,44 84,44 L34,44 L18,60 L20,44 L10,44 Q0,44 0,34 Z" fill="${pink.hex}" stroke="${black.hex}" stroke-width="4" stroke-linejoin="round"/>
    <text x="47" y="31" text-anchor="middle" font-family="Bagel Fat One" font-size="23" fill="${black.hex}">RAWR!</text>
  </g>
  <text x="150" y="292" text-anchor="middle" font-family="Bagel Fat One" font-size="42" fill="${black.hex}" textLength="250" lengthAdjust="spacingAndGlyphs">DINO DEPT.</text>`;
};

const stickerBomb = ({ id }) => {
  const { white, black, pink, sun } = INK;
  const STK = `stroke="${white.hex}" stroke-width="10" stroke-linejoin="round" paint-order="stroke"`;
  return `
  <defs><path id="${id('club')}" d="${arc(206, 92, 40, 180, 539.9)}"/></defs>
  <path d="M74,24 L40,96 L70,96 L52,160 L112,74 L80,74 L100,24 Z" fill="${sun.hex}" ${STK} transform="rotate(-6 76 92)"/>
  <path d="M74,24 L40,96 L70,96 L52,160 L112,74 L80,74 L100,24 Z" fill="none" stroke="${black.hex}" stroke-width="4" stroke-linejoin="round" transform="rotate(-6 76 92)"/>
  <circle cx="206" cy="92" r="60" fill="${black.hex}" stroke="${white.hex}" stroke-width="10"/>
  <text font-family="Unbounded" font-weight="700" font-size="12.4" fill="${white.hex}" letter-spacing="2.3"><textPath href="#${id('club')}">NO HOMEWORK CLUB ✦ NO HOMEWORK CLUB ✦ </textPath></text>
  <path d="${star(206, 92, 5, 24, 10)}" fill="${sun.hex}"/>
  <g transform="rotate(-9 150 186)">
    <rect x="62" y="160" width="176" height="52" rx="26" fill="${pink.hex}" ${STK}/>
    <rect x="62" y="160" width="176" height="52" rx="26" fill="none" stroke="${black.hex}" stroke-width="4"/>
    <text x="150" y="196" text-anchor="middle" font-family="Bagel Fat One" font-size="30" fill="${black.hex}">COOL KID</text>
  </g>
  <path d="${star(58, 238, 5, 38, 17, -80)}" fill="${pink.hex}" ${STK}/>
  <path d="${star(58, 238, 5, 38, 17, -80)}" fill="none" stroke="${black.hex}" stroke-width="4" stroke-linejoin="round"/>
  <g transform="rotate(8 228 250)">
    <rect x="176" y="224" width="106" height="52" rx="12" fill="${black.hex}" stroke="${white.hex}" stroke-width="10"/>
    <text x="229" y="262" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="26" fill="${sun.hex}" textLength="84" lengthAdjust="spacingAndGlyphs">100%</text>
  </g>
  <g transform="rotate(-14 136 260)">
    <rect x="104" y="244" width="62" height="30" rx="6" fill="${white.hex}"/>
    <text x="135" y="264" text-anchor="middle" ${MONO} font-size="11" fill="${black.hex}">HI!!</text>
  </g>
  ${[[150, 40, 12], [276, 168, 9], [16, 176, 8]].map(([x, y, r]) => `<path d="${sparkle(x, y, r)}" fill="${white.hex}"/>`).join('')}`;
};

const freshSqueezed = ({ id }) => {
  const { tomato, sun, forest, cream } = INK;
  const seeds = [[-28, 10], [-12, 22], [8, 22], [24, 10], [-2, 36]]
    .map(([x, y]) => `<ellipse cx="${150 + x}" cy="${148 + y}" rx="2.6" ry="4.6" fill="${forest.hex}" transform="rotate(${x / 2} ${150 + x} ${148 + y})"/>`)
    .join('');
  return `
  <defs><path id="${id('top')}" d="${arc(150, 196, 150, -140, -40)}"/></defs>
  <text font-family="Shrikhand" font-size="54" fill="${forest.hex}"><textPath href="#${id('top')}" startOffset="50%" text-anchor="middle">fresh</textPath></text>
  <path d="M84,140 A66,66 0 0 0 216,140 Z" fill="${forest.hex}"/>
  <path d="M90,140 A60,60 0 0 0 210,140 Z" fill="${cream.hex}"/>
  <path d="M96,140 A54,54 0 0 0 204,140 Z" fill="${tomato.hex}"/>
  ${seeds}
  <g transform="rotate(-24 50 150)">
    <ellipse cx="50" cy="150" rx="34" ry="25" fill="${sun.hex}"/>
    <ellipse cx="14" cy="150" rx="6" ry="5" fill="${sun.hex}"/><ellipse cx="86" cy="150" rx="6" ry="5" fill="${sun.hex}"/>
    <ellipse cx="40" cy="141" rx="12" ry="5" fill="${cream.hex}"/>
  </g>
  <path d="M58,124 q14,-20 34,-14 q-12,18 -34,14z" fill="${forest.hex}"/>
  <path d="M236,108 q-16,30 -22,56 M236,108 q10,26 18,50" fill="none" stroke="${forest.hex}" stroke-width="4" stroke-linecap="round"/>
  <path d="M236,108 q22,-16 40,-4 q-20,16 -40,4z" fill="${forest.hex}"/>
  <circle cx="212" cy="178" r="18" fill="${tomato.hex}"/><circle cx="256" cy="172" r="18" fill="${tomato.hex}"/>
  <ellipse cx="206" cy="171" rx="5" ry="3" fill="${cream.hex}" transform="rotate(-30 206 171)"/>
  <ellipse cx="250" cy="165" rx="5" ry="3" fill="${cream.hex}" transform="rotate(-30 250 165)"/>
  <text x="150" y="258" text-anchor="middle" font-family="Shrikhand" font-size="46" fill="${forest.hex}" textLength="262" lengthAdjust="spacingAndGlyphs">squeezed</text>
  <text x="150" y="288" text-anchor="middle" ${MONO} font-size="11" fill="${tomato.hex}" letter-spacing="3">VITAMIN FUN · 100% JUICY</text>`;
};

const skateDept = ({ id }) => {
  const { white, black, sun, sky } = INK;
  const deck = `
    <rect x="-34" y="-128" width="68" height="256" rx="34" fill="${sky.hex}" stroke="${black.hex}" stroke-width="5"/>
    <clipPath id="${id('deck')}"><rect x="-34" y="-128" width="68" height="256" rx="34"/></clipPath>
    <g clip-path="url(#${id('deck')})">
      ${Array.from({ length: 8 }, (_, r) => Array.from({ length: 6 }, (_, c) => ((r + c) % 2 ? '' : `<rect x="${-36 + c * 12}" y="${-24 + r * 12}" width="12" height="12" fill="${black.hex}"/>`)).join('')).join('')}
      <path d="M6,-104 L-14,-62 L2,-62 L-8,-26 L18,-72 L2,-72 L14,-104 Z" fill="${sun.hex}" stroke="${black.hex}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M6,104 L-14,62 L2,62 L-8,26 L18,72 L2,72 L14,104 Z" fill="${sun.hex}" stroke="${black.hex}" stroke-width="3" stroke-linejoin="round" transform="rotate(180 0 65)"/>
    </g>
    ${[-86, 86].map((y) => `<rect x="-44" y="${y - 9}" width="20" height="18" rx="6" fill="${sun.hex}" stroke="${black.hex}" stroke-width="4"/><rect x="24" y="${y - 9}" width="20" height="18" rx="6" fill="${sun.hex}" stroke="${black.hex}" stroke-width="4"/>`).join('')}`;
  const shadowText = (txt, y, size, fill) => `
    <text x="150" y="${y + 5}" text-anchor="middle" font-family="Archivo" font-weight="900" font-stretch="expanded" font-size="${size}" fill="${black.hex}" textLength="270" lengthAdjust="spacingAndGlyphs" transform="translate(5 0)">${txt}</text>
    <text x="150" y="${y}" text-anchor="middle" font-family="Archivo" font-weight="900" font-stretch="expanded" font-size="${size}" fill="${fill}" stroke="${black.hex}" stroke-width="3" paint-order="stroke" textLength="270" lengthAdjust="spacingAndGlyphs">${txt}</text>`;
  return `
  <g transform="translate(150 150) rotate(-38) scale(0.98)">${deck}</g>
  ${shadowText('SKATE', 112, 70, white.hex)}
  ${shadowText('OR CHILL', 214, 48, sun.hex)}
  <text x="150" y="290" text-anchor="middle" font-family="Space Mono" font-weight="700" font-size="11" fill="${white.hex}" letter-spacing="3">SKATE DEPT. · KICKFLIPS DAILY</text>`;
};

export default {
  id: 'c2-sticker-club',
  code: 'C2',
  title: 'STICKER CLUB',
  technique: '4-COLOUR SCREEN PRINT',
  subtitle: 'flat illustration, 4 inks per print',
  layout: 'single',
  countInks: true,
  items: [
    { ref: 'SC-01', name: 'Shape School', colour: { name: 'Heather Grey', hex: '#C3C4C6' }, art: { front: { svg: bauhaus, inks: [INK.cobalt, INK.tomato, INK.sun, INK.black] } } },
    { ref: 'SC-02', name: 'Space Club', colour: { name: 'Washed Navy', hex: '#233047' }, art: { front: { svg: spaceClub, inks: [INK.cream, INK.tomato, INK.sun, INK.sky] } } },
    { ref: 'SC-03', name: 'Dino Dept.', colour: { name: 'Optic White', hex: '#F7F7F5' }, art: { front: { svg: dinoDept, inks: [INK.mint, INK.black, INK.pink, INK.sun] } } },
    { ref: 'SC-04', name: 'Sticker Bomb', colour: { name: 'Dusty Lilac', hex: '#B9A7D6' }, art: { front: { svg: stickerBomb, inks: [INK.white, INK.black, INK.pink, INK.sun] } } },
    { ref: 'SC-05', name: 'Fresh Squeezed', colour: { name: 'Mint', hex: '#BFE6D1' }, art: { front: { svg: freshSqueezed, inks: [INK.tomato, INK.sun, INK.forest, INK.cream] } } },
    { ref: 'SC-06', name: 'Skate Dept.', colour: { name: 'Cherry Red', hex: '#B3192B' }, art: { front: { svg: skateDept, inks: [INK.white, INK.black, INK.sun, INK.sky] } } },
  ],
};
