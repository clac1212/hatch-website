# Hatch website (v2) — project conventions

Static bilingual marketing site for Hatch OS. French at `/`, English at `/en`. Rebuilt from scratch in September 2026. The plan and the decisions behind it are in `docs/plans/2026-09-29-site-v2-design.md`, so read that first.

## Public repository — never commit secrets

**This repo is PUBLIC on GitHub.** Everything pushed to any branch, including the full git history, is visible to the world.

Never commit:

- API keys, tokens, deploy hooks, webhook URLs, OAuth secrets. That includes the `FAL_KEY` used to generate the voxel images: it lives only in a local `.env`.
- `.env*` files (gitignored, keep it that way), connection strings, credentials
- Internal URLs, customer data, prospect lists, internal emails or Notion/Slack links
- Unreleased product info, draft announcements, personal data

Secrets belong in Vercel Environment Variables or a local `.env`. If a secret is ever committed, rotate it immediately, then scrub the history.

## Sources of truth

| What                               | Where                                                                                    |
| ---------------------------------- | ---------------------------------------------------------------------------------------- |
| Visual design, design system       | Pencil project `~/.pencil/documents/7d8a5fa0-783b-4795-9f53-4412edf1a923/pencil-new.pen` |
| Scroll behaviour, animations, copy | Prototype `…/prototypes/site/index-v4.html` (+ `site.js`, `sections/*.html`)             |
| Product, messaging, decisions      | `…/context/*.md` (Notion exports)                                                        |

The prototype is **throwaway**: a Pencil export frozen at 1440 px. Port its behaviour and copy, never its markup. `.pen` files are encrypted, so read them only through the Pencil MCP tools.

## Stack

Astro 6 + TypeScript strict + Tailwind v4 (`@tailwindcss/vite`) + `@astrojs/vercel` (static). pnpm, Node ≥ 22. No UI framework: interactivity is vanilla TypeScript in `<script>` tags. `sharp` is a direct dependency because `astro:assets` needs it under pnpm.

## Commands

```bash
pnpm dev            # http://localhost:4321
pnpm build          # must pass before any merge
pnpm preview
pnpm format         # prettier write
pnpm format:check
```

## Where things live

| What                                | Where                                                                                                              |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Home page (`/`, the crossroads)     | `src/views/AccueilPage.astro`, copy in `src/content/sections/accueil/`, SEO in `src/content/home/{fr,en}.yaml`     |
| Networks page (`/reseaux`)          | `src/views/ReseauxPage.astro` (the former one-page home), sections copy in `src/content/sections/*`                |
| Robin page (`/robin`)               | `src/views/RobinPage.astro`, `src/components/robin/Situations.astro`, copy in `sections/robin*`                    |
| Robin waitlist endpoint             | `src/pages/api/liste-attente.ts` (on demand): Notion row + Slack alert, secrets in Vercel env only                 |
| Agents (7, + future agent pages)    | `src/content/agents/{fr,en}/<slug>.md`                                                                             |
| Agent pages: feature wall copy      | `src/content/agents-bento/{fr,en}/<slug>.yaml`, one schema per agent in `src/content/schemas/bento/`               |
| Agent pages: components             | `src/views/AgentPage.astro`, `src/components/agents/` (Mur, Tuile, Exemple, `bento/<Agent>.astro`)                 |
| Agent pages: problem objects        | `src/content/agents-probleme/{fr,en}/<slug>.yaml`, `src/content/schemas/agent-probleme/`, `probleme/<Agent>.astro` |
| Agent pages: usage-example scenes   | `src/content/agents-scenes/{fr,en}/<slug>.yaml`, `src/content/schemas/scenes/`, `scenes/<Agent>.astro`             |
| Content schemas (Zod, strict)       | `src/content.config.ts`: exact filename, Astro discovers it                                                        |
| Short UI strings, routes per locale | `src/i18n/ui.ts`                                                                                                   |
| Design tokens                       | `src/styles/global.css` under `@theme`                                                                             |
| Layout, nav, footer                 | `src/layouts/Base.astro`, `src/components/{Nav,Footer}.astro`                                                      |
| DS primitives                       | `src/components/ui/` (Button, Logo…), mirroring the Pencil components; layout in `src/components/layout/`          |
| Home sections                       | `src/components/sections/*.astro`, one component per section                                                       |
| Page bodies shared by FR and EN     | `src/views/*.astro`; `src/pages/**` files only pick the locale                                                     |
| Images                              | `src/assets/` (optimised by Astro), never `public/` unless it must stay raw                                        |
| Fonts                               | Astro Fonts API in `astro.config.mjs`; Departure Mono in `src/assets/fonts/`                                       |

## Content rules

