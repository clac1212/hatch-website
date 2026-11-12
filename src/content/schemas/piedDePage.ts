import { z } from 'astro/zod';
import { agentSlugs } from './agents';

/**
 * Copy of the site-wide footer (src/content/sections/piedDePage/{fr,en}.yaml), v4 node DbMpt.
 * The "Produit" / "Hatch" column titles, the product links and the language switch reuse the
 * short strings of src/i18n/ui.ts (same labels as the nav).
 */
const scene = z.strictObject({
  alt: z.string(),
  titre: z.string(),
  liste: z
    .array(z.strictObject({ repere: z.string(), texte: z.string(), href: z.string() }))
    .min(1),
});

export const schema = z.strictObject({
  signature: z.string(),
  cta: z.string(),
  agents: z.strictObject({
    titre: z.string(),
    /**
     * One resident per floor of the voxel building, top to bottom: its job, and either a network
     * agent (its page) or a resident outside the agents collection, named and linked directly
     * (Robin, the independents' cofounder).
     */
    residents: z
      .array(
        z.union([
          z.strictObject({ etage: z.string(), metier: z.string(), agent: z.enum(agentSlugs) }),
          z.strictObject({
            etage: z.string(),
            metier: z.string(),
            nom: z.string(),
            lien: z.string(),
          }),
        ]),
      )
      .length(8),
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
  /** A page's own footer scene (network: the open space; Robin: the Rungis market), in place of the building. */
  scenes: z.strictObject({
    reseaux: scene,
    robin: scene,
    /** The resources pages: the image alone (pared-down footer, no list beside it). */
    ressources: z.strictObject({ alt: z.string().min(1) }),
  }),
});
