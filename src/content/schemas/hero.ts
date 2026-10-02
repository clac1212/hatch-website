import { z } from 'astro/zod';

/**
 * Copy of the hero (src/content/sections/hero/{fr,en}.yaml).
 * `title` is the H1, a short fact in Departure Mono; `tagline` the promise under it, in Fraunces; `lead`
 * the grey text that some layout variants of the hero show under the tagline.
 * `tasks.events` feeds the animation of the map: one event per shop, in loop order (the shops, timings
 * and positions live in Hero.astro, which checks that both lists have the same length). Each state of a
 * card reads outcome first: `title` says which agent does what for which BunBun site, `detail` the
 * concrete request or result.
 */
const line = z.strictObject({ title: z.string().min(1), detail: z.string().min(1) });

export const schema = z.strictObject({
  title: z.string().min(1),
  tagline: z.string().min(1),
  lead: z.string().min(1),
  tasks: z.strictObject({
    status: z.strictObject({ running: z.string().min(1), done: z.string().min(1) }),
    events: z
      .array(
        z.strictObject({
          agent: z.enum(['peep', 'lark', 'jay', 'finch', 'owl', 'pecker', 'sparrow']),
          running: line,
          done: line,
        }),
      )
      .min(1),
  }),
});
