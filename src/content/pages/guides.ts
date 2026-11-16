import { getCollection } from 'astro:content';
import type { Locale } from '../../i18n/ui';

/** Slug of a guide entry (`fr/fond-de-caisse` → `fond-de-caisse`). */
export const guideSlug = (id: string) => id.slice(id.indexOf('/') + 1);

/**
 * The guides of one locale, most recently updated first. Drafts (`brouillon: true`) only exist in
 * `pnpm dev`: never listed nor built in production.
 */
export async function publishedGuides(locale: Locale) {
  const guides = await getCollection(
    'ressources',
    (g) => g.id.startsWith(`${locale}/`) && (import.meta.env.DEV || !g.data.brouillon),
  );
  return guides.sort((a, b) => b.data.updatedAt.localeCompare(a.data.updatedAt));
}
