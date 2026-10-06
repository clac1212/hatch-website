/**
 * Reveal on scroll (ported from the v4 prototype "GROUPES").
 * Inside any element marked [data-rv-groupe], children marked [data-rv] fade up once, in cascade
 * (90 ms apart, in DOM order), when the group is 22 % visible. The group element also receives an
 * `apparition` event, for sections that start an animation on first sight (counters…).
 */
const groupes = document.querySelectorAll<HTMLElement>('[data-rv-groupe]');

const obs = new IntersectionObserver(
  (entrees) => {
    for (const e of entrees) {
      if (!e.isIntersecting) continue;
      const g = e.target as HTMLElement;
      g.querySelectorAll('[data-rv]').forEach((el) => el.classList.add('vu'));
      g.dispatchEvent(new CustomEvent('apparition'));
      obs.unobserve(g);
    }
  },
  { threshold: 0.22 },
);

groupes.forEach((g) => {
  g.querySelectorAll<HTMLElement>('[data-rv]').forEach((el, i) => {
    if (!el.style.getPropertyValue('--rd')) el.style.setProperty('--rd', `${i * 0.09}s`);
  });
  obs.observe(g);
});
