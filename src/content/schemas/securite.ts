import { z } from 'astro/zod';

/** Copy of the "Sécurité" home band (src/content/sections/securite/{fr,en}.yaml), v4 node P9SBbe. */
export const schema = z.strictObject({
  titre: z.string(),
  lien: z.string(),
  /** The three guarantees, in display order: Europe hosting, GDPR, no AI training. */
  garanties: z.tuple([
    z.strictObject({ titre: z.string(), alt: z.string() }),
    z.strictObject({ titre: z.string(), alt: z.string() }),
    z.strictObject({ titre: z.string(), alt: z.string() }),
  ]),
});
