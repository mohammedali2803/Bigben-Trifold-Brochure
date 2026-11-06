// Original 3D / procedural artwork for the photo-print collection.
// Loaded by render.html?scene=<name>&size=<px>; sets window.renderDone when finished.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { TTFLoader } from 'three/addons/loaders/TTFLoader.js';
import { Font } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { createNoise2D, createNoise3D } from 'simplex-noise';

const params = new URLSearchParams(location.search);
const SIZE = Number(params.get('size') ?? 2000);
const FONTS = {
  bagel: '/fonts/hYkPPucsQOr5dy02WmQr5Zkd0B4.ttf',
  archivo: '/fonts/k3k6o8UDI-1M0wlSV9XAw6lQkqWY8Q82sJaRE-NWIDdgffTTnTRp8A.ttf',
  rubik: '/fonts/UqyJK8kPP3hjw6ANTdfRk9YSN-8w.ttf',
  unbounded900: '/fonts/Yq6F-LOTXCb04q32xlpat-6uR42XTqtG67H2040.ttf',
};

// Seeded PRNG so renders are repeatable.
function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeRenderer() {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(SIZE, SIZE);
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  document.body.appendChild(renderer.domElement);
  return renderer;
}

function studioEnv(renderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  return pmrem.fromScene(new RoomEnvironment(), 0.03).texture;
}

// Sky/horizon/ground gradient with bright strips: gives chrome its Y2K look.
function chromeEnv(renderer) {
  const scene = new THREE.Scene();
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(20, 64, 32),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {},
      vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      fragmentShader: `varying vec3 vP;
        void main(){
          float y = vP.y;
          vec3 top = vec3(0.04,0.16,0.62), hz = vec3(1.0), low = vec3(0.95,0.45,0.85), floorC = vec3(0.01,0.01,0.03);
          vec3 c = y > 0.0 ? mix(hz, top, smoothstep(0.0, 0.55, y)) : mix(low, floorC, smoothstep(0.0, 0.35, -y));
          c = mix(c, hz, exp(-abs(y) * 60.0));
          c = y < 0.0 ? mix(low, floorC, smoothstep(0.0, 0.12, -y)) : c;
          gl_FragColor = vec4(c, 1.0);
        }`,
    }),
  );
  scene.add(sky);
  const strip = new THREE.MeshBasicMaterial({ color: 0xffffff });
  [[-6, 3, -8], [7, 5, -5], [0, 9, 6]].forEach(([x, y, z]) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(6, 0.8), strip);
    m.position.set(x, y, z);
    m.lookAt(0, 0, 0);
    scene.add(m);
  });
  const pmrem = new THREE.PMREMGenerator(renderer);
  return pmrem.fromScene(scene, 0.01).texture;
}

async function loadFont(key) {
  const json = await new TTFLoader().loadAsync(FONTS[key]);
  return new Font(json);
}

// Frame the camera so `object` fills `fill` of the square frame.
function frame(camera, object, fill = 0.86) {
  const box = new THREE.Box3().setFromObject(object);
  const sphere = box.getBoundingSphere(new THREE.Sphere());
  const fov = (camera.fov * Math.PI) / 180;
  const dist = sphere.radius / Math.sin(fov / 2) / fill;
  const dir = camera.position.clone().sub(sphere.center).normalize();
  if (!isFinite(dir.x)) dir.set(0, 0, 1);
  camera.position.copy(sphere.center).addScaledVector(dir, dist);
  camera.lookAt(sphere.center);
  camera.near = dist / 50;
  camera.far = dist * 10;
  camera.updateProjectionMatrix();
}

const glossy = (color, extra = {}) =>
  new THREE.MeshPhysicalMaterial({ color, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.06, ...extra });

function textMesh(font, text, material, opts) {
  const geo = new TextGeometry(text, { font, size: 1, depth: 0.3, curveSegments: 24, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.05, bevelSegments: 10, ...opts });
  geo.computeBoundingBox();
  const b = geo.boundingBox;
  geo.translate(-(b.min.x + b.max.x) / 2, -(b.min.y + b.max.y) / 2, -(b.min.z + b.max.z) / 2);
  return new THREE.Mesh(geo, material);
}


// Studio setup shared by the summer toy renders.
const metal = (color) => new THREE.MeshPhysicalMaterial({ color, metalness: 1, roughness: 0.18 });
const matte = (color) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.75 });
function toyStage(renderer) {
  const scene = new THREE.Scene();
  scene.environment = studioEnv(renderer);
  const key = new THREE.DirectionalLight(0xffffff, 1.5); key.position.set(-4, 6, 6); scene.add(key);
  const rim = new THREE.DirectionalLight(0xffffff, 0.6); rim.position.set(5, 3, -4); scene.add(rim);
  return scene;
}
function shot(scene, object, from, fill) {
  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
  camera.position.set(...from);
  frame(camera, object, fill);
  return { scene, camera };
}

