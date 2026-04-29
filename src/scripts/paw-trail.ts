/**
 * Decorative paw-print trail that meanders down the page in the background.
 * Original implementation from `_reference/hatch_landing_page.html` (~L2427-2693).
 *
 * Pure decoration. No state, no SSR — runs after DOM is ready, draws an SVG
 * S-curve, sprinkles paw prints along it, and animates them in with a pulse
 * keyframe (defined in global.css under `.paw-step.pulsing`).
 *
 * Hidden on mobile via CSS (#bird-trail { display: none } in @media ≤ 640px).
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

// Seeded RNG so layout is stable across reloads (avoids flashing).
let seed = 1;
function rnd(): number {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function inTextZone(x: number, y: number): boolean {
  const els = document.elementsFromPoint(x, y);
  return els.some(
    (el) =>
      el.matches('h1, h2, h3, p, button, .btn, input, textarea, [data-no-paw]') ||
      el.closest('[data-no-paw]') !== null,
  );
}

function drawPaw(svg: SVGSVGElement, x: number, y: number, angle: number, opacity = 0.25): void {
  const g = document.createElementNS(SVG_NS, 'g');
  g.setAttribute('class', 'paw-step');
  g.setAttribute('transform', `translate(${x}, ${y}) rotate(${angle})`);
  g.style.setProperty('--paw-op', String(opacity));
  g.style.setProperty('--paw-dur', `${2.4 + rnd() * 1.2}s`);
  g.style.setProperty('--paw-delay', `${rnd() * 1.5}s`);

  // 4 toes + 1 pad
  const toes = [
    [-6, -10, 2.5],
    [0, -12, 2.5],
    [6, -10, 2.5],
    [-3, -6, 2],
    [3, -6, 2],
  ] as const;
  for (const [dx, dy, r] of toes) {
    const c = document.createElementNS(SVG_NS, 'circle');
    c.setAttribute('cx', String(dx));
    c.setAttribute('cy', String(dy));
    c.setAttribute('r', String(r));
    c.setAttribute('fill', '#386641');
    g.appendChild(c);
  }
  const pad = document.createElementNS(SVG_NS, 'ellipse');
  pad.setAttribute('cx', '0');
  pad.setAttribute('cy', '-2');
  pad.setAttribute('rx', '5');
  pad.setAttribute('ry', '4');
  pad.setAttribute('fill', '#386641');
  g.appendChild(pad);

  svg.appendChild(g);
}

function buildTrail(): void {
  const svg = document.getElementById('bird-trail') as SVGSVGElement | null;
  if (!svg) return;

  // Clear any previous content (e.g. on resize).
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  const W = document.documentElement.scrollWidth;
  const H = document.documentElement.scrollHeight;
  svg.setAttribute('width', String(W));
  svg.setAttribute('height', String(H));
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

  // Build a smooth S-curve from top to bottom.
  const points: { x: number; y: number }[] = [];
  let x = W * 0.5;
  let y = 100;
  const step = 80;
  while (y < H - 100) {
    x += (rnd() - 0.5) * 200;
    x = Math.max(120, Math.min(W - 120, x));
    points.push({ x, y });
    y += step + rnd() * 30;
  }

  // Sprinkle paws along the path; skip points overlapping text.
  for (let i = 0; i < points.length; i++) {
    const { x: px, y: py } = points[i];
    if (inTextZone(px, py)) continue;
    const next = points[i + 1];
    const angle = next ? (Math.atan2(next.y - py, next.x - px) * 180) / Math.PI - 90 : 0;
    // Two paw prints per step, offset to look like alternating feet.
    drawPaw(svg, px - 8, py, angle, 0.18 + rnd() * 0.1);
    if (next) {
      drawPaw(svg, (px + next.x) / 2 + 8, (py + next.y) / 2, angle, 0.14 + rnd() * 0.1);
    }
  }

  // Pulse them in waves.
  const paws = svg.querySelectorAll<SVGGElement>('.paw-step');
  paws.forEach((p, i) => {
    setTimeout(() => p.classList.add('pulsing'), i * 90);
  });
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => buildTrail());
  } else {
    setTimeout(buildTrail, 100);
  }
  let resizeTimer: number | undefined;
  window.addEventListener('resize', () => {
    if (resizeTimer) window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => buildTrail(), 300);
  });
}
