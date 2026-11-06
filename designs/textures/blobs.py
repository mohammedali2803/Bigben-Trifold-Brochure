"""Smooth liquid blobs in one ink, fading out before the artboard edge.
Usage: python3 blobs.py <out.png> <seed> <W> <H> <hex>"""
import sys
import numpy as np
from noise import make_fbm, save_inks

out, seed, W, H, hx = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4]), sys.argv[5]
rng, fbm = make_fbm(seed)
y, x = np.mgrid[0:H, 0:W].astype(np.float32)
X, Y = x / W, y / H
u, v = X * 2.2, Y * 2.2 * H / W
warp = fbm(u + fbm(u, v, 2, key=1) * 1.2, v + fbm(u + 3, v, 2, key=2) * 1.2, 3, key=3)
edge = np.minimum.reduce([X, 1 - X, Y, 1 - Y])
field = warp - (1 - np.clip(edge * 7, 0, 1)) * 0.5
save_inks(out, [(field > np.quantile(field, 0.58), hx)], (H, W))
print('saved', out)
