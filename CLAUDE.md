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

| What                                | Where                                                                        |
| ----------------------------------- | ---------------------------------------------------------------------------- |
| Home page copy                      | `src/content/home/{fr,en}.yaml`, one block per section                       |
| Agents (7, + future agent pages)    | `src/content/agents/{fr,en}/<slug>.md`                                       |
| Content schemas (Zod, strict)       | `src/content.config.ts`: exact filename, Astro discovers it                  |
| Short UI strings, routes per locale | `src/i18n/ui.ts`                                                             |
| Design tokens                       | `src/styles/global.css` under `@theme`                                       |
| Layout, nav, footer                 | `src/layouts/Base.astro`, `src/components/{Nav,Footer}.astro`                |
| DS primitives                       | `src/components/ui/` (Button, Logo…), mirroring the Pencil components        |
| Home sections                       | `src/components/sections/*.astro`, one component per section                 |
| Page bodies shared by FR and EN     | `src/views/*.astro`; `src/pages/**` files only pick the locale               |
| Images                              | `src/assets/` (optimised by Astro), never `public/` unless it must stay raw  |
| Fonts                               | Astro Fonts API in `astro.config.mjs`; Departure Mono in `src/assets/fonts/` |

## Content rules

- No copy hardcoded in `.astro` files: it lives in `src/content/` or `src/i18n/ui.ts`.
- FR and EN must have **identical keys**. The Zod schemas are strict objects, so a missing or extra key fails the build.
- A new page gets an entry in `routes` (`src/i18n/ui.ts`) with its URL in both locales, and a file under `src/pages/` and `src/pages/en/`.
- Writing rules from the DS:
  - one H1 per page, in Departure Mono, stating a fact; exception: the home hero title is in Fraunces 600 (more legible over the map, César 01/10);
  - a kicker naming the section's function;
  - agents presented by job first, speaking in the first person;
  - every number carries a source;
  - no em dash inside a sentence, no « opérationnel en quelques minutes ».
- A single call to action site-wide: book a demo, which leads to `/demo` (Cal.com).

## Styling (DS Hatch OS v4)

- Tailwind utilities backed by the `@theme` tokens. The default Tailwind palette is wiped (`--color-*: initial`), so only brand colors exist. A new color gets added to `@theme` first; never inline a raw hex.
- Colors:
  - `cream`, `cream-2`, `surface`, `surface-2`, `sand`, `night`, `night-2`, `line-night` ;
  - `ink`, `soft`, `line` ;
  - `orange`, `orange-txt`, `orange-hover`, `orange-tint`, `copper` ;
  - `white`.
- **`orange` (#F87A01) is for flat fills only.** Never use it as text, and never put white text on it (2.7:1). Orange text uses `orange-txt`.
- No green in surfaces, text or rules. No decorative gradients or icons. Relief comes from the `line` border; shadows `shadow-1` to `shadow-3` only.
- Type utilities:
  - families `font-mono` (Departure Mono: H1, kickers, sources), `font-display` (Fraunces: section titles, numbers), `font-sans` (Inter: body) ;
  - sizes `text-h1`, `text-section`, `text-card`, `text-stat`, `text-punch`, `text-body`, `text-caption`, `text-kicker`, `text-source`.
- Radii `rounded-btn` (8), `rounded-card` (16), `rounded-glass` (18), `rounded-full`. Containers `max-w-site` (1312 px), `max-w-prose` (760 px). Easing `ease-hatch`.
- **Resets and element-wide defaults must live in `@layer base { ... }`**: an unlayered rule outranks utilities in Tailwind v4 and silently breaks them.
- Translucent white text on `night` needs a contrast floor: `/60` minimum for uppercase labels, `/75` for body copy.

## Motion and accessibility

- Pinned scroll sections share one engine (`src/scripts/pistes.ts`, lot 4). Every animation respects `prefers-reduced-motion`, and content stays readable without JS.
- Real `<a>`/`<button>`, one `h1` then `h2`/`h3`, landmarks, a pause control on anything that auto-plays. Pixel-font labels are real text, never vectorised SVG.
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
