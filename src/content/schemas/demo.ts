import { z } from 'astro/zod';

const texte = z.string().min(1);

/** One card: a two-message exchange, or a list of short lines signed by an agent. */
const carte = z.union([
  z.strictObject({
    qui: texte,
    texte: texte,
    reponse: z.strictObject({ qui: texte, texte: texte }),
  }),
  z.strictObject({ lignes: z.array(z.strictObject({ agent: texte, texte: texte })).min(1) }),
]);

/**
 * An agent demo inside a place, opened on demand. `cle` ties it to its marker and camera in
 * Demo.astro; Sparrow has two (candidates, openings).
 */
const demoAgent = z.strictObject({
  cle: z.enum([
    'peep',
    'lark',
    'jay',
    'finch',
    'owl',
    'pecker',
    'sparrow-candidats',
    'sparrow-ouverture',
  ]),
  /** Marker and menu label. */
  nom: texte,
  /** What the agent does here, in a few words (menu line). */
  role: texte,
  titre: texte,
  carte,
});

const lieu = z.strictObject({
  surtitre: texte,
  titre: texte,
  /** Back button label, from an agent demo to the wide shot. */
  retour: texte,
  agents: z.array(demoAgent).min(1),
});

export const schema = z.strictObject({
  titre: texte,
  /** Menu card heading, inviting to pick an agent. */
  consigne: texte,
  lieux: z.array(lieu).length(3),
});
