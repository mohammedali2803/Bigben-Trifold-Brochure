// Collection 17 — STUDIO INK (samples). Boys 30–36 oversized back prints with an
// illustrated, screen-printed finish (dry-brush paint, hand-inked lines, misregistered
// colours, halftone shading, ink grain) after the founder's "painted letters" and
// "keychain" references. Original wording and art; no brands, no dates.
import { sparkle, star, r2 } from '../lib/svg.mjs';
import { patch } from '../lib/pin.mjs';
import { wobble, dryBrush, grain, inkDrawing } from '../lib/ink.mjs';

const SIZE = [300, 400];
const I = (name, hex) => ({ name, hex });
const MONO = 'font-family="Space Mono" font-weight="700"';

// 1. Loud Kid — dry-brush paint patches + hand-cut letters ------------------------------
const NAVY = '#1C2A6B', GREEN = '#4DB35E', ORANGE = '#FF9A1F', SAND = '#E8D5A8';
const loudKid = ({ id }) => {
  const brushPatch = (cx, cy, r, rot, col, seed) =>
    `<g transform="rotate(${rot} ${cx} ${cy})" filter="url(#${id(`db${seed % 3}`)})"><path d="${patch(cx, cy, r, seed)}" fill="${col}"/></g>`;
  const letter = (ch, x, y, size, rot, fam = 'Londrina Solid') =>
    `<text x="${x}" y="${y}" font-family="${fam}" font-weight="900" font-size="${size}" fill="${NAVY}" transform="rotate(${rot} ${x} ${y})">${ch}</text>`;
  // scribbled vinyl record standing in for the O
  let scrib = '';
  for (let i = 0; i < 9; i++) {
    const r = 30 + i * 2.6, cx = 128 + Math.sin(i * 1.7) * 2.2, cy = 92 + Math.cos(i * 2.3) * 2;
    scrib += `<ellipse cx="${r2(cx)}" cy="${r2(cy)}" rx="${r2(r)}" ry="${r2(r * 0.96)}" transform="rotate(${i * 23} ${r2(cx)} ${r2(cy)})"/>`;
  }
  return `
  <defs>${dryBrush(id('db0'), { cover: 0.8, seed: 3 })}${dryBrush(id('db1'), { cover: 0.74, seed: 8 })}${dryBrush(id('db2'), { cover: 0.84, seed: 13 })}
    ${dryBrush(id('lt'), { cover: 0.93, edge: 3.5, seed: 21 })}${wobble(id('wb'), 2.4, 0.05)}${grain(id('gr'), 0.1)}</defs>
  <g filter="url(#${id('gr')})">
    <g filter="url(#${id('db1')})"><path d="M250,170 C330,230 210,270 150,250 C80,228 20,280 60,330" fill="none" stroke="${SAND}" stroke-width="34" stroke-linecap="round"/></g>
    ${brushPatch(70, 82, 52, -12, GREEN, 4)}${brushPatch(232, 120, 44, 18, ORANGE, 7)}
    ${brushPatch(70, 316, 50, 8, ORANGE, 11)}${brushPatch(228, 310, 48, -16, GREEN, 9)}
    <g filter="url(#${id('lt')})">
      ${letter('L', 16, 148, 128, -8)}${letter('U', 166, 140, 118, 5)}${letter('D', 228, 156, 112, -4)}
      ${letter('K', 18, 372, 156, 4)}${letter('I', 126, 360, 150, -9)}${letter('D', 176, 384, 162, 6)}
    </g>
    <circle cx="128" cy="92" r="16" fill="${ORANGE}"/><circle cx="128" cy="92" r="3.5" fill="${NAVY}"/>
    <g fill="none" stroke="${NAVY}" stroke-width="1.5" filter="url(#${id('wb')})">${scrib}
      <path d="M150,58 q14,-18 22,-30" stroke-width="2.6" stroke-linecap="round"/></g>
    <text x="22" y="200" font-family="Lilita One" font-size="27" fill="${NAVY}" letter-spacing="1">VOLUME UP</text>
    ${['a kid with headphones on is a kid', 'in his own world. turn it up, sing', 'the words wrong, dance anyway.', 'the best track is the one you', 'play on repeat all summer.'].map((t, i) => `<text x="22" y="${214 + i * 9}" ${MONO} font-size="6.4" fill="${NAVY}">${t.toUpperCase()}</text>`).join('')}
    <g fill="none" stroke="${NAVY}" stroke-width="3" stroke-linecap="round" filter="url(#${id('wb')})">
      <path d="M232,236 v-40 l26,-8 v38"/><ellipse cx="226" cy="238" rx="8" ry="6"/><ellipse cx="252" cy="228" rx="8" ry="6"/></g>
  </g>`;
};

