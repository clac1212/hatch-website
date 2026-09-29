/**
 * Scroll-driven product demo (ported from the v4 prototype site.js: `camera()`, `allerScene()`).
 * Each `.scene` is a pinned track of src/scripts/pistes.ts; on every `etape` event the camera
 * zooms on the step's focus point, the speaking agent hops, the step's overlays come up (chat
 * bubbles "typing…" then text, boxes ticking one by one) and the step's glass panel shows.
 *
 * Stage: this script sizes `.cadre-piste` (data-largeur / data-hauteur) to the viewport's aspect
 * ratio BEFORE pistes.ts scales it, so the stage always covers the pinned viewport:
 * - wide (≥ 900 px): 1440 design px wide (1180 min, so text never shrinks under ~87 %), exactly the
 *   prototype's geometry; overlays keep their size through a counter-scale (`--inv`);
 * - narrow (< 900 px): 1 design px = 1 px; the step's overlays stack under the nav, the camera frames
 *   the active agent tighter in the space left above the full-width panel.
 *
 * Must load before pistes.ts (Demo.astro's script precedes the one in Base.astro).
 */
const RATIO = 2752 / 1536;
const ETROIT = 900;
const HAUT = 84; // clear of the fixed nav
const ECART = 8;

interface Camera {
  tx: number;
  ty: number;
  s: number;
  px: number;
  py: number;
  r: number;
}

interface Scene {
  el: HTMLElement;
  col: HTMLElement;
  cadre: HTMLElement;
  pic: HTMLElement;
  zoom: number;
  focus: [number, number][];
  parle: string[];
  agents: HTMLElement[];
  ovs: HTMLElement[];
  panneaux: HTMLElement[];
  points: HTMLElement[];
  minuteurs: number[];
  actif: number;
  arrives: boolean;
  etroit: boolean;
  VW: number;
  VH: number;
}

const tous = <T extends Element>(el: ParentNode, sel: string) => [...el.querySelectorAll<T>(sel)];
const borne = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

function requis<T extends Element>(el: ParentNode, sel: string): T {
  const x = el.querySelector<T>(sel);
  if (!x) throw new Error(`demo: missing ${sel}`);
  return x;
}

function lire(el: HTMLElement): Scene {
  return {
    el,
    col: requis(el, '.collant'),
    cadre: requis(el, '.cadre-piste'),
    pic: requis(el, '.pic'),
    zoom: Number(el.dataset.zoom),
    // Index 0 is the wide shot (no focus).
    focus: [
      [0.5, 0.5],
      ...(el.dataset.focus ?? '')
        .split(';')
        .map((v) => v.split(',').map(Number) as [number, number]),
    ],
    parle: (el.dataset.parle ?? '').split(','),
    agents: tous(el, '.agent'),
    ovs: tous(el, '.ov'),
    panneaux: tous(el, '.panneau'),
    points: tous(el, '.points i'),
    minuteurs: [],
    actif: 0,
    arrives: false,
    etroit: false,
    VW: 1440,
    VH: 900,
  };
}

/** Stage size in design px, matching the viewport's aspect ratio (read by pistes.ts' `cadrer`). */
function format(sc: Scene) {
  const vw = sc.col.clientWidth;
  const vh = sc.col.clientHeight;
  sc.etroit = vw < ETROIT;
  sc.VW = sc.etroit ? vw : borne(vw, 1180, 1440);
  sc.VH = vh / (vw / sc.VW);
  sc.cadre.dataset.largeur = String(sc.VW);
  sc.cadre.dataset.hauteur = String(sc.VH);
  sc.el.classList.toggle('etroit', sc.etroit);
}

function taille(sc: Scene, W: number, H: number) {
  sc.pic.style.width = `${W}px`;
  sc.pic.style.height = `${H}px`;
}

