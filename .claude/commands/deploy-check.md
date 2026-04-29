---
description: Pre-push safety check — runs the production build, format check, and surfaces leftover TODOs / debug code.
---

You are running a pre-push safety check on the Hatch website repo.

## Steps

1. **Working tree status** — run `rtk git status`. Note any uncommitted changes.

2. **Production build** — run `rtk pnpm build`. The build MUST pass with zero errors. Capture warnings if any.

3. **Format check** — run `rtk pnpm format:check`. If files would be reformatted, list them.

4. **Locale parity** — read `src/content/landing/fr.md` and `src/content/landing/en.md`. Confirm both files have the EXACT same set of frontmatter keys. List any missing keys per locale.

5. **Leftover artifacts** — grep the repo for these patterns and report any hits with file:line:
   - `TODO`, `FIXME`, `XXX`, `HACK`
   - `console.log`, `console.debug`, `debugger`
   - `// @ts-ignore`, `// @ts-nocheck`
   - Skip the `_reference/` and `node_modules/` folders.

6. **Bundle sanity** — after the build, confirm `dist/index.html` and `dist/en/index.html` both exist.

## Output format

Produce a concise report with this structure:

```
✅ / ❌ Build           — <summary>
✅ / ❌ Format          — <summary>
✅ / ❌ Locale parity   — <summary>
✅ / ❌ Clean code      — <summary, list hits if any>
✅ / ❌ Bundle sanity   — <summary>

VERDICT: SAFE TO PUSH / NEEDS FIXES
```

If anything failed, list the exact files / lines to fix and STOP. Do not push or commit anything yourself — the human pushes.
