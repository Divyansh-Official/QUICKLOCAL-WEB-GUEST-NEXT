/**
 * /contact — every channel real and reachable, each with a copy button.
 * No form, on purpose: nothing on a static site can store a message, so a
 * form would take it and lose it.
 */
import type { Metadata } from 'next';
import Reveal from '@/components/motion/Reveal';
import FaqSection from '@/components/sections/shared/FaqSection';
import PageHero from '@/components/sections/shared/PageHero';
import CopyButton from '@/components/ui/CopyButton';
import Icon from '@/components/ui/Icon';
import Slab3D from '@/components/ui/Slab3D';
import Tilt from '@/components/ui/Tilt';
import { contact, faq, fillDeep, home, mailHref, pages, telHref, ui } from '@/lib/data';

const copy = fillDeep(pages.contact);

export const metadata: Metadata = { title: copy.meta.title, description: copy.meta.description };

const resolve = (field: string) =>
  field === 'phone'
    ? { value: contact.phone, href: telHref(contact.phone) }
    : field === 'email'
      ? { value: contact.email, href: mailHref(contact.email) }
      : { value: contact.address, href: '' };

export default function ContactPage() {
  return (
    <>
      <PageHero
        {...copy.hero}
        crumbs={[{ label: copy.meta.title }]}
        labels={{ home: ui.common.home, breadcrumb: ui.common.breadcrumb }}
        art={<Slab3D icon="headset" hue="tangerine" size={300} />}
      />

      <section className="tone-base pb-[var(--section-y)]">
        <div className="shell">
          <ul className="grid gap-4 md:grid-cols-3">
            {copy.channels.map((c, i) => {
              const r = resolve(c.field);
              return (
                <Reveal as="li" key={c.title} index={i} className="flex">
                  <Tilt max={5} className="group glass hover-lift relative flex w-full flex-col rounded-[var(--radius-card)] p-7">
                    <span className="icon-tile" style={{ ['--s' as string]: '52px' }}>
                      <Icon name={c.icon} size={24} strokeWidth={1.9} effect="bounce" />
                    </span>
                    <h2 className="mt-6 text-[13px] font-extrabold uppercase tracking-[0.12em] text-fg-3">{c.title}</h2>
                    {r.href ? (
                      <a href={r.href} className="mt-2 break-words text-[clamp(1.2rem,1.05rem+0.5vw,1.45rem)] font-extrabold leading-snug tracking-[-0.025em] text-fg after:absolute after:inset-0 after:content-[''] hover:text-primary-ink">
                        {r.value}
                      </a>
                    ) : (
                      <p className="mt-2 text-[clamp(1.2rem,1.05rem+0.5vw,1.45rem)] font-extrabold leading-snug tracking-[-0.025em] text-fg">{r.value}</p>
                    )}
                    <p className="t-small mt-2 flex-1">{c.note}</p>
                    <div className="mt-5">
                      <CopyButton value={r.value} label={copy.copy} copiedLabel={copy.copied} />
                    </div>
                  </Tilt>
                </Reveal>
              );
            })}
          </ul>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Reveal className="glass rounded-[var(--radius-card)] p-7">
              <h2 className="t-headline">{copy.follow.title}</h2>
              <p className="t-small mt-2">{copy.follow.text}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {contact.socials.map(s => (
                  <li key={s.href}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="btn btn-md btn-glass" aria-label={`${s.label} — ${s.handle}`}>
                      <Icon name={s.icon} size={18} />
                      <span>{s.handle}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal index={1} className="glass rounded-[var(--radius-card)] p-7">
              <h2 className="t-headline flex items-center gap-2.5">
                <Icon name="info" size={20} className="text-primary" />
                {copy.noForm.title}
              </h2>
              <p className="t-small mt-2">{copy.noForm.text}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <FaqSection section={fillDeep(home.faq)} items={faq} tone="tone-alt" />
    </>
  );
}
