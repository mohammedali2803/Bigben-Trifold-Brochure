"""Hem flames with spray splatter. Usage: python3 flames.py <out.png> <seed> <W> <H> <hexFlame> <hexInner>"""
import sys
import numpy as np
from noise import make_fbm, save_inks

out, seed, W, H, hex_a, hex_b = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4]), sys.argv[5], sys.argv[6]
rng, fbm = make_fbm(seed)
y, x = np.mgrid[0:H, 0:W].astype(np.float32)
X, Y = x / W, y / H
up = 1 - Y                                                     # 0 at hem, 1 at top

# Flame tongues: many separate tongues that taper and sway as they rise, edges
# roughened with noise so they read as real fire rather than geometry.
jitter = (fbm(X * 40, Y * 40, 3, key=4) - 0.5) * 0.012
outer = np.zeros((H, W), bool)
inner = np.zeros((H, W), bool)
n_t = 34
for i in range(n_t):
    c = (i + rng.random() * 0.8) / n_t * 1.1 - 0.05
    h = 0.12 + rng.random() ** 1.6 * 0.36
    w = 0.03 + rng.random() * 0.04
    amp, freq, ph = 0.02 + rng.random() * 0.05, 6 + rng.random() * 8, rng.random() * 6.3
    t = np.clip(up / h, 0, 1.2)
    sway = amp * np.sin(t * freq + ph) * t + 0.06 * (rng.random() - 0.5) * t ** 2
    width = w * np.clip(1 - t, 0, 1) ** 1.1 * (1 + 0.6 * np.exp(-((t - 0.15) / 0.12) ** 2))
    d = np.abs(X - c - sway + jitter)
    tongue = (d < width) & (t < 1)
    outer |= tongue
    inner |= d < w * 0.7 * np.clip(1 - t / 0.5, 0, 1) ** 0.9
base = up < 0.075 + (fbm(X * 10, Y, 3, key=5) - 0.5) * 0.04
outer |= base
inner |= up < 0.04 + (fbm(X * 12, Y, 3, key=7) - 0.5) * 0.04
holes = fbm(X * 22, Y * 9, 4, key=6) > 0.72
outer &= ~(holes & (up > 0.06))
height = np.full_like(X, 0.3)
# Ember flecks and spray splatter above the flames.
splat = np.zeros((H, W), bool)
n = 420
cx, cy = rng.random(n) * W, H * (1 - rng.random(n) ** 0.7 * 0.62)
cr = (rng.random(n) ** 5) * W * 0.009 + W * 0.001
for px, py, r in zip(cx, cy, cr):
    x0, x1, y0, y1 = int(max(px - r, 0)), int(min(px + r + 1, W)), int(max(py - r, 0)), int(min(py + r + 1, H))
    yy, xx = np.mgrid[y0:y1, x0:x1]
    splat[y0:y1, x0:x1] |= (xx - px) ** 2 + (yy - py) ** 2 < r * r
splat &= (up > 0.1) & (up < 0.62)
grain = rng.random((H, W)) > 0.03
save_inks(out, [((outer | splat) & grain, hex_a), (inner & ~splat & grain, hex_b)], (H, W))
print('saved', out)