const SCENES = {
  // Inflated, candy-gloss bubble letters.
  async play(renderer) {
    const scene = new THREE.Scene();
    scene.environment = studioEnv(renderer);
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(-3, 5, 6);
    scene.add(key);
    const font = await loadFont('bagel');
    const colours = [0xff7fb0, 0x5fb8ff, 0xffd23f, 0x52d99a];
    const group = new THREE.Group();
    let x = 0;
    const tilt = [[0.06, -0.18], [-0.08, 0.1], [0.07, -0.08], [-0.06, 0.2]];
    'PLAY'.split('').forEach((ch, i) => {
      const m = textMesh(font, ch, glossy(colours[i]), { depth: 0.42, bevelThickness: 0.26, bevelSize: 0.13, bevelSegments: 14 });
      const w = m.geometry.boundingBox.max.x - m.geometry.boundingBox.min.x;
      m.position.set(x + w / 2, i % 2 ? 0.08 : -0.06, 0);
      m.rotation.set(0, tilt[i][1], tilt[i][0]);
      x += w + 0.02;
      group.add(m);
    });
    group.position.x = -x / 2;
    scene.add(group);
    const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
    camera.position.set(0.6, -0.9, 8);
    frame(camera, group, 0.92);
    return { scene, camera };
  },

  // Liquid-chrome wordmark.
  async future(renderer) {
    const scene = new THREE.Scene();
    scene.environment = chromeEnv(renderer);
    const font = await loadFont('bagel');
    const chrome = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1, roughness: 0.04 });
    const mesh = textMesh(font, 'FUTURE', chrome, { depth: 0.3, bevelThickness: 0.3, bevelSize: 0.12, bevelSegments: 20, curveSegments: 32 });
    mesh.rotation.set(-0.18, 0.22, 0.04);
    scene.add(mesh);
    const camera = new THREE.PerspectiveCamera(24, 1, 0.1, 100);
    camera.position.set(0, 0.5, 8);
    frame(camera, mesh, 0.95);
    return { scene, camera };
  },

  // Two-line liquid-chrome bubble wordmark.
  async nostress(renderer) {
    const scene = new THREE.Scene();
    scene.environment = chromeEnv(renderer);
    const font = await loadFont('bagel');
    const chrome = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1, roughness: 0.04 });
    const opts = { depth: 0.3, bevelThickness: 0.3, bevelSize: 0.12, bevelSegments: 20, curveSegments: 32 };
    const top = textMesh(font, 'NO', chrome, opts);
    const bottom = textMesh(font, 'STRESS', chrome, opts);
    top.position.y = 0.62;
    bottom.position.y = -0.62;
    top.scale.setScalar(1.25);
    const group = new THREE.Group().add(top, bottom);
    group.rotation.set(-0.16, 0.2, -0.06);
    scene.add(group);
    const camera = new THREE.PerspectiveCamera(24, 1, 0.1, 100);
    camera.position.set(0, 0.4, 8);
    frame(camera, group, 0.97);
    return { scene, camera };
  },

  // Iridescent inflated wordmark.
  async jugaad(renderer) {
    const scene = new THREE.Scene();
    scene.environment = chromeEnv(renderer);
    const font = await loadFont('bagel');
    const holo = new THREE.MeshPhysicalMaterial({
      color: 0xffd6f5, metalness: 0.85, roughness: 0.06, iridescence: 1, iridescenceIOR: 1.8, iridescenceThicknessRange: [180, 900],
    });
    const mesh = textMesh(font, 'JUGAAD', holo, { depth: 0.32, bevelThickness: 0.3, bevelSize: 0.12, bevelSegments: 20, curveSegments: 32 });
    mesh.rotation.set(-0.14, -0.22, 0.05);
    scene.add(mesh);
    const camera = new THREE.PerspectiveCamera(24, 1, 0.1, 100);
    camera.position.set(0, 0.4, 8);
    frame(camera, mesh, 0.97);
    return { scene, camera };
  },

  // --- Summer kids: realistic toy renders -------------------------------------
  async firetruck(renderer) {
    const scene = toyStage(renderer);
    const red = glossy(0xe8322a), white = glossy(0xf7f4ee), steel = metal(0xc9ced6), rubber = matte(0x23252b);
    const g = new THREE.Group();
    const box = (w, h, d, r, mat, x, y, z) => { const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 6, r), mat); m.position.set(x, y, z); g.add(m); return m; };
    box(3.5, 0.42, 1.36, 0.12, rubber, 0, 0.62, 0);
    box(2.15, 1.0, 1.42, 0.16, red, -0.62, 1.28, 0);
    box(1.2, 1.25, 1.42, 0.22, red, 1.08, 1.4, 0);
    box(0.08, 0.5, 1.12, 0.03, glossy(0x8fd3ff, { roughness: 0.04 }), 1.68, 1.62, 0);
    box(0.62, 0.46, 0.06, 0.03, glossy(0x8fd3ff, { roughness: 0.04 }), 1.12, 1.66, 0.72);
    box(2.1, 0.12, 0.04, 0.02, white, -0.62, 1.12, 0.72);
    box(1.15, 0.12, 0.04, 0.02, white, 1.08, 1.12, 0.72);
    [-1.25, -0.62, 0].forEach((x) => box(0.5, 0.56, 0.05, 0.04, steel, x, 1.38, 0.72));
    box(0.12, 0.3, 1.5, 0.05, steel, 1.74, 0.78, 0);
    [0.42, -0.42].forEach((z) => { const l = box(0.22, 0.16, 0.16, 0.06, glossy(0xffe066, { emissive: 0xffd23f, emissiveIntensity: 0.4 }), 1.72, 1.02, z); });
    box(0.36, 0.16, 0.26, 0.07, glossy(0xff3b3b, { emissive: 0xff2020, emissiveIntensity: 0.5 }), 0.92, 2.1, -0.28);
    box(0.36, 0.16, 0.26, 0.07, glossy(0x3b7bff, { emissive: 0x2050ff, emissiveIntensity: 0.5 }), 0.92, 2.1, 0.28);
    const ladder = new THREE.Group();
    [-0.32, 0.32].forEach((z) => { const r = new THREE.Mesh(new RoundedBoxGeometry(2.9, 0.09, 0.09, 4, 0.03), steel); r.position.set(0, 0, z); ladder.add(r); });
    for (let i = 0; i < 11; i++) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.64, 12), steel); c.rotation.x = Math.PI / 2; c.position.set(-1.35 + i * 0.27, 0, 0); ladder.add(c); }
    ladder.position.set(-0.5, 1.95, 0); ladder.rotation.z = 0.14; g.add(ladder);
    const reel = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.08, 16, 40), glossy(0xffd23f)); reel.position.set(-1.25, 1.38, 0.78); g.add(reel);
    [[-1.15, 0.7], [-1.15, -0.7], [1.15, 0.7], [1.15, -0.7]].forEach(([x, z]) => {
      const t = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.32, 40), rubber); t.rotation.x = Math.PI / 2; t.position.set(x, 0.42, z); g.add(t);
      const h = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.34, 32), steel); h.rotation.x = Math.PI / 2; h.position.set(x, 0.42, z); g.add(h);
    });
    scene.add(g);
    return shot(scene, g, [4.2, 2.4, 6.4], 0.92);
  },

  async duck(renderer) {
    const scene = toyStage(renderer);
    const yellow = glossy(0xffcf1f), orange = glossy(0xff8a1f), black = glossy(0x111111, { roughness: 0.1 });
    const g = new THREE.Group();
    const ell = (r, sx, sy, sz, mat, x, y, z) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 64, 48), mat); m.scale.set(sx, sy, sz); m.position.set(x, y, z); g.add(m); return m; };
    ell(1, 1.3, 0.92, 1.0, yellow, 0, 0, 0);
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.7, 32), yellow); tail.position.set(-1.25, 0.45, 0); tail.rotation.z = 0.9; g.add(tail);
    ell(0.66, 1, 1, 1, yellow, 0.62, 1.02, 0);
    ell(0.34, 1.25, 0.42, 1.0, orange, 1.2, 0.92, 0);
    ell(0.3, 1.1, 0.3, 0.9, orange, 1.12, 0.78, 0);
    [0.3, -0.3].forEach((z) => { ell(0.1, 1, 1.2, 1, black, 0.98, 1.2, z); ell(0.035, 1, 1, 1, glossy(0xffffff), 1.06, 1.27, z * 1.1); });
    ell(0.5, 1.3, 0.55, 0.3, glossy(0xffc000), -0.15, 0.15, 0.86).rotation.z = -0.25;
    const stripes = document.createElement('canvas'); stripes.width = 512; stripes.height = 8;
    const sc = stripes.getContext('2d'); for (let i = 0; i < 8; i++) { sc.fillStyle = i % 2 ? '#ffffff' : '#ff3b4f'; sc.fillRect(i * 64, 0, 64, 8); }
    const tex = new THREE.CanvasTexture(stripes); tex.colorSpace = THREE.SRGBColorSpace;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.32, 0.36, 48, 128), new THREE.MeshPhysicalMaterial({ map: tex, roughness: 0.2, clearcoat: 1 }));
    ring.rotation.x = Math.PI / 2 - 0.08; ring.position.y = -0.42; g.add(ring);
    [[1.9, -0.3, 0.6, 0.12], [2.15, 0.1, 0.3, 0.08], [-1.9, -0.2, 0.5, 0.1], [-2.1, 0.25, 0.2, 0.07]].forEach(([x, y, z, r]) => ell(r, 1, 1.25, 1, glossy(0x7cc8ff, { roughness: 0.03, transmission: 0.3 }), x, y, z));
    g.rotation.y = -0.45;
    scene.add(g);
    return shot(scene, g, [0.6, 1.6, 7], 0.9);
  },

  async lolly(renderer) {
    const scene = toyStage(renderer);
    const shape = new THREE.Shape();
    shape.moveTo(-0.62, -1.1); shape.lineTo(0.62, -1.1); shape.lineTo(0.62, 0.9);
    shape.absarc(0.62, 1.32, 0.42, -Math.PI / 2, -Math.PI, true);
    shape.lineTo(-0.3, 1.32); shape.quadraticCurveTo(-0.62, 1.32, -0.62, 1.0); shape.lineTo(-0.62, -1.1);
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.32, bevelEnabled: true, bevelThickness: 0.14, bevelSize: 0.12, bevelSegments: 12, curveSegments: 48 });
    geo.translate(0, 0, -0.16);
    const pos = geo.attributes.position, col = [];
    const red = new THREE.Color(0xff3d57), white = new THREE.Color(0xfff6ea), green = new THREE.Color(0x2fbf5b);
    for (let i = 0; i < pos.count; i++) { const y = pos.getY(i); const c = y > -0.62 ? red : y > -0.78 ? white : green; col.push(c.r, c.g, c.b); }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    const g = new THREE.Group();
    g.add(new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.05 })));
    [[-0.3, 0.6], [0.05, 0.25], [0.35, 0.5], [-0.2, -0.05], [0.3, -0.2], [-0.4, 0.15], [0.05, 0.85], [0.0, -0.4]].forEach(([x, y], i) => {
      const s = new THREE.Mesh(new THREE.SphereGeometry(0.06, 24, 16), glossy(0x1b1b1b)); s.scale.set(0.8, 1.4, 0.5); s.position.set(x, y, 0.3); s.rotation.z = (i % 3 - 1) * 0.4; g.add(s);
    });
    const stick = new THREE.Mesh(new RoundedBoxGeometry(0.32, 1.3, 0.12, 6, 0.06), matte(0xe0b67a)); stick.position.set(0, -1.75, 0); g.add(stick);
    [[-0.45, -1.32, 0.13], [0.3, -1.38, 0.1], [0.55, -1.25, 0.08]].forEach(([x, y, r]) => { const d = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 24), glossy(0x2fbf5b)); d.scale.set(1, 1.5, 1); d.position.set(x, y, 0.12); g.add(d); });
    g.rotation.set(0.05, -0.35, -0.22);
    scene.add(g);
    return shot(scene, g, [0.4, 0.2, 7], 0.92);
  },

  async racecar(renderer) {
    const scene = toyStage(renderer);
    const blue = glossy(0x1f6bff), white = glossy(0xffffff), rubber = matte(0x1e1f24), steel = metal(0xd6dbe2);
    const side = new THREE.Shape();
    side.moveTo(-1.9, 0.25); side.lineTo(1.75, 0.25); side.quadraticCurveTo(2.05, 0.3, 1.95, 0.55);
    side.lineTo(0.75, 0.78); side.quadraticCurveTo(0.35, 1.25, -0.35, 1.2); side.quadraticCurveTo(-0.85, 1.15, -1.1, 0.86);
    side.lineTo(-1.85, 0.86); side.quadraticCurveTo(-2.0, 0.6, -1.9, 0.25);
    const body = new THREE.ExtrudeGeometry(side, { depth: 1.0, bevelEnabled: true, bevelThickness: 0.22, bevelSize: 0.16, bevelSegments: 12, curveSegments: 32 });
    body.translate(0, 0, -0.5);
    const g = new THREE.Group();
    g.add(new THREE.Mesh(body, blue));
    const glass = new THREE.Mesh(new THREE.SphereGeometry(0.62, 48, 32, 0, Math.PI * 2, 0, Math.PI / 2), glossy(0x1a2a44, { roughness: 0.03, metalness: 0.3 }));
    glass.scale.set(1.15, 0.62, 0.95); glass.position.set(-0.15, 0.98, 0); g.add(glass);
    [0.22, -0.22].forEach((z) => { const st = new THREE.Mesh(new RoundedBoxGeometry(3.0, 0.03, 0.14, 2, 0.01), white); st.position.set(0.25, 0.9 + 0.02, z); st.rotation.z = -0.08; g.add(st); });
    const spoiler = new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.08, 1.7, 4, 0.03), white); spoiler.position.set(-1.85, 1.22, 0); g.add(spoiler);
    [0.5, -0.5].forEach((z) => { const p = new THREE.Mesh(new RoundedBoxGeometry(0.08, 0.36, 0.08, 2, 0.02), white); p.position.set(-1.8, 1.02, z); g.add(p); });
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.04, 48), white); disc.rotation.x = Math.PI / 2; disc.position.set(-0.05, 0.6, 0.73); g.add(disc);
    const font = await loadFont('bagel');
    const num = textMesh(font, '7', glossy(0x111111), { size: 0.5, depth: 0.04, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 2 });
    num.position.set(-0.05, 0.6, 0.77); g.add(num);
    [[1.25, 0.62], [1.25, -0.62], [-1.2, 0.62], [-1.2, -0.62]].forEach(([x, z]) => {
      const r = x < 0 ? 0.46 : 0.4;
      const t = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.42, 48), rubber); t.rotation.x = Math.PI / 2; t.position.set(x, r - 0.02, z); g.add(t);
      const h = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.55, r * 0.55, 0.44, 32), steel); h.rotation.x = Math.PI / 2; h.position.set(x, r - 0.02, z); g.add(h);
    });
    scene.add(g);
    return shot(scene, g, [3.6, 1.6, 6.2], 0.94);
  },

  async balloon(renderer) {
    const scene = toyStage(renderer);
    const prof = [[0.001, -1.2], [0.42, -1.05], [0.95, -0.4], [1.28, 0.35], [1.32, 0.9], [1.12, 1.5], [0.7, 1.92], [0.001, 2.08]].map(([r, y]) => new THREE.Vector2(r, y));
    const curve = new THREE.SplineCurve(prof);
    let geo = new THREE.LatheGeometry(curve.getPoints(80), 96).toNonIndexed();
    const palette = [0xff3b4f, 0xffd23f, 0x2fb6ff, 0xffffff].map((c) => new THREE.Color(c));
    const pos = geo.attributes.position, col = [];
    for (let i = 0; i < pos.count; i += 3) {
      const cx = (pos.getX(i) + pos.getX(i + 1) + pos.getX(i + 2)) / 3, cz = (pos.getZ(i) + pos.getZ(i + 1) + pos.getZ(i + 2)) / 3;
      const k = Math.floor(((Math.atan2(cz, cx) + Math.PI) / (Math.PI * 2)) * 12) % 4;
      for (let j = 0; j < 3; j++) col.push(palette[k].r, palette[k].g, palette[k].b);
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    geo.computeVertexNormals();
    const g = new THREE.Group();
    g.add(new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.35, clearcoat: 0.6, side: THREE.DoubleSide })));
    const basket = new THREE.Mesh(new RoundedBoxGeometry(0.62, 0.42, 0.62, 6, 0.08), matte(0xb07a45)); basket.position.y = -1.9; g.add(basket);
    const rim = new THREE.Mesh(new RoundedBoxGeometry(0.68, 0.08, 0.68, 4, 0.03), matte(0x7a4d26)); rim.position.y = -1.68; g.add(rim);
    [[0.28, 0.28], [-0.28, 0.28], [0.28, -0.28], [-0.28, -0.28]].forEach(([x, z]) => {
      const a = new THREE.Vector3(x, -1.68, z), b = new THREE.Vector3(x * 1.4, -1.12, z * 1.4);
      const len = a.distanceTo(b); const r = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, len, 6), matte(0x5a3a20));
      r.position.copy(a.clone().add(b).multiplyScalar(0.5)); r.lookAt(b); r.rotateX(Math.PI / 2); g.add(r);
    });
    const cloud = (x, y, z, s) => { [[0, 0, 0.5], [0.45, 0.12, 0.42], [-0.45, 0.08, 0.38], [0.18, 0.32, 0.36], [-0.2, 0.28, 0.34]].forEach(([dx, dy, r]) => { const c = new THREE.Mesh(new THREE.SphereGeometry(r * s, 48, 32), matte(0xffffff)); c.position.set(x + dx * s, y + dy * s, z); g.add(c); }); };
    cloud(-1.6, -1.95, 0.4, 0.9); cloud(1.55, -1.5, -0.2, 0.75);
    g.rotation.y = 0.3;
    scene.add(g);
    return shot(scene, g, [0, 0.2, 9], 0.95);
  },

  async whale(renderer) {
    const scene = toyStage(renderer);
    const blue = glossy(0x2f7bff), belly = glossy(0xe4f4ff), water = glossy(0x8fd8ff, { roughness: 0.03 });
    const g = new THREE.Group();
    const ell = (r, sx, sy, sz, mat, x, y, z, rz = 0) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 64, 48), mat); m.scale.set(sx, sy, sz); m.position.set(x, y, z); m.rotation.z = rz; g.add(m); return m; };
    ell(1, 1.55, 0.95, 1.0, blue, 0, 0, 0);
    ell(1, 1.35, 0.6, 0.86, belly, 0.12, -0.42, 0.06);
    ell(0.5, 1.4, 0.55, 0.6, blue, -1.55, 0.18, 0, 0.35);
    ell(0.42, 1.2, 0.28, 0.75, blue, -2.05, 0.55, 0.32, 0.7);
    ell(0.42, 1.2, 0.28, 0.75, blue, -2.05, 0.55, -0.32, 0.7);
    ell(0.34, 1.3, 0.3, 0.8, blue, 0.35, -0.5, 0.92, -0.5);
    ell(0.11, 1, 1.15, 0.6, glossy(0x111111, { roughness: 0.08 }), 1.05, 0.18, 0.72);
    ell(0.035, 1, 1, 1, glossy(0xffffff), 1.09, 0.24, 0.79);
    [[0.6, 1.0, 0.16], [0.6, 1.35, 0.14], [0.45, 1.65, 0.12], [0.8, 1.62, 0.12], [0.3, 1.9, 0.1], [0.95, 1.9, 0.1], [0.62, 1.95, 0.11]].forEach(([x, y, r]) => ell(r, 1, 1.15, 1, water, x, y, 0.1));
    g.rotation.set(0.05, -0.35, 0.06);
    scene.add(g);
    return shot(scene, g, [0.5, 0.8, 8], 0.92);
  },

  async yay(renderer) {
    const scene = toyStage(renderer);
    const font = await loadFont('bagel');
    const colours = [0xff5fa2, 0xffc23d, 0x3fa9ff, 0x3fd69a];
    const group = new THREE.Group();
    let x = 0;
    const tilt = [[0.1, -0.2, 0.05], [-0.08, 0.15, -0.06], [0.06, -0.12, 0.08], [-0.05, 0.2, -0.1]];
    'YAY!'.split('').forEach((ch, i) => {
      const foil = new THREE.MeshPhysicalMaterial({ color: colours[i], metalness: 0.35, roughness: 0.14, clearcoat: 1, clearcoatRoughness: 0.05, iridescence: 0.4 });
      const m = textMesh(font, ch, foil, { depth: 0.4, bevelThickness: 0.34, bevelSize: 0.16, bevelSegments: 20, curveSegments: 32 });
      const w = m.geometry.boundingBox.max.x - m.geometry.boundingBox.min.x;
      m.position.set(x + w / 2, i % 2 ? 0.14 : -0.06, 0);
      m.rotation.set(...tilt[i]);
      x += w + 0.06;
      group.add(m);
    });
    group.position.x = -x / 2;
    scene.add(group);
    const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
    camera.position.set(0.3, -0.4, 8);
    frame(camera, group, 0.95);
    return { scene, camera };
  },

  // Parametric word: ?text=LINE1|LINE2&colors=hex,hex&mat=puff|gloss|chrome&font=bagel&per=letter|line
  async word(renderer) {
    const mat = params.get('mat') ?? 'gloss';
    const scene = mat === 'chrome' ? new THREE.Scene() : toyStage(renderer);
    if (mat === 'chrome') scene.environment = chromeEnv(renderer);
    if (mat === 'puff') { scene.environment = studioEnv(renderer); }
    const font = await loadFont(params.get('font') ?? 'bagel');
    const cols = (params.get('colors') ?? 'ffffff').split(',').map((c) => parseInt(c, 16));
    const per = params.get('per') ?? 'line';
    const material = (c) => mat === 'chrome' ? new THREE.MeshPhysicalMaterial({ color: c, metalness: 1, roughness: 0.05 })
      : mat === 'puff' ? new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.92, sheen: 1, sheenRoughness: 0.8, sheenColor: 0xffffff })
      : glossy(c);
    const bevel = mat === 'puff' ? { depth: 0.16, bevelThickness: 0.22, bevelSize: 0.07, bevelSegments: 18, curveSegments: 28 }
      : { depth: 0.3, bevelThickness: 0.28, bevelSize: 0.11, bevelSegments: 18, curveSegments: 28 };
    const group = new THREE.Group();
    const lines = (params.get('text') ?? 'WORD').split('|');
    let k = 0;
    lines.forEach((ln, li) => {
      const row = new THREE.Group(); let x = 0;
      ln.split('').forEach((ch) => {
        if (ch === ' ') { x += 0.45; return; }
        const m = textMesh(font, ch, material(cols[(per === 'letter' ? k : li) % cols.length]), bevel);
        const w = m.geometry.boundingBox.max.x - m.geometry.boundingBox.min.x;
        m.position.x = x + w / 2; m.rotation.z = per === 'letter' ? ((k % 3) - 1) * 0.05 : 0;
        x += w + 0.04; k++; row.add(m);
      });
      row.position.set(-x / 2, -li * 1.15, 0);
      group.add(row);
    });
    group.rotation.set(-0.12, Number(params.get('ry') ?? 0.12), Number(params.get('rz') ?? 0.03));
    scene.add(group);
    if (mat === 'puff') { const l = new THREE.DirectionalLight(0xffffff, 1.3); l.position.set(-3, 6, 5); scene.add(l); }
    const camera = new THREE.PerspectiveCamera(24, 1, 0.1, 100);
    camera.position.set(0, 0.3, 8);
    frame(camera, group, 0.96);
    return { scene, camera };
  },

  // Keychain bundle: ?v=1|2
  async keychain(renderer) {
    const scene = toyStage(renderer);
    const v = params.get('v') ?? '1';
    const steel = metal(0xd9dde3), font = await loadFont('archivo');
    const g = new THREE.Group();
    const add = (m, x, y, z = 0, rx = 0, ry = 0, rz = 0) => { m.position.set(x, y, z); m.rotation.set(rx, ry, rz); g.add(m); return m; };
    const clipCol = v === '1' ? 0x2f5bff : 0xff5a1f;
    const clip = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.07, 24, 96, Math.PI * 1.9), glossy(clipCol, { metalness: 0.4 }));
    clip.scale.set(0.62, 1.15, 1); add(clip, 0.55, 2.45, 0, 0, 0, 0.5);
    add(new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.045, 20, 80), steel), 0.15, 1.55, 0, 0.3, 0.6, 0);
    const chain = (x0, y0, x1, y1) => { const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 0.11); for (let i = 0; i < n; i++) { const t = (i + 0.5) / n; add(new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.022, 12, 32), steel), x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, 0, 0, i % 2 ? Math.PI / 2 : 0, 0); } };
    // Tag with text
    const tagShape = new THREE.Shape(); [[0, 1.3], [0.45, 1.0], [0.45, -1.0], [0, -1.3], [-0.45, -1.0], [-0.45, 1.0]].forEach(([x, y], i) => i ? tagShape.lineTo(x, y) : tagShape.moveTo(x, y));
    const tag = new THREE.Mesh(new THREE.ExtrudeGeometry(tagShape, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 6 }), glossy(v === '1' ? 0xd7ff3b : 0x3fd6c6));
    const tagG = new THREE.Group(); tagG.add(tag);
    const words = v === '1' ? ['SCHOOL', "IS OUT"] : ['GAME', 'ROOM'];
    words.forEach((w, i) => { const t = textMesh(font, w, glossy(0x1c2340), { size: 0.17, depth: 0.03, bevelThickness: 0.01, bevelSize: 0.005, bevelSegments: 2 }); t.rotation.z = Math.PI / 2; t.position.set(-0.1 + i * 0.26, 0, 0.17); tagG.add(t); });
    tagG.position.set(-0.75, -0.05, 0); tagG.rotation.z = 0.42; g.add(tagG);
    chain(0.0, 1.3, -0.45, 1.05, 4);
    // Key
    const key = new THREE.Group();
    key.add(new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.07, 24, 64), steel));
    const blade = new THREE.Mesh(new RoundedBoxGeometry(0.13, 1.0, 0.05, 2, 0.02), steel); blade.position.y = -0.65; key.add(blade);
    [-0.5, -0.75, -0.95].forEach((y) => { const t = new THREE.Mesh(new RoundedBoxGeometry(0.1, 0.07, 0.05, 2, 0.01), steel); t.position.set(0.1, y, 0); key.add(t); });
    key.position.set(0.35, 0.95, 0.1); key.rotation.z = -0.15; g.add(key);
    // Charms
    if (v === '1') {
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.36, 64, 48), glossy(0xc8102e, { roughness: 0.3 }));
      add(ball, 1.25, 0.55, 0.1); add(new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.018, 12, 80), glossy(0xfff1d6)), 1.25, 0.55, 0.1, 0.2, 1.2, 0);
      chain(0.35, 1.4, 1.2, 0.92, 5);
      const st = new THREE.Shape(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 0.17 : 0.4, a = (i * Math.PI) / 5 + Math.PI / 2; i ? st.lineTo(r * Math.cos(a), r * Math.sin(a)) : st.moveTo(r * Math.cos(a), r * Math.sin(a)); }
      add(new THREE.Mesh(new THREE.ExtrudeGeometry(st, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 8 }), glossy(0xffc915)), 1.55, 1.55, 0, 0, 0, 0.3);
      chain(0.4, 1.55, 1.25, 1.58, 4);
      const sneaker = new THREE.Group();
      sneaker.add(new THREE.Mesh(new RoundedBoxGeometry(0.9, 0.34, 0.36, 6, 0.14), glossy(0xffffff)));
      const sole = new THREE.Mesh(new RoundedBoxGeometry(0.96, 0.1, 0.4, 4, 0.04), glossy(0xff5a1f)); sole.position.y = -0.2; sneaker.add(sole);
      const top = new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.28, 0.34, 6, 0.12), glossy(0xffffff)); top.position.set(-0.2, 0.22, 0); sneaker.add(top);
      sneaker.position.set(-0.35, -1.75, 0.1); sneaker.rotation.set(0.2, -0.4, -0.3); g.add(sneaker);
      chain(-0.75, -1.4, -0.45, -1.55, 3);
    } else {
      const pad = new THREE.Group();
      pad.add(new THREE.Mesh(new RoundedBoxGeometry(0.95, 0.5, 0.2, 8, 0.2), glossy(0x8b5cff)));
      [[-0.25, 0.05], [0.25, 0.05]].forEach(([x, y], i) => { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.08, 24), glossy(i ? 0xff3e9a : 0xd7ff3b)); b.rotation.x = Math.PI / 2; b.position.set(x, y, 0.12); pad.add(b); });
      pad.position.set(1.25, 0.55, 0.1); pad.rotation.z = -0.25; g.add(pad); chain(0.35, 1.4, 1.2, 0.85, 5);
      const dieM = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.5, 0.5, 6, 0.1), glossy(0xffffff));
      add(dieM, 1.5, 1.6, 0, 0.5, 0.6, 0.2);
      [[0, 0], [-0.12, 0.12], [0.12, -0.12]].forEach(([x, y]) => { const pip = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 12), glossy(0x111111)); pip.position.set(x, y, 0.25); dieM.add(pip); });
      chain(0.4, 1.55, 1.25, 1.6, 4);
      const hs = new THREE.Shape(); hs.moveTo(0, -0.35); hs.bezierCurveTo(-0.6, 0.0, -0.3, 0.45, 0, 0.2); hs.bezierCurveTo(0.3, 0.45, 0.6, 0.0, 0, -0.35);
      add(new THREE.Mesh(new THREE.ExtrudeGeometry(hs, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 8 }), glossy(0xff3b4f)), -0.4, -1.7, 0.1, 0, 0, -0.2);
      chain(-0.75, -1.4, -0.45, -1.5, 3);
    }
    scene.add(g);
    return shot(scene, g, [0.4, 0.4, 9], 0.93);
  },

  // Weathered concrete apartment block at night, one warm lit window.
  async panelblock(renderer) {
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1;
    const scene = new THREE.Scene();
    const noise = createNoise2D(rng(17));
    const fbm = (x, y) => { let v = 0, a = 0.5, f = 1; for (let o = 0; o < 6; o++) { v += a * noise(x * f, y * f); f *= 2; a *= 0.5; } return v; };
    const concrete = (W, H, cols, rows, tone, seed) => {
      const c = Object.assign(document.createElement('canvas'), { width: W, height: H }); const x = c.getContext('2d');
      const img = x.createImageData(W, H), R = rng(seed);
      const drips = Array.from({ length: 90 }, () => [R() * W, R() * H * 0.6, 2 + R() * 6, H * (0.15 + R() * 0.6), 0.25 + R() * 0.4]);
      for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
        let v = tone + fbm(i / 140 + seed, j / 140) * 38 + fbm(i / 18, j / 18 + seed) * 14 + (R() - 0.5) * 22;
        const stain = fbm(i / 260 + 9, j / 90 + seed); if (stain > 0.15) v -= (stain - 0.15) * 160;
        for (const [dx, dy, dw, dl, da] of drips) if (Math.abs(i - dx - Math.sin(j / 40) * 2) < dw && j > dy && j < dy + dl) v -= 40 * da * (1 - (j - dy) / dl);
        if (j % Math.floor(H / rows) < 3 || i % Math.floor(W / cols) < 3) v -= 30;
        const o = (j * W + i) * 4; v = Math.max(8, Math.min(200, v));
        img.data[o] = v * 0.96; img.data[o + 1] = v * 0.98; img.data[o + 2] = v; img.data[o + 3] = 255;
      }
      x.putImageData(img, 0, 0);
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
    };
    const litTex = (() => {
      const c = Object.assign(document.createElement('canvas'), { width: 256, height: 320 }); const x = c.getContext('2d');
      const g = x.createRadialGradient(150, 120, 10, 128, 160, 220); g.addColorStop(0, '#ffd27a'); g.addColorStop(0.5, '#ff9a2e'); g.addColorStop(1, '#b4480f');
      x.fillStyle = g; x.fillRect(0, 0, 256, 320);
      x.fillStyle = '#3a1606';
      x.beginPath(); x.arc(92, 150, 26, 0, Math.PI * 2); x.fill();                       // head
      x.beginPath(); x.ellipse(92, 128, 34, 12, 0, Math.PI, 0); x.lineWidth = 9; x.strokeStyle = '#3a1606'; x.stroke(); // headphones band
      x.fillRect(58, 142, 12, 24); x.fillRect(114, 142, 12, 24);
      x.beginPath(); x.moveTo(40, 320); x.quadraticCurveTo(50, 190, 92, 182); x.quadraticCurveTo(134, 190, 146, 320); x.fill(); // shoulders
      x.fillRect(150, 230, 100, 10); x.fillRect(176, 190, 56, 40);                           // desk + monitor
      x.fillStyle = '#fff0c8'; x.fillRect(180, 194, 48, 32);
      x.fillStyle = '#3a1606'; x.fillRect(0, 0, 256, 8); x.fillRect(124, 0, 8, 320); x.fillRect(0, 150, 256, 6); // frame mullions
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
    })();
    const g = new THREE.Group();
    const block = (w, h, d, cols, rows, tone, seed, x, z, litAt) => {
      const tex = concrete(512, Math.round(512 * h / w), cols, rows, tone, seed);
      const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95 });
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); b.position.set(x, h / 2, z); g.add(b);
      const ww = (w / cols) * 0.5, wh = (h / rows) * 0.56, glass = new THREE.MeshStandardMaterial({ color: 0x0b0d12, roughness: 0.25, metalness: 0.3 });
      const frame = new THREE.MeshStandardMaterial({ color: 0x55534f, roughness: 0.9 });
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const cx = x - w / 2 + (c + 0.5) * (w / cols), cy = (r + 0.5) * (h / rows), lit = litAt && litAt[0] === c && litAt[1] === r;
        const f = new THREE.Mesh(new THREE.BoxGeometry(ww * 1.12, wh * 1.12, 0.03), frame); f.position.set(cx, cy, z + d / 2 + 0.005); g.add(f);
        const pane = new THREE.Mesh(new THREE.PlaneGeometry(ww, wh), lit ? new THREE.MeshBasicMaterial({ map: litTex }) : glass);
        pane.position.set(cx, cy, z + d / 2 + 0.025); g.add(pane);
        if (!lit) {
          const m1 = new THREE.Mesh(new THREE.BoxGeometry(ww * 0.05, wh, 0.02), frame); m1.position.set(cx + ww * 0.1, cy, z + d / 2 + 0.035); g.add(m1);
          const m2 = new THREE.Mesh(new THREE.BoxGeometry(ww, wh * 0.05, 0.02), frame); m2.position.set(cx, cy + wh * 0.22, z + d / 2 + 0.035); g.add(m2);
          if ((r * 5 + c) % 4 === 0) { const cur = new THREE.Mesh(new THREE.PlaneGeometry(ww * 0.35, wh * 0.9), new THREE.MeshStandardMaterial({ color: 0x2a2c30, roughness: 1 })); cur.position.set(cx - ww * 0.3, cy, z + d / 2 + 0.03); g.add(cur); }
        } else {
          const halo = new THREE.Mesh(new THREE.PlaneGeometry(ww * 2.4, wh * 2.2), new THREE.MeshBasicMaterial({ color: 0xff8a2a, transparent: true, opacity: 0.18, depthWrite: false }));
          halo.position.set(cx, cy, z + d / 2 + 0.02); g.add(halo);
        }
        if ((r + c * 2) % 5 === 1 && r > 0) { const bal = new THREE.Mesh(new THREE.BoxGeometry(ww * 1.6, wh * 0.4, 0.35), mat); bal.position.set(cx, cy - wh * 0.62, z + d / 2 + 0.17); g.add(bal); }
        if (lit) { const pl = new THREE.PointLight(0xff9a3c, 3.5, 1.6, 2); pl.position.set(cx, cy, z + d / 2 + 0.6); g.add(pl); }
        if ((r * 7 + c * 3) % 11 === 4) { const ac = new THREE.Mesh(new THREE.BoxGeometry(ww * 0.6, wh * 0.35, 0.22), frame); ac.position.set(cx + ww * 0.55, cy - wh * 0.15, z + d / 2 + 0.11); g.add(ac); }
      }
    };
    block(4.2, 5.4, 2.4, 5, 7, 104, 3, 0.9, 0, [2, 4]);
    const roof = new THREE.MeshStandardMaterial({ color: 0x3a3b3e, roughness: 1 });
    const par = new THREE.Mesh(new THREE.BoxGeometry(4.3, 0.18, 2.5), roof); par.position.set(0.9, 5.49, 0); g.add(par);
    const hut = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.6, 0.8), roof); hut.position.set(1.9, 5.8, -0.3); g.add(hut);
    [[-0.4, 0.9], [0.3, 1.3]].forEach(([x, hgt]) => { const a = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, hgt, 6), roof); a.position.set(x, 5.5 + hgt / 2, 0.2); g.add(a); const bar = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.015, 0.015), roof); bar.position.set(x, 5.5 + hgt * 0.85, 0.2); g.add(bar); });
    block(3.2, 3.6, 2.0, 4, 5, 72, 8, -2.6, -0.9, null);
    scene.add(g);
    scene.add(new THREE.HemisphereLight(0x8090b0, 0x050505, 0.5));
    const moon = new THREE.DirectionalLight(0xb8c4e0, 1.1); moon.position.set(-4, 7, 6); scene.add(moon);
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(-1.2, 2.2, 9.5);
    frame(camera, g, 0.97);
    camera.position.set(camera.position.x - 1.5, 0.6, camera.position.z); camera.lookAt(-0.2, 3.0, 0);
    return { scene, camera };
  },

  // Two glossy dice mid-roll.
  async dice(renderer) {
    const scene = new THREE.Scene();
    scene.environment = studioEnv(renderer);
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(-4, 6, 5);
    scene.add(key);
    const pipMat = glossy(0x1c2340, { roughness: 0.3 });
    const pipGeo = new THREE.SphereGeometry(0.1, 32, 16);
    const layouts = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] };
    const faces = [[1, new THREE.Vector3(0, 0, 1)], [6, new THREE.Vector3(0, 0, -1)], [2, new THREE.Vector3(1, 0, 0)], [5, new THREE.Vector3(-1, 0, 0)], [3, new THREE.Vector3(0, 1, 0)], [4, new THREE.Vector3(0, -1, 0)]];
    function die(color) {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new RoundedBoxGeometry(1, 1, 1, 10, 0.2), glossy(color)));
      for (const [n, normal] of faces) {
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
        for (const [u, v] of layouts[n]) {
          const pip = new THREE.Mesh(pipGeo, pipMat);
          pip.scale.set(1, 1, 0.35);
          pip.position.set(u * 0.25, v * 0.25, 0.5).applyQuaternion(q);
          pip.quaternion.copy(q);
          g.add(pip);
        }
      }
      return g;
    }
    const a = die(0xff7fb0);
    a.position.set(-0.62, -0.12, 0);
    a.rotation.set(0.55, 0.65, 0.18);
    const b = die(0xffd23f);
    b.position.set(0.68, 0.22, -0.2);
    b.rotation.set(-0.45, -0.6, 0.5);
    const group = new THREE.Group().add(a, b);
    scene.add(group);
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
    camera.position.set(0, 0.3, 6);
    frame(camera, group, 0.9);
    return { scene, camera };
  },

  // Gloss toy rocket with a glowing flame.
  async rocket(renderer) {
    const scene = new THREE.Scene();
    scene.environment = studioEnv(renderer);
    const key = new THREE.DirectionalLight(0xffffff, 1.5);
    key.position.set(-4, 5, 6);
    scene.add(key);
    const curve = new THREE.SplineCurve([[0.001, 1.62], [0.16, 1.48], [0.34, 1.12], [0.48, 0.6], [0.53, 0.0], [0.5, -0.6], [0.4, -1.05], [0.3, -1.2]].map(([r, y]) => new THREE.Vector2(r, y)));
    const prof = [...curve.getPoints(80), new THREE.Vector2(0.001, -1.2)].reverse();
    const body = new THREE.Mesh(new THREE.LatheGeometry(prof, 128), glossy(0xfff1dc));
    const nosePts = prof.filter((p) => p.y >= 0.85).map((p) => new THREE.Vector2(p.x * 1.015, p.y));
    nosePts.unshift(new THREE.Vector2(0.001, 0.85));
    const nose = new THREE.Mesh(new THREE.LatheGeometry(nosePts, 128), glossy(0xff4b2b, { side: THREE.DoubleSide }));
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.505, 0.045, 24, 128), glossy(0xff4b2b));
    band.rotation.x = Math.PI / 2;
    band.position.y = -0.55;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.05, 32, 64), glossy(0xff4b2b));
    ring.position.set(0, 0.3, 0.5);
    const glass = new THREE.Mesh(new THREE.SphereGeometry(0.19, 48, 24), glossy(0x56b6ff, { roughness: 0.05, metalness: 0.2 }));
    glass.scale.set(1, 1, 0.45);
    glass.position.set(0, 0.3, 0.46);
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0.1); finShape.quadraticCurveTo(0.9, -0.15, 0.95, -1.0); finShape.lineTo(0.3, -0.75); finShape.lineTo(0, -0.75); finShape.lineTo(0, 0.1);
    const finGeo = new THREE.ExtrudeGeometry(finShape, { depth: 0.07, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.025, bevelSegments: 6, curveSegments: 32 });
    finGeo.translate(0, -0.45, -0.035);
    const fins = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4].map((a) => {
      const f = new THREE.Mesh(finGeo, glossy(0xff4b2b));
      f.rotation.y = a;
      return f;
    });
    const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.32, 0.22, 64), new THREE.MeshPhysicalMaterial({ color: 0x9aa3b5, metalness: 1, roughness: 0.25 }));
    nozzle.position.y = -1.3;
    const flameGeo = new THREE.ConeGeometry(0.3, 1.3, 64, 16, true);
    flameGeo.rotateX(Math.PI);
    const pos = flameGeo.attributes.position;
    const colors = [];
    for (let i = 0; i < pos.count; i++) {
      const t = (pos.getY(i) + 0.65) / 1.3;
      const c = new THREE.Color(0xff3d00).lerp(new THREE.Color(0xffe066), t);
      colors.push(c.r, c.g, c.b);
    }
    flameGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    const flame = new THREE.Mesh(flameGeo, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide }));
    flame.position.y = -2.05;
    const core = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.7, 48).rotateX(Math.PI), new THREE.MeshBasicMaterial({ color: 0xfff6c8 }));
    core.position.y = -1.75;
    const rocket = new THREE.Group().add(body, nose, band, ring, glass, ...fins, nozzle, flame, core);
    rocket.rotation.set(0.15, 0.4, -0.62);
    scene.add(rocket);
    const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
    camera.position.set(0, 0, 8);
    frame(camera, rocket, 0.9);
    return { scene, camera };
  },

  // Floating candy-gloss shapes around an empty centre (for type).
  async shapes(renderer) {
    const scene = new THREE.Scene();
    scene.environment = studioEnv(renderer);
    const key = new THREE.DirectionalLight(0xffffff, 1.3);
    key.position.set(-4, 6, 6);
    scene.add(key);
    const starShape = new THREE.Shape();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 ? 0.26 : 0.6;
      const a = (i * Math.PI) / 5 + Math.PI / 2;
      i ? starShape.lineTo(r * Math.cos(a), r * Math.sin(a)) : starShape.moveTo(r * Math.cos(a), r * Math.sin(a));
    }
    const starGeo = new THREE.ExtrudeGeometry(starShape, { depth: 0.2, bevelEnabled: true, bevelThickness: 0.14, bevelSize: 0.1, bevelSegments: 12 });
    starGeo.center();
    const items = [
      [new THREE.TorusGeometry(0.55, 0.24, 48, 96), 0xff7fb0, [-1.75, 1.25, 0], [0.9, 0.4, 0]],
      [new THREE.SphereGeometry(0.5, 64, 32), 0x5fb8ff, [1.85, 1.35, -0.4], [0, 0, 0]],
      [starGeo, 0xffd23f, [1.7, -1.4, 0.2], [0.2, -0.4, 0.3]],
      [new THREE.CapsuleGeometry(0.28, 0.8, 16, 48), 0x52d99a, [-1.8, -1.35, 0], [0, 0, 0.9]],
      [new THREE.SphereGeometry(0.22, 48, 24), 0xb79cff, [0.15, 2.0, 0], [0, 0, 0]],
      [new THREE.TorusGeometry(0.3, 0.12, 32, 64), 0xffa45c, [-0.2, -2.05, 0.2], [1.2, 0.2, 0]],
      [new THREE.SphereGeometry(0.16, 48, 24), 0xff7fb0, [2.35, 0.1, 0], [0, 0, 0]],
      [new THREE.SphereGeometry(0.18, 48, 24), 0xffd23f, [-2.35, 0.05, 0], [0, 0, 0]],
    ];
    const group = new THREE.Group();
    for (const [geo, color, p, r] of items) {
      const m = new THREE.Mesh(geo, glossy(color));
      m.position.set(...p);
      m.rotation.set(...r);
      group.add(m);
    }
    scene.add(group);
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0, 10);
    frame(camera, group, 0.97);
    return { scene, camera };
  },

  // Banded gas giant with a ring, lit from one side.
  async planet(renderer) {
    const scene = new THREE.Scene();
    const noise = createNoise3D(rng(7));
    const W = 2048, H = 1024;
    const canvas = Object.assign(document.createElement('canvas'), { width: W, height: H });
    const ctx = canvas.getContext('2d');
    const img = ctx.createImageData(W, H);
    const palette = [[255, 214, 170], [255, 140, 120], [170, 110, 220], [255, 236, 210], [240, 120, 170], [120, 90, 200]].map((c) => new THREE.Color(`rgb(${c})`));
    for (let y = 0; y < H; y++) {
      const lat = (y / H) * Math.PI;
      for (let x = 0; x < W; x++) {
        const lon = (x / W) * Math.PI * 2;
        const px = Math.sin(lat) * Math.cos(lon), py = Math.cos(lat), pz = Math.sin(lat) * Math.sin(lon);
        const warp = noise(px * 1.6, py * 3, pz * 1.6) * 0.5 + noise(px * 5, py * 9, pz * 5) * 0.12;
        const band = (py + warp * 0.12) * 4.2;
        const t = (Math.sin(band * Math.PI) * 0.5 + 0.5) * (palette.length - 1);
        const i = Math.floor(t), f = t - i;
        const c = palette[i].clone().lerp(palette[Math.min(i + 1, palette.length - 1)], f);
        const o = (y * W + x) * 4;
        img.data[o] = c.r * 255; img.data[o + 1] = c.g * 255; img.data[o + 2] = c.b * 255; img.data[o + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    const planet = new THREE.Mesh(new THREE.SphereGeometry(1, 128, 64), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 }));
    const ringCanvas = Object.assign(document.createElement('canvas'), { width: 1024, height: 8 });
    const rc = ringCanvas.getContext('2d');
    const r = rng(3);
    for (let x = 0; x < 1024; x++) {
      const a = 0.25 + 0.65 * r() * (x > 120 && x < 980 ? 1 : 0.2);
      const shade = 200 + 55 * r();
      rc.fillStyle = `rgba(${shade},${shade * 0.9},${shade * 0.8},${x % 160 < 8 ? 0.05 : a})`;
      rc.fillRect(x, 0, 1, 8);
    }
    const ringTex = new THREE.CanvasTexture(ringCanvas);
    ringTex.colorSpace = THREE.SRGBColorSpace;
    const ringGeo = new THREE.RingGeometry(1.35, 2.3, 256, 1);
    const uv = ringGeo.attributes.uv, p = ringGeo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const d = Math.hypot(p.getX(i), p.getY(i));
      uv.setXY(i, (d - 1.35) / (2.3 - 1.35), 0.5);
    }
    const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ map: ringTex, transparent: true, side: THREE.DoubleSide }));
    ring.rotation.x = Math.PI / 2 - 0.32;
    const system = new THREE.Group().add(planet, ring);
    system.rotation.z = 0.32;
    scene.add(system);
    scene.add(new THREE.AmbientLight(0x6a5acd, 0.35));
    const sun = new THREE.DirectionalLight(0xffffff, 3.2);
    sun.position.set(-5, 2.5, 4);
    scene.add(sun);
    const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
    camera.position.set(0, 0.4, 10);
    frame(camera, system, 0.98);
    return { scene, camera };
  },
};

