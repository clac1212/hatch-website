import { gsap } from 'gsap';

/**
 * Motion design of an autoplay place (kitchen pilot, 01/10): one GSAP timeline per place plays its
 * agent demos in turn, in a loop. Choreography rules (research 01/10, Emil Kowalski, Material 3,
 * Apple, Stripe): one focal motion at a time — the camera travels to the agent, the scene dims
 * around it, the agent reacts, its device enters from its side, then the screen plays its beats
 * (DemoEcran.astro `data-t`). Exits are shorter than entrances. The timeline also drives the tabs'
 * progress bars, so pause, tab clicks and the loop stay in sync.
 * Reduced motion: no timeline; a tab shows its demo's final state, the camera cuts.
 */

const EASE = {
  /** Camera travel: slow out, slow in. */
  camera: 'power3.inOut',
  /** Something arrives: fast then settles (expo-like, no bounce). */
  entree: 'expo.out',
  /** Something leaves: accelerates out, shorter. */
  sortie: 'power2.in',
  doux: 'power2.out',
};
/** Seconds: camera travel, device entrance start, content start, device exit. */
const T = { camera: 1.1, appareil: 0.85, contenu: 1.25, sortie: 0.4 };
/** Slow push-in while a demo plays: the zoom grows by 4 %. */
const DERIVE = 1.04;

type Cam = { '--cx': number; '--cy': number; '--z': number };
/** "--cx:0.3;--cy:0.45;--z:1.5" (written by Demo.astro) → tweenable values. */
function lireCam(style: string): Cam {
  const v = Object.fromEntries(
    style.split(';').map((d) => {
      const [k, x] = d.split(':');
      return [k.trim(), parseFloat(x)];
    }),
  );
  return { '--cx': v['--cx'], '--cy': v['--cy'], '--z': v['--z'] };
}

const $ = (racine: Element, sel: string) => racine.querySelector<HTMLElement>(sel)!;
const $$ = (racine: Element, sel: string) => [...racine.querySelectorAll<HTMLElement>(sel)];
const temps = (el: HTMLElement, cle = 't') => Number(el.dataset[cle]);

/** Amounts in the page's language (the "caisse" visual counts up). */
const euros = new Intl.NumberFormat(document.documentElement.lang || 'fr', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
}).format;

/**
 * Owl's iPad app. The question is heard (voice bubble, waveform, words), then Owl answers twice at
 * once: it speaks the procedure (audio pill) and generates a small app that shows it — a rail of
 * steps and a stage where each step plays as a visual (keypad, cash count, receipt) while it is
 * spoken.
 */
