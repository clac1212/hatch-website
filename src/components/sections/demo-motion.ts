import { gsap } from 'gsap';
import { suivre } from '../../scripts/suivi';

/**
 * Motion design of an autoplay place (kitchen pilot, 01/10): one GSAP timeline per place plays its
 * agent demos in turn, in a loop. Choreography rules (research 01/10, Emil Kowalski, Material 3,
 * Apple, Stripe): one focal motion at a time — the camera travels to the agent, the scene dims,
 * the agent's device enters from its side, then the screen plays its beats
 * (DemoEcran.astro `data-t`). Exits are shorter than entrances. The timeline also drives the tabs'
 * progress bars, so tab clicks, scroll and the loop stay in sync.
 * Reduced motion: no timeline; a tab shows its demo's final state, the camera cuts.
 */

/**
 * Shared with the CSS motion tokens in global.css (`--ease-*`, same curves as cubic-beziers, used
 * by the hero). GSAP keeps its native eases: reading the tokens would need CustomEase, for no
 * visible difference. Small pops (checks, chips) use `back.out` ≈ `--ease-pop`.
 */
const EASE = {
  /** Camera travel: slow out, slow in. `--ease-camera` */
  camera: 'power3.inOut',
  /** Something arrives: fast then settles, no bounce. `--ease-entree` */
  entree: 'expo.out',
  /** Something leaves: accelerates out, shorter. `--ease-sortie` */
  sortie: 'power2.in',
  /** Fades and small state changes. `--ease-doux` */
  doux: 'power2.out',
};
/** Seconds: camera travel, device entrance start, content start, device exit. */
const T = { camera: 1.1, appareil: 0.85, contenu: 1.25, sortie: 0.4 };
/**
 * Arriving in a place (César 01/10: "too fast"): the wide shot of the diorama holds first, with a
 * slow push-in, then the camera glides in to the first agent, slower than between two agents.
 */
const ARRIVEE = { plan: 2.2, voyage: 2, ease: 'power2.inOut' };
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
        repeat: Math.max(0, Math.floor((fin - voix) / 0.18) - 1),
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

/** Plain numbers in the page's language (dashboard figures count up). */
const nombre = new Intl.NumberFormat(document.documentElement.lang || 'fr').format;

/** A figure counts from 0 to its `data-valeur`, between `t` and `t + d`. */
function compter(el: HTMLElement, t: number, d: number, b: gsap.core.Timeline) {
  const cible = Number(el.dataset.valeur);
  const n = { v: 0 };
  const ecrire = () => (el.textContent = nombre(Math.round(n.v)));
  // Back to zero just before it shows, then up to its value.
  b.fromTo(
    n,
    { v: 0 },
    { v: 0, duration: 0.01, onUpdate: ecrire, immediateRender: false },
    t - 0.4,
  );
  b.to(n, { v: cible, duration: d, ease: 'power2.out', onUpdate: ecrire }, t);
}

/**
 * Head-office dashboard (EcranTableau.astro): the agent's line pops in, the card opens on a
 * skeleton and resolves, then each block plays its gesture on its beat.
 */
