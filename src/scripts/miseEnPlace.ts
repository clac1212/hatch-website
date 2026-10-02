/**
 * "Mise en place" pinned track (ported from the v4 prototype, site.js `miseEnPlace()`), played like
 * the diorama's agent demos (src/components/sections/demo-motion.ts, César 02/10).
 *
 * The markup renders the stacked layout in its final state (mobile, no JS, reduced motion). From md up,
 * when motion is allowed, the section gets `.epingle`: the three windows are stacked one behind the
 * other ("Time Machine": the front window flies towards the viewer and the next one comes forward).
 * One GSAP timeline covers the three states — sources connecting one by one with a counter, then the
 * conversation and the migration bars, then the channels and the Inès → Owl exchange — each followed
 * by a hold so it can be read. The timeline drives everything: the window in front, the step
 * indicator under it (the active step's bar fills with the timeline's progress inside that step),
 * and the content of each window.
 *
 * It plays on its own while the section is pinned, and the scroll pushes it ("mixte" mode of the
 * demo): scrolling down moves the playhead forward, never behind the scroll position (so the last
 * state has been reached by the bottom of the track), scrolling up rewinds. Leaving the section above
 * puts it back to its start; leaving it below finishes it. The shared engine (src/scripts/pistes.ts)
 * only sizes the track and scales the stage here.
 *
 * Capture/debug: `?etape=mep:<k>` (read by the engine too) freezes state k, its bar half full.
 */
type Gsap = (typeof import('gsap'))['gsap'];
type Timeline = ReturnType<Gsap['timeline']>;

/** Seconds: length of each state (its beats, then a hold so it can be read). */
const DUREES = [5, 8.5, 7];
/** Seconds into a state before its content plays: the Time Machine move (0.95 s) settles first. */
const DEBUT = 0.8;
/** Share of the scroll that moves the playhead (the rest is left to time), as in the demo. */
const POUSSEE = 0.7;

const section = document.querySelector<HTMLElement>('.piste[data-piste="mep"]');
if (section) init(section);

