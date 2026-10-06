import { z } from 'astro/zod';

const offre = z.strictObject({
  nom: z.string(),
  /** Team size of the location type. */
  type: z.string(),
  /** Price in euros per location per month, excl. VAT. Both values are validated by César: no computation in code. */
  prix: z.strictObject({ annuel: z.int().positive(), mensuel: z.int().positive() }),
  alt: z.string(),
});

/** Copy of the "Tarifs" home section (src/content/sections/tarifs/{fr,en}.yaml), v4 node sZQeq. */
export const schema = z.strictObject({
  /** Rendered one entry per line on desktop. */
  titre: z.array(z.string()).min(1),
  formule: z.strictObject({
    legende: z.string(),
    mensuel: z.string(),
    annuel: z.string(),
  }),
  /** After the amount, e.g. "/ établissement / mois". */
  unite: z.string(),
  /** Screen-reader-only billing mention read after each amount. */
  factureMensuel: z.string(),
  factureAnnuel: z.string(),
  cta: z.string(),
  /** `nom` may contain a line break (rendered as is). Counter kiosks, dark kitchens, franchises & restaurants (the last one is the highlighted night card). */
  offres: z.tuple([offre, offre, offre]),
  inclus: z.strictObject({
    titre: z.string(),
    agents: z.string(),
    utilisateurs: z.string(),
    canaux: z.string(),
  }),
});
