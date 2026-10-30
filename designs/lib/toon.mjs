// Cartoon drawing helpers: thick outlined "sticker" style characters.
// A layer draws every part's outline first (fat stroke in the outline ink),
// then every fill, so touching parts in one layer merge into one silhouette.
// Later layers get their own outline, which separates overlapping parts.

const attrs = (o) => Object.entries(o).map(([k, v]) => `${k}="${v}"`).join(' ');

export const C = (cx, cy, r, fill) => ({ tag: 'circle', a: { cx, cy, r }, fill });
export const E = (cx, cy, rx, ry, fill, rot = 0) => ({ tag: 'ellipse', a: { cx, cy, rx, ry, ...(rot ? { transform: `rotate(${rot} ${cx} ${cy})` } : {}) }, fill });
export const R = (x, y, width, height, rx, fill, rot = 0) => ({ tag: 'rect', a: { x, y, width, height, rx, ...(rot ? { transform: `rotate(${rot} ${x + width / 2} ${y + height / 2})` } : {}) }, fill });
export const P = (d, fill) => ({ tag: 'path', a: { d }, fill });
// Stroke-only limb/line of a given thickness.
export const S = (d, width, colour) => ({ tag: 'path', a: { d }, stroke: colour, width });

function element(part, mode, outline, ow) {
  if (part.stroke) {
    const w = mode === 'outline' ? part.width + ow * 2 : part.width;
    const c = mode === 'outline' ? outline : part.stroke;
    return `<${part.tag} ${attrs(part.a)} fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  if (mode === 'outline') return `<${part.tag} ${attrs(part.a)} fill="${outline}" stroke="${outline}" stroke-width="${ow * 2}" stroke-linejoin="round"/>`;
  return `<${part.tag} ${attrs(part.a)} fill="${part.fill}"/>`;
}

export function layer(parts, outline, ow = 3.5) {
  return parts.map((p) => element(p, 'outline', outline, ow)).join('') + parts.map((p) => element(p, 'fill', outline, ow)).join('');
}

// Wraps artwork in a mask so `holes` (SVG shapes) knock through to the garment.
export function knockout(id, body, holes, w = 300, h = 380) {
  return `<mask id="${id}" maskUnits="userSpaceOnUse" x="-20" y="-20" width="${w + 40}" height="${h + 40}">
    <rect x="-20" y="-20" width="${w + 40}" height="${h + 40}" fill="#fff"/><g fill="#000" stroke="#000">${holes}</g></mask>
    <g mask="url(#${id})">${body}</g>`;
}
