import { z } from 'astro/zod';

/**
 * Copy of the hero (src/content/sections/hero/{fr,en}.yaml).
 * `title` is a list of fragments joined with spaces; the browser wraps the lines (Fraunces, balanced).
 * `tasks.events` feeds the animation of the map: one event per shop, in loop order (the shops, timings
 * and positions live in Hero.astro, which checks that both lists have the same length).
 */
export const schema = z.strictObject({
  title: z.array(z.string().min(1)).min(1),
  lead: z.string().min(1),
  tasks: z.strictObject({
    status: z.strictObject({ running: z.string().min(1), done: z.string().min(1) }),
    events: z
      .array(
        z.strictObject({
          agent: z.enum(['peep', 'lark', 'jay', 'finch', 'owl', 'pecker', 'sparrow']),
          running: z.string().min(1),
          done: z.string().min(1),
        }),
      )
      .min(1),
  }),
});
