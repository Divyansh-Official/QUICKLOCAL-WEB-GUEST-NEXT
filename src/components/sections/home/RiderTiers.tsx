import Reveal from '@/components/motion/Reveal';
import CountUp from '@/components/ui/CountUp';
import Icon from '@/components/ui/Icon';
import SectionHeader from '@/components/ui/SectionHeader';
import Tilt from '@/components/ui/Tilt';

/**
 * What a delivery partner earns, and what moves them up: the payout model and
 * the exact thresholds DeliveryBadgeService promotes on — 50, 200 and 500
 * deliveries. Each tier is a medal in its own metal, tilting under the
 * pointer. The caveat that a dipping rating does not demote automatically is
 * here too: it is true, and it is in the rider's favour.
 */
const METAL: Record<string, string> = {
  bronze: 'linear-gradient(145deg, #e8b48a, #b07644 55%, #7d4f2a)',
  silver: 'linear-gradient(145deg, #f2f4f6, #aab3bb 55%, #6f7a84)',
  gold: 'linear-gradient(145deg, #fbe28a, #e0a91f 55%, #a87608)',
  platinum: 'linear-gradient(145deg, #fff3e3, #f5a352 50%, #b85c0f)',
};

export default function RiderTiers({
  section,
  payout,
  tiers,
  documents,
}: {
  section: { eyebrow: string; title: string; accent: string; intro: string; figures: string[]; deliveries: string; rating: string; documentsTitle: string; documentsNote: string; caveatTitle: string; caveatText: string };
  payout: { baseInr: number; perKmInr: number; minimumInr: number };
  tiers: { level: string; name: string; deliveries: string; rating: string; detail: string; tone: string }[];
  documents: { type: string; label: string }[];
}) {
  const figures = [`₹${payout.baseInr}`, `₹${payout.perKmInr}`, `₹${payout.minimumInr}`];
  return (
    <section id="ride-with-us" className="tone-base section scroll-mt-24">
      <div className="shell">
        <SectionHeader eyebrow={section.eyebrow} title={section.title} accent={section.accent} intro={section.intro} />

        <Reveal className="glass glass-raised mx-auto mt-12 grid max-w-[760px] grid-cols-3 divide-x divide-[var(--hair)] rounded-[28px]">
          {figures.map((f, i) => (
            <div key={section.figures[i]} className="px-2 py-6 text-center sm:px-4">
              <CountUp value={f} className="tnum block text-[clamp(1.8rem,1.3rem+2vw,2.8rem)] font-extrabold leading-none tracking-[-0.045em] text-gradient" />
              <p className="mt-2 text-[11px] font-extrabold uppercase leading-snug tracking-[0.1em] text-fg-3 sm:text-[12px]">{section.figures[i]}</p>
            </div>
          ))}
        </Reveal>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier, i) => (
            <Reveal as="li" key={tier.level} index={i} className="flex">
              <Tilt max={8} className="glass hover-lift relative flex w-full flex-col overflow-hidden rounded-[var(--radius-card)] p-6">
                <span
                  aria-hidden="true"
                  className="grid h-14 w-14 place-items-center rounded-full text-white shadow-[inset_0_2px_0_rgb(255_255_255/0.5),inset_0_-3px_6px_rgb(0_0_0/0.18),0_12px_22px_-10px_rgb(0_0_0/0.45)]"
                  style={{ background: METAL[tier.tone] ?? METAL.bronze }}>
                  <Icon name="star" size={22} className="drop-shadow-[0_1px_1px_rgb(0_0_0/0.3)]" />
                </span>
                <h3 className="mt-5 text-[20px] font-extrabold tracking-[-0.03em] text-fg">{tier.name}</h3>
                <dl className="mt-3 space-y-1.5 border-y border-hair py-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <dt className="text-[11.5px] font-extrabold uppercase tracking-[0.1em] text-fg-3">{section.deliveries}</dt>
                    <dd className="tnum text-[14px] font-extrabold text-fg">{tier.deliveries}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-2">
                    <dt className="text-[11.5px] font-extrabold uppercase tracking-[0.1em] text-fg-3">{section.rating}</dt>
                    <dd className="tnum text-[14px] font-extrabold text-fg">{tier.rating}</dd>
                  </div>
                </dl>
                <p className="mt-3 text-[14px] leading-relaxed text-fg-2">{tier.detail}</p>
              </Tilt>
            </Reveal>
          ))}
        </ul>

        <div className="mx-auto mt-4 grid max-w-[1080px] gap-4 md:grid-cols-2">
          <Reveal className="glass rounded-[var(--radius-card)] p-6 sm:p-7">
            <h3 className="flex items-center gap-2.5 text-[16px] font-extrabold tracking-[-0.02em]">
              <Icon name="shield-check" size={19} className="text-primary" />
              {section.documentsTitle}
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {documents.map(d => (
                <li key={d.type} className="chip">
                  {d.label}
                </li>
              ))}
            </ul>
            <p className="t-small mt-4">{section.documentsNote}</p>
          </Reveal>
          <Reveal index={1} className="glass rounded-[var(--radius-card)] p-6 sm:p-7">
            <h3 className="flex items-center gap-2.5 text-[16px] font-extrabold tracking-[-0.02em]">
              <Icon name="refresh" size={19} className="text-primary" />
              {section.caveatTitle}
            </h3>
            <p className="t-small mt-3">{section.caveatText}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
