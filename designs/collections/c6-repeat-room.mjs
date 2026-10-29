// Collection 6 — REPEAT ROOM: seamless all-over-print (AOP) repeat tiles.
// Every motif is drawn at its position plus the eight wrapped neighbours, so
// the 300 x 300 tile repeats without visible seams.
import { contours } from 'd3-contour';
import { createNoise4D } from 'simplex-noise';
import { star, sparkle, r2 } from '../lib/svg.mjs';

const T = 300;
const INK = {
  lilac: { name: 'Lilac', hex: '#B79CFF' },
  butter: { name: 'Butter', hex: '#FFE7A3' },
  sky: { name: 'Sky', hex: '#8FD3FF' },
  white: { name: 'White', hex: '#FFFFFF' },
  forest: { name: 'Forest', hex: '#1E3A2B' },
  tomato: { name: 'Tomato', hex: '#FF4B2B' },
  cream: { name: 'Cream', hex: '#FFF1D6' },
  pink: { name: 'Bubblegum', hex: '#FF8FB8' },
};

function rng(seed) {
  return () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
}
const wrap = (draw) => [-T, 0, T].flatMap((dx) => [-T, 0, T].map((dy) => `<g transform="translate(${dx} ${dy})">${draw()}</g>`)).join('');
// Poisson-ish scatter on the torus: rejects points closer than `gap`.
function scatter(count, gap, seed) {
  const r = rng(seed), pts = [];
  for (let tries = 0; pts.length < count && tries < 5000; tries++) {
    const p = [r() * T, r() * T];
    const ok = pts.every(([x, y]) => {
      const dx = Math.min(Math.abs(x - p[0]), T - Math.abs(x - p[0])), dy = Math.min(Math.abs(y - p[1]), T - Math.abs(y - p[1]));
      return Math.hypot(dx, dy) > gap;
    });
    if (ok) pts.push([...p, r(), r()]);
  }
  return pts;
}

// 1. Warped checkerboard — periodic sine warp keeps it seamless.
const checkmate = () => {
  const n = 8, c = T / n;
  const warp = ([x, y]) => [x + 9 * Math.sin((2 * Math.PI * y) / T), y + 9 * Math.sin((2 * Math.PI * x) / T * 2)];
  const cells = [];
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++) {
      if ((i + j) % 2) continue;
      const pts = [];
      const edge = (a, b) => { for (let k = 0; k < 8; k++) pts.push(warp([a[0] + ((b[0] - a[0]) * k) / 8, a[1] + ((b[1] - a[1]) * k) / 8])); };
      const [x, y] = [i * c, j * c];
      edge([x, y], [x + c, y]); edge([x + c, y], [x + c, y + c]); edge([x + c, y + c], [x, y + c]); edge([x, y + c], [x, y]);
      cells.push(`M${pts.map(([a, b]) => `${r2(a)},${r2(b)}`).join('L')}Z`);
    }
  return wrap(() => `<path d="${cells.join('')}" fill="${INK.lilac.hex}"/>`);
};

// 2. Stardust — sparkles, stars and dots.
const STARDUST = scatter(26, 34, 21);
const stardust = () => wrap(() => STARDUST.map(([x, y, a, b], i) => {
  if (i % 3 === 0) return `<path d="${sparkle(x, y, 9 + a * 7)}" fill="${INK.butter.hex}"/>`;
  if (i % 3 === 1) return `<path d="${star(x, y, 5, 7 + a * 3, 3)}" fill="${INK.sky.hex}" transform="rotate(${r2(b * 70)} ${r2(x)} ${r2(y)})"/>`;
  return `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(2 + a * 2)}" fill="${INK.white.hex}"/>`;
}).join(''));

