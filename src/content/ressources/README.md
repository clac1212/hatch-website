# Guides de /ressources

Un guide = un fichier Markdown par langue, même nom de fichier (le slug) en FR et en EN :
`fr/<slug>.md` et `en/<slug>.md`. Il est publié sur `/ressources/<slug>` et `/en/resources/<slug>`.

Le frontmatter est validé par `src/content/schemas/ressource.ts` (objet strict) :

```yaml
title: '…' # le H1, en Departure Mono
description: '…' # 120 à 155 caractères, une phrase complète
kicker: '…'
chapeau: '…'
public: independant # independant | reseau | tous (choisit aussi l'appel à l'action final)
metier: 'Achats'
agents: [finch, jay] # facultatif : une carte par agent en fin de guide
readingMinutes: 6
updatedAt: '2026-11-10'
faq:
  - question: '…'
    reponse: '…'
sources: # chaque chiffre du guide a sa source
  - affirmation: '…'
    url: 'https://…'
    luLe: '2026-11-10'
brouillon: true # facultatif : visible avec `pnpm dev` seulement, jamais en production
```

Le slug `glossaire` est réservé. Ce README n'est pas lu par Astro (le motif est `*/*.md`).