function tableau(ecr: HTMLElement, o: number) {
  const tl = gsap.timeline();
  const b = gsap.timeline();
  const intro = $(ecr, '.b-intro');
  const demande = ecr.querySelector<HTMLElement>('.b-demande');
  const carte = $(ecr, '.b-carte');
  const squelette = $(ecr, '.b-squelette');
  const os = $$(ecr, '.b-squelette span');
  const tete = $(ecr, '.b-tete');
  const blocs = $$(ecr, '.b-bloc');

  if (demande) {
    tl.set(demande, { autoAlpha: 0, scale: 0.92, y: 8 }, 0);
    b.to(
      demande,
      { autoAlpha: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.2)' },
      temps(ecr, 'demande'),
    );
  }
  tl.set(intro, { autoAlpha: 0, scale: 0.92, y: 8 }, 0)
    .set(carte, { autoAlpha: 0, y: 14 }, 0)
    .set(squelette, { opacity: 1 }, 0)
    .set(os, { opacity: 1 }, 0)
    .set([tete, ...blocs], { autoAlpha: 0, y: 8, filter: 'blur(6px)' }, 0);

  const tIntro = temps(ecr, 'intro');
  const tCarte = temps(ecr, 'carte');
  const tResolu = temps(ecr, 'resolu');
  b.to(intro, { autoAlpha: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.2)' }, tIntro)
    .to(carte, { autoAlpha: 1, y: 0, duration: 0.7, ease: EASE.entree }, tCarte)
    .to(
      os,
      {
        opacity: 0.45,
        duration: 0.35,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 2 * Math.ceil((tResolu - tCarte) / 0.7) - 1,
        stagger: 0.07,
      },
      tCarte,
    )
    .to(squelette, { opacity: 0, duration: 0.3, ease: EASE.sortie }, tResolu)
    .to(
      tete,
      { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: EASE.entree },
      tResolu + 0.05,
    );

  blocs.forEach((bloc) => {
    const t = temps(bloc);
    b.to(bloc, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: EASE.entree }, t);
    const type = bloc.dataset.type;
    if (type === 'chiffres') {
      const tuiles = $$(bloc, '.b-tuile');
      tl.set(tuiles, { autoAlpha: 0, y: 10 }, 0);
      tuiles.forEach((tuile, j) => {
        b.to(tuile, { autoAlpha: 1, y: 0, duration: 0.5, ease: EASE.entree }, t + 0.1 + j * 0.15);
        compter($(tuile, '.b-valeur'), t + 0.2 + j * 0.15, 1.3, b);
      });
    } else if (type === 'alerte') {
      const bouton = $(bloc, '.b-bouton');
      tl.set($(bloc, '.b-bouton-txt'), { opacity: 1 }, 0)
        .set($(bloc, '.b-bouton-ok'), { autoAlpha: 0, scale: 0.4 }, 0)
        .set($(bloc, '.b-alerte-icone'), { scale: 1 }, 0);
      b.to(
        $(bloc, '.b-alerte-icone'),
        { scale: 1.15, duration: 0.25, ease: 'sine.inOut', yoyo: true, repeat: 3 },
        t + 0.3,
      )
        .to(
          bouton,
          { scale: 0.92, duration: 0.12, ease: 'power1.inOut', yoyo: true, repeat: 1 },
          t + 1.3,
        )
        .to($(bloc, '.b-bouton-txt'), { opacity: 0, duration: 0.15 }, t + 1.45)
        .to(
          $(bloc, '.b-bouton-ok'),
          { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' },
          t + 1.5,
        );
    } else if (type === 'edition') {
      // A document being edited: the caret deletes the changed line's old text and types the new
      // one, then writes a note on the change; the badge rolls to the new version, published.
      const lignes = $$(bloc, '.b-doc li');
      const edite = $(bloc, '.b-edite');
      const [avantTxt, apresTxt] = [$(edite, '.b-avant-txt'), $(edite, '.b-apres-txt')];
      const [curseurLigne, curseurNote] = $$(bloc, '.b-curseur');
      const note = $(bloc, '.b-note-txt');
      const [enCours, publiee] = [$(bloc, '.b-en-cours'), $(bloc, '.b-publiee')];
      tl.set(lignes, { autoAlpha: 0, y: 6 }, 0)
        .set($(edite, '.b-teinte'), { opacity: 0 }, 0)
        .set(avantTxt, { width: 'auto' }, 0)
        .set([apresTxt, note], { width: 0 }, 0)
        .set([curseurLigne, curseurNote], { opacity: 0 }, 0)
        .set(enCours, { opacity: 0 }, 0)
        .set(publiee, { autoAlpha: 0, scale: 0.8 }, 0)
        .set($(bloc, '.b-roue'), { yPercent: 0, y: 0 }, 0);
      b.to(lignes, { autoAlpha: 1, y: 0, duration: 0.5, ease: EASE.entree, stagger: 0.08 }, t + 0.1)
        .to(enCours, { opacity: 1, duration: 0.3 }, t + 0.6)
        .to($(edite, '.b-teinte'), { opacity: 1, duration: 0.3, ease: EASE.doux }, t + 0.8)
        .to(
          curseurLigne,
          { opacity: 1, duration: 0.25, ease: 'steps(1)', yoyo: true, repeat: 11 },
          t + 0.8,
        )
        .to(avantTxt, { width: 0, duration: 0.8, ease: 'steps(18)' }, t + 1.2)
        .to(apresTxt, { width: 'auto', duration: 1.3, ease: 'steps(26)' }, t + 2.1)
        .set(curseurLigne, { opacity: 0 }, t + 3.6)
        .to(
          curseurNote,
          { opacity: 1, duration: 0.25, ease: 'steps(1)', yoyo: true, repeat: 7 },
          t + 3.6,
        )
        .to(note, { width: 'auto', duration: 1.4, ease: 'steps(30)' }, t + 3.8)
        .set(curseurNote, { opacity: 0 }, t + 5.4)
        .to($(bloc, '.b-roue'), { yPercent: -50, duration: 0.5, ease: EASE.camera }, t + 5.3)
        .to(enCours, { opacity: 0, duration: 0.2 }, t + 5.4)
        .to(publiee, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, t + 5.5);
    } else if (type === 'score') {
      tl.set($(bloc, '.b-jauge span'), { scaleX: 0 }, 0);
      compter($(bloc, '.b-valeur'), t + 0.2, 1.4, b);
      const p = Number($(bloc, '.b-jauge span').dataset.p);
      b.to($(bloc, '.b-jauge span'), { scaleX: p, duration: 1.4, ease: 'power2.out' }, t + 0.2);
    } else if (type === 'plan') {
      // The agent thinks (dots), then writes the plan: each action typed, its gap and due date.
      const reflexion = $(bloc, '.b-reflexion');
      const doc = $(bloc, '.b-plan-doc');
      const items = $$(bloc, '.b-plan-doc li');
      tl.set(reflexion, { height: 0, opacity: 0 }, 0)
        .set(doc, { autoAlpha: 0, y: 10 }, 0)
        .set(items, { autoAlpha: 0 }, 0)
        .set($$(bloc, '.b-action-txt'), { width: 0 }, 0)
        .set($$(bloc, '.b-ecrit .b-curseur'), { opacity: 0 }, 0)
        .set($$(bloc, '.b-ecart-txt'), { opacity: 0 }, 0)
        .set($$(bloc, '.b-echeance'), { autoAlpha: 0, scale: 0.6 }, 0);
      b.to(reflexion, { height: 'auto', opacity: 1, duration: 0.35, ease: EASE.doux }, t + 0.2)
        .to(
          $$(bloc, '.b-points span'),
          {
            yPercent: -50,
            opacity: 0.4,
            duration: 0.3,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: 3,
            stagger: 0.12,
          },
          t + 0.3,
        )
        .to(reflexion, { height: 0, opacity: 0, duration: 0.3, ease: EASE.sortie }, t + 1.7)
        .to(doc, { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE.entree }, t + 1.8);
      items.forEach((li, j) => {
        const at = t + 2.2 + j * 1.7;
        b.set(li, { autoAlpha: 1 }, at)
          .to(
            $(li, '.b-curseur'),
            { opacity: 1, duration: 0.2, ease: 'steps(1)', yoyo: true, repeat: 5 },
            at,
          )
          .to($(li, '.b-action-txt'), { width: 'auto', duration: 1, ease: 'steps(28)' }, at)
          .set($(li, '.b-curseur'), { opacity: 0 }, at + 1.2)
          .to($(li, '.b-ecart-txt'), { opacity: 1, duration: 0.4, ease: EASE.doux }, at + 0.8)
          .to(
            $(li, '.b-echeance'),
            { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' },
            at + 1,
          );
      });
    }
  });
  return tl.add(b, o);
}

/** A WhatsApp chat (Peep, Pecker, Sparrow): typing, replies typed then sent, the poll voted, head office notified. */
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
          // At least one bounce: below 0.6 s this gave -1, an infinite repeat that made the whole
          // place's timeline endless (César 01/10, tabs and scroll stopped working).
          repeat: Math.max(1, 2 * Math.floor((message - t) / 0.6)) - 1,
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
  /** The place is left: back to its wide shot (`remettre`), or frozen where it is. */
  arreter(remettre?: boolean): void;
  /** Scroll mode: progress (0–1) where demo i starts, to scroll a tab click there. */
  position(i: number): number;
}

/** Agents whose demo has played on this page, so a replay isn't counted twice (analytics). */
const vus = new Set<string>();

/** Mixte: share of the scroll that moves the playhead (the rest is left to time). */
const POUSSEE = 0.7;

export function piloter(lieu: HTMLElement, mode: Mode = 'mixte'): Pilote {
  const scroll = mode === 'scroll';
  const calque = $(lieu, '.d2-calque');
  const voile = $(lieu, '.d2-voile');
  const ecrans = $$(lieu, '.d2-ecran');
  const onglets = $$(lieu, '[data-onglet]');
  const titres = $$(lieu, '[data-titre]');
  const barres = onglets.map((o) => $(o, '.d2-barre > span'));
  const vue = lireCam(lieu.dataset.vue!);
  const cams = ecrans.map((e) => lireCam(e.dataset.cam!));

  let tl: gsap.core.Timeline | null = null;
  let debuts: number[] = [];
  let actif = false;
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
    // `actif`: only while the place is on screen, not when a reset rewinds it to its first demo.
    const agent = onglets[i].dataset.agent!;
    if (actif && !vus.has(agent)) {
      vus.add(agent);
      suivre('diorama_agent_vu', { agent });
    }
  }

  function construire(mobile: boolean) {
    const { appareil, contenu } = T;
    const m = gsap.timeline({
      paused: true,
      // Only time alone loops (?auto=1). With the scroll in play, a place ends on its wide shot and
      // stays there: a loop restarted the first demo under the visitor's eyes (César 01/10).
      repeat: mode === 'auto' ? -1 : 0,
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
      .to(calque, { '--z': vue['--z'] * DERIVE, duration: ARRIVEE.plan, ease: 'sine.inOut' }, 0)
      .to(voile, { opacity: 1, duration: 1.4, ease: 'power1.inOut' }, ARRIVEE.plan + 0.2);
    debuts = [];
    ecrans.forEach((e, i) => {
      const ecr = $(e, '.ecr');
      const duree = Number(ecr.dataset.duree);
      const s = gsap.timeline();
      const cam = cams[i];
      /** The first travel (from the wide shot) is longer: the rest of the segment shifts with it. */
      const voyage = i === 0 ? ARRIVEE.voyage : T.camera;
      const a = appareil + voyage - T.camera;
      const c = contenu + voyage - T.camera;
      // 1. The camera travels to the agent, under the dimmed layer: the scene is only the setting,
      //    the device is the subject (César 01/10: the cut-out agent must not move or stand out).
      s.fromTo(
        calque,
        i === 0
          ? { ...vue, '--z': vue['--z'] * DERIVE }
          : { ...cams[i - 1], '--z': cams[i - 1]['--z'] * DERIVE },
        {
          ...cam,
          duration: voyage,
          ease: i === 0 ? ARRIVEE.ease : EASE.camera,
          immediateRender: false,
        },
        0,
      );
      // 2. Its device enters from its side (left of the device on desktop, above on phones), tilted
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
        a,
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
          a,
        )
        .fromTo(
          $(ecr, '.reflet'),
          { opacity: 0, xPercent: -70 },
          { xPercent: 70, duration: 1.5, ease: 'power2.inOut', immediateRender: false },
          a + 0.2,
        )
        .to($(ecr, '.reflet'), { opacity: 1, duration: 0.5, ease: 'power1.out' }, a + 0.2)
        .to($(ecr, '.reflet'), { opacity: 0, duration: 0.6, ease: 'power1.in' }, a + 1.1);
      // 3. The screen plays; meanwhile the camera keeps a slow push-in so the scene never freezes.
      s.add(
        ecr.classList.contains('tablette')
          ? tablette(ecr, c)
          : ecr.classList.contains('tableau')
            ? tableau(ecr, c)
            : telephone(ecr, c),
        0,
      ).to(calque, { '--z': cam['--z'] * DERIVE, duration: duree, ease: 'sine.inOut' }, c);
      // 4. Exit, shorter than the entrance. A card beside the device (head office's notification)
      //    leaves first, on its own path, so the two read as separate things, not one block.
      const aCote = ecr.querySelector<HTMLElement>('.p-suivi');
      if (aCote)
        s.to(
          aCote,
          { autoAlpha: 0, x: -28, y: -10, duration: 0.35, ease: EASE.sortie },
          c + duree - 0.25,
        );
      s.to(
        e,
        {
          autoAlpha: 0,
          y: mobile ? -12 : 0,
          x: mobile ? 0 : 24,
          duration: T.sortie,
          ease: EASE.sortie,
        },
        c + duree + (aCote ? 0.12 : 0),
      );

      const debut = i === 0 ? ARRIVEE.plan : m.duration() - 0.1;
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
    // The place ends on its wide shot, held: with the scroll in play, the last stretch of the
    // place's scroll is this calm frame, so leaving the place never cuts a demo mid-sentence.
    m.to({}, { duration: 1.2 });
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

  /**
   * Where the playhead starts when the place becomes active: from the top (wide shot) when coming
   * in from above; mixte, coming in from below, starts near the end so scrolling up rewinds it.
   */
  const depart = (p: number) => (mode === 'mixte' && p > 0.5 ? p * (tl?.duration() ?? 0) : 0);

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
      else if (actif) tl.play(depart(q));
      return () => {
        tl = null;
      };
    },
  );

  document.addEventListener('visibilitychange', () => {
    if (tl && actif && !scroll && cible === null) tl.paused(document.hidden);
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
        if (actif) tl?.play();
      },
    });
  }

  return {
    entrer(p) {
      actif = true;
      q = p;
      if (!tl) return montrer(scroll ? indice(p) : 0);
      if (scroll) return void tl.progress(p);
      tl.play(depart(p));
    },
    suivre(p) {
      const dq = p - q;
      q = p;
      if (!tl) return scroll ? montrer(indice(p)) : undefined;
      if (scroll) {
        // A short catch-up tween smooths the wheel's steps without lagging behind the scroll.
        gsap.to(tl, { progress: p, duration: 0.6, ease: 'power3.out', overwrite: true });
      } else if (mode === 'mixte' && dq) {
        // Going down, the scroll is a floor: at q the demo is at least at q of its length, so at
        // the bottom of the place it has reached its end (wide shot) before the next place shows.
        // Going up, it rewinds relatively.
        const d = tl.duration();
        const ici = cible ?? tl.time();
        pousser(dq > 0 ? Math.max(ici + dq * d * POUSSEE, p * d) - ici : dq * d * POUSSEE);
      }
    },
    jouer(i) {
      if (scroll) return;
      if (!tl) return montrer(i);
      cible = null;
      gsap.killTweensOf(tl);
      tl.play(i === 0 ? 0 : `d${i}`);
    },
    arreter(remettre = true) {
      actif = false;
      cible = null;
      if (!tl) return scroll ? undefined : montrer(0);
      gsap.killTweensOf(tl);
      if (scroll) return;
      if (remettre) tl.pause(0);
      else tl.pause();
    },
    position(i) {
      if (!tl) return (i + 0.5) / ecrans.length;
      // Just past the camera travel, so the click lands on the device entering.
      return Math.min(1, (debuts[i] + T.camera) / tl.duration());
    },
  };
}
