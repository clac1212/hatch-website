import { z } from 'astro/zod';

/** Copy of the "securite" home section (src/content/sections/securite/{fr,en}.yaml). Placeholder until the section is built. */
export const schema = z.strictObject({
  todo: z.boolean(),
});
