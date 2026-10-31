// Collection 10 — TOY BOX. Summer program · Boys Core · R/N half sleeve · Kids 16–20 (1–3 yrs).
// Front prints only, exactly 4 inks each. Toy-like: chunky outlines, polka dots and
// halftone dot shading so 4 inks read as more colours. Placement mix per the playbook:
// chest prints, hem placements with a small chest mark, and full-front coverage.
// Artboard = the garment front panel (240 x 300), so placement is part of the artwork.
import { halftone, sparkle, star, r2 } from '../lib/svg.mjs';
import { C, E, R, P, S, layer, knockout } from '../lib/toon.mjs';
import { isDark } from '../src/garment.mjs';

const W = 240, H = 300, SIZE = [W, H];
const INK = {
  navy: { name: 'Navy', hex: '#1C2340' },
  yellow: { name: 'Sun Yellow', hex: '#FFC93C' },
  tomato: { name: 'Tomato', hex: '#FF4B2B' },
  sky: { name: 'Sky', hex: '#6EC1FF' },
  white: { name: 'White', hex: '#FFFFFF' },
  blue: { name: 'Royal Blue', hex: '#2B6BFF' },
  green: { name: 'Leaf Green', hex: '#2DB46B' },
  pink: { name: 'Hot Pink', hex: '#FF6FA8' },
  mint: { name: 'Mint', hex: '#4CC9A0' },
  orange: { name: 'Orange', hex: '#FF8A1F' },
  butter: { name: 'Butter', hex: '#FFD84D' },
};
const BAGEL = `font-family="Bagel Fat One"`;
// Faint garment-front outline for previews: shows where the print sits.
const frontGuide = (hex) => `<path d="M2,16 L80,2 Q120,32 160,2 L238,16 L238,298 L2,298 Z" fill="none"
  stroke="${isDark(hex) ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.22)'}" stroke-width="1.2" stroke-dasharray="5 4"/>`;
