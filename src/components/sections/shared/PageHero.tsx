import Link from 'next/link';
import type { ReactNode } from 'react';
import Enter from '@/components/motion/Enter';
import AccentText from '@/components/ui/AccentText';
import Icon from '@/components/ui/Icon';
import JsonLd from '@/components/layout/JsonLd';
import ShareButton from '@/components/ui/ShareButton';
import { siteUrl, ui } from '@/lib/data';

/**
 * The opening of every inner page: breadcrumb, eyebrow, a large title with one
 * phrase in the gradient, a lead and optional actions — with an optional piece
 * of 3D art beside it on wide screens. It recedes as the page scrolls away.
 */
export function Breadcrumbs({ crumbs, home, label, center = false }: { crumbs: { label: string; href?: string }[]; home: string; label: string; center?: boolean }) {
  const trail = [{ label: home, href: '/' }, ...crumbs];
  return (
    <nav aria-label={label} className={`flex ${center ? 'justify-center' : ''}`}>
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: trail.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, ...(c.href ? { item: `${siteUrl}${c.href === '/' ? '' : c.href}` } : {}) })),
        }}
      />
      <ol className="flex flex-wrap items-center gap-1.5 text-[13px] font-semibold text-fg-3">
        <li>
          <Link href="/" className="transition-colors hover:text-fg">
            {home}
          </Link>
        </li>
        {crumbs.map(c => (
          <li key={c.label} className="flex items-center gap-1.5">
            <Icon name="chevron-right" size={12} strokeWidth={2.2} className="opacity-60" />
            {c.href ? (
              <Link href={c.href} className="transition-colors hover:text-fg">
                {c.label}
              </Link>
            ) : (
              <span className="text-fg-2" aria-current="page">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default function PageHero({
  eyebrow,
  title,
  accent,
  intro,
  crumbs,
  labels,
  art,
  children,
  note,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  intro: string;
  crumbs: { label: string; href?: string }[];
  labels: { home: string; breadcrumb: string };
  art?: ReactNode;
  children?: ReactNode;
  /** A line of fine print under the actions. */
  note?: ReactNode;
}) {
  return (
    <section className="tone-base relative overflow-clip pb-[clamp(48px,7vw,104px)] pt-[calc(var(--header-h)+clamp(36px,6vw,84px))]">
      <div className={`shell grid items-center gap-12 ${art ? 'lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]' : ''}`}>
        <div data-vanish className={art ? 'text-center lg:text-left' : 'text-center'} style={{ ['--vanish' as string]: '58vh' }}>
          <Enter delay={0} className={`flex flex-wrap items-center gap-x-3 gap-y-2 ${art ? 'justify-center lg:justify-start' : 'justify-center'}`}>
            <Breadcrumbs crumbs={crumbs} home={labels.home} label={labels.breadcrumb} center={!art} />
            <ShareButton copy={ui.share} />
          </Enter>
          <Enter as="p" delay={60} className={`t-eyebrow mt-8 ${art ? 'justify-center lg:justify-start' : 'is-center justify-center'}`}>
            {eyebrow}
          </Enter>
          <Enter as="h1" delay={110} effect="blur" className={`t-hero mt-4 text-[clamp(2.5rem,1.4rem+4.6vw,5.4rem)] ${art ? 'mx-auto max-w-4xl lg:mx-0' : 'mx-auto max-w-5xl'}`}>
            <AccentText text={title} accent={accent} />
          </Enter>
          <Enter as="p" delay={180} className={`t-lead mt-6 max-w-2xl ${art ? 'mx-auto lg:mx-0' : 'mx-auto'}`}>
            {intro}
          </Enter>
          {children ? (
            <Enter delay={240} className={`mt-9 flex flex-wrap items-center gap-3 ${art ? 'justify-center lg:justify-start' : 'justify-center'}`}>
              {children}
            </Enter>
          ) : null}
          {note ? (
            <Enter as="p" delay={290} className={`t-small mt-5 ${art ? 'text-center lg:text-left' : 'text-center'}`}>
              {note}
            </Enter>
          ) : null}
        </div>
        {art ? (
          <Enter delay={200} effect="scale" className="group hidden justify-center lg:flex">
            {art}
          </Enter>
        ) : null}
      </div>
    </section>
  );
}
