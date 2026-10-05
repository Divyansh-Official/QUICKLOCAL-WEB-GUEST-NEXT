# QuickLocal — public site

The front door for customers, shop owners and delivery partners: what
QuickLocal is, what it costs, and how to join it.

Next.js 16 App Router · React 19 · Tailwind v4 · TypeScript · Manrope.
Every route prerenders to static HTML; nothing talks to the backend.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # 16 static routes
npm run lint
```

The previous version of the site is kept, untouched and unused, in
[`legacy/`](legacy/README.md).

---

## Every word comes from JSON

Nothing visible is typed into a component. `src/data/` holds two kinds of file:

| File | Holds |
|---|---|
| `info.json`, `fees.json`, `riders.json`, `plans.json`, `categories.json`, `lifecycle.json`, `stats.json`, `steps.json`, `trust.json`, `features.json`, `about.json`, `contact.json`, `app.json`, `testimonials.json`, `nav.json` | **Platform facts.** Each opens with a `_source` naming the table, migration or class it mirrors. Keys starting with `_` are notes and never render. |
| `site.json` | Switchboard: default appearance (system / light / dark), feature flags (`themeToggle`, `tabBar`, `scrollProgress`, `pageTransitions`). |
| `ui.json` | Interface copy — header, menu, tab bar, footer, 404, errors. |
| `home.json` | Every section of the home page, top to bottom. |
| `pages.json` | Every inner page. |
| `faq.json` | Questions, answered only from rules the platform enforces. |

Copy refers to figures as **`{tokens}`** — `"₹{riderMin} floor for every rider"`.
`fill()` in `src/lib/data.ts` resolves them from the platform files, so a fee
changed in `fees.json` changes in every sentence that quotes it. The token list
is `tokens` in the same file.

`testimonials.json` is empty on purpose: there are no real reviews yet, and the
section renders itself the day one is added.

## Pages

| Route | Sections |
|---|---|
| `/` | Hero with a 3D phone tracking a real order → guarantees ribbon → scroll-lit statement → category shelf → bento → numbers band → how it works → every order state → cost estimator → three audiences → rider tiers → about → app band → FAQ → newsletter |
| `/services` | Category cards → how delivery works → refer & earn |
| `/services/[slug]` | **The page a category card zooms open into** — 3D slab, fee, what shops list, what a shop keeps, the aisle's numbers, other aisles |
| `/for-business` | Vendor and rider tracks → earnings with a distance slider |
| `/pricing` | Plan cards → full comparison → platform fee by category |
| `/get-the-app` | Store badges (marked *Soon* until `app.json` says otherwise) → onboarding for each role |
| `/about`, `/contact` | Story, principles · channels with copy buttons, FAQ |

Plus `sitemap.xml`, `robots.txt`, a 404, an error boundary, and a generated
1200×630 social card (`app/opengraph-image.tsx`) built from the same JSON, so a
shared link never quotes a stale fee.

## Design

Cream & Tangerine — the palette the console and the apps ship — now with a
night form. Every colour is a token in `globals.css`, defined once for light
and once for dark; components never know which they are drawn in. Visitors
choose Light, Dark or Auto from the header or the footer; the new theme opens
out of the button as a widening circle (a View Transition), and the choice is
applied by an inline script before first paint, so nothing flashes.

**3D, in CSS.** `Slab3D` is a rounded tile with real thickness — layers along
Z, seen from an isometric angle — that turns under the pointer. `Phone3D` is a
handset with a body, glare and glass chips floating at different depths; it
leans toward the pointer on a spring and straightens as the page scrolls, and
its screen walks the real `OrderStatus` sequence with a rider riding the route.
`Tilt` makes cards lean toward the pointer and catch the light.

**Liquid glass.** `LiquidGlass` refracts the page behind it (ray-traced
displacement map, chromatic dispersion, Fresnel rim — `lib/liquidGlass.ts`) in
Chromium and falls back to frosted glass elsewhere. Its tint comes from the
theme, so it reads on cream and on charcoal, and the header turns to dark glass
over night sections.

### The performance rule

Every backdrop-filtered surface is a GPU pass redone whenever anything behind
it moves. So **real refraction is reserved for the chrome**: the header and
the phone tab bar. The Back control is frosted (blur and tint, no bend). Every
other glass surface — cards,
chips, buttons, panels — is `.glass`: light, rim and shadow from paint alone,
free per frame. Removing the backdrop passes from the content took the
measured scroll frame time from ~60 ms to ~17 ms in software rendering.

### Contrast

Text colours hold WCAG AA on cream: secondary text 7.6:1, captions 5.0:1,
brand-coloured text 5.4:1, green status text 5.1:1. The headline gradient is
deep enough for 3:1 as display type; the bright tangerine is kept for fills.

## Motion

No animation library. Motion is CSS, Web Animations and View Transitions:

| What | How | Where |
|---|---|---|
| Category card zooms open into its page; Back shrinks it home | fixed overlay beneath the header, Web Animations | `lib/morph.ts`, `motion/MorphLink`, `motion/MorphBack` |
| Content rises in and vanishes under the header | scroll-driven animations on registered properties | `motion/Reveal`, `[data-reveal]` |
| Hero copy recedes as you scroll | scroll timeline | `[data-vanish]` |
| The statement lights up word by word | view timeline | `sections/shared/Statement` |
| Icons draw themselves / hop on hover (SF Symbols style) | stroke dash on a view timeline | `Icon effect="draw" \| "bounce"` |
| Figures count up on arrival | one-shot observer | `ui/CountUp` |
| Springs on presses, menus, segmented pills | SwiftUI curves sampled into `linear()` | `--spring-*` in `globals.css` |
| Tab bar minimises while scrolling down | one passive listener | `layout/TabBar` |

Nothing is hidden waiting for JavaScript. With scripts off, with reduced motion,
or with `?nomotion` in the URL (clean screenshots), every element renders in
its final state.

## Layout

```
src/
  app/            one route per page, plus sitemap, robots, 404, error
  components/
    layout/       SiteHeader, MobileMenu, TabBar, SiteFooter, Logo, Backdrop
    motion/       Enter, Reveal, MorphLink, MorphBack, MorphProvider, PageTransition, HeadScript
    glass/        LiquidGlass, GlassFilter
    ui/           Button, Icon, Slab3D, Tilt, SegmentedControl, Shelf, Accordion, CountUp, ThemeToggle…
    art/          Phone3D, Trio
    sections/     home/* and shared/*
  data/           the JSON above
  lib/            data (tokens, fill), morph, liquidGlass, liquidMotion, hooks, format
legacy/           the previous site, excluded from build, lint and type-check
```

## Verified

At 320, 375, 390, 768, 1024, 1280, 1440 and 2560 px, in light and dark, on
every route: no horizontal page scroll, no console errors. Type-check, lint and
production build run in CI on every push (`.github/workflows/ci.yml`).
