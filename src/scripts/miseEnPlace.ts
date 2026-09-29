/**
 * "Mise en place" pinned track (ported from the v4 prototype, site.js `miseEnPlace()`).
 *
 * The markup renders the stacked layout in its final state (mobile, no JS, reduced motion). From md up,
 * when motion is allowed, the section gets `.epingle`: the three windows are stacked one behind the
 * other ("Time Machine": on each `etape` event of the shared engine, src/scripts/pistes.ts, the front
 * window flies towards the viewer and the next one comes forward), and each window plays its
 * animation — sources connecting one by one with a counter, then the conversation and the migration
 * bars, then the channels and the Inès → Owl exchange.
 *
 * Must run before the engine (it does: this module script sits before Base's in the document), so the
 * engine's first `etape` event is caught.
 */
const section = document.querySelector<HTMLElement>('.piste[data-piste="mep"]');
if (section) init(section);

function init(section: HTMLElement) {
  const $$ = (el: ParentNode, sel: string) => [...el.querySelectorAll<HTMLElement>(sel)];
  const etats = $$(section, '[data-mep-etat]');
  const pas = $$(section, '[data-mep-pas]');
  const cta = section.querySelector<HTMLElement>('[data-mep-cta]');
  const collant = section.querySelector<HTMLElement>('.collant');
  if (etats.length !== 3 || !collant) throw new Error('MiseEnPlace: unexpected markup');

  // State 1: connected sources light up one by one, the counter follows.
  const sources = $$(etats[0], '[data-source]').map((el) => ({
    el,
    point: el.querySelector<HTMLElement>('.point')!,
    libelle: el.querySelector<HTMLElement>('.libelle')!,
  }));
  const compteur = etats[0].querySelector<HTMLElement>('[data-compteur]')!;
  const regles = new Intl.PluralRules(document.documentElement.lang);
  const compte = (n: number) => {
    const modele = regles.select(n) === 'one' ? compteur.dataset.one : compteur.dataset.other;
    compteur.textContent = modele!.replace('{n}', String(n));
  };

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
  const animes = [...bulles, ...canaux, ...fil, ...lignes.map((l) => l.etat)];

  const minuteurs: number[] = [];
  let generation = 0; // invalidates running counter loops on reset
  const plus = (f: () => void, ms: number) => minuteurs.push(window.setTimeout(f, ms));
  const stop = () => {
    minuteurs.forEach(clearTimeout);
    minuteurs.length = 0;
    generation++;
  };

  function remettre() {
    stop();
    sources.forEach((s) => {
      s.el.classList.add('eteint');
      s.libelle.textContent = s.libelle.dataset.off!;
    });
    compte(0);
    animes.forEach((e) => e.classList.add('cache'));
    lignes.forEach((l) => {
      l.barre.style.width = '0%';
      l.valeur.textContent = `0 / ${l.total}`;
    });
  }

  function final() {
    stop();
    sources.forEach((s) => {
      s.el.classList.remove('eteint');
      s.libelle.textContent = s.libelle.dataset.on!;
    });
    compte(sources.length);
    animes.forEach((e) => e.classList.remove('cache'));
    lignes.forEach((l) => {
      l.barre.style.width = l.largeur;
      l.valeur.textContent = `${l.fait} / ${l.total}`;
    });
  }

  function jouer(k: number) {
    if (k === 0)
      sources.forEach((s, i) =>
        plus(
          () => {
            s.el.classList.remove('eteint');
            s.libelle.textContent = s.libelle.dataset.on!;
            s.point.classList.remove('pop');
            void s.point.offsetWidth; // restart the pop animation
            s.point.classList.add('pop');
            compte(i + 1);
          },
          700 + i * 300,
        ),
      );
    if (k === 1) {
      bulles.forEach((b, i) => plus(() => b.classList.remove('cache'), 600 + i * 700));
      const t0 = 600 + bulles.length * 700;
      lignes.forEach((l, i) =>
        plus(
          () => {
            l.barre.style.width = l.largeur;
            const g = generation;
            const debut = performance.now();
            const pas = () => {
              if (g !== generation) return;
              const p = Math.min(1, (performance.now() - debut) / 1300);
              l.valeur.textContent = `${Math.round(l.fait * (1 - (1 - p) ** 3))} / ${l.total}`;
              if (p < 1) requestAnimationFrame(pas);
              else l.etat.classList.remove('cache');
            };
            pas();
          },
          t0 + i * 350,
        ),
      );
    }
    if (k === 2) {
      canaux.forEach((c, i) => plus(() => c.classList.remove('cache'), 600 + i * 220));
      fil.forEach((f, i) => plus(() => f.classList.remove('cache'), 1500 + i * 1400));
    }
  }

  const mq = matchMedia('(min-width: 48rem) and (prefers-reduced-motion: no-preference)');
  let epingle = false;
  let visible = false;
  let k = 0;

  function afficher() {
    // Distance from the current step: drives the "Time Machine" stack in the component's CSS.
    etats.forEach((el, i) => (el.dataset.d = String(i - k)));
    pas.forEach((p, i) => (p.dataset.etat = i < k ? 'fait' : i === k ? 'actif' : 'a-venir'));
    // Hidden windows keep their CTA out of the tab order.
    if (epingle && k !== 2) cta?.setAttribute('tabindex', '-1');
    else cta?.removeAttribute('tabindex');
  }

  function rejouer() {
    if (!epingle || !visible) return;
    remettre();
    jouer(k);
  }

  function mode() {
    epingle = mq.matches;
    section.classList.toggle('epingle', epingle);
    afficher();
    if (epingle) rejouer();
    else final();
    // The layout changed: let the engine re-frame the stage.
    window.dispatchEvent(new Event('resize'));
  }

  section.addEventListener('etape', (e) => {
    k = (e as CustomEvent<number>).detail;
    afficher();
    rejouer();
  });

  // Play the current state when the pinned view comes on screen (not at page load, off screen).
  new IntersectionObserver(
    ([entree]) => {
      const avant = visible;
      visible = entree.isIntersecting;
      if (visible && !avant) rejouer();
    },
    { threshold: 0.5 },
  ).observe(collant);

  mq.addEventListener('change', mode);
  mode();
}
