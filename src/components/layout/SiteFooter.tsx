import Link from 'next/link';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import { ThemeSegmented } from '@/components/ui/ThemeToggle';
import Reveal from '@/components/motion/Reveal';
import Aurora from '@/components/ui/Aurora';
import Logo from './Logo';

/**
 * The footer, on night: a closing line with the one action that matters, the
 * link columns, contact as a column like any other, appearance, and the fine
 * print. Every href resolves to a real page.
 */
export default function SiteFooter({
  brandLabel,
  tagline,
  blurb,
  cta,
  ctaTitle,
  ctaText,
  columns,
  contact,
  socials,
  copyright,
  madeFor,
  labels,
  showTheme,
}: {
  brandLabel: string;
  tagline: string;
  blurb: string;
  cta: { label: string; href: string };
  ctaTitle: string;
  ctaText: string;
  columns: { heading: string; links: { label: string; href: string }[] }[];
  contact: { phone: string; phoneHref: string; email: string; emailHref: string; address: string };
  socials: { label: string; icon: string; handle: string; href: string }[];
  copyright: string;
  madeFor: string;
  labels: { contact: string; theme: { label: string; light: string; dark: string; system: string } };
  showTheme: boolean;
}) {
  return (
    <footer className="tone-night relative overflow-clip" data-print="hide">
      <Aurora variant="night" />
      <div className="shell relative pb-10 pt-16 sm:pt-20">
        <Reveal className="flex flex-col gap-8 border-b border-hair pb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="t-display text-[clamp(2rem,1.4rem+2.6vw,3.4rem)]">{ctaTitle}</p>
            <p className="t-lead mt-4">{ctaText}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button href={cta.href} size="lg" icon="arrow-right">
              {cta.label}
            </Button>
            {socials.map(s => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${s.label} — ${s.handle}`}
                className="btn btn-lg btn-glass">
                <Icon name={s.icon} size={18} />
                <span>{s.handle}</span>
              </a>
            ))}
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-12 pt-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Logo size={38} tagline={tagline} label={brandLabel} />
            <p className="t-small mt-5 max-w-sm">{blurb}</p>
            {showTheme ? (
              <div className="mt-7">
                <ThemeSegmented labels={labels.theme} />
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:col-span-8">
            {columns.map(col => (
              <nav key={col.heading} aria-label={col.heading}>
                <h2 className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-primary">{col.heading}</h2>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map(l => (
                    <li key={l.href + l.label}>
                      <Link href={l.href} className="text-[14px] text-fg-2 transition-colors hover:text-fg">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
            <div>
              <h2 className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-primary">{labels.contact}</h2>
              <ul className="mt-4 space-y-2.5 text-[14px] text-fg-2">
                <li>
                  <a href={contact.phoneHref} className="hover:text-fg">
                    {contact.phone}
                  </a>
                </li>
                <li>
                  <a href={contact.emailHref} className="break-all hover:text-fg">
                    {contact.email}
                  </a>
                </li>
                <li>{contact.address}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-hair pt-6 text-[12.5px] text-fg-3 sm:flex-row sm:items-center sm:justify-between">
          <p>{copyright}</p>
          <p className="flex items-center gap-1.5">
            <Icon name="heart" size={13} className="text-primary" />
            {madeFor}
          </p>
        </div>
      </div>
    </footer>
  );
}
