import { z } from 'astro/zod';

/** Agent birds available as avatars in the mockup windows (src/assets/miseEnPlace/<bird>.png). */
const bird = z.enum(['sparrow', 'jay', 'owl']);

/**
 * Copy of the "Mise en place" home section (src/content/sections/miseEnPlace/{fr,en}.yaml):
 * a pinned track with three app windows — connect the sources, agents set themselves up, teams use them.
 */
export const schema = z.strictObject({
  title: z.string(),
  /** Step labels, shown in the step indicator (pinned) or above each window (stacked). */
  steps: z.array(z.string()).length(3),
  /** Decorative "Continue" button of the first two windows. */
  next: z.string(),

  sources: z.strictObject({
    title: z.string(),
    search: z.string(),
    documents: z.strictObject({
      label: z.string(),
      connected: z.string(),
      connect: z.string(),
      items: z
        .array(
          z.strictObject({
            name: z.string(),
            logo: z.enum(['google-drive', 'notion', 'word', 'pdf', 'excel', 'onedrive']),
            /** Connected sources light up one by one; the others stay at "Connect". */
            connected: z.boolean(),
          }),
        )
        .min(1),
    }),
    tools: z.strictObject({
      label: z.string(),
      state: z.string(),
      items: z
        .array(
          z.strictObject({
            name: z.string(),
            icon: z.enum(['euro', 'calendar', 'shield', 'users']),
          }),
        )
        .min(1),
    }),
    /** Ready-sources counter; `{n}` is replaced by the count, picked with Intl.PluralRules. */
    counter: z.strictObject({ one: z.string(), other: z.string() }),
  }),

  agents: z.strictObject({
    title: z.string(),
    conversation: z.strictObject({
      label: z.string(),
      messages: z
        .array(
          z.discriminatedUnion('from', [
            z.strictObject({ from: z.literal('agent'), bird, text: z.string() }),
            z.strictObject({ from: z.literal('you'), text: z.string() }),
          ]),
        )
        .min(1),
    }),
    migration: z.strictObject({
      label: z.string(),
      rows: z
        .array(
          z.strictObject({
            name: z.string(),
            bird,
            done: z.int().min(0),
            total: z.int().min(1),
          }),
        )
        .min(1),
    }),
    footer: z.string(),
  }),

  channels: z.strictObject({
    title: z.string(),
    label: z.string(),
    active: z.string(),
    items: z
      .array(
        z.strictObject({
          name: z.string(),
          icon: z.enum(['whatsapp', 'mail', 'tablet']),
        }),
      )
      .length(3),
    thread: z.strictObject({
      label: z.string(),
      question: z.strictObject({ initials: z.string(), who: z.string(), text: z.string() }),
      answer: z.strictObject({ who: z.string(), bird, text: z.string() }),
    }),
    footer: z.string(),
  }),
});