/** Prototype camera: image covers the stage; zoomed, the focus lands at 36 % / 52 %. */
function cameraLarge(sc: Scene, k: number): Camera {
  const { VW, VH } = sc;
  const W = Math.max(VW, VH * RATIO);
  const H = W / RATIO;
  taille(sc, W, H);
  let c: Camera;
  if (k === 0) {
    c = { tx: (VW - W) / 2, ty: (VH - H) / 2, s: 1, px: VW / 2, py: VH * 0.52, r: VH * 0.75 };
  } else {
    const [fx, fy] = sc.focus[k];
    const z = sc.zoom;
    const tx = borne(VW * 0.36 - fx * W * z, VW - W * z, 0);
    const ty = borne(VH * 0.52 - fy * H * z, VH - H * z, 0);
    c = { tx, ty, s: z, px: tx + fx * W * z, py: VH * 0.52, r: VH * 0.75 };
  }
  garder(sc, k, c, W, H);
  return c;
}

/**
 * Keeps the step's overlays inside the stage and under the nav. A no-op at 1440 × 900 (the
 * prototype's frame); it only nudges them on narrower stages (1180–1440) or short viewports.
 */
function garder(sc: Scene, k: number, c: Camera, W: number, H: number) {
  for (const o of sc.ovs) {
    if (Number(o.dataset.step) !== k) continue;
    const { w, h } = mesurer(o);
    const ax = c.tx + Number(o.style.getPropertyValue('--x')) * W * c.s;
    const ay = c.ty + Number(o.style.getPropertyValue('--y')) * H * c.s;
    const gauche =
      ax - (o.classList.contains('droite') ? w : o.classList.contains('dessus') ? w / 2 : 0);
    const haut = ay - (o.classList.contains('dessus') ? h : 0);
    const dx = borne(gauche, 16, sc.VW - 16 - w) - gauche;
    const dy = borne(haut, HAUT + 8, sc.VH - 80 - h) - haut;
    o.style.setProperty('--dx', `${dx / c.s}px`);
    o.style.setProperty('--dy', `${dy / c.s}px`);
  }
}

/** Natural size of an overlay in its final state (thread fully answered). */
function mesurer(o: HTMLElement) {
  o.classList.add('mesure');
  const t = { w: o.offsetWidth, h: o.offsetHeight };
  o.classList.remove('mesure');
  return t;
}

/** Narrow camera: overlays stacked under the nav, agent framed between them and the panel. */
function cameraEtroit(sc: Scene, k: number): Camera {
  const { VW, VH } = sc;
  const W = VW / 0.74; // wide shot: the room (≈ 72 % of the render) fills the width
  const H = W / RATIO;
  taille(sc, W, H);
  const ovs = sc.ovs.filter((o) => Number(o.dataset.step) === k);
  const tailles = ovs.map(mesurer);
  const pile = tailles.reduce((a, t) => a + t.h, 0) + Math.max(0, ovs.length - 1) * ECART;
  const panneau = sc.panneaux.find((p) => Number(p.dataset.step) === k);
  const bas = panneau ? VH - 34 - panneau.offsetHeight - 12 : VH - 40;
  const haut = HAUT + (pile ? pile + 16 : 0);
  const cy = (haut + bas) / 2;
  let c: Camera;
  if (k === 0) {
    c = { tx: (VW - W) / 2, ty: cy - H / 2, s: 1, px: VW / 2, py: cy, r: VH };
  } else {
    const [fx, fy] = sc.focus[k];
    const agent = sc.agents.find((a) => a.dataset.a === sc.parle[k]);
    const ha = agent ? Number(agent.style.getPropertyValue('--h')) : 0.22;
    // The agent takes ~3/4 of the free height (110–200 px), always tighter than the wide layout.
    const cible = borne((bas - haut) * 0.75, 110, 200);
    const z = Math.max(sc.zoom * 1.5, cible / (ha * H));
    const tx = borne(VW / 2 - fx * W * z, VW - W * z, 0);
    const ty = cy - fy * H * z;
    c = { tx, ty, s: z, px: tx + fx * W * z, py: cy, r: VH * 0.75 };
  }
  // Overlays live inside the transformed picture: convert their screen slot to picture coordinates.
  let y = HAUT;
  ovs.forEach((o, i) => {
    const sx = Math.max(12, (VW - tailles[i].w) / 2);
    o.style.setProperty('--lx', `${(sx - c.tx) / c.s}px`);
    o.style.setProperty('--ly', `${(y - c.ty) / c.s}px`);
    y += tailles[i].h + ECART;
  });
  return c;
}

