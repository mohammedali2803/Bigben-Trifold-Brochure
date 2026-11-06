// Collection 14 — PIN BOARD vol.2. Boys 30–36 oversized, two original prints per founder
// reference (refs 5–8: ransom-note collage, spray tag over clean type, liquid-blob type,
// hem scene). No brands, no dates.
import { sparkle, star, r2 } from '../lib/svg.mjs';
import { rnd, spray, wear, newsLines, scrap, blobMask } from '../lib/pin.mjs';

const SIZE = [300, 400];
const FULL = { name: 'DTF', hex: 'conic-gradient(#00c2ff,#ff3da8,#ffe600,#00c2ff)' };
const I = (name, hex) => ({ name, hex });
const MONO = 'font-family="Space Mono" font-weight="700"';

// 5a/5b. Ransom-note collage: every letter on its own torn scrap ----------------------
const FONTS = ['Instrument Serif', 'Anton', 'Permanent Marker', 'Dela Gothic One', 'Graduate', 'Archivo', 'Rubik Mono One', 'Bungee'];
const ransom = (lines, seed, palette) => ({ id }) => {
  const R = rnd(seed);
  let out = `<defs>${wear(id('w'), 0.1)}</defs>`;
  // newspaper base scraps
  [[24, 80, 252, 230, 3], [40, 70, 120, 60, 5], [170, 250, 110, 70, 7]].forEach(([x, y, w, h, s], k) => {
    out += `<path d="${scrap(x, y, w, h, s, 8)}" fill="#ECE6D8" transform="rotate(${(k - 1) * 3} ${x + w / 2} ${y + h / 2})"/>`;
    out += `<g transform="rotate(${(k - 1) * 3} ${x + w / 2} ${y + h / 2})">${newsLines(x + 4, y + 4, w - 8, h - 8, '#9A958A', s)}</g>`;
  });
  lines.forEach(([word, y, size], li) => {
    const n = word.length, total = n * size * 0.68, x0 = 150 - total / 2;
    word.split('').forEach((ch, i) => {
      const x = x0 + i * size * 0.68, bg = palette[Math.floor(R() * palette.length)], dark = ['#141414', '#1C2E78', '#C8102E', '#2E7D32'].includes(bg);
      const font = FONTS[Math.floor(R() * FONTS.length)], rot = (R() - 0.5) * 12;
      out += `<g transform="rotate(${r2(rot)} ${r2(x + size * 0.32)} ${y - size * 0.35})">
        <path d="${scrap(x, y - size * 0.82, size * 0.64, size * 0.95, seed + li * 20 + i, 3)}" fill="${bg}"/>
        <text x="${r2(x + size * 0.32)}" y="${y}" text-anchor="middle" font-family="${font}" font-size="${size * 0.8}" fill="${dark ? '#FFFFFF' : '#141414'}">${ch}</text></g>`;
    });
  });
  // tape strips
  out += [[30, 74, -20], [236, 300, 18], [250, 84, 30]].map(([x, y, rot]) => `<rect x="${x}" y="${y}" width="46" height="12" fill="#FFC915" opacity=".85" transform="rotate(${rot} ${x + 23} ${y + 6})"/>`).join('');
  out += `<rect x="190" y="318" width="70" height="12" fill="#E5322D" transform="rotate(-6 225 324)"/>`;
  return out;
};
const PAL = ['#FFFFFF', '#141414', '#FFC915', '#E5322D', '#ECE6D8', '#1C2E78', '#2E7D32'];
const keepGoing = ransom([['KEEP', 150, 58], ['GOING', 226, 52], ['!', 292, 52]], 3, PAL);
const makeItHappen = ransom([['MAKE', 140, 56], ['IT', 206, 56], ['HAPPEN', 282, 44]], 9, PAL);

