// Collection 7 — HEADLINERS. Boys, Junior + Boys (3–14 yrs).
// Front: small chest print, 2 inks. Back: cartoon character print, max 4 inks.
import { sparkle, star, r2 } from '../lib/svg.mjs';
import { C, E, R, P, S, layer, knockout } from '../lib/toon.mjs';

const INK = {
  black: { name: 'Black', hex: '#151515' },
  white: { name: 'White', hex: '#FFFFFF' },
  cocoa: { name: 'Cocoa', hex: '#8A5636' },
  tomato: { name: 'Tomato', hex: '#FF4B2B' },
  sky: { name: 'Sky', hex: '#6EC1FF' },
  lime: { name: 'Acid Lime', hex: '#C6FF3A' },
  purple: { name: 'Grape', hex: '#8B5CFF' },
  pink: { name: 'Hot Pink', hex: '#FF7EB6' },
  orange: { name: 'Orange', hex: '#FF7A1A' },
  butter: { name: 'Butter', hex: '#FFD84D' },
  grey: { name: 'Shark Grey', hex: '#C9D3DC' },
  coral: { name: 'Coral', hex: '#FF6B6B' },
  teal: { name: 'Teal', hex: '#2EC4B6' },
  cream: { name: 'Cream', hex: '#FFF1D6' },
  red: { name: 'Red', hex: '#E63946' },
};
const K = INK.black.hex;
const MONO = `font-family="Space Mono" font-weight="700"`;
const XW = `font-family="Archivo" font-weight="900" font-stretch="expanded"`;
const BACK = [300, 380];
const headline = (txt, fill, y = 338, size = 40) =>
  `<text x="150" y="${y}" text-anchor="middle" ${XW} font-size="${size}" fill="${fill}" textLength="264" lengthAdjust="spacingAndGlyphs">${txt}</text>`;
const sub = (txt, fill, y = 366) => `<text x="150" y="${y}" text-anchor="middle" ${MONO} font-size="11" fill="${fill}" letter-spacing="3">${txt}</text>`;
// Two-line chest wordmark used on every front.
const chestWords = (a, b, fill) => `
  <text x="150" y="216" text-anchor="middle" ${XW} font-size="52" fill="${fill}" textLength="250" lengthAdjust="spacingAndGlyphs">${a}</text>
  <text x="150" y="274" text-anchor="middle" ${XW} font-size="52" fill="${fill}" textLength="250" lengthAdjust="spacingAndGlyphs">${b}</text>`;