// Procedural nebula + stars, drawn in 2D (opaque square, clipped later).
function nebula() {
  const canvas = Object.assign(document.createElement('canvas'), { width: SIZE, height: SIZE });
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const n = createNoise2D(rng(11));
  const fbm = (x, y) => {
    let v = 0, a = 0.5, f = 1;
    for (let o = 0; o < 6; o++) { v += a * n(x * f, y * f); f *= 2; a *= 0.5; }
    return v;
  };
  const N = SIZE / 2;
  const small = Object.assign(document.createElement('canvas'), { width: N, height: N });
  const sctx = small.getContext('2d');
  const img = sctx.createImageData(N, N);
  const stops = [[0.0, [6, 5, 26]], [0.3, [30, 16, 78]], [0.5, [110, 38, 150]], [0.68, [230, 90, 160]], [0.84, [255, 180, 170]], [1.0, [255, 246, 236]]];
  const ramp = (t) => {
    for (let i = 1; i < stops.length; i++)
      if (t <= stops[i][0]) {
        const [t0, c0] = stops[i - 1], [t1, c1] = stops[i];
        const f = (t - t0) / (t1 - t0);
        return c0.map((c, k) => c + (c1[k] - c) * f);
      }
    return stops.at(-1)[1];
  };
  for (let y = 0; y < N; y++)
    for (let x = 0; x < N; x++) {
      const u = (x / N) * 2.2, v = (y / N) * 2.2;
      const w = fbm(u + 4.1, v + 1.7);
      const d = fbm(u + w * 0.8, v + w * 0.8) * 0.5 + 0.5;
      const diag = Math.max(0, 1 - Math.abs((x - y) / N) * 1.6);
      const t = Math.max(0, Math.min(1, d ** 1.6 * (0.25 + 1.05 * diag ** 1.5)));
      const c = ramp(t);
      const cyan = Math.max(0, fbm(u * 1.3 + 9, v * 1.3) * 0.5 + 0.5 - 0.55) * 300 * diag;
      const o = (y * N + x) * 4;
      img.data[o] = c[0]; img.data[o + 1] = Math.min(255, c[1] + cyan * 0.6); img.data[o + 2] = Math.min(255, c[2] + cyan); img.data[o + 3] = 255;
    }
  sctx.putImageData(img, 0, 0);
  ctx.imageSmoothingQuality = 'high';
  ctx.filter = 'blur(2px)';
  ctx.drawImage(small, 0, 0, SIZE, SIZE);
  ctx.filter = 'none';
  const r = rng(5);
  for (let i = 0; i < 1400; i++) {
    const x = r() * SIZE, y = r() * SIZE, s = r() ** 6 * 5 + 0.6;
    ctx.fillStyle = `rgba(255,255,255,${0.5 + r() * 0.5})`;
    ctx.beginPath(); ctx.arc(x, y, s * SIZE / 2000, 0, Math.PI * 2); ctx.fill();
  }
  for (let i = 0; i < 14; i++) {
    const x = r() * SIZE, y = r() * SIZE, s = (6 + r() * 10) * SIZE / 2000;
    const g = ctx.createRadialGradient(x, y, 0, x, y, s * 5);
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.15, 'rgba(255,240,255,.6)'); g.addColorStop(1, 'rgba(255,200,255,0)');
    ctx.fillStyle = g; ctx.fillRect(x - s * 5, y - s * 5, s * 10, s * 10);
  }
}

const name = params.get('scene');
try {
  if (name === 'nebula') nebula();
  else {
    const renderer = makeRenderer();
    const { scene, camera } = await SCENES[name](renderer);
    renderer.render(scene, camera);
  }
  window.renderDone = true;
} catch (e) {
  window.renderError = String(e?.stack ?? e);
}
