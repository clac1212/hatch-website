import type { SchemaContext } from 'astro:content';
import { z } from 'astro/zod';
import { agentSlugs } from './agents';
import { publicCible } from '../pages/schemas';

const texte = z.string().min(1);

/**
 * A guide of /ressources (`src/content/ressources/<locale>/<slug>.md`, same slug in both
 * locales), rendered by src/views/GuidePage.astro. The body is Markdown; the H1 is `title`. A
 * blockquote opening on a bold line (`> **Avec Robin**`) renders as the agent's box.
 * `glossaire` is reserved (the glossary page lives at /ressources/glossaire).
 */
export const schema = ({ image }: SchemaContext) =>
  z.strictObject({
    /** The H1: a fact about the reader's trade, never about a product. */
    title: texte,
    /** <title> for Google, « | Hatch OS » added; ≤ 49 characters so the whole stays ≤ 60. */
    seoTitle: texte.max(49),
    /** Meta description: a full sentence, 120 to 155 characters (the SEO audit wants 120 to 160). */
    description: texte.min(120).max(155),
    kicker: texte,
    chapeau: texte,
    /** The three key points under the chapeau (« L'essentiel »). */
    essentiel: z.array(texte).length(3),
    public: publicCible,
    /** The trade the guide is about: also the index's theme filter (« Achats », « Qualité »…). */
    metier: texte,
    /** Agents the guide talks about: one card each at the end, to its page. */
    agents: z.array(z.enum(agentSlugs)).optional(),
    readingMinutes: z.number().int().positive(),
    updatedAt: z.iso.date(),
    /** Cover, a voxel diorama of src/assets/ressources/ (3:2). */
    image: image(),
    imageAlt: texte,
    /** Shown first on /ressources (« À la une »). */
    une: z.boolean().default(false),
    faq: z.array(z.strictObject({ question: texte, reponse: texte })),
    /** Every number of the guide carries a source: the claim, its URL, when it was read. */
    sources: z.array(z.strictObject({ affirmation: texte, url: z.url(), luLe: z.iso.date() })),
    /** Draft: listed and built only by `pnpm dev`, never in production. */
    brouillon: z.boolean().default(false),
  });
