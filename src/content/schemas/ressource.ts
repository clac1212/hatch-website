import { z } from 'astro/zod';
import { agentSlugs } from './agents';
import { publicCible } from '../pages/schemas';

const texte = z.string().min(1);

/**
 * A guide of /ressources (`src/content/ressources/<locale>/<slug>.md`, same slug in both
 * locales), rendered by src/views/GuidePage.astro. The body is Markdown; the H1 is `title`.
 * `glossaire` is reserved (the glossary page lives at /ressources/glossaire).
 */
export const schema = z.strictObject({
  title: texte,
  /** Meta description: a full sentence, 120 to 155 characters (the SEO audit wants 120 to 160). */
  description: texte.min(120).max(155),
  kicker: texte,
  chapeau: texte,
  public: publicCible,
  /** The trade the guide is about (« Cuisine », « Achats », « Animation réseau »…). */
  metier: texte,
  /** Agents the guide talks about: one card each at the end, to its page. */
  agents: z.array(z.enum(agentSlugs)).optional(),
  readingMinutes: z.number().int().positive(),
  updatedAt: z.iso.date(),
  faq: z.array(z.strictObject({ question: texte, reponse: texte })),
  /** Every number of the guide carries a source: the claim, its URL, when it was read. */
  sources: z.array(z.strictObject({ affirmation: texte, url: z.url(), luLe: z.iso.date() })),
  /** Draft: listed and built only by `pnpm dev`, never in production. */
  brouillon: z.boolean().default(false),
});
