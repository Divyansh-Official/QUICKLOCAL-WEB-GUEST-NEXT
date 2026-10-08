# QuickLocal — public site

The front door for customers, shop owners and delivery partners: what
QuickLocal is, what it costs, and how to join it.

Next.js 16 App Router · React 19 · Tailwind v4 · TypeScript · Manrope.
Every route prerenders to static HTML; nothing talks to the backend.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # 25 static pages
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

### Where the figures come from

The platform files mirror the backend's **latest** branch (`Phase-06`), not its
default branch, which is far behind. The ones that matter most:

- **Six permanent categories** — Grocery, Hardware, Furniture, Fashion,
  **Toys** and Others.
- **Nothing private is published.** No commission, no admin-console workings, no security mechanics (lockout counts, internal check intervals), nothing about any customer, shop or rider — only what a customer can see in the app.
- **Commission is never published.** No platform-fee or commission figure
  appears on the site, in its copy, or in the data its pages ship to the
  browser — by decision. `categories.json` and `fees.json` deliberately carry
  no fee percentages, so nothing can leak by accident.
- **A rider is paid the order's whole delivery fee**: ₹30 for the first 4 km,
  then petrol ÷ mileage × 2.5 per km beyond, rounded up
  (`SplitPayoutService.driverAmount`). The ₹20 + ₹5/km figures in app_config
  are only a fallback for an order with no fee, so the site never quotes them.
- **Radius**: 4 km by default, widened in steps of 4 up to 20 km; checkout
  refuses anything farther.
- **Plans**: Free ₹0 / 5 products, Starter ₹99 / 25, Growth ₹299 / 100,
  Pro ₹499 / unlimited. A plan's boosts are how many **paid** boosts it may
  run a month (0 / 0 / 1 / 4), not boosts given free.

The money arithmetic lives once, in `src/lib/fees.ts`, as pure functions that
copy the services line for line — the estimator, the rider slider and the
shop's delivery tool all run it, and the server uses it for the figures it prints.

`testimonials.json` is empty on purpose: there are no real reviews yet, and the
section renders itself the day one is added.

## Pages

| Route | Sections |
|---|---|
| `/` | Hero with a 3D phone tracking a real order → guarantees ribbon → scroll-lit statement → category shelf → bento → numbers band → how it works → every order state → cost estimator → three audiences → rider tiers → about → app band → FAQ → newsletter |
| `/how-it-works` | **One order as a scroll story** — a sticky handset whose screen changes scene as each of eight steps crosses the middle of the screen, turning as you go → every order state → the four clocks on every order |
| `/services` | Six category cards → events band → how delivery works → refer & earn |
| `/events` | **Events & offers** — a phone where an event's tab slides into the rail after All → example occasions → offer tickets and their rules → an event's life → always-on savings |
| `/app` | **Inside the app** — an eight-screen tour in the scroll story (home rails, For you, aisles, search, stores, saved, inbox, notification settings) → a stack of order messages → how ratings work |
| `/services/[slug]` | **The page a category card zooms open into** — 3D slab, what shops list, what delivery costs, the aisle's numbers, other aisles |
| `/sell` | For shops — **free delivery, your call** (who funds a delivery at any threshold, order and distance) → documents → plans → paid boosts → four steps to live |
| `/deliver` | For riders — what a delivery pays, on a slider → **pick your vehicle, see your papers** → 3D tier medals → the rules that protect a rider's time |
| `/safety` | Verification, the codes at both ends, money that waits for the order (each with scroll-driven art) → the clocks → the checks nobody sees |
| `/help` | **Help Centre** — every question, searchable as you type, filtered by who is asking, shareable as `?q=…&topic=…`, published as FAQPage data |
| `/try` | **Try a sample order** — a working phone: pick an aisle, fill a basket, choose the shop's distance and pay; then every real order state, both codes and where the money went. Made-up shop and prices, labelled; nothing is sent |
| `/offline` | What the service worker shows for a page never opened on this device, when there is no signal. Not indexed |
| `/for-business` | Both partner tracks side by side, linking to `/sell` and `/deliver` |
| `/pricing` | Plan cards → full comparison |
| `/get-the-app` | Store badges (marked *Soon* until `app.json` says otherwise) → onboarding for each role |
| `/about`, `/contact` | Story, principles · channels with copy buttons, FAQ |

Plus `sitemap.xml`, `robots.txt`, a 404, an error boundary, and a generated
1200×630 social card (`app/opengraph-image.tsx`) built from the same JSON, so a
shared link never quotes a stale fee.

## Finding your way

