#!/usr/bin/env python3
"""Inline every local asset of proto/index.html into one self-contained HTML file.

Usage: python3 scripts/bundle_proto.py [out.html]
Produces a file that opens anywhere (double-click, Slack, mail) with no server and no assets folder.
Google Fonts stay remote: the page needs a connection for the typefaces, nothing else.
"""
import base64, mimetypes, re, sys
from pathlib import Path

SRC = Path("proto/index.html")
out = Path(sys.argv[1] if len(sys.argv) > 1 else "proto/hatch-site-v8.html")
html = SRC.read_text()

cache = {}
def data_uri(rel):
    if rel not in cache:
        f = SRC.parent / rel
        mime = mimetypes.guess_type(f.name)[0] or "application/octet-stream"
        cache[rel] = f"data:{mime};base64," + base64.b64encode(f.read_bytes()).decode()
    return cache[rel]

# the marquee builds its <img> from a JS template: swap the interpolation for a lookup table first
shops = ",".join(f'"{k}":"{data_uri(f"assets/shop-{k}.webp")}"'
                 for k in ["nemesis", "pny", "nobinobi", "la-meulerie", "afrik-n-fusion"])
html = html.replace("assets/shop-${k}.webp", "${SHOPS[k]}")
html = html.replace("  const clients=[", "  const SHOPS={" + shops + "};\n  const clients=[")
# every remaining src="assets/..."
html = re.sub(r'src="(assets/[^"]+)"', lambda m: f'src="{data_uri(m.group(1))}"', html)

left = re.findall(r'assets/[^"\\\')]+', html)
if left:
    sys.exit(f"still referencing local files: {set(left)}")
out.write_text(html)
print(f"{out}  {out.stat().st_size/1e6:.1f} MB  ({len(cache)} assets inlined)")
