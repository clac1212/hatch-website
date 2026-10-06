import { z } from 'astro/zod';

/** The agents that can answer a notification (ids of `src/content/agents/<locale>/<id>.md`). */
export const agentsProbleme = ['peep', 'owl', 'pecker', 'lark', 'jay', 'finch', 'sparrow'] as const;

/** Apps a notification can come from (icon on the lock screen). */
export const appsProbleme = ['whatsapp', 'appel', 'mail', 'sms'] as const;

/**
 * Copy of the "Problème" home section (src/content/sections/probleme/{fr,en}.yaml): a pinned track
 * where a franchisor's phone fills up with notifications on a Saturday night, then each one is taken
 * over by a Hatch agent.
 */
export const schema = z.strictObject({
  /** Title before the agents step in, one entry per line on desktop. */
  titreAvant: z.array(z.string()).length(3),
  /** Title once the agents have answered (also the section heading without JS). */
  titreApres: z.array(z.string()).length(3),
  /** Growth gauge under the first title: one label per network size. */
  paliers: z.array(z.string()).length(3),
  telephone: z.strictObject({
    operateur: z.string(),
    date: z.string(),
    /** Lock-screen clock, minute by minute: 21:04 → 21:08. */
    horloge: z.array(z.string()).length(5),
    /** Notification age: just now, 1 min, 2 min. */
    quand: z.array(z.string()).length(3),
    /** Accessible name of each app icon (the icon itself is decorative on screen). */
    apps: z.strictObject({
      whatsapp: z.string(),
      appel: z.string(),
      mail: z.string(),
      sms: z.string(),
    }),
  }),
  /** The seven requests, oldest first, and the agent's answer to each. */
  notifications: z
    .array(
      z.strictObject({
        app: z.enum(appsProbleme),
        de: z.string(),
        /** First name the agent answers to (« Owl → Kevin »). */
        a: z.string(),
        message: z.string(),
        agent: z.enum(agentsProbleme),
        reponse: z.string(),
      }),
    )
    .length(7),
  resume: z.strictObject({
    titre: z.string(),
    message: z.string(),
  }),
  /** Label of the no-JS / reduced-motion list (visually hidden in the animated version). */
  listeLabel: z.string(),
  /** « Réglé » badge on each answer of that list. */
  regle: z.string(),
});
