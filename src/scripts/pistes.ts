/**
 * Pinned tracks engine (ported from the v4 prototype, site.js "Moteur des pistes épinglées").
 *
 * Markup:
 *   <section class="piste" data-piste="probleme" data-longueurs="100,75,75" data-cadence="420">
 *     <div class="collant"> … </div>
 *   </section>
 *
 * - The `.collant` child sticks to the viewport for the whole track.
 * - `data-longueurs`: scroll length of each step, in % of the viewport height (n+1 values for n steps);
 *   or `data-etapes` (count) + `data-long` (same length for every step, default 90).
 * - The scroll position picks the target step; a queue advances ONE step at a time, never faster than
 *   `data-cadence` ms (default 500), so a fast scroll chains the steps instead of skipping them.
 *   The wheel is never captured: scrolling stays the browser's.
 * - Each step change dispatches `etape` (CustomEvent<number>) on the `.piste` element.
 * - Optional fixed-size stage: a `.cadre-piste` child with `data-largeur` / `data-hauteur` (design px)
 *   is scaled to fit the viewport and centred (used by the diorama demo).
 *
 * Capture/debug: `?etape=<data-piste>:<k>` shows only that section, frozen at step k.
 */
interface Piste {
  el: HTMLElement;
  n: number;
  cumul: number[];
  cadence: number;
  col: HTMLElement;
  cadre: HTMLElement | null;
  k: number;
  cible: number;
  dernier: number;
  file: number | null;
}

function lire(el: HTMLElement): Piste {
  const n0 = Number(el.dataset.etapes ?? 0);
  const pas = Number(el.dataset.long ?? 90);
  const longueurs = el.dataset.longueurs
    ? el.dataset.longueurs.split(',').map(Number)
    : Array<number>(n0 + 1).fill(pas);
  const cumul = longueurs.reduce<number[]>((a, l) => [...a, a[a.length - 1] + l], [0]);
  el.style.height = `${((cumul[cumul.length - 1] + 100) / 100) * 100}dvh`;
  const col = el.querySelector<HTMLElement>('.collant');
  if (!col) throw new Error(`.piste[data-piste="${el.dataset.piste}"] needs a .collant child`);
  return {
    el,
    n: longueurs.length - 1,
    cumul,
    cadence: Number(el.dataset.cadence ?? 500),
    col,
    cadre: el.querySelector<HTMLElement>('.cadre-piste'),
    k: -1,
    cible: 0,
    dernier: 0,
    file: null,
  };
}

function cadrer(p: Piste) {
  if (!p.cadre) return;
  const w = Number(p.cadre.dataset.largeur ?? 1440);
  const h = Number(p.cadre.dataset.hauteur ?? 900);
  const vw = p.col.clientWidth;
  const vh = p.col.clientHeight;
  const s = Math.min(vw / w, vh / h);
  p.cadre.style.width = `${w}px`;
  p.cadre.style.height = `${h}px`;
  p.cadre.style.transform = `translate(${(vw - w * s) / 2}px, ${(vh - h * s) / 2}px) scale(${s})`;
  p.cadre.style.setProperty('--echelle', String(s));
}

function annoncer(p: Piste, k: number) {
  if (k === p.k) return;
  p.k = k;
  p.dernier = performance.now();
  p.el.dispatchEvent(new CustomEvent<number>('etape', { detail: k }));
}

function brute(p: Piste): number {
  const r = p.el.getBoundingClientRect();
  const parcouru = (-r.top / p.col.getBoundingClientRect().height) * 100;
  let e = 0;
  while (e < p.n && parcouru >= p.cumul[e + 1]) e++;
  return e;
}

function avancer(p: Piste) {
  if (p.file !== null) clearTimeout(p.file);
  p.file = null;
  if (p.k === p.cible) return;
  const attente = p.cadence - (performance.now() - p.dernier);
  if (attente > 0) {
    p.file = window.setTimeout(() => avancer(p), attente);
    return;
  }
  annoncer(p, p.k + Math.sign(p.cible - p.k));
  if (p.k !== p.cible) p.file = window.setTimeout(() => avancer(p), p.cadence);
}

const pistes = [...document.querySelectorAll<HTMLElement>('.piste[data-piste]')].map(lire);
const force = new URLSearchParams(location.search).get('etape');

if (force) {
  const [cle, k] = force.split(':');
  const cible = pistes.find((p) => p.el.dataset.piste === cle);
  if (cible) {
    document.querySelectorAll<HTMLElement>('main > *').forEach((s) => {
      if (!s.contains(cible.el)) s.style.display = 'none';
    });
    cible.el.style.height = '100dvh';
    document.querySelectorAll('[data-rv]').forEach((el) => el.classList.add('vu'));
    cadrer(cible);
    annoncer(cible, Number(k));
  }
} else {
  const maj = () => {
    for (const p of pistes) {
      p.cible = brute(p);
      if (p.k < 0) annoncer(p, p.cible);
      else if (p.file === null) avancer(p);
    }
  };
  let raf = false;
  addEventListener(
    'scroll',
    () => {
      if (raf) return;
      raf = true;
      requestAnimationFrame(() => {
        raf = false;
        maj();
      });
    },
    { passive: true },
  );
  addEventListener('resize', () => pistes.forEach(cadrer));
  pistes.forEach(cadrer);
  maj();
}
