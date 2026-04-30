/**
 * Decorative bird-foot trail — ported from `_reference/hatch_landing_page.html`.
 *
 * Draws an S-curve dashed line across the full page height, sprinkles
 * bird-foot prints (circle pad + 3 radiating lines) along it, and reveals
 * them as the user scrolls with a pulse animation.
 */

const NS = 'http://www.w3.org/2000/svg';

// Seeded LCG matching the reference exactly.
let s = 23;
function rnd(): number {
  s = (s * 16807) % 2147483647;
  return (s - 1) / 2147483646;
}

function buildTrail(): void {
  const svg = document.getElementById('bird-trail') as SVGSVGElement | null;
  if (!svg) return;
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  const W = window.innerWidth;
  const H = document.body.scrollHeight;
  svg.setAttribute('width', String(W));
  svg.setAttribute('height', String(H));
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

  // ── S-curve path points (sine wave + drift, matching reference) ──
  const pts: { x: number; y: number }[] = [];
  const stepY = 55;
  const cx = W * 0.5;
  const amp = W * 0.42;
  const period = 1500;
  let drift = 0;
  let driftTimer = 0;

  for (let y = 0; y <= H + stepY; y += stepY) {
    const t = (y / period) * 2 * Math.PI;
    const noise = (rnd() - 0.5) * W * 0.03;
    const x = cx + amp * Math.sin(t) + noise + drift;
    pts.push({ x, y });
    if (driftTimer === 0 && rnd() > 0.94) {
      drift = (Math.sin(t) > 0 ? 1 : -1) * (W * 0.12 + rnd() * W * 0.14);
      driftTimer = 4 + Math.floor(rnd() * 4);
    } else if (driftTimer > 0) {
      driftTimer--;
      if (driftTimer === 0) drift = 0;
    }
  }

  // ── Text zones to avoid ──
  const textZones: { x: number; y: number; x2: number; y2: number }[] = [];
  const PAD_H = 50,
    PAD_V = 20;
  const sy0 = window.pageYOffset || 0;
  const sx0 = window.pageXOffset || 0;
  ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'a', 'button', 'em', 'strong'].forEach(
    (tag) => {
      document.querySelectorAll(tag).forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width < 30 || r.height < 8) return;
        textZones.push({
          x: r.left + sx0 - PAD_H,
          y: r.top + sy0 - PAD_V,
          x2: r.right + sx0 + PAD_H,
          y2: r.bottom + sy0 + PAD_V,
        });
      });
    },
  );

  function inTextZone(x: number, y: number): boolean {
    for (const tz of textZones) {
      if (x >= tz.x && x <= tz.x2 && y >= tz.y && y <= tz.y2) return true;
    }
    return false;
  }

  function pawClear(
    dpx: number,
    dpy: number,
    ax: number,
    ay: number,
    nx: number,
    ny: number,
  ): boolean {
    return !inTextZone(dpx - ax - nx, dpy - ay - ny) && !inTextZone(dpx + ax + nx, dpy + ay + ny);
  }

  // ── Main group (masked) ──
  const grp = document.createElementNS(NS, 'g') as SVGGElement;
  grp.setAttribute('mask', 'url(#trail-mask)');
  svg.appendChild(grp);

  // ── Dashed path line ──
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[Math.max(0, i - 2)];
    const p1 = pts[i - 1];
    const p2 = pts[i];
    const p3 = pts[Math.min(pts.length - 1, i + 1)];
    const c1x = p1.x + (p2.x - p0.x) / 6,
      c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6,
      c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  const pathEl = document.createElementNS(NS, 'path');
  pathEl.setAttribute('d', d);
  pathEl.setAttribute('fill', 'none');
  pathEl.setAttribute('stroke', '#386641');
  pathEl.setAttribute('stroke-width', '1.4');
  pathEl.setAttribute('stroke-linecap', 'round');
  pathEl.setAttribute('stroke-dasharray', '4 14');
  pathEl.setAttribute('opacity', '0.15');
  grp.appendChild(pathEl);

  // ── Bird-foot paw (circle pad + 3 radiating lines) ──
  function drawPaw(cx2: number, cy2: number, deg: number, delay: number): void {
    const op = (0.6 + rnd() * 0.2).toFixed(2);

    const wrapper = document.createElementNS(NS, 'g') as SVGGElement;
    wrapper.setAttribute('class', 'paw-step');
    wrapper.setAttribute('data-y', cy2.toFixed(0));
    wrapper.setAttribute('data-op', op);
    wrapper.setAttribute('data-delay', String(delay));
    wrapper.style.opacity = '0';

    const g = document.createElementNS(NS, 'g');
    g.setAttribute('transform', `rotate(${deg.toFixed(1)},${cx2.toFixed(1)},${cy2.toFixed(1)})`);

    const pad = document.createElementNS(NS, 'circle');
    pad.setAttribute('cx', cx2.toFixed(1));
    pad.setAttribute('cy', cy2.toFixed(1));
    pad.setAttribute('r', '1.8');
    pad.setAttribute('fill', '#5aad6e');
    g.appendChild(pad);

    for (const [tx, ty] of [
      [0, -10],
      [-6, -7],
      [6, -7],
    ] as const) {
      const ln = document.createElementNS(NS, 'line');
      ln.setAttribute('x1', cx2.toFixed(1));
      ln.setAttribute('y1', cy2.toFixed(1));
      ln.setAttribute('x2', (cx2 + tx).toFixed(1));
      ln.setAttribute('y2', (cy2 + ty).toFixed(1));
      ln.setAttribute('stroke', '#5aad6e');
      ln.setAttribute('stroke-width', '1.3');
      ln.setAttribute('stroke-linecap', 'round');
      g.appendChild(ln);
    }

    wrapper.appendChild(g);
    grp.appendChild(wrapper);
  }

  function getDirAt(idx: number) {
    const dxi = pts[idx + 1].x - pts[idx - 1].x;
    const dyi = pts[idx + 1].y - pts[idx - 1].y;
    const li = Math.sqrt(dxi * dxi + dyi * dyi) || 1;
    return {
      deg: (Math.atan2(dyi, dxi) * 180) / Math.PI + 90,
      nx: (-dyi / li) * 8,
      ny: (dxi / li) * 8,
      ax: (dxi / li) * 13,
      ay: (dyi / li) * 13,
    };
  }

  const pawEvery = 200;
  let pawPairIdx = 0;
  for (let pi = 1; pi < pts.length - 1; pi++) {
    if (pts[pi].y % pawEvery > stepY) continue;
    const px = pts[pi].x,
      py = pts[pi].y;
    if (px < -55 || px > W + 55) continue;

    let drawI = pi;
    const dir0 = getDirAt(pi);
    if (!pawClear(px, py, dir0.ax, dir0.ay, dir0.nx, dir0.ny)) {
      let found = false;
      for (let delta = 1; delta <= 25; delta++) {
        for (const sign of [1, -1]) {
          const ni = pi + sign * delta;
          if (ni < 1 || ni >= pts.length - 1) continue;
          const diri = getDirAt(ni);
          if (pawClear(pts[ni].x, pts[ni].y, diri.ax, diri.ay, diri.nx, diri.ny)) {
            drawI = ni;
            found = true;
            break;
          }
        }
        if (found) break;
      }
      if (!found) continue;
    }

    const dpx = pts[drawI].x,
      dpy = pts[drawI].y;
    const dir = getDirAt(drawI);
    const leftOnTop = pawPairIdx % 2 === 0;
    pawPairIdx++;
    if (leftOnTop) {
      drawPaw(dpx + dir.ax + dir.nx, dpy + dir.ay + dir.ny, dir.deg, 0);
      drawPaw(dpx - dir.ax - dir.nx, dpy - dir.ay - dir.ny, dir.deg, 110);
    } else {
      drawPaw(dpx - dir.ax - dir.nx, dpy - dir.ay - dir.ny, dir.deg, 0);
      drawPaw(dpx + dir.ax + dir.nx, dpy + dir.ay + dir.ny, dir.deg, 110);
    }
  }

  // ── SVG mask: hide trail over content elements ──
  const defs = document.createElementNS(NS, 'defs');
  const mask = document.createElementNS(NS, 'mask');
  mask.setAttribute('id', 'trail-mask');

  const bg = document.createElementNS(NS, 'rect');
  bg.setAttribute('x', '-200');
  bg.setAttribute('y', '0');
  bg.setAttribute('width', String(W + 400));
  bg.setAttribute('height', String(H));
  bg.setAttribute('fill', 'white');
  mask.appendChild(bg);

  const maskSelectors = [
    '.strip-card',
    '.pain-item',
    '.hiw-step',
    '.agent-tab',
    '.agent-panel-inner',
    '.agent-panel',
    '.price-card',
    '[class*="price-"]',
    '.faq-item',
    '.faq-q',
    '.footer',
  ];
  maskSelectors.forEach((sel) => {
    try {
      document.querySelectorAll(sel).forEach((el) => {
        const r = el.getBoundingClientRect();
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
        if (r.width < 10 || r.height < 10) return;
        const pad = 10;
        const blk = document.createElementNS(NS, 'rect');
        blk.setAttribute('x', (r.left + scrollX - pad).toFixed(0));
        blk.setAttribute('y', (r.top + scrollY - pad).toFixed(0));
        blk.setAttribute('width', (r.width + pad * 2).toFixed(0));
        blk.setAttribute('height', (r.height + pad * 2).toFixed(0));
        blk.setAttribute('rx', '14');
        blk.setAttribute('fill', 'black');
        mask.appendChild(blk);
      });
    } catch (_) {}
  });

  defs.appendChild(mask);
  svg.insertBefore(defs, svg.firstChild);
}

