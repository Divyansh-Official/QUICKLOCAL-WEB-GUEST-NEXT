/**
 * About.
 *
 * The copy is deliberately modest about scale. The platform is early, and a
 * page claiming momentum it does not have is the fastest way to lose a vendor
 * who then opens the app and finds four shops.
 */
import type { Metadata } from 'next';
import { Icon } from '@/components/Icon';
import { Reveal } from '@/components/Reveal';
import { Button, Card, Container, IconTile, PageHeader, SectionHeading } from '@/components/ui';
import { about, categories, contact, info } from '@/lib/data';

export const metadata: Metadata = {
  title: 'About Us',
  description: about.paragraphs[0],
};

const PRINCIPLES = [
  {
    icon: 'store' as const,
    title: 'The shop keeps more',
    body: `Platform fees start at ${info.fees.lowestCategoryFeePercent}% on grocery and never exceed 3%. Convenience for the customer should not come out of the seller's margin.`,
  },
  {
    icon: 'bike' as const,
    title: 'The rider is paid a floor',
    body: `₹${info.riderPayout.minimumInr} minimum per order, on top of ₹${info.riderPayout.baseInr} base and ₹${info.riderPayout.perKmInr} a kilometre. Not a per-drop lottery.`,
  },
  {
    icon: 'shield-check' as const,
    title: 'Nobody sells unverified',
    body: 'Every vendor and every delivery partner clears document verification before they can take a single order.',
  },
  {
    icon: 'clock' as const,
    title: 'Three hours, and we mean it',
    body: `${info.delivery.maxHours} hours is the platform's hard ceiling on any order, inside a ${info.delivery.defaultRadiusKm} km default radius.`,
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title={about.heading}
        intro={`${info.name} — ${info.tagline.toLowerCase()}.`}
      />

      <Container className="pb-4">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div>
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 90}>
                <p className="mb-4 text-[14px] leading-relaxed text-[var(--color-ink-500)]">{p}</p>
              </Reveal>
            ))}
            <Reveal delay={340}>
              <Button href="/get-the-app" icon="arrow-right" className="mt-3">
                Partner with us
              </Button>
            </Reveal>
          </div>

          <Reveal anim="left" delay={140}>
            <Card interactive={false} className="p-6">
              <h2 className="text-[15px] font-bold">Where we operate</h2>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--text-muted)]">
                One city, honestly stated. The map grows when the vendors do.
              </p>
              <div className="ql-glass ql-glint mt-4 flex items-center gap-3 rounded-2xl px-4 py-3.5">
                <IconTile name="pin" size={40} />
                <div>
                  <p className="text-[14px] font-bold">
                    {contact.city}, {contact.state}
                  </p>
                  <p className="text-[11.5px] text-[var(--text-muted)]">
                    {info.delivery.defaultRadiusKm} km default · up to {info.delivery.maxRadiusKm} km
                  </p>
                </div>
              </div>

              <h3 className="mt-6 text-[13px] font-bold">Categories a shop can open under</h3>
              <ul className="mt-2.5 flex flex-wrap gap-1.5">
                {categories.map(c => (
                  <li
                    key={c.slug}
                    className="rounded-full border border-[var(--line)] px-2.5 py-1 text-[11.5px] font-semibold text-[var(--color-ink-500)]">
                    {c.name}
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        </div>
      </Container>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="What we hold to"
            title="Four commitments, written into the platform"
            subtitle="Each of these is a value the backend enforces, not a line on a slide."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.title} delay={i * 100}>
                <Card className="h-full p-5">
                  <IconTile name={p.icon} size={44} />
                  <h3 className="mt-4 text-[15px] font-bold">{p.title}</h3>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--text-muted)]">
                    {p.body}
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <Container className="pb-20">
        <Reveal anim="scale">
          <div className="flex flex-col items-center gap-4 rounded-[26px] bg-[var(--color-ink-950)] px-6 py-10 text-center">
            <Icon name="sparkle" size={26} className="text-[var(--color-tangerine-500)]" />
            <h2 className="text-[22px] font-extrabold tracking-tight text-white sm:text-[26px]">
              Own a shop in {contact.city}?
            </h2>
            <p className="max-w-[460px] text-[13.5px] leading-relaxed text-[var(--color-cream-300)]">
              List free, keep up to 98% of every sale, and get paid straight to your bank.
            </p>
            <Button href="/get-the-app#vendor" icon="arrow-right" className="mt-1">
              Become a vendor
            </Button>
          </div>
        </Reveal>
      </Container>
    </>
  );
}
