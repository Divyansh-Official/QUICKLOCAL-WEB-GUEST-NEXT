/**
 * Services.
 *
 * One anchored block per category, because the header, the hero chips and the
 * footer all deep-link here by slug. Each carries its real platform fee.
 */
import type { Metadata } from 'next';
import { Icon, type IconName } from '@/components/Icon';
import { Reveal } from '@/components/Reveal';
import { Card, Container, IconTile, PageHeader, SectionHeading } from '@/components/ui';
import { categories, feePercent, info } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Services',
  description: `Every category a local shop can open under on ${info.name}, with the platform fee it pays and how delivery works.`,
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Everything your neighbourhood already sells"
        intro={`Five categories, each with its own platform fee. Delivered inside ${info.delivery.defaultRadiusKm} km by default and within ${info.delivery.maxHours} hours, always.`}
      />

      <Container className="pb-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <Reveal key={c.slug} delay={i * 90}>
              <Card id={c.slug} className="h-full scroll-mt-28 p-5">
                <IconTile name={c.icon as IconName} size={46} />
                <h2 className="mt-4 text-[16px] font-bold">{c.name}</h2>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--text-muted)]">
                  {c.blurb}
                </p>
                <dl className="mt-4 space-y-1.5 border-t border-[var(--line)] pt-3.5">
                  <Row label="Platform fee" value={feePercent(c.platformFeePercent)} />
                  <Row label="Delivery from" value={`₹${info.delivery.minFeeInr}`} />
                </dl>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>

      {/* delivery */}
      <section id="delivery" className="scroll-mt-24 bg-[var(--color-cream-100)] py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Delivery"
            title="How delivery actually works"
            subtitle="These are platform-wide values, not per-vendor promises."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: 'radius' as const, k: `${info.delivery.defaultRadiusKm} km`, v: 'Default radius from the shop' },
              { icon: 'pin' as const, k: `${info.delivery.maxRadiusKm} km`, v: 'The furthest a vendor may serve' },
              { icon: 'clock' as const, k: `${info.delivery.maxHours} hours`, v: 'Maximum time for any order' },
              { icon: 'wallet' as const, k: `₹${info.delivery.minFeeInr}`, v: 'Minimum delivery fee' },
            ].map((d, i) => (
              <Reveal key={d.k} delay={i * 90}>
                <div className="h-full rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
                  <IconTile name={d.icon} size={42} />
                  <p className="tnum mt-4 text-[22px] font-extrabold leading-none">{d.k}</p>
                  <p className="mt-1.5 text-[12.5px] leading-snug text-[var(--text-muted)]">{d.v}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* referral */}
      <section id="referral" className="scroll-mt-24 py-16 sm:py-20">
        <Container>
          <Reveal anim="scale">
            <div className="flex flex-col items-center gap-4 rounded-[26px] border border-[var(--color-tangerine-300)] bg-[var(--color-tangerine-100)] px-6 py-10 text-center">
              <Icon name="sparkle" size={26} className="text-[var(--color-tangerine-600)]" />
              <h2 className="text-[24px] font-extrabold tracking-tight sm:text-[28px]">
                Refer a friend, earn ₹{info.referral.rewardInr}
              </h2>
              <p className="max-w-[460px] text-[13.5px] leading-relaxed text-[var(--color-ink-500)]">
                The reward lands when they place their first order. The amount is set by the
                platform, so it is the same for everybody.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-[12px] text-[var(--text-muted)]">{label}</dt>
      <dd className="tnum text-[12.5px] font-bold">{value}</dd>
    </div>
  );
}
