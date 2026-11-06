// Collection 16 — AFTER DARK (sample). Boys 30–36 oversized, realistic 3D-rendered scenes
// in the finish of the founder's "night building" reference. Original building, scene and
// wording (3d/scenes.js → panelblock). No brands, no dates.
import { wear } from '../lib/pin.mjs';
import { sparkle, star } from '../lib/svg.mjs';

const SIZE = [300, 400];
const I = (name, hex) => ({ name, hex });
const FULL = { name: 'DTF (photo-real)', hex: 'conic-gradient(#00c2ff,#ff3da8,#ffe600,#00c2ff)' };

const stillAwake = ({ id, asset }) => `
  <defs>${wear(id('w'), 0.32, 6)}</defs>
  <g filter="url(#${id('w')})">
    <text x="150" y="88" text-anchor="middle" font-family="Archivo" font-weight="900" font-stretch="expanded" font-size="22" fill="#EDEDED" letter-spacing="3">STILL AWAKE</text>
    <text x="150" y="102" text-anchor="middle" font-family="Space Mono" font-size="6.5" fill="#9A9A9A" letter-spacing="3">ONE MORE LEVEL · THEN SLEEP</text>
  </g>
  <image href="${asset('output/assets/3d/panelblock-crop.png')}" x="-34" y="112" width="368" height="328" preserveAspectRatio="xMidYMax meet"/>`;