// 6a/6b. Airbrush spray tag behind clean type ---------------------------------------
const sprayTag = (tag, tagColour, script, title, sub, ink) => ({ id }) => `
  <defs>${spray(id('s'), 3.4)}</defs>
  <g filter="url(#${id('s')})" fill="none" stroke="${tagColour}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round">
    <text x="150" y="170" text-anchor="middle" font-family="Sedgwick Ave Display" font-size="150" fill="${tagColour}" stroke="none" transform="rotate(-10 150 170)">${tag[0]}</text>
    <text x="150" y="300" text-anchor="middle" font-family="Sedgwick Ave Display" font-size="140" fill="${tagColour}" stroke="none" transform="rotate(-8 150 300)">${tag[1]}</text>
  </g>
  <text x="150" y="168" text-anchor="middle" font-family="Mrs Saint Delafield" font-size="44" fill="${ink}">${script}</text>
  ${title.map((t, i) => `<text x="150" y="${210 + i * 42}" text-anchor="middle" font-family="Archivo" font-weight="900" font-stretch="expanded" font-size="40" fill="${ink}" textLength="250" lengthAdjust="spacingAndGlyphs">${t}</text>`).join('')}
  <text x="150" y="${210 + title.length * 42 - 18}" text-anchor="middle" ${MONO} font-size="8" fill="${ink}" letter-spacing="2">${sub}</text>`;
const northSide = sprayTag(['GO', 'WILD'], '#FF6A13', 'the original', ['NORTH SIDE', 'CREW'], 'CUSTOM COLLECTION · MADE FOR MOVING', '#1C2340');
const notOrdinary = sprayTag(['NOT', 'BASIC'], '#1FA37A', 'one of a kind', ['NOT', 'ORDINARY'], 'LIMITED RUN · RELAXED FIT', '#141414');

// 7a/7b. Liquid blobs cutting through condensed type ---------------------------------
const liquid = (words, blobTex, typeCol, ghostCol, ribbons) => ({ asset }) => {
  const lines = words.map(([t, y, size, w]) => `<text x="150" y="${y}" text-anchor="middle" font-family="Anton" font-size="${size}" textLength="${w}" lengthAdjust="spacingAndGlyphs">${t}</text>`).join('');
  return `
  <g fill="${ghostCol}">${lines}</g>
  <image href="${asset(`output/assets/textures/${blobTex}.png`)}" x="0" y="0" width="300" height="400" preserveAspectRatio="none"/>
  <g fill="${typeCol}">${lines}</g>
  <g fill="none" stroke="${ghostCol}" stroke-linecap="round">${ribbons.map(([d, w]) => `<path d="${d}" stroke-width="${w}"/>`).join('')}</g>`;
};
const exploreMore = liquid([['EXPLORE', 190, 170, 270], ['MORE', 372, 170, 270]], 'blobs-yellow', '#1C2E78', '#D6DDEE', [['M10,120 C80,60 120,200 200,140 S280,90 300,130', 12], ['M0,250 C70,300 140,200 210,260 S280,300 300,240', 16], ['M40,330 C100,300 160,360 260,320', 9]]);
const bigEnergy = liquid([['BIG', 180, 170, 200], ['ENERGY', 372, 170, 276]], 'blobs-orange', '#141414', '#F6E2D6', [['M0,90 C60,150 120,40 190,110 S260,160 300,100', 14], ['M10,280 C80,230 150,320 220,260 S290,240 300,280', 11]]);

