import { z } from 'astro/zod';

/** Case ids: each maps to its brand colour, storefront and logos in Cas.astro (src/assets/). */
export const caseIds = ['la-meulerie', 'nobinobi', 'pny'] as const;
export type CaseId = (typeof caseIds)[number];

/** Agents that can front a case; the badge shows the agent's voxel and its name from the `agents` collection. */
export const caseAgents = ['jay', 'peep', 'owl'] as const;

/** Copy of the "cas" home section (src/content/sections/cas/{fr,en}.yaml). */
export const schema = z.strictObject({
  title: z.string(),
  /** Accessible name of the shelf region. */
  label: z.string(),
  /** Badge prefix: "Avec" + agent name. */
  with: z.string(),
  readCase: z.string(),
  /** Unit under the site count of a closed slice ("12 sites"). */
  sites: z.string(),
  /** Label of a closed slice's button, `{client}` is replaced. */
  open: z.string(),
  /** Display order = shelf order; the first case is open first. */
  cases: z
    .array(
      z.strictObject({
        id: z.enum(caseIds),
        client: z.string(),
        agent: z.enum(caseAgents),
        /** Alt text of the storefront illustration. */
        visualAlt: z.string(),
        /** Customer quote, and who says it, from the customer interview (wording validated by the customer). */
        quote: z.string(),
        author: z.string(),
        /** Two key figures; the first one's value is the site count shown on the closed slice. Placeholders like `[X]` are allowed until the figures are confirmed. */
        figures: z.array(z.strictObject({ value: z.string(), label: z.string() })).length(2),
        /** Case study page, `null` while it doesn't exist (the "read the case" link is then not rendered). */
        href: z.string().startsWith('/').nullable(),
      }),
    )
    .min(1),
});
