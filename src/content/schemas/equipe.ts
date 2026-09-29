import { z } from 'astro/zod';

/** Copy of the "equipe" home section (src/content/sections/equipe/{fr,en}.yaml). Placeholder until the section is built. */
export const schema = z.strictObject({
  todo: z.boolean(),
});
