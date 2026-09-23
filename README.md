# QuickLocal — public site

The marketing front door: what QuickLocal is, what it costs, and how to join it
as a customer, a vendor or a delivery partner.

Same stack and same design system as the admin console
(`QUICKLOCAL-WEB-FRONTEND-REACT`), so the two read as one product — Next.js
16.2 App Router, React 19.2, Tailwind v4, TypeScript, Manrope.

```bash
npm install
npm run dev     # http://localhost:3200
npm run build   # 7 static routes, no server needed
```

---

## It does not talk to the backend

There is no API client in this project, no `NEXT_PUBLIC_API_BASE_URL`, and
nothing to configure. Every figure on every page is imported from a JSON file
in `src/data/` at build time, so the whole site prerenders to static HTML: it
cannot show a spinner, cannot show a stale number, and cannot break when the
backend is down.

| File | Holds | Where the values came from |
|---|---|---|
| `info.json` | name, tagline, delivery radius/time, fees, referral, rider payout | `app_config` — V21 and V25 seeds |
| `categories.json` | the 5 live categories + their platform fee | `categories` after V34 |
| `plans.json` | FREE / STARTER / GROWTH / PRO and their feature flags | `subscription_plans` — V17 and V37 |
| `contact.json` | phone, email, address, socials | published support contacts |
| `stats.json` | the four figures in the orange band | `app_config` (see below) |
| `fees.json` | every constant the cost estimator runs on | `DeliveryFeeCalculatorService`, V34, `VendorDeliveryThresholdService` |
| `lifecycle.json` | the nine order states, happy and not | `OrderStatus.java`, `PaymentStatus.java` |
| `riders.json` | payout model, badge tiers, documents required | `DeliveryBadgeService`, `BadgeLevel.java`, `DocumentType.java`, `app_config` |
| `trust.json`, `steps.json`, `features.json`, `about.json` | the copy blocks | platform behaviour |
| `testimonials.json` | customer quotes | `reviews` — **empty** |
| `nav.json` | header and footer links | — |

Every file opens with a `_source` key naming the table or migration behind it.
Keys beginning with `_` are notes and are never rendered. **When a fee or a
radius changes in the backend, change it in the JSON here too** — that is the
one maintenance cost of not fetching.

## Three places this deviates from the mock, and why

The design was built before the data existed. Where the two disagreed, the data
won.

**The stats band.** The mock reads *50K+ Happy Customers · 5K+ Local Vendors ·
25K+ Orders Delivered Daily · 15+ Cities*. The platform has a handful of test
records. Printing those numbers would be a claim the database flatly
contradicts, so the band carries four facts that are true and still worth
saying: 5 km delivery radius, a 3-hour ceiling, a ₹15 minimum delivery fee, and
a 2% platform fee on grocery. Same rhythm, nothing invented.

**Testimonials.** The mock has three named customers with quotes and five-star
ratings. There are no reviews, and an invented endorsement attributed to a named
person is the one thing a testimonial cannot be. `Testimonials` returns `null`
while `testimonials.json` is empty, and the section will appear by itself the
day a real review is added to it.

**The hero image.** The mock shows a screenshot of the operations console. That
screen is for staff, and a real capture of it would publish internal figures and
vendor names to anyone who loads the page. The hero instead draws the order
tracking a customer actually gets, built from the real `OrderStatus` sequence.

Smaller ones: the nav has no **Blog** (no posts, and a link to an empty page is
worse than no link), **Contact** has no form (nothing here can store a message,
so it sends you to a mailbox somebody reads), and the store badges say **Soon**
because the apps are not published.

## The cost estimator

`FeeEstimator` runs the **same arithmetic the backend runs** when an order is
placed, rather than an approximation of it:

```
fuelCostPerKm = petrolPrice / mileage            106 / 45
extraFee      = ceil(extraKm × fuelCostPerKm × multiplier)    × 2.5
deliveryFee   = baseFee + extraFee               30 + extraFee
```

Cross the vendor's free-delivery threshold and the **base** moves from the
customer to the shop; the per-km part stays with the customer and the rider is
paid the whole fee either way. That rule is the most surprising thing in the
model and the hardest to explain in a sentence, so the basket is a slider with
the threshold marked on it and you can watch the split jump as it crosses.

Every constant lives in `fees.json` and names the backend constant it mirrors,
because a public page that quotes a fee has to be checkable. **If the service
changes, change `fees.json`** — the estimator will otherwise keep confidently
quoting the old number.

## Two sections that publish the enums

