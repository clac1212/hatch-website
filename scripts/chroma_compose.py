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
alpha = c[..., 3]
rgb = o.copy()
outer = alpha < 255                               # keyed region: shadow or transparent → shadow colour
rgb[outer] = (70, 45, 25)
im = Image.fromarray(np.dstack([rgb, alpha]))
im.save(out, quality=90, method=6)
print(out, im.size)
