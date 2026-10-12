import { z } from 'astro/zod';

const texte = z.string().min(1);
const message = z.strictObject({ texte, heure: texte });

/**
 * Sparrow's "Exemple d'usage" scene (src/components/agents/scenes/Sparrow.astro, César 11/10): each
 * step shows the device of whoever acts. Thomas's iPhone scans the stand's QR code and the
 * pre-filled WhatsApp message goes; the same phone answers Sparrow's questions and sends his proof
 * of capital; Marc's Hatch OS window sees Thomas's card move to "Qualifié" and opens his file;
 * Thomas's iPad shows his opening project, its back-schedule and his first tasks ticked.
 */
export const schema = z.strictObject({
  agent: z.literal('sparrow'),
  salon: z.strictObject({
    /** The camera's modes, the middle one (photo) active. */
    modes: z.array(texte).length(3),
    panneau: texte,
    banniere: z.strictObject({ app: texte, texte }),
  }),
  whatsapp: z.strictObject({
    contact: texte,
    statut: texte,
    jour: texte,
    champ: texte,
    premier: message,
    accueil: message,
    question: message,
    reponse: message,
    /** Sparrow's recap of the checks, ticked one by one. */
    recap: z.strictObject({
      titre: texte,
      lignes: z.array(z.strictObject({ texte, etat: texte })).length(3),
      heure: texte,
    }),
    pieces: message,
    document: z.strictObject({ nom: texte, meta: texte, heure: texte }),
  }),
  pipeline: z.strictObject({
    app: texte,
    contexte: texte,
    titre: texte,
    agent: texte,
    /** Three stages; Thomas's card leaves the first for the second (their totals are the final ones). */
    colonnes: z
      .array(
        z.strictObject({
          nom: texte,
          total: z.int().min(1),
          cartes: z.array(z.strictObject({ nom: texte, ville: texte })).max(2),
        }),
      )
      .length(3),
    candidat: z.strictObject({ nom: texte, ville: texte, badge: texte, note: texte }),
    dossier: z.strictObject({
      libelle: texte,
      titre: texte,
      statut: texte,
      lignes: z
        .array(
          z.strictObject({
            texte,
            etat: texte,
            /** Asked for but not received yet: shown in amber, not in green. */
            attente: z.literal(true).optional(),
          }),
        )
        .min(3)
        .max(5),
      piece: texte,
      bouton: texte,
    }),
  }),
  espace: z.strictObject({
    invitation: z.strictObject({ app: texte, quand: texte, titre: texte, texte }),
    marque: texte,
    bonjour: texte,
    projet: texte,
    date: texte,
    modele: texte,
    mois: z.array(texte).min(4).max(6),
    /** The back-schedule's phases, as % of the timeline. */
    phases: z
      .array(
        z.strictObject({
          texte,
          debut: z.number().min(0).max(100),
          fin: z.number().min(0).max(100),
          etat: z.enum(['en-cours', 'a-venir', 'jalon']),
        }),
      )
      .min(3)
      .max(5),
    etapes: z.strictObject({
      titre: texte,
      compte: texte,
      taches: z
        .array(z.strictObject({ texte, etat: texte, faite: z.boolean() }))
        .min(3)
        .max(4),
    }),
    recalcul: texte,
  }),
});
