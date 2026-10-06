# Site v2 — cadrage de la reconstruction

Date : 29/09/2026 · Branche : `feat/site-v2`

## Sources

- Projet Pencil (source de vérité visuelle) : `~/.pencil/documents/7d8a5fa0-783b-4795-9f53-4412edf1a923/`
  - `pencil-new.pen` : maquettes des sections, page Sécurité, design system (« Système de design Hatch OS v4 », frames `01 — Couleurs` à `07 — Règles`), composants.
  - `prototypes/site/index-v4.html` : prototype le plus complet. Il fait référence pour les comportements (scroll, animations) et pour les textes.
  - `context/*.md` : exports Notion (réunion du 23/09, structure validée, hero v2, colorimétrie, messaging, verbatims).
- Le prototype est **jetable**. C'est un export Pencil figé à 1440 px et réduit avec `zoom`, sans aucun responsive. Il contient 302 `position: absolute`, du texte vectorisé en SVG et ~66 Mo d'images. On garde son comportement et ses textes, pas son code.

## Décisions

| Sujet              | Décision                                                                                                                                                                                       |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Stack              | Astro 6 + TypeScript strict + Tailwind v4 + Vercel (statique). Reconstruction de zéro sur `feat/site-v2`, dans le même repo.                                                                   |
| Édition du contenu | Markdown dans le repo, via Claude et une PR. Pas de CMS.                                                                                                                                       |
| Langues            | FR sur `/`, EN sur `/en`, dès la v1. Toute nouvelle page est traduite dès qu'elle existe.                                                                                                      |
| Mobile             | Règles d'adaptation par section, codées directement et validées sur la preview Vercel. Pas de maquette mobile dans Pencil.                                                                     |
| Conversion         | Un seul CTA sur tout le site, « Demander une démo », qui mène à `/demo` : Cal.com intégré (`presentation-hatch`) avec des questions de qualification configurées dans Cal.com.                 |
| Design system      | Pencil fait foi : les variables de `pencil-new.pen` deviennent le `@theme` Tailwind. Les notes Notion plus anciennes (Instrument Serif, Manrope, orange `#EA580C`, golden hour) sont caduques. |
| Animations         | JS vanilla en TypeScript, sans librairie. Le moteur de pistes épinglées du prototype est porté tel quel. Pas de GSAP ni de Three.js en v1.                                                     |
| Tarifs             | Validés : 16 / 25 / 33 € par établissement et par mois en annuel. Le mensuel en est déduit (÷ 0,85 → 19 / 29 / 39 €).                                                                          |

## Périmètre v1

**Dans la v1**, en FR et en EN :

- **Home**, dans cet ordre :
  1. Hero
  2. Clients
  3. Problème
  4. Démo au scroll
  5. Agents
  6. Cas clients
  7. Mise en place
  8. Sécurité
  9. Tarifs
  10. Footer
- **`/demo`**
- **`/securite`**, depuis la maquette Pencil « Nav sécurité / Hero sécurité / 01–04 / CTA ».
- **Pages légales et Sans Filtre**, reprises dans le nouveau layout.

**Hors v1**, ajouté au fil de l'eau :

- **Pages agents et cas clients.** Les collections et le template sont prêts dès la v1. Tant que la page n'existe pas, la tuile ou la carte correspondante s'affiche sans lien.
- **Plus tard** : vidéo, 3D, scène « vente » de Sparrow.

## Design system (DS Hatch OS v4, lu dans Pencil)

### Couleurs

- **Surfaces** :
  - fond `#FDF8EE` ;
  - variation `#F7EDD9` ;
  - carte `#FFFFFF` ;
  - carte secondaire `#FBF6EA` ;
  - panneau `#F0DFC0` ;
  - nuit `#0B0B0D` ;
  - carte nuit `#1A1A18` ;
  - filet nuit `#2A2A27`.
- **Texte** : `#12120F`, secondaire `#5D5A52`, filets `#E4DCC9`.
- **Orange** :
  - `#F87A01`, en aplat uniquement : jamais de texte blanc dessus (2,7:1) ;
  - `#A34F00` pour le texte orange et les fonds de bouton ;
  - survol `#8A4300` ;
  - teinte `#FDEADB` ;
  - série secondaire des graphiques `#C98A4B`.
- **Aucun vert** dans les surfaces, les textes ou les filets.

### Typographie

- **Departure Mono** :
  - H1, 64 px, interligne 1,1, un seul par page ;
  - surtitres 13 px, capitales, +0,13 em, `#A34F00` ;
  - sources 11 px, capitales, +0,12 em.
- **Fraunces 700** :
  - titre de section 40 px, −0,5 px ;
  - titre de carte 22 px ;
  - chiffres 56 px, tabulaires, toujours accompagnés d'une source ;
  - phrase de chute en italique 600, 19 px, `#A34F00`.
