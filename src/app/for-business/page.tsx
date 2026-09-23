/**
 * For Business — the two partner tracks.
 *
 * Vendors and delivery partners want different numbers, so they get separate
 * blocks rather than one merged list where half of it is irrelevant to whoever
 * is reading. Both sets come from features.json.
 */
import type { Metadata } from 'next';
import { Icon } from '@/components/Icon';
import { Reveal } from '@/components/Reveal';
import { Button, Card, Container, IconTile, PageHeader, SectionHeading } from '@/components/ui';
import { features, info, inr, plans } from '@/lib/data';

export const metadata: Metadata = {
  title: 'For Business',
  description: `Sell on ${info.name} or deliver for it — platform fees from ${info.fees.lowestCategoryFeePercent}%, and ₹${info.riderPayout.minimumInr} minimum per delivery.`,
};

const free = plans.find(p => p.priceMonthly === 0);

export default function ForBusinessPage() {
  return (
    <>
      <PageHeader
        eyebrow="For business"
        title="Sell on it, or deliver for it"
        intro="Two ways to work with QuickLocal, each with its numbers stated up front."
      />

      <Container className="pb-16">
        <div className="grid gap-4 lg:grid-cols-2">
          {/* vendors */}
          <Reveal>
            <Card id="vendors" className="flex h-full scroll-mt-28 flex-col p-6">
              <IconTile name="store" size={48} />
              <h2 className="mt-4 text-[20px] font-extrabold tracking-tight">Become a vendor</h2>
              <p className="mt-2 text-[13px] leading-relaxed text-[var(--text-muted)]">
                List your shop, set your catalogue, and get paid to your bank. Start on the free
                plan — {free ? free.maxProducts : 25} products, no monthly cost.
              </p>
              <ul className="mt-5 flex-1 space-y-2.5">
                {features.vendors.map(f => (
                  <Bullet key={f}>{f}</Bullet>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <Button href="/get-the-app#vendor" icon="arrow-right">
                  Start selling
                </Button>
                <Button href="/pricing" variant="ghost">
                  See the plans
                </Button>
              </div>
            </Card>
          </Reveal>

          {/* delivery partners */}
          <Reveal delay={120}>
            <Card id="partners" className="flex h-full scroll-mt-28 flex-col p-6">
              <IconTile name="bike" size={48} />
              <h2 className="mt-4 text-[20px] font-extrabold tracking-tight">
                Become a delivery partner
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-[var(--text-muted)]">
                Take the jobs that suit you, inside a {info.delivery.defaultRadiusKm} km radius, and
                know what each one pays before you accept it.
              </p>
              <ul className="mt-5 flex-1 space-y-2.5">
                {features.partners.map(f => (
                  <Bullet key={f}>{f}</Bullet>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <Button href="/get-the-app#partner" icon="arrow-right">
                  Apply to deliver
                </Button>
              </div>
            </Card>
          </Reveal>
        </div>
      </Container>

      {/* earnings */}
      <section id="earnings" className="scroll-mt-24 bg-[var(--color-cream-100)] py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Partner earnings"
            title="What a delivery pays"
            subtitle="Set by the platform and applied to every order, so the figure does not move shop to shop."
          />
          <div className="mx-auto mt-10 grid max-w-[760px] gap-4 sm:grid-cols-3">
            {[
              { k: inr(info.riderPayout.baseInr), v: 'Base, every order', icon: 'wallet' as const },
              { k: `${inr(info.riderPayout.perKmInr)}/km`, v: 'On top, by distance', icon: 'radius' as const },
              { k: `${inr(info.riderPayout.minimumInr)} min`, v: 'Guaranteed floor', icon: 'shield-check' as const },
            ].map((d, i) => (
              <Reveal key={d.v} delay={i * 100}>
                <div className="ql-glint h-full ql-glass rounded-2xl p-5 text-center">
                  <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-[var(--color-tangerine-100)] text-[var(--color-tangerine-600)]">
                    <Icon name={d.icon} size={20} />
                  </span>
                  <p className="tnum mt-3 text-[22px] font-extrabold leading-none">{d.k}</p>
                  <p className="mt-1.5 text-[12px] text-[var(--text-muted)]">{d.v}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={340}>
            <p className="mx-auto mt-6 max-w-[520px] text-center text-[12px] leading-relaxed text-[var(--text-muted)]">
              A 2 km delivery pays {inr(info.riderPayout.baseInr + 2 * info.riderPayout.perKmInr)}; the
              floor lifts anything below {inr(info.riderPayout.minimumInr)} up to it.
            </p>
          </Reveal>
        </Container>
      </section>
    </>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--color-ok)] text-white">
        <Icon name="check" size={11} strokeWidth={2.8} />
      </span>
      <span className="text-[13px] leading-relaxed text-[var(--color-ink-700)]">{children}</span>
    </li>
  );
}