- No copy hardcoded in `.astro` files: it lives in `src/content/` or `src/i18n/ui.ts`.
- FR and EN must have **identical keys**. The Zod schemas are strict objects, so a missing or extra key fails the build.
- A new page gets an entry in `routes` (`src/i18n/ui.ts`) with its URL in both locales, and a file under `src/pages/` and `src/pages/en/`.
- Writing rules from the DS:
  - one H1 per page, stating a fact, in Fraunces 600 (`font-display text-h1 font-semibold`) on every page (César 09/11); Departure Mono stays for kickers, sources and labels. The long-sentence H1s of the networks hero and the agent pages are smaller, as named exceptions;
  - no kicker by default (César 09/11: a kicker that rephrases the title reads as AI-made); a kicker only when it adds what the title lacks: the audience (the home doors), a number or category (« 01 · Partage & hébergement »), a status (« Bêta »);
  - agents presented by job first, speaking in the first person; exception: the agent pages (`/agents/<slug>`) are Patrick's copy (Notion « 08 · Pages agents »), in the third person and taken word for word (César 09/10), only the agent's `pitch` stays in the first person; except the problem block, rewritten landing-page style: a short title naming the pain, one or two concrete sentences, no « a network told us » (César 12/10);
  - every number carries a source;
  - no em dash inside a sentence, no « opérationnel en quelques minutes ».
- Calls to action, one per space (César 06/10, 09/11): networks, the demo (`Button variant="orange"`, « Réserver une démo » / « Book a demo » → `/demo`, Cal.com), plus « Essayer Hatch OS » / « Try Hatch OS » as a `secondary` button in the networks hero (`appUrls.signup`); Robin, the beta waitlist (« Rejoindre la liste d'attente », → `#beta`); home, « Se connecter » / « Log in » in the nav (`appUrls.login`; the app's /auth page also lets a newcomer sign up). Robin shows no sign-in: independents have no account yet. Every other CTA (pricing, footer, inner pages) is the demo alone. App URLs live in `appUrls` (src/i18n/ui.ts).

## Design system (DS Hatch OS v4)

One design system in five layers. Consistency comes from a shared vocabulary (tokens) and a shared rhythm (layout); identity comes from a few signature sections that get their own art direction. The approach follows today's practice: three-tier tokens, fluid scales (Utopia), and CUBE CSS (composition is free, vocabulary is fixed, exceptions are named). César 09/11.

> **Status (Nov 2026): being rolled out on `refactor/harmonisation-site`.** Pages not yet migrated still carry raw values (`text-[34px]`, `rounded-[36px]`, `max-w-[1180px]`…). Never copy them: use the layer that should provide the value.

### The five layers

| Layer                 | Where                                                 | What                                                                                    | Freedom                                                   |
| --------------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| 1. Tokens             | `src/styles/global.css`, `@theme`                     | colors, type scale, section spacing, radii, shadows, containers, easing                 | none: a missing value becomes a token first, then is used |
| 2. Layout             | `src/components/layout/`                              | `Section` (background tone + vertical rhythm), `Conteneur` (`max-w-site` + gutters)     | none on rhythm and left edge                              |
| 3. DS components      | `src/components/ui/`, mirroring the Pencil components | `Button`, `Kicker`, `EnTete` (kicker + title + lead), `Carte`, `Logo`, `Iphone`, `Ipad` | only through their variants                               |
| 4. Standard sections  | `src/components/sections/`, `src/components/agents/`… | assembled from layers 1 to 3                                                            | layout free, vocabulary fixed                             |
| 5. Signature sections | listed below                                          | the staged moments that carry the site's identity                                       | free inside their scoped `<style>`, under the three rules |

Signature sections today: the home hero rebus (`AccueilPage`), the Robin evening, week and phone (`RobinPage`, `robin/Situations`), the networks hero map (`sections/Hero`), the pricing composer (`sections/TarifsFormulaire`), the agent pages' scenes, problem objects and walls (`components/agents/`). Making a new section a signature one is César's call.

### The three rules of a signature section

1. **Inside the system wherever it exists.** Wrapped in a `Section`; tokens for color, type, radius and shadow. Only the staging is bespoke: positions, timings, mockup dimensions.
2. **Every bespoke value is named.** It carries a `/* exception: why */` comment (or `<!-- exception: why -->` in markup) and stays in the component, never in global CSS.
3. **Rule of two.** The second time an exception gets copied (the WhatsApp chrome, a control, a card shape…), it is promoted to layer 1, 2 or 3.

### Tokens

- The default Tailwind palette is wiped (`--color-*: initial`): only our colors exist. A new color is added to `@theme` first; never inline a raw hex.
- **Brand colors**, usable anywhere:
  - surfaces `cream`, `cream-2`, `surface`, `surface-2`, `sand`, `night`, `night-2`, `black` (footer only), `peach`, `peach-2` ;
  - text and rules `ink`, `soft`, `muted`, `line`, `line-night`, `white` ;
  - accent `orange`, `orange-txt`, `orange-hover`, `orange-tint`, `copper`.
