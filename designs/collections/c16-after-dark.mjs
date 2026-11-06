// Collection 16 — AFTER DARK (sample). Boys 30–36 oversized, realistic 3D-rendered scenes
// in the finish of the founder's "night building" reference. Original building, scene and
// wording (3d/scenes.js → panelblock). No brands, no dates.
import { wear } from '../lib/pin.mjs';

const SIZE = [300, 400];
const FULL = { name: 'DTF (photo-real)', hex: 'conic-gradient(#00c2ff,#ff3da8,#ffe600,#00c2ff)' };

const stillAwake = ({ id, asset }) => `
  <defs>${wear(id('w'), 0.32, 6)}</defs>
  <g filter="url(#${id('w')})">
    <text x="150" y="88" text-anchor="middle" font-family="Archivo" font-weight="900" font-stretch="expanded" font-size="22" fill="#EDEDED" letter-spacing="3">STILL AWAKE</text>
    <text x="150" y="102" text-anchor="middle" font-family="Space Mono" font-size="6.5" fill="#9A9A9A" letter-spacing="3">ONE MORE LEVEL · THEN SLEEP</text>
  </g>
  <image href="${asset('output/assets/3d/panelblock-crop.png')}" x="-34" y="112" width="368" height="328" preserveAspectRatio="xMidYMax meet"/>`;

export default {
  id: 'c16-after-dark',
  code: 'BOYS · 30–36 · OVERSIZED · SAMPLE',
  title: 'AFTER DARK',
  technique: 'DTF · PHOTO-REAL',
  subtitle: '3D-rendered night scene — sample for approval',
  layout: 'single',
  countInks: true,
  items: [{ ref: 'AD-01', name: 'Still Awake', colour: { name: 'Black', hex: '#141414' }, art: { front: { svg: stillAwake, size: SIZE, inks: [FULL] } } }],
};
