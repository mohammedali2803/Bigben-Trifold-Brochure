// Flat technical sketches of Bigben's standard silhouettes, drawn as SVG.
// Every garment shares one 400 x 380 coordinate space so prints can be
// positioned with the same placement presets across silhouettes.

export const GARMENT_VIEWBOX = '0 0 400 380';

// Print placement presets: centre point and maximum print width, in garment units.
export const PLACEMENTS = {
  'centre-chest': { cx: 200, cy: 182, width: 170 },
  'left-chest': { cx: 252, cy: 128, width: 56 },
  'full-back': { cx: 200, cy: 190, width: 190 },
};

function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function isDark(hex) {
  return luminance(hex) < 0.18;
}

// Round-neck half-sleeve tee. `view` is 'front' or 'back'.
export function roundNeckHalfSleeve({ colour, rib = colour, view = 'front' }) {
  const dark = isDark(colour);
  const outline = dark ? '#7a7a7a' : '#1a1a1a';
  const inside = dark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)';
  const stitch = dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.38)';
  const neckDepth = view === 'front' ? 82 : 46;
  const ribDepth = view === 'front' ? 66 : 38;

  const body = [
    'M150,30',
    'C126,38 92,46 64,54', // left shoulder
    'L8,152', // sleeve outer edge
    'L56,180', // sleeve hem
    'C66,160 74,144 80,130', // underarm
    'L80,372', // left side seam
    'L320,372', // hem
    'L320,130', // right side seam
    'C326,144 334,160 344,180',
    'L392,152',
    'L336,54',
    'C308,46 274,38 250,30',
    'Q200,42 150,30 Z', // back neck
  ].join(' ');

  return `
  <g class="garment">
    <path d="${body}" fill="${colour}" stroke="${outline}" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M158,31 Q200,${ribDepth} 242,31 Q200,40 158,31 Z" fill="${inside}"/>
    <path d="M150,30 Q200,${neckDepth} 250,30 L242,31 Q200,${ribDepth} 158,31 Z"
          fill="${rib}" stroke="${outline}" stroke-width="1.3" stroke-linejoin="round"/>
    <g fill="none" stroke="${stitch}" stroke-width="1">
      <path d="M64,54 Q86,92 80,130"/>
      <path d="M336,54 Q314,92 320,130"/>
      <path d="M13,143 L61,171"/>
      <path d="M387,143 L339,171"/>
      <path d="M80,362 L320,362"/>
    </g>
  </g>`;
}

export const SILHOUETTES = {
  'rn-hs': roundNeckHalfSleeve,
};
