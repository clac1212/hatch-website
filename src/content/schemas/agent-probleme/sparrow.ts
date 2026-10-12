import { z } from 'astro/zod';

const texte = z.string().min(1);

/**
 * The objects of Sparrow's problem (src/components/agents/probleme/Sparrow.astro): an inbox where
 * applications land from the website, a trade show and an ad; the spreadsheet kept by hand
 * (blank cells, « ? », a duplicate, random highlights); a candidate's email with neither project
 * nor capital.
 */
export const schema = z.strictObject({
  agent: z.literal('sparrow'),
  boite: z.strictObject({
    titre: texte,
    nonLus: texte,
    messages: z
      .array(
        z.strictObject({
          de: texte,
          objet: texte,
          heure: texte,
        }),
      )
      .min(3)
      .max(4),
  }),
  tableur: z.strictObject({
    fichier: texte,
    colonnes: z.array(texte).length(5),
    lignes: z
      .array(
        z.strictObject({
          // A blank cell is the point of this sheet, hence plain strings (empty allowed).
          cellules: z.array(z.string()).length(5),
          // Highlight left by hand: the whole row, or one cell when `colonne` is set.
          surligne: z
            .strictObject({
              couleur: z.enum(['jaune', 'rose', 'bleu']),
              colonne: z.number().int().min(0).max(4).optional(),
            })
            .optional(),
        }),
      )
      .min(4)
      .max(6),
    onglets: z.array(texte).min(1).max(3),
  }),
  mail: z.strictObject({
    de: texte,
    objet: texte,
    heure: texte,
    corps: texte,
    signature: texte,
  }),
});
