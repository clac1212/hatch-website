/**
 * Liquid glass refraction for `.vitre` surfaces (César 05/10: get closer to Apple's Liquid Glass).
 *
 * Same technique as the libraries that do it on the web (Hyalite, liquid-glass.js…), written here so
 * the site keeps zero UI dependency: for each surface, a displacement map is drawn for its exact shape
 * (a rounded rectangle, or a pill), then an SVG filter bends the backdrop with it. Inside a bevel along
 * the edge the backdrop is pulled inwards, strongest at the rim, like the curved edge of a thick lens;
 * the flat centre only gets a light blur. The rim light and inner glow stay in CSS (global.css).
 *
 * SVG filters in `backdrop-filter` only render in Chromium (Chrome, Edge, Arc…); elsewhere the CSS
 * fallback of `.vitre` (plain blur) stays, so this script only runs there. Maps are rebuilt when a
 * surface changes size (the nav folds): the first change right away, then at most every 100 ms.
 */

/** Chromium browsers expose `navigator.userAgentData` with a "Chromium" brand; Safari and Firefox don't. */
const chromium = (
  navigator as Navigator & { userAgentData?: { brands: { brand: string }[] } }
).userAgentData?.brands.some((b) => b.brand === 'Chromium');

const SVG = 'http://www.w3.org/2000/svg';
/** Width of the refracting band along the edge, and how far it bends the backdrop (px). */
const BISEAU = 20;
const FORCE = 38;

if (chromium && !matchMedia('(prefers-reduced-transparency: reduce)').matches) {
  const surfaces = [...document.querySelectorAll<HTMLElement>('.vitre')];
  if (surfaces.length) installer(surfaces);
}

function installer(surfaces: HTMLElement[]) {
  // Filters live in one hidden SVG (not display:none, or Chromium drops them).
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
  document.body.append(svg);

  surfaces.forEach((el, i) => {
    const id = `vitre-${i}`;
    const filtre = document.createElementNS(SVG, 'filter');
    filtre.id = id;
    filtre.setAttribute('color-interpolation-filters', 'sRGB');
    filtre.innerHTML = `
      <feImage result="carte" preserveAspectRatio="none" x="0" y="0" />
      <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="flou" />
      <feDisplacementMap in="flou" in2="carte" xChannelSelector="R" yChannelSelector="G" result="plie" />
      <feColorMatrix in="plie" type="saturate" values="1.55" />`;
    svg.append(filtre);
    const image = filtre.querySelector('feImage')!;
    const deplacement = filtre.querySelector('feDisplacementMap')!;

    let derniere = 0;
    let attente: number | null = null;
    const construire = () => {
      attente = null;
      derniere = performance.now();
      const w = Math.round(el.offsetWidth);
      const h = Math.round(el.offsetHeight);
      if (!w || !h) return;
      const r = Math.min(parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0, h / 2, w / 2);
      // One material for every surface (César 05/10): same bevel and same strength on the nav pill and
      // the hero's title card, only clamped to a third of very short surfaces.
      const bevel = Math.min(BISEAU, h / 3);
      image.setAttribute('href', carte(w, h, r, bevel));
      image.setAttribute('width', String(w));
      image.setAttribute('height', String(h));
      deplacement.setAttribute('scale', String(FORCE));
      el.style.setProperty('--vitre-filtre', `url(#${id})`);
    };
    construire();
    new ResizeObserver(() => {
      if (attente !== null) return;
      const reste = 100 - (performance.now() - derniere);
      if (reste <= 0) construire();
      else attente = window.setTimeout(construire, reste);
    }).observe(el);
  });
}

/**
 * Displacement map of a w × h rounded rectangle (radius r), as a PNG data URL. Red / green carry the
 * x / y offset (128 = none). Inside the bevel the offset points inwards along the edge's normal, with
 * a convex profile: steep at the rim, flat towards the centre.
 */
function carte(w: number, h: number, r: number, bevel: number): string {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(w, h);
  const d = img.data;
  const hw = w / 2;
  const hh = h / 2;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // Signed distance to the rounded rectangle (negative inside) and the outward normal.
      const px = x + 0.5 - hw;
      const py = y + 0.5 - hh;
      const qx = Math.abs(px) - (hw - r);
      const qy = Math.abs(py) - (hh - r);
      let nx: number;
      let ny: number;
      let dist: number;
      if (qx > 0 && qy > 0) {
        const len = Math.hypot(qx, qy) || 1;
        dist = len - r;
        nx = qx / len;
        ny = qy / len;
      } else if (qx > qy) {
        dist = qx - r;
        nx = 1;
        ny = 0;
      } else {
        dist = qy - r;
        nx = 0;
        ny = 1;
      }
      nx *= Math.sign(px) || 1;
      ny *= Math.sign(py) || 1;
      const t = Math.min(1, Math.max(0, 1 + dist / bevel)); // 1 at the rim, 0 past the bevel
      const force = t * t * (3 - 2 * t); // smoothstep: convex lens edge
      const i = (y * w + x) * 4;
      d[i] = 128 - nx * force * 127;
      d[i + 1] = 128 - ny * force * 127;
      d[i + 2] = 128;
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL();
}
