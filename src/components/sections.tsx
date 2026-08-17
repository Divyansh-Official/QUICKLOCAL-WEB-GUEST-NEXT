/**
 * The home page's sections, in the order they appear.
 *
 * All of them read from `@/lib/data`, so changing a fee in one JSON file
 * changes it on the page, in the pricing table and in the footer at once.
 *
 * Every section is a server component except the two that need state — the
 * category rail and the newsletter form. Marking the whole file `use client`
 * would ship the entire page's markup to the browser to be rebuilt there for
 * no reason.
 */
import { Icon, type IconName } from './Icon';
import { Reveal } from './Reveal';
import { Button, Card, Container, IconTile, SectionHeading } from './ui';
import { about, features, info, stats, steps, testimonials, trust } from '@/lib/data';

// ── trust strip ─────────────────────────────────────────────────────────────

/**
 * Sits across the seam between the hero and the page, overlapping both — the
 * device the mock uses to tie the two together.
 */
export function TrustStrip() {
  return (
    <Container className="relative z-10 -mt-8 sm:-mt-10">
      <Reveal anim="scale">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--line)] shadow-[0_16px_44px_-24px_rgba(26,23,19,.34)] sm:grid-cols-2 lg:grid-cols-4">
          {trust.map(t => (
            <div key={t.title} className="flex items-center gap-3 bg-[var(--surface)] px-4 py-4">
              <IconTile name={t.icon as IconName} size={38} />
              <div className="min-w-0">
                <p className="text-[13px] font-bold leading-tight">{t.title}</p>
                <p className="mt-0.5 text-[11.5px] leading-snug text-[var(--text-muted)]">
                  {t.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </Container>
  );
}

// ── stats band ──────────────────────────────────────────────────────────────

/**
 * The tangerine band.
 *
 * The mock fills it with growth numbers — 50K customers, 25K daily orders. The
 * platform has none of those yet, so this carries what it can actually stand
 * behind: the delivery radius, the time ceiling, the fee floor and the rider
 * minimum. Same rhythm, nothing invented. See stats.json.
 */
export function StatsBand() {
  return (
    <Container>
      <Reveal>
        <div className="ql-sheen relative overflow-hidden rounded-2xl bg-[linear-gradient(103deg,var(--color-tangerine-500),var(--color-tangerine-600))] px-5 py-7 sm:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 90} className="flex items-center gap-3.5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/18 text-white">
                  <Icon name={s.icon as IconName} size={20} />
                </span>
                <div className="min-w-0">
                  <p className="tnum text-[24px] font-extrabold leading-none text-white sm:text-[26px]">
                    {s.value}
                  </p>
                  <p className="mt-1 text-[12px] font-bold text-white/95">{s.label}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-white/70">{s.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>
    </Container>
  );
}

// ── how it works ────────────────────────────────────────────────────────────

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title="Simple steps, great experience"
          subtitle="Four stages, and the app tells you which one your order is in."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 110}>
              <Card className="relative h-full p-5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--color-tangerine-500)] text-[14px] font-extrabold text-white">
                  {s.n}
                </span>
                <h3 className="mt-4 text-[15px] font-bold leading-snug">{s.title}</h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--text-muted)]">
                  {s.body}
                </p>

                {/* The connector between cards. Only between them, and only
                    where they sit side by side — on a stacked layout an arrow
                    pointing right would point at nothing. */}
                {i < steps.length - 1 ? (
                  <span
                    aria-hidden
                    className="absolute -right-4 top-1/2 hidden -translate-y-1/2 text-[var(--color-cream-300)] lg:block">
                    <Icon name="arrow-right" size={20} />
                  </span>
                ) : null}
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ── why choose us + about ───────────────────────────────────────────────────

export function WhyAndAbout() {
  return (
    <section className="py-4 sm:py-8">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-14">
          {/* why */}
          <div>
            <Reveal anim="fade">
              <p className="text-[11.5px] font-extrabold uppercase tracking-[0.16em] text-[var(--color-tangerine-600)]">
                Why choose us
              </p>
            </Reveal>
            <Reveal delay={70}>
              <h2 className="mt-2.5 text-[26px] font-extrabold leading-tight tracking-tight sm:text-[31px]">
                Why choose {info.name}?
              </h2>
            </Reveal>
            <ul className="mt-6 space-y-3.5">
              {features.customers.map((f, i) => (
                <Reveal as="li" key={f} delay={90 + i * 70} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--color-ok)] text-white">
                    <Icon name="check" size={11} strokeWidth={2.8} />
                  </span>
                  <span className="text-[13.5px] leading-relaxed text-[var(--color-ink-700)]">{f}</span>
                </Reveal>
              ))}
            </ul>
            <Reveal delay={520}>
              <Button href="/services" size="md" icon="arrow-right" className="mt-7">
                Learn more about us
              </Button>
            </Reveal>
          </div>

          {/* about */}
          <div>
            <Reveal anim="fade">
              <p className="text-[11.5px] font-extrabold uppercase tracking-[0.16em] text-[var(--color-tangerine-600)]">
                About us
              </p>
            </Reveal>
            <Reveal delay={70}>
              <h2 className="mt-2.5 text-[26px] font-extrabold leading-tight tracking-tight sm:text-[31px]">
                {about.heading}
              </h2>
            </Reveal>
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={130 + i * 80}>
                <p className="mt-4 text-[13.5px] leading-relaxed text-[var(--color-ink-500)]">{p}</p>
              </Reveal>
            ))}
            <Reveal delay={420}>
              <Button href="/about" variant="outline" size="md" icon="arrow-right" className="mt-7">
                Know more about us
              </Button>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

