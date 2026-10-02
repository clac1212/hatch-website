import { routes } from '../i18n/ui';

/**
 * Site events sent to PostHog (Analytics.astro). `window.posthog` is missing when the key isn't set
 * (local dev without `.env`, a preview without the env var): the site then runs untracked.
 *
 * - `cta_demo_clic` {emplacement}: a click on any link to /demo, and where it sits;
 * - `cta_essai_clic` {emplacement}: the same for a link to the app's self-serve signup (app.gethatch.io/auth);
 * - `demo_reservee`: Cal.com confirmed a booking (DemoPage.astro);
 * - `diorama_agent_vu` {agent}: an agent's demo started playing (demo-motion.ts), once per page.
 */
type Proprietes = Record<string, string | number | boolean>;

declare global {
  interface Window {
    posthog?: { capture(evenement: string, proprietes?: Proprietes): void };
  }
}

export function suivre(evenement: string, proprietes?: Proprietes) {
  window.posthog?.capture(evenement, proprietes);
}

// One delegated listener covers every CTA (nav, hero, pricing, footer…), present and future: links to
// /demo, and links to the signup of the app (any query, the app has no locale prefix).
// `emplacement` names the landmark holding it: the section's id or title id, else `header`/`footer`.
const demo = new Set(Object.values(routes.demo));
const evenementDe = (url: URL) => {
  if (url.hostname === 'app.gethatch.io' && url.pathname === '/auth') return 'cta_essai_clic';
  if (demo.has(url.pathname)) return 'cta_demo_clic';
  return null;
};
document.addEventListener('click', (e) => {
  const lien = (e.target as Element).closest<HTMLAnchorElement>('a[href]');
  if (!lien) return;
  const evenement = evenementDe(new URL(lien.href));
  if (!evenement) return;
  const zone = lien.closest('header, footer, section');
  suivre(evenement, {
    emplacement: zone ? zone.id || zone.getAttribute('aria-labelledby') || zone.localName : 'page',
  });
});
