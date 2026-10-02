export const locales = ['fr', 'en'] as const;
export type Locale = (typeof locales)[number];

/**
 * Every static page of the site, with its URL in each locale. Pages pass `routes.<key>` to <Base>
 * as `paths`, which derives the language switch and the hreflang alternates from it
 * (dynamic pages, e.g. a Sans Filtre edition, build their own `paths` object).
 */
export const routes = {
  home: { fr: '/', en: '/en' },
  demo: { fr: '/demo', en: '/en/demo' },
  security: { fr: '/securite', en: '/en/security' },
  terms: { fr: '/conditions', en: '/en/terms' },
  privacy: { fr: '/confidentialite', en: '/en/privacy' },
  sansFiltre: { fr: '/sans-filtre', en: '/en/unfiltered' },
} as const satisfies Record<string, Record<Locale, string>>;
export type Paths = Record<Locale, string>;

/** Pages generated per entry: an agent (`src/content/agents`), a customer case (`src/content/cases`). */
export const entryRoutes = {
  agents: (slug: string): Paths => ({ fr: `/agents/${slug}`, en: `/en/agents/${slug}` }),
  clients: (id: string): Paths => ({ fr: `/clients/${id}`, en: `/en/clients/${id}` }),
};

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
  'cta.demo': 'Réserver une démo',
  'lang.switch': 'English',
  'footer.product': 'Produit',
  'footer.company': 'Hatch OS',
  /** Describes public/og-image.png, the default share image (its text is in French). */
  'seo.ogImageAlt':
    "Hatch OS, l'OS pour les réseaux de restauration : toute l'intelligence de votre réseau, accessible sur WhatsApp",
  /** The 404 page: one file served for every unknown URL, French first then English. */
  '404.seoTitle': 'Page introuvable · Hatch OS',
  '404.seoDescription':
    "Cette adresse ne correspond à aucune page du site Hatch OS. Retrouvez les sept agents IA des réseaux de franchise depuis l'accueil, ou réservez une démo.",
  '404.kicker': 'Erreur 404',
  '404.title': "Cette page n'existe pas.",
  '404.text':
    "L'adresse demandée ne correspond à aucune page du site. Elle a peut-être changé, ou contient une faute de frappe.",
  '404.home': "Retour à l'accueil",
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
  'footer.product': 'Product',
  'footer.company': 'Hatch OS',
  'seo.ogImageAlt':
    "Hatch OS, the OS for restaurant networks: all of your network's intelligence, available on WhatsApp",
  '404.seoTitle': 'Page not found · Hatch OS',
  '404.seoDescription':
    'This address matches no page of the Hatch OS website. Meet the seven AI agents for franchise networks from the home page, or book a demo.',
  '404.kicker': 'Error 404',
  '404.title': 'This page does not exist.',
  '404.text':
    'The address you requested matches no page of this website. It may have moved, or contain a typo.',
  '404.home': 'Back to the home page',
};

const ui = { fr, en } satisfies Record<Locale, Record<keyof typeof fr, string>>;

export function useTranslations(locale: Locale) {
  return (key: keyof typeof fr): string => ui[locale][key];
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'fr' ? 'en' : 'fr';
}
