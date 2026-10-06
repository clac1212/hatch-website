/**
 * "Mise en place" product tour (ported from the v4 prototype, site.js `miseEnPlace()`), its beats
 * played like the diorama's agent demos (src/components/sections/demo-motion.ts, César 02/10).
 *
 * The markup renders the stacked layout in its final state (mobile, no JS). From md up the section
 * gets `.onglets`: the three windows are stacked one behind the other ("Time Machine": the front
 * window flies towards the viewer and the next one comes forward) and the three steps under them
 * become tabs (role=tablist/tab/tabpanel, arrows/Home/End, focus follows the selection).
 *
 * Nothing is scroll-linked (the diorama above already pins the scroll, César + cofounder 02/10): when
 * motion is allowed, one GSAP timeline covers the three states — sources connecting one by one with a
 * counter, then the conversation and the migration bars, then the channels and the Inès → Owl
 * exchange — each followed by a hold so it can be read. It plays while the windows are substantially
 * in view, pauses when they leave (or the page is hidden, or keyboard focus is inside), resumes where
 * it was when they come back,
 * and loops to the first state after the last one. A tab (or "Continuer") jumps to its state and the
 * tour plays on from there. The timeline drives the window in front, the tabs (the current tab's bar
 * fills with the timeline's progress inside that state) and the content of each window.
 *
 * Reduced motion: no timeline, no autoplay; the tabs still switch, each window in its final state.
 *
 * Capture/debug: `?etape=mep:<k>` freezes state k, its bar half full.
 */
type Gsap = (typeof import('gsap'))['gsap'];
type Timeline = ReturnType<Gsap['timeline']>;

/** Seconds: length of each state (its beats, then a hold so it can be read). */
const DUREES = [5, 8.5, 7];
/** Seconds into a state before its content plays: the Time Machine move (0.95 s) settles first. */
const DEBUT = 0.8;
/** Share of the windows in view that starts the tour; below the lower one, it pauses. */
const VU = 0.6;
const HORS_VUE = 0.25;

const section = document.querySelector<HTMLElement>('#mise-en-place');
if (section) init(section);