| What | Where |
|---|---|
| The header has five entries — Services, Events, **Explore ▾**, **Partners ▾**, Help — the two menus opening as glass flyouts (hover, click or ↓ from the keyboard). The phone menu shows four pages large and the rest in the same two groups. Every page is also in the footer and in search | `data/nav.json`, `layout/NavFlyout`, `layout/MobileMenu` |
| Search: ⌘K / Ctrl+K or `/` anywhere, the magnifier in the header, or the field at the top of the phone menu. Pages, sections, aisles and every Help answer, matched as you type. The index is one static file, `/search-index.json`, fetched only when search opens | `search/SearchDialog`, `lib/search.ts`, `data/search.json` |
| Share: a chip beside every page's breadcrumb — the system share sheet where there is one, otherwise the link is copied | `ui/ShareButton` |
| Installable: a web app manifest, and a small service worker — pages network-first and kept for offline, build assets cache-first. It is registered as `/sw.js?v=<commit>`, so each deploy installs a fresh one and clears the last deploy's caches. An Install card on Get the App and in the phone menu appears only where installing works (not in in-app browsers) | `app/manifest.ts`, `public/sw.js`, `pwa/*` |
| Link previews: every page and every aisle has its own Open Graph card, title, description and canonical URL; breadcrumbs and Help publish structured data | `lib/og.tsx`, `lib/seo.ts`, `*/opengraph-image.tsx` |

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
| Category card opens into its page — the panel by clip-path, the 3D tile flown by transform to its place; Back reverses it and returns step by step | one fixed panel beneath the header, Web Animations, no layout animation | `lib/morph.ts`, `motion/MorphLink`, `motion/MorphBack` |
| Content rises out of depth (translateZ + rotateX) and only tilts away once it is well past the header | scroll-driven animations on registered properties | `motion/Reveal`, `[data-reveal]` |
| On phones, card grids become swipeable rails: cards snap to centre, the ones beside it recede in 3D (coverflow), and dots track the position | CSS scroll-snap + `view(inline)` timelines | `.m-rail`, `ui/RailDots` |
| Hero copy tilts back and recedes in Z as you scroll | scroll timeline | `[data-vanish]` |
| The statement lights up word by word | view timeline | `sections/shared/Statement` |
| Icons draw themselves / hop on hover (SF Symbols style) | stroke dash on a view timeline | `Icon effect="draw" \| "bounce"` |
| Figures count up on arrival | one-shot observer | `ui/CountUp` |
| Springs on presses, menus, segmented pills | SwiftUI curves sampled into `linear()` | `--spring-*` in `globals.css` |
| Tab bar minimises while scrolling down | one passive listener | `layout/TabBar` |
| The How It Works handset changes scene and turns as the story scrolls | one IntersectionObserver + a named view timeline | `sections/how/Journey` |
| Clock rings fill; documents fan out and tick; a code types itself; money moves in order | view timelines | `sections/shared/Clocks`, `sections/safety/Pillars` |
| Tier medals flip a full turn on hover | CSS 3D on a spring | `art/Medal3D` |
| A help search re-flows its results; a vehicle's papers fold away | View Transitions; grid rows `1fr → 0fr` | `sections/help/HelpCentre`, `sections/partners/VehiclePicker` |

Nothing is hidden waiting for JavaScript. With scripts off, with reduced motion,
or with `?nomotion` in the URL (clean screenshots), every element renders in
its final state.

### Phones

Below 640px the type scale, section spacing and tiles are compacted, and the
repeating card grids (bento, steps, plans, tiers, offers, reviews, guarantees,
the How It Works story) turn into horizontal rails, so a section reads as one
screen you swipe through rather than a column you scroll past. Add `m-rail`
(and optionally `m-rail-wide`, or `--rail-w`) to a grid, and put `<RailDots
count={n} />` straight after it. Tablet and desktop layouts are untouched.

A phone density layer in `globals.css` (the first `max-width: 639.98px`
block) sets the phone type scale, 44px section rhythm, slimmer buttons and
card insets for every page at once. Phone-only pieces on top of it:

| What | Where |
|---|---|
| A sticky "on this page" chip bar on Home that lights the section in view and glides to any other | `ui/QuickJump`, `home.json → jump` |
| Long copy folded to its first paragraph with a Read more toggle | `ui/ReadMore` |
| Footer link columns folded into rows that open in place (native `<details>`) | `layout/SiteFooter` |
| Home FAQ trimmed to four, with All questions one tap away | `FaqSection phoneLimit` |
| Hero categories, document lists and fact strips as compact chips and tiles | `HomeHero`, `FactGrid`, `VehiclePicker`, `/sell` |

## Layout

```
src/
  app/            one route per page, plus sitemap, robots, 404, error
  components/
    layout/       SiteHeader, MobileMenu, TabBar, SiteFooter, Logo, Backdrop
    motion/       Enter, Reveal, MorphLink, MorphBack, MorphProvider, PageTransition, HeadScript
    glass/        LiquidGlass, GlassFilter
    ui/           Button, Icon, Slab3D, Tilt, SegmentedControl, Shelf, Accordion, CountUp, ThemeToggle…
    art/          Phone3D, PhoneShell, Medal3D, Trio
    sections/     home/*, how/*, partners/*, safety/*, help/* and shared/*
  data/           the JSON above
  lib/            data (tokens, fill), fees, morph, liquidGlass, liquidMotion, hooks, format
legacy/           the previous site, excluded from build, lint and type-check
```

## Verified

At 320, 375, 390, 768, 1024, 1280, 1440 and 2560 px, in light and dark, on
every route: no horizontal page scroll, no console errors. Every route has one
h1, no skipped heading levels, no duplicate ids, no unnamed links or buttons,
its own title, description, canonical URL and preview card, and every internal
link and #anchor resolves.

Performance: the page's own style rules, not its scripts, are the main-thread
cost, so avoid `:has()` on `html` or `body` — one such rule
(`html:has(dialog[open])`) re-styled the whole page for every streamed chunk of
HTML and cost about 40% of the home page's blocking time. Sheets lock the page
with `lockPage()` instead. Type-check, lint and
production build run in CI on every push (`.github/workflows/ci.yml`).
