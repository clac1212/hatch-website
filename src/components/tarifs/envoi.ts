/**
 * The sending scene of the pricing form: the request becomes a letter, folded in three, slipped
 * into an envelope, stamped « Envoyé » and sent off; a postcard comes back.
 *
 * Every move is a Web Animation laid on one clock (its `delay` is its start time), paused, then
 * played frame by frame by `jouer()` (or set straight to the end under reduced motion).
 */

export type Donnees = {
  date: string;
  photos: string[];
  noms: string[];
  enseigne: string;
  etablissements: number;
  nom: string;
  role: string;
  email: string;
  telephone: string;
  /** The scene's words, from the content (src/content/sections/tarifsFormulaire). */
  textes: {
    /** « {n} établissement(s) ». */
    etablissements: { un: string; plusieurs: string };
    /** Postcard title, `{prenom}` replaced. */
    merci: string;
    /** Word on the envelope's print, word on the rim of the postcard's postmark. */
    tampon: string;
    reponse: string;
  };
};

/** « {n} thing(s) » from a plural pair. */
export const pluriel = (p: { un: string; plusieurs: string }, n: number) =>
  (n > 1 ? p.plusieurs : p.un).replace('{n}', String(n));

/** The steps, in ms on the scene's clock. */
export const ETAPES = [
  { id: 'lettre', de: 0, a: 500 },
  { id: 'lecture', de: 500, a: 1200 },
  { id: 'pli-bas', de: 1200, a: 1750 },
  { id: 'pli-haut', de: 1800, a: 2400 },
  { id: 'enveloppe', de: 2400, a: 3050 },
  { id: 'glisse', de: 3050, a: 3500 },
  { id: 'rabat', de: 3550, a: 4100 },
  { id: 'tampon', de: 4200, a: 4550 },
  { id: 'frappe', de: 4550, a: 4660 },
  { id: 'leve', de: 4660, a: 5050 },
  { id: 'depart', de: 5200, a: 6400 },
  { id: 'carte', de: 6300, a: 7200 },
] as const;
export const DUREE = 7400;
const t = (id: (typeof ETAPES)[number]['id']) => ETAPES.find((e) => e.id === id)!;

/** The round rubber-stamp print, the same drawing as the hiring stamp. */
export const encre = (id: string, mot: string, haut: string, date: string) =>
  `<svg viewBox="0 0 100 100"><defs><path id="ea-h-${id}" d="M17 50a33 33 0 0 1 66 0"/><path id="ea-b-${id}" d="M10 50a40 40 0 0 0 80 0"/></defs><g filter="url(#envoi-encre)"><circle cx="50" cy="50" r="47" class="e-ring"/><circle cx="50" cy="50" r="42" class="e-ring e-fin"/><text class="e-bord"><textPath href="#ea-h-${id}" startOffset="50%" text-anchor="middle">${haut}</textPath></text><text class="e-bord"><textPath href="#ea-b-${id}" startOffset="50%" text-anchor="middle">${date}</textPath></text><rect x="6" y="39" width="88" height="22" rx="2" class="e-bande"/><text x="50" y="55" text-anchor="middle" class="e-mot">${mot}</text></g></svg>`;

const ressort = 'cubic-bezier(0.3, 1.35, 0.5, 1)';
const doux = 'cubic-bezier(0.65, 0, 0.35, 1)';

/** A cubic-bezier easing as a function, to sample a curve the CSS one follows. */
const bezier = (x1: number, y1: number, x2: number, y2: number) => (x: number) => {
  const b = (a: number, c: number, u: number) =>
    3 * a * u * (1 - u) ** 2 + 3 * c * u * u * (1 - u) + u ** 3;
  let bas = 0;
  let haut = 1;
  for (let i = 0; i < 24; i++) {
    const u = (bas + haut) / 2;
    if (b(x1, x2, u) < x) bas = u;
    else haut = u;
  }
  return b(y1, y2, (bas + haut) / 2);
};
/** The fold's curve, `doux` as a function. */
const courbe = bezier(0.65, 0, 0.35, 1);