function placer(sc: Scene) {
  const c = sc.etroit ? cameraEtroit(sc, sc.actif) : cameraLarge(sc, sc.actif);
  sc.pic.style.transform = `translate(${c.tx}px, ${c.ty}px) scale(${c.s})`;
  sc.pic.style.setProperty('--inv', String(1 / c.s));
  sc.col.style.setProperty('--px', `${c.px}px`);
  sc.col.style.setProperty('--py', `${c.py}px`);
  sc.col.style.setProperty('--r', `${c.r}px`);
}

/** Places without animating (first frame, resize). */
function placerSec(sc: Scene) {
  sc.el.classList.add('sans-transition');
  placer(sc);
  void sc.pic.offsetWidth;
  requestAnimationFrame(() => sc.el.classList.remove('sans-transition'));
}

function arrivee(sc: Scene) {
  if (sc.arrives) return;
  sc.arrives = true;
  sc.agents.forEach((a, i) => window.setTimeout(() => a.classList.add('la'), 250 + i * 260));
}

function allerScene(sc: Scene, k: number) {
  sc.minuteurs.forEach(clearTimeout);
  sc.minuteurs = [];
  const plus = (f: () => void, ms: number) => sc.minuteurs.push(window.setTimeout(f, ms));
  sc.actif = k;
  sc.panneaux.forEach((p) => p.classList.toggle('on', Number(p.dataset.step) === k));
  placer(sc);
  sc.col.classList.toggle('zoome', k > 0);

  sc.agents.forEach((a) => a.classList.remove('actif'));
  const qui = sc.agents.find((a) => a.dataset.a === sc.parle[k]);
  if (qui)
    plus(() => {
      void qui.offsetWidth;
      qui.classList.add('actif');
    }, 700);

  let rang = 0;
  for (const o of sc.ovs) {
    const msgs = tous<HTMLElement>(o, '.msg');
    const coches = tous<HTMLElement>(o, '.coche li');
    if (Number(o.dataset.step) !== k) {
      o.classList.remove('on');
      msgs.forEach((m) => m.classList.remove('vu', 'repondu'));
      coches.forEach((li) => li.classList.remove('fait'));
      continue;
    }
    const delai = k === 0 ? 1400 + rang * 260 : 950 + rang * 650;
    rang++;
    plus(() => {
      o.classList.add('on');
      msgs.forEach((m, i) =>
        plus(() => {
          m.classList.add('vu');
          if (m.classList.contains('tape')) plus(() => m.classList.add('repondu'), 1300);
        }, i * 750),
      );
      coches.forEach((li, i) => plus(() => li.classList.add('fait'), 500 + i * 450));
    }, delai);
  }
  sc.points.forEach((d, i) => d.classList.toggle('on', i === k));
}

const racine = document.querySelector<HTMLElement>('[data-demo]');
if (racine?.classList.contains('statique')) {
  // Reduced motion: no pinning, pistes.ts leaves these tracks alone (natural, short height).
  tous(racine, '.piste').forEach((p) => p.removeAttribute('data-piste'));
} else if (racine) {
  const scenes = tous<HTMLElement>(racine, '.scene').map(lire);
  const force = new URLSearchParams(location.search).get('etape')?.split(':')[0];
  const cible = scenes.find((sc) => sc.el.dataset.piste === force);

  for (const sc of scenes) {
    format(sc);
    placerSec(sc);
    sc.el.addEventListener('etape', (e) => allerScene(sc, (e as CustomEvent<number>).detail));
    if (cible) {
      // Capture mode (`?etape=siege:2`): only that scene, agents already in place.
      if (sc !== cible) sc.el.style.display = 'none';
      sc.agents.forEach((a) => a.classList.add('la'));
      sc.arrives = true;
    } else {
      new IntersectionObserver(
        (e, obs) => {
          if (!e[0].isIntersecting) return;
          arrivee(sc);
          obs.disconnect();
        },
        { threshold: 0.35 },
      ).observe(sc.col);
    }
  }

  // Registered before pistes.ts' own resize listener, so it rescales with the new stage size.
  addEventListener('resize', () =>
    scenes.forEach((sc) => {
      format(sc);
      placerSec(sc);
    }),
  );
}