function tablette(ecr: HTMLElement, o: number) {
  const tl = gsap.timeline();
  /** `tl` resets the screen from the demo start; `b` holds the beats, from the content start `o`. */
  const b = gsap.timeline();
  const debut = temps(ecr, 'debut');
  const reponse = temps(ecr, 'reponse');
  const prepare = temps(ecr, 'prepare');
  const resolu = temps(ecr, 'resolu');
  const voix = temps(ecr, 'voix');
  const fin = temps(ecr, 'fin');
  const etape = temps(ecr, 'etape');
  const bulle = $(ecr, '.t-bulle');
  const mots = $$(ecr, '.t-mot');
  const onde = $$(ecr, '.t-onde span');
  const pilule = $(ecr, '.t-voix');
  const eq = $$(ecr, '.t-eq span');
  const carte = $(ecr, '.t-carte');
  const squelette = $(ecr, '.t-squelette');
  const os = $$(ecr, '.t-squelette span:not(.s-rail)');
  const contenu = $(ecr, '.t-contenu');
  const morceaux = [$(ecr, '.t-tete'), ...$$(ecr, '.t-rail li'), $(ecr, '.t-scene')];
  const etapes = $$(ecr, '.t-rail li');
  const visuels = $$(ecr, '.t-visuel');
  const roue = $(ecr, '.t-roue');
  const [ecoute, prepa, lit] = [$(ecr, '.t-ecoute'), $(ecr, '.t-prepare'), $(ecr, '.t-lit')];

  // Back to the start state (the markup is the final state), as soon as the demo starts.
  tl.set(bulle, { autoAlpha: 0, y: 10, scale: 0.96 }, 0)
    .set(mots, { autoAlpha: 0, y: '0.35em', filter: 'blur(4px)' }, 0)
    .set(onde, { scaleY: 0.2 }, 0)
    .set($(ecr, '.t-onde'), { opacity: 1 }, 0)
    .set(ecoute, { opacity: 1 }, 0)
    .set([prepa, lit], { opacity: 0 }, 0)
    .set(pilule, { autoAlpha: 0, x: -12 }, 0)
    .set(eq, { scaleY: 0.25 }, 0)
    .set($(ecr, '.t-progression span'), { scaleX: 0, transformOrigin: 'left' }, 0)
    .set(carte, { autoAlpha: 0, y: 14 }, 0)
    .set(squelette, { opacity: 1 }, 0)
    .set(os, { opacity: 1 }, 0)
    .set(contenu, { opacity: 0 }, 0)
    .set(morceaux, { autoAlpha: 0, y: 8, filter: 'blur(6px)' }, 0)
    .set($$(ecr, '.t-surligne'), { opacity: 0 }, 0)
    .set($$(ecr, '.t-num'), { opacity: 1 }, 0)
    .set($$(ecr, '.t-fait'), { autoAlpha: 0, scale: 0.4 }, 0)
    .set($$(ecr, '.t-lu'), { scaleX: 0, opacity: 1 }, 0)
    .set(roue, { yPercent: 0, y: 0 }, 0)
    .set(visuels, { autoAlpha: 0, x: 0 }, 0)
    .set(visuels[0], { autoAlpha: 1 }, 0);

  // 1. Listening: the bubble opens, the live dot blinks, the waveform follows the voice, the
  //    words land one by one.
  const duree = reponse - debut;
  b.to(bulle, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: EASE.entree }, debut - 0.5).to(
    $(ecr, '.t-rec'),
    {
      opacity: 0.25,
      duration: 0.45,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: 2 * Math.ceil(reponse / 0.9) - 1,
    },
    0,
  );
  onde.forEach((barre, i) =>
    b.to(
      barre,
      {
        scaleY: () => gsap.utils.random(0.3, 1),
        duration: 0.16,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: Math.floor(duree / 0.16),
        repeatRefresh: true,
      },
      debut + i * 0.02,
    ),
  );
  b.to(onde, { scaleY: 0.2, duration: 0.3, ease: EASE.doux }, reponse).to(
    $(ecr, '.t-onde'),
    { opacity: 0.35, duration: 0.3 },
    reponse,
  );
  mots.forEach((m) =>
    b.to(m, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.45, ease: EASE.doux }, temps(m)),
  );

  // 2. Generating: status "preparing", the card opens on a pulsing skeleton, then the small app
  //    resolves in place, piece by piece, out of a blur.
  b.to(ecoute, { opacity: 0, duration: 0.2 }, prepare)
    .to(prepa, { opacity: 1, duration: 0.3 }, prepare + 0.1)
    .to(carte, { autoAlpha: 1, y: 0, duration: 0.7, ease: EASE.entree }, prepare)
    .to(
      os,
      {
        opacity: 0.45,
        duration: 0.35,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 2 * Math.ceil((resolu - prepare) / 0.7) - 1,
        stagger: 0.06,
      },
      prepare,
    )
    .to(squelette, { opacity: 0, duration: 0.3, ease: EASE.sortie }, resolu)
    .set(contenu, { opacity: 1 }, resolu)
    .to(
      morceaux,
      { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: EASE.entree, stagger: 0.08 },
      resolu + 0.05,
    );

  // 3. Speaking, in parallel: status "reading", the audio pill plays to the end of the answer.
  b.to(prepa, { opacity: 0, duration: 0.2 }, voix)
    .to(lit, { opacity: 1, duration: 0.3 }, voix + 0.1)
    .to(pilule, { autoAlpha: 1, x: 0, duration: 0.6, ease: EASE.entree }, voix - 0.2)
    .to($(ecr, '.t-progression span'), { scaleX: 1, duration: fin - voix, ease: 'none' }, voix)
    .to(eq, { scaleY: 0.25, duration: 0.3, ease: EASE.doux }, fin);
  eq.forEach((barre, i) =>
    b.to(
      barre,
      {
        scaleY: () => gsap.utils.random(0.3, 1),
        duration: 0.18,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: Math.floor((fin - voix) / 0.18) - 1,
        repeatRefresh: true,
      },
      voix + i * 0.015,
    ),
  );

  // 4. Each step, as it is spoken: its rail line lights up and its reading bar fills, the stage
  //    switches to its visual, which plays its gesture; then the line gets its check.
  const lu = etape * 0.9;
  etapes.forEach((li, i) => {
    const t = temps(li);
    const v = visuels[i];
    b.to($(li, '.t-surligne'), { opacity: 1, duration: 0.3, ease: EASE.doux }, t)
      .to($(li, '.t-lu'), { scaleX: 1, duration: lu, ease: 'none' }, t)
      .to($(li, '.t-surligne'), { opacity: 0, duration: 0.3, ease: EASE.sortie }, t + lu)
      .to($(li, '.t-lu'), { opacity: 0, duration: 0.3 }, t + lu)
      .to($(li, '.t-num'), { opacity: 0, duration: 0.15 }, t + lu)
      .to(
        $(li, '.t-fait'),
        { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(2)' },
        t + lu,
      );
    if (i > 0) {
      b.to(
        roue,
        { yPercent: (-100 * i) / etapes.length, duration: 0.5, ease: EASE.camera },
        t - 0.1,
      )
        .to(visuels[i - 1], { autoAlpha: 0, x: -24, duration: 0.3, ease: EASE.sortie }, t - 0.2)
        .fromTo(
          v,
          { autoAlpha: 0, x: 24 },
          { autoAlpha: 1, x: 0, duration: 0.6, ease: EASE.entree, immediateRender: false },
          t + 0.05,
        );
    }
    const visuel = v.dataset.visuel;
    if (visuel === 'code') code(v, t, tl, b);
    else if (visuel === 'caisse') caisse(v, t, tl, b);
    else if (visuel === 'ticket') ticket(v, t, tl, b);
  });
  return tl.add(b, o);
}

