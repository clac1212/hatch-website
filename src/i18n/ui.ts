/**
 * Short UI strings used across the site (nav, footer, buttons, aria labels).
 *
 * Long-form content (hero copy, sections, FAQ…) lives in
 * `src/content/landing/{fr,en}.md` — edit those Markdown files when changing
 * marketing copy. Use this file only for short, structural strings.
 */

export const locales = ['fr', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fr';

export const ui = {
  fr: {
    nav: {
      why: 'Pourquoi',
      product: 'Produit',
      pricing: 'Tarifs',
      faq: 'FAQ',
      login: 'Connexion',
      demo: 'Demander une démo',
    },
    footer: {
      copyright: '© {year} Hatch — Tous droits réservés.',
    },
    languageSwitcher: {
      fr: 'FR',
      en: 'EN',
      ariaLabel: 'Changer de langue',
    },
  },
  en: {
    nav: {
      why: 'Why Hatch',
      product: 'Product',
      pricing: 'Pricing',
      faq: 'FAQ',
      login: 'Log in',
      demo: 'Book a demo',
    },
    footer: {
      copyright: '© {year} Hatch — All rights reserved.',
    },
    languageSwitcher: {
      fr: 'FR',
      en: 'EN',
      ariaLabel: 'Switch language',
    },
  },
} satisfies Record<Locale, unknown>;
