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

## Layout

```
src/
  app/            one route per nav item, all statically rendered
  components/     Header, Footer, Hero, Categories, Newsletter, sections, ui, Icon, Logo, Reveal
  data/           the JSON above — the only source of content
  lib/data.ts     typed loaders + ₹ formatting
```

Only three components are client-side: `Header` (scroll state, mobile sheet),
`Categories` (the scroll rail), `Newsletter` (form state), plus `Reveal`.
Everything else renders on the server.

## Motion

Hand-rolled in `globals.css` rather than pulling in an animation library, the
same way the console does it. Everything animates `transform` and `opacity`
only, so it runs on the compositor and never forces layout mid-scroll.

`Reveal` shares **one** IntersectionObserver across every element on the page
and unobserves each after it fires. It marks everything visible if
`IntersectionObserver` is missing — the failure mode of an animation must never
be an invisible page — and the whole system is disabled under
`prefers-reduced-motion`, with `.reveal` forced back to `opacity: 1`.

## Responsiveness

Verified at 390px, 768px, 1024px and 1440px: no horizontal page scroll, nothing
overflowing its container, and the category rail swipes natively on touch. The
mobile menu is a full sheet that locks the page behind it and closes on
Escape, on the backdrop and on any link.