// ── testimonials ────────────────────────────────────────────────────────────

/**
 * Renders NOTHING while there are no reviews.
 *
 * The mock shows three named customers with quotes and five-star ratings. There
 * are no reviews in the database, and inventing an endorsement attributed to a
 * named person is the one thing a testimonial cannot be. The section appears by
 * itself the day testimonials.json has an entry.
 */
export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading eyebrow="What our customers say" title="Loved by local shoppers" />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name + i} delay={i * 110}>
              <Card className="h-full p-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-tangerine-100)] text-[14px] font-extrabold text-[var(--color-tangerine-700)]">
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-[13.5px] font-bold leading-tight">{t.name}</p>
                    <p className="text-[11.5px] text-[var(--text-muted)]">{t.city}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-0.5 text-[var(--color-butter-400)]">
                  {Array.from({ length: 5 }, (_, n) => (
                    <Icon
                      key={n}
                      name="star"
                      size={14}
                      className={n < t.rating ? '' : 'opacity-25'}
                    />
                  ))}
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-[var(--color-ink-500)]">
                  {t.body}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ── app download ────────────────────────────────────────────────────────────

export function AppBand() {
  return (
    <Container className="py-4">
      <Reveal anim="scale">
        <div className="relative overflow-hidden rounded-[26px] bg-[var(--color-ink-950)] px-6 py-10 sm:px-10 sm:py-12">
          <div
            aria-hidden
            className="ql-drift pointer-events-none absolute -right-[8%] -top-[40%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(240,134,38,.30),transparent_65%)]"
          />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.25fr_1fr]">
            <div>
              <h2 className="text-[25px] font-extrabold leading-tight tracking-tight text-white sm:text-[30px]">
                Get the {info.name} app
              </h2>
              <p className="mt-3 max-w-[420px] text-[13.5px] leading-relaxed text-[var(--color-cream-300)]">
                {info.slogan}. Track every order to your door, and earn ₹
                {info.referral.rewardInr} for each friend who orders.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <StoreBadge icon="play" top="Get it on" bottom="Google Play" />
                <StoreBadge icon="apple" top="Download on the" bottom="App Store" />
              </div>

              <p className="mt-4 text-[11.5px] text-[var(--color-cream-300)]/70">
                Version {info.version} · Android and iOS
              </p>
            </div>

            {/* The three promises, as chips rather than a second phone mock. */}
            <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
              {[
                { icon: 'truck' as const, text: `Delivered within ${info.delivery.maxHours} hours` },
                { icon: 'shield-check' as const, text: 'Every vendor document-verified' },
                { icon: 'wallet' as const, text: `Refunds tracked end to end` },
              ].map((c, i) => (
                <Reveal as="li" key={c.text} delay={i * 100} anim="left">
                  <div className="flex items-center gap-3 rounded-2xl bg-white/6 px-4 py-3.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--color-tangerine-500)] text-white">
                      <Icon name={c.icon} size={17} />
                    </span>
                    <span className="text-[12.5px] font-semibold text-[var(--color-cream-100)]">
                      {c.text}
                    </span>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </Container>
  );
}

/**
 * A store badge that does not lie about being a link.
 *
 * The apps are not published yet, so these are buttons that say so rather than
 * anchors to a store page that would 404. When the listings exist this becomes
 * an <a href> and nothing else changes.
 */
function StoreBadge({ icon, top, bottom }: { icon: IconName; top: string; bottom: string }) {
  return (
    <span
      title="Coming soon to the stores"
      className="inline-flex cursor-default items-center gap-2.5 rounded-xl border border-white/15 bg-white/6 px-4 py-2.5">
      <Icon name={icon} size={22} className="text-white" />
      <span className="leading-tight">
        <span className="block text-[9.5px] uppercase tracking-wide text-[var(--color-cream-300)]">
          {top}
        </span>
        <span className="block text-[13px] font-bold text-white">{bottom}</span>
      </span>
      <span className="ml-1 rounded-md bg-[var(--color-tangerine-500)] px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-white">
        Soon
      </span>
    </span>
  );
}
