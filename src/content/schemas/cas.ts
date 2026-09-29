import { z } from 'astro/zod';

/** Case ids: each maps to its storefront, logo and drawn layout in Cas.astro (src/assets/cas/). */
export const caseIds = ['la-meulerie', 'nobinobi', 'pny'] as const;
export type CaseId = (typeof caseIds)[number];

/** Agents that can front a case; the badge shows the agent's voxel and its name from the `agents` collection. */
export const caseAgents = ['jay', 'peep', 'owl'] as const;

/** Copy of the "cas" home section (src/content/sections/cas/{fr,en}.yaml). */
export const schema = z.strictObject({
  kicker: z.string(),
  title: z.string(),
  /** Accessible name of the carousel region. */
  label: z.string(),
  /** Badge prefix: "Avec" + agent name. */
  with: z.string(),
  readCase: z.string(),
  controls: z.strictObject({
    /** `aria-roledescription` of the carousel and of each slide. */
    carousel: z.string(),
    slideRole: z.string(),
    previous: z.string(),
    next: z.string(),
    pause: z.string(),
    play: z.string(),
    /** Slide label, `{n}` and `{total}` are replaced. */
    slide: z.string(),
    /** Dot label, `{client}` is replaced. */
    dot: z.string(),
  }),
  /** Display order = carousel order; the second case is centred first (as in the v4 prototype). */
  cases: z
    .array(
      z.strictObject({
        id: z.enum(caseIds),
        client: z.string(),
        agent: z.enum(caseAgents),
        /** Alt text of the storefront illustration. */
        visualAlt: z.string(),
        /** Two key figures; the second one is highlighted in orange. Placeholders like `[X]` are allowed until the figures are confirmed. */
        figures: z.array(z.strictObject({ value: z.string(), label: z.string() })).length(2),
        /** Case study page, `null` while it doesn't exist (the "read the case" link is then not rendered). */
        href: z.string().startsWith('/').nullable(),
      }),
    )
    .length(3),
});