// 8a/8b. Small top wordmark + scene along the hem (3D renders + clean line art) -------
const lineSat = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s}) rotate(-25)" fill="none" stroke="${c}" stroke-width="1.5">
  <rect x="-6" y="-7" width="12" height="14" rx="2"/><path d="M-6,0 h-5 M6,0 h5 M0,-7 v-6"/><circle cx="0" cy="-14" r="2"/>
  ${[-1, 1].map((d) => `<rect x="${d < 0 ? -31 : 11}" y="-6" width="20" height="12"/><path d="M${d < 0 ? -24.3 : 17.7},-6 v12 M${d < 0 ? -17.7 : 24.3},-6 v12 M${d < 0 ? -31 : 11},0 h20"/>`).join('')}</g>`;
const dashes = (x0, y0, x1, y1, c) => `<path d="M${x0},${y0} Q${(x0 + x1) / 2},${y0 - 40} ${x1},${y1}" fill="none" stroke="${c}" stroke-width="1.6" stroke-dasharray="3 5"/>`;
const orbitClub = ({ asset }) => `
  <image href="${asset('output/assets/3d/planet.png')}" x="70" y="18" width="46" height="46"/>
  <text x="124" y="54" font-family="Unbounded" font-weight="900" font-size="28" fill="#141414">ORBIT</text>
  <text x="128" y="70" font-family="Yellowtail" font-size="15" fill="#141414">big · dreamers</text>
  <image href="${asset('output/assets/3d/rocket.png')}" x="0" y="170" width="160" height="160" transform="rotate(30 80 250)"/>
  <image href="${asset('output/assets/3d/planet.png')}" x="170" y="200" width="140" height="140"/>
  ${lineSat(150, 250, 1.2, '#141414')}${dashes(90, 300, 200, 270, '#141414')}
  <text x="40" y="360" font-family="Yellowtail" font-size="34" fill="#141414" transform="rotate(-10 100 350)">Dreamer</text>
  <text x="196" y="372" ${MONO} font-size="7" fill="#141414">from earth · to everywhere</text>
  ${[[150, 210, 7], [270, 210, 5], [30, 186, 6], [220, 350, 5]].map(([x, y, r]) => `<path d="${sparkle(x, y, r)}" fill="#141414"/>`).join('')}
  ${[[110, 230], [250, 200], [60, 330]].map(([x, y]) => `<path d="${star(x, y, 5, 4, 1.8)}" fill="#141414"/>`).join('')}`;
const skyChasers = ({ asset }) => `
  <text x="150" y="54" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="24" fill="#FFFFFF">SKY CHASERS</text>
  <text x="150" y="70" text-anchor="middle" font-family="Yellowtail" font-size="15" fill="#FFD21F">go higher</text>
  <image href="${asset('output/assets/3d/balloon-crop.png')}" x="170" y="168" width="110" height="130" preserveAspectRatio="xMidYMid meet"/>
  <image href="${asset('output/assets/3d/balloon-crop.png')}" x="40" y="214" width="62" height="74" preserveAspectRatio="xMidYMid meet"/>
  ${dashes(70, 300, 230, 290, '#FFFFFF')}
  <path d="M20,360 C80,320 120,370 170,340 S260,330 290,350" fill="none" stroke="#FFFFFF" stroke-width="2"/>
  <text x="30" y="386" font-family="Yellowtail" font-size="30" fill="#FFFFFF">up we go</text>
  <text x="196" y="384" ${MONO} font-size="7" fill="#FFD21F">wind speed: just right</text>
  ${[[130, 200, 6], [150, 250, 4], [30, 190, 5], [270, 320, 5]].map(([x, y, r]) => `<path d="${sparkle(x, y, r)}" fill="#FFD21F"/>`).join('')}`;

const item = (ref, name, colour, svg, inks) => ({ ref, name, colour, art: { front: { svg, size: SIZE, inks } } });

export default {
  id: 'c14-pin-board-2',
  code: 'BOYS · 30–36 · OVERSIZED BACK · REFS 5–8',
  title: 'PIN BOARD 2',
  technique: 'SCREEN + DTF',
  subtitle: 'collage · spray tag · liquid type · hem scene',
  layout: 'single',
  countInks: true,
  cols: 4,
  footer: 'Two original prints per reference. Spray and collage prints suit DTF; liquid type is 3-col screen.',
  items: [
    item('PB-09', 'Keep Going', { name: 'Off White', hex: '#F4F1EA' }, keepGoing, [FULL]),
    item('PB-10', 'Make It Happen', { name: 'Black', hex: '#141414' }, makeItHappen, [FULL]),
    item('PB-11', 'North Side Crew', { name: 'White', hex: '#F7F6F2' }, northSide, [FULL]),
    item('PB-12', 'Not Ordinary', { name: 'White', hex: '#F7F6F2' }, notOrdinary, [FULL]),
    item('PB-13', 'Explore More', { name: 'Cream', hex: '#F1EDE4' }, exploreMore, [I('Navy', '#1C2E78'), I('Yellow', '#FFD21F'), I('Mist', '#C9D2E8')]),
    item('PB-14', 'Big Energy', { name: 'White', hex: '#F7F6F2' }, bigEnergy, [I('Black', '#141414'), I('Orange', '#FF5A1F'), I('Peach', '#F2C9B4')]),
    item('PB-15', 'Orbit Club', { name: 'Light Grey', hex: '#E4E4E2' }, orbitClub, [FULL]),
    item('PB-16', 'Sky Chasers', { name: 'Navy', hex: '#1C2340' }, skyChasers, [FULL]),
  ],
};
