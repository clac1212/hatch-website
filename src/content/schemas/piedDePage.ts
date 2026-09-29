import { z } from 'astro/zod';

/** Copy of the site-wide footer (src/content/sections/piedDePage/{fr,en}.yaml). Placeholder until the footer is built. */
export const schema = z.strictObject({
  todo: z.boolean(),
});
