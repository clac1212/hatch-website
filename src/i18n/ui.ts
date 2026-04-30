/**
 * Short structural UI strings used outside of Markdown content collections.
 * Marketing copy lives in `src/content/landing/{fr,en}.md`.
 */

export const locales = ['fr', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fr';


export function demoUrl(locale: Locale): string {
  return locale === 'en' ? '/en/demo' : '/demo';
}

export const ui = {
  fr: {
    nav: {
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
