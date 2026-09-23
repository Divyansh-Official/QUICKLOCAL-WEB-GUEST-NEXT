/**
 * The handful of pieces every section is assembled from.
 *
 * Kept in one file because they are small and always used together; splitting
 * six twenty-line components across six files buys nothing but imports.
 */
'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon';
import { Reveal } from './Reveal';

/**
 * The page's horizontal rhythm.
 *
 * Every section uses this, so the whole site shares one gutter and one maximum
 * width. Sections that bleed to the edge put the bleed OUTSIDE this and the
 * content inside, rather than each inventing its own padding.
 */
export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1180px] px-5 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

/** The small tangerine label above a section heading. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-center text-[11.5px] font-extrabold uppercase tracking-[0.16em] text-[var(--color-tangerine-600)]">
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-[640px]">
      {eyebrow ? (
        <Reveal anim="fade">
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
      ) : null}
      <Reveal delay={80}>
        <h2 className="mt-2.5 text-center text-[26px] font-extrabold leading-[1.15] tracking-tight sm:text-[32px] lg:text-[36px]">
          {title}
        </h2>
      </Reveal>
      {subtitle ? (
        <Reveal delay={140}>
          <p className="mt-3 text-center text-[14px] leading-relaxed text-[var(--text-muted)] sm:text-[15px]">
            {subtitle}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}

type ButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'outline' | 'ghost' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  icon?: IconName;
  className?: string;
  'aria-label'?: string;
};

const VARIANTS = {
  primary:
    'bg-[var(--color-tangerine-500)] text-white shadow-[0_6px_18px_-6px_rgba(240,134,38,.6)] hover:bg-[var(--color-tangerine-600)] hover:shadow-[0_10px_26px_-8px_rgba(240,134,38,.7)]',
  outline:
    'border border-[var(--color-tangerine-500)] text-[var(--color-tangerine-600)] hover:bg-[var(--color-tangerine-500)] hover:text-white',
  ghost:
    'border border-[var(--line)] bg-[var(--surface)] text-[var(--color-ink-700)] hover:bg-[var(--color-cream-100)]',
  dark: 'bg-[var(--color-ink-950)] text-[var(--color-cream-50)] hover:bg-[var(--color-ink-900)]',
} as const;

const SIZES = {
  sm: 'h-9 px-3.5 text-[12.5px]',
  md: 'h-11 px-5 text-[13.5px]',
  lg: 'h-12 px-6 text-[14.5px]',
} as const;

export function Button({
  children,
  href,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  ...rest
}: ButtonProps) {
  // `group` so an arrow inside can react to the button's own hover.
  const cls = `group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl font-bold transition-all duration-300 ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  const inner = (
    <>
      {children}
      {icon ? (
        <Icon
          name={icon}
          size={16}
          className="transition-transform duration-300 group-hover:translate-x-0.5"
        />
      ) : null}
    </>
  );

  if (href) {
    const external = href.startsWith('http');
    return external ? (
      <a href={href} target="_blank" rel="noreferrer noopener" className={cls} {...rest}>
        {inner}
      </a>
    ) : (
      <Link href={href} className={cls} {...rest}>
        {inner}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={cls} {...rest}>
      {inner}
    </button>
  );
}

/** A tinted square behind an icon — the motif the whole site repeats. */
export function IconTile({
  name,
  size = 44,
  tone = 'tangerine',
  className = '',
}: {
  name: IconName;
  size?: number;
  tone?: 'tangerine' | 'ink' | 'cream';
  className?: string;
}) {
  const tones = {
    tangerine: 'bg-[var(--color-tangerine-100)] text-[var(--color-tangerine-600)]',
    ink: 'bg-[var(--color-ink-950)] text-[var(--color-cream-50)]',
    cream: 'bg-[var(--color-cream-100)] text-[var(--color-ink-700)]',
  } as const;

  return (
    <span
      style={{ width: size, height: size, borderRadius: size * 0.3 }}
      className={`grid shrink-0 place-items-center ${tones[tone]} ${className}`}>
      <Icon name={name} size={Math.round(size * 0.46)} />
    </span>
  );
}

/**
 * The card used for categories, steps, plans and testimonials.
 *
 * ── GLASS BY PAINT, NOT BY BACKDROP ─────────────────────────────────────────
 * This was briefly a refracting GlassPane, and it is the most repeated
 * component on the site — grids of four, rails of five, a plan table. Each
 * refracting surface is a GPU pass redone whenever anything behind it moves,
 * so making this one refract multiplied that cost by everything on the page
 * and the whole site went sluggish.
 *
 * It now takes the glass LOOK from `.ql-glass`: translucent fill, the two rim
 * lights a real edge has, and a shadow. That is paint, it costs nothing per
 * frame, and at card size the bend was barely legible anyway — refraction
 * shows on big surfaces, not on a 220px tile. The real thing is reserved for
 * the handful of large, stationary panes that can afford it.
 */
export function Card({
  children,
  className = '',
  interactive = true,
  // Cards are deep-link targets on Services and For Business, so an id has to
  // reach the element the browser scrolls to rather than being dropped here.
  id,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={`ql-glass rounded-2xl ${interactive ? 'ql-lift ql-glint' : ''} ${className}`}>
      {children}
    </div>
  );
}

/**
 * The banner every page except home opens with.
 *
 * One component so the six inner pages cannot drift apart in spacing or type
 * scale, and so the colour wash behind them is defined once.
 */
export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro: string;
}) {
  return (
    <section className="relative overflow-hidden pt-[calc(var(--header-h)+40px)] pb-12 sm:pb-14">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-[12%] -top-[40%] h-[440px] w-[440px] rounded-full bg-[radial-gradient(circle,rgba(240,134,38,.17),transparent_66%)]" />
      </div>
      <Container>
        <Reveal anim="fade">
          <p className="text-[11.5px] font-extrabold uppercase tracking-[0.16em] text-[var(--color-tangerine-600)]">
            {eyebrow}
          </p>
        </Reveal>
        <Reveal delay={70}>
          <h1 className="mt-2.5 max-w-[720px] text-[32px] font-extrabold leading-[1.1] tracking-tight sm:text-[42px]">
            {title}
          </h1>
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-4 max-w-[620px] text-[14.5px] leading-relaxed text-[var(--color-ink-500)]">
            {intro}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
