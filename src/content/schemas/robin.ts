import { z } from 'astro/zod';

const texte = z.string().min(1);

/** Screen-reader labels of a looping animation's pause button, swapped by the inline script. */
const pause = z.strictObject({ pause: texte, lecture: texte });

/** A waitlist form field: its label and example value (type and autocomplete live in the view). */
const champ = z.strictObject({ label: texte, placeholder: texte });

/**
 * Copy of the Robin page (src/content/sections/robin/{fr,en}.yaml), the AI partner of independent
 * restaurant owners, with the beta waitlist. Rendered by src/views/RobinPage.astro; the WhatsApp
 * situations under « Ce que fait Robin » have their own collection (robinSituations), and the
 * Rungis footer scene lives in piedDePage (`scenes.robin`).
 */
export const schema = z.strictObject({
  seo: z.strictObject({ title: texte, description: texte }),
  hero: z.strictObject({
    titre: texte,
    intro: texte,
    cta: texte,
    /** aria-label of Robin's flying loop above the title. */
    video: texte,
    pause,
  }),
  /** The evening scene under the hero: the bistro video and Robin's messages popping one by one. */
  soiree: z.strictObject({
    video: texte,
    /** aria-label of the list of messages. */
    label: texte,
    pause,
    /** Exactly three: the CSS loop (19.5 s, one bubble every 6.5 s) is timed for three bubbles. */
    messages: z.array(z.strictObject({ txt: texte, lien: texte.optional() })).length(3),
  }),
  /** The sticky in-page nav pill. */
  pilule: z.strictObject({
    label: texte,
    statut: texte,
    fait: texte,
    semaine: texte,
    canaux: texte,
    cta: texte,
  }),
  fait: z.strictObject({ kicker: texte, titre: texte }),
  semaine: z.strictObject({
    kicker: texte,
    titre: texte,
    /** aria-label of the tablist. */
    frise: texte,
    /** Monday to Friday then Sunday, in the order of Robin's outfits (src/assets/robin/semaine/). */
    jours: z
      .array(z.strictObject({ jour: texte, heure: texte, titre: texte, texte, bulle: texte }))
      .length(6),
  }),
  /** Where to find him: the WhatsApp thread in the phone. */
  canaux: z.strictObject({
    kicker: texte,
    titre: texte,
    texte,
    telephone: z.strictObject({
      statut: texte,
      jour: texte,
      messages: z
        .array(
          z.strictObject({
            qui: z.enum(['robin', 'patron']),
            txt: texte,
            /** An attached file: its name and the line under it. */
            doc: texte.optional(),
            meta: texte.optional(),
          }),
        )
        .min(1),
    }),
  }),
  confiance: z.strictObject({
    titre: texte,
    cartes: z.array(z.strictObject({ titre: texte, texte })).length(3),
  }),
  beta: z.strictObject({
    kicker: texte,
    titre: texte,
    texte,
    champs: z.strictObject({
      prenom: champ,
      nom: champ,
      restaurant: champ,
      site: champ,
      whatsapp: champ,
      email: champ,
    }),
    bouton: texte,
    mention: texte,
    /** Status line of the form (aria-live): while sending, on success, on failure, on invalid input. */
    messages: z.strictObject({
      envoi: texte,
      succes: texte,
      erreur: texte,
      invalide: texte,
    }),
  }),
});