// 3. Dino stomp — three-toed footprints walking in pairs, plus leaves.
const foot = (x, y, deg, fill) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${r2(deg)})" fill="${fill}">
  <ellipse cx="0" cy="8" rx="9" ry="10"/><path d="M-8,2 Q-14,-8 -19,-20 Q-9,-12 -3,-2 Z M-3,-1 Q-2,-14 0,-26 Q2,-14 3,-1 Z M3,-2 Q9,-12 19,-20 Q14,-8 8,2 Z" stroke="${fill}" stroke-width="3" stroke-linejoin="round"/></g>`;
const leaf = (x, y, deg, fill) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${r2(deg)})"><path d="M0,-14 C10,-6 10,6 0,14 C-10,6 -10,-6 0,-14Z" fill="${fill}"/><path d="M0,-12 L0,14" stroke="#BFE6D1" stroke-width="1.4"/></g>`;
const STOMPS = scatter(6, 100, 17);
const LEAVES = scatter(14, 40, 23).filter(([x, y]) => STOMPS.every(([sx, sy]) => Math.hypot(sx - x, sy - y) > 48)).slice(0, 7);
const dinoStomp = () => wrap(() =>
  STOMPS.map(([x, y, a]) => {
    const d = a * 360, t = (d * Math.PI) / 180;
    const ox = 15 * Math.cos(t), oy = 15 * Math.sin(t), fx = 22 * Math.sin(t), fy = -22 * Math.cos(t);
    return foot(x - ox - fx / 2, y - oy - fy / 2, d, INK.forest.hex) + foot(x + ox + fx / 2, y + oy + fy / 2, d, INK.forest.hex);
  }).join('') +
  LEAVES.map(([x, y, a], i) => leaf(x, y, a * 180 - 90, i % 3 ? INK.tomato.hex : INK.forest.hex)).join(''));

// 4. Orbit — tiny planets, rockets and stars.
const ORBIT = scatter(14, 60, 9);
const planet = (x, y, s, a, b) => `<g transform="translate(${r2(x)} ${r2(y)}) scale(${s}) rotate(-20)">
  <circle r="11" fill="${a}"/><ellipse rx="19" ry="5" fill="none" stroke="${b}" stroke-width="2.4"/></g>`;
const rocket = (x, y, deg) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${r2(deg)})">
  <path d="M-5,4 L-10,14 L-5,12 Z M5,4 L10,14 L5,12 Z" fill="${INK.tomato.hex}"/>
  <path d="M0,-16 C7,-10 7,4 5,12 L-5,12 C-7,4 -7,-10 0,-16Z" fill="${INK.cream.hex}"/>
  <circle cy="-3" r="2.6" fill="${INK.sky.hex}"/><path d="M-3,13 Q0,24 3,13Z" fill="${INK.tomato.hex}"/></g>`;
const orbit = () => wrap(() => ORBIT.map(([x, y, a, b], i) => {
  if (i % 3 === 0) return planet(x, y, 0.9 + a * 0.5, INK.tomato.hex, INK.cream.hex);
  if (i % 3 === 1) return rocket(x, y, a * 360);
  return `<path d="${sparkle(x, y, 6 + a * 5)}" fill="${INK.sky.hex}"/>`;
}).join('') + scatter(30, 20, 77).map(([x, y]) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="1.4" fill="${INK.cream.hex}"/>`).join(''));

// 5. Cherry pop — tossed cherry pairs.
const CHERRIES = scatter(10, 78, 31);
const cherry = (x, y, deg) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${r2(deg)})">
  <path d="M-10,8 Q-6,-14 4,-22 M12,6 Q8,-10 4,-22" fill="none" stroke="${INK.forest.hex}" stroke-width="2.6" stroke-linecap="round"/>
  <path d="M4,-22 q12,-10 22,-2 q-12,8 -22,2z" fill="${INK.forest.hex}"/>
  <circle cx="-10" cy="14" r="10" fill="${INK.tomato.hex}"/><circle cx="13" cy="12" r="10" fill="${INK.tomato.hex}"/>
  <circle cx="-13" cy="10" r="2.6" fill="#FFFFFF" opacity=".9"/><circle cx="10" cy="8" r="2.6" fill="#FFFFFF" opacity=".9"/></g>`;
const cherryPop = () => wrap(() => CHERRIES.map(([x, y, a]) => cherry(x, y, a * 120 - 60)).join('') +
  scatter(16, 40, 5).map(([x, y]) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="3" fill="${INK.pink.hex}"/>`).join(''));

