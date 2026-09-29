export const locales = ['fr', 'en'] as const;
export type Locale = (typeof locales)[number];

/**
 * Every page of the site, with its URL in each locale. Pages pass their key to <Base>,
 * which derives the language switch and the hreflang alternates from it.
 */
export const routes = {
  home: { fr: '/', en: '/en/' },
  demo: { fr: '/demo', en: '/en/demo' },
  security: { fr: '/securite', en: '/en/security' },
} as const satisfies Record<string, Record<Locale, string>>;
export type Route = keyof typeof routes;

/** Short UI strings (nav, footer, buttons, accessibility labels). Marketing copy lives in src/content/. */
const fr = {
  'a11y.skip': 'Aller au contenu',
  'a11y.home': 'Hatch OS, accueil',
  'a11y.menu': 'Menu',
  'a11y.mainNav': 'Navigation principale',
  'nav.agents': 'Les agents',
  'nav.cases': 'Cas clients',
  'nav.pricing': 'Tarifs',
  'nav.security': 'Sécurité',
  'cta.demo': 'Demander une démo',
  'lang.switch': 'English',
  'footer.tagline': "L'OS des réseaux de franchise.",
  'footer.product': 'Produit',
  'footer.company': 'Hatch',
  'footer.rights': 'Tous droits réservés.',
} as const;

const en: Record<keyof typeof fr, string> = {
  'a11y.skip': 'Skip to content',
  'a11y.home': 'Hatch OS, home',
  'a11y.menu': 'Menu',
  'a11y.mainNav': 'Main navigation',
  'nav.agents': 'Agents',
  'nav.cases': 'Customers',
  'nav.pricing': 'Pricing',
  'nav.security': 'Security',
  'cta.demo': 'Book a demo',
  'lang.switch': 'Français',
  'footer.tagline': 'The OS for franchise networks.',
  'footer.product': 'Product',
  'footer.company': 'Hatch',
  'footer.rights': 'All rights reserved.',
};

const ui = { fr, en } satisfies Record<Locale, Record<keyof typeof fr, string>>;

export function useTranslations(locale: Locale) {
  return (key: keyof typeof fr): string => ui[locale][key];
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'fr' ? 'en' : 'fr';
}