**`OrderLifecycle`** lists the nine real `OrderStatus` constants in their real
order, with the constant printed beside each label so what the site says can be
matched against what the app shows. The three that are not a happy ending —
`CANCELLED`, `REFUND_INITIATED`, `REFUNDED` — are on the page too, because they
are the states a nervous customer most wants named *before* ordering. The
timeline walks itself while it is on screen and hands control over permanently
on the first click; under Reduce Motion it is still and shown complete.

**`RiderTiers`** publishes the payout model (₹20 base, ₹5/km, ₹30 floor) and
the exact promotion thresholds `DeliveryBadgeService` uses — 50, 200 and 500
deliveries at 3.5, 4.0 and 4.5. Rounding those to "hundreds of deliveries"
would make the ladder unfalsifiable, which is the opposite of the point. The
caveat that a dipping rating does not demote automatically is on the page as
well: it is true, it is in the rider's favour, and hiding it would make the
tiers read as harsher than they are.

## Liquid glass

The site uses the console's glass material, ported as-is: `lib/liquidGlass.ts`
ray-traces a light ray through a curved bezel with Snell's law and bakes the
2D offset field into a PNG that `feDisplacementMap` consumes, and `GlassPane`
applies it through `backdrop-filter`.

The thing to know before moving any of it: **refraction bends a backdrop, so
bending a flat backdrop shows nothing.** Glass over plain cream is an expensive
border. That is what `Backdrop` is for — a fixed field of warm drifting colour
and a 26px weave, painted once behind the whole document, giving every glass
surface something to bend. Move a pane off it and the effect silently
disappears.

Maps are cached by size on an 8×4px grid and built a few per frame; anything
below the fold only refracts once it is on screen. Only Chromium resolves an
SVG filter inside `backdrop-filter` — everywhere else it degrades to tint, blur
and rim, which still reads as glass, just without the bend.

## Layout

```
src/
  app/               one route per nav item, all statically rendered
  components/        Header, Footer, Hero, Categories, Newsletter, sections, ui, Icon, Logo, Reveal
    Backdrop.tsx        the field every glass surface sits on
    FeeEstimator.tsx    the order-cost calculator
    OrderLifecycle.tsx  the nine real order states, walking
    RiderTiers.tsx      payout model and badge ladder
    glass/           GlassPane + GlassFilter, ported from the console
  data/              the JSON above — the only source of content
  lib/data.ts        typed loaders + ₹ formatting
  lib/liquidGlass.ts the refraction maths
```

Client-side: `Header` (scroll state, mobile sheet), `Categories` (the scroll
rail), `Newsletter` (form state), `FeeEstimator` (the sliders),
`OrderLifecycle` (the walk), `Reveal`, and
`ui` — the shared `Card` is a glass surface, so the module carries the
boundary. Everything else renders on the server.

## Motion

Hand-rolled in `globals.css` rather than pulling in an animation library, the
same way the console does it. Everything animates `transform` and `opacity`
only, so it runs on the compositor and never forces layout mid-scroll.

The glass surfaces added their own small vocabulary, deliberately **not**
reusing the names already in the file — `ql-sheen` and `ql-float` were taken,
by the stats band's endless band and the scene illustrations' bob, and
redefining either would have changed them everywhere they were already used:

| Class | Does |
|---|---|
| `ql-glint` | a highlight sweeping across a glass surface on hover — the one thing real glass does that a displacement map cannot show, since refraction bends what is *behind* a surface rather than lighting the surface itself |
| `ql-bob` | a slow buoyant rise and fall, for a piece that should read as floating on the field |
| `ql-live` | the pulsing ring around the one timeline step that is happening now |
| `ql-stagger` | children arrive one after another; set `--i` per child |

All four are switched off in the reduced-motion block at the bottom.

`Reveal` shares **one** IntersectionObserver across every element on the page
and unobserves each after it fires. It marks everything visible if
`IntersectionObserver` is missing — the failure mode of an animation must never
be an invisible page — and the whole system is disabled under
`prefers-reduced-motion`, with `.reveal` forced back to `opacity: 1`.

## Responsiveness

Verified at **320px and 375px** on all seven routes and at desktop width: zero
horizontal page scroll anywhere (`scrollWidth === clientWidth`), nothing
overflowing its container, and the category rail swipes natively on touch. The
estimator's controls stack below `md` and its sliders carry 24px thumbs so they
clear the minimum touch target without the track growing with them.

The mobile menu is a full sheet that locks the page behind it and closes on
Escape, on the backdrop and on any link. It is a **sibling** of the bar, not a
child: the bar carries `backdrop-filter`, which makes an element a containing
block for its `position: fixed` descendants, and nesting the sheet inside it
collapses the sheet to the height of the bar the moment you scroll.

## CI

Typecheck, lint and a production build on every push — see
`.github/workflows/ci.yml`. This site is the front door, so a broken build here
is not an internal inconvenience.
