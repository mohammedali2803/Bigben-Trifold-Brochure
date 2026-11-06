// Helpers for the "Pin Board" collections (founder's Pinterest references, Nov 2026):
// organic blobs, airbrush spray, scribble hatching, ransom-note collage, paint patches.
import { r2 } from './svg.mjs';

export const rnd = (seed) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

// Tapered brush swipe along a quadratic curve.
export function taper([x0, y0], [cx, cy], [x1, y1], width, { head = 0.4, tail = 1.3 } = {}) {
  const n = 40, left = [], right = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = (1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * x1;
    const y = (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t * t * y1;
    const dx = 2 * (1 - t) * (cx - x0) + 2 * t * (x1 - cx), dy = 2 * (1 - t) * (cy - y0) + 2 * t * (y1 - cy);
    const len = Math.hypot(dx, dy) || 1;
    const w = (width / 2) * Math.sin(Math.PI * t) ** (t < 0.5 ? head : tail);
    left.push(`${r2(x - (dy / len) * w)},${r2(y + (dx / len) * w)}`);
    right.unshift(`${r2(x + (dy / len) * w)},${r2(y - (dx / len) * w)}`);
  }
  return `M${left.join('L')}L${right.join('L')}Z`;
}

// Dry-brush edge roughening.
export const rough = (id, scale = 5, freq = 0.07, seed = 5) => `
  <filter id="${id}" x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="3" seed="${seed}"/>
    <feDisplacementMap in="SourceGraphic" scale="${scale}"/></filter>`;

// Organic liquid blobs: thresholded low-frequency noise, flooded with one colour.
export const blobs = (id, { freq = 0.012, seed = 3, cut = 0.5, colour }) => `
  <filter id="${id}" x="0" y="0" width="100%" height="100%" filterUnits="userSpaceOnUse">
    <feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="2" seed="${seed}"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0"/>
    <feComponentTransfer><feFuncA type="linear" slope="40" intercept="${-40 * cut}"/></feComponentTransfer>
    <feFlood flood-color="${colour}"/><feComposite in2="SourceAlpha" operator="atop"/>
    <feComposite in2="SourceGraphic" operator="in"/>
  </filter>`;
// Applies the blob filter over a rect.
export const blobField = (id, x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#000" filter="url(#${id})"/>`;

// Mask that keeps only blob areas (white = keep), for cutting type.
export const blobMask = (id, { freq = 0.012, seed = 3, cut = 0.5, invert = false }, w = 300, h = 400) => `
  <filter id="${id}-f" x="0" y="0" width="${w}" height="${h}" filterUnits="userSpaceOnUse">
    <feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="2" seed="${seed}"/>
    <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  ${invert ? -1 : 1} 0 0 0 ${invert ? 1 : 0}"/>
    <feComponentTransfer><feFuncA type="linear" slope="40" intercept="${-40 * cut}"/></feComponentTransfer></filter>
  <mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="#fff" filter="url(#${id}-f)"/></mask>`;

// Airbrush spray: soft blur + speckle, like a spray-painted tag.
export const spray = (id, blur = 3.2, seed = 4) => `
  <filter id="${id}" x="-15%" y="-15%" width="130%" height="130%">
    <feGaussianBlur stdDeviation="${blur}" result="b"/>
    <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed="${seed}" result="n"/>
    <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.6 1.5" result="speck"/>
    <feComposite in="b" in2="speck" operator="in"/></filter>`;

// Fine worn texture (knocks specks out of ink).
export const wear = (id, amount = 0.25, seed = 2) => `
  <filter id="${id}" x="-5%" y="-5%" width="110%" height="110%">
    <feTurbulence type="fractalNoise" baseFrequency="1.1 0.7" numOctaves="3" seed="${seed}"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0"/>
    <feComponentTransfer><feFuncA type="linear" slope="8" intercept="${-8 * amount + 0.2}"/></feComponentTransfer>
    <feComposite in="SourceGraphic" operator="in"/></filter>`;

// Scribble hatch lines clipped to a shape id (pen-scribble fill like a sketched globe).
export function hatch(clipId, x, y, w, h, colour, { gap = 3.2, angle = -32, width = 1.6, seed = 9 } = {}) {
  const R = rnd(seed), rad = (angle * Math.PI) / 180, span = Math.hypot(w, h);
  let d = '';
  for (let o = -span; o < span; o += gap) {
    const wob = (R() - 0.5) * gap * 0.8;
    const cx = x + w / 2 + Math.sin(rad) * (o + wob), cy = y + h / 2 - Math.cos(rad) * (o + wob);
    d += `M${r2(cx - Math.cos(rad) * span)},${r2(cy - Math.sin(rad) * span)}L${r2(cx + Math.cos(rad) * span)},${r2(cy + Math.sin(rad) * span)}`;
  }
  return `<path d="${d}" stroke="${colour}" stroke-width="${width}" clip-path="url(#${clipId})"/>`;
}

// Fake newsprint lines for collage scraps.
export const newsLines = (x, y, w, h, c, seed = 1) => {
  const R = rnd(seed);
  let out = '';
  for (let yy = y + 3; yy < y + h - 2; yy += 3.2) {
    let xx = x + 2;
    while (xx < x + w - 4) { const ww = 2 + R() * 9; out += `<rect x="${r2(xx)}" y="${r2(yy)}" width="${r2(Math.min(ww, x + w - 2 - xx))}" height="1.2" fill="${c}"/>`; xx += ww + 1.4; }
  }
  return out;
};

// Rough irregular quad (torn paper scrap).
export const scrap = (x, y, w, h, seed = 1, j = 3) => {
  const R = rnd(seed), p = (a, b) => `${r2(a + (R() - 0.5) * j)},${r2(b + (R() - 0.5) * j)}`;
  const pts = [];
  for (let i = 0; i <= 6; i++) pts.push(p(x + (w * i) / 6, y));
  for (let i = 1; i <= 4; i++) pts.push(p(x + w, y + (h * i) / 4));
  for (let i = 5; i >= 0; i--) pts.push(p(x + (w * i) / 6, y + h));
  for (let i = 3; i >= 1; i--) pts.push(p(x, y + (h * i) / 4));
  return `M${pts.join('L')}Z`;
};

// Soft paint patch blob for painted-letter prints.
export function patch(cx, cy, r, seed = 1) {
  const R = rnd(seed), n = 14, pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, rr = r * (0.7 + R() * 0.45);
    pts.push([cx + rr * Math.cos(a) * 1.25, cy + rr * Math.sin(a)]);
  }
  let d = `M${r2((pts[0][0] + pts[n - 1][0]) / 2)},${r2((pts[0][1] + pts[n - 1][1]) / 2)}`;
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % n];
    d += `Q${r2(a[0])},${r2(a[1])} ${r2((a[0] + b[0]) / 2)},${r2((a[1] + b[1]) / 2)}`;
  }
  return d + 'Z';
}
