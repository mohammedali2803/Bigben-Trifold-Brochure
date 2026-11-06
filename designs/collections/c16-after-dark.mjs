// Collection 16 — AFTER DARK (sample). Boys 30–36 oversized, realistic 3D-rendered scenes
// in the finish of the founder's "night building" reference. Original building, scene and
// wording (3d/scenes.js → panelblock). No brands, no dates.
import { wear } from '../lib/pin.mjs';
import { sparkle, star } from '../lib/svg.mjs';

const SIZE = [300, 400];
const FULL = { name: 'DTF (photo-real)', hex: 'conic-gradient(#00c2ff,#ff3da8,#ffe600,#00c2ff)' };

const stillAwake = ({ id, asset }) => `
  <defs>${wear(id('w'), 0.32, 6)}</defs>
  <g filter="url(#${id('w')})">
    <text x="150" y="88" text-anchor="middle" font-family="Archivo" font-weight="900" font-stretch="expanded" font-size="22" fill="#EDEDED" letter-spacing="3">STILL AWAKE</text>
    <text x="150" y="102" text-anchor="middle" font-family="Space Mono" font-size="6.5" fill="#9A9A9A" letter-spacing="3">ONE MORE LEVEL · THEN SLEEP</text>
  </g>
  <image href="${asset('output/assets/3d/panelblock-crop.png')}" x="-34" y="112" width="368" height="328" preserveAspectRatio="xMidYMax meet"/>`;

const spaceCrew = ({ asset }) => `
  <image href="${asset('output/assets/3d/planet.png')}" x="44" y="30" width="46" height="46"/>
  <text x="92" y="62" font-family="Unbounded" font-weight="900" font-size="22" fill="#141414" textLength="164" lengthAdjust="spacingAndGlyphs">SPACE CREW</text>
  <text x="174" y="80" text-anchor="middle" font-family="Yellowtail" font-size="14" fill="#141414">big · dreamers</text>
  <path d="M14,250 C70,214 130,236 170,212 S250,190 292,214" fill="none" stroke="#141414" stroke-width="1.4" stroke-dasharray="3 5"/>
  <text x="26" y="236" font-family="Yellowtail" font-size="24" fill="#141414" transform="rotate(-12 60 230)">Dreamer</text>
  ${[[150, 230, 6], [270, 236, 5], [20, 300, 5], [110, 214, 4], [230, 206, 4]].map(([x, y, r]) => `<path d="${sparkle(x, y, r)}" fill="#141414"/>`).join('')}
  ${[[60, 262], [200, 222], [286, 270]].map(([x, y]) => `<path d="${star(x, y, 5, 3.6, 1.6)}" fill="#141414"/>`).join('')}
  <image href="${asset('output/assets/3d/astrocrew-crop.png')}" x="4" y="246" width="292" height="139" preserveAspectRatio="xMidYMax meet"/>
  <text x="18" y="396" font-family="Space Mono" font-size="6" fill="#141414" letter-spacing="1">from earth · to everywhere</text>
  <text x="282" y="396" text-anchor="end" font-family="Space Mono" font-size="6" fill="#141414" letter-spacing="1">crew of four · mission: fun</text>`;

export default {
  id: 'c16-after-dark',
  code: 'BOYS · 30–36 · OVERSIZED · SAMPLE',
  title: 'AFTER DARK',
  technique: 'DTF · PHOTO-REAL',
  subtitle: '3D-rendered scenes',
  layout: 'single',
  countInks: true,
  items: [
    { ref: 'AD-02', name: 'Space Crew', colour: { name: 'Light Grey', hex: '#E4E4E2' }, art: { front: { svg: spaceCrew, size: SIZE, inks: [FULL] } } },
    { ref: 'AD-01', name: 'Still Awake', colour: { name: 'Black', hex: '#141414' }, art: { front: { svg: stillAwake, size: SIZE, inks: [FULL] } } },
  ],
};
