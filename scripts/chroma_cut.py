#!/usr/bin/env python3
"""Key out a flat chroma-green background (as re-rendered by Nano Banana) into a transparent PNG.

Usage: python3 scripts/chroma_cut.py <in_green.png> <out.png>
The green region is flood-filled from the image border, so green things inside the room (Pecker) survive.
The ground shadow (dark green) is kept as a semi-transparent warm-brown alpha. Rim pixels are despilled.
"""
import sys
import numpy as np
from collections import deque
from PIL import Image, ImageFilter
from scipy import ndimage

src, dst = sys.argv[1], sys.argv[2]
GLOBAL = "--global" in sys.argv   # key every green pixel, not only the region connected to the border
                                  # (use when nothing in the scene is legitimately green, e.g. isolated objects)
im = Image.open(src).convert("RGB")
a = np.asarray(im).astype(np.int16)
H, W, _ = a.shape
r, g, b = a[..., 0], a[..., 1], a[..., 2]
greenish = (g > r + 40) & (g > b + 40)

seen = np.zeros((H, W), bool)
q = deque()
for x in range(W):
    for y in (0, H - 1):
        if greenish[y, x] and not seen[y, x]:
            seen[y, x] = True; q.append((y, x))
for y in range(H):
    for x in (0, W - 1):
        if greenish[y, x] and not seen[y, x]:
            seen[y, x] = True; q.append((y, x))
while q:
    y, x = q.popleft()
    for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
        if 0 <= ny < H and 0 <= nx < W and greenish[ny, nx] and not seen[ny, nx]:
            seen[ny, nx] = True; q.append((ny, nx))
outer = greenish if GLOBAL else seen

gl = g.astype(np.float32)
bgl = np.median(gl[outer])
dark = np.clip((bgl - gl) / (bgl * 0.7), 0, 1)         # 0 on flat green → 1 in the deepest shadow
alpha = np.full((H, W), 255.0, np.float32)
alpha[outer] = dark[outer] * 255 * 0.7                  # shadow at most 70 % opaque

rgb = a.clip(0, 255).astype(np.uint8).copy()
rgb[outer] = (70, 45, 25)                               # shadow colour
# despill a 3-px rim inside the object: green can't exceed the max of red/blue
rim = ndimage.binary_dilation(outer, iterations=3) & ~outer
mx = np.maximum(rgb[..., 0], rgb[..., 2])
rgb[rim, 1] = np.minimum(rgb[rim, 1], mx[rim])

out = Image.fromarray(np.dstack([rgb, alpha.astype(np.uint8)]), "RGBA")
A = out.getchannel("A").filter(ImageFilter.GaussianBlur(0.8))
out.putalpha(A)
out.save(dst, optimize=True)
print(dst, out.size, f"{outer.mean():.0%} keyed")
