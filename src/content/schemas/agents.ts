import { z } from 'astro/zod';
import { demoCles } from './demo';
import { caseIds } from './cas';

/** The seven agents (file names of `src/content/agents/<locale>/<slug>.md`). */
export const agentSlugs = ['peep', 'owl', 'lark', 'jay', 'finch', 'pecker', 'sparrow'] as const;
export type AgentSlug = (typeof agentSlugs)[number];

/** Logos available for a tool chip (files in src/assets/miseEnPlace and src/assets/sans-filtre). */
export const toolLogos = ['whatsapp', 'google-drive', 'notion', 'word', 'pdf', 'excel'] as const;

const texte = z.string().min(1);
const point = z.strictObject({ title: texte, text: texte });

/**
 * The agent's dedicated page (`/agents/<slug>`), following the SEO content brief (Notion "04 · Le
 * contenu"): the job in the customer's words first, then the problem, what the agent does, a
 * customer scenario, the tools, a FAQ, links, and the update date.
 */
const fiche = z.strictObject({
  /** Draft copy (to be reviewed by Patrick): the page is meant to stay out of the index meanwhile. */
  brouillon: z.boolean(),
  /** Last review of the page, shown at its bottom ("Mis à jour le …"). */
  updated: z.iso.date(),
  seo: z.strictObject({ title: texte.max(60), description: texte.min(120).max(160) }),
  /** H1: the job in the customer's words, not the bird's name. */
  title: texte,
  /** First sentence of the page: who is served, which problem, which result. No unsourced gain. */
  lead: texte,
  /**
   * The problem as lived. The request shown beside it is the agent's notification in the home's
   * Problème section (BunBun, the fictional demo network), looked up by agent.
   */
  problem: z.strictObject({ title: texte, text: texte }),
  /** What the agent does, in its own voice; shown beside its diorama demo screen (`demo`). */
  actions: z.strictObject({ title: texte, items: z.array(point).min(3).max(4) }),
  demo: z.enum(demoCles),
  /** A real customer scenario, only with the customer's consent; `null` hides the block. */
  scenario: z
    .strictObject({
      title: texte,
      text: texte,
      /** Customer case page it links to, `null` while there is none. */
      case: z.enum(caseIds).nullable(),
    })
    .nullable(),
  /** Tools it plugs into: only those that really work today. */
  tools: z.strictObject({
    text: texte,
    items: z
      .array(z.strictObject({ name: texte, logo: z.enum(toolLogos).optional() }))
      .min(1)
      .max(10),
  }),
  faq: z
    .array(z.strictObject({ q: texte, a: texte }))
    .min(3)
    .max(5),
  /** Agents that work with this one (cards at the bottom). */
  related: z.array(z.enum(agentSlugs)).min(1).max(3),
});

/**
 * One agent per Markdown file and per locale. `name`, `job`, `pitch` and `order` feed the home
 * (mosaic, Problème, cases); `page` (the agent's own page) is set once its copy exists.
 */
export const schema = z.strictObject({
  name: texte,
  job: texte,
  /** One line in the agent's voice (first person). */
  pitch: texte,
  order: z.int().min(1),
  page: fiche.optional(),
});
