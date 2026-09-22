#!/usr/bin/env python3
"""Combine the ORIGINAL scene colours with the alpha keyed from its green re-render.

Usage: python3 scripts/chroma_compose.py <original.png> <keyed_cut.png> <out.webp>
The green re-render only provides the matte (room silhouette + ground shadow); colours come from the
original so no green bounce light leaks in. Output: WebP with alpha, quality 90.
"""
import sys
import numpy as np
from PIL import Image

orig, cut, out = sys.argv[1:4]
o = np.asarray(Image.open(orig).convert("RGB")).astype(np.uint8)
c = np.asarray(Image.open(cut).convert("RGBA"))
alpha = c[..., 3].astype(np.float32)
rgb = o.copy()
outer = alpha < 255                               # keyed region: shadow or transparent → shadow colour
rgb[outer] = (70, 45, 25)
# the baked ground shadow runs off the canvas: fade the keyed region out over the outer 7 % so no hard edge shows
H, W = alpha.shape
fy = np.clip(np.minimum(np.arange(H), H - 1 - np.arange(H)) / (H * 0.07), 0, 1)[:, None]
fx = np.clip(np.minimum(np.arange(W), W - 1 - np.arange(W)) / (W * 0.07), 0, 1)[None, :]
fade = (fy * fx) ** 1.5
alpha = np.where(outer, alpha * fade, alpha).astype(np.uint8)
im = Image.fromarray(np.dstack([rgb, alpha]))
im.save(out, quality=90, method=6)
print(out, im.size)