let pawTimer: ReturnType<typeof setInterval> | undefined;

function startPawLoop(): void {
  if (pawTimer) clearInterval(pawTimer);
  pawTimer = setInterval(() => {
    const bot = (window.scrollY || window.pageYOffset || 0) + window.innerHeight + 250;
    const paws = document.querySelectorAll<HTMLElement>('#bird-trail .paw-step');
    let remaining = 0;
    paws.forEach((el) => {
      if (el.getAttribute('data-done')) return;
      remaining++;
      if (parseFloat(el.getAttribute('data-y') || '0') <= bot) {
        el.setAttribute('data-done', '1');
        remaining--;
        const delay = parseInt(el.getAttribute('data-delay') || '0');
        const op = el.getAttribute('data-op') || '0.25';
        setTimeout(() => {
          const dur = (2.2 + Math.random() * 1.8).toFixed(2) + 's';
          const d = (-Math.random() * 4).toFixed(2) + 's';
          el.style.setProperty('--paw-op', op);
          el.style.setProperty('--paw-dur', dur);
          el.style.setProperty('--paw-delay', d);
          el.classList.add('pulsing');
        }, delay);
      }
    });
    if (remaining === 0 && paws.length > 0) clearInterval(pawTimer);
  }, 80);
}

if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      buildTrail();
      startPawLoop();
    }, 300);
  });
  window.addEventListener('resize', () => {
    setTimeout(() => {
      buildTrail();
      startPawLoop();
    }, 150);
  });
}
