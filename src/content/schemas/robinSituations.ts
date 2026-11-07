import { z } from 'astro/zod';

/** A document sent in the chat (Excel, PDF): its type badge, file name and status line. */
const fichier = z.strictObject({ type: z.string(), nom: z.string(), statut: z.string() });

/** Two quick reply buttons under Robin's message: the one the owner's thumb taps, then the other. */
const boutons = z.strictObject({ oui: z.string(), non: z.string() });

/**
 * Copy of the Robin page's "What Robin does" block (src/content/sections/robinSituations/{fr,en}.yaml):
 * four situations, each played out in a WhatsApp-styled chat. The scene markup, the animation
 * timings and the message order live in src/components/robin/Situations.astro; only the strings
 * (and the illustrative numbers) live here. Emojis are part of the copy.
 */
export const schema = z.strictObject({
  /** The WhatsApp frame shared by the four chats. */
  conversation: z.strictObject({
    /** aria-label of the chat. */
    ariaLabel: z.string(),
    contact: z.string(),
    /** Header status, idle then while Robin is typing. */
    enLigne: z.string(),
    ecrit: z.string(),
    /** Placeholder of the input bar. */
    saisie: z.string(),
    rejouer: z.string(),
  }),
  /** Title and text next to each chat, in display order. */
  situations: z.tuple([
    z.strictObject({ titre: z.string(), texte: z.string() }),
    z.strictObject({ titre: z.string(), texte: z.string() }),
    z.strictObject({ titre: z.string(), texte: z.string() }),
    z.strictObject({ titre: z.string(), texte: z.string() }),
  ]),
  /** 1 · Plugs into your tools: the link card, the system notice, what he found, the month's books. */
  connexion: z.strictObject({
    demande: z.string(),
    lien: z.strictObject({ icone: z.string(), titre: z.string(), sousTitre: z.string() }),
    systeme: z.string(),
    trouve: z.string(),
    trouvailles: z.array(z.string()).min(1),
    compta: z.string(),
    fichier,
  }),
  /** 2 · Checks every invoice: the delivery note photo, the invoice line by line, the credit request. */
  facture: z.strictObject({
    photo: z.strictObject({ titre: z.string(), legende: z.string() }),
    document: z.strictObject({
      titre: z.string(),
      /** Prefix of the delivery-note quantity on each line ("BL 5 kg"). */
      prefixeBl: z.string(),
      lignes: z
        .array(
          z.strictObject({
            nom: z.string(),
            facture: z.string(),
            livre: z.string(),
            /** The line where billed and delivered differ. */
            ecart: z.boolean(),
          }),
        )
        .min(1),
    }),
    ecart: z.string(),
    boutons,
    reponse: z.string(),
    avoir: fichier,
  }),
  /** 3 · Helps you decide: the question, the chart sent as an image, the answer. */
  decision: z.strictObject({
    question: z.string(),
    graphe: z.strictObject({
      titre: z.string(),
      seuil: z.string(),
      /** Sales per day, in px of the chart height (illustrative); `auDessus` = above staff cost. */
      jours: z
        .array(z.strictObject({ jour: z.string(), ventes: z.number(), auDessus: z.boolean() }))
        .min(1),
    }),
    reponse: z.string(),
  }),
  /** 4 · Does the prep work: the voice note, the contract filled from the template, sent on approval. */
  preparation: z.strictObject({
    vocal: z.strictObject({ duree: z.string(), transcription: z.string() }),
    contrat: z.strictObject({
      titre: z.string(),
      tampon: z.string(),
      champs: z.array(z.strictObject({ cle: z.string(), valeur: z.string() })).min(1),
    }),
    question: z.string(),
    boutons,
    reponse: z.string(),
    confirmation: z.string(),
  }),
});
