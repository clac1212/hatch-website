/**
 * Content Collections schema — Astro 5+ Content Layer API.
 *
 * Long-form marketing copy lives in Markdown files under `src/content/`.
 * Schemas below validate the frontmatter at build time, which means a missing
 * field or a typo fails the build instead of shipping a broken page.
 *
 * Adding a new collection? Define it here, add a `loader`, write a Zod schema,
 * then export it via the `collections` object.
 */

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const landing = defineCollection({
  // One Markdown file per locale: src/content/landing/fr.md, en.md, …
  loader: glob({ base: './src/content/landing', pattern: '**/*.md' }),
  schema: z.object({
    /** Page <title> + og:title. */
    title: z.string(),
    /** Meta description + og:description. */
    description: z.string(),
    /** Hero h1 — visible above the fold. */
    heroHeadline: z.string(),
    /** Short eyebrow text shown above the hero headline. */
    heroEyebrow: z.string().optional(),
    /** Hero CTA button label. */
    heroCtaLabel: z.string(),
  }),
});

export const collections = { landing };
