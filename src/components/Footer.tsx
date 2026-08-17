/**
 * The footer.
 *
 * ── A BAND, THEN THE COLUMNS, THEN THE FINE PRINT ───────────────────────────
 * The previous version put five columns of wildly different heights in one
 * row, so the identity block ran twice as tall as the link lists beside it and
 * the whole thing read as ragged. Now the identity sits in its own band above a
 * four-column grid whose items are all the same shape, with a rule between the
 * two — the columns line up because they are the only thing in their row.
 *
 * ── CONTACT IS A COLUMN LIKE ANY OTHER ──────────────────────────────────────
 * It used to be a fifth column of a different kind, which is why the grid could
 * not settle on a rhythm. Phone, email and address are links in a list, styled
 * exactly like the ones beside them.
 *
 * Every href resolves — the design's Blog column is absent because there are no
 * posts, and only the Instagram account is listed because it is the only one
 * that exists.
 */
import Link from 'next/link';
import { Icon, type IconName } from './Icon';
import { Logo } from './Logo';
import { Button, Container } from './ui';
import { contact, footerColumns, info } from '@/lib/data';

const SOCIAL_ICONS: Record<string, IconName> = {
  facebook: 'facebook',
  instagram: 'instagram',
  x: 'x',
  linkedin: 'linkedin',
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-4 bg-[var(--color-ink-950)] text-[var(--color-cream-200)]">
      {/* ── identity + call to action ───────────────────────────────────── */}
      <Container className="py-11">
        <div className="flex flex-col gap-7 border-b border-white/10 pb-9 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-[420px]">
            <Logo size={38} tone="light" withTagline />
            <p className="mt-4 text-[13.5px] leading-relaxed text-[var(--color-cream-300)]">
              Connecting {contact.city} with trusted local shops and reliable deliveries — inside{' '}
              {info.delivery.defaultRadiusKm} km, within {info.delivery.maxHours} hours.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href="/get-the-app" size="md" icon="arrow-right">
              Get the app
            </Button>
            {contact.socials.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${s.label} — ${s.handle}`}
                className="inline-flex h-11 items-center gap-2.5 rounded-xl border border-white/15 px-4 text-[var(--color-cream-200)] transition hover:border-[var(--color-tangerine-500)] hover:bg-[var(--color-tangerine-500)] hover:text-white">
                <Icon name={SOCIAL_ICONS[s.icon] ?? 'instagram'} size={17} />
                <span className="text-[12.5px] font-bold">{s.handle}</span>
              </a>
            ))}
          </div>
        </div>

        {/* ── link columns ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-9 pt-9 md:grid-cols-4">
          {footerColumns.map(col => (
            <nav key={col.heading} aria-label={col.heading}>
              <h3 className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[var(--color-tangerine-500)]">
                {col.heading}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map(l => (
                  <li key={l.href + l.label}>
                    <Link
                      href={l.href}
                      className="text-[13px] text-[var(--color-cream-300)] transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <nav aria-label="Contact">
            <h3 className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[var(--color-tangerine-500)]">
              Contact
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={`tel:${contact.phone.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-2 text-[13px] text-[var(--color-cream-300)] transition-colors hover:text-white">
                  <Icon name="phone" size={14} className="shrink-0 text-[var(--color-tangerine-500)]" />
                  {contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-start gap-2 break-all text-[13px] text-[var(--color-cream-300)] transition-colors hover:text-white">
                  <Icon name="mail" size={14} className="mt-1 shrink-0 text-[var(--color-tangerine-500)]" />
                  {contact.email}
                </a>
              </li>
              <li className="inline-flex items-start gap-2 text-[13px] text-[var(--color-cream-300)]">
                <Icon name="pin" size={14} className="mt-1 shrink-0 text-[var(--color-tangerine-500)]" />
                {contact.address}
              </li>
            </ul>
          </nav>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-2 py-5 sm:flex-row">
          <p className="text-[11.5px] text-[var(--color-cream-300)]">
            © {year} {info.name}. All rights reserved.
          </p>
          <p className="text-[11.5px] text-[var(--color-cream-300)]">
            Made with{' '}
            <span className="text-[var(--color-bad)]" aria-label="love">
              ♥
            </span>{' '}
            for local communities
          </p>
        </Container>
      </div>
    </footer>
  );
}
