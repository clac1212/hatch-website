/**
 * 03 — Problème: renders each step of the pinned track (ported from the v4 prototype, `etatProbleme`).
 *
 * Steps (16, driven by src/scripts/pistes.ts):
 *   0 empty lock screen · 1-7 a notification arrives (the phone vibrates) · 8-14 an agent answers
 *   (most recent first) · 15 only Hatch's summary is left.
 *
 * Runs before the engine (Base.astro imports it last), so it can drop the track under reduced motion
 * and size the portrait stage before the engine's first framing.
 */
const section = document.querySelector<HTMLElement>('.piste[data-piste="probleme"]');

if (section) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // No track: the engine ignores the section, the CSS shows the static final state.
    delete section.dataset.piste;
  } else {
    animer(section);
  }
}

function animer(section: HTMLElement) {
  const { quand, horloge } = JSON.parse(section.dataset.textes!) as {
    quand: string[];
    horloge: string[];
  };
  // Rendered by Probleme.astro: these nodes always exist.
  const q = <T extends Element = HTMLElement>(sel: string) => section.querySelector<T>(sel)!;
  const cadre = q('.cadre-piste');
  const collant = q('.collant');
  const vibreur = q('.vibreur');
  const heure = q('.heure');
  const pile = q('.pile');
  const resume = q('.resume');
  const avant = q('.avant');
  const apres = q('.apres');
  const remplissage = q('.remplissage');
  const paliers = [...section.querySelectorAll<HTMLElement>('.paliers span')];
  const avatars = [...section.querySelectorAll<HTMLElement>('.agents img')];
  // Most recent first: card k is notification 6 - k.
  const cartes = [...section.querySelectorAll<HTMLElement>('.notif')];
  const ages = cartes.map((c) => c.querySelector<HTMLElement>('.f-notif .quand')!);

  // Portrait stage: 440 design px wide and as tall as the screen allows, so a 390 px phone shows it
  // at ~0.87 (cards ≥ 13 px). The phone runs off the bottom edge: its notification stack is lifted
  // (--bas, from the screen's bottom) to stay above the fade. Kept in sync with the CSS below.
  const portrait = matchMedia('(max-aspect-ratio: 1/1), (max-width: 639.98px)');
  const HAUT_TELEPHONE = 88 + 160 + 12; // padding-top + .texte + margin-top
  const FONDU = 40;
  const dimensionner = () => {
    if (portrait.matches) {
      const h = (collant.clientHeight * 440) / collant.clientWidth;
      const hauteur = Math.round(Math.max(880, Math.min(h, 1100)));
      const visible = hauteur - HAUT_TELEPHONE - FONDU; // phone px above the fade
      cadre.dataset.largeur = '440';
      cadre.dataset.hauteur = String(hauteur);
      // Screen bottom is at 18 + 763 px in the phone; 104 px is the desktop stack offset.
      cadre.style.setProperty('--bas', `${Math.max(104, 781 - visible + 8)}px`);
    } else {
      cadre.dataset.largeur = '1240';
      cadre.dataset.hauteur = '980';
    }
  };
  dimensionner();
  // Registered before the engine's own resize listener, which then re-frames with these sizes.
  addEventListener('resize', dimensionner);

  // Gauge step for n notifications arrived: 3, 12 then 30 sites.
  const palier = (n: number) => (n <= 1 ? 0 : n <= 3 ? 1 : 2);
  let precedente = -1;

  section.addEventListener('etape', (ev) => {
    const e = (ev as CustomEvent<number>).detail;
    const arrivees = Math.min(e, 7);
    const reponses = e >= 8 ? Math.min(e - 7, 7) : 0;
    const fin = e >= 15;
    const arrivee = (j: number) => 6 - j < arrivees;
    // A card leaves once the next agent has answered; everything but the summary leaves at the end.
    const presente = (j: number) => arrivee(j) && !(fin || j < reponses - 1);

    cartes.forEach((el, k) => {
      const repondu = k < reponses;
      // At most 4 cards on screen: the most recent ones still present.
      const devant = cartes.slice(0, k).filter((_, j) => presente(j)).length;
      el.classList.toggle('on', presente(k) && devant < 4);
      el.classList.toggle('repondu', repondu);
      const rang = cartes.slice(0, k).filter((_, j) => arrivee(j)).length;
      ages[k].textContent = quand[rang < 1 ? 0 : rang < 3 ? 1 : 2];
      avatars[k].classList.toggle('on', repondu);
    });
    pile.classList.toggle('cache', cartes.filter((_, k) => presente(k)).length <= 4);
    resume.classList.toggle('on', fin);

    const p = arrivees ? palier(arrivees) : -1;
    remplissage.style.width = `${[0, 7, 52, 100][p + 1]}%`;
    paliers.forEach((sp, i) => {
      sp.classList.toggle('actif', i === p);
      sp.classList.toggle('passe', i < p);
    });
    heure.textContent = horloge[fin ? 4 : Math.min(3, Math.floor(Math.max(0, arrivees - 1) / 2))];

    avant.classList.toggle('cache', reponses > 0);
    apres.classList.toggle('cache', reponses === 0);

    // The phone vibrates on each new notification (scrolling down only).
    if (precedente >= 0 && e > precedente && e >= 1 && e <= 7) {
      vibreur.classList.remove('vibre');
      void vibreur.offsetWidth;
      vibreur.classList.add('vibre');
    }
    precedente = e;
  });
}
