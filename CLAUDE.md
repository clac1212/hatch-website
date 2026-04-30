# Hatch website — project conventions

Static bilingual marketing site. French at `/`, English at `/en`. The visual source of truth for phase 2 component conversion is `_reference/hatch_landing_page.html` (frozen, read-only).

## Public repository — never commit secrets

**This repo is PUBLIC on GitHub.** Anything pushed to any branch, including the full git history, is visible to the world.

Never commit:

- API keys, tokens, deploy hooks, webhook URLs, OAuth client secrets
- Database connection strings, credentials, `.env*` files (already gitignored — keep it that way)
- Internal URLs (admin panels, staging hosts, internal APIs), private subdomains
- Customer data, prospect lists, internal emails, Slack/Notion/Linear links
- Unreleased product info, pricing not yet public, draft announcements, internal roadmaps
- Personal data (anyone's address, phone, etc.)

Anything sensitive belongs in **Vercel Environment Variables** (Settings → Environment Variables), or in `.env` locally (gitignored). If you ever accidentally commit a secret, treat it as compromised — rotate it immediately, then scrub the history.

## Stack

Astro 6 + TypeScript strict + Tailwind v4 (via `@tailwindcss/vite`) + `@astrojs/vercel` (static). pnpm, Node ≥ 22.

Do NOT install `@astrojs/tailwind` — that integration is deprecated. Tailwind v4 uses the Vite plugin only.

## Commands

```bash
pnpm dev            # http://localhost:4321
pnpm build          # static build, must pass before any merge
pnpm preview        # serve the build
pnpm format         # prettier write
pnpm format:check   # prettier check
```

## Where things live

| What                                     | Where                                                                    |
| ---------------------------------------- | ------------------------------------------------------------------------ |
| Marketing copy (changes daily)           | `src/content/landing/{fr,en}.md`                                         |
| Section components                       | `src/components/*.astro`                                                 |
| Pages (one per locale)                   | `src/pages/index.astro`, `src/pages/en/index.astro`                      |
| Content schema (Zod)                     | `src/content.config.ts` — exact filename, Astro discovers it             |
| Short UI strings (nav, footer, buttons)  | `src/i18n/ui.ts`                                                         |
| Design tokens (colors, fonts, container) | `src/styles/global.css` under `@theme`                                   |
| i18n config                              | `astro.config.mjs` — `defaultLocale: 'fr'`, `prefixDefaultLocale: false` |

## Adding a section

1. New component in `src/components/` — Tailwind utilities only, no hardcoded copy.
2. Extend the Zod schema in `src/content.config.ts`.
3. Add the new fields in BOTH `src/content/landing/fr.md` AND `en.md` — the two files must always have identical frontmatter keys.
4. Import the component in BOTH `src/pages/index.astro` AND `src/pages/en/index.astro`, passing `entry.data.*`.

The `/new-section` slash command automates this.

## Styling

- Tailwind utilities only, backed by tokens in `src/styles/global.css` (`@theme`).
- Token utilities: `bg-hatch-{bg,primary,cta,cta-hover,nav}`, `text-hatch-{text,accent}`, `font-display` (Fraunces), `font-sans` (Inter), container width via `max-w-[var(--container-site)]`.
- New color? Add it to `@theme` first. Never inline raw hex.

## Git

- `main` is production. No direct push.
- Branch prefixes: `content/`, `feat/`, `fix/`. Conventional Commits.
- Vercel posts a preview URL on every PR — validate before merging.

## API gotchas (Astro 6 + Tailwind 4)

- Render Markdown entries with `import { render } from 'astro:content'; const { Content } = await render(entry);`. The old `entry.render()` was removed in v6.
- Tailwind v4 reads tokens from `@theme` in CSS, not from a `tailwind.config.{js,mjs}` file. There is no Tailwind config file in this repo on purpose.
- Vercel adapter import: `import vercel from '@astrojs/vercel'` (no `/serverless` suffix).
- **Resets and element-wide defaults must live in `@layer base { ... }`.** With Tailwind v4, an unlayered rule like `nav { color: #fff }` outranks utilities (e.g. `text-hatch-text` on a child) and silently breaks them. Past incident: the demo CTA went invisible after a stray `nav { color: #fff }` overrode `text-hatch-text` on a cream background.
- **Translucent text on dark sections needs a contrast floor.** `text-white/14`, `/18`, `/35` look great in mockups but fail WCAG AA on `#051309`. Practical floors: `/55` for uppercase labels, `/65` for body copy, `/75+` for important descriptions. Audit any new `white/<N>` value below 50.
- **Hex colors lifted verbatim from `_reference/hatch_landing_page.html` aren't automatically accessible.** Notably `#3a5c3f` for footer text on dark green ≈ 2:1. Re-evaluate every hardcoded color against its background — don't assume the source design is compliant.

## Don't

- Hardcode marketing copy in `.astro` files — it lives in `src/content/landing/{fr,en}.md` or `src/i18n/ui.ts`.
- Inline raw hex colors.
- Push without `pnpm build` passing.
- Edit `_reference/hatch_landing_page.html`.
- Rename `src/content.config.ts`.
- Add heavy client JS. Astro is zero-JS by default; prefer scoped `<script>` or focused islands.
