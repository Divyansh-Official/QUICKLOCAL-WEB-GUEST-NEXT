/**
 * The hero.
 *
 * ── THE PREVIEW IS THE CUSTOMER APP, NOT THE ADMIN CONSOLE ──────────────────
 * The mock puts a screenshot of the operations console here. That is the wrong
 * artefact on a public page twice over: it is the screen staff use, not the one
 * a visitor is being invited into, and a real screenshot of it would publish
 * internal figures, vendor names and queue counts to anyone who loads the site.
 * So this is a drawn preview of the ORDER TRACKING a customer actually gets,
 * built from the same statuses the backend moves an order through.
 *
 * Drawn rather than photographed also means it stays sharp at any width, needs
 * no asset pipeline, and cannot go stale when the app is restyled.
 *
 * ── THE SEARCH BOX IS HONEST ABOUT BEING A SIGNPOST ─────────────────────────
 * There is no catalogue to search on a static site, so it does not pretend to
 * return results. It carries the query to the sign-up route, which is what the
 * button says it does.
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from './Icon';
import { Button, Container } from './ui';
import { Reveal } from './Reveal';
import { categories, contact, info } from '@/lib/data';

/** The four the tracker walks through — real OrderStatus values. */
const TRACKED = [
  { label: 'Order placed', at: '4:02 pm', done: true },
  { label: 'Shop accepted', at: '4:05 pm', done: true },
  { label: 'Rider assigned', at: '4:11 pm', done: true },
  { label: 'Out for delivery', at: 'now', done: false },
];

