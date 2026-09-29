import { z } from 'astro/zod';

/** Copy of the "probleme" home section (src/content/sections/probleme/{fr,en}.yaml). Placeholder until the section is built. */
export const schema = z.strictObject({
  todo: z.boolean(),
});
