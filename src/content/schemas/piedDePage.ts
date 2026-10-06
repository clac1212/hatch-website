import { z } from 'astro/zod';

/**
 * Copy of the site-wide footer (src/content/sections/piedDePage/{fr,en}.yaml), v4 node DbMpt.
 * The "Produit" / "Hatch" column titles, the product links and the language switch reuse the
 * short strings of src/i18n/ui.ts (same labels as the nav).
 */
export const schema = z.strictObject({
  signature: z.string(),
  cta: z.string(),
  agents: z.strictObject({
    titre: z.string(),
    /** One resident per floor of the voxel building, top to bottom. */
    residents: z.array(z.strictObject({ etage: z.string(), libelle: z.string() })).length(7),
  }),
  legal: z.strictObject({
    titre: z.string(),
    conditions: z.string(),
    vente: z.string(),
    confidentialite: z.string(),
    mentions: z.string(),
  }),
  /** Printed after the current year. */
  copyright: z.string(),
  mention: z.string(),
  immeubleAlt: z.string(),
});
