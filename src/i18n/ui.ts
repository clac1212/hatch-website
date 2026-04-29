/**
 * Short structural UI strings used outside of Markdown content collections.
 * Marketing copy lives in `src/content/landing/{fr,en}.md`.
 */

export const locales = ['fr', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fr';

/**
 * URLs that may need to be swapped without code changes (Notion form, login).
 * Defined here so a non-technical editor only touches one place.
 */
export const externalUrls = {
  /** Demo request form (Notion). Replace with the real URL when available. */
  demoForm: 'https://hatch.notion.site/demo',
  login: 'https://app.hatch.example.com',
};

export const ui = {
  fr: {
    nav: {
      login: 'Se connecter',
      demo: 'Demander une démo',
    },
    languageSwitcher: {
      fr: 'FR',
      en: 'EN',
      ariaLabel: 'Changer de langue',
    },
    ariaLabels: {
      primaryNav: 'Navigation principale',
      faq: 'Questions fréquentes',
    },
  },
  en: {
    nav: {
      login: 'Log in',
      demo: 'Request a demo',
    },
    languageSwitcher: {
      fr: 'FR',
      en: 'EN',
      ariaLabel: 'Switch language',
    },
    ariaLabels: {
      primaryNav: 'Primary navigation',
      faq: 'Frequently asked questions',
    },
  },
} satisfies Record<Locale, unknown>;

/**
 * Returns the URL to switch to a given locale from the current path.
 * Examples:
 *   localeUrl('en', '/')       → '/en/'
 *   localeUrl('en', '/en/')    → '/en/'   (already EN)
 *   localeUrl('fr', '/en/')    → '/'
 *   localeUrl('fr', '/')       → '/'      (already FR)
 */
export function localeUrl(target: Locale, currentPath: string): string {
  if (target === 'fr') return '/';
  if (target === 'en') return '/en/';
  return '/';
}
