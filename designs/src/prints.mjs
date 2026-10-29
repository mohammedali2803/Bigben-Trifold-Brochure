// Original print artwork for design proposals. Each print is drawn on a
// 300 x 300 artboard and lists the inks it uses, so the colour count can be
// checked against the sheet brief (e.g. "1 to 2 col" screen print).
// All typefaces are SIL Open Font License fonts stored in ../fonts.

function pixelGrid(rows, size, x0, y0, fill) {
  return rows
    .flatMap((row, r) =>
      [...row].map((cell, c) =>
        cell === '#'
          ? `<rect x="${x0 + c * size}" y="${y0 + r * size}" width="${size}" height="${size}" fill="${fill}"/>`
          : '',
      ),
    )
    .join('');
}

function checkerStrip(x, y, cols, rows, size, a, b) {
  let out = '';
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      out += `<rect x="${x + c * size}" y="${y + r * size}" width="${size}" height="${size}" fill="${(r + c) % 2 ? b : a}"/>`;
  return out;
}

const INK = {
  white: { name: 'White', hex: '#FFFFFF' },
  yellow: { name: 'Sun Yellow', hex: '#FFD21F' },
  black: { name: 'Black', hex: '#111111' },
  orange: { name: 'Flame Orange', hex: '#FF6A13' },
  cream: { name: 'Cream', hex: '#F4E9CC' },
  mustard: { name: 'Mustard', hex: '#F2B033' },
  lime: { name: 'Neon Lime', hex: '#C9F73A' },
};

