# Guides de /ressources

Un guide = un fichier Markdown par langue, même nom de fichier (le slug) en FR et en EN :
`fr/<slug>.md` et `en/<slug>.md`. Il est publié sur `/ressources/<slug>` et `/en/resources/<slug>`.

Le frontmatter est validé par `src/content/schemas/ressource.ts` (objet strict) :

```yaml
title: '…' # le H1, en Departure Mono : un fait sur le métier du lecteur
seoTitle: '…' # titre Google sans « | Hatch OS » (ajouté), 49 caractères au plus
description: '…' # 120 à 155 caractères, une phrase complète
kicker: 'Guide'
chapeau: '…'
essentiel: ['…', '…', '…'] # les 3 points de « L'essentiel »
public: independant # independant | reseau | tous (choisit aussi l'appel à l'action final)
metier: 'Achats' # aussi le filtre par thème de /ressources
agents: [finch, jay] # facultatif : une carte par agent en fin de guide
readingMinutes: 6
updatedAt: '2026-11-10'
image: '../../../assets/ressources/<slug>.jpg' # couverture voxel 3:2
imageAlt: '…'
une: true # facultatif : le guide « À la une » de /ressources
faq:
  - question: '…'
    reponse: '…'
sources: # chaque chiffre du guide a sa source
  - affirmation: '…'
    url: 'https://…'
    luLe: '2026-11-10'
brouillon: true # facultatif : visible avec `pnpm dev` seulement, jamais en production
```

Dans le corps, un encadré agent s'écrit en citation dont la première ligne est en gras :
`> **Avec Robin**`. Les intertitres `##` forment le sommaire « Sur cette page ».

Le slug `glossaire` est réservé. Ce README n'est pas lu par Astro (le motif est `*/*.md`).
