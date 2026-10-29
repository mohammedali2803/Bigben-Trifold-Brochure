// Collection 1 — TYPE LAB: modern type-led prints, exactly two inks each.
import { star, wave, arc, halftone, r2 } from '../lib/svg.mjs';

const INK = {
  white: { name: 'White', hex: '#FFFFFF' },
  lime: { name: 'Acid Lime', hex: '#D7FF3B' },
  black: { name: 'Ink Black', hex: '#151515' },
  cobalt: { name: 'Cobalt', hex: '#2B4BFF' },
  cream: { name: 'Cream', hex: '#FFF4DC' },
  forest: { name: 'Forest', hex: '#1E3A2B' },
  sky: { name: 'Sky', hex: '#9FD8FF' },
  tomato: { name: 'Tomato', hex: '#FF4B2B' },
  milk: { name: 'Milk', hex: '#F6E9D2' },
  peach: { name: 'Peach', hex: '#FFB089' },
};

const XW = `font-family="Archivo" font-weight="900" font-stretch="expanded"`;
const MONO = `font-family="Space Mono" font-weight="700"`;

const sideQuest = () => {
  const { white, lime } = INK;
  return `
  <text x="18" y="34" ${MONO} font-size="12" fill="${white.hex}" letter-spacing="1">LVL 07</text>
  <text x="282" y="34" ${MONO} font-size="12" fill="${lime.hex}" text-anchor="end" letter-spacing="1">◆ NEW MISSION</text>
  <rect x="18" y="44" width="264" height="2.5" fill="${white.hex}"/>
  <text x="18" y="124" ${XW} font-size="80" fill="${white.hex}" textLength="264" lengthAdjust="spacingAndGlyphs">SIDE</text>
  <text x="18" y="200" ${XW} font-size="80" fill="none" stroke="${lime.hex}" stroke-width="2.4" textLength="264" lengthAdjust="spacingAndGlyphs">QUEST</text>
  <path d="M30,276 C70,236 110,290 150,256 S220,226 250,246" fill="none" stroke="${white.hex}" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round"/>
  <circle cx="30" cy="276" r="6" fill="${white.hex}"/>
  <path d="M256,236 l16,16 m0,-16 l-16,16" stroke="${lime.hex}" stroke-width="5" stroke-linecap="round"/>
  <text x="44" y="296" ${MONO} font-size="10" fill="${white.hex}" letter-spacing="1">START</text>
  <text x="282" y="282" ${MONO} font-size="10" fill="${lime.hex}" text-anchor="end" letter-spacing="1">LOOT</text>`;
};

const goodIdeas = ({ id }) => {
  const { black, cobalt } = INK;
  const cx = 150, cy = 108, r = 70;
  return `
  <defs><clipPath id="${id('bulb')}"><circle cx="${cx}" cy="${cy}" r="${r - 3}"/></clipPath></defs>
  ${halftone({ x: cx - r, y: cy - r, w: r * 2, h: r * 2, cell: 7, fill: cobalt.hex, clip: id('bulb'),
    tone: (x, y) => 0.15 + Math.hypot(x - (cx - 26), y - (cy - 28)) / (r * 1.5) })}
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${black.hex}" stroke-width="4"/>
  <path d="M${cx - 30},${cy + 62} L${cx - 26},${cy + 84} L${cx + 26},${cy + 84} L${cx + 30},${cy + 62}" fill="${black.hex}"/>
  <rect x="${cx - 24}" y="${cy + 88}" width="48" height="7" rx="3.5" fill="${black.hex}"/>
  <rect x="${cx - 16}" y="${cy + 99}" width="32" height="7" rx="3.5" fill="${black.hex}"/>
  <path d="M${cx - 12},${cy + 10} l6,-14 l6,10 l6,-10 l6,14" fill="none" stroke="${black.hex}" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M${cx},${cy + 10} L${cx},${cy + 62}" stroke="${black.hex}" stroke-width="3.5"/>
  ${[-150, -120, -90, -60, -30, -180, 0]
    .map((a) => {
      const t = (a * Math.PI) / 180;
      return `<line x1="${r2(cx + (r + 12) * Math.cos(t))}" y1="${r2(cy + (r + 12) * Math.sin(t))}" x2="${r2(cx + (r + 28) * Math.cos(t))}" y2="${r2(cy + (r + 28) * Math.sin(t))}" stroke="${cobalt.hex}" stroke-width="5" stroke-linecap="round"/>`;
    })
    .join('')}
  <text x="150" y="252" text-anchor="middle" font-family="Instrument Serif" font-style="italic" font-size="50" fill="${black.hex}">good ideas</text>
  <text x="150" y="292" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="34" fill="${cobalt.hex}" letter-spacing="10">ONLY</text>`;
};

