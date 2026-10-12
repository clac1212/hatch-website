import { z } from 'astro/zod';
import { agentSlugs } from '../agents';

const texte = z.string().min(1);

/**
 * Lark's "Exemple d'usage" scene (src/components/agents/scenes/Lark.astro, César 11/10): each step
 * shows the device of whoever acts. The network director's Hatch OS window builds its Monday home
 * page, Lark's brief arrives, then the signals of the other agents one by one, and she sends the
 * call list to her phone; her iPhone gets Lark's notification, opens the list, and calls the first
 * franchisee with Lark's note on the call screen.
 */
export const schema = z.strictObject({
  agent: z.literal('lark'),
  accueil: z.strictObject({
    app: texte,
    contexte: texte,
    date: texte,
    bonjour: texte,
    brief: z.strictObject({ agent: texte, libelle: texte, texte }),
    signaux: z
      .array(
        z.strictObject({
          /** The agent that raised the signal (its avatar). */
          agent: z.enum(agentSlugs),
          source: texte,
          titre: texte,
          etat: texte,
          ton: z.enum(['orange', 'rouge', 'vert']),
          details: z.array(texte).max(3),
        }),
      )
      .length(3),
    source: texte,
    bouton: texte,
    envoye: texte,
  }),
  telephone: z.strictObject({
    heure: texte,
    date: texte,
    notif: z.strictObject({ app: texte, quand: texte, titre: texte, texte }),
    liste: z.strictObject({
      titre: texte,
      sous: texte,
      /** Lark's word above the list. */
      message: texte,
      appels: z
        .array(
          z.strictObject({
            nom: texte,
            site: texte,
            motif: texte,
            ton: z.enum(['orange', 'rouge']),
          }),
        )
        .length(4),
      source: texte,
    }),
    appel: z.strictObject({
      nom: texte,
      site: texte,
      sonne: texte,
      /** Seconds on the call timer once the scene has played. */
      secondes: z.int().min(1).max(59),
      commandes: z.array(texte).length(3),
      note: z.strictObject({
        titre: texte,
        texte,
        lignes: z.array(texte).min(1).max(3),
        pied: texte,
      }),
    }),
  }),
});
