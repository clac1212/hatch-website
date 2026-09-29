import { z } from 'astro/zod';

/** Copy of the "miseEnPlace" home section (src/content/sections/miseEnPlace/{fr,en}.yaml). Placeholder until the section is built. */
export const schema = z.strictObject({
  todo: z.boolean(),
});
