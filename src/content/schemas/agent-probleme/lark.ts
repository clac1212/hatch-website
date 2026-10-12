import { z } from 'astro/zod';

const texte = z.string().min(1);
const colonne = z.enum(['restaurant', 'date', 'score', 'actions']);

/**
 * The objects of Lark's problem (src/components/agents/probleme/Lark.astro): the audits
 * spreadsheet with cells highlighted by hand and a score never filled in, the WhatsApp group
 * where only some franchisees answered, the franchise candidates tool, and the network
 * director's sticky note that cross-checks the three by hand (the last beat).
 */
export const schema = z.strictObject({
  agent: z.literal('lark'),
  tableur: z.strictObject({
    fichier: texte,
    feuilles: z.array(texte).min(2).max(3),
    colonnes: z.strictObject({
      restaurant: texte,
      date: texte,
      score: texte,
      actions: texte,
    }),
    lignes: z
      .array(
        z.strictObject({
          restaurant: texte,
          date: texte,
          /** Absent: the cell nobody filled in. */
          score: texte.optional(),
          actions: texte,
          /** The cells someone highlighted by hand. */
          surligne: z.array(colonne).optional(),
        }),
      )
      .min(3)
      .max(5),
  }),
  whatsapp: z.strictObject({
    groupe: texte,
    membres: texte,
    message: z.strictObject({ texte, heure: texte }),
    reaction: texte,
    reponses: z
      .array(z.strictObject({ de: texte, texte, heure: texte }))
      .min(1)
      .max(2),
  }),
  /** The franchise candidates tool (not crew hiring): name, city, file status. */
  candidats: z.strictObject({
    app: texte,
    recherche: texte,
    titre: texte,
    colonnes: z.strictObject({ candidat: texte, statut: texte }),
    lignes: z
      .array(
        z.strictObject({
          nom: texte,
          ville: texte,
          statut: texte,
          depuis: texte,
        }),
      )
      .min(2)
      .max(3),
  }),
  postit: z.array(texte).min(2).max(4),
});