// 6. Topo — contour lines from noise sampled on a torus (seamless).
function topoTile() {
  let s = 13;
  const noise = createNoise4D(() => ((s = (s * 16807) % 2147483647) / 2147483647));
  const n = 100, R = 0.55, pad = 12;
  const sample = (i, j) => {
    const a = (i / n) * 2 * Math.PI, b = (j / n) * 2 * Math.PI;
    return noise(R * Math.cos(a), R * Math.sin(a), R * Math.cos(b), R * Math.sin(b)) + 0.35 * noise(2.2 * R * Math.cos(a) + 5, 2.2 * R * Math.sin(a), 2.2 * R * Math.cos(b), 2.2 * R * Math.sin(b));
  };
  // Sample past the tile edge (the noise is periodic) and clip later, so contour
  // rings never close along the tile border and the repeat stays seamless.
  const m = n + pad * 2, values = new Float64Array(m * m);
  for (let j = 0; j < m; j++) for (let i = 0; i < m; i++) values[j * m + i] = sample(i - pad, j - pad);
  const k = T / n;
  return contours().size([m, m]).thresholds(Array.from({ length: 11 }, (_, i) => -1.0 + i * 0.2))(values)
    .map((lvl, i) => ({ major: i % 4 === 1, d: lvl.coordinates.flatMap((poly) => poly.map((ring) => `M${ring.map(([x, y]) => `${r2((x - pad) * k)},${r2((y - pad) * k)}`).join('L')}Z`)).join('') }));
}
const TOPO = topoTile();
const topo = ({ id }) => `<defs><clipPath id="${id('t')}"><rect width="${T}" height="${T}"/></clipPath></defs>
  <g clip-path="url(#${id('t')})">${TOPO.map((c) => `<path d="${c.d}" fill="none" stroke="${c.major ? INK.butter.hex : INK.cream.hex}" stroke-width="${c.major ? 1.8 : 0.9}"/>`).join('')}</g>`;

const tile = (svg, inks) => ({ tile: { svg, size: [T, T], inks, preview: 0.5 } });

export default {
  id: 'c6-repeat-room',
  code: 'C6',
  title: 'REPEAT ROOM',
  technique: 'ALL-OVER PRINT (AOP)',
  subtitle: 'seamless repeats for sublimation / rotary',
  layout: 'aop',
  countInks: true,
  footer: 'Tiles repeat seamlessly; repeat size to be set with the printer.',
  items: [
    { ref: 'RR-01', name: 'Checkmate', colour: { name: 'Butter', hex: '#F6E7A1' }, art: tile(checkmate, [INK.lilac]) },
    { ref: 'RR-02', name: 'Stardust', colour: { name: 'Ink Navy', hex: '#1C2340' }, art: tile(stardust, [INK.butter, INK.sky, INK.white]) },
    { ref: 'RR-03', name: 'Dino Stomp', colour: { name: 'Mint', hex: '#BFE6D1' }, art: tile(dinoStomp, [INK.forest, INK.tomato]) },
    { ref: 'RR-04', name: 'Orbit', colour: { name: 'Jet Black', hex: '#141414' }, art: tile(orbit, [INK.cream, INK.tomato, INK.sky]) },
    { ref: 'RR-05', name: 'Cherry Pop', colour: { name: 'Off White', hex: '#F1EDE4' }, art: tile(cherryPop, [INK.tomato, INK.forest, INK.pink]) },
    { ref: 'RR-06', name: 'Topo', colour: { name: 'Forest', hex: '#2F4A3A' }, art: tile(topo, [INK.cream, INK.butter]) },
  ],
};
