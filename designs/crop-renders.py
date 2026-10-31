"""Crops 3D renders to their visible content (plus a small margin) as <name>-crop.png."""
import sys
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parent / 'output' / 'assets' / '3d'
for name in sys.argv[1:]:
    im = Image.open(root / f'{name}.png').convert('RGBA')
    x0, y0, x1, y1 = im.getchannel('A').point(lambda a: 255 if a > 8 else 0).getbbox()
    pad = int(max(x1 - x0, y1 - y0) * 0.02)
    im.crop((max(0, x0 - pad), max(0, y0 - pad), min(im.width, x1 + pad), min(im.height, y1 + pad))).save(root / f'{name}-crop.png')
    print(name, x1 - x0, 'x', y1 - y0)
