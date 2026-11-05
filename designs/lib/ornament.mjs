// Ornament kit for carpet / bandana / lace style prints: rosettes, paisleys, vines and
// border bands, plus SVG filters that tear and wear the print like old fabric.
// Every motif takes a colour `c`, so it can draw ink or knock-outs (mask black).
import { r2 } from './svg.mjs';

const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const pol = (cx, cy, r, a) => [r2(cx + r * Math.cos(a)), r2(cy + r * Math.sin(a))];

// Layered flower medallion.
export function rosette(cx, cy, r, c, { petals = 8, layers = 3 } = {}) {
  let out = '';
  for (let L = 0; L < layers; L++) {
    const rr = r * (1 - L * 0.28), n = petals + L * 4, off = (L % 2) * (Math.PI / n);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + off;
      const [px, py] = pol(cx, cy, rr * 0.62, a);
      out += `<ellipse cx="${px}" cy="${py}" rx="${r2(rr * 0.36)}" ry="${r2(rr * 0.14)}" transform="rotate(${r2((a * 180) / Math.PI)} ${px} ${py})" fill="none" stroke="${c}" stroke-width="${r2(r * 0.045)}"/>`;
    }
  }
  for (let i = 0; i < petals * 2; i++) {
    const [px, py] = pol(cx, cy, r * 1.04, (i / (petals * 2)) * Math.PI * 2);
    out += `<circle cx="${px}" cy="${py}" r="${r2(r * 0.045)}" fill="${c}"/>`;
  }
  out += `<circle cx="${cx}" cy="${cy}" r="${r2(r * 0.2)}" fill="none" stroke="${c}" stroke-width="${r2(r * 0.05)}"/><circle cx="${cx}" cy="${cy}" r="${r2(r * 0.08)}" fill="${c}"/>`;
  return out;
}

// Paisley (boteh) with nested outlines and a dotted rim.
export function paisley(cx, cy, s, rot, c) {
  const d = 'M0,40 C-28,40 -34,6 -18,-12 C-6,-26 10,-30 14,-46 C26,-24 30,6 18,26 C12,36 6,40 0,40 Z';
  let out = `<g transform="translate(${cx} ${cy}) rotate(${rot}) scale(${s / 40})">`;
  out += `<path d="${d}" fill="none" stroke="${c}" stroke-width="3"/>`;
  out += `<path d="${d}" transform="translate(0 6) scale(0.7)" fill="none" stroke="${c}" stroke-width="2.4"/>`;
  out += `<path d="${d}" transform="translate(0 11) scale(0.42)" fill="${c}"/>`;
  for (let i = 0; i < 14; i++) {
    const t = i / 14, a = -1.2 + t * 4.6;
    out += `<circle cx="${r2(Math.cos(a) * 30)}" cy="${r2(8 + Math.sin(a) * 36)}" r="1.6" fill="${c}"/>`;
  }
  return out + '</g>';
}

// Wavy vine with alternating leaves.
export function vine(x0, y0, x1, y1, c, { amp = 6, waves = 3, w = 1.6 } = {}) {
  const n = 60, pts = [];
  const len = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / len, uy = (y1 - y0) / len;
  let leaves = '';
  for (let i = 0; i <= n; i++) {
    const t = i / n, o = amp * Math.sin(t * Math.PI * 2 * waves);
    const x = x0 + (x1 - x0) * t - uy * o, y = y0 + (y1 - y0) * t + ux * o;
    pts.push(`${r2(x)},${r2(y)}`);
    if (i % 5 === 2) {
      const side = (i / 5) % 2 ? 1 : -1, ang = (Math.atan2(uy, ux) * 180) / Math.PI + side * 50;
      leaves += `<ellipse cx="${r2(x)}" cy="${r2(y)}" rx="${amp * 0.9}" ry="${amp * 0.38}" transform="rotate(${r2(ang)} ${r2(x)} ${r2(y)}) translate(${amp * 0.8} 0)" fill="${c}"/>`;
    }
  }
  return `<polyline points="${pts.join(' ')}" fill="none" stroke="${c}" stroke-width="${w}"/>${leaves}`;
}

// Repeating border band of small motifs between two rules.
export function band(x, y, w, h, c, vertical = false) {
  const len = vertical ? h : w, th = vertical ? w : h, n = Math.max(2, Math.round(len / (th * 1.1)));
  const step = len / n;
  let out = vertical
    ? `<rect x="${x}" y="${y}" width="${r2(th * 0.08)}" height="${h}" fill="${c}"/><rect x="${r2(x + th * 0.92)}" y="${y}" width="${r2(th * 0.08)}" height="${h}" fill="${c}"/>`
    : `<rect x="${x}" y="${y}" width="${w}" height="${r2(th * 0.08)}" fill="${c}"/><rect x="${x}" y="${r2(y + th * 0.92)}" width="${w}" height="${r2(th * 0.08)}" fill="${c}"/>`;
  for (let i = 0; i < n; i++) {
    const cx = vertical ? x + th / 2 : x + step * (i + 0.5), cy = vertical ? y + step * (i + 0.5) : y + th / 2;
    out += i % 2 ? rosette(cx, cy, th * 0.3, c, { petals: 6, layers: 2 })
      : `<path d="M${cx},${r2(cy - th * 0.34)} L${r2(cx + th * 0.26)},${cy} L${cx},${r2(cy + th * 0.34)} L${r2(cx - th * 0.26)},${cy} Z" fill="none" stroke="${c}" stroke-width="${r2(th * 0.06)}"/><circle cx="${cx}" cy="${cy}" r="${r2(th * 0.08)}" fill="${c}"/>`;
    const mx = vertical ? cx : cx + step / 2, my = vertical ? cy + step / 2 : cy;
    if (i < n - 1) out += `<circle cx="${r2(mx)}" cy="${r2(my)}" r="${r2(th * 0.05)}" fill="${c}"/>`;
  }
  return out;
}