const sundayClub = ({ id }) => {
  const { cream, forest } = INK;
  const petals = Array.from({ length: 12 }, (_, i) =>
    `<ellipse cx="150" cy="${150 - 70}" rx="20" ry="36" transform="rotate(${i * 30} 150 150)" fill="${cream.hex}" stroke="${forest.hex}" stroke-width="3"/>`,
  ).join('');
  return `
  <defs><path id="${id('ring')}" d="${arc(150, 150, 130, -90, 269.9)}"/></defs>
  <text font-family="Unbounded" font-weight="700" font-size="15.5" fill="${forest.hex}" letter-spacing="3.2">
    <textPath href="#${id('ring')}">SUNDAY CLUB ✦ SLOW MORNINGS ✦ BIG PLANS ✦ </textPath></text>
  ${petals}
  <circle cx="150" cy="150" r="40" fill="${forest.hex}"/>
  <path d="M134,142 q5,-7 10,0 M156,142 q5,-7 10,0" fill="none" stroke="${cream.hex}" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M136,158 q14,16 28,0" fill="none" stroke="${cream.hex}" stroke-width="4" stroke-linecap="round"/>
  <circle cx="129" cy="155" r="4" fill="${cream.hex}" opacity="1"/><circle cx="171" cy="155" r="4" fill="${cream.hex}"/>`;
};

const waveCheck = ({ id }) => {
  const { white, sky } = INK;
  const rows = [0, 1, 2, 3, 4, 5];
  return `
  <defs>${rows.map((i) => `<path id="${id(`w${i}`)}" d="${wave(14, 286, 52 + i * 44, 6, 272, i * 1.05)}"/>`).join('')}</defs>
  ${rows
    .map((i) => {
      const solid = i % 2 === 0;
      const paint = solid ? `fill="${i === 2 ? sky.hex : white.hex}"` : `fill="none" stroke="${white.hex}" stroke-width="1.3"`;
      return `<text ${XW} font-size="38" ${paint} textLength="268" lengthAdjust="spacingAndGlyphs"><textPath href="#${id(`w${i}`)}">WAVE CHECK</textPath></text>`;
    })
    .join('')}`;
};

const mainCharacter = () => {
  const { black, tomato } = INK;
  return `
  <path d="${star(150, 132, 22, 118, 104)}" fill="${tomato.hex}"/>
  <text x="150" y="118" text-anchor="middle" font-family="Rubik Mono One" font-size="56" fill="${black.hex}" textLength="196" lengthAdjust="spacingAndGlyphs">MAIN</text>
  <text x="150" y="166" text-anchor="middle" font-family="Rubik Mono One" font-size="27" fill="${black.hex}" textLength="196" lengthAdjust="spacingAndGlyphs">CHARACTER</text>
  <text x="150" y="196" text-anchor="middle" font-family="Instrument Serif" font-style="italic" font-size="22" fill="${black.hex}">energy, all day.</text>
  ${[0, 1, 2, 3, 4].map((i) => `<path d="${star(102 + i * 24, 272, 5, 10, 4.2)}" fill="${black.hex}"/>`).join('')}
  <text x="150" y="298" text-anchor="middle" ${MONO} font-size="10" fill="${black.hex}" letter-spacing="3">RATED 5/5 BY ME</text>`;
};

