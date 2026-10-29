// Small SVG drawing helpers shared by the print collections.

export const r2 = (n) => Math.round(n * 100) / 100;

// Star / burst polygon.
export function star(cx, cy, points, outer, inner, rotate = -90) {
  const pts = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 ? inner : outer;
    const a = ((rotate + (i * 180) / points) * Math.PI) / 180;
    pts.push(`${r2(cx + r * Math.cos(a))},${r2(cy + r * Math.sin(a))}`);
  }
  return `M${pts.join('L')}Z`;
}

// Four-point sparkle.
export function sparkle(cx, cy, r, waist = 0.18) {
  const w = r * waist;
  return `M${cx},${cy - r} Q${cx + w},${cy - w} ${cx + r},${cy} Q${cx + w},${cy + w} ${cx},${cy + r} Q${cx - w},${cy + w} ${cx - r},${cy} Q${cx - w},${cy - w} ${cx},${cy - r}Z`;
}

// Horizontal sine path, used with <textPath> for wavy type.
export function wave(x0, x1, y, amp, length, phase = 0) {
  let d = '';
  for (let x = x0; x <= x1; x += 2) {
    const yy = y + amp * Math.sin(((x - x0) / length) * Math.PI * 2 + phase);
    d += `${d ? 'L' : 'M'}${r2(x)},${r2(yy)}`;
  }
  return d;
}

// Circular arc path (degrees, 0 = 3 o'clock, clockwise) for text on a circle.
export function arc(cx, cy, r, startDeg, endDeg) {
  const p = (deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)].map(r2);
  const [x0, y0] = p(startDeg);
  const [x1, y1] = p(endDeg);
  const large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  const sweep = endDeg > startDeg ? 1 : 0;
  return `M${x0},${y0} A${r},${r} 0 ${large} ${sweep} ${x1},${y1}`;
}

// Printable halftone: a grid of dots whose radius comes from `tone(x, y)` (0..1).
// Dots are plain circles in a single ink, so this separates cleanly for screen print.
export function halftone({ x, y, w, h, cell, fill, tone, angle = 45, clip = '' }) {
  const out = [];
  const cx = x + w / 2;
  const cy = y + h / 2;
  const rad = (angle * Math.PI) / 180;
  const span = Math.hypot(w, h) / 2 + cell;
  for (let u = -span; u <= span; u += cell)
    for (let v = -span; v <= span; v += cell) {
      const px = cx + u * Math.cos(rad) - v * Math.sin(rad);
      const py = cy + u * Math.sin(rad) + v * Math.cos(rad);
      if (px < x - cell || px > x + w + cell || py < y - cell || py > y + h + cell) continue;
      const t = Math.max(0, Math.min(1, tone(px, py)));
      const r = (cell / 2) * 1.15 * Math.sqrt(t);
      if (r > cell * 0.06) out.push(`<circle cx="${r2(px)}" cy="${r2(py)}" r="${r2(r)}"/>`);
    }
  return `<g fill="${fill}"${clip ? ` clip-path="url(#${clip})"` : ''}>${out.join('')}</g>`;
}

// Worn-ink texture: knocks small specks out of whatever it is applied to.
export function gritFilter(id, { freq = 0.55, amount = 0.35, seed = 4 } = {}) {
  const cut = 1 - amount;
  return `<filter id="${id}" x="-5%" y="-5%" width="110%" height="110%">
    <feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="2" seed="${seed}" result="noise"/>
    <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1 1.25" result="a"/>
    <feComponentTransfer in="a" result="mask"><feFuncA type="discrete" tableValues="0 ${cut > 0.5 ? '1 1 1' : '0 1 1'}"/></feComponentTransfer>
    <feComposite in="SourceGraphic" in2="mask" operator="in"/>
  </filter>`;
}

// Pixel-art helper: '#' cells become squares.
export function pixels(rows, size, x0, y0, fill, char = '#') {
  return rows
    .flatMap((row, r) => [...row].map((c, i) => (c === char ? `<rect x="${x0 + i * size}" y="${y0 + r * size}" width="${size + 0.05}" height="${size + 0.05}" fill="${fill}"/>` : '')))
    .join('');
}

export const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
