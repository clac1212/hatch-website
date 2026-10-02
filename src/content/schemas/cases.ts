import { z } from 'astro/zod';
import { agentSlugs } from './agents';

const texte = z.string().min(1);

/** People who sign a customer case (name and role in src/content/pages/casePage). */
export const caseAuthors = ['patrick', 'cesar', 'sebastien'] as const;

/**
 * A customer case page (`/clients/<id>`), one YAML file per case and per locale
 * (`src/content/cases/<locale>/<id>.yaml`, `<id>` one of `caseIds` in ./cas.ts, which ties it to its
 * brand colour, logo and storefront). The most citable page of the site (SEO brief): before/after
 * figures, the customer's quote, a date and an author. Name and figures need the customer's written
 * consent; until then, placeholders like `[X]` and `brouillon: true`.
 */
export const schema = z.strictObject({
  brouillon: z.boolean(),
  published: z.iso.date(),
  updated: z.iso.date(),
  /** Who signs it; `null` until decided (no byline is rendered). */
  author: z.enum(caseAuthors).nullable(),
  seo: z.strictObject({ title: texte.max(60), description: texte.min(120).max(160) }),
  client: texte,
  /** Alt text of the storefront illustration. */
  visualAlt: texte,
  /** H1: a fact about what changed. */
  title: texte,
  /** First sentence: who, which problem, which result. */
  lead: texte,
  /** Agents deployed in this network (the first one is the case's badge). */
  agents: z.array(z.enum(agentSlugs)).min(1).max(3),
  /** Before/after figures; every figure carries its source. `before: null` = no "before" value. */
  figures: z
    .array(
      z.strictObject({
        label: texte,
        before: texte.nullable(),
        after: texte,
        source: texte,
      }),
    )
    .min(2)
    .max(4),
  quote: z.strictObject({ text: texte, author: texte }),
  /** The story, in short sections (context, before, what changed). */
  sections: z
    .array(z.strictObject({ title: texte, text: texte }))
    .min(2)
    .max(4),
});