/** Visual "code": four keys pressed (a dot fills each time), then OK; the display shows a check. */
function code(v: HTMLElement, t: number, tl: gsap.core.Timeline, b: gsap.core.Timeline) {
  const points = $$(v, '.v-points span');
  const ok = $(v, '.v-ok');
  tl.set($(v, '.v-points'), { opacity: 1 }, 0)
    .set(points, { scale: 0, opacity: 0.25 }, 0)
    .set(ok, { autoAlpha: 0, scale: 0.4 }, 0)
    .set($$(v, '.v-appui'), { opacity: 0 }, 0)
    .set($$(v, '.v-touche'), { y: 0 }, 0);
  const presser = (k: string, at: number) => {
    const touche = $(v, `.v-touche[data-k="${k}"]`);
    b.to($(touche, '.v-appui'), { opacity: 1, duration: 0.06 }, at)
      .to(touche, { y: 1, duration: 0.06, yoyo: true, repeat: 1 }, at)
      .to($(touche, '.v-appui'), { opacity: 0, duration: 0.3 }, at + 0.12);
  };
  ['1', '9', '4', '7'].forEach((k, j) => {
    const at = t + 0.45 + j * 0.3;
    presser(k, at);
    b.to(points[j], { scale: 1, opacity: 1, duration: 0.25, ease: 'back.out(2.5)' }, at + 0.04);
  });
  presser('ok', t + 1.85);
  b.to($(v, '.v-points'), { opacity: 0, duration: 0.2 }, t + 2).to(
    ok,
    { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' },
    t + 2.05,
  );
}

/** Visual "caisse": notes land one by one, the float counts up, the gauge fills to the target. */
function caisse(v: HTMLElement, t: number, tl: gsap.core.Timeline, b: gsap.core.Timeline) {
  const billets = $$(v, '.v-billet');
  const montant = $(v, '.v-montant');
  const jauge = $(v, '.v-jauge span');
  const total = Number(v.querySelector<HTMLElement>('.v-caisse')!.dataset.total);
  const compte = { v: 0 };
  const ecrire = () => (montant.textContent = euros(Math.round(compte.v)));
  tl.set(billets, { autoAlpha: 0, y: -30 }, 0).set(jauge, { scaleX: 0 }, 0);
  // Before the visual shows, its count is back to zero.
  b.fromTo(
    compte,
    { v: 0 },
    { v: 0, duration: 0.01, onUpdate: ecrire, immediateRender: false },
    t - 0.5,
  );
  let cumul = 0;
  billets.forEach((billet, j) => {
    const at = t + 0.4 + j * 0.32;
    cumul += Number(billet.dataset.v);
    b.to(billet, { autoAlpha: 1, y: 0, duration: 0.45, ease: EASE.entree }, at)
      .to(compte, { v: cumul, duration: 0.3, ease: EASE.doux, onUpdate: ecrire }, at + 0.1)
      .to(jauge, { scaleX: cumul / total, duration: 0.3, ease: EASE.doux }, at + 0.1);
  });
}

/** Visual "ticket": the confirm button is pressed, then the receipt prints out of the slot. */
function ticket(v: HTMLElement, t: number, tl: gsap.core.Timeline, b: gsap.core.Timeline) {
  const bouton = $(v, '.v-bouton');
  const recu = $(v, '.v-recu');
  const tampon = $(v, '.v-tampon');
  tl.set(recu, { clipPath: 'inset(0 0 100% 0)', y: '-40%' }, 0)
    .set(tampon, { autoAlpha: 0, scale: 1.6, rotation: -12 }, 0)
    .set(bouton, { scale: 1 }, 0);
  b.to(
    bouton,
    { scale: 0.93, duration: 0.12, ease: 'power1.inOut', yoyo: true, repeat: 1 },
    t + 0.4,
  )
    .to(recu, { clipPath: 'inset(0 0 0% 0)', y: '0%', duration: 1.2, ease: 'power1.out' }, t + 0.65)
    .to(
      tampon,
      { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.4, ease: 'back.out(2)' },
      t + 1.95,
    );
}

/** Pecker's WhatsApp chat: typing, replies typed then sent, the poll voted, head office notified. */
function telephone(ecr: HTMLElement, o: number) {
  const tl = gsap.timeline();
  const b = gsap.timeline();
  const lignes = $$(ecr, '.p-ligne:not(.p-frappe)');
  const bulles = lignes.map((l) => $(l, '.p-msg'));
  const st = $(ecr, '.p-st');
  const ecrit = $(ecr, '.p-ecrit');
  const indice = $(ecr, '.p-indice');
  const photo = $(ecr, '.p-photo');
  const micro = $(ecr, '.p-micro');
  const envoyer = $(ecr, '.p-envoyer');
  const suivi = $(ecr, '.p-suivi');

  tl.set(lignes, { height: 0 }, 0)
    .set(bulles, { autoAlpha: 0, scale: 0.92, y: 6 }, 0)
    .set(st, { opacity: 1 }, 0)
    .set(ecrit, { opacity: 0 }, 0)
    .set($$(ecr, '.bonne .p-coche'), { autoAlpha: 0, scale: 0.4 }, 0)
    .set($$(ecr, '.bonne .p-jauge span'), { scaleX: 0 }, 0)
    .set($$(ecr, '.bonne .p-nb'), { opacity: 0 }, 0)
    .set($$(ecr, '.p-doigt'), { autoAlpha: 0, scale: 1.5, xPercent: 120, yPercent: 140 }, 0)
    .set($$(ecr, '.p-brouillon'), { opacity: 0, clipPath: 'inset(0 100% 0 0)' }, 0)
    .set(indice, { opacity: 1 }, 0)
    .set(photo, { '--ouvert': 1 }, 0)
    .set(micro, { opacity: 1, scale: 1 }, 0)
    .set(envoyer, { opacity: 0, scale: 0.6 }, 0)
    .set(suivi, { autoAlpha: 0, x: 48, y: 0, scale: 0.96 }, 0);

  // Typing indicator: the header says "typing…", a bubble of dots opens, closes before the message.
  $$(ecr, '.p-frappe').forEach((f) => {
    const t = temps(f);
    const message = temps(f.nextElementSibling as HTMLElement);
    b.to(st, { opacity: 0, duration: 0.2 }, t)
      .to(ecrit, { opacity: 1, duration: 0.2 }, t + 0.1)
      .to(f, { height: 'auto', duration: 0.35, ease: EASE.doux }, t)
      .fromTo(
        $(f, '.p-msg'),
        { autoAlpha: 0, scale: 0.9 },
        { autoAlpha: 1, scale: 1, duration: 0.3, ease: EASE.doux, immediateRender: false },
        t + 0.05,
      )
      .to(
        $$(f, '.p-msg span'),
        {
          yPercent: -45,
          opacity: 0.45,
          duration: 0.3,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: 2 * Math.floor((message - t) / 0.6) - 1,
          stagger: 0.12,
        },
        t,
      )
      .to(f, { height: 0, duration: 0.25, ease: EASE.sortie }, message - 0.25)
      .to(ecrit, { opacity: 0, duration: 0.2 }, message)
      .to(st, { opacity: 1, duration: 0.2 }, message + 0.1);
  });

  // A reply is typed in the input bar (the camera folds away, the send button replaces the mic),
  // then sent.
  $$(ecr, '.p-brouillon').forEach((d) => {
    const t = temps(d);
    const envoi = temps(d, 'envoi');
    b.to(indice, { opacity: 0, duration: 0.1 }, t)
      .to(photo, { '--ouvert': 0, duration: 0.3, ease: EASE.doux }, t)
      .to(micro, { opacity: 0, scale: 0.6, duration: 0.15 }, t)
      .to(envoyer, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' }, t + 0.05)
      .to(d, { opacity: 1, duration: 0.01 }, t)
      .to(d, { clipPath: 'inset(0 0% 0 0)', duration: envoi - t - 0.2, ease: 'steps(14)' }, t)
      .to(envoyer, { scale: 0.85, duration: 0.1, yoyo: true, repeat: 1 }, envoi - 0.15)
      .to(d, { opacity: 0, duration: 0.1 }, envoi)
      .to(envoyer, { opacity: 0, scale: 0.6, duration: 0.2 }, envoi + 0.05)
      .to(indice, { opacity: 1, duration: 0.2 }, envoi + 0.1)
      .to(micro, { opacity: 1, scale: 1, duration: 0.25, ease: EASE.doux }, envoi + 0.1)
      .to(photo, { '--ouvert': 1, duration: 0.3, ease: EASE.doux }, envoi + 0.1);
  });

  // Each message or poll: its line grows (pushing the thread up), the bubble pops from its tail.
  lignes.forEach((l, i) => {
    const t = temps(l);
    b.to(l, { height: 'auto', duration: 0.5, ease: EASE.entree }, t).to(
      bulles[i],
      { autoAlpha: 1, scale: 1, y: 0, duration: 0.45, ease: 'back.out(1.2)' },
      t + 0.05,
    );
    if (!l.dataset.c) return;
    // The poll: a fingertip comes in, taps the right option, its radio fills, its bar runs to 100 %.
    const c = temps(l, 'c');
    const bonne = $(l, 'li.bonne');
    const doigt = $(bonne, '.p-doigt');
    b.to(
      doigt,
      { autoAlpha: 1, scale: 1, xPercent: 0, yPercent: 0, duration: 0.6, ease: 'power3.out' },
      c - 0.7,
    )
      .to(
        doigt,
        { scale: 0.8, duration: 0.12, ease: 'power1.inOut', yoyo: true, repeat: 1 },
        c - 0.1,
      )
      .to($(bonne, '.p-coche'), { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, c)
      .to($(bonne, '.p-jauge span'), { scaleX: 1, duration: 0.7, ease: EASE.entree }, c + 0.1)
      .to($(bonne, '.p-nb'), { opacity: 1, duration: 0.3 }, c + 0.3)
      .to(doigt, { autoAlpha: 0, scale: 1.2, duration: 0.3, ease: EASE.sortie }, c + 0.35);
  });

  // Head office's notification slides out from behind the phone.
  b.to(suivi, { autoAlpha: 1, x: 0, scale: 1, duration: 0.9, ease: EASE.entree }, temps(suivi));
  return tl.add(b, o);
}

/**
 * How an autoplay place reacts to time and scroll:
 * - `auto`: the timeline plays on its own, in a loop; the scroll only picks the place;
 * - `scroll` (`?scroll=1`): it never plays on its own, the scroll inside the place is the playhead;
 * - `mixte` (default, César 01/10): it plays on its own, and scrolling inside the place pushes it
 *   forward or back on top of that, so a fast scroll fast-forwards and scrolling up rewinds.
 */
export type Mode = 'auto' | 'scroll' | 'mixte';

export interface Pilote {
  /** The place becomes active, the scroll being at q (0–1) inside it. */
  entrer(q: number): void;
  /** The scroll moved inside the active place, now at q (0–1). */
  suivre(q: number): void;
  /** A tab was clicked: play demo i (auto, mixte). */
  jouer(i: number): void;
  /** The place is left. */
  arreter(): void;
  /** Toggle the visitor's pause; returns the new state. */
  basculer(): boolean;
  /** Scroll mode: progress (0–1) where demo i starts, to scroll a tab click there. */
  position(i: number): number;
}

export function piloter(lieu: HTMLElement, mode: Mode = 'mixte'): Pilote {
  const scroll = mode === 'scroll';
  const calque = $(lieu, '.d2-calque');
  const voile = $(lieu, '.d2-voile');
  const ecrans = $$(lieu, '.d2-ecran');
  const onglets = $$(lieu, '[data-onglet]');
  const titres = $$(lieu, '.d2-titres > .d2-titre');
  const barres = onglets.map((o) => $(o, '.d2-barre > span'));
  const vue = lireCam(lieu.dataset.vue!);
  const cams = ecrans.map((e) => lireCam(e.dataset.cam!));
  const agents = ecrans.map((e) => $(lieu, `.d2-agent[data-cles~="${e.dataset.cle}"]`));

  let tl: gsap.core.Timeline | null = null;
  let debuts: number[] = [];
  let actif = false;
  let enPause = false;
  let courant = -1;
  /** Last scroll position inside the place (0–1): scroll mode reapplies it, mixte diffs it. */
  let q = 0;
  /** Mixte: where the scroll is pushing the playhead to (seconds), while it catches up. */
  let cible: number | null = null;

  /** Tabs and titles follow the demo on screen (classes: their CSS transitions do the rest). */
  function marquer(i: number) {
    if (i === courant) return;
    courant = i;
    onglets.forEach((o, j) => {
      o.classList.toggle('on', j === i);
      o.setAttribute('aria-pressed', String(j === i));
    });
    titres.forEach((t, j) => t.classList.toggle('on', j === i));
  }

  function construire(mobile: boolean) {
    // On phones the device covers the agent: the agent gets the stage alone for a beat first.
    const { appareil, contenu } = mobile ? { appareil: 1.8, contenu: 2.2 } : T;
    const m = gsap.timeline({
      paused: true,
      repeat: scroll ? 0 : -1,
      onUpdate() {
        const t = m.time();
        marquer(
          Math.max(
            0,
            debuts.findLastIndex((d) => t >= d),
          ),
        );
      },
    });
    m.set(ecrans, { autoAlpha: 0 }, 0)
      .set(calque, vue, 0)
      .set(voile, { opacity: 0 }, 0)
      .set(barres, { scaleX: 0 }, 0)
      .to(voile, { opacity: 1, duration: 0.9, ease: 'power1.inOut' }, 0.15);
    debuts = [];
    ecrans.forEach((e, i) => {
      const ecr = $(e, '.ecr');
      const duree = Number(ecr.dataset.duree);
      const s = gsap.timeline();
      const cam = cams[i];
      const agent = agents[i];
      // 1. The camera travels to the agent; the focus layer lifts it above the dimmed scene.
      s.fromTo(
        calque,
        i === 0 ? vue : { ...cams[i - 1], '--z': cams[i - 1]['--z'] * DERIVE },
        { ...cam, duration: T.camera, ease: EASE.camera, immediateRender: false },
        0,
      ).set(agent, { zIndex: 3 }, 0);
      // 2. The agent reacts as the camera lands: squash, stretch, settle.
      s.to(agent, { '--saut': -1, duration: 0.14, ease: 'power2.out' }, T.camera - 0.35)
        .to(agent, { '--saut': 1, duration: 0.2, ease: 'power2.out' }, '>')
        .to(agent, { '--saut': 0, duration: 0.45, ease: 'power2.inOut' }, '>');
      // 3. Its device enters from its side (left of the device on desktop, above on phones), tilted
      //    in 3D like a keynote product shot, settles flat, and a glare sweeps its glass once.
      s.fromTo(
        e,
        { autoAlpha: 0, x: mobile ? 0 : -56, y: mobile ? -24 : 0, scale: 0.96 },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: EASE.entree,
          immediateRender: false,
        },
        appareil,
      )
        .fromTo(
          ecr,
          {
            rotationY: mobile ? 0 : 26,
            rotationX: mobile ? 22 : 9,
            rotationZ: mobile ? 0 : -2,
            transformPerspective: 1600,
            transformOrigin: '50% 60%',
          },
          {
            rotationY: 0,
            rotationX: 0,
            rotationZ: 0,
            duration: 1.3,
            ease: EASE.entree,
            immediateRender: false,
          },
          appareil,
        )
        .fromTo(
          $(ecr, '.reflet'),
          { opacity: 0, xPercent: -70 },
          { xPercent: 70, duration: 1.5, ease: 'power2.inOut', immediateRender: false },
          appareil + 0.2,
        )
        .to($(ecr, '.reflet'), { opacity: 1, duration: 0.5, ease: 'power1.out' }, appareil + 0.2)
        .to($(ecr, '.reflet'), { opacity: 0, duration: 0.6, ease: 'power1.in' }, appareil + 1.1);
      // 4. The screen plays; meanwhile the camera keeps a slow push-in so the scene never freezes.
      s.add(
        ecr.classList.contains('tablette') ? tablette(ecr, contenu) : telephone(ecr, contenu),
        0,
      ).to(calque, { '--z': cam['--z'] * DERIVE, duration: duree, ease: 'sine.inOut' }, contenu);
      // 5. Exit, shorter than the entrance.
      s.to(
        e,
        {
          autoAlpha: 0,
          y: mobile ? -12 : 0,
          x: mobile ? 0 : 24,
          duration: T.sortie,
          ease: EASE.sortie,
        },
        contenu + duree,
      ).set(agent, { zIndex: '' }, '>');

      const debut = i === 0 ? 0 : m.duration() - 0.1;
      debuts.push(debut);
      m.addLabel(`d${i}`, debut)
        .add(s, debut)
        .fromTo(
          barres[i],
          { scaleX: 0 },
          { scaleX: 1, duration: s.duration(), ease: 'none', immediateRender: false },
          debut,
        )
        .set(barres[i], { scaleX: 0 }, debut + s.duration());
    });
    // Back to the wide shot before the loop starts again (the loop's seam is the wide shot).
    const fin = m.duration();
    m.fromTo(
      calque,
      { ...cams[cams.length - 1], '--z': cams[cams.length - 1]['--z'] * DERIVE },
      { ...vue, duration: 1.3, ease: EASE.camera, immediateRender: false },
      fin,
    ).to(voile, { opacity: 0, duration: 0.8, ease: 'power1.inOut' }, fin + 0.2);
    // Autoplay: a breath on the wide shot before the loop starts again.
    if (!scroll) m.to({}, { duration: 1.4 });
    return m;
  }

  /** Reduced motion: no timeline. A demo = its device in its final state, camera cut to its agent. */
  function montrer(i: number) {
    gsap.set(ecrans, { autoAlpha: 0 });
    gsap.set(ecrans[i], { autoAlpha: 1 });
    gsap.set(calque, cams[i]);
    gsap.set(barres, { scaleX: 0 });
    gsap.set(barres[i], { scaleX: 1 });
    marquer(i);
  }

  /** Reduced motion: no playhead; in scroll mode the demos split the place's scroll evenly. */
  const indice = (p: number) => Math.min(ecrans.length - 1, Math.floor(p * ecrans.length));

  // gsap.matchMedia runs the handler only while one condition matches: `mobile` and `large` cover
  // every width, so it always runs, and runs again (reverting the last timeline) when one flips.
  const mm = gsap.matchMedia();
  mm.add(
    {
      mobile: '(max-width: 47.99rem)',
      large: '(min-width: 48rem)',
      reduit: '(prefers-reduced-motion: reduce)',
    },
    (ctx) => {
      const { mobile, reduit } = ctx.conditions!;
      courant = -1;
      tl = reduit ? null : construire(!!mobile);
      if (!tl) montrer(scroll ? indice(q) : 0);
      else if (scroll) tl.progress(q);
      else if (actif) tl.play(mode === 'mixte' ? q * tl.duration() : 0).paused(enPause);
      return () => {
        tl = null;
      };
    },
  );

  document.addEventListener('visibilitychange', () => {
    if (tl && actif && !enPause && !scroll && cible === null) tl.paused(document.hidden);
  });

  /** Mixte: move the playhead by `dt` seconds, eased, then let it play on from there. */
  function pousser(dt: number) {
    if (!tl) return;
    const d = tl.duration();
    cible = Math.min(Math.max((cible ?? tl.time()) + dt, 0), d - 0.05);
    tl.pause();
    gsap.to(tl, {
      time: cible,
      duration: 0.5,
      ease: 'power3.out',
      overwrite: true,
      onComplete() {
        cible = null;
        if (actif && !enPause) tl?.play();
      },
    });
  }

  return {
    entrer(p) {
      actif = true;
      q = p;
      if (!tl) return montrer(scroll ? indice(p) : 0);
      if (scroll) return void tl.progress(p);
      enPause = false;
      // Mixte: coming in from below starts near the end, so scrolling back up rewinds it.
      tl.play(mode === 'mixte' ? p * tl.duration() : 0);
    },
    suivre(p) {
      const dq = p - q;
      q = p;
      if (!tl) return scroll ? montrer(indice(p)) : undefined;
      if (scroll) {
        // A short catch-up tween smooths the wheel's steps without lagging behind the scroll.
        gsap.to(tl, { progress: p, duration: 0.6, ease: 'power3.out', overwrite: true });
      } else if (mode === 'mixte' && dq) pousser(dq * tl.duration());
    },
    jouer(i) {
      if (scroll) return;
      if (!tl) return montrer(i);
      enPause = false;
      cible = null;
      gsap.killTweensOf(tl);
      tl.play(i === 0 ? 0 : `d${i}`);
    },
    arreter() {
      actif = false;
      cible = null;
      if (!tl) return scroll ? undefined : montrer(0);
      gsap.killTweensOf(tl);
      if (!scroll) tl.pause(0);
    },
    basculer() {
      enPause = !enPause;
      if (tl && cible === null) tl.paused(enPause);
      return enPause;
    },
    position(i) {
      if (!tl) return (i + 0.5) / ecrans.length;
      // Just past the camera travel, so the click lands on the device entering.
      return Math.min(1, (debuts[i] + T.camera) / tl.duration());
    },
  };
}
