import { z } from 'astro/zod';

/** Copy of the "clients" home section (src/content/sections/clients/{fr,en}.yaml). Placeholder until the section is built. */
export const schema = z.strictObject({
  todo: z.boolean(),
});