- **Inter** :
  - texte 17 px, interligne 1,55, 760 px de large au plus ;
  - légendes 14 px, `#5D5A52`.

### Formes

- **Rayons** : cartes 16, boutons 8, pilules 999, verre 18.
- **Relief** : il vient de la bordure `#E4DCC9`, pas de l'ombre. Quatre niveaux d'ombre au plus (0 à 3).

### Règles

- Un H1 qui affirme un fait.
- Un surtitre qui nomme la fonction de la section.
- Chaque agent est présenté d'abord par son métier (« Vie de réseau — Peep »).
- Trois surfaces citées : app web, WhatsApp, tablette.
- Une source pour chaque chiffre.
- Interdits :
  - les dégradés décoratifs ;
  - les icônes décoratives ;
  - le tiret cadratin dans une phrase ;
  - « opérationnel en quelques minutes ».

## Architecture

```
src/
  content.config.ts        # collections Zod : landing, agents, cas, pages
  content/
    landing/{fr,en}.md     # tout le texte de la home (frontmatter structuré)
    agents/{fr,en}/*.md    # une entrée par agent (métier, couleur, visuels) — pages plus tard
    cas/{fr,en}/*.md       # cas clients
    securite/{fr,en}.md
  i18n/ui.ts               # nav, footer, boutons, libellés a11y
  styles/global.css        # @theme = tokens DS v4, @font-face, @layer base
  layouts/Base.astro       # <head>, SEO, hreflang, nav, footer
  components/
    ui/                    # Bouton, Surtitre, Carte, Pilule, Chiffre (miroir des composants Pencil)
    sections/              # une section = un composant, reçoit ses données en props
  scripts/
    pistes.ts              # moteur de pistes épinglées (sticky + étapes + cadence)
    <section>.ts           # comportement propre à chaque section épinglée
  assets/                  # images optimisées par Astro (<Picture>, AVIF/WebP)
  pages/                   # index, demo, securite, légales, sans-filtre (+ en/)
scripts/import-assets.py   # copie + redimensionne les seuls assets utilisés depuis Pencil
```

- **Texte** : tout le texte vient des collections ou de `ui.ts`, rien n'est écrit en dur. FR et EN ont exactement les mêmes clés : le schéma Zod le garantit au build.
- **Labels pixel** : du vrai texte en Departure Mono (woff2 auto-hébergé), jamais du SVG vectorisé.
- **Poids** : moins de 3 Mo au premier chargement de la home. Les images sous la ligne de flottaison sont chargées en `lazy`.
- **Accessibilité** : les labels pixel et les animations en mouvement restent lisibles sans JS et au lecteur d'écran. Il faut aussi :
  - landmarks, un seul `h1`, puis `h2`/`h3` ;
  - liens et boutons natifs ;
  - bouton pause sur le carrousel ;
  - `prefers-reduced-motion` respecté partout.

## Lots

1. **Socle** :
   - vider `src/` ;
   - tokens `@theme`, polices, `Base.astro`, nav et footer minimal ;
   - i18n, schémas des collections, pages vides FR et EN ;
   - réécrire `CLAUDE.md`.
2. **Assets** : `import-assets.py` et un budget de poids par section.
3. **Sections statiques** : Clients (bande défilante + chiffres sourcés), Agents, Cas clients, Sécurité, Tarifs, Footer.
4. **Sections épinglées**, chacune avec sa variante mobile : `pistes.ts`, puis Hero (boucle de 17 s), Problème, Démo, Mise en place.
5. **Pages** : `/demo`, `/securite`, pages légales, Sans Filtre ; traduction EN.
6. **QA et mise en ligne** :
   - Lighthouse, accessibilité, `hreflang`, sitemap ;
   - redirections des anciennes URLs (`/security` → `/securite`, `/en/unfiltered`…) ;
   - événement de réservation Cal.com ;
   - merge dans `main`.

## Points de contenu à suivre (ne bloquent pas le dev)

- **Chiffres de la bande clients** (12 réseaux, 144+ établissements, 10 000+ questions, < 10 s) : chacun doit avoir une source, conformément au DS.
- **Placeholders** `[X]` / `[Y]` dans les 3 cas clients.
- **Devantures manquantes** : Crousty One, DNA Group, Burger & Fries.
- **« Opérationnel en moins de 3 heures »** (Mise en place) contredit la règle du DS, qui demande d'assumer 2 à 4 semaines. À réécrire.
- **Bouton orange du prototype** : texte blanc sur `#F87A01`, ce qui échoue au contraste AA. Le composant Pencil « Bouton principal » est encre `#12120F` + flèche orange. On suit le composant, sauf avis contraire.
