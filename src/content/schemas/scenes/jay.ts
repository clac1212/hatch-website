import { z } from 'astro/zod';

const texte = z.string().min(1);
const ligne = <T extends [string, ...string[]]>(tons: T) =>
  z.strictObject({ texte, etat: texte, ton: z.enum(tons) });

/**
 * Jay's "Exemple d'usage" scene (src/components/agents/scenes/Jay.astro, César 11/10): each step
 * shows the device of whoever acts. Head office's Hatch OS window connects Google Drive, picks the
 * "Manuel opératoire" folder and Jay indexes it; that evening a Lille Centre crew member asks Peep
 * on WhatsApp and gets the steps with the source sheet; Claire edits the sheet in Drive, and at
 * the night's resync Jay swaps the version the agents answer from.
 */
export const schema = z.strictObject({
  agent: z.literal('jay'),
  siege: z.strictObject({
    app: texte,
    contexte: texte,
    titre: texte,
    /** The first one is Google Drive, the one head office connects. */
    connecteurs: z
      .array(
        z.strictObject({
          nom: texte,
          icone: texte,
          ton: z.enum(['vert', 'noir', 'jaune', 'bleu']),
        }),
      )
      .length(4),
    connecter: texte,
    connecte: texte,
    choix: z.strictObject({
      titre: texte,
      dossiers: z.array(z.strictObject({ nom: texte, meta: texte })).length(3),
      /** Index of the folder picked. */
      choisi: z.int().min(0).max(2),
    }),
    index: z.strictObject({
      libelle: texte,
      dossier: texte,
      total: z.int().min(1),
      unite: texte,
      lignes: z.array(ligne(['vert', 'gris'])).length(3),
      fin: texte,
      nuit: texte,
    }),
  }),
  telephone: z.strictObject({
    heure: texte,
    contact: texte,
    statut: texte,
    ecrit: texte,
    jour: texte,
    question: texte,
    placeholder: texte,
    reponse: z.strictObject({
      intro: texte,
      etapes: z.array(texte).length(4),
      source: z.strictObject({ libelle: texte, titre: texte, meta: texte }),
      signature: texte,
    }),
  }),
  drive: z.strictObject({
    fichier: texte,
    chemin: texte,
    enregistre: texte,
    auteur: texte,
    titre: texte,
    etapes: z.array(texte).length(4),
    /** The line Claire types, under the step at index `sous`. */
    ajout: texte,
    sous: z.int().min(0).max(3),
    /** The time jump to the night's resync. */
    nuit: texte,
    synchro: z.strictObject({
      libelle: texte,
      titre: texte,
      lignes: z.array(ligne(['vert', 'gris', 'bleu'])).length(3),
    }),
  }),
});