- **Scene palette** (`whatsapp*`, `mail*`, `metal*`, `trad-*`, `statut-*`, `client-*`, `robin*`, `scene`, `mur`, `galet`, `faq`, `gray-*`, `amber-*`, `success*`, `navy`, `glass`): only inside mockups and illustrations (phone and tablet screens, scenes), never for page surfaces or page text.
- **`orange` (#F87A01) is for flat fills only.** Never as text, never white text on it (2.7:1). Orange text uses `orange-txt` (on light) or `peach` (on `night`).
- No green outside WhatsApp mockups. No decorative gradients or icons. Relief comes from the `line` border; shadows `shadow-1` to `shadow-3`, plus `shadow-orange` under the primary button only.
- Translucent white text on `night` needs a contrast floor: `/60` minimum for uppercase labels, `/75` for body copy.
- **Type.** Families: `font-display` (Fraunces: titles, numbers), `font-sans` (Inter: body), `font-mono` (Departure Mono: kickers, sources, labels). Fraunces titles are weight **600**. One size token per level, never a pixel size:

  | Level                     | Token          | Size (mobile → 1440 px) |
  | ------------------------- | -------------- | ----------------------- |
  | H1                        | `text-h1`      | 36 → 64 px              |
  | Section title (H2)        | `text-section` | 30 → 40 px              |
  | Card / sub-title (H3)     | `text-card`    | 22 px                   |
  | Big number                | `text-stat`    | 40 → 56 px              |
  | Lead (text under a title) | `text-punch`   | 19 px                   |
  | Body                      | `text-body`    | 17 px                   |
  | Small text, form labels   | `text-caption` | 14 px                   |
  | Kicker                    | `text-kicker`  | 13 px, uppercase mono   |
  | Source, legal line        | `text-source`  | 11 px                   |

- Containers `max-w-site` (1312 px, every section's left edge) and `max-w-prose` (760 px, running text). Easing `ease-hatch`.
- **Buttons: always `<Button>`, a pill in every variant** (`orange` primary, `secondary`, `ink`, `cream`), sizes `sm` | `lg`, the orange glow is `shadow-orange` / `shadow-orange-lg` (César 09/11). Never a hand-made button.
- **Navigation: one component, `Nav`** (César 09/11): the floating glass pill on every page, `tone="night"` (dark glass) over dark pages. Its content follows one pattern, logo · ← Home · the space's sections · language · the space's one CTA; Base picks it with `nav` (`accueil`, `robin`, `reseau`, `legal`). No second in-page nav. Nav labels name what a visitor looks for (« Fonctionnalités », « Au quotidien »), never the page's inner jargon.
- **Radii: three levels** (César 09/11): `rounded-sm` (8 px: inputs, tags, menu items), `rounded-card` (24 px: every card and panel, small or large), `rounded-full` (buttons, avatars, pills). Something set inside a card takes a smaller radius or none; an image flush with the card edge inherits its corners. Radii inside mockups (phone screens, chat bubbles, app icons) belong to the scene.
- Section spacing: one vertical rhythm through `Section` (to come with the layout layer).
- **Resets and element-wide defaults live in `@layer base { ... }`**: an unlayered rule outranks utilities in Tailwind v4 and silently breaks them.

### Guardrails

- `pnpm check:ds` (to come, run by `pnpm build`): fails on raw values in markup (`text-[…px]`, `rounded-[…]`, `max-w-[…px]`, raw hex, `font-bold` on a Fraunces title) unless the line carries an `exception` comment.
- `/_ds` (to come, dev only, out of the build and the sitemap): every token and DS component on one page, to check against Pencil at a glance.

## Motion and accessibility

- Pinned scroll sections share one engine (`src/scripts/pistes.ts`, lot 4). Every animation respects `prefers-reduced-motion`, and content stays readable without JS.
- Real `<a>`/`<button>`, one `h1` then `h2`/`h3`, landmarks. No pause button on animations, even looping ones (César 09/11: « personne fait ça »); `prefers-reduced-motion` is the only motion control. Pixel-font labels are real text, never vectorised SVG.
- Budget: < 3 MB on first load of the home. Below-the-fold images lazy-load through `<Image>`/`<Picture>`.

## Git

- `main` is production, no direct push. The v2 rebuild lives on `feat/site-v2` until launch.
- Branch prefixes `content/`, `feat/`, `fix/`. Conventional Commits.
- Vercel posts a preview URL on every PR; validate there, including on a real phone.

## API gotchas (Astro 6 + Tailwind 4)

- Astro 6 content: `glob()` from `astro/loaders`, `z` from `astro/zod` (Zod 4, so use `z.strictObject`). Render Markdown with `import { render } from 'astro:content'`; `entry.render()` no longer exists.
- Fonts: the top-level `fonts` config plus `<Font cssVariable="…" />` in `<head>`. The Tailwind families point at those variables through `@theme inline`.
- Tailwind v4 reads tokens from `@theme` in CSS. There is no `tailwind.config.*` on purpose. Do NOT install `@astrojs/tailwind`.
- Vercel adapter: `import vercel from '@astrojs/vercel'`.
