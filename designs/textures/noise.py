"""Shared value-noise helpers for the texture generators."""
import numpy as np


def make_fbm(seed):
    rng = np.random.default_rng(seed)
    grids = {}

    def value_noise(px, py, res=64, key=0):
        if key not in grids:
            grids[key] = rng.random((res + 2, res + 2)).astype(np.float32)
        g = grids[key]
        fx, fy = px % res, py % res
        ix, iy = fx.astype(int), fy.astype(int)
        tx, ty = fx - ix, fy - iy
        tx, ty = tx * tx * (3 - 2 * tx), ty * ty * (3 - 2 * ty)
        a, b, c, d = g[iy, ix], g[iy, ix + 1], g[iy + 1, ix], g[iy + 1, ix + 1]
        top, bot = a + (b - a) * tx, c + (d - c) * tx
        return top + (bot - top) * ty

    def fbm(px, py, octaves=5, key=0):
        s, amp, f = 0, 0.5, 1.0
        for o in range(octaves):
            s = s + amp * value_noise(px * f, py * f, key=key * 10 + o)
            f, amp = f * 2.03, amp * 0.5
        return s

    return rng, fbm


def save_inks(path, layers, shape):
    """layers: list of (mask, hex) painted in order."""
    from PIL import Image
    H, W = shape
    img = np.zeros((H, W, 4), np.uint8)
    for mask, hx in layers:
        img[mask] = (int(hx[1:3], 16), int(hx[3:5], 16), int(hx[5:7], 16), 255)
    Image.fromarray(img).save(path)