const noSignal = ({ id }) => {
  const { milk, peach } = INK;
  const bars = [0, 1, 2, 3, 4, 5, 6];
  const bw = 200 / 7;
  return `
  <defs><clipPath id="${id('screen')}"><rect x="50" y="56" width="200" height="140" rx="22"/></clipPath></defs>
  <line x1="126" y1="40" x2="96" y2="8" stroke="${milk.hex}" stroke-width="4" stroke-linecap="round"/>
  <line x1="174" y1="40" x2="204" y2="8" stroke="${milk.hex}" stroke-width="4" stroke-linecap="round"/>
  <g clip-path="url(#${id('screen')})">
    ${bars
      .map((i) => {
        const x = 50 + i * bw;
        if (i % 3 === 0) return `<rect x="${x}" y="56" width="${bw + 0.3}" height="140" fill="${milk.hex}"/>`;
        if (i % 3 === 1) return `<rect x="${x}" y="56" width="${bw + 0.3}" height="140" fill="${peach.hex}"/>`;
        return halftone({ x, y: 56, w: bw, h: 140, cell: 6, fill: peach.hex, angle: 0, tone: () => 0.45 });
      })
      .join('')}
    <rect x="50" y="164" width="200" height="32" fill="${milk.hex}"/>
    ${[0, 1, 2, 3].map((i) => `<rect x="${58 + i * 48}" y="172" width="${i % 2 ? 40 : 22}" height="16" fill="${peach.hex}"/>`).join('')}
  </g>
  <rect x="40" y="46" width="220" height="160" rx="28" fill="none" stroke="${milk.hex}" stroke-width="7"/>
  <text x="150" y="250" text-anchor="middle" font-family="Sixtyfour" font-size="27" fill="${milk.hex}" textLength="250" lengthAdjust="spacingAndGlyphs">NO SIGNAL</text>
  <text x="150" y="280" text-anchor="middle" ${MONO} font-size="11" fill="${peach.hex}" letter-spacing="2">CH 03 · PLEASE STAND BY</text>`;
};

export default {
  id: 'c1-type-lab',
  code: 'C1',
  title: 'TYPE LAB',
  technique: '2-COLOUR SCREEN PRINT',
  subtitle: 'type-led, 2 inks per print',
  layout: 'single',
  countInks: true,
  items: [
    { ref: 'TL-01', name: 'Side Quest', colour: { name: 'Jet Black', hex: '#141414' }, art: { front: { svg: sideQuest, inks: [INK.white, INK.lime] } } },
    { ref: 'TL-02', name: 'Good Ideas Only', colour: { name: 'Off White', hex: '#F1EDE4' }, art: { front: { svg: goodIdeas, inks: [INK.black, INK.cobalt] } } },
    { ref: 'TL-03', name: 'Sunday Club', colour: { name: 'Sage', hex: '#A9B89A' }, art: { front: { svg: sundayClub, inks: [INK.cream, INK.forest] } } },
    { ref: 'TL-04', name: 'Wave Check', colour: { name: 'Cobalt', hex: '#2347C5' }, art: { front: { svg: waveCheck, inks: [INK.white, INK.sky] } } },
    { ref: 'TL-05', name: 'Main Character', colour: { name: 'Butter', hex: '#F6E7A1' }, art: { front: { svg: mainCharacter, inks: [INK.black, INK.tomato] } } },
    { ref: 'TL-06', name: 'No Signal', colour: { name: 'Cocoa', hex: '#4A3428' }, art: { front: { svg: noSignal, inks: [INK.milk, INK.peach] } } },
  ],
};
