import { z } from 'astro/zod';

const texte = z.string().min(1);

/**
 * The objects of Owl's problem (src/components/agents/probleme/Owl.astro): the kitchen binder
 * left in the office, the Drive folder nobody has touched in months, and a crew member's question
 * to the manager on WhatsApp, delivered but never read, then the follow-up.
 */
export const schema = z.strictObject({
  agent: z.literal('owl'),
  classeur: z.strictObject({
    titre: texte,
    sousTitre: texte,
    /** The sheet sticking out of the top of the binder. */
    fiche: texte,
    /** Divider tabs sticking out of the right edge. */
    intercalaires: z.array(texte).min(2).max(4),
    postit: texte,
  }),
  drive: z.strictObject({
    onglet: texte,
    chemin: z.array(texte).min(2).max(3),
    colonnes: z.strictObject({ nom: texte, modifie: texte }),
    /** File names carry their extension: the type chip (PDF, DOCX…) is read from it. */
    fichiers: z
      .array(z.strictObject({ nom: z.string().regex(/\.[a-z]+$/), modifie: texte }))
      .min(2)
      .max(4),
  }),
  whatsapp: z.strictObject({
    contact: texte,
    statut: texte,
    message: texte,
    heure: texte,
    /** The follow-up, the last beat (data-final). */
    relance: texte,
    heureRelance: texte,
  }),
});
