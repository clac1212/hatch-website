import { z } from 'astro/zod';

/** Copy of the "cas" home section (src/content/sections/cas/{fr,en}.yaml). Placeholder until the section is built. */
export const schema = z.strictObject({
  todo: z.boolean(),
});