/** Fills the scene with the request, and lays every move on the clock, paused at 0. */
export const construire = (racine: HTMLElement, d: Donnees) => {
  const q = <T extends HTMLElement = HTMLElement>(s: string) => racine.querySelector<T>(s)!;
  const prenom = d.nom.split(/\s+/)[0];
  q('[data-l-date]').textContent = d.date;
  q('[data-l-visages]').innerHTML = d.photos.map((p) => `<img src="${p}" alt="">`).join('');
  q('[data-l-ens]').textContent = d.enseigne;
  q('[data-l-detail]').textContent =
    `${pluriel(d.textes.etablissements, d.etablissements)} · ${d.noms.join(', ')}`;
  // The visitor's own words: text nodes only, never markup.
  const nom = document.createElement('b');
  nom.textContent = d.nom;
  q('[data-l-contact]').replaceChildren(
    nom,
    d.role,
    document.createElement('br'),
    `${d.email} · ${d.telephone}`,
  );
  q('[data-cp-titre]').textContent = d.textes.merci.replace('{prenom}', prenom);
  q('[data-cp-nom]').textContent = d.nom;
  q('[data-cp-ens]').textContent = d.enseigne;
  q('[data-cp-cachet]').innerHTML = encre('cachet', 'Hatch OS', d.textes.reponse, d.date);
  const empreinte = q('[data-empreinte]');
  empreinte.style.setProperty('--r', `${Math.round(Math.random() * 24 - 12)}deg`);
  empreinte.innerHTML = encre('envoi', d.textes.tampon, 'Hatch OS', d.date);

  const anims: Animation[] = [];
  // An element's first move fills backwards (its state before it starts); its later moves on the
  // same properties only fill forwards, or they would override the first one before they start.
  const poser = (
    e: Element,
    k: Keyframe[],
    de: number,
    duree: number,
    easing = doux,
    fill: FillMode = 'both',
  ) => anims.push(e.animate(k, { delay: de, duration: duree, easing, fill }));

  const lettre = q('[data-lettre]');
  const env = [...racine.querySelectorAll('[data-env]')];
  const rabat = q('[data-rabat]');
  const tampon = q('[data-env-tampon]');
  const courrier = q('[data-courrier]');
  const sol = q('[data-sol]');
  const carte = q('[data-reponse]');
  const voile = (id: string) => q(`[data-voile="${id}"]`);

  // 1. The letter, written.
  poser(
    lettre,
    [
      { opacity: 0, translate: '0 28px', scale: 0.97 },
      { opacity: 1, translate: '0 0', scale: 1 },
    ],
    t('lettre').de,
    t('lettre').a - t('lettre').de,
    ressort,
  );
  // 2. Folded in three. Each third turns toward the viewer: its inside darkens as it rises to the
  // vertical, its outside comes out of the shade as it lands; it shades what it is about to cover.
  const plier = (n: 1 | 3, angle: string, de: number, a: number, portee: string) => {
    const d = a - de;
    poser(
      q(`[data-pli="${n}"]`),
      [{ transform: 'rotateX(0)' }, { transform: `rotateX(${angle})` }],
      de,
      d,
    );
    poser(voile(`${n}-dedans`), [{ opacity: 0 }, { opacity: 0.1 }], de, d / 2, 'ease-in');
    poser(voile(`${n}-dehors`), [{ opacity: 0.1 }, { opacity: 0 }], de + d / 2, d / 2, 'ease-out');
    poser(q(`[data-portee="${portee}"]`), [{ opacity: 0 }, { opacity: 1 }], de, d, 'ease-in');
  };
  plier(3, '180deg', t('pli-bas').de, t('pli-bas').a, '2');
  plier(1, '-180deg', t('pli-haut').de, t('pli-haut').a, '3');
  // The letter's shadow on the table follows the paper's footprint, sampled from the fold's own
  // curve: a moving third covers the table down to cos(angle) of its height until it stands up.
  const h = 190;
  const pb = t('pli-bas');
  const ph = t('pli-haut');
  const total = ph.a - pb.de;
  const ombre: Keyframe[] = [];
  const echantillons = (de: number, a: number, inset: (pied: number) => string) => {
    for (let k = 0; k <= 12; k++) {
      const p = k / 12;
      const pied = h * Math.max(0, Math.cos(Math.PI * courbe(p)));
      ombre.push({ offset: (de - pb.de + p * (a - de)) / total, inset: inset(pied) });
    }
  };
  echantillons(pb.de, pb.a, (pied) => `0 0 ${h - pied}px 0`);
  echantillons(ph.de, ph.a, (pied) => `${h - pied}px 0 ${h}px 0`);
  poser(q('[data-lettre-ombre]'), ombre, pb.de, total, 'linear');
  // 3. Into the envelope. The letter rises while the envelope slides onto the table from below the
  // frame, then it drops in. The letter's moves share one animation (same property).
  const e = t('enveloppe');
  const g = t('glisse');
  poser(
    lettre,
    [
      { translate: '0 0', scale: 1, easing: 'cubic-bezier(0.3, 0, 0.2, 1)' },
      { translate: '0 -150px', scale: 0.94, offset: (e.a - 100 - e.de) / (g.a - e.de) },
      {
        translate: '0 -150px',
        scale: 0.94,
        offset: (g.de - e.de) / (g.a - e.de),
        easing: 'cubic-bezier(0.5, 0, 0.25, 1)',
      },
      { translate: '0 131px', scale: 0.94 },
    ],
    e.de,
    g.a - e.de,
    'linear',
    'forwards',
  );
  // The envelope: one piece, flap open, every part on the same move; no fade, it enters the frame.
  env.forEach((x) =>
    poser(
      x,
      [{ translate: '0 540px' }, { translate: '0 0' }],
      e.de + 120,
      e.a - e.de - 120,
      'cubic-bezier(0.16, 1, 0.3, 1)',
    ),
  );
  // The flap: open (behind the letter), it swings shut. At the vertical (half way on a symmetric
  // curve) it comes in front of the letter and swaps faces: only one face is ever painted.
  const r = t('rabat');
  const dr = r.a - r.de;
  poser(
    rabat,
    [
      { transform: 'perspective(900px) rotateX(180deg)' },
      { transform: 'perspective(900px) rotateX(0)' },
    ],
    r.de,
    dr,
    doux,
  );
  const bascule = (x: Element, avant: Keyframe, apres: Keyframe) =>
    poser(
      x,
      [avant, { ...avant, offset: 0.5 }, { ...apres, offset: 0.5 }, apres],
      r.de,
      dr,
      'linear',
    );
  bascule(rabat, { zIndex: 0 }, { zIndex: 4 });
  bascule(q('[data-rabat-dedans]'), { visibility: 'visible' }, { visibility: 'hidden' });
  bascule(q('[data-rabat-dehors]'), { visibility: 'hidden' }, { visibility: 'visible' });
  poser(voile('rabat-dedans'), [{ opacity: 0 }, { opacity: 0.22 }], r.de, dr / 2, 'ease-in');
  poser(
    voile('rabat-dehors'),
    [{ opacity: 0.22 }, { opacity: 0 }],
    r.de + dr / 2,
    dr / 2,
    'ease-out',
  );
  // 4. Stamped.
  poser(
    tampon,
    [
      { opacity: 0, translate: '130px -170px', scale: 1.3 },
      { opacity: 1, translate: '0 0', scale: 1.08 },
    ],
    t('tampon').de,
    t('tampon').a - t('tampon').de,
  );
  poser(tampon, [{ scale: 1.08 }, { scale: 0.92 }], t('frappe').de, 110, 'ease-in', 'forwards');
  poser(
    empreinte,
    [
      { opacity: 0, scale: 1.12 },
      { opacity: 0.9, scale: 1 },
    ],
    t('frappe').a - 10,
    200,
    'cubic-bezier(0.2, 1.6, 0.5, 1)',
  );
  poser(
    tampon,
    [
      { opacity: 1, translate: '0 0', scale: 0.92 },
      { opacity: 0, translate: '160px -130px', scale: 1.2 },
    ],
    t('leve').de,
    t('leve').a - t('leve').de,
    doux,
    'forwards',
  );
  // 5. Off it goes: it settles, lifts off the table (its shadow stays and spreads), tilts and
  // flies away into the depth. A postcard drops in, bounces and lies down.
  const pose = (x: number, y: number, z: number, rx: number, ry: number, rz: number, s: number) =>
    `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${s})`;
  const dep = t('depart');
  poser(
    courrier,
    [
      { transform: pose(0, 0, 0, 0, 0, 0, 1), opacity: 1, easing: 'cubic-bezier(0.3, 0, 0.4, 1)' },
      {
        transform: pose(0, 10, 0, 7, 0, 1, 0.985),
        opacity: 1,
        offset: 0.16,
        easing: 'cubic-bezier(0.2, 0.7, 0.4, 1)',
      },
      {
        transform: pose(-14, -70, 90, -9, 8, -5, 1),
        opacity: 1,
        offset: 0.42,
        easing: 'cubic-bezier(0.55, 0, 0.8, 0.5)',
      },
      {
        transform: pose(230, -250, -160, 16, -24, 8, 0.92),
        opacity: 1,
        offset: 0.7,
        easing: 'cubic-bezier(0.3, 0.2, 0.6, 1)',
      },
      {
        transform: pose(360, -360, -320, 22, -34, 13, 0.86),
        opacity: 1,
        offset: 0.8,
        easing: 'cubic-bezier(0.4, 0, 1, 1)',
      },
      { transform: pose(640, -620, -900, 30, -50, 20, 0.78), opacity: 0 },
    ],
    dep.de,
    dep.a - dep.de,
    'linear',
  );
  poser(
    sol,
    [
      { opacity: 0, scale: 1, translate: '0 0' },
      { opacity: 0.5, scale: 0.96, translate: '0 0', offset: 0.16 },
      { opacity: 0.18, scale: 1.06, translate: '10px 16px', offset: 0.42 },
      { opacity: 0, scale: 1.12, translate: '50px 20px', offset: 0.66 },
      { opacity: 0, scale: 1.12, translate: '50px 20px' },
    ],
    dep.de,
    dep.a - dep.de,
    'linear',
  );
  const c = t('carte');
  poser(
    carte,
    [
      {
        transform: pose(-140, -320, 260, -38, 10, -16, 1),
        opacity: 0,
        easing: 'cubic-bezier(0.3, 0, 0.7, 0.6)',
      },
      { opacity: 1, offset: 0.18 },
      {
        transform: pose(0, 8, 0, 6, 0, -2.6, 1),
        opacity: 1,
        offset: 0.62,
        easing: 'cubic-bezier(0.3, 0, 0.4, 1)',
      },
      {
        transform: pose(0, -5, 0, -2, 0, -1.2, 1),
        opacity: 1,
        offset: 0.82,
        easing: 'cubic-bezier(0.4, 0, 0.5, 1)',
      },
      { transform: pose(0, 0, 0, 0, 0, -1.5, 1), opacity: 1 },
    ],
    c.de,
    c.a - c.de,
    'linear',
  );
  anims.forEach((a) => a.pause());
  const regler = (ms: number) => anims.forEach((a) => (a.currentTime = ms));
  regler(0);

  // Act 4: the card opens. The letter's table goes, the card straightens and takes the full width
  // with its agenda under it. One movement, measured (FLIP): the card goes from where it lay,
  // tilted, to its open place and width, while the stage grows from its height to the open one
  // (it clips, so the agenda is uncovered rather than pushed in, and the page never collapses);
  // the agenda's content then rises in (CSS, Envoi.astro).
  const ouvrir = (calme: boolean) => {
    // The card stays centred in the stage, its top on the stage's top: it moves from its centre
    // line and its top edge (the rect is the tilted card's box, close enough at 1.5°).
    const avant = carte.getBoundingClientRect();
    const lAvant = carte.offsetWidth;
    const hAvant = racine.offsetHeight;
    carte.getAnimations().forEach((a) => a.cancel());
    racine.classList.add('ouverte');
    if (calme) return;
    const apres = carte.getBoundingClientRect();
    const dx = avant.left + avant.width / 2 - (apres.left + apres.width / 2);
    const temps = { duration: 700, easing: doux };
    racine.animate([{ height: `${hAvant}px` }, { height: `${racine.offsetHeight}px` }], temps);
    carte.animate(
      [
        {
          width: `${lAvant}px`,
          transformOrigin: '50% 0',
          transform: `translate(${dx}px, ${avant.top - apres.top}px) rotate(-1.5deg)`,
        },
        { width: `${carte.offsetWidth}px`, transformOrigin: '50% 0', transform: 'none' },
      ],
      temps,
    );
  };
  return { regler, prenom, ouvrir };
};

/** Plays the scene once in real time; `aMs` is called on every frame with the clock. */
export const jouer = (regler: (ms: number) => void, aMs?: (ms: number) => void) =>
  new Promise<void>((fin) => {
    const debut = performance.now();
    const pas = () => {
      const ms = Math.min(DUREE, performance.now() - debut);
      regler(ms);
      aMs?.(ms);
      if (ms < DUREE) requestAnimationFrame(pas);
      else fin();
    };
    requestAnimationFrame(pas);
  });