// 1. Skate Bear ---------------------------------------------------------------
const bearBack = ({ id }) => {
  const { cocoa, tomato, sky } = INK;
  const body = [
    layer([R(62, 288, 176, 14, 7, tomato.hex, -10)], K),
    layer([C(98, 318, 10, sky.hex), C(202, 300, 10, sky.hex)], K),
    layer([S('M134,236 L116,262 L108,282', 18, cocoa.hex), S('M166,236 L184,256 L194,272', 18, cocoa.hex)], K),
    layer([E(104, 287, 18, 9, K, -10), E(198, 277, 18, 9, K, -10)], K),
    layer([P('M120,210 L180,210 L186,246 L160,248 L150,232 L140,248 L114,246 Z', sky.hex)], K),
    layer([S('M124,164 L90,186 L68,172', 15, cocoa.hex), S('M176,162 L210,150 L230,124', 15, cocoa.hex), C(64, 168, 10, cocoa.hex), C(232, 118, 10, cocoa.hex)], K),
    layer([P('M114,150 Q150,138 186,150 L190,220 Q150,230 110,220 Z', tomato.hex), E(118, 162, 16, 13, tomato.hex, 30), E(182, 160, 16, 13, tomato.hex, -30)], K),
    layer([C(108, 66, 17, cocoa.hex), C(192, 66, 17, cocoa.hex), C(150, 102, 46, cocoa.hex)], K),
    `<circle cx="108" cy="64" r="7" fill="${tomato.hex}"/><circle cx="192" cy="64" r="7" fill="${tomato.hex}"/>`,
    layer([P('M104,86 Q104,50 150,48 Q196,50 196,86 Q150,74 104,86 Z', tomato.hex), E(206, 82, 26, 7, tomato.hex, 14)], K),
    `<ellipse cx="150" cy="125" rx="23" ry="16" fill="${K}"/>`,
    `<rect x="118" y="92" width="28" height="16" rx="7" fill="${K}"/><rect x="154" y="92" width="28" height="16" rx="7" fill="${K}"/><path d="M146,98 L154,98" stroke="${K}" stroke-width="4"/>`,
  ].join('');
  const holes = `<ellipse cx="150" cy="125" rx="19" ry="12.5"/><path d="M124,97 l8,0 M160,97 l8,0" stroke-width="3" stroke-linecap="round" fill="none"/>
    <path d="M118,226 l64,0" stroke-width="3" fill="none"/>`;
  return `<g transform="translate(0 -22)">
  ${knockout(id('ko'), body, holes)}
  <ellipse cx="150" cy="118" rx="8" ry="5.5" fill="${K}"/>
  <path d="M142,128 q8,8 16,0" fill="none" stroke="${K}" stroke-width="3" stroke-linecap="round"/>
  <path d="M24,306 h30 M34,320 h20 M248,262 h26" stroke="${K}" stroke-width="3.5" stroke-linecap="round"/></g>
  ${headline('NO BAD DAYS', K)}
  ${sub('ALWAYS ROLLING · SKATE CREW', INK.tomato.hex)}`;
};
const bearChest = () => `
  <g transform="rotate(-18 150 104)">
    <rect x="66" y="88" width="168" height="30" rx="15" fill="${INK.tomato.hex}"/>
    <circle cx="100" cy="132" r="11" fill="${K}"/><circle cx="200" cy="132" r="11" fill="${K}"/>
  </g>
  ${chestWords('NO BAD', 'DAYS', K)}`;

// 2. Game Buddy (rubber-hose controller) --------------------------------------
const gameBack = ({ id }) => {
  const { white, lime, purple, pink } = INK;
  const W = white.hex;
  const pad = 'M78,150 Q78,118 112,118 L188,118 Q222,118 222,150 L232,214 Q236,240 212,242 Q196,244 184,222 L172,204 L128,204 L116,222 Q104,244 88,242 Q64,240 68,214 Z';
  const body = [
    layer([S('M150,118 Q148,88 176,80 Q206,72 214,46', 5, lime.hex)], W, 2.5),
    layer([S('M128,206 Q120,240 110,262', 10, W), S('M172,206 Q184,238 196,256', 10, W)], W, 0),
    layer([E(102, 270, 22, 12, lime.hex, -6), E(206, 264, 22, 12, lime.hex, -14)], W, 3),
    layer([S('M82,170 Q48,162 44,128', 10, W), S('M218,180 Q254,190 258,222', 10, W)], W, 0),
    layer([C(44, 118, 15, W), C(260, 230, 15, W)], W, 0),
    layer([P(pad, purple.hex)], W, 4),
    `<rect x="94" y="136" width="13" height="34" rx="3" fill="${lime.hex}"/><rect x="83.5" y="146.5" width="34" height="13" rx="3" fill="${lime.hex}"/>`,
    `<circle cx="202" cy="138" r="8" fill="${pink.hex}"/><circle cx="214" cy="154" r="8" fill="${lime.hex}"/>`,
    `<ellipse cx="136" cy="152" rx="10" ry="13" fill="${W}"/><ellipse cx="166" cy="152" rx="10" ry="13" fill="${W}"/>`,
    `<path d="M136,174 q14,16 30,0 z" fill="${W}"/><circle cx="119" cy="170" r="5" fill="${pink.hex}"/><circle cx="183" cy="170" r="5" fill="${pink.hex}"/>`,
  ].join('');
  const holes = `<circle cx="139" cy="155" r="5"/><circle cx="169" cy="155" r="5"/>
    <path d="M36,112 l10,10 M42,106 l10,10 M252,222 l12,8" stroke-width="2.5" fill="none"/>
    <path d="M96,268 l12,0 M200,262 l12,-2" stroke-width="3" fill="none"/>`;
  const heart = (x, y) => `<path d="M${x},${y + 4} l4,-4 l4,4 l4,-4 l4,4 l0,4 l-8,8 l-8,-8 Z" fill="${pink.hex}"/>`;
  return `
  ${knockout(id('ko'), body, holes)}
  ${heart(26, 40)}${heart(46, 40)}${heart(66, 40)}
  <text x="276" y="54" text-anchor="end" font-family="Silkscreen" font-size="13" fill="${W}">LVL 99</text>
  <text x="150" y="334" text-anchor="middle" font-family="Silkscreen" font-weight="700" font-size="44" fill="${W}" textLength="264" lengthAdjust="spacingAndGlyphs">PRESS START</text>
  ${sub('LOAD THE FUN · PLAYER 1', lime.hex)}`;
};
const gameChest = () => `
  <text x="150" y="150" text-anchor="middle" font-family="Silkscreen" font-weight="700" font-size="140" fill="${INK.white.hex}">P1</text>
  <text x="150" y="232" text-anchor="middle" font-family="Silkscreen" font-weight="700" font-size="42" fill="${INK.lime.hex}" letter-spacing="2">READY?</text>
  <rect x="58" y="252" width="184" height="10" fill="${INK.lime.hex}"/>`;

