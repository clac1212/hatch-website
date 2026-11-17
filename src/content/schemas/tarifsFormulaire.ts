import { z } from 'astro/zod';

const txt = z.string().min(1);

/** An agent pictured on an offer card; `id` picks its portrait and its gesture video (/anim/<id>-geste.mp4). */
const agent = z.strictObject({
  id: z.enum(['peep', 'owl', 'jay', 'lark', 'finch', 'pecker', 'sparrow']),
  nom: txt,
  /** Shown under the circle on the core card only. */
  role: txt,
});

/** A selectable offer. The ids are fixed: the component and its scripts hang behaviour on them. */
const offre = <I extends string>(id: I) =>
  z.strictObject({
    id: z.literal(id),
    nom: txt,
    tag: txt,
    texte: txt,
    agents: z.array(agent).min(1),
  });

/** A text field of steps 2 and 3. */
const champ = z.strictObject({ label: txt, placeholder: txt });

/** A plural pair; `{n}` is replaced by the number. */
const pluriel = z.strictObject({ un: txt, plusieurs: txt });

/** One line per agent: the job title printed on its badge. */
const postes = z.strictObject({
  peep: txt,
  owl: txt,
  jay: txt,
  lark: txt,
  finch: txt,
  pecker: txt,
  sparrow: txt,
});

/**
 * Copy of the pricing form section (src/content/sections/tarifsFormulaire/{fr,en}.yaml). The form
 * is a hiring in three acts (components/tarifs/Recrutement.astro): stamp the agents' files, place
 * them in the network, meet their badges; then the request leaves as a letter and a postcard comes
 * back (components/tarifs/Envoi.astro), leading to the demo booking with the answers attached.
 */
export const schema = z.strictObject({
  titre: txt,
  intro: txt,
  /** The core, then Finch, Pecker, Sparrow (also the offers of the /demo picker). */
  offres: z.tuple([offre('socle'), offre('finch'), offre('pecker'), offre('sparrow')]),
  /** /demo picker: badge on Finch and Pecker, and the line on the core while they lock it. */
  avecSocle: txt,
  requis: txt,
  /** Act 2, only when Sparrow is hired: one picture per pace. */
  ouvertures: z.strictObject({ question: txt, choix: z.tuple([txt, txt, txt, txt]) }),
  champs: z.strictObject({
    enseigne: champ,
    etablissements: champ,
    nom: champ,
    role: champ,
    email: champ,
    telephone: champ,
  }),
  /** The hiring, act by act. */
  recrutement: z.strictObject({
    /** Labels of the four acts (the fourth: the booking), and their list's name for screen readers. */
    actes: z.tuple([txt, txt, txt, txt]),
    actesNom: txt,
    /** Title of each act, then of act 4, the agenda, once the request has left. */
    titres: z.tuple([txt, txt, txt]),
    titreEnvoye: txt,
    /** Act 1. */
    consigne: txt,
    /** The core's line on its file (the offer's `texte` names each agent, too long here). */
    socleTexte: txt,
    /** Under Finch and Pecker: they come with the core. */
    avecSocle: txt,
    /** Label of a file's real checkbox, `{agents}` replaced by the list. */
    embaucher: txt,
    /** Last joint of a list: « Peep, Owl et Jay ». */
    et: txt,
    /** Before a field's example. */
    exemple: txt,
    /** The − and + of the number of establishments. */
    moins: txt,
    plus: txt,
    /** Words of the prints: a hired file, a picked pace, the rim. */
    tampons: z.strictObject({ embauche: txt, retenu: txt, bord: txt }),
    etablissements: pluriel,
    /** The team bar at the bottom. */
    barre: z.strictObject({
      retour: txt,
      vide: txt,
      aide: txt,
      alerte: txt,
      agents: pluriel,
      embauches: pluriel,
      suivant: z.tuple([txt, txt]),
      fin: txt,
      /** « Il manque : » then the names of the missing fields. */
      manque: txt,
      champs: z.strictObject({
        enseigne: txt,
        etablissements: txt,
        ouvertures: txt,
        nom: txt,
        role: txt,
        email: txt,
        telephone: txt,
      }),
      envoi: txt,
      envoye: txt,
    }),
    /** Act 3: the badges. `aide` names the button, `{nom}` replaced. */
    badges: z.strictObject({ aide: txt, enseigneVide: txt, postes, texte: txt }),
    /** Without JavaScript the hiring cannot run: a line and a link to the demo page. */
    sansJs: txt,
  }),
  /** The sending scene and the postcard. `merci`: `{prenom}` replaced. */
  envoi: z.strictObject({
    lettre: txt,
    attention: txt,
    tampon: txt,
    reponse: txt,
    merci: txt,
    texte: txt,
    bouton: txt,
    signature: txt,
    entete: txt,
  }),
  /** The "how it works" aside. */
  deroule: z.strictObject({
    kicker: txt,
    etapes: z.tuple([
      z.strictObject({ titre: txt, texte: txt }),
      z.strictObject({ titre: txt, texte: txt }),
      z.strictObject({ titre: txt, texte: txt }),
    ]),
    mention: txt,
  }),
  /**
   * Line labels of the summary attached to the demo booking (stored in sessionStorage for /demo).
   * Labels carry their own colon, so each locale keeps its typography ("Enseigne :" / "Brand:").
   */
  notes: z.strictObject({
    agents: txt,
    /** Name of the core in the agents list. */
    socle: txt,
    ouvertures: txt,
    enseigne: txt,
    etablissements: txt,
    role: txt,
    telephone: txt,
  }),
});

export type TarifsFormulaire = z.infer<typeof schema>;
