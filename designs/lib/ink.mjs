import { halftone } from './svg.mjs';

// "Designer / screen-print" finish kit: hand-inked wobble, dry-brush bristle streaks,
// misregistered fill layers, comic halftone shading and ink grain. Used instead of
// clean vector output so prints read as illustrated, not computer-generated.

// Wobble: small displacement so lines look hand-inked.
export const wobble = (id, scale = 2.2, freq = 0.035, seed = 3) => `
  <filter id="${id}" x="-5%" y="-5%" width="110%" height="110%">
    <feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="2" seed="${seed}"/>
    <feDisplacementMap in="SourceGraphic" scale="${scale}"/></filter>`;

// Dry brush: rough edges + streaky bristle gaps running along the stroke (x axis
// of the element's user space — rotate the group to change direction).
export const dryBrush = (id, { cover = 0.78, edge = 9, seed = 5 } = {}) => `
  <filter id="${id}" x="-15%" y="-15%" width="130%" height="130%">
    <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="${seed}" result="big"/>
    <feDisplacementMap in="SourceGraphic" in2="big" scale="${edge}" result="shape"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.006 0.42" numOctaves="3" seed="${seed + 7}" result="str"/>
    <feColorMatrix in="str" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0" result="a"/>
    <feComponentTransfer in="a" result="m"><feFuncA type="linear" slope="7" intercept="${-7 * (1 - cover) + 0.4}"/></feComponentTransfer>
    <feComposite in="shape" in2="m" operator="in"/></filter>`;

// Ink grain: knocks fine specks out of the print like worn screen ink.
export const grain = (id, amount = 0.14, seed = 2) => `
  <filter id="${id}" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="1.3" numOctaves="2" seed="${seed}"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0"/>
    <feComponentTransfer><feFuncA type="linear" slope="9" intercept="${-9 * amount + 0.2}"/></feComponentTransfer>
    <feComposite in="SourceGraphic" operator="in"/></filter>`;

// Halftone dot pattern (comic shading).
export const dots = (id, colour, size = 3.2, r = 0.9) => `
  <pattern id="${id}" width="${size}" height="${size}" patternUnits="userSpaceOnUse">
    <circle cx="0" cy="0" r="${r}" fill="${colour}"/><circle cx="${size}" cy="0" r="${r}" fill="${colour}"/>
    <circle cx="0" cy="${size}" r="${r}" fill="${colour}"/><circle cx="${size}" cy="${size}" r="${r}" fill="${colour}"/>
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="${colour}"/></pattern>`;

// Inked illustration builder: collects fills, shading and line art separately so the
// line layer prints on top with a slight registration offset from the colours.
export function inkDrawing(id, { line = '#141414', lw = 2.4, offset = [1.1, 0.9] } = {}) {
  const fills = [], shades = [], decor = [], lines = [], defs = [];
  let n = 0;
  return {
    shape(d, fill, { shade, sw = lw, noLine = false, extra = '' } = {}) {
      if (fill) fills.push(`<path d="${d}" fill="${fill}" ${extra}/>`);
      if (shade) {
        // Real halftone dots fill the shape's box; the shape shifted by (-dx,-dy) is then
        // repainted in its base colour, leaving a dotted crescent on the far side.
        const [dx, dy, col, box = [0, 0, 300, 400]] = shade, k = n++;
        defs.push(`<clipPath id="${id}-sc${k}"><path d="${d}" ${extra.replace('fill-rule', 'clip-rule')}/></clipPath>`);
        shades.push(`<g clip-path="url(#${id}-sc${k})">${halftone({ x: box[0], y: box[1], w: box[2], h: box[3], cell: 3.2, fill: col, tone: () => 0.24 })}
          <g ${extra}><path d="${d}" fill="${fill}" transform="translate(${-dx} ${-dy})"/></g></g>`);
      }
      if (!noLine) lines.push(`<path d="${d}" fill="none" stroke="${line}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round" ${extra}/>`);
    },
    raw(fillSvg = '', lineSvg = '') { if (fillSvg) decor.push(fillSvg); if (lineSvg) lines.push(lineSvg); },
    render() {
      return `<defs>${wobble(`${id}-wb`)}${defs.join('')}</defs>
        <g transform="translate(${offset[0]} ${offset[1]})">${fills.join('')}${shades.join('')}${decor.join('')}</g>
        <g filter="url(#${id}-wb)">${lines.join('')}</g>`;
    },
  };
}
