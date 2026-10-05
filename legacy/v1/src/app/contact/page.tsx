/**
 * Contact.
 *
 * Every channel here is real and reachable — a tel: link, a mailto:, and the
 * operating address. There is no contact FORM, deliberately: with no backend a
 * form would collect a message and drop it, which is worse than sending someone
 * to an inbox that a person actually reads.
 */
import type { Metadata } from 'next';
import { Icon, type IconName } from '@/components/Icon';
import { Reveal } from '@/components/Reveal';
import { Card, Container, IconTile, PageHeader } from '@/components/ui';
import { contact, info } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: `Reach ${info.name} — ${contact.phone}, ${contact.email}, ${contact.address}.`,
};

const CHANNELS = [
  {
    icon: 'phone' as IconName,
    title: 'Call us',
    value: contact.phone,
    href: `tel:${contact.phone.replace(/\s/g, '')}`,
    note: 'For anything urgent about a live order',
  },
  {
    icon: 'mail' as IconName,
    title: 'Email us',
    value: contact.email,
    href: `mailto:${contact.email}`,
    note: 'Vendor sign-ups, partner applications, support',
  },
  {
    icon: 'pin' as IconName,
    title: 'Find us',
    value: contact.address,
    note: `Serving ${contact.city} within ${info.delivery.maxRadiusKm} km`,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact us"
        title="Talk to a person"
        intro="Whether you want to sell, deliver, or ask about an order — these all reach someone."
      />

      <Container className="pb-20">
        <div className="grid gap-4 md:grid-cols-3">
          {CHANNELS.map((c, i) => (
            <Reveal key={c.title} delay={i * 100}>
              <Card className="h-full p-5">
                <IconTile name={c.icon} size={46} />
                <h2 className="mt-4 text-[15px] font-bold">{c.title}</h2>
                {c.href ? (
                  <a
                    href={c.href}
                    className="mt-1.5 block break-words text-[14px] font-semibold text-[var(--color-tangerine-600)] hover:underline">
                    {c.value}
                  </a>
                ) : (
                  <p className="mt-1.5 text-[14px] font-semibold">{c.value}</p>
                )}
                <p className="mt-2 text-[12px] leading-relaxed text-[var(--text-muted)]">{c.note}</p>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="ql-glint mt-4 grid gap-4 ql-glass rounded-2xl p-6 sm:grid-cols-2">
            <div>
              <h2 className="text-[15px] font-bold">Follow along</h2>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--text-muted)]">
                New neighbourhoods and new categories get announced here first.
              </p>
              <ul className="mt-4 flex gap-2">
                {contact.socials.map(s => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`${s.label} — ${s.handle}`}
                      className="ql-glass ql-glint inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-[var(--color-ink-700)] transition hover:text-[var(--color-tangerine-600)]">
                      <Icon name={s.icon as IconName} size={17} />
                      <span className="text-[12.5px] font-semibold">{s.handle}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="ql-glass ql-glint rounded-2xl p-5">
              <h3 className="text-[13.5px] font-bold">Why there is no form here</h3>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--text-muted)]">
                This site is static — nothing on it stores what you type. A contact form would take
                your message and lose it, so we send you to a mailbox somebody reads instead.
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </>
  );
}
