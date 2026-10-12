import { z } from 'astro/zod';

/** The seven agents (file names of `src/content/agents/<locale>/<slug>.md`). */
export const agentSlugs = ['peep', 'owl', 'lark', 'jay', 'finch', 'pecker', 'sparrow'] as const;
export type AgentSlug = (typeof agentSlugs)[number];

const texte = z.string().min(1);
/** A line where `**…**` marks the bold lead-in, as written in the copy (rendered by `richText`). */
const riche = texte.refine((s) => (s.match(/\*\*/g) ?? []).length % 2 === 0, {
  message: 'Unbalanced ** in a rich line',
});
/** A Lucide icon, by its file name in @lucide/astro (`mail`, `message-circle`…), see Icone.astro. */
const icone = z.string().regex(/^[a-z0-9-]+$/);
/** Status colour of a row or a chip in the product mock-ups. */
export const tonStatut = z.enum(['vert', 'orange', 'rouge', 'gris', 'bleu']);

/**
 * "Exemple d'usage" (Exemple.astro): Patrick's example cut into steps; beside them, a Hatch OS
 * window where each step shows a request (who, what) and the agent's answer card (BunBun, the
 * fictional demo network).
 */
const carte = z.strictObject({
  /** Orange label at the top of the card, with its icon (none when the card opens on a banner). */
  icone: icone.optional(),
  libelle: texte.optional(),
  /** Large line under the label (a score, a sheet title…). */
  titre: texte.optional(),
  /** A coloured banner (an announcement's visual), then its text. */
  banniere: texte.optional(),
  texte: texte.optional(),
  lignes: z
    .array(z.strictObject({ texte, etat: texte, ton: tonStatut }))
    .max(4)
    .default([]),
  pastilles: z
    .array(z.strictObject({ texte, icone, sombre: z.boolean() }))
    .max(3)
    .default([]),
  /** Buttons under the card: a secondary one, then the primary one. */
  boutons: z.tuple([texte, texte]).optional(),
});
const etape = z.strictObject({
  /** Patrick's words for this step. */
  texte,
  demande: z.strictObject({ qui: texte, texte }),
  carte,
});

/**
 * The agent's dedicated page (`/agents/<slug>`), after the Pencil mock-ups "Page agent — <agent>"
 * (César 10/10). Its copy is Patrick's (Notion "08 · Pages agents · contenus prêts à intégrer"),
 * taken word for word; the feature wall's copy is in src/content/agents-bento/. Section headings
 * are the shared labels of src/content/pages/agent/<locale>.yaml.
 */
const fiche = z.strictObject({
  /** Draft copy: the page is not built, and tiles and cards pointing to it are not links. */
  brouillon: z.boolean(),
  /** Last review of the page: structured data only (`dateModified`), never shown (César 12/10). */
  updated: z.iso.date(),
  seo: z.strictObject({ title: texte.max(80), description: texte.min(120).max(220) }),
  /** H1: the job in the customer's words, not the bird's name. */
  title: texte,
  /** First sentence of the page: who is served, which problem, which result. No unsourced gain. */
  lead: texte,
  /**
   * The problem, landing-page style (César 12/10): a short title naming the pain, one or two
   * concrete sentences. The objects that show it are in src/content/agents-probleme/.
   */
  problem: z.strictObject({ titre: texte, texte }),
  /**
   * What the agent does, Patrick's lines. The feature wall shows them as visuals; these stay in the
   * section for screen readers and search engines.
   */
  actions: z.array(riche).min(3).max(9),
  /** "Vous gardez la main": what the agent does alone, and what you decide. */
  control: z.strictObject({
    agent: z.array(texte).min(1).max(5),
    you: z.array(texte).min(1).max(5),
  }),
  exemple: z.strictObject({
    /** Patrick's opening sentence of the example, when it sets the scene. */
    intro: texte.optional(),
    /** Under the agent's name in the window title bar ("Communications"). */
    contexte: texte,
    etapes: z.array(etape).min(2).max(5),
  }),
  /**
   * "Il travaille avec": cards (a tool's app icon or an agent's render, Patrick's line under it),
   * or, for Lark, Patrick's sentence and the agents it gathers.
   */
  with: z.union([
    z.strictObject({
      cartes: z
        .array(
          z.strictObject({
            titre: texte,
            texte,
            visuel: z.union([
              /** The agents the card names, in its title's order (« Peep et Owl »). */
              z.strictObject({ agents: z.array(z.enum(agentSlugs)).min(1).max(3) }),
              /** A Lucide icon, or `whatsapp` for WhatsApp's own logo. */
              z.strictObject({ icone, ton: z.enum(['whatsapp', 'bleu', 'cuivre']) }),
            ]),
          }),
        )
        .min(2)
        .max(4),
    }),
    z.strictObject({ texte, agents: z.array(z.enum(agentSlugs)).min(2).max(6) }),
  ]),
  faq: z
    .array(z.strictObject({ q: texte, a: texte }))
    .min(3)
    .max(6),
  /** "Pour aller plus loin": the agents to read next, each with Patrick's words for it. */
  related: z
    .array(z.strictObject({ agent: z.enum(agentSlugs), texte }))
    .min(1)
    .max(3),
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
