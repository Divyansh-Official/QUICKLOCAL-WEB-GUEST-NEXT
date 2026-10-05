# legacy/

The previous version of the QuickLocal public site, kept exactly as it was
before the 2026 redesign. Nothing here is built, linted, type-checked or
served:

- `tsconfig.json` excludes `legacy/`
- `eslint.config.mjs` ignores `legacy/**`
- `src/app/globals.css` tells Tailwind not to scan it (`@source not`)
- Next.js only routes `src/app`, so `legacy/v1/src/app` is never a route

`v1/src` is a byte-for-byte copy of the old `src/` (components, pages, data,
liquid-glass library). `v1/README.md` is its original README.