// 2. Player One Lounge — illustrated keychain bundle -------------------------------------
const lounge = ({ id }) => {
  const D = inkDrawing(id('k'));
  const T = (x, y, rot) => `transform="translate(${x} ${y}) rotate(${rot})"`;
  // carabiner
  D.shape('M-23,-55 a23,23 0 0 1 46,0 v110 a23,23 0 0 1 -46,0 Z M-13,-52 a13,13 0 0 1 26,0 v104 a13,13 0 0 1 -26,0 Z', '#2F5BD9',
    { extra: `${T(222, 82, 24)} fill-rule="evenodd"`, shade: [-5, 0, '#14287A', [122, -28, 200, 220]] });
  D.raw('', `<path d="M-18,-20 v50" ${T(222, 82, 24)} stroke="#E8ECF2" stroke-width="2.4"/><path d="M14,-40 v50" ${T(222, 82, 24)} stroke="#9FB4F0" stroke-width="1.6"/>`);
  // ring
  D.raw(`<circle cx="186" cy="152" r="17" fill="none" stroke="#C9CDD4" stroke-width="5"/>`, `<circle cx="186" cy="152" r="19.5" fill="none" stroke="#141414" stroke-width="2"/><circle cx="186" cy="152" r="14.5" fill="none" stroke="#141414" stroke-width="1.6"/>`);
  // chains
  const chain = (x0, y0, x1, y1) => {
    const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 8);
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t, a = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
      D.raw('', `<ellipse cx="${r2(x)}" cy="${r2(y)}" rx="${i % 2 ? 2.2 : 5}" ry="${i % 2 ? 4.4 : 3}" transform="rotate(${r2(a)} ${r2(x)} ${r2(y)})" fill="#D9DCE2" stroke="#141414" stroke-width="1.3"/>`);
    }
  };
  chain(176, 140, 104, 118); chain(198, 160, 244, 196); chain(238, 280, 252, 296);
  // motel-style tag
  const tag = 'M0,-92 L40,-62 L40,62 L0,92 L-40,62 L-40,-62 Z';
  D.shape(tag, '#D7F23A', { extra: T(124, 262, 28), shade: [-7, 4, '#7E9A12', [24, 152, 200, 220]] });
  D.shape('M0,-80 L33,-55 L33,55 L0,80 L-33,55 L-33,-55 Z', null, { extra: T(124, 262, 28), sw: 1.4 });
  D.raw(`<path d="${tag}" ${T(124, 262, 28)} fill="none" stroke="#2F5BD9" stroke-width="5"/>`, `<circle cx="0" cy="-70" r="6.5" ${T(124, 262, 28)} fill="#F7F6F2" stroke="#141414" stroke-width="1.6"/>`);
  D.raw('', `<path d="M148,190 C160,176 170,166 178,160" fill="none" stroke="#141414" stroke-width="2.2"/>`);
  D.raw(`<g ${T(124, 262, 28)}><g transform="rotate(-90)">
      <text x="-6" y="-14" text-anchor="middle" font-family="Lilita One" font-size="25" fill="#2F5BD9">PLAYER 1</text>
      <text x="-6" y="8" text-anchor="middle" font-family="Lilita One" font-size="21" fill="#2F5BD9">LOUNGE</text>
      <text x="-6" y="21" text-anchor="middle" font-family="Gochi Hand" font-size="11" fill="#2F5BD9">open till lights-out</text>
      <text x="-6" y="31" text-anchor="middle" font-family="Archivo" font-weight="900" font-size="5.4" fill="#2F5BD9">DO NOT DISTURB (I'M WINNING)</text>
    </g></g>`);
  // rubber strap
  D.shape('M-13,0 h26 v118 a13,13 0 0 1 -26,0 Z', '#FF4F8B', { extra: T(178, 172, -12), shade: [-5, 0, '#B11F58', [78, 62, 200, 220]] });
  D.raw(`<path d="M-13,86 h26 v32 a13,13 0 0 1 -26,0 Z" ${T(178, 172, -12)} fill="#FFD21F"/>`);
  D.raw(`<g ${T(178, 172, -12)}><text transform="translate(5 50) rotate(-90)" text-anchor="middle" font-family="Archivo" font-weight="900" font-size="10" fill="#FFD21F">PRESS START</text></g>`);
  // key
  D.shape('M0,-17 a17,17 0 1 1 -0.1,0 Z M0,-6 a6,6 0 1 0 0.1,0 Z', '#C9CDD4', { extra: `${T(214, 196, -18)} fill-rule="evenodd"`, shade: [-4, 0, '#7D838C', [114, 86, 200, 220]] });
  D.shape('M-6,15 h12 v70 l-6,6 l-6,-6 Z M6,46 h7 v7 h-7 M6,62 h9 v8 h-9', '#C9CDD4', { extra: T(214, 196, -18), shade: [-3, 0, '#7D838C', [114, 86, 200, 220]] });
  D.raw(`<text x="0" y="-8" text-anchor="middle" font-family="Archivo" font-weight="900" font-size="8" fill="#141414" ${T(214, 196, -18)}>B7</text>`);
  // dice
  D.shape('M0,-22 L22,-10 L0,2 L-22,-10 Z', '#FFFFFF', { extra: T(92, 112, -14) });
  D.shape('M-22,-10 L0,2 L0,28 L-22,16 Z', '#FFFFFF', { extra: T(92, 112, -14), shade: [6, 0, '#9AA0A8', [-8, 2, 200, 220]] });
  D.shape('M22,-10 L0,2 L0,28 L22,16 Z', '#E8E9EC', { extra: T(92, 112, -14), shade: [-14, 0, '#9AA0A8', [-8, 2, 200, 220]] });
  D.raw(`<g ${T(92, 112, -14)} fill="#141414"><ellipse cx="0" cy="-10" rx="3.2" ry="2"/><circle cx="-15" cy="2" r="2.2"/><circle cx="-6" cy="16" r="2.2"/><circle cx="7" cy="2" r="2.2"/><circle cx="15" cy="13" r="2.2"/></g>`);
  // star charm
  D.shape(star(0, 0, 5, 24, 11), '#FFD21F', { extra: T(254, 206, 14), shade: [-5, -2, '#C98F00', [154, 96, 200, 220]] });
  D.raw(`<text x="0" y="4" text-anchor="middle" font-family="Archivo" font-weight="900" font-size="9" fill="#E5322D" ${T(254, 206, 14)}>MVP</text>`);
  // cricket ball charm
  D.shape('M0,-20 a20,20 0 1 1 -0.1,0 Z', '#C8102E', { extra: T(260, 310, 0), shade: [-6, -2, '#6E0717', [146, 174, 200, 220]] });
  D.raw(`<path d="M-14,-14 C-4,-4 -4,4 -14,14" ${T(260, 310, 0)} fill="none" stroke="#F7F6F2" stroke-width="1.8" stroke-dasharray="2.5 2"/><path d="M-9,-17 C2,-6 2,6 -9,17" ${T(260, 310, 0)} fill="none" stroke="#F7F6F2" stroke-width="1.8" stroke-dasharray="2.5 2"/>`,
    `<ellipse cx="267" cy="301" rx="4" ry="2" fill="#FFFFFF" transform="rotate(-30 267 301)"/>`);
  // sparkles
  [[66, 150, 9], [268, 52, 8], [166, 108, 7], [280, 244, 7], [60, 318, 6]].forEach(([x, y, r]) => D.shape(sparkle(x, y, r), '#FFFFFF', { sw: 1.6 }));
  return `
  <defs>${grain(id('gr'), 0.1)}</defs>
  <g filter="url(#${id('gr')})">${D.render()}
    <text x="150" y="370" text-anchor="middle" font-family="Archivo" font-weight="900" font-size="7.6" fill="#141414">RETURN TO THE NEAREST ARCADE IF FOUND (OR KEEP PLAYING)</text>
    <text x="150" y="380" text-anchor="middle" font-family="Archivo" font-weight="900" font-size="7.6" fill="#141414">PROPERTY OF PLAYER ONE · NO REFUNDS ON HIGH SCORES</text>
  </g>`;
};

const item = (ref, name, colour, svg, inks) => ({ ref, name, colour, art: { front: { svg, size: SIZE, inks } } });

export default {
  id: 'c17-studio-ink',
  code: 'BOYS · 30–36 · OVERSIZED BACK · SAMPLES',
  title: 'STUDIO INK',
  technique: 'SCREEN / DTF',
  subtitle: 'illustrated screen-print finish — samples for approval',
  layout: 'single',
  countInks: true,
  items: [
    item('SK-01', 'Loud Kid', { name: 'White', hex: '#F7F6F2' }, loudKid, [I('Navy', NAVY), I('Green', GREEN), I('Orange', ORANGE), I('Sand', SAND)]),
    item('SK-02', 'Player One Lounge', { name: 'White', hex: '#F7F6F2' }, lounge, [{ name: 'DTF', hex: 'conic-gradient(#00c2ff,#ff3da8,#ffe600,#00c2ff)' }]),
  ],
};
