import { z } from 'astro/zod';

/**
 * Copy of the "equipe" home section (src/content/sections/equipe/{fr,en}.yaml).
 * The tiles themselves (name, job, order, page) come from the `agents` collection.
 */
export const schema = z.strictObject({
  title: z.string(),
  lead: z.string(),
});