function init(section: HTMLElement) {
  const $$ = (el: ParentNode, sel: string) => [...el.querySelectorAll<HTMLElement>(sel)];
  const scene = section.querySelector<HTMLElement>('.mep-scene')!;
  const etats = $$(section, '[data-mep-etat]');
  const pas = $$(section, '[data-mep-pas]');
  const jauges = pas.map((p) => p.querySelector<HTMLElement>('.jauge > span')!);
  const suivants = $$(section, '[data-mep-suivant]');
  if (etats.length !== 3 || pas.length !== 3) throw new Error('MiseEnPlace: unexpected markup');

  // State 1: connected sources light up one by one, the counter follows.
  const sources = $$(etats[0], '[data-source]').map((el) => ({
    el,
    point: el.querySelector<HTMLElement>('.point')!,
    libelle: el.querySelector<HTMLElement>('.libelle')!,
  }));
  const compteur = etats[0].querySelector<HTMLElement>('[data-compteur]')!;
  const regles = new Intl.PluralRules(document.documentElement.lang);
  let allumees = -1;
  /** The first n sources connected, the others not; the counter says n. */
  function allumer(n: number) {
    if (n === allumees) return;
    allumees = n;
    sources.forEach((s, i) => {
      s.el.classList.toggle('eteint', i >= n);
      s.libelle.textContent = (i < n ? s.libelle.dataset.on : s.libelle.dataset.off)!;
    });
    const modele = regles.select(n) === 'one' ? compteur.dataset.one : compteur.dataset.other;
    compteur.textContent = modele!.replace('{n}', String(n));
  }

  // State 2: conversation bubbles, then the migration bars and counters.
  const bulles = $$(etats[1], '[data-bulle]');
  const lignes = $$(etats[1], '[data-ligne]').map((el) => {
    const barre = el.querySelector<HTMLElement>('[data-barre]')!;
    return {
      barre,
      largeur: barre.style.width,
      valeur: el.querySelector<HTMLElement>('[data-valeur]')!,
      etat: el.querySelector<HTMLElement>('[data-etat-ligne]')!,
      fait: Number(el.dataset.fait),
      total: Number(el.dataset.total),
    };
  });

  // State 3: channels, then the Inès → Owl exchange.
  const canaux = $$(etats[2], '[data-canal]');
  const fil = $$(etats[2], '[data-fil]');

  /** Final state of every window (the markup's, for the parts the timeline writes as text or class). */
  function final() {
    allumer(sources.length);
    lignes.forEach((l) => (l.valeur.textContent = `${l.fait} / ${l.total}`));
  }

  /** The tabs layout; the timeline needs motion on top of it. */
  const mqOnglets = matchMedia('(min-width: 48rem)');
  const mqJeu = matchMedia('(min-width: 48rem) and (prefers-reduced-motion: no-preference)');
  const force = new URLSearchParams(location.search).get('etape')?.match(/^mep:([0-2])$/);
  let onglets = false;
  let k = 0;

  function afficher() {
    // Distance from the current step: drives the "Time Machine" stack in the component's CSS.
    etats.forEach((el, i) => {
      el.dataset.d = String(i - k);
      // Windows behind the front one are out of reach (focus, pointer, assistive tech).
      el.inert = onglets && i !== k;
    });
    pas.forEach((p, i) => {
      p.dataset.etat = i < k ? 'fait' : i === k ? 'actif' : 'a-venir';
      p.setAttribute('aria-selected', String(i === k));
      p.tabIndex = i === k ? 0 : -1;
    });
  }
  function marquer(i: number) {
    if (i === k) return;
    k = i;
    afficher();
  }

  function mode() {
    onglets = mqOnglets.matches;
    section.classList.toggle('onglets', onglets);
    // Tabpanels only while there are tabs: stacked, the windows are plain blocks under their h3.
    etats.forEach((el, i) => {
      if (onglets) {
        el.setAttribute('role', 'tabpanel');
        el.setAttribute('aria-labelledby', pas[i].id);
      } else {
        el.removeAttribute('role');
        el.removeAttribute('aria-labelledby');
      }
    });
    afficher();
    if (!tl) final();
  }

  // ---------- Timeline (GSAP, loaded when the section comes near, only with motion allowed) ----------

  let g: Gsap | null = null;
  let tl: Timeline | null = null;
  let debuts: number[] = [];
  /** The windows are substantially in view (with hysteresis, see VU / HORS_VUE). */
  let visible = false;
  /** Brings what the timeline writes as text or class in line with the playhead (set by `construire`). */
  let synchro = () => {};

  function construire(gsap: Gsap): Timeline {
    debuts = DUREES.map((_, i) => DUREES.slice(0, i).reduce((a, d) => a + d, 0));
    /** Tweened numbers the DOM shows as text: sources connected, then each migration counter. */
    const n = { v: 0 };
    const comptes = lignes.map(() => ({ v: 0 }));
    // One place renders them, on every frame and after every jump: GSAP's play(t)/pause(t) suppress
    // the tweens' callbacks, so per-tween onUpdates would leave stale text after a jump back.
    synchro = () => {
      const t = m.time();
      marquer(
        Math.max(
          0,
          debuts.findLastIndex((d) => t >= d),
        ),
      );
      allumer(Math.ceil(n.v));
      lignes.forEach((l, i) => {
        const txt = `${Math.round(comptes[i].v)} / ${l.total}`;
        if (l.valeur.textContent !== txt) l.valeur.textContent = txt;
      });
    };
    const m = gsap.timeline({
      paused: true,
      onUpdate: () => synchro(),
      // The last state has held: back to the first one. Only reached while playing, i.e. in view.
      onComplete: () => aller(0, true),
    });
    /** Something arrives: it fades in from a few pixels below (`--y`, the CSS's `translate`). */
    const entrer = (el: HTMLElement, at: number) =>
      m.fromTo(
        el,
        { autoAlpha: 0, '--y': 8 },
        { autoAlpha: 1, '--y': 0, duration: 0.55, ease: 'expo.out' },
        at,
      );

    // Tabs: the bar of a step fills over its state, and stays full once done.
    jauges.forEach((j, i) =>
      m.fromTo(j, { scaleX: 0 }, { scaleX: 1, duration: DUREES[i], ease: 'none' }, debuts[i]),
    );

    // 1. The sources connect one by one (their dot pops), the counter follows.
    const t0 = debuts[0] + DEBUT;
    const pasSource = 0.35;
    m.fromTo(
      n,
      { v: 0 },
      { v: sources.length, duration: sources.length * pasSource, ease: 'none' },
      t0,
    );
    sources.forEach((s, i) =>
      m.fromTo(
        s.point,
        { scale: 1 },
        {
          scale: 1.4,
          duration: 0.16,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
          immediateRender: false,
        },
        t0 + i * pasSource,
      ),
    );

    // 2. The conversation, one bubble at a time, then the migration: each bar fills while its
    //    counter counts up, then its status pops.
    const t1 = debuts[1] + DEBUT;
    bulles.forEach((b, i) => entrer(b, t1 + i * 0.8));
    const t1b = t1 + bulles.length * 0.8;
    lignes.forEach((l, i) => {
      const at = t1b + i * 0.3;
      m.fromTo(
        l.barre,
        { width: '0%' },
        { width: l.largeur, duration: 1.3, ease: 'power3.out' },
        at,
      )
        .fromTo(comptes[i], { v: 0 }, { v: l.fait, duration: 1.3, ease: 'power3.out' }, at)
        .fromTo(
          l.etat,
          { autoAlpha: 0, scale: 0.4 },
          { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' },
          at + 1.3,
        );
    });

    // 3. The channels come online, then Inès asks and Owl answers.
    const t2 = debuts[2] + DEBUT;
    canaux.forEach((c, i) => entrer(c, t2 + i * 0.22));
    fil.forEach((f, i) => entrer(f, t2 + 0.8 + i * 1.3));

    // The from-values render at once (start state), the text follows.
    synchro();
    return m;
  }

  /** Keyboard focus is in the tour: it holds still under the reader (as an APG carousel does). */
  let tenu = false;
  /** The tour plays only while its windows are in view, the page is shown and no keyboard is in it. */
  const enJeu = () => visible && !tenu && !document.hidden;

  /** Jump the playhead to `t` (seconds), then play from there or stay paused. */
  function aller(t: number, jouer: boolean) {
    if (!tl) return;
    if (jouer) tl.play(t);
    else tl.pause(t);
    synchro();
  }

  /** Play or pause where the playhead is, as visibility says. */
  function regler() {
    if (!tl) return;
    tl.paused(!enJeu());
  }

  /** A tab or "Continuer" was used: go to state i, the tour plays on from there. */
  function choisir(i: number) {
    if (tl) aller(debuts[i], enJeu());
    else marquer(i);
  }

  let chargement = false;
  /** The section is within a screen of the viewport: time to load GSAP. */
  let proche = false;
  function charger() {
    if (g || chargement || !proche || !mqJeu.matches || force) return;
    chargement = true;
    import('gsap').then(({ gsap }) => {
      g = gsap;
      // gsap.matchMedia builds the timeline while motion is allowed in the tabs layout, and reverts it
      // (the tweens' inline styles) when that stops.
      gsap.matchMedia().add(mqJeu.media, () => {
        tl = construire(gsap);
        regler();
        return () => {
          tl = null;
          synchro = () => {};
          final();
        };
      });
    });
  }
  new IntersectionObserver(
    (entrees, io) => {
      if (!entrees.some((e) => e.isIntersecting)) return;
      io.disconnect();
      proche = true;
      charger();
    },
    { rootMargin: '100% 0px' },
  ).observe(section);

  new IntersectionObserver(
    ([e]) => {
      if (e.intersectionRatio >= VU) visible = true;
      else if (e.intersectionRatio < HORS_VUE) visible = false;
      regler();
    },
    { threshold: [0, HORS_VUE, VU] },
  ).observe(scene);
  document.addEventListener('visibilitychange', regler);
  // A pointer click focuses too, but not `:focus-visible`: a clicked tab keeps the tour playing.
  scene.addEventListener('focusin', (e) => {
    tenu = (e.target as HTMLElement).matches(':focus-visible');
    regler();
  });
  scene.addEventListener('focusout', (e) => {
    if (scene.contains(e.relatedTarget as Node | null)) return;
    tenu = false;
    regler();
  });

  // Tabs: a click selects; arrows (wrapping), Home and End move the selection and the focus with it.
  pas.forEach((p, i) => p.addEventListener('click', () => choisir(i)));
  section.querySelector('[role="tablist"]')!.addEventListener('keydown', (ev) => {
    const e = ev as KeyboardEvent;
    // From the focused tab: the tour may have moved the selection since it got focus.
    const ici = Math.max(pas.indexOf(e.target as HTMLElement), 0);
    const cible = {
      ArrowRight: (ici + 1) % 3,
      ArrowLeft: (ici + 2) % 3,
      Home: 0,
      End: 2,
    }[e.key];
    if (cible === undefined) return;
    e.preventDefault();
    choisir(cible);
    pas[cible].focus();
  });

  // "Continuer": tabs, the tour jumps to the next state (focus follows to its button, the clicked
  // one has just gone inert); stacked, it scrolls to the next window.
  suivants.forEach((bouton) =>
    bouton.addEventListener('click', () => {
      const suivant = Number(bouton.dataset.mepSuivant) + 1;
      if (!onglets) {
        const behavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
        etats[suivant].scrollIntoView({ behavior, block: 'start' });
        return;
      }
      const avait = document.activeElement === bouton;
      choisir(suivant);
      if (avait)
        etats[suivant]
          .querySelector<HTMLElement>('[data-mep-suivant], [data-mep-cta]')
          ?.focus({ preventScroll: true });
    }),
  );

  mqOnglets.addEventListener('change', mode);
  mqJeu.addEventListener('change', charger);
  mode();

  if (force) {
    // Capture mode: state k in its final state, its bar half full, as if caught mid-play.
    k = Number(force[1]);
    final();
    afficher();
    jauges.forEach((j, i) => (j.style.transform = `scaleX(${i < k ? 1 : i === k ? 0.5 : 0})`));
    section.scrollIntoView();
  }
}