// Flat outlined cartoon astronaut (reference style: thin black line, flat fills, soft shade).
const K = '#1A1A1A', LW = 1.5;
const astro = (x, y, s, rot, suit, shade, patch, pose) => {
  const [la, ra, ll, rl] = pose;  // limb angles (deg)
  const limb = (px, py, ang, len, w, end) => `<g transform="rotate(${ang} ${px} ${py})">
    <rect x="${px - w / 2}" y="${py}" width="${w}" height="${len}" rx="${w / 2}" fill="${suit}" stroke="${K}" stroke-width="${LW}"/>
    <rect x="${px - w / 2}" y="${py + len * 0.55}" width="${w}" height="${len * 0.12}" fill="${shade}"/>
    ${end === 'boot' ? `<path d="M${px - w * 0.75},${py + len} h${w * 1.7} q2,${w * 0.9} -3,${w * 0.9} h-${w * 1.3} q-3,0 -2,-${w * 0.9} Z" fill="#D9DCE2" stroke="${K}" stroke-width="${LW}"/>`
      : `<circle cx="${px}" cy="${py + len + 2}" r="${w * 0.62}" fill="#D9DCE2" stroke="${K}" stroke-width="${LW}"/>`}</g>`;
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
    <rect x="-17" y="-14" width="34" height="30" rx="7" fill="#C9CDD4" stroke="${K}" stroke-width="${LW}"/>
    ${limb(-13, -8, la, 17, 9, 'hand')}${limb(13, -8, ra, 17, 9, 'hand')}
    ${limb(-6, 14, ll, 15, 10, 'boot')}${limb(6, 14, rl, 15, 10, 'boot')}
    <rect x="-14" y="-12" width="28" height="30" rx="9" fill="${suit}" stroke="${K}" stroke-width="${LW}"/>
    <path d="M6,-10 q8,10 0,26" fill="none" stroke="${shade}" stroke-width="4"/>
    <rect x="-8" y="-4" width="12" height="8" rx="2" fill="#E9EBEF" stroke="${K}" stroke-width="1.1"/>
    <circle cx="-5" cy="0" r="1.4" fill="#E5322D"/><circle cx="-1" cy="0" r="1.4" fill="#2F7BFF"/>
    <path d="M-11,10 h22" stroke="${patch}" stroke-width="2.6"/>
    <circle cx="9" cy="-4" r="2.6" fill="${patch}"/>
    <circle cx="0" cy="-30" r="21" fill="${suit}" stroke="${K}" stroke-width="${LW}"/>
    <path d="M10,-46 a21,21 0 0 1 2,32" fill="none" stroke="${shade}" stroke-width="4"/>
    <rect x="-16" y="-42" width="32" height="24" rx="12" fill="#1E2A4A" stroke="${K}" stroke-width="${LW}"/>
    <path d="M-12,-26 q12,10 24,0 l0,4 q-12,8 -24,0 Z" fill="#7FD8E8"/>
    <path d="M-10,-36 q4,-4 10,-3" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round"/>
    <rect x="-13" y="-12" width="26" height="5" rx="2.5" fill="#D9DCE2" stroke="${K}" stroke-width="1.1"/>
  </g>`;
};
const sparkleK = (x, y, r) => `<path d="${sparkle(x, y, r)}" fill="${K}"/>`;
const spaceCrew = () => `
  <!-- top wordmark: flat ringed planet + type -->
  <g transform="translate(70 52)">
    <ellipse cx="0" cy="0" rx="26" ry="7" transform="rotate(-18)" fill="none" stroke="#F2A93B" stroke-width="3.5"/>
    <circle r="15" fill="#E4472F" stroke="${K}" stroke-width="${LW}"/>
    <path d="M-13,-5 q13,5 26,-2 M-14,4 q14,5 28,-2" fill="none" stroke="#B5301F" stroke-width="2.2"/>
    <path d="M-25,9 a26,7 0 0 0 51,-17" transform="rotate(-18)" fill="none" stroke="#F2A93B" stroke-width="3.5"/>
  </g>
  <text x="104" y="62" font-family="Unbounded" font-weight="900" font-size="22" fill="${K}" textLength="150" lengthAdjust="spacingAndGlyphs">SPACE CREW</text>
  <text x="176" y="80" text-anchor="middle" font-family="Yellowtail" font-size="13" fill="${K}">big · dreamers</text>

  <!-- hem scene -->
  <g transform="translate(40 226) rotate(-28)">
    <path d="M-22,0 C-10,-12 16,-12 26,0 C16,12 -10,12 -22,0 Z" fill="#FFFFFF" stroke="${K}" stroke-width="${LW}"/>
    <path d="M18,-6 C24,-4 26,0 26,0 C26,0 24,4 18,6 Z" fill="#E5322D"/>
    <circle cx="4" cy="0" r="4.5" fill="#7FD8E8" stroke="${K}" stroke-width="1.1"/>
    <path d="M-12,-8 l-8,-8 l2,10 M-12,8 l-8,8 l2,-10" fill="#E5322D" stroke="${K}" stroke-width="1.1" stroke-linejoin="round"/>
    <path d="M-22,-4 l-14,-3 l6,7 l-6,7 l14,-3" fill="#FFC915" stroke="${K}" stroke-width="1.1" stroke-linejoin="round"/>
    <path d="M-44,-10 h12 M-48,0 h14 M-44,10 h12" stroke="${K}" stroke-width="1.3" stroke-linecap="round"/>
  </g>
  <g transform="translate(186 224)">
    <circle r="15" fill="#C7B7EA" stroke="${K}" stroke-width="${LW}"/>
    <circle cx="-5" cy="-4" r="3.5" fill="#9C88CF"/><circle cx="6" cy="2" r="2.6" fill="#9C88CF"/><circle cx="-1" cy="7" r="2" fill="#9C88CF"/>
  </g>
  <g transform="translate(136 262) rotate(-30)" fill="#FFFFFF" stroke="${K}" stroke-width="1.3">
    <rect x="-7" y="-6" width="14" height="12" rx="2" fill="#E9EBEF"/>
    <rect x="-33" y="-5" width="22" height="10" fill="#FFFFFF"/><rect x="11" y="-5" width="22" height="10" fill="#FFFFFF"/>
    <path d="M-28,-5 v10 M-22,-5 v10 M-16,-5 v10 M16,-5 v10 M22,-5 v10 M28,-5 v10 M-11,0 h-0 M7,0 h4 M-7,0 h-4" fill="none"/>
    <path d="M0,-6 v-6" fill="none"/><circle cx="0" cy="-13" r="2" fill="#FFFFFF"/>
  </g>
  <path d="M60,258 C96,240 120,246 150,232" fill="none" stroke="${K}" stroke-width="1.2" stroke-dasharray="2 4"/>
  <path d="M205,236 C214,250 218,262 216,276" fill="none" stroke="${K}" stroke-width="1.2" stroke-dasharray="2 4"/>
  <text x="72" y="268" font-family="Yellowtail" font-size="20" fill="${K}" transform="rotate(-14 90 262)">Dreamer</text>
  <path d="M60,278 C100,266 130,262 168,250" fill="none" stroke="${K}" stroke-width="1.2"/>
  <!-- moon behind the last astronaut -->
  <circle cx="252" cy="300" r="26" fill="#FFD84D" stroke="${K}" stroke-width="${LW}"/>
  <circle cx="242" cy="290" r="5" fill="#F2C12E"/><circle cx="262" cy="306" r="6.5" fill="#F2C12E"/><circle cx="246" cy="312" r="3.5" fill="#F2C12E"/>
  <!-- flag -->
  <path d="M286,302 L278,388" stroke="${K}" stroke-width="2.6" stroke-linecap="round"/>
  <path d="M286,302 q-10,-4 -20,2 q2,6 0,12 q10,-5 21,-1 Z" fill="#E5322D" stroke="${K}" stroke-width="1.2" stroke-linejoin="round"/>
  ${astro(54, 334, 1.05, -8, '#FFFFFF', '#E3E6EB', '#E5322D', [28, -30, 14, -16])}
  ${astro(110, 330, 1.05, 10, '#FFFFFF', '#E3E6EB', '#2F7BFF', [-120, 40, -30, 24])}
  ${astro(168, 340, 1.05, -6, '#EFE2CF', '#DCC9AE', '#FF7A1A', [20, -150, 8, -6])}
  ${astro(240, 336, 1.05, 4, '#FFFFFF', '#E3E6EB', '#35B46A', [140, -20, 10, -12])}
  ${[[24, 250, 6], [96, 218, 5], [150, 296, 5], [282, 250, 5], [210, 262, 4]].map(([x, y, r]) => sparkleK(x, y, r)).join('')}
  ${[[30, 300], [70, 236], [228, 240], [288, 330]].map(([x, y]) => `<path d="${star(x, y, 5, 3.4, 1.5)}" fill="${K}"/>`).join('')}
  <text x="64" y="378" font-family="Yellowtail" font-size="9" fill="${K}" transform="rotate(16 64 378)">from moon to mars</text>
  <text x="160" y="288" font-family="Yellowtail" font-size="10" fill="${K}" transform="rotate(-20 160 288)">space sky</text>
  <text x="214" y="394" font-family="Space Mono" font-size="6.5" fill="${K}">E = mc²</text>
  <text x="246" y="394" font-family="Space Mono" font-size="5.5" fill="${K}">a² + b² = c²</text>`;

export default {
  id: 'c16-after-dark',
  code: 'BOYS · 30–36 · OVERSIZED · SAMPLE',
  title: 'AFTER DARK',
  technique: 'DTF · PHOTO-REAL',
  subtitle: '3D-rendered scenes',
  layout: 'single',
  countInks: true,
  items: [
    { ref: 'AD-02', name: 'Space Crew', colour: { name: 'Light Grey', hex: '#E4E4E2' }, art: { front: { svg: spaceCrew, size: SIZE, inks: [I('Black', '#1A1A1A'), I('White', '#FFFFFF'), I('Red', '#E5322D'), I('Yellow', '#FFD84D'), I('Navy', '#1E2A4A'), I('Aqua', '#7FD8E8')] } } },
    { ref: 'AD-01', name: 'Still Awake', colour: { name: 'Black', hex: '#141414' }, art: { front: { svg: stillAwake, size: SIZE, inks: [FULL] } } },
  ],
};
