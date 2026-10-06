import type { SchemaContext } from 'astro:content';
import { z } from 'astro/zod';

/**
 * Copy of the secondary pages (`src/content/pages/<page>/{fr,en}.yaml`). Strict objects, so a key
 * missing or added in one locale fails the build and FR/EN stay in sync.
 */
const seo = z.strictObject({ title: z.string(), description: z.string() });

/** /demo — booking page with the inline Cal.com agenda. */
export const demoPage = z.strictObject({
  seo,
  kicker: z.string(),
  title: z.string(),
  titleAccent: z.string(),
  lead: z.string(),
  points: z.array(z.string()).min(2).max(3),
  agendaTitle: z.string(),
  agendaHint: z.string(),
  /** Shown inside the agenda frame until Cal.com has loaded (and when JS is off). */
  agendaFallback: z.string(),
  agendaFallbackLink: z.string(),
});

/**
 * /securite (César 01/10): the content of the current site (v1), four themes of three points each,
 * in the v2 design — voxel agents in the hero, access control shown on an iPad (who sees what in the
 * BunBun network), one call to action. Every claim must be true of Hatch OS: hosting is in Europe.
 */
const accessState = z.enum(['visible', 'perimetre', 'masque']);
const item = z.strictObject({ title: z.string(), text: z.string() });
export const securityPage = z.strictObject({
  seo,
  hero: z.strictObject({
    kicker: z.string(),
    title: z.string(),
    lead: z.string(),
    /** Key promises, each a link down to the theme that backs it (`section`: its index). */
    proofs: z
      .array(z.strictObject({ label: z.string(), section: z.number().int().min(0).max(3) }))
      .min(2)
      .max(4),
    /** Alt texts of the three agents (Jay: servers and EU flag, Owl: safe, Finch: stamp). */
    alts: z.strictObject({ jay: z.string(), owl: z.string(), finch: z.string() }),
  }),
  sections: z
    .array(
      z.strictObject({
        /** Function of the theme, also the hero's anchor to it. */
        kicker: z.string(),
        title: z.string(),
        subtitle: z.string(),
        items: z.array(item).length(3),
        /** Shown by: an agent (its image, alt from `hero.alts`), or the access screen (iPad). */
        visual: z.enum(['jay', 'owl', 'finch', 'ecran']),
      }),
    )
    .length(4),
  /** The iPad screen: one view per role, each row visible, limited to the role's scope, or hidden. */
  screen: z.strictObject({
    app: z.string(),
    viewing: z.string(),
    roles: z.array(z.string()).length(3),
    states: z.strictObject({
      visible: z.string(),
      perimetre: z.string(),
      masque: z.string(),
      nonPartage: z.string(),
    }),
    rows: z
      .array(
        z.strictObject({
          label: z.string(),
          meta: z.string(),
          /** One state per role; absent = the source is not shared with Hatch at all. */
          access: z.array(accessState).length(3).optional(),
        }),
      )
      .min(3)
      .max(5),
  }),
  contact: z.strictObject({ title: z.string(), text: z.string() }),
});

/**
 * One Sans Filtre edition = one Markdown file (`src/content/sans-filtre/2026-07.md`) holding both
 * locales. Images are paths relative to the file (`../../assets/sans-filtre/…`); `video` is a file
 * name in `src/assets/sans-filtre/`.
 */
const sfAgent = z.enum(['peep', 'jay', 'sparrow', 'finch', 'pecker']);

export const sansFiltreEdition = ({ image }: SchemaContext) => {
  const update = z.strictObject({
    title: z.string(),
    desc: z.string(),
    shippedBy: z.string(),
    date: z.string(),
    agent: sfAgent.optional(),
    image: image().optional(),
    video: z.string().optional(),
    logo: image().optional(),
    emojis: z.array(z.string()).max(6).optional(),
    /** Showcase layout: big media on top, text centred below. */
    highlight: z.boolean().optional(),
  });
  const edition = z.strictObject({
    month: z.string(),
    dateline: z.string(),
    issueTitle: z.string(),
    /** Meta description of the edition page: 120 to 160 characters, full sentences. */
    description: z.string(),
    intro: z.string(),
    signature: z.string(),
    featured: z.strictObject({
      eyebrow: z.string(),
      title: z.string(),
      body: z.array(z.string()),
      shippedBy: z.string(),
      date: z.string(),
      agent: sfAgent.optional(),
      image: image().optional(),
    }),
    updates: z.array(update),
    horsDesClousTitle: z.string(),
    horsDesClousHeading: z.string(),
    horsDesClous: z.array(z.string()),
    horsDesClousMotto: z.string(),
    ctaTitle: z.string(),
    ctaText: z.string(),
    ctaBtn: z.string(),
  });
  return z.strictObject({
    edition: z.string().regex(/^\d{3}$/),
    updatesCount: z.string().regex(/^\d{3}$/),
    /** ISO date, drives the order (newest first). */
    date: z.iso.date(),
    location: z.string(),
    fr: edition,
    en: edition,
  });
};

/** /sans-filtre — page chrome of the monthly changelog (the editions live in src/content/sans-filtre). */
export const sansFiltrePage = z.strictObject({
  seo,
  /** Suffix of an edition page's <title>: "<month> · <titleSuffix>". */
  titleSuffix: z.string(),
  homeLabel: z.string(),
  monthly: z.string(),
  tag: z.string(),
  sub: z.string(),
  subEnd: z.string(),
  editionLabel: z.string(),
  updatesLabel: z.string(),
  featured: z.string(),
  online: z.string(),
  agentRole: z.string(),
  shippedBy: z.string(),
  more: z.string(),
  pastTitle: z.string(),
  pastHint: z.string(),
  authorRoles: z.record(z.string(), z.string()),
  /** Opening and closing quote marks of the "Hors des clous" motto. */
  quotes: z.tuple([z.string(), z.string()]),
});

/**
 * Chrome of the agent pages (`/agents/<slug>`, src/views/AgentPage.astro): section labels shared by
 * the seven agents. `{name}` is replaced by the agent's name, `{client}` by a customer's, `{date}` by
 * the formatted date.
 */
const kickerTitle = z.strictObject({ kicker: z.string(), title: z.string() });
export const agentPage = z.strictObject({
  breadcrumb: z.strictObject({ label: z.string(), home: z.string(), agents: z.string() }),
  problem: z.strictObject({ kicker: z.string(), answer: z.string() }),
  actions: z.strictObject({ kicker: z.string() }),
  scenario: z.strictObject({ kicker: z.string() }),
  tools: kickerTitle,
  faq: kickerTitle,
  related: kickerTitle,
  allCases: z.string(),
  cta: z.strictObject({ title: z.string(), text: z.string() }),
  updated: z.string(),
});
