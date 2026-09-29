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

const card = z.strictObject({ title: z.string(), text: z.string() });
const iconCard = card.extend({
  icon: z.enum(['shield-check', 'lock', 'users', 'file-text', 'key']),
});

/** /securite — mirrors the "Page Sécurité — Hatch" frame of pencil-new.pen. */
export const securityPage = z.strictObject({
  seo,
  hero: z.strictObject({
    kicker: z.string(),
    title: z.string(),
    lead: z.string(),
    badges: z.array(z.string()).length(4),
  }),
  training: z.strictObject({
    kicker: z.string(),
    title: z.string(),
    cards: z.array(iconCard).length(2),
  }),
  sharing: z.strictObject({
    kicker: z.string(),
    title: z.string(),
    text: z.string(),
    items: z.array(z.string()).length(3),
    example: z.strictObject({
      title: z.string(),
      rows: z.array(
        z.strictObject({ source: z.string(), status: z.string(), shared: z.boolean() }),
      ),
    }),
  }),
  access: z.strictObject({
    kicker: z.string(),
    title: z.string(),
    text: z.string(),
    cards: z.array(iconCard).length(3),
  }),
  foundation: z.strictObject({
    kicker: z.string(),
    cards: z.array(card).length(2),
  }),
  cta: z.strictObject({ title: z.string(), label: z.string(), href: z.string() }),
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