export function Hero() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  return (
    <section className="relative overflow-hidden pt-[calc(var(--header-h)+28px)] pb-16 sm:pb-20">
      {/* Colour wash. aria-hidden and pointer-events-none — it carries no
          meaning and must never intercept a click on the search box. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="ql-drift absolute -right-[14%] -top-[22%] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(240,134,38,.20),transparent_66%)]" />
        <div
          className="ql-drift absolute -left-[16%] top-[26%] h-[440px] w-[440px] rounded-full bg-[radial-gradient(circle,rgba(245,198,69,.16),transparent_68%)]"
          style={{ animationDelay: '-7s' }}
        />
      </div>

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_1fr] lg:gap-10">
          {/* ── copy ──────────────────────────────────────────────────────── */}
          <div>
            <Reveal anim="scale">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-tangerine-300)] bg-[var(--color-tangerine-100)] px-3 py-1.5 text-[11.5px] font-bold text-[var(--color-tangerine-700)]">
                <Icon name="sparkle" size={13} />
                Your Local, Our Priority
              </span>
            </Reveal>

            <Reveal delay={90}>
              <h1 className="mt-5 text-[38px] font-extrabold leading-[1.06] tracking-tight sm:text-[52px] lg:text-[58px]">
                {info.headline.lead}
                <br />
                <span className="text-[var(--color-tangerine-500)]">{info.headline.accent}</span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-5 max-w-[460px] text-[14.5px] leading-relaxed text-[var(--color-ink-500)] sm:text-[15.5px]">
                {info.intro}
              </p>
            </Reveal>

            {/* search */}
            <Reveal delay={230}>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  router.push(query.trim() ? `/contact?q=${encodeURIComponent(query.trim())}` : '/contact');
                }}
                className="mt-7 flex flex-col gap-2 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-2 shadow-[0_10px_34px_-16px_rgba(26,23,19,.28)] sm:flex-row sm:items-center">
                <span className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[var(--color-cream-100)] px-3 py-2.5 text-[12.5px] font-semibold text-[var(--color-ink-700)]">
                  <Icon name="pin" size={15} className="text-[var(--color-tangerine-500)]" />
                  {contact.city}, {contact.state}
                </span>
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search for services, products, vendors…"
                  aria-label="What are you looking for?"
                  className="min-w-0 flex-1 bg-transparent px-2 py-2 text-[13px] outline-none placeholder:text-[var(--text-muted)]"
                />
                <Button type="submit" size="md" className="shrink-0 sm:h-10">
                  Search
                </Button>
              </form>
            </Reveal>

            {/* Real categories — the same five a vendor can register under. */}
            <Reveal delay={300}>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-[12px] font-semibold text-[var(--text-muted)]">
                  Popular searches:
                </span>
                {categories.map(c => (
                  <a
                    key={c.slug}
                    href={`/services#${c.slug}`}
                    className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-2.5 py-1 text-[11.5px] font-semibold text-[var(--color-ink-500)] transition hover:border-[var(--color-tangerine-300)] hover:text-[var(--color-tangerine-600)]">
                    {c.name}
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          {/* ── app preview ───────────────────────────────────────────────── */}
          <Reveal anim="left" delay={220}>
            <div className="relative mx-auto w-full max-w-[420px]">
              <div className="rounded-[26px] border border-[var(--line)] bg-[var(--surface)] p-3 shadow-[0_28px_70px_-30px_rgba(26,23,19,.45)]">
                {/* order header */}
                <div className="flex items-center justify-between rounded-2xl bg-[var(--color-ink-950)] px-4 py-3.5">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-cream-300)]">
                      Arriving in
                    </p>
                    <p className="mt-0.5 text-[21px] font-extrabold leading-none text-white">
                      18 min
                    </p>
                  </div>
                  <span className="relative grid h-10 w-10 place-items-center rounded-full bg-[var(--color-tangerine-500)] text-white">
                    <Icon name="bike" size={19} />
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-[var(--color-tangerine-500)]"
                      style={{ animation: 'ql-pulse-ring 2.4s ease-out infinite' }}
                    />
                  </span>
                </div>

                {/* tracker */}
                <ol className="mt-3 space-y-0 px-1">
                  {TRACKED.map((t, i) => (
                    <li key={t.label} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <span
                          className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-white ${
                            t.done ? 'bg-[var(--color-ok)]' : 'bg-[var(--color-tangerine-500)]'
                          }`}>
                          {t.done ? (
                            <Icon name="check" size={12} strokeWidth={2.6} />
                          ) : (
                            <span className="h-1.5 w-1.5 rounded-full bg-white" />
                          )}
                        </span>
                        {i < TRACKED.length - 1 ? (
                          <span className="my-0.5 w-[2px] flex-1 rounded-full bg-[var(--color-cream-200)]" />
                        ) : null}
                      </div>
                      <div className={i < TRACKED.length - 1 ? 'pb-3.5' : ''}>
                        <p className="text-[12.5px] font-bold leading-tight">{t.label}</p>
                        <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">{t.at}</p>
                      </div>
                    </li>
                  ))}
                </ol>

                {/* The two facts that were floating chips in the mock. Inside
                    the card rather than overhanging it: a chip pinned to a
                    percentage offset sits over the card's own text at some
                    width, and there is no offset that is right at all of them. */}
                <div className="mb-3 flex flex-wrap gap-1.5 px-1">
                  <Fact icon="shield-check" text="Vendor verified" />
                  <Fact icon="pin" text={`Within ${info.delivery.defaultRadiusKm} km`} />
                </div>

                {/* fee breakdown — the platform's real numbers */}
                <div className="mt-1 rounded-2xl bg-[var(--color-cream-100)] p-3.5">
                  <Row label="Delivery fee" value={`₹${info.delivery.minFeeInr}`} />
                  <Row label="Platform fee" value={`₹${info.fees.platformFeeInr}`} />
                  <div className="my-2 border-t border-[var(--color-cream-300)]" />
                  <Row label="Rider earns" value={`₹${info.riderPayout.minimumInr}+`} strong />
                </div>
              </div>

            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className={`text-[12px] ${strong ? 'font-bold text-[var(--color-ink-900)]' : 'text-[var(--color-ink-500)]'}`}>
        {label}
      </span>
      <span className={`tnum text-[12.5px] font-bold ${strong ? 'text-[var(--color-ok)]' : ''}`}>
        {value}
      </span>
    </div>
  );
}

function Fact({ icon, text }: { icon: 'shield-check' | 'pin'; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-ok)]/10 px-2 py-1.5">
      <Icon name={icon} size={13} className="text-[var(--color-ok)]" />
      <span className="text-[11px] font-bold text-[var(--color-ink-700)]">{text}</span>
    </span>
  );
}
