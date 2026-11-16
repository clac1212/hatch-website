import { z } from 'astro/zod';

const texte = z.string().min(1);

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
  }),
  /** The footer under the page: the line under the logo (the call to action is the hero's). */
  pied: z.strictObject({ signature: texte }),
  /** The evening scene under the hero: the bistro video and Robin's messages popping one by one. */
  soiree: z.strictObject({
    video: texte,
    /** aria-label of the list of messages. */
    label: texte,
    /** Exactly three: the CSS loop (19.5 s, one bubble every 6.5 s) is timed for three bubbles. */
    messages: z.array(z.strictObject({ txt: texte, lien: texte.optional() })).length(3),
  }),
  fait: z.strictObject({ titre: texte }),
  semaine: z.strictObject({
    titre: texte,
    /** aria-label of the tablist. */
    frise: texte,
    /** Monday to Friday then Sunday, in the order of Robin's outfits (src/assets/robin/semaine/). */
    jours: z
      .array(z.strictObject({ jour: texte, heure: texte, titre: texte, texte, bulle: texte }))
      .length(6),
  }),
  /** Where to find him: a WhatsApp you can browse, Robin's chat first, a few others (easter eggs). */
  canaux: z.strictObject({
    titre: texte,
    texte,
    telephone: z.strictObject({
      ariaLabel: texte,
      /** WhatsApp's own words: the chats list, its filters, the tab bar. */
      app: z.strictObject({
        titre: texte,
        recherche: texte,
        filtres: z.array(texte).length(4),
        onglets: z.array(texte).length(5),
        /** aria-label of the back chevron. */
        retour: texte,
        ecrit: texte,
        saisie: texte,
        /** The date chip of today's messages: the list shows their time instead. */
        aujourdhui: texte,
      }),
      discussions: z
        .array(
          z.strictObject({
            nom: texte,
            /** Robin, a Hatch agent (its portrait), or WhatsApp's default avatar. */
            avatar: z.enum(['robin', 'peep', 'owl', 'personne', 'groupe', 'entreprise']),
            /** Under the name, in the chat's header. */
            statut: texte,
            epingle: z.boolean().optional(),
            nonLus: z.number().int().min(0),
            /** Each day opens with its date chip (`jour`), the first message included. */
            messages: z
              .array(
                z.strictObject({
                  jour: texte.optional(),
                  qui: z.enum(['in', 'out']),
                  /** In a group: who wrote it. */
                  auteur: texte.optional(),
                  txt: texte,
                  heure: texte,
                  /** An attached file: its name and the line under it. */
                  doc: z.strictObject({ nom: texte, meta: texte }).optional(),
                  /** A link with its preview (a Hatch page). */
                  lien: z
                    .strictObject({ titre: texte, sousTitre: texte, domaine: texte, url: texte })
                    .optional(),
                }),
              )
              .min(1)
              .refine((m) => m[0].jour, 'the first message opens its day (jour)'),
          }),
        )
        .min(2),
    }),
  }),
  confiance: z.strictObject({
    titre: texte,
    /** Data, decisions, learning: each card has its voxel Robin (alt = what he does). */
    cartes: z.array(z.strictObject({ titre: texte, texte, alt: texte })).length(3),
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
