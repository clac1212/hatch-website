import { z } from 'astro/zod';

/** Copy of the "hero" home section (src/content/sections/hero/{fr,en}.yaml). Placeholder until the section is built. */
export const schema = z.strictObject({
  todo: z.boolean(),
});
