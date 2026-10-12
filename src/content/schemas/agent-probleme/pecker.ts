import { z } from 'astro/zod';

const texte = z.string().min(1);

/**
 * The objects of Pecker's problem (src/components/agents/probleme/Pecker.astro): the training
 * platform's login screen and its error; the admin table where the crew has never logged in; the
 * 24-page PDF module, dense French. The PDF body stays in French in both locales: the French text
 * is the problem the page names.
 */
export const schema = z.strictObject({
  agent: z.literal('pecker'),
  connexion: z.strictObject({
    plateforme: texte,
    titre: texte,
    identifiant: texte,
    valeur: texte,
    motDePasse: texte,
    erreur: texte,
    bouton: texte,
    oubli: texte,
  }),
  suivi: z.strictObject({
    titre: texte,
    onglets: z.array(texte).length(2),
    colonnes: z.array(texte).length(3),
    lignes: z
      .array(z.strictObject({ nom: texte, restaurant: texte, connexion: texte }))
      .min(2)
      .max(3),
    plus: texte,
    progression: texte,
  }),
  pdf: z.strictObject({
    fichier: texte,
    pages: texte,
    titre: texte,
    section: texte,
    paragraphes: z.array(texte).min(1).max(3),
  }),
});
