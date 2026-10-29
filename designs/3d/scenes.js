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