function init(section: HTMLElement) {
  const $$ = (el: ParentNode, sel: string) => [...el.querySelectorAll<HTMLElement>(sel)];
  const etats = $$(section, '[data-mep-etat]');
  const pas = $$(section, '[data-mep-pas]');
  const jauges = pas.map((p) => p.querySelector<HTMLElement>('.jauge > span')!);
  const cta = section.querySelector<HTMLElement>('[data-mep-cta]');
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

  const mq = matchMedia('(min-width: 48rem) and (prefers-reduced-motion: no-preference)');
  const force = new URLSearchParams(location.search).get('etape')?.match(/^mep:([0-2])$/);
  let epingle = false;
  let k = 0;

  function afficher() {
    // Distance from the current step: drives the "Time Machine" stack in the component's CSS.
    etats.forEach((el, i) => (el.dataset.d = String(i - k)));
    pas.forEach((p, i) => (p.dataset.etat = i < k ? 'fait' : i === k ? 'actif' : 'a-venir'));
    // Windows behind the front one keep their buttons out of the tab order.
    if (epingle && k !== 2) cta?.setAttribute('tabindex', '-1');
    else cta?.removeAttribute('tabindex');
    suivants.forEach((b) => {
      if (epingle && Number(b.dataset.mepSuivant) !== k) b.setAttribute('tabindex', '-1');
      else b.removeAttribute('tabindex');
    });
  }
  function marquer(i: number) {
    if (i === k) return;
    k = i;
    afficher();
  }

  function mode() {
    epingle = mq.matches;
    section.classList.toggle('epingle', epingle);
    afficher();
    if (!epingle) final();
    // The layout changed: let the engine re-frame the stage.
    window.dispatchEvent(new Event('resize'));
  }

  // ---------- Timeline (GSAP, loaded when the section comes near, only for the pinned layout) ----------

  let g: Gsap | null = null;
  let tl: Timeline | null = null;
  let debuts: number[] = [];
  /** The section is pinned: the timeline plays. */
  let enJeu = false;
  /** Last scroll position inside the track (0–1), to diff it. */
  let q = 0;
  /** Where the scroll is pushing the playhead to (seconds), while it catches up. */
  let cible: number | null = null;
  /** Brings what the timeline writes as text or class in line with the playhead (set by `construire`). */
  let synchro = () => {};

  function construire(gsap: Gsap): Timeline {
    debuts = DUREES.map((_, i) => DUREES.slice(0, i).reduce((a, d) => a + d, 0));
    /** Tweened numbers the DOM shows as text: sources connected, then each migration counter. */
    const n = { v: 0 };
    const comptes = lignes.map(() => ({ v: 0 }));
    // One place renders them, on every frame and after every jump: GSAP's play(t)/pause(t) suppress
    // the tweens' callbacks, so per-tween onUpdates would leave stale text after a rewind.
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
    const m = gsap.timeline({ paused: true, onUpdate: () => synchro() });
    /** Something arrives: it fades in from a few pixels below (`--y`, the CSS's `translate`). */
    const entrer = (el: HTMLElement, at: number) =>
      m.fromTo(
        el,
        { autoAlpha: 0, '--y': 8 },
        { autoAlpha: 1, '--y': 0, duration: 0.55, ease: 'expo.out' },
        at,
      );

    // Step indicator: the bar of a step fills over its state, and stays full once done.
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

  /**
   * Where the playhead starts when the section pins: from the top when coming in from above; coming
   * in from below, near the end, so scrolling up rewinds it.
   */
  const depart = (p: number) => (p > 0.5 ? p * (tl?.duration() ?? 0) : 0);

  /** Jump the playhead to `t` (seconds), then play from there or stay paused. */
  function aller(t: number, jouer: boolean) {
    if (!tl) return;
    if (jouer) tl.play(t);
    else tl.pause(t);
    synchro();
  }

  /** Move the playhead by `dt` seconds, eased, then let it play on from there. */
  function pousser(dt: number) {
    if (!tl || !g) return;
    const d = tl.duration();
    cible = Math.min(Math.max((cible ?? tl.time()) + dt, 0), d);
    tl.pause();
    g.to(tl, {
      time: cible,
      duration: 0.5,
      ease: 'power3.out',
      overwrite: true,
      onComplete() {
        cible = null;
        if (enJeu) tl?.play();
      },
    });
  }

  function entrer(p: number) {
    if (!tl || !g) return;
    q = p;
    cible = null;
    g.killTweensOf(tl);
    aller(depart(p), true);
  }

  function suivre(p: number) {
    if (!tl || !g) return;
    const dq = p - q;
    q = p;
    if (!dq) return;
    // Going down, the scroll is a floor: at p the timeline is at least at p of its length, so at the
    // bottom of the track the last state has played. Going up, it rewinds relatively.
    const d = tl.duration();
    const ici = cible ?? tl.time();
    pousser(dq > 0 ? Math.max(ici + dq * d * POUSSEE, p * d) - ici : dq * d * POUSSEE);
  }

  /** The section is left: above, back to its start; below, it finishes (last state, complete). */
  function arreter(dessus: boolean) {
    if (!tl || !g) return;
    cible = null;
    g.killTweensOf(tl);
    if (dessus) aller(0, false);
    else {
      tl.pause();
      g.to(tl, { time: tl.duration(), duration: 0.6, ease: 'power3.out' });
    }
  }

  /** A step label or "Continuer" was clicked: go to state i. */
  function jouer(i: number) {
    if (!tl || !g) {
      marquer(i);
      return;
    }
    cible = null;
    g.killTweensOf(tl);
    aller(debuts[i], enJeu);
  }

  /**
   * The timeline plays only while the section is pinned (as the demo: nothing plays while it is still
   * scrolling in from below).
   */
  function maj() {
    if (!tl) return;
    const r = section.getBoundingClientRect();
    const colle = r.top <= 1 && r.bottom >= innerHeight - 1;
    const p = Math.min(Math.max(-r.top / (r.height - innerHeight), 0), 1);
    if (colle) {
      if (!enJeu) {
        enJeu = true;
        entrer(p);
      } else suivre(p);
      return;
    }
    if (enJeu) {
      enJeu = false;
      arreter(r.top > 1);
    } else if (r.top <= 1 && cible === null && tl.time() === 0) {
      // Below the section without having played it (page loaded or jumped past it): its last state.
      aller(tl.duration(), false);
    }
  }

  let chargement = false;
  /** The section is within a screen of the viewport: time to load GSAP. */
  let proche = false;
  function charger() {
    if (g || chargement || !proche || !mq.matches || force) return;
    chargement = true;
    import('gsap').then(({ gsap }) => {
      g = gsap;
      // gsap.matchMedia builds the timeline while the pinned layout applies, and reverts it (the
      // tweens' inline styles) when it stops applying.
      gsap.matchMedia().add(mq.media, () => {
        tl = construire(gsap);
        maj();
        return () => {
          tl = null;
          enJeu = false;
          cible = null;
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

  let raf = 0;
  addEventListener('scroll', () => (raf ||= requestAnimationFrame(() => ((raf = 0), maj()))), {
    passive: true,
  });
  addEventListener('resize', maj);
  document.addEventListener('visibilitychange', () => {
    if (tl && enJeu && cible === null) tl.paused(document.hidden);
  });

  // "Continuer": pinned, the timeline jumps to the next state (focus follows to its button);
  // stacked, it scrolls to the next window.
  suivants.forEach((bouton) =>
    bouton.addEventListener('click', () => {
      const suivant = Number(bouton.dataset.mepSuivant) + 1;
      if (!epingle) {
        const behavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
        etats[suivant].scrollIntoView({ behavior, block: 'start' });
        return;
      }
      jouer(suivant);
      if (document.activeElement === bouton)
        etats[suivant]
          .querySelector<HTMLElement>('[data-mep-suivant], [data-mep-cta]')
          ?.focus({ preventScroll: true });
    }),
  );
  // The step labels under the window work like the demo's tabs (pointer only: "Continuer" is the
  // keyboard path).
  pas.forEach((p, i) => p.addEventListener('click', () => epingle && jouer(i)));

  mq.addEventListener('change', () => {
    mode();
    charger();
  });
  mode();

  if (force) {
    // Capture mode: state k in its final state, its bar half full, as if caught mid-play.
    k = Number(force[1]);
    final();
    afficher();
    jauges.forEach((j, i) => (j.style.transform = `scaleX(${i < k ? 1 : i === k ? 0.5 : 0})`));
  }
}