// 3. Space Cadet --------------------------------------------------------------
const astroBack = ({ id }) => {
  const { white, orange, butter } = INK;
  const W = white.hex;
  const body = [
    layer([C(60, 262, 34, butter.hex)], K),
    `<path d="M14,272 Q60,246 110,254" fill="none" stroke="${orange.hex}" stroke-width="6" stroke-linecap="round"/>`,
    layer([S('M240,192 L240,98', 5, K), P('M240,98 L282,110 L240,126 Z', orange.hex)], K, 2.5),
    layer([R(102, 126, 96, 98, 18, W)], K),
    layer([S('M132,224 L124,262', 24, W), S('M168,224 L180,258', 24, W)], K),
    layer([E(122, 272, 18, 11, orange.hex), E(184, 266, 18, 11, orange.hex, -10)], K),
    layer([R(112, 148, 76, 82, 26, W)], K),
    `<rect x="130" y="172" width="40" height="26" rx="6" fill="${orange.hex}"/><circle cx="140" cy="185" r="4" fill="${K}"/><circle cx="152" cy="185" r="4" fill="${K}"/><rect x="158" y="181" width="8" height="8" fill="${K}"/>`,
    layer([S('M116,168 L86,148 L78,116', 18, W), C(78, 108, 12, W), S('M184,170 L214,188 L236,184', 18, W), C(240, 184, 12, W)], K),
    layer([S('M188,74 L198,56', 4, K), C(200, 52, 6, orange.hex)], K, 2),
    layer([C(150, 106, 50, W)], K),
    layer([E(150, 110, 36, 28, K)], K, 0),
  ].join('');
  const holes = `<path d="M126,100 q8,-14 24,-14" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="168" cy="122" r="3.5"/>`;
  return `
  ${[[36, 60, 11, butter.hex], [262, 48, 8, W], [86, 30, 6, W], [270, 244, 9, butter.hex], [228, 290, 5, W]].map(([x, y, r, c]) => `<path d="${sparkle(x, y, r)}" fill="${c}"/>`).join('')}
  ${knockout(id('ko'), body, holes)}
  <circle cx="48" cy="254" r="5" fill="${K}"/><circle cx="70" cy="272" r="3.5" fill="${K}"/>
  ${headline('SPACE CADET', K)}
  ${sub('OUT OF THIS WORLD · MISSION 07', INK.orange.hex)}`;
};
const astroChest = () => `
  <circle cx="150" cy="96" r="58" fill="none" stroke="${K}" stroke-width="12"/>
  <ellipse cx="150" cy="100" rx="38" ry="28" fill="${K}"/>
  <path d="${sparkle(212, 52, 18)}" fill="${INK.orange.hex}"/>
  ${chestWords('SPACE', 'CADET', K)}`;

