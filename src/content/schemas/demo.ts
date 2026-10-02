import { z } from 'astro/zod';

const texte = z.string().min(1);

/**
 * Each agent demo plays on a device mock-up (DemoEcran.astro): Owl's voice app on an iPad
 * (`tablette`), a WhatsApp chat on an iPhone (`telephone`), Hatch's training web app on an iPhone
 * (`formation`), or a head-office dashboard on an iPad (`tableau`). Beats are derived from the copy
 * in src/components/sections/demo-ecran.ts.
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
  /**
   * The procedure, as the UI Owl generates to explain it: each step carries a small visual (a
   * keypad being typed on, a cash count, a receipt printing) chosen by `visuel`.
   */
  etapes: z
    .array(
      z.discriminatedUnion('visuel', [
        z.strictObject({ visuel: z.literal('code'), texte, libelle: texte }),
        z.strictObject({
          visuel: z.literal('caisse'),
          texte,
          libelle: texte,
          /** Banknotes counted, in euros; the total is their sum. */
          billets: z.array(z.number().int().positive()).min(1).max(6),
        }),
        z.strictObject({
          visuel: z.literal('ticket'),
          texte,
          bouton: texte,
          lignes: z.array(texte).min(1).max(4),
        }),
      ]),
    )
    .min(2)
    .max(4),
  /** Step counter, with `{n}` (current step) and `{total}`. */
  compteur: texte.refine((c) => c.includes('{n}') && c.includes('{total}'), {
    message: '`compteur` needs {n} and {total}',
  }),
  /** Caption of the audio pill: the answer is also spoken out loud. */
  pied: texte,
});
/** Notification next to the phone, what head office sees at the end. */
const suivi = z.strictObject({ app: texte, quand: texte, titre: texte, texte: texte });

const ecranTelephone = z.strictObject({
  appareil: z.literal('telephone'),
  heure,
  contact: texte,
  statut: texte,
  /** Header status while the agent types, date chip above the thread, input placeholder. */
  ecrit: texte,
  jour: texte,
  saisie: texte,
  /**
   * Conversation, in order: messages and a document the agent sends. `equipe` is the phone's owner
   * (right), `agent` the agent (left).
   */
  fil: z
    .array(
      z.union([
        z.strictObject({ de: z.enum(['agent', 'equipe']), texte: texte }),
        z.strictObject({ document: z.strictObject({ titre: texte, meta: texte }) }),
      ]),
    )
    .min(2),
  suivi,
});

/**
 * Hatch's training web app on an iPhone (Pecker, César 02/10: "the person reads something, answers
 * a few questions and passes the training, that's all"): a short reading page, the quiz questions
 * one page each, then the "passed" screen.
 */
const ecranFormation = z.strictObject({
  appareil: z.literal('formation'),
  heure,
  /** Eyebrow of the reader's header: "Chapitre 1 · Ouverture du restaurant". */
  chapitre: texte,
  /** Page counter, with `{n}` (current page) and `{total}`. */
  compteur: texte.refine((c) => c.includes('{n}') && c.includes('{total}'), {
    message: '`compteur` needs {n} and {total}',
  }),
  /** The reading page: a title, a few short lines, and the key point to remember. */
  lecture: z.strictObject({
    titre: texte,
    lignes: z.array(texte).min(1).max(3),
    retenir: z.strictObject({ libelle: texte, texte }),
  }),
  questions: z
    .array(
      z
        .strictObject({
          question: texte,
          options: z.array(texte).min(2).max(4),
          /** Index of the right option. */
          bonne: z.number().int().min(0),
          /** One line under "Bonne réponse" once it is picked. */
          retour: texte,
        })
        .refine((q) => q.bonne < q.options.length, {
          message: '`bonne` is past the last option',
        }),
    )
    .min(1)
    .max(3),
  /** Label of the feedback box. */
  bonneReponse: texte,
  /** The bottom bar's button: next page, then on the last question, pass the training. */
  continuer: texte,
  valider: texte,
  /** The closing screen. */
  fin: z.strictObject({ titre: texte, texte }),
  suivi,
});

/** A number that counts up on screen, with what it counts. */
const chiffre = z.strictObject({ valeur: z.number().int().min(0), libelle: texte });

/**
 * Head-office dashboard on an iPad: the agent posts a line, then the UI it generates resolves,
 * block by block. Each block type has its own visual and gesture (demo-motion.ts).
 */
const ecranTableau = z.strictObject({
  appareil: z.literal('tableau'),
  heure,
  /** "Lark · Point du matin": app name, then the view. */
  entete: texte,
  statut: texte,
  /** Optional request someone at head office sends the agent first (who, what). */
  demande: z.strictObject({ qui: texte, texte }).optional(),
  /** The agent's line above the generated card. */
  intro: texte,
  titre: texte,
  source: texte,
  blocs: z
    .array(
      z.discriminatedUnion('type', [
        /** Key figures counting up. */
        z.strictObject({ type: z.literal('chiffres'), items: z.array(chiffre).min(2).max(3) }),
        /** Something to act on, with its button. */
        z.strictObject({ type: z.literal('alerte'), texte, bouton: texte }),
        /**
         * A manual sheet edited like a document: line `modifiee` is deleted and retyped as `apres`,
         * a note on the change is typed under it, then the new version is published.
         */
        z
          .strictObject({
            type: z.literal('edition'),
            version: z.strictObject({ avant: texte, apres: texte }),
            /** Status of the sheet while it is edited, then once published. */
            etat: z.strictObject({ enCours: texte, publiee: texte }),
            lignes: z.array(texte).min(2).max(4),
            modifiee: z.number().int().min(0),
            apres: texte,
            note: texte,
          })
          .refine((e) => e.modifiee < e.lignes.length, {
            message: '`modifiee` is past the last line',
          }),
        /** A score out of a maximum, with its gauge. */
        z.strictObject({
          type: z.literal('score'),
          valeur: z.number().int().min(0),
          sur: z.number().int().min(1),
          libelle: texte,
        }),
        /** The agent thinks, then writes an action plan, one action per gap found. */
        z.strictObject({
          type: z.literal('plan'),
          reflexion: texte,
          titre: texte,
          actions: z
            .array(z.strictObject({ ecart: texte, action: texte, echeance: texte }))
            .min(1)
            .max(3),
        }),
      ]),
    )
    .min(1)
    .max(3),
});

/**
 * An agent demo inside a place. `cle` ties it to its cut-out and camera in Demo.astro; Sparrow
 * has two (candidates, openings). `cle` ties it to its marker and camera in
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
  nom: texte,
  /** What the agent does here, in a few words. */
  role: texte,
  /** What its demo shows, one sentence. */
  titre: texte,
  ecran: z.discriminatedUnion('appareil', [
    ecranTablette,
    ecranTelephone,
    ecranFormation,
    ecranTableau,
  ]),
});

const lieu = z.strictObject({
  surtitre: texte,
  agents: z.array(demoAgent).min(1),
});

export const schema = z.strictObject({
  titre: texte,
  lieux: z.array(lieu).length(3),
});

export type EcranTablette = z.infer<typeof ecranTablette>;
export type EcranTelephone = z.infer<typeof ecranTelephone>;
export type EcranFormation = z.infer<typeof ecranFormation>;
export type EcranTableau = z.infer<typeof ecranTableau>;
