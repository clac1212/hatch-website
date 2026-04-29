# Hatch Website

Le site marketing de **Hatch** — l'OS AI-native pour les réseaux de franchises.

Ce dépôt contient le code de la landing page (`hatch.example.com` une fois le domaine en place) et les contenus FR + EN.

> 🤖 Tu es un agent IA (Claude Code, Cursor) ? Lis [`CLAUDE.md`](./CLAUDE.md) à la place — c'est la doc faite pour toi.

---

## 🚀 Démarrer en local (5 minutes)

### Pré-requis

Tu as besoin de trois choses installées sur ta machine :

1. **Node.js** version 22 ou plus — [nodejs.org](https://nodejs.org)
2. **pnpm** (gestionnaire de paquets) — installation : `npm install -g pnpm`
3. **Claude Code** (l'agent qui t'aide à coder) — [claude.ai/code](https://claude.ai/code)

### Lancer le site

Ouvre un terminal dans ce dossier et tape :

```bash
pnpm install      # installe les dépendances (à faire une seule fois)
pnpm dev          # lance le site sur http://localhost:4321
```

Tu devrais voir la landing FR sur [`http://localhost:4321/`](http://localhost:4321/) et la version EN sur [`http://localhost:4321/en`](http://localhost:4321/en). Le navigateur se rafraîchit tout seul quand tu modifies un fichier.

Pour arrêter : `Ctrl + C` dans le terminal.

---

## ✏️ Je veux changer un texte

Tous les textes de la landing (hero, sections, FAQ, etc.) vivent dans **deux fichiers Markdown** :

- 🇫🇷 `src/content/landing/fr.md`
- 🇬🇧 `src/content/landing/en.md`

### Workflow

1. **Crée une branche** depuis `main` (jamais éditer `main` directement) :
   ```bash
   git checkout -b content/maj-hero
   ```
2. **Ouvre le fichier** que tu veux modifier (ex: `src/content/landing/fr.md`)
3. **Modifie le texte** comme tu modifierais un Google Doc — c'est du Markdown (`#` = titre, `**gras**`, etc.)
4. **Vérifie en local** que le rendu te plaît sur `http://localhost:4321/` (pendant que `pnpm dev` tourne)
5. **N'oublie pas l'autre langue** : si tu modifies `fr.md`, fais l'équivalent dans `en.md` (ou demande à Claude `/translate` de le faire)
6. **Commit + push** :
   ```bash
   git add .
   git commit -m "content: maj copy hero"
   git push -u origin content/maj-hero
   ```
7. **Ouvre une Pull Request** sur GitHub. Vercel va automatiquement créer une URL de preview (ex : `hatch-website-abc123.vercel.app`) et la poster en commentaire sur la PR.
8. **Valide la preview** dans ton navigateur. Si tout est bon, **merge la PR** → la prod se met à jour toute seule en ~30 secondes.

---

## 🧱 Je veux ajouter une section

Le plus simple : demande à Claude Code de le faire pour toi.

```
/new-section Pricing
```

Il va :

- créer un composant `src/components/Pricing.astro`
- ajouter les champs nécessaires dans `fr.md` et `en.md`
- importer la section dans les pages FR et EN

Ensuite tu remplis les champs dans les `.md`, tu vérifies en local, tu push, tu mergues.

---

## 🌍 Je veux ajouter / corriger une traduction

```
/translate fr en src/content/landing/fr.md
```

Claude lit le fichier FR et met à jour `en.md` en gardant le même format. À toi de relire.

---

## 🚢 Je veux publier

Le déploiement est **automatique** via Vercel. Tu n'as rien à faire de spécial — il suffit de :

1. Pousser ta branche sur GitHub
2. Ouvrir une Pull Request
3. Vérifier la preview Vercel (le lien apparaît dans la PR)
4. Merger sur `main` → la prod est mise à jour

Pour vérifier que ton code est prêt à être mergé sans risque :

```
/deploy-check
```

Cette commande lance le build local et vérifie qu'il n'y a pas d'erreur cachée.

---

## 🆘 Ça casse, qu'est-ce que je fais ?

1. **Erreur dans le terminal `pnpm dev`** : copie-colle le message à Claude Code, il diagnostique.
2. **Le build échoue dans la PR** : ouvre l'onglet "Checks" de la PR sur GitHub, lis l'erreur, copie-la à Claude.
3. **Le rendu est cassé visuellement** : ne mergue pas, montre-moi la preview Vercel sur Slack.

Sinon ping-moi (Cesar) sur Slack. Pas de honte à demander, c'est plus rapide à deux.

---

## 📚 Pour aller plus loin

- [`CLAUDE.md`](./CLAUDE.md) — toutes les conventions techniques (lis-le si tu veux comprendre comment ça marche sous le capot)
- [Documentation Astro](https://docs.astro.build/) — si tu veux apprendre le framework
- [Documentation Tailwind CSS](https://tailwindcss.com/docs) — pour comprendre les classes CSS
