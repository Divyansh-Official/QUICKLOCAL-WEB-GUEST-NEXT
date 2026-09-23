/**
 * The category rail.
 *
 * ── A SCROLLER, NOT A SLIDESHOW ─────────────────────────────────────────────
 * The mock has arrow buttons on a row of cards. Building that as a slideshow
 * with an index means reimplementing momentum, snapping and touch — badly — and
 * it breaks the one interaction every phone user already knows. So the rail is
 * a real overflow-x container with scroll snapping: it swipes natively on
 * touch, takes a trackpad, and the arrows simply scroll it.
 *
 * ── THE ARROWS KNOW WHEN THEY ARE USELESS ───────────────────────────────────
 * They disable at each end and vanish entirely when everything already fits,
 * which on a wide screen with five categories it does. An arrow that does
 * nothing is worse than no arrow.
 *
 * ── FIVE CARDS, NOT SIX ─────────────────────────────────────────────────────
 * These are the categories a vendor can actually register under, with the real
 * platform fee printed on each. The mock's six are aspirational; these are the
 * ones the database has.
 */
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Icon, type IconName } from './Icon';
import { Reveal } from './Reveal';
import { Container, IconTile, SectionHeading } from './ui';
import { categories, feePercent } from '@/lib/data';

export function Categories() {
  const rail = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);
  const [overflows, setOverflows] = useState(false);

  const measure = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    // 2px of tolerance: sub-pixel widths mean scrollLeft rarely reaches the
    // exact maximum, which would leave the forward arrow enabled at the end.
    const max = el.scrollWidth - el.clientWidth;
    setOverflows(max > 2);
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft >= max - 2);
  }, []);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    measure();
    el.addEventListener('scroll', measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', measure);
      ro.disconnect();
    };
  }, [measure]);

  const nudge = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    // One card plus its gap, so a press advances by exactly one item rather
    // than an arbitrary number of pixels.
    const card = el.querySelector('li');
    const step = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="What we offer"
          title="All your daily needs, covered"
          subtitle="Every category a local shop can open on QuickLocal — with the platform fee it pays."
        />
      </Container>

      <div className="relative mt-10">
        <Container className="relative">
          <ul
            ref={rail}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((c, i) => (
              <Reveal
                as="li"
                key={c.slug}
                delay={i * 90}
                className="w-[220px] shrink-0 snap-start sm:w-[236px]">
                <Link
                  href={`/services#${c.slug}`}
                  className="ql-lift ql-glint group flex h-full flex-col ql-glass rounded-2xl p-5 transition">
                  <IconTile name={c.icon as IconName} size={46} />
                  <h3 className="mt-4 text-[15px] font-bold">{c.name}</h3>
                  <p className="mt-1.5 flex-1 text-[12.5px] leading-relaxed text-[var(--text-muted)]">
                    {c.blurb}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 self-start rounded-full bg-[var(--color-cream-100)] px-2.5 py-1 text-[11px] font-bold text-[var(--color-ink-500)]">
                    <Icon name="tag" size={12} className="text-[var(--color-tangerine-600)]" />
                    {feePercent(c.platformFeePercent)} platform fee
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>

          {/* Only where the rail actually scrolls. */}
          {overflows ? (
            <div className="mt-5 flex items-center justify-center gap-2">
              <RailButton dir="left" disabled={atStart} onClick={() => nudge(-1)} />
              <RailButton dir="right" disabled={atEnd} onClick={() => nudge(1)} />
            </div>
          ) : null}
        </Container>
      </div>
    </section>
  );
}

function RailButton({
  dir,
  disabled,
  onClick,
}: {
  dir: 'left' | 'right';
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 'left' ? 'Previous categories' : 'Next categories'}
      className="grid h-10 w-10 place-items-center rounded-full ql-glass text-[var(--color-ink-700)] transition hover:text-[var(--color-tangerine-600)] disabled:pointer-events-none disabled:opacity-35">
      <Icon name={dir === 'left' ? 'chevron-left' : 'chevron-right'} size={17} />
    </button>
  );
}
