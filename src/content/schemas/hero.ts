import { z } from 'astro/zod';

/**
 * Copy of the hero (src/content/sections/hero/{fr,en}.yaml).
 * `title` is split into the lines of the desktop layout (joined into one paragraph on mobile).
 * `tasks` feeds the animated task cards of the map: one tuple per scene, in loop order, with exactly
 * as many cards as the animation plays (timings and positions live in Hero.astro).
 */
export const schema = z.strictObject({
  title: z.array(z.string().min(1)).min(1),
  lead: z.string().min(1),
  tasks: z.strictObject({
    status: z.strictObject({ running: z.string().min(1), done: z.string().min(1) }),
    lyon: z.tuple([z.string().min(1), z.string().min(1)]),
    headOffice: z.tuple([z.string().min(1), z.string().min(1)]),
    marseille: z.tuple([z.string().min(1), z.string().min(1)]),
    barcelona: z.tuple([z.string().min(1)]),
  }),
});
