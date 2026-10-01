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

/** Owl's kitchen tablet: listening (waveform, words), then the sheet read step by step. */
function tablette(ecr: HTMLElement, o: number) {
  const tl = gsap.timeline();
  /** `tl` resets the screen from the demo start; `b` holds the beats, from the content start `o`. */
  const b = gsap.timeline();
  const debut = temps(ecr, 'debut');
  const reponse = temps(ecr, 'reponse');
  const etape = temps(ecr, 'etape');
  const mots = $$(ecr, '.t-mot');
  const barres = $$(ecr, '.t-onde span');
  const anneaux = $$(ecr, '.t-anneau');
  const droite = $(ecr, '.t-droite');
  const etapes = $$(ecr, '.t-etapes li');
  const pied = $(ecr, '.t-pied');

  // Back to the start state (the markup is the final state), as soon as the demo starts.
  tl.set(mots, { autoAlpha: 0, y: '0.35em', filter: 'blur(4px)' }, 0)
    .set($(ecr, '.t-ecoute'), { opacity: 1 }, 0)
    .set($(ecr, '.t-lit'), { opacity: 0 }, 0)
    .set(barres, { scaleY: 0.12 }, 0)
    .set(anneaux, { opacity: 0, scale: 1 }, 0)
    .set(droite, { autoAlpha: 0, x: 18 }, 0)
    .set(etapes, { autoAlpha: 0, y: 10 }, 0)
    .set($$(ecr, '.t-surligne, .t-hp'), { opacity: 0 }, 0)
    .set($$(ecr, '.t-ok'), { autoAlpha: 0, scale: 0.4 }, 0)
    .set($$(ecr, '.t-lu'), { scaleX: 0, opacity: 1 }, 0)
    .set(pied, { autoAlpha: 0, y: 6 }, 0);

  // Listening: the record dot blinks, rings leave the mic, the waveform follows the voice.
  const ecoute = reponse - debut;
  b.to(
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
  anneaux.forEach((a, i) =>
    b.fromTo(
      a,
      { opacity: 0.7, scale: 1 },
      {
        opacity: 0,
        scale: 1.8,
        duration: 1.2,
        ease: 'power1.out',
        repeat: Math.max(0, Math.floor((ecoute - 0.6 * i) / 1.2) - 1),
        immediateRender: false,
      },
      debut - 0.3 + 0.6 * i,
    ),
  );
  barres.forEach((barre, i) =>
    b.to(
      barre,
      {
        scaleY: () => gsap.utils.random(0.3, 1),
        duration: 0.17,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: Math.floor(ecoute / 0.17),
        repeatRefresh: true,
      },
      debut + i * 0.015,
    ),
  );
  b.to(barres, { scaleY: 0.12, duration: 0.35, ease: EASE.doux }, reponse);
  mots.forEach((m) =>
    b.to(m, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.45, ease: EASE.doux }, temps(m)),
  );

  // Answer: status swaps, the sheet slides in, its steps cascade.
  b.to($(ecr, '.t-ecoute'), { opacity: 0, duration: 0.2, ease: EASE.sortie }, reponse)
    .to($(ecr, '.t-lit'), { opacity: 1, duration: 0.3, ease: EASE.doux }, reponse + 0.15)
    .to(droite, { autoAlpha: 1, x: 0, duration: 0.8, ease: EASE.entree }, reponse + 0.1)
    .to(
      etapes,
      { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE.entree, stagger: 0.07 },
      reponse + 0.35,
    );

  // Each step is read out: tinted, speaker on, reading bar fills, then it gets its check.
  const lu = etape * 0.85;
  etapes.forEach((li) => {
    const t = temps(li);
    b.to($(li, '.t-surligne'), { opacity: 1, duration: 0.3, ease: EASE.doux }, t)
      .to($(li, '.t-hp'), { opacity: 1, duration: 0.2 }, t)
      .to($(li, '.t-lu'), { scaleX: 1, duration: lu, ease: 'none' }, t)
      .to($$(li, '.t-surligne, .t-hp'), { opacity: 0, duration: 0.3, ease: EASE.sortie }, t + lu)
      .to($(li, '.t-lu'), { opacity: 0, duration: 0.3 }, t + lu)
      .to($(li, '.t-ok'), { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(2)' }, t + lu);
  });
  b.to(pied, { autoAlpha: 1, y: 0, duration: 0.5, ease: EASE.entree }, temps(pied));
  return tl.add(b, o);
}

/** Pecker's phone: the thread grows line by line, the quiz gets tapped, head office is told. */
function telephone(ecr: HTMLElement, o: number) {
  const tl = gsap.timeline();
  const b = gsap.timeline();
  const lignes = $$(ecr, '.p-ligne:not(.p-frappe)');
  const bulles = lignes.map((l) => l.firstElementChild as HTMLElement);
  const suivi = $(ecr, '.p-suivi');

  tl.set(lignes, { height: 0 }, 0)
    .set(bulles, { autoAlpha: 0, scale: 0.9, y: 8 }, 0)
    .set($$(ecr, '.p-teinte'), { opacity: 0 }, 0)
    .set($$(ecr, '.p-quiz svg'), { autoAlpha: 0, scale: 0.4 }, 0)
    .set($$(ecr, '.p-doigt'), { autoAlpha: 0, scale: 1.5, xPercent: 70, yPercent: 90 }, 0)
    .set(suivi, { autoAlpha: 0, x: 48, scale: 0.96 }, 0)
    .set($(suivi, '.p-coche svg'), { scale: 0.4, opacity: 0 }, 0);

  // Typing indicator: opens, its dots bounce, closes right before the message.
  $$(ecr, '.p-frappe').forEach((f) => {
    const t = temps(f);
    const message = temps(f.nextElementSibling as HTMLElement);
    b.to(f, { height: 'auto', duration: 0.35, ease: EASE.doux }, t)
      .to(
        $$(f, 'span'),
        {
          yPercent: -45,
          opacity: 0.4,
          duration: 0.3,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: 2 * Math.floor((message - t) / 0.6) - 1,
          stagger: 0.12,
        },
        t,
      )
      .to(f, { height: 0, duration: 0.25, ease: EASE.sortie }, message - 0.25);
  });

  // Each message or quiz: its line grows (pushing the thread up), the bubble pops in from its tail.
  lignes.forEach((l, i) => {
    const t = temps(l);
    b.to(l, { height: 'auto', duration: 0.5, ease: EASE.entree }, t).to(
      bulles[i],
      { autoAlpha: 1, scale: 1, y: 0, duration: 0.45, ease: 'back.out(1.2)' },
      t + 0.05,
    );
    if (!l.dataset.c) return;
    // The quiz: a fingertip comes in, presses the right option, it turns orange and gets its check.
    const c = temps(l, 'c');
    const bonne = $(l, 'li.bonne');
    const doigt = $(bonne, '.p-doigt');
    b.to(
      doigt,
      { autoAlpha: 1, scale: 1, xPercent: 0, yPercent: 0, duration: 0.55, ease: 'power3.out' },
      c - 0.65,
    )
      .to(
        doigt,
        { scale: 0.8, duration: 0.12, ease: 'power1.inOut', yoyo: true, repeat: 1 },
        c - 0.1,
      )
      .to(
        bonne,
        { scale: 0.97, duration: 0.12, ease: 'power1.inOut', yoyo: true, repeat: 1 },
        c - 0.1,
      )
      .to($(bonne, '.p-teinte'), { opacity: 1, duration: 0.25, ease: EASE.doux }, c)
      .to($(bonne, 'svg'), { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, c + 0.15)
      .to(doigt, { autoAlpha: 0, scale: 1.2, duration: 0.3, ease: EASE.sortie }, c + 0.35);
  });

  // Head office's training tracker slides out from behind the phone, then checks.
  const t = temps(suivi);
  b.to(suivi, { autoAlpha: 1, x: 0, scale: 1, duration: 0.9, ease: EASE.entree }, t).to(
    $(suivi, '.p-coche svg'),
    { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2)' },
    t + 0.4,
  );
  return tl.add(b, o);
}

export interface Pilote {
  /** Play demo i (and the following ones, in a loop). */
  jouer(i: number): void;
  /** Back to the wide shot, stopped (the place is left). */
  arreter(): void;
  /** Toggle the visitor's pause; returns the new state. */
  basculer(): boolean;
}

export function piloter(lieu: HTMLElement): Pilote {
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
      repeat: -1,
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
      // 3. Its device enters from its side (left of the device on desktop, above on phones).
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
      );
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
    m.to({}, { duration: 1.4 });
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
      if (!tl) montrer(0);
      else if (actif) tl.play(0).paused(enPause);
      return () => {
        tl = null;
      };
    },
  );

  document.addEventListener('visibilitychange', () => {
    if (tl && actif && !enPause) tl.paused(document.hidden);
  });

  return {
    jouer(i) {
      actif = true;
      if (!tl) return montrer(i);
      enPause = false;
      tl.play(i === 0 ? 0 : `d${i}`);
    },
    arreter() {
      actif = false;
      if (tl) tl.pause(0);
      else montrer(0);
    },
    basculer() {
      enPause = !enPause;
      tl?.paused(enPause);
      return enPause;
    },
  };
}
