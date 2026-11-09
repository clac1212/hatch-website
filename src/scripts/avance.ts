/**
 * Tabs that advance on their own (Robin's features and week, César 09/11): the active tab gets
 * `.en-cours` and its `.avance-barre` fills (CSS, global.css); at the end of the fill the next tab
 * takes over. A click picks a tab and stops the advance for good. The fill pauses while `vue` is
 * off screen or the pointer is on `pause` (someone reading or scrolling a mockup). Starts the first
 * time `vue` is 40 % visible. With reduced motion: no advance, the first tab is shown, clicks work.
 *
 * Markup: the root gets `.auto` (advancing), `.hors` (off screen), `.pause` (pointer on `pause`).
 */
export function avance(
  racine: HTMLElement,
  onglets: HTMLElement[],
  activer: (i: number) => void,
  { vue = racine, pause }: { vue?: Element; pause?: Element } = {},
) {
  const reduit = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let actif = -1;
  const aller = (i: number) => {
    if (i === actif) return;
    actif = i;
    onglets.forEach((o, k) => o.classList.toggle('en-cours', k === i));
    activer(i);
  };

  if (!reduit) racine.classList.add('auto');
  onglets.forEach((o, k) => {
    o.addEventListener('click', () => {
      racine.classList.remove('auto');
      aller(k);
    });
    o.querySelector('.avance-barre > i')?.addEventListener('animationend', () => {
      if (racine.classList.contains('auto') && k === actif) aller((k + 1) % onglets.length);
    });
  });
  if (pause) {
    pause.addEventListener('pointerenter', () => racine.classList.add('pause'));
    pause.addEventListener('pointerleave', () => racine.classList.remove('pause'));
  }
  new IntersectionObserver(
    ([e]) => {
      racine.classList.toggle('hors', !e.isIntersecting);
      if (e.isIntersecting && actif === -1) aller(0);
    },
    { threshold: 0.4 },
  ).observe(vue);
}
