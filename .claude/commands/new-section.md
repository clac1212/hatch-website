---
description: Scaffold a new landing section — component, content fields in FR + EN, and import it into both pages.
argument-hint: <SectionName> (PascalCase, e.g. Pricing, Testimonials)
---

You are creating a new landing-page section called `$1` for the Hatch website.

## Strict requirements

1. **Component** — Create `src/components/$1.astro`. The component:
   - Receives its content via `Astro.props` (no hardcoded marketing copy).
   - Uses Tailwind utility classes only — no inline `<style>` blocks, no raw hex colors.
   - Uses Hatch design tokens from `src/styles/global.css` (e.g. `bg-hatch-primary`, `text-hatch-cta`, `font-display` for headings, `font-sans` for body).
   - Wraps its content in `<section class="mx-auto max-w-[var(--container-site)] px-8 py-24">`.
   - Includes a heading (h2) using `font-display`.

2. **Content schema** — Update `src/content.config.ts`:
   - Extend the `landing` collection's Zod schema with the new fields the section needs (e.g. `pricingTitle: z.string()`, `pricingTiers: z.array(...)`).
   - Make every field strictly typed — no `z.any()`, no implicit optionals unless the field is genuinely optional.

3. **Markdown content** — Update BOTH `src/content/landing/fr.md` AND `src/content/landing/en.md`:
   - Add the new fields in the frontmatter.
   - Fill them with realistic placeholder copy in the right language ("Lorem ipsum" is forbidden — write something plausible for an AI-native franchise OS).
   - The two locales must have the EXACT same set of frontmatter keys.

4. **Pages** — Update BOTH `src/pages/index.astro` AND `src/pages/en/index.astro`:
   - Import the new component.
   - Render it after the hero block, passing values from `entry.data`.

5. **Verification** — After making the changes:
   - Run `pnpm build` and confirm it passes (the Zod schema will catch any frontmatter mismatch).
   - Report the diff summary to the user (files touched, new fields added).
   - Tell the user the next step: review the placeholder copy in `fr.md` / `en.md` and tweak it.

## Anti-patterns (do NOT do these)

- ❌ Hardcoding marketing copy in the `.astro` component.
- ❌ Adding the section in only one of the two pages or only one of the two `.md` files.
- ❌ Using a different field name in `fr.md` vs `en.md`.
- ❌ Inventing a new color outside `@theme` in `src/styles/global.css`.
- ❌ Skipping the `pnpm build` verification.
