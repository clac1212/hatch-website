import { z } from 'astro/zod';

/** Copy of the "demo" home section (src/content/sections/demo/{fr,en}.yaml). Placeholder until the section is built. */
export const schema = z.strictObject({
  todo: z.boolean(),
});