// 4. Shark Mode ---------------------------------------------------------------
const sharkBack = ({ id }) => {
  const { white, grey, coral } = INK;
  const W = white.hex;
  const body = [
    layer([E(222, 196, 30, 112, coral.hex, 16)], K),
    `<ellipse cx="222" cy="196" rx="5" ry="104" fill="${W}" transform="rotate(16 222 196)"/>`,
    layer([
      P('M150,62 C206,62 222,140 218,214 C214,262 186,284 150,284 C114,284 86,262 82,214 C78,140 94,62 150,62 Z', grey.hex),
      P('M138,70 L154,24 L178,80 Z', grey.hex),
      P('M128,278 L100,314 L150,296 L200,314 L172,278 Z', grey.hex),
    ], K),
    layer([P('M88,190 L44,226 L96,230 Z', grey.hex), P('M212,190 L252,222 L206,230 Z', grey.hex)], K),
    layer([P('M150,196 C188,196 198,236 190,256 C180,276 120,276 110,256 C102,236 112,196 150,196 Z', W)], K, 2.5),
    layer([P('M104,148 Q150,196 196,148 Q150,166 104,148 Z', K)], K, 1),
    `<path d="M112,152 l8,10 l8,-7 l8,9 l8,-8 l8,9 l8,-9 l8,8 l8,-9 l8,7 l8,-10" fill="${W}"/>`,
    `<rect x="102" y="106" width="42" height="24" rx="9" fill="${K}"/><rect x="156" y="106" width="42" height="24" rx="9" fill="${K}"/><path d="M144,114 L156,114" stroke="${K}" stroke-width="5"/>`,
    `<path d="M92,170 q-4,10 0,20 M98,166 q-4,12 0,26 M208,170 q4,10 0,20 M202,166 q4,12 0,26" fill="none" stroke="${K}" stroke-width="3" stroke-linecap="round"/>`,
  ].join('');
  const holes = `<path d="M110,112 l10,0 M164,112 l10,0" stroke-width="4" stroke-linecap="round" fill="none"/>`;
  return `
  <g transform="translate(0 -14)">${knockout(id('ko'), body, holes)}</g>
  ${[[40, 64, 9], [60, 40, 6], [262, 60, 7]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${W}" stroke-width="3"/>`).join('')}
  <text x="150" y="342" text-anchor="middle" ${XW} font-size="46" fill="${K}" textLength="264" lengthAdjust="spacingAndGlyphs" transform="translate(4 4)">STAY CHILL</text>
  <text x="150" y="342" text-anchor="middle" ${XW} font-size="46" fill="${W}" textLength="264" lengthAdjust="spacingAndGlyphs">STAY CHILL</text>
  ${sub('SHARK MODE · ON', INK.coral.hex, 370)}`;
};
const sharkChest = () => `
  <path d="M112,128 L158,36 L196,128 Z" fill="${INK.white.hex}"/>
  <path d="M40,138 q27,-18 55,0 t55,0 t55,0 t55,0" fill="none" stroke="${INK.coral.hex}" stroke-width="10" stroke-linecap="round"/>
  ${chestWords('SHARK', 'MODE', INK.white.hex)}`;

// 5. Built Different (robot) --------------------------------------------------
const robotBack = ({ id }) => {
  const { white, orange, teal } = INK;
  const W = white.hex;
  const body = [
    layer([S('M150,52 L150,28', 5, K), C(150, 24, 8, orange.hex)], K, 2.5),
    layer([S('M96,164 Q62,174 58,206', 16, W), C(58, 214, 13, teal.hex), S('M204,162 Q238,150 244,112', 16, W), C(246, 104, 13, teal.hex)], K),
    layer([R(112, 236, 26, 38, 6, W), R(162, 236, 26, 38, 6, W)], K),
    layer([R(100, 268, 48, 20, 10, teal.hex), R(152, 268, 48, 20, 10, teal.hex)], K),
    layer([R(92, 138, 116, 104, 22, orange.hex)], K),
    `<rect x="114" y="158" width="72" height="48" rx="8" fill="${W}"/>
     ${[0, 1, 2, 3].map((i) => `<rect x="${122 + i * 15}" y="168" width="10" height="20" rx="2" fill="${teal.hex}"/>`).join('')}
     <text x="150" y="200" text-anchor="middle" ${MONO} font-size="9" fill="${K}">B-14</text>
     <circle cx="104" cy="150" r="3.5" fill="${K}"/><circle cx="196" cy="150" r="3.5" fill="${K}"/><circle cx="104" cy="230" r="3.5" fill="${K}"/><circle cx="196" cy="230" r="3.5" fill="${K}"/>`,
    layer([R(84, 76, 14, 32, 4, orange.hex), R(202, 76, 14, 32, 4, orange.hex), R(96, 52, 108, 82, 20, W)], K),
    `<rect x="108" y="64" width="84" height="58" rx="12" fill="${K}"/>
     <rect x="124" y="80" width="14" height="14" rx="2" fill="${teal.hex}"/><rect x="162" y="80" width="14" height="14" rx="2" fill="${teal.hex}"/>
     <path d="M132,104 q18,12 36,0" fill="none" stroke="${teal.hex}" stroke-width="5" stroke-linecap="round"/>`,
  ].join('');
  return `
  ${knockout(id('ko'), body, `<path d="M110,138 l0,0" />`)}
  ${[[44, 60, 8], [260, 196, 7], [36, 270, 6]].map(([x, y, r]) => `<path d="${sparkle(x, y, r)}" fill="${INK.orange.hex}"/>`).join('')}
  ${headline('BUILT DIFFERENT', K, 336, 34)}
  ${sub('MODEL B-14 · BATTERY 100%', INK.orange.hex)}`;
};
const robotChest = () => `
  <rect x="96" y="40" width="108" height="86" rx="20" fill="${K}"/>
  <rect x="122" y="66" width="18" height="18" rx="3" fill="${INK.orange.hex}"/><rect x="160" y="66" width="18" height="18" rx="3" fill="${INK.orange.hex}"/>
  <path d="M130,104 q20,12 40,0" fill="none" stroke="${INK.orange.hex}" stroke-width="6" stroke-linecap="round"/>
  <path d="M150,40 L150,18" stroke="${K}" stroke-width="6"/><circle cx="150" cy="16" r="9" fill="${INK.orange.hex}"/>
  ${chestWords('BUILT', 'DIFFERENT', K)}`;

// 6. Buzzer Beater (basketball mascot) ----------------------------------------
const hoopsBack = ({ id }) => {
  const { cream, orange, red } = INK;
  const CR = cream.hex;
  const body = [
    layer([R(196, 18, 84, 54, 4, CR)], K),
    `<rect x="224" y="36" width="28" height="22" fill="none" stroke="${red.hex}" stroke-width="4"/>`,
    `<path d="M214,82 L222,118 M232,82 L234,118 M250,82 L246,118 M266,82 L258,118 M216,98 L262,98" stroke="${CR}" stroke-width="2.5"/>`,
    layer([S('M150,206 Q140,240 120,262', 9, K), S('M162,206 Q180,236 204,248', 9, K)], K, 0),
    layer([P('M100,258 L126,252 L136,272 L96,278 Z', red.hex), P('M200,236 L222,248 L216,270 L194,256 Z', red.hex)], K),
    `<path d="M98,268 L134,264 M198,252 L220,262" stroke="${CR}" stroke-width="3"/>`,
    layer([S('M106,142 Q76,150 70,178', 9, K), C(68, 186, 13, CR), S('M196,118 Q216,96 222,84', 9, K), C(224, 78, 13, CR)], K, 0),
    layer([S('M206,82 L262,82', 7, orange.hex)], K, 2.5),
    layer([C(150, 150, 60, orange.hex)], K),
    `<path d="M150,90 L150,210 M90,150 L210,150 M108,106 Q140,150 108,194 M192,106 Q160,150 192,194" fill="none" stroke="${K}" stroke-width="3.5"/>`,
    layer([P('M96,124 Q150,92 204,124 L200,138 Q150,110 100,138 Z', red.hex)], K, 3),
    `<path d="M100,130 Q150,104 200,130" fill="none" stroke="${CR}" stroke-width="3"/>`,
    layer([E(132, 152, 13, 15, CR), E(170, 152, 13, 15, CR)], K, 3),
    `<circle cx="135" cy="155" r="6" fill="${K}"/><circle cx="173" cy="155" r="6" fill="${K}"/>`,
    layer([P('M126,176 Q150,204 178,176 Z', K)], K, 2),
    `<path d="M132,178 L174,178 L170,186 L136,186 Z" fill="${CR}"/>`,
  ].join('');
  return `
  ${knockout(id('ko'), body, '')}
  <path d="M40,96 l14,-8 M34,116 l18,-2 M44,76 l10,-12" stroke="${CR}" stroke-width="4" stroke-linecap="round"/>
  ${headline('BUZZER BEATER', CR, 336, 36)}
  ${sub('3 · 2 · 1 · SWISH', orange.hex)}`;
};
const hoopsChest = () => `
  <circle cx="150" cy="96" r="62" fill="${INK.orange.hex}"/>
  <path d="M150,34 L150,158 M88,96 L212,96 M106,52 Q138,96 106,140 M194,52 Q162,96 194,140" fill="none" stroke="#545B3B" stroke-width="7"/>
  ${chestWords('BUZZER', 'BEATER', INK.cream.hex)}`;

const item = (ref, name, colour, chest, back, chestInks, backInks) => ({
  ref, name, colour,
  art: { chest: { svg: chest, inks: chestInks }, back: { svg: back, size: BACK, inks: backInks } },
});

export default {
  id: 'c7-headliners',
  code: 'C7 · BOYS · JUNIOR + BOYS (3–14 YRS)',
  title: 'HEADLINERS',
  technique: 'CHEST 2-COL + BACK 4-COL',
  subtitle: 'cartoon back prints, minimal chest marks',
  layout: 'chest-back',
  countInks: true,
  items: [
    item('HL-01', 'No Bad Days', { name: 'Off White', hex: '#F1EDE4' }, bearChest, bearBack, [INK.black, INK.tomato], [INK.black, INK.cocoa, INK.tomato, INK.sky]),
    item('HL-02', 'Press Start', { name: 'Jet Black', hex: '#141414' }, gameChest, gameBack, [INK.white, INK.lime], [INK.white, INK.lime, INK.purple, INK.pink]),
    item('HL-03', 'Space Cadet', { name: 'Powder Blue', hex: '#A9CDEB' }, astroChest, astroBack, [INK.black, INK.orange], [INK.black, INK.white, INK.orange, INK.butter]),
    item('HL-04', 'Stay Chill', { name: 'Royal Blue', hex: '#2453B8' }, sharkChest, sharkBack, [INK.white, INK.coral], [INK.black, INK.white, INK.grey, INK.coral]),
    item('HL-05', 'Built Different', { name: 'Grey Melange', hex: '#C6C7C9' }, robotChest, robotBack, [INK.black, INK.orange], [INK.black, INK.white, INK.orange, INK.teal]),
    item('HL-06', 'Buzzer Beater', { name: 'Olive', hex: '#545B3B' }, hoopsChest, hoopsBack, [INK.cream, INK.orange], [INK.black, INK.cream, INK.orange, INK.red]),
  ],
};
