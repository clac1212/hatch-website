---
description: Translate a Markdown content file from one locale to the other, preserving structure and frontmatter keys.
argument-hint: <source-locale> <target-locale> <path-to-source-md>  (e.g. fr en src/content/landing/fr.md)
---

You are translating a content file in the Hatch website repo.

- Source locale: `$1`
- Target locale: `$2`
- Source file: `$3`

## Strict requirements

1. **Read** the source file at `$3`.
2. **Determine the target file path**: replace the source locale segment in `$3` with the target locale segment. For example: `src/content/landing/fr.md` → `src/content/landing/en.md`.
3. **Translate** every value in the YAML frontmatter AND every line of the Markdown body from `$1` to `$2`.
4. **Preserve EXACTLY**:
   - The set of frontmatter keys (do not add, remove, or rename keys).
   - Markdown structure: headings, lists, blockquotes, links, code blocks, line breaks.
   - YAML formatting: same quoting style as the source (single quotes for strings containing apostrophes), same indentation.
   - Inline brand terms that should not be translated: "Hatch", product names ("Peep", "Jay", "Sparrow", "Rook", "Piper", "Kite"), technical labels (URLs, slugs, code identifiers).
5. **Marketing tone**: keep claims concise and assertive. Avoid literal/awkward translations. Examples:
   - FR "L'OS AI-native pour vos réseaux" → EN "The AI-native OS for your networks" (not "The AI-native operating system…").
   - EN "Book a demo" → FR "Demander une démo" (not "Réserver une démo").
6. **Write** the result to the target file (overwrite if it exists, after confirming the keys match).
7. **Verify**:
   - Run `pnpm build` — if Zod schema catches a missing/extra field, fix it.
   - Diff the frontmatter keys between source and target. They must be identical.
8. **Report** to the user:
   - The path of the file written.
   - Any term where you were unsure of the best translation (so the user can review).

## Anti-patterns (do NOT do these)

- ❌ Inventing new frontmatter keys.
- ❌ Translating brand names ("Hatch" stays "Hatch" in every locale).
- ❌ Reformatting the YAML (e.g. switching from single to double quotes) — match the source style.
- ❌ Skipping the build verification.
- ❌ Auto-merging or pushing — translation is a draft for the user to review.
