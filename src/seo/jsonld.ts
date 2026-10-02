import type { Locale } from '../i18n/ui';

/**
 * Structured data (schema.org JSON-LD) shared by every page. <Base> always renders the
 * Organization; pages add their own nodes through its `jsonLd` prop, built with the helpers below.
 * Nodes link to each other by `@id` (e.g. `publisher: { '@id': organizationId(site) }`).
 */
export type JsonLdNode = Record<string, unknown>;

/** Brand name. The bare "Hatch" belongs to a US brand: always "Hatch OS". */
export const BRAND = 'Hatch OS';

/** BCP 47 tags of the site's locales, for `inLanguage` (same values as the hreflang alternates). */
export const languageTag: Record<Locale, string> = { fr: 'fr', en: 'en' };

/** The two co-founders, as written in the legal notices. `givenName` matches journal signatures. */
export const founders = [
  { name: 'Patrick Rakotondrajao', givenName: 'Patrick' },
  { name: 'César Lacombe', givenName: 'César' },
] as const;

/** Official profiles: linked from the footer, `sameAs` of the Organization. */
export const socialLinks = [
  { href: 'https://www.linkedin.com/company/gethatchos/', label: 'LinkedIn' },
  { href: 'https://www.instagram.com/get_hatch.os/', label: 'Instagram' },
] as const;

const abs = (path: string, site: URL) => new URL(path, site).href;

export const organizationId = (site: URL) => abs('/#organization', site);

export const person = (name: string): JsonLdNode => ({ '@type': 'Person', name });

/** Founder whose given name opens a signature ("Patrick, co-fondateur de Hatch OS"). */
export function founderOf(signature: string) {
  const givenName = signature.split(',')[0].trim();
  const founder = founders.find((f) => f.givenName === givenName);
  if (!founder) throw new Error(`No founder matches the signature "${signature}"`);
  return founder;
}

export function organization(site: URL, logo: { url: string; width: number; height: number }) {
  return {
    '@type': 'Organization',
    '@id': organizationId(site),
    name: BRAND,
    url: abs('/', site),
    logo: { '@type': 'ImageObject', ...logo },
    founder: founders.map((f) => person(f.name)),
    sameAs: socialLinks.map((l) => l.href),
  } satisfies JsonLdNode;
}

/** The site itself, on each home page (`homePath`: the home of that locale). */
export function webSite(site: URL, locale: Locale, homePath: string, description: string) {
  const url = abs(homePath, site);
  return {
    '@type': 'WebSite',
    '@id': `${url}#website`,
    url,
    name: BRAND,
    description,
    inLanguage: languageTag[locale],
    publisher: { '@id': organizationId(site) },
  } satisfies JsonLdNode;
}

/** Breadcrumb trail, first item = the home. `path`s are site-relative. */
export function breadcrumbList(site: URL, items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: abs(item.path, site),
    })),
  } satisfies JsonLdNode;
}

/**
 * `<script type="application/ld+json">` body. `<`, `>` and `&` are escaped so no string in the
 * data can close the script element; U+2028/2029 for old JS parsers.
 */
export function serializeJsonLd(nodes: JsonLdNode[]): string {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes })
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