// Full carpet / bandana panel: frames, border bands, central medallion, corner pieces, field motifs.
export function carpet(x, y, w, h, c, seed = 3) {
  const R = rng(seed);
  const b = Math.min(w, h) * 0.11;
  let out = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${c}" stroke-width="${r2(b * 0.12)}"/>`;
  const ix = x + b * 0.3, iy = y + b * 0.3, iw = w - b * 0.6, ih = h - b * 0.6;
  out += band(ix, iy, iw, b, c) + band(ix, iy + ih - b, iw, b, c) + band(ix, iy + b, b, ih - 2 * b, c, true) + band(ix + iw - b, iy + b, b, ih - 2 * b, c, true);
  const fx = ix + b * 1.25, fy = iy + b * 1.25, fw = iw - b * 2.5, fh = ih - b * 2.5;
  out += `<rect x="${r2(fx)}" y="${r2(fy)}" width="${r2(fw)}" height="${r2(fh)}" fill="none" stroke="${c}" stroke-width="${r2(b * 0.06)}"/>`;
  const mr = Math.min(fw, fh) * 0.26;
  out += rosette(fx + fw / 2, fy + fh / 2, mr, c, { petals: 10, layers: 3 });
  out += `<path d="M${r2(fx + fw / 2)},${r2(fy + fh / 2 - mr * 1.7)} L${r2(fx + fw / 2 + mr * 1.3)},${r2(fy + fh / 2)} L${r2(fx + fw / 2)},${r2(fy + fh / 2 + mr * 1.7)} L${r2(fx + fw / 2 - mr * 1.3)},${r2(fy + fh / 2)} Z" fill="none" stroke="${c}" stroke-width="${r2(b * 0.06)}"/>`;
  [[fx, fy, 0], [fx + fw, fy, 90], [fx + fw, fy + fh, 180], [fx, fy + fh, 270]].forEach(([cx, cy, rot]) => {
    out += `<g transform="rotate(${rot} ${r2(cx)} ${r2(cy)})"><path d="M${r2(cx)},${r2(cy)} h${r2(mr)} a${r2(mr)},${r2(mr)} 0 0 1 ${r2(-mr)},${r2(mr)} Z" fill="none" stroke="${c}" stroke-width="${r2(b * 0.06)}"/></g>`;
    out += paisley(cx + (rot === 0 || rot === 270 ? 1 : -1) * mr * 0.9, cy + (rot < 180 ? 1 : -1) * mr * 0.9, mr * 0.55, rot + 45, c);
  });
  for (let i = 0; i < 26; i++) {
    const px = fx + R() * fw, py = fy + R() * fh;
    if (Math.hypot(px - fx - fw / 2, py - fy - fh / 2) < mr * 1.5) continue;
    out += R() > 0.5 ? rosette(px, py, b * 0.22, c, { petals: 5, layers: 1 }) : `<circle cx="${r2(px)}" cy="${r2(py)}" r="${r2(b * 0.05)}" fill="${c}"/>`;
  }
  out += vine(fx + mr * 0.4, fy + fh * 0.5, fx + fw / 2 - mr * 1.4, fy + fh * 0.5, c, { amp: b * 0.12, waves: 2, w: b * 0.04 });
  out += vine(fx + fw / 2 + mr * 1.4, fy + fh * 0.5, fx + fw - mr * 0.4, fy + fh * 0.5, c, { amp: b * 0.12, waves: 2, w: b * 0.04 });
  return out;
}

// Filters ---------------------------------------------------------------------
// Fine wear: knocks small specks and scratches out of the ink.
export const wear = (id, { freq = 1.2, amount = 0.32, seed = 2 } = {}) => `
  <filter id="${id}" x="-5%" y="-5%" width="110%" height="110%">
    <feTurbulence type="fractalNoise" baseFrequency="${freq} ${freq * 0.6}" numOctaves="3" seed="${seed}"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0"/>
    <feComponentTransfer><feFuncA type="linear" slope="8" intercept="${-8 * amount + 0.2}"/></feComponentTransfer>
    <feComposite in="SourceGraphic" operator="in"/>
  </filter>`;
// Torn edge: displaces a shape's outline like ripped paper / cloth.
export const torn = (id, scale = 14, seed = 4) => `
  <filter id="${id}" x="-15%" y="-15%" width="130%" height="130%">
    <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="4" seed="${seed}" result="big"/>
    <feDisplacementMap in="SourceGraphic" in2="big" scale="${scale}" result="d1"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.4" numOctaves="2" seed="${seed + 1}" result="fine"/>
    <feDisplacementMap in="d1" in2="fine" scale="${scale * 0.25}"/>
  </filter>`;