export const PRINTS = {
  'level-up': {
    name: 'Level Up',
    inks: [INK.white, INK.yellow],
    svg: () => {
      const arrow = ['....#....', '...###...', '..#####..', '.#######.', '#########', '...###...', '...###...', '...###...'];
      return `
        ${pixelGrid(arrow, 9, 150 - 4.5 * 9, 8, INK.yellow.hex)}
        <text x="150" y="148" text-anchor="middle" font-family="'Press Start 2P'" font-size="38" fill="${INK.white.hex}">LEVEL</text>
        <g>
          <text x="38" y="181" font-family="'Press Start 2P'" font-size="11" fill="${INK.white.hex}">XP</text>
          <rect x="66" y="166" width="196" height="20" fill="none" stroke="${INK.white.hex}" stroke-width="4"/>
          ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<rect x="${72 + i * 21}" y="172" width="16" height="8" fill="${INK.yellow.hex}"/>`).join('')}
        </g>
        <text x="150" y="268" text-anchor="middle" font-family="'Press Start 2P'" font-size="74" fill="${INK.yellow.hex}">UP</text>
        <text x="150" y="296" text-anchor="middle" font-family="'Press Start 2P'" font-size="10" fill="${INK.white.hex}" letter-spacing="2">PLAYER 1 · READY</text>`;
    },
  },

  rookie: {
    name: 'Rookie 07',
    inks: [INK.white, INK.yellow],
    svg: () => `
      <defs><path id="rookie-arc" d="M30,118 Q150,18 270,118"/></defs>
      <text font-family="Graduate" font-size="50" fill="${INK.white.hex}" letter-spacing="3">
        <textPath href="#rookie-arc" startOffset="50%" text-anchor="middle">ROOKIE</textPath>
      </text>
      <text x="150" y="250" text-anchor="middle" font-family="Graduate" font-size="160"
            fill="${INK.yellow.hex}" stroke="${INK.white.hex}" stroke-width="7" paint-order="stroke" stroke-linejoin="round">07</text>
      <rect x="62" y="266" width="176" height="3" fill="${INK.white.hex}"/>
      <text x="150" y="292" text-anchor="middle" font-family="Graduate" font-size="17" fill="${INK.white.hex}" letter-spacing="3">PLAY HARD · PLAY FAIR</text>`,
  },

  'off-the-grid': {
    name: 'Off The Grid',
    inks: [INK.black, INK.orange],
    svg: () => {
      const cells = [];
      for (let r = 0; r < 3; r++)
        for (let c = 0; c < 3; c++)
          if (!(r === 0 && c === 2))
            cells.push(`<rect x="${226 + c * 18}" y="${34 + r * 18}" width="13" height="13" fill="none" stroke="${INK.orange.hex}" stroke-width="3.5"/>`);
      return `
        ${cells.join('')}
        <rect x="276" y="8" width="13" height="13" fill="${INK.orange.hex}" transform="rotate(22 282 14)"/>
        <path d="M266,30 l6,-6 M274,36 l8,-3" stroke="${INK.orange.hex}" stroke-width="3" stroke-linecap="round"/>
        <text x="18" y="100" font-family="Anton" font-size="66" fill="${INK.black.hex}">OFF THE</text>
        <text x="16" y="246" font-family="Anton" font-size="164" fill="${INK.black.hex}" letter-spacing="2">GRID</text>
        <rect x="20" y="262" width="260" height="5" fill="${INK.orange.hex}"/>
        <text x="20" y="292" font-family="Anton" font-size="20" fill="${INK.black.hex}" letter-spacing="4">THINK OUTSIDE THE BOX</text>`;
    },
  },

  'fast-lane': {
    name: 'Fast Lane',
    inks: [INK.white, INK.black],
    svg: () => `
      ${checkerStrip(36, 18, 19, 2, 12, INK.white.hex, INK.black.hex)}
      <g fill="${INK.white.hex}">
        <rect x="0" y="92" width="64" height="7"/>
        <rect x="14" y="112" width="44" height="7"/>
        <rect x="0" y="192" width="54" height="7"/>
        <rect x="18" y="212" width="34" height="7"/>
      </g>
      <g font-family="Racing Sans One" font-size="104" letter-spacing="-2">
        <text x="72" y="150" fill="${INK.black.hex}" transform="translate(6 6)">FAST</text>
        <text x="72" y="150" fill="${INK.white.hex}">FAST</text>
        <text x="62" y="246" fill="${INK.black.hex}" transform="translate(6 6)">LANE</text>
        <text x="62" y="246" fill="${INK.white.hex}">LANE</text>
      </g>
      <text x="292" y="286" text-anchor="end" font-family="Racing Sans One" font-size="22" fill="${INK.black.hex}" letter-spacing="2">NO BRAKES · ALL GO</text>`,
  },

  'explore-more': {
    name: 'Explore More',
    inks: [INK.cream, INK.mustard],
    svg: () => `
      <defs>
        <path id="explore-top" d="M40,150 A110,110 0 0 1 260,150"/>
        <path id="explore-bottom" d="M28,150 A122,122 0 0 0 272,150"/>
        <clipPath id="explore-clip"><circle cx="150" cy="150" r="86"/></clipPath>
      </defs>
      <circle cx="150" cy="150" r="140" fill="none" stroke="${INK.cream.hex}" stroke-width="5"/>
      <circle cx="150" cy="150" r="90" fill="none" stroke="${INK.cream.hex}" stroke-width="3"/>
      <text font-family="Bowlby One" font-size="30" fill="${INK.cream.hex}" letter-spacing="4">
        <textPath href="#explore-top" startOffset="50%" text-anchor="middle">EXPLORE MORE</textPath>
      </text>
      <text font-family="Bowlby One" font-size="19" fill="${INK.mustard.hex}" letter-spacing="6">
        <textPath href="#explore-bottom" startOffset="50%" text-anchor="middle">WILD · FREE · CURIOUS</textPath>
      </text>
      <g clip-path="url(#explore-clip)">
        <circle cx="186" cy="126" r="22" fill="${INK.mustard.hex}"/>
        <path d="M54,212 L118,128 L146,164 L178,118 L250,212 Z" fill="${INK.cream.hex}"/>
        <path d="M118,128 L104,146 L112,144 L120,154 L128,142 L134,148 Z M178,118 L164,136 L172,134 L180,144 L188,132 L196,140 Z"
              fill="${INK.mustard.hex}"/>
        <path d="M54,236 L54,212 L250,212 L250,236 Z" fill="${INK.cream.hex}"/>
        <path d="M86,222 h40 M150,228 h56" stroke="${INK.mustard.hex}" stroke-width="4" stroke-linecap="round"/>
      </g>
      <g fill="${INK.mustard.hex}">
        <path d="M9,150 l5,-5 l5,5 l-5,5 Z"/><path d="M281,150 l5,-5 l5,5 l-5,5 Z"/>
      </g>`,
  },

  'no-limits': {
    name: 'No Limits',
    inks: [INK.lime],
    svg: () => `
      <text x="150" y="104" text-anchor="middle" font-family="Monoton" font-size="78" fill="${INK.lime.hex}">NO</text>
      <text x="150" y="196" text-anchor="middle" font-family="Monoton" font-size="50" fill="${INK.lime.hex}">LIMITS</text>
      <path d="M150,254 C126,224 86,224 86,254 C86,284 126,284 150,254 C174,224 214,224 214,254 C214,284 174,284 150,254 Z"
            fill="none" stroke="${INK.lime.hex}" stroke-width="7"/>
      <path d="M150,254 C126,236 100,236 100,254 C100,272 126,272 150,254 C174,236 200,236 200,254 C200,272 174,272 150,254 Z"
            fill="none" stroke="${INK.lime.hex}" stroke-width="2.5"/>
      <rect x="20" y="252" width="54" height="4" fill="${INK.lime.hex}"/>
      <rect x="226" y="252" width="54" height="4" fill="${INK.lime.hex}"/>`,
  },
};
