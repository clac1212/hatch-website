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
 * Animated device mock-up (pilot, kitchen, 01/10): the demo plays on a screen instead of a card.
 * Beats are derived from the copy in src/components/sections/demo-ecran.ts.
 */
/** Clock in the device's status bar, e.g. "15:02". */
const heure = z.string().regex(/^\d{1,2}:\d{2}$/);

const ecranTablette = z.strictObject({
  appareil: z.literal('tablette'),
  heure,
  /** Top bar of the tablet app. */
  entete: texte,
  /** Status in the top bar: listening (question), building the answer, reading it out loud. */
  ecoute: texte,
  prepare: texte,
  lit: texte,
  /** Spoken question, shown word by word. */
  question: texte,
  /** Procedure sheet the agent answers with, and where it comes from. */
  fiche: texte,
  source: texte,
  etapes: z.array(texte).min(2).max(4),
  /** Step counter, with `{n}` (current step) and `{total}`. */
  compteur: texte.refine((c) => c.includes('{n}') && c.includes('{total}'), {
    message: '`compteur` needs {n} and {total}',
  }),
  /** Caption of the audio pill: the answer is also spoken out loud. */
  pied: texte,
});
const ecranTelephone = z.strictObject({
  appareil: z.literal('telephone'),
  heure,
  contact: texte,
  statut: texte,
  /** Header status while the agent types, date chip above the thread, input placeholder. */
  ecrit: texte,
  jour: texte,
  saisie: texte,
  /** Conversation, in order: messages and one multiple-choice question. */
  fil: z
    .array(
      z.union([
        z.strictObject({ de: z.enum(['agent', 'equipe']), texte: texte }),
        z.strictObject({
          quiz: z
            .strictObject({
              question: texte,
              /** Hint under the question, as in a WhatsApp poll. */
              aide: texte,
              options: z.array(texte).min(2).max(4),
              /** Index of the right option. */
              bonne: z.number().int().min(0),
            })
            .refine((q) => q.bonne < q.options.length, {
              message: '`bonne` is past the last option',
            }),
        }),
      ]),
    )
    .min(2),
  /** Notification next to the phone, what head office sees at the end. */
  suivi: z.strictObject({ app: texte, quand: texte, titre: texte, texte: texte }),
});

/**
 * An agent demo inside a place, opened on demand. `cle` ties it to its marker and camera in
 * Demo.astro; Sparrow has two (candidates, openings).
 */
const demoAgent = z
  .strictObject({
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
    /** Exactly one: a still card (demo opened on demand) or an animated screen (place in autoplay). */
    carte: carte.optional(),
    ecran: z.discriminatedUnion('appareil', [ecranTablette, ecranTelephone]).optional(),
  })
  .refine((a) => !a.carte !== !a.ecran, { message: 'An agent demo has either `carte` or `ecran`' });

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
  /** Autoplay control of the animated screens. */
  pause: texte,
  lecture: texte,
  lieux: z.array(lieu).length(3),
});

export type EcranTablette = z.infer<typeof ecranTablette>;
export type EcranTelephone = z.infer<typeof ecranTelephone>;
