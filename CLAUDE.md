# CLAUDE.md — Hatch Website

> Context for AI agents (Claude Code, Cursor, etc.) working in this repo.
> Humans should read [`README.md`](./README.md) instead — it's written in French and assumes no prior tech knowledge.

---

## Project overview

This repo contains the marketing landing page for **Hatch** — the AI-native OS for franchise networks (https://hatch.example.com — replace once domain is live).

The site is **bilingual** (French is the default, English is the secondary locale). It is intentionally a **static marketing site**: no auth, no database, no app logic. Anything beyond marketing copy lives elsewhere.

The original design lives in `_reference/hatch_landing_page.html` — a single 3000-line HTML file with inline CSS, kept in the repo as a visual reference for phase 2 (component conversion).

**Who edits this repo, and how:**

- **Cesar** (technical co-founder) — full-stack changes, infra, architecture.
- **Cesar's sales associate** — primarily edits Markdown content (hero copy, sections, FAQ). Comfortable enough with Claude Code / Cursor to follow a guided workflow but should never need to write Astro, TypeScript, or CSS by hand.

When in doubt about whether a change belongs to "code" or "content," prefer keeping it editable as Markdown. The whole point of this setup is that updating marketing copy must not require touching `.astro` or `.ts` files.

---

## Stack & versions

| Tool              | Version                              | Notes                                                                  |
| ----------------- | ------------------------------------ | ---------------------------------------------------------------------- |
| Astro             | ^6.1.10                              | App router via `src/pages/`, Content Collections via Content Layer API |
| TypeScript        | strict (via Astro preset)            |                                                                        |
| Tailwind CSS      | ^4.2.4                               | v4 — uses `@tailwindcss/vite`, NOT the deprecated `@astrojs/tailwind`  |
| `@astrojs/vercel` | ^10.0.6                              | Static adapter                                                         |
| Node              | >=22.12.0                            |                                                                        |
| Package manager   | pnpm 10.x                            |                                                                        |
| Lint / format     | Prettier 3 + `prettier-plugin-astro` | Config inline in `package.json`                                        |

---

## Commands

```bash
pnpm install          # install deps
pnpm dev              # http://localhost:4321 (hot reload)
pnpm build            # static build → ./dist (and ./.vercel for the adapter)
pnpm preview          # serve the built site locally
pnpm format           # prettier write
pnpm format:check     # prettier check (CI / pre-merge)
```

Cesar uses `rtk` (Rust Token Killer) as a transparent prefix to compress command output. `rtk pnpm dev` is equivalent to `pnpm dev` but cheaper in tokens. Use `rtk` whenever possible inside this repo (see global `~/.claude/CLAUDE.md`).

---

## File structure

```
hatch-website/
├── _reference/
│   └── hatch_landing_page.html       # original 3000-line HTML — visual reference, do not edit
├── src/
│   ├── pages/
│   │   ├── index.astro               # /     → French landing
│   │   └── en/index.astro            # /en   → English landing
│   ├── layouts/Base.astro            # head, fonts, footer, slot
│   ├── components/                   # phase 2 — Hero, Features, Pricing, FAQ…
│   ├── content/landing/{fr,en}.md    # ← marketing copy lives HERE
│   ├── content.config.ts             # Zod schema for the `landing` collection
│   ├── i18n/ui.ts                    # short UI strings (nav, footer) per locale
│   └── styles/global.css             # Tailwind import + Hatch design tokens (@theme)
├── public/                           # static assets (favicons, OG images)
├── .claude/commands/*.md             # custom slash commands (see below)
├── astro.config.mjs                  # i18n, Vercel adapter, Tailwind plugin
├── CLAUDE.md                         # ← this file
└── README.md                         # human-facing guide (FR)
```

---

## Conventions

### Adding a new section to the landing

1. Create a component under `src/components/` (e.g. `Pricing.astro`). It receives its content as props.
2. Add the corresponding fields to the `landing` schema in `src/content.config.ts`.
3. Fill the new fields in BOTH `src/content/landing/fr.md` AND `src/content/landing/en.md`.
4. Import and render the component in `src/pages/index.astro` AND `src/pages/en/index.astro`, passing the values from `entry.data`.

The slash command `/new-section` automates steps 1, 3, and 4. See `.claude/commands/new-section.md`.

### Adding a new locale

1. Add the locale to `locales` in `astro.config.mjs`.
2. Add a translation block in `src/i18n/ui.ts`.
3. Create `src/content/landing/<locale>.md` with the same frontmatter shape.
4. Create `src/pages/<locale>/index.astro` (or restructure if you make `<locale>` part of the URL for ALL routes).

### Editing marketing copy

- All marketing copy lives in `src/content/landing/{fr,en}.md`. **Edit those files only.**
- Do NOT hardcode marketing copy inside `.astro` components — components consume content from `entry.data` (frontmatter) or render the body via `<Content />`.
- Short UI strings (button labels in nav/footer that don't fit a content collection) go in `src/i18n/ui.ts`, with parallel translations.

### Styling

- Use Tailwind utility classes. Project tokens are defined in `src/styles/global.css` under `@theme`:
  - Colors: `bg-hatch-bg`, `bg-hatch-primary`, `bg-hatch-cta`, `bg-hatch-cta-hover`, `text-hatch-text`, `text-hatch-accent`, `border-hatch-nav`, etc.
  - Fonts: `font-display` (Fraunces — headings), `font-sans` (Inter — body).
  - Container width: use `max-w-[var(--container-site)]` (1120px).
- Do NOT inline raw hex colors. If you need a new color, add it to `@theme` first.
- Never write a `<style>` block with global CSS. Component-scoped Astro `<style>` is fine when truly local; otherwise prefer Tailwind.

### Git workflow

- `main` is production.
- Branches use a prefix:
  - `content/...` for copy-only changes
  - `feat/...` for new sections / components / pages
  - `fix/...` for bug fixes
- **No direct push to `main`.** All changes go through a Pull Request.
- Vercel posts a preview URL on every PR — use it to validate before merging.
- Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `content:`.

### Anti-patterns (don't do this)

- ❌ Hardcoded marketing copy in `.astro` files. Everything translatable lives in `src/content/...` or `src/i18n/ui.ts`.
- ❌ Raw hex colors inline. Use Tailwind utilities backed by `@theme` tokens.
- ❌ Pushing without running `pnpm build` locally — broken builds block deploys for everyone.
- ❌ Adding heavy client-side JS. Astro defaults to zero JS; if a section needs interactivity, prefer a small inline `<script>` or a focused island component.
- ❌ Touching `_reference/hatch_landing_page.html` — it's a frozen reference, not the source of truth.
- ❌ Renaming `src/content.config.ts` (Astro discovers it by exact name).

---

## Custom slash commands

Defined under `.claude/commands/`. Invoke as `/command-name [args]` from Claude Code.

| Command                      | What it does                                                                                                     |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `/new-section <Name>`        | Scaffolds a new section component + adds fields in `fr.md` and `en.md` + imports it in both page files           |
| `/translate <fr\|en> <path>` | Translates a Markdown file from one locale to the other, preserving structure and frontmatter                    |
| `/deploy-check`              | Runs `pnpm build` + `pnpm format:check`, surfaces any TODO/console.log left over, summarizes what's safe to push |

---

## Phase 2 — what's NOT done yet

The following are explicitly out of scope for the current skeleton and need to be tackled later (in roughly this order):

1. Convert the 10 sections from `_reference/hatch_landing_page.html` into Astro components: Nav, Hero, WhyHatch, Problems, HowItWorks, Agents, Pricing, FAQ, FinalCTA, Footer.
2. Port the inline JS behaviors: sticky nav theme switch, sticky scroll problem states (IntersectionObserver), agent tab switching, FAQ accordion, pricing toggle, hero trust carousel, animated paw trail.
3. Decide the i18n migration plan: today the reference HTML uses a JS `setLang()` swap. The new site will use Astro's native i18n routing (FR at `/`, EN at `/en/`) — better SEO, no flash. Sections that currently rely on the runtime `translations` object need to map to Markdown frontmatter or `ui.ts` strings.
4. Set up the GitHub repo + connect to Vercel + custom domain.
5. Add OG images, favicons, sitemap, robots.txt.

---

## When you're stuck or unsure

- For Astro 6 / Tailwind 4 specifics, **always verify with the official docs via Context7 MCP** — these libraries change quickly and your training data may be outdated. Resolve `/withastro/docs` and query specifically.
- For design questions (spacing, color, copy direction), check `_reference/hatch_landing_page.html` first — it is the visual source of truth.
- For "should this be code or content?" — default to content (Markdown) unless it's clearly structural.
