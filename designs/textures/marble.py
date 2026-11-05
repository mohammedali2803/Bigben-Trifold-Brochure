"""Procedural marbled-ink texture (domain-warped noise) separated into flat screen-print inks.
Usage: python3 marble.py <out.png> <seed> <W> <H> <hexA> <hexB>
Ink A forms thin swirling veins across the upper area, ink B a large poured mass lower down."""
import sys
import numpy as np
from PIL import Image

out, seed, W, H, hex_a, hex_b = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4]), sys.argv[5], sys.argv[6]
rng = np.random.default_rng(seed)
y, x = np.mgrid[0:H, 0:W].astype(np.float32)
u, v = x / W * 3.0, y / W * 3.0

def value_noise(px, py, res):
    g = rng.random((res + 2, res + 2)).astype(np.float32)
    fx, fy = px % res, py % res
    ix, iy = fx.astype(int), fy.astype(int)
    tx, ty = fx - ix, fy - iy
    tx, ty = tx * tx * (3 - 2 * tx), ty * ty * (3 - 2 * ty)
    a, b = g[iy, ix], g[iy, ix + 1]
    c, d = g[iy + 1, ix], g[iy + 1, ix + 1]
    return (a + (b - a) * tx) + ((c + (d - c) * tx) - (a + (b - a) * tx)) * ty

def fbm(px, py, octaves=5):
    s, amp, f = 0, 0.5, 1.0
    for _ in range(octaves):
        s = s + amp * value_noise(px * f, py * f, 64)
        f, amp = f * 2.02, amp * 0.5
    return s

u, v = x / W * 1.1, y / W * 1.1
qx, qy = fbm(u, v, 3), fbm(u + 5.2, v + 1.3, 3)
rx, ry = fbm(u + 2.2 * qx + 1.7, v + 2.2 * qy + 9.2, 3), fbm(u + 2.2 * qx + 8.3, v + 2.2 * qy + 2.8, 3)
warp = fbm(u + 2.0 * rx, v + 2.0 * ry, 4)
X, Y = x / W, y / H
flow = (X * 0.9 - Y * 1.3) * 4.0 + warp * 5.5              # long diagonal streams
band = np.abs(np.sin(flow * np.pi))

# Ink A: streams across the upper-right, thinning out towards the edges of the zone.
zone_a = np.clip(1.5 - np.hypot((X - 0.6) * 1.1, (Y - 0.32) * 1.4) * 2.0 + (warp - 0.5) * 1.5, 0, 1)
band2 = np.abs(np.sin(flow * np.pi * 1.9 + 1.3))
ink_a = (band < 0.42 * zone_a) | (band2 < 0.16 * zone_a ** 2)
# Ink B: a poured mass in the lower area with garment-coloured veins running through it.
mass = (Y - 0.58) * 3.0 + (warp - 0.5) * 2.4 + (X - 0.5) * 0.6
ink_b = (mass > 0.15) & (np.abs(np.sin(flow * np.pi * 0.7)) > 0.18 + 0.25 * np.clip(0.9 - mass, 0, 1))
swirl = np.abs(np.sin((flow * 1.7 + warp * 7.0) * np.pi)) < 0.07 + 0.05 * np.clip(mass - 0.4, 0, 1)
ink_b &= ~swirl
specks = (rng.random((H // 8, W // 8)) > 0.985).repeat(8, 0).repeat(8, 1)[:H, :W] & (mass > -0.25) & (mass < 0.2)
# (pixel specks removed: looked artificial)
grain = rng.random((H, W)) > 0.012
img = np.zeros((H, W, 4), np.uint8)
def put(mask, hx):
    r, g, b = (int(hx[i:i + 2], 16) for i in (1, 3, 5))
    img[mask & grain] = (r, g, b, 255)
put(ink_b, hex_b)
put(ink_a & ~ink_b, hex_a)
Image.fromarray(img).save(out)
print('saved', out)
