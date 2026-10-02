import { routes } from '../i18n/ui';

/**
 * Site events sent to PostHog (Analytics.astro). `window.posthog` is missing when the key isn't set
 * (local dev without `.env`, a preview without the env var): the site then runs untracked.
 *
 * - `cta_demo_clic` {emplacement}: a click on any link to /demo, and where it sits;
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

// One delegated listener covers every demo button (nav, hero, pricing, footer…), present and future.
// `emplacement` names the landmark holding it: the section's id or title id, else `header`/`footer`.
const demo = new Set(Object.values(routes.demo));
document.addEventListener('click', (e) => {
  const lien = (e.target as Element).closest<HTMLAnchorElement>('a[href]');
  if (!lien || !demo.has(new URL(lien.href).pathname)) return;
  const zone = lien.closest('header, footer, section');
  suivre('cta_demo_clic', {
    emplacement: zone ? zone.id || zone.getAttribute('aria-labelledby') || zone.localName : 'page',
  });
});