const dots = (pts, r, fill) => pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`).join('');
// Halftone shading clipped to a shape: darker at `from` side, fading to nothing.
const shade = (id, clipShape, box, fill, toneFn, cell = 4.2) =>
  `<clipPath id="${id}">${clipShape}</clipPath>${halftone({ ...box, cell, fill, clip: id, angle: 45, tone: toneFn })}`;
const bubbleText = (x, y, size, txt, fill, line, extra = '') =>
  `<text x="${x}" y="${y}" text-anchor="middle" ${BAGEL} font-size="${size}" fill="${fill}" stroke="${line}" stroke-width="${size * 0.16}" stroke-linejoin="round" paint-order="stroke" ${extra}>${txt}</text>`;

// 1. Beep Beep — toy dump truck (chest) ---------------------------------------
const truck = ({ id }) => `<g transform="translate(10 0)">${truckArt(id)}</g>`;
const truckArt = (id) => {
  const { navy, yellow, tomato, sky } = INK;
  const N = navy.hex;
  const bed = 'M24,62 L120,62 L126,106 L32,110 Z';
  const cab = 'M126,74 L160,74 Q174,74 180,90 L190,106 L190,128 L126,128 Z';
  return `
  ${layer([C(14, 112, 8, sky.hex), C(10, 96, 5, sky.hex)], N, 2.5)}
  ${layer([C(46, 52, 11, yellow.hex), C(68, 46, 12, sky.hex), C(92, 50, 11, tomato.hex), C(108, 54, 9, yellow.hex), C(58, 58, 9, tomato.hex)], N, 3)}
  ${dots([[64, 42], [44, 48], [90, 46]], 2.2, '#FFFFFF00')}
  ${layer([P(bed, tomato.hex), P(cab, yellow.hex), R(20, 106, 174, 22, 8, N)], N, 3.5)}
  ${shade(id('bed'), `<path d="${bed}"/>`, { x: 24, y: 62, w: 102, h: 48 }, N, (x, y) => (y - 74) / 40)}
  ${shade(id('cab'), `<path d="${cab}"/>`, { x: 126, y: 74, w: 64, h: 54 }, N, (x, y) => (y - 96) / 34)}
  ${dots([[40, 76], [58, 76], [76, 76], [94, 76], [110, 76], [49, 90], [67, 90], [85, 90], [103, 90]], 3.2, yellow.hex)}
  ${layer([R(134, 82, 32, 22, 5, sky.hex)], N, 3)}
  <path d="M140,100 L152,86" stroke="#FFFFFF" stroke-width="0" />
  ${layer([C(186, 110, 6, yellow.hex)], N, 2.5)}
  ${[58, 160].map((x) => `${layer([C(x, 134, 21, N)], N, 2)}${layer([C(x, 134, 10, sky.hex)], N, 0)}<circle cx="${x}" cy="${134}" r="3.5" fill="${yellow.hex}"/>`).join('')}
  ${bubbleText(120, 196, 34, 'BEEP BEEP!', yellow.hex, N, 'textLength="196" lengthAdjust="spacingAndGlyphs"')}
  ${[[30, 176, 7, tomato.hex], [212, 170, 9, sky.hex]].map(([x, y, r, f]) => `<path d="${sparkle(x, y, r)}" fill="${f}"/>`).join('')}`;
};

// 2. Choo Choo — toy train along the hem + small chest cloud -------------------
const train = () => {
  const { navy, tomato, yellow, white } = INK;
  const N = navy.hex;
  const wagon = (x, colour, cargo) => `
    ${layer([R(x, 238, 56, 34, 7, colour)], N, 3)}
    ${dots([[x + 12, 250], [x + 28, 250], [x + 44, 250], [x + 20, 262], [x + 36, 262]], 3, white.hex)}
    ${cargo}
    ${[x + 14, x + 42].map((cx) => `${layer([C(cx, 276, 9, N)], N, 1.5)}<circle cx="${cx}" cy="276" r="3" fill="${yellow.hex}"/>`).join('')}`;
  return `
  <g transform="translate(176 66)">
    ${layer([C(0, 0, 18, white.hex), C(20, -8, 22, white.hex), C(40, 2, 16, white.hex), R(-14, 0, 64, 16, 8, white.hex)], N, 3)}
    <text x="18" y="9" text-anchor="middle" ${BAGEL} font-size="13" fill="${N}">choo choo</text>
    <path d="${sparkle(-18, -18, 7)}" fill="${yellow.hex}"/>
  </g>
  <path d="M2,290 H238" stroke="${N}" stroke-width="4"/>
  ${Array.from({ length: 12 }, (_, i) => `<rect x="${6 + i * 20}" y="286" width="10" height="9" rx="2" fill="${N}"/>`).join('')}
  ${layer([C(150, 206, 9, white.hex), C(136, 190, 12, white.hex), C(116, 176, 15, white.hex), C(92, 168, 11, white.hex)], N, 2.5)}
  ${wagon(8, yellow.hex, layer([R(14, 216, 20, 20, 3, tomato.hex), R(36, 222, 16, 16, 3, white.hex)], N, 2.5))}
  ${wagon(72, tomato.hex, layer([C(86, 228, 10, yellow.hex), C(106, 230, 8, white.hex)], N, 2.5))}
  <path d="M64,262 h8 M128,262 h8" stroke="${N}" stroke-width="4"/>
  ${layer([R(136, 214, 46, 58, 6, yellow.hex), P('M182,236 L222,236 Q232,236 232,248 L232,272 L182,272 Z', tomato.hex), R(196, 210, 14, 26, 3, N)], N, 3)}
  ${layer([R(144, 222, 28, 22, 4, white.hex)], N, 2.5)}
  ${dots([[194, 250], [208, 250], [222, 250], [201, 262], [215, 262]], 2.8, yellow.hex)}
  ${[[152, 276, 13], [188, 278, 10], [216, 278, 10]].map(([cx, cy, r]) => `${layer([C(cx, cy, r, N)], N, 1.5)}<circle cx="${cx}" cy="${cy}" r="${r * 0.38}" fill="${white.hex}"/>`).join('')}
  ${layer([C(232, 258, 5, yellow.hex)], N, 2)}`;
};

// 3. Block Party — tumbling toy blocks, full front -------------------------------
const block = (x, y, s, colour, label, labelColour, shadeInk, id) => {
  const d = s * 0.32;
  const top = `M${x},${y} L${x + d},${y - d} L${x + s + d},${y - d} L${x + s},${y} Z`;
  const side = `M${x + s},${y} L${x + s + d},${y - d} L${x + s + d},${y + s - d} L${x + s},${y + s} Z`;
  return `
    <path d="${top}" fill="${colour}"/><path d="${side}" fill="${colour}"/><rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${colour}"/>
    ${shade(id, `<path d="${side}"/>`, { x: x + s, y: y - d, w: d, h: s + d }, shadeInk, () => 0.55, 3.4)}
    ${halftone({ x, y: y - d, w: s + d, h: d, cell: 3.4, fill: '#FFFFFF', tone: () => 0, clip: '' })}
    <rect x="${x + s * 0.12}" y="${y + s * 0.12}" width="${s * 0.76}" height="${s * 0.76}" rx="${s * 0.1}" fill="none" stroke="${labelColour}" stroke-width="${s * 0.06}"/>
    <text x="${x + s / 2}" y="${y + s * 0.72}" text-anchor="middle" ${BAGEL} font-size="${s * 0.58}" fill="${labelColour}">${label}</text>`;
};
const blocks = ({ id }) => {
  const { tomato, blue, yellow, green } = INK;
  const B = blue.hex;
  const list = [
    [70, 220, 64, tomato.hex, 'A', yellow.hex, 0], [130, 232, 54, yellow.hex, 'B', B, 6], [96, 156, 58, green.hex, 'C', yellow.hex, -8],
    [154, 168, 50, B, '1', yellow.hex, 10], [118, 98, 52, tomato.hex, '2', yellow.hex, 4], [18, 238, 44, B, '3', yellow.hex, -12],
    [190, 96, 40, green.hex, '★', yellow.hex, 14], [20, 112, 40, yellow.hex, '♥', tomato.hex, -10], [186, 238, 42, green.hex, 'Z', yellow.hex, 8],
  ];
  const ring = (x, y, r, c) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${c}" stroke-width="${r * 0.45}"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.3}" r="${r * 0.12}" fill="#FFFFFF"/>`;
  return `
  ${list.map(([x, y, s, c, l, lc, rot], i) => `<g transform="rotate(${rot} ${x + s / 2} ${y + s / 2})">${block(x, y, s, c, l, lc, c === B ? green.hex : B, id(`b${i}`))}</g>`).join('')}
  ${ring(52, 70, 16, tomato.hex)}${ring(196, 56, 12, B)}${ring(70, 196, 9, yellow.hex)}
  ${[[30, 40], [120, 44], [212, 150], [16, 176], [228, 210], [150, 62]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${3 + (i % 3)}" fill="${[tomato.hex, B, green.hex, yellow.hex][i % 4]}"/>`).join('')}
  ${[[92, 40, 9, yellow.hex], [222, 112, 8, tomato.hex], [40, 150, 7, green.hex]].map(([x, y, r, f]) => `<path d="${star(x, y, 5, r, r * 0.45)}" fill="${f}"/>`).join('')}`;
};

// 4. Up Up & Away — toy propeller plane (chest) -----------------------------------
const plane = ({ id }) => {
  const { navy, sky, yellow, white } = INK;
  const N = navy.hex;
  const body = 'M60,96 Q60,76 86,74 L160,72 Q190,72 196,92 Q190,112 160,112 L86,114 Q60,114 60,96 Z';
  return `
  <path d="M8,150 C30,170 56,150 44,132 C34,118 14,134 30,146 C46,158 58,128 64,112" fill="none" stroke="${N}" stroke-width="3" stroke-dasharray="1 7" stroke-linecap="round"/>
  ${layer([C(26, 60, 11, white.hex), C(42, 52, 14, white.hex), C(58, 60, 10, white.hex), R(18, 60, 48, 10, 5, white.hex)], N, 2.5)}
  ${layer([C(190, 160, 9, white.hex), C(204, 152, 12, white.hex), C(218, 160, 8, white.hex), R(184, 160, 42, 8, 4, white.hex)], N, 2.5)}
  <g transform="rotate(-10 128 96)">
    ${layer([P('M70,92 L48,58 L70,60 L88,90 Z', yellow.hex)], N, 3)}
    ${layer([P(body, sky.hex)], N, 3.5)}
    ${shade(id('body'), `<path d="${body}"/>`, { x: 60, y: 72, w: 136, h: 42 }, N, (x, y) => (y - 98) / 18)}
    <path d="M78,84 L176,82" stroke="${white.hex}" stroke-width="5" stroke-linecap="round"/>
    ${layer([P('M106,98 L126,98 L150,140 L124,140 Z', yellow.hex)], N, 3)}
    ${dots([[128, 112], [136, 124], [130, 132]], 3, white.hex)}
    ${layer([E(150, 82, 16, 10, white.hex)], N, 3)}
    ${layer([R(196, 76, 8, 34, 3, N), E(206, 72, 5, 18, yellow.hex, 10), E(206, 114, 5, 18, yellow.hex, -10), C(202, 93, 6, yellow.hex)], N, 2.5)}
    ${layer([S('M110,114 L104,130', 4, N), C(102, 134, 7, N)], N, 1)}<circle cx="102" cy="134" r="2.5" fill="${white.hex}"/>
  </g>
  ${bubbleText(120, 214, 26, 'UP UP &amp; AWAY', sky.hex, N, 'textLength="206" lengthAdjust="spacingAndGlyphs"')}`;
};

// 5. Scoop Truck — ice-cream van along the hem + small chest cone ----------------
const cone = (x, y, s, scoop, sprinkle, line) => `<g transform="translate(${x} ${y}) scale(${s})">
  <clipPath id="cone-${x}-${y}"><path d="M-14,0 L14,0 L0,34 Z"/></clipPath>
  <g clip-path="url(#cone-${x}-${y})" stroke="${line}" stroke-width="1.6">${[-16, -8, 0, 8, 16].map((o) => `<path d="M${o - 14},0 L${o + 14},34 M${o + 14},0 L${o - 14},34"/>`).join('')}</g>
  <path d="M-14,0 L14,0 L0,34 Z" fill="none" stroke="${line}" stroke-width="3" stroke-linejoin="round"/>
  ${layer([C(0, -10, 16, scoop)], line, 2.5)}
  ${dots([[-6, -14], [5, -18], [7, -6], [-3, -4]], 1.8, sprinkle)}
  <path d="M-10,-2 q3,8 6,0 q3,8 6,0" fill="${scoop}" stroke="${line}" stroke-width="2"/></g>`;
const scoopVan = ({ id }) => {
  const { navy, pink, mint, white } = INK;
  const N = navy.hex;
  const body = 'M20,232 L20,206 Q20,194 32,194 L150,194 Q160,194 166,206 L190,236 L196,236 Q204,236 204,246 L204,276 L20,276 Z';
  return `
  <g transform="translate(190 66)">${cone(0, 0, 1.4, pink.hex, mint.hex, N)}</g>
  ${bubbleText(190, 132, 18, 'SCOOP!', pink.hex, N)}
  <g transform="translate(0 4)">
    <g transform="translate(86 168)">${cone(0, 0, 1.25, pink.hex, mint.hex, N)}</g>
    ${layer([P(body, white.hex)], N, 3.5)}
    ${shade(id('van'), `<path d="${body}"/>`, { x: 20, y: 194, w: 184, h: 82 }, mint.hex, (x, y) => (y - 248) / 26, 4)}
    <rect x="22" y="236" width="180" height="14" fill="${pink.hex}"/>
    ${dots([[34, 243], [54, 243], [74, 243], [94, 243], [114, 243], [134, 243], [154, 243], [174, 243], [194, 243]], 3, white.hex)}
    ${layer([R(40, 204, 78, 26, 4, mint.hex)], N, 3)}
    ${Array.from({ length: 6 }, (_, i) => `<path d="M${40 + i * 13},230 a6.5,6.5 0 0 0 13,0" fill="${i % 2 ? pink.hex : white.hex}" stroke="${N}" stroke-width="2"/>`).join('')}
    ${layer([P('M136,206 L156,206 L176,232 L136,232 Z', mint.hex)], N, 3)}
    ${[60, 168].map((cx) => `${layer([C(cx, 278, 16, N)], N, 1.5)}${layer([C(cx, 278, 7, white.hex)], N, 0)}`).join('')}
    ${layer([C(202, 256, 4, pink.hex)], N, 2)}
  </g>
  <g transform="translate(222 222) rotate(14)">${cone(0, 0, 0.8, mint.hex, pink.hex, N)}</g>
  ${[[18, 176, 8, pink.hex], [216, 186, 6, mint.hex]].map(([x, y, r, f]) => `<path d="${sparkle(x, y, r)}" fill="${f}"/>`).join('')}`;
};

// 6. Wind-Up Robot — full front ----------------------------------------------------
const gear = (x, y, r, fill, teeth = 8) => {
  let d = '';
  for (let i = 0; i < teeth * 2; i++) {
    const a = (i * Math.PI) / teeth, rr = i % 2 ? r * 0.78 : r;
    d += `${i ? 'L' : 'M'}${r2(x + rr * Math.cos(a))},${r2(y + rr * Math.sin(a))}`;
  }
  return `<path d="${d}Z" fill="${fill}"/><circle cx="${x}" cy="${y}" r="${r * 0.35}" fill="#1F2A44"/>`;
};
const robot = ({ id }) => {
  const { orange, sky, butter, white } = INK;
  const Wt = white.hex;
  const torso = 'M70,128 L170,128 L176,212 L64,212 Z';
  const body = [
    layer([S('M72,150 L44,176 L40,206', 14, sky.hex), S('M168,150 L196,134 L208,104', 14, sky.hex)], Wt, 3),
    layer([E(38, 214, 12, 9, butter.hex), E(210, 96, 12, 9, butter.hex)], Wt, 3),
    layer([R(84, 210, 28, 40, 6, sky.hex), R(128, 210, 28, 40, 6, sky.hex)], Wt, 3),
    layer([R(76, 246, 42, 18, 8, orange.hex), R(122, 246, 42, 18, 8, orange.hex)], Wt, 3),
    layer([P(torso, orange.hex)], Wt, 3.5),
    shade(id('torso'), `<path d="${torso}"/>`, { x: 64, y: 128, w: 112, h: 84 }, '#1F2A44', (x) => (x - 130) / 46),
    layer([C(100, 160, 16, butter.hex), R(126, 148, 34, 46, 6, sky.hex)], Wt, 3),
    `<path d="M100,160 L108,150" stroke="#1F2A44" stroke-width="3.5" stroke-linecap="round"/>`,
    dots([[134, 158], [146, 158], [134, 172], [146, 172], [134, 186], [146, 186]], 3.4, butter.hex),
    dots([[86, 196], [100, 196], [114, 196]], 3.6, Wt),
    layer([R(178, 150, 12, 28, 3, butter.hex), E(198, 146, 9, 14, butter.hex), E(198, 182, 9, 14, butter.hex)], Wt, 2.5),
    layer([S('M120,64 L120,44', 4, Wt), C(120, 38, 8, butter.hex)], Wt, 2),
    layer([R(78, 62, 84, 66, 14, Wt)], Wt, 2),
    layer([R(90, 76, 60, 34, 10, sky.hex)], '#1F2A44', 2.5),
    `<circle cx="108" cy="93" r="7" fill="${butter.hex}"/><circle cx="132" cy="93" r="7" fill="${butter.hex}"/>`,
    `<path d="M106,118 h28" stroke="${orange.hex}" stroke-width="4" stroke-linecap="round"/>`,
  ].join('');
  return `
  ${gear(30, 54, 18, sky.hex)}${gear(212, 238, 20, butter.hex, 10)}${gear(206, 40, 12, orange.hex)}${gear(22, 262, 13, orange.hex)}
  ${[[44, 112, 9, butter.hex], [208, 196, 7, sky.hex], [170, 24, 6, butter.hex], [40, 300 - 70, 6, sky.hex]].map(([x, y, r, f]) => `<path d="${sparkle(x, y, r)}" fill="${f}"/>`).join('')}
  ${[[60, 30], [182, 80], [24, 160], [222, 140], [196, 276], [56, 284]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${2.5 + (i % 3)}" fill="${[Wt, butter.hex, sky.hex][i % 3]}"/>`).join('')}
  <path d="M30,92 q-8,8 0,16 M222,64 q8,8 0,16" fill="none" stroke="${Wt}" stroke-width="3" stroke-linecap="round"/>
  ${body}
  ${bubbleText(120, 292, 22, 'BEEP BOOP', butter.hex, '#1F2A44', 'textLength="140" lengthAdjust="spacingAndGlyphs"')}`;
};

const item = (ref, name, placement, colour, svg, inks) => ({
  ref, name: `${name}`, colour, placement,
  art: { front: { svg, size: SIZE, inks } },
});

export default {
  id: 'c10-toy-box',
  code: 'SUMMER · BOYS CORE · R/N H/S · KIDS 16–20 (1–3 YRS)',
  title: 'TOY BOX',
  technique: '4-COLOUR SCREEN PRINT',
  subtitle: 'toy-like prints · chest / hem / full front',
  layout: 'single',
  countInks: true,
  footer: 'Artboard = garment front panel, so each print sits where it prints (chest / hem / full).',
  items: [
    item('TB-01', 'Beep Beep', 'chest', { name: 'Mint', hex: '#BFE6D1' }, truck, [INK.navy, INK.yellow, INK.tomato, INK.sky]),
    item('TB-02', 'Choo Choo', 'hem + chest', { name: 'Sky Blue', hex: '#A9D6F5' }, train, [INK.navy, INK.tomato, INK.yellow, INK.white]),
    item('TB-03', 'Block Party', 'full front', { name: 'Off White', hex: '#F4EFE6' }, blocks, [INK.tomato, INK.blue, INK.yellow, INK.green]),
    item('TB-04', 'Up Up & Away', 'chest', { name: 'Peach', hex: '#FFC8A8' }, plane, [INK.navy, INK.sky, INK.yellow, INK.white]),
    item('TB-05', 'Scoop Truck', 'hem + chest', { name: 'Lemon', hex: '#FFF0A8' }, scoopVan, [INK.navy, INK.pink, INK.mint, INK.white]),
    item('TB-06', 'Wind-Up Robot', 'full front', { name: 'Navy', hex: '#1F2A44' }, robot, [INK.orange, INK.sky, INK.butter, INK.white]),
  ],
};
