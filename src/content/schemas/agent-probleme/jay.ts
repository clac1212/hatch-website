import { z } from 'astro/zod';

const texte = z.string().min(1);

/**
 * The objects of Jay's problem (src/components/agents/probleme/Jay.astro): the 120-page operations
 * manual open on its cover; the Drive folder holding four versions of the same opening sheet, with
 * its file count; a crew member asking which one is the right one.
 */
export const schema = z.strictObject({
  agent: z.literal('jay'),
  manuel: z.strictObject({
    fichier: texte,
    page: texte,
    reseau: texte,
    titre: texte,
    edition: texte,
  }),
  dossier: z.strictObject({
    chemin: z.array(texte).min(2).max(3),
    colonnes: z.strictObject({ nom: texte, proprietaire: texte, modifie: texte }),
    fichiers: z
      .array(
        z.strictObject({
          nom: texte,
          type: z.enum(['doc', 'pdf']),
          proprietaire: texte,
          modifie: texte,
        }),
      )
      .min(3)
      .max(5),
    compteur: texte,
  }),
  message: z.strictObject({
    groupe: texte,
    membres: texte,
    de: texte,
    texte: texte,
    heure: texte,
  }),
});
