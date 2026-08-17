/**
 * The footer.
 *
 * Charcoal, because it closes the page against the cream field above it and
 * matches the app-download band — the two dark blocks bracket the light ones.
 *
 * Every link goes somewhere that exists. The design's Blog column is absent for
 * that reason: there are no posts, and a link to an empty page is worse than no
 * link at all. Contact details come from contact.json, so the phone number is
 * in one place rather than repeated into three components.
 */
import Link from 'next/link';
import { Icon, type IconName } from './Icon';
import { Logo } from './Logo';
import { Container } from './ui';
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
    <footer className="bg-[var(--color-ink-950)] text-[var(--color-cream-200)]">
      <Container className="py-12 sm:py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.2fr]">
          {/* identity */}
          <div className="max-w-[300px]">
            <Logo size={34} tone="light" withTagline />
            <p className="mt-4 text-[13px] leading-relaxed text-[var(--color-cream-300)]">
              Connecting {contact.city} with trusted local businesses and reliable deliveries.
              Your local needs, our priority.
            </p>
            <ul className="mt-5 flex items-center gap-2">
              {contact.socials.map(s => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`${s.label} — ${s.handle}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-white/8 px-3 py-2 text-[var(--color-cream-200)] transition hover:bg-[var(--color-tangerine-500)] hover:text-white">
                    <Icon name={SOCIAL_ICONS[s.icon] ?? 'instagram'} size={16} />
                    <span className="text-[12px] font-semibold">{s.handle}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {footerColumns.map(col => (
            <nav key={col.heading} aria-label={col.heading}>
              <h3 className="text-[13.5px] font-bold text-white">{col.heading}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map(l => (
                  <li key={l.href + l.label}>
                    <Link
                      href={l.href}
                      className="text-[12.5px] text-[var(--color-cream-300)] transition-colors hover:text-[var(--color-tangerine-300)]">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* contact */}
          <div>
            <h3 className="text-[13.5px] font-bold text-white">Contact Us</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={`tel:${contact.phone.replace(/\s/g, '')}`}
                  className="flex items-start gap-2.5 text-[12.5px] text-[var(--color-cream-300)] transition-colors hover:text-[var(--color-tangerine-300)]">
                  <Icon name="phone" size={15} className="mt-0.5 shrink-0 text-[var(--color-tangerine-500)]" />
                  {contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-start gap-2.5 text-[12.5px] text-[var(--color-cream-300)] transition-colors hover:text-[var(--color-tangerine-300)]">
                  <Icon name="mail" size={15} className="mt-0.5 shrink-0 text-[var(--color-tangerine-500)]" />
                  {contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-[12.5px] text-[var(--color-cream-300)]">
                <Icon name="pin" size={15} className="mt-0.5 shrink-0 text-[var(--color-tangerine-500)]" />
                {contact.address}
              </li>
            </ul>
          </div>
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
