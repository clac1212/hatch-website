---
description: Scaffold a new home section — component, strict content block in FR + EN, and wire it into the shared home view.
argument-hint: <SectionName> (PascalCase, e.g. Pricing, Clients)
---

You are creating a home-page section called `$1` for the Hatch website (v2). Read `CLAUDE.md` first.

## Steps

1. **Design reference**: find the section in the Pencil project (`pencil-new.pen`, via the Pencil MCP tools; never read `.pen` files directly) and its behaviour and copy in the prototype `prototypes/site/index-v4.html` (+ `site.js`, `sections/*.html`). Port the behaviour and the copy, never the exported markup.

2. **Schema**: in `src/content.config.ts`, add a `<sectionKey>: z.strictObject({...})` block to the `home` schema. Every field is strictly typed; `optional()` only when the design genuinely allows the field to be absent.

3. **Content**: add the block to BOTH `src/content/home/fr.yaml` and `src/content/home/en.yaml` with the real copy from the prototype (FR) and its translation (EN). The strict schema fails the build if the keys differ.

4. **Component**: create `src/components/sections/$1.astro`:
   - Receives its data and `locale` via props, with no hardcoded copy.
   - A `<section>` with an `id` if the nav links to it, a kicker in `font-mono text-kicker uppercase text-orange-txt`, and an `h2` in `font-display text-section`.
   - Tailwind utilities backed by the DS tokens only. No raw hex, no `orange` as text, no decorative gradients.
   - Mobile first: write the small-screen layout, then the `md:`/`lg:` overrides.
   - Images from `src/assets/` through `<Image>`/`<Picture>` with meaningful `alt` (or `alt=""` if decorative).
   - Any behaviour goes in a `<script>` (vanilla TS) that respects `prefers-reduced-motion` and leaves the content readable without JS.

5. **Wire**: render it in `src/views/HomePage.astro` at its place in the validated order, passing `home.data.<sectionKey>` and `locale`.

6. **Verify**: `pnpm build` must pass; `pnpm format`; check the section at 1440 px and 390 px.
