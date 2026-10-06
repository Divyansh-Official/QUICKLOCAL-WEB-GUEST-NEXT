import Link from 'next/link';
import Medal3D from '@/components/art/Medal3D';
import Reveal from '@/components/motion/Reveal';
import CountUp from '@/components/ui/CountUp';
import Icon from '@/components/ui/Icon';
import SectionHeader from '@/components/ui/SectionHeader';
import Tilt from '@/components/ui/Tilt';
import RailDots from '@/components/ui/RailDots';

export type Tier = { level: string; name: string; deliveries: string; rating: string; detail: string; tone: string };

/**
 * The tiers as a row of 3D medals, each in its own metal — the exact
 * thresholds DeliveryBadgeService promotes on: 50, 200 and 500 deliveries at
 * 3.5, 4.0 and 4.5 stars. Shared by the home page and /deliver.
 */
export function TierGrid({ tiers, labels }: { tiers: Tier[]; labels: { deliveries: string; rating: string } }) {
  return (
    <>
      <ul className="m-rail grid gap-4 sm:grid-cols-2 lg:grid-cols-4 [--rail-w:72vw]">
      {tiers.map((tier, i) => (
        <Reveal as="li" key={tier.level} index={i} className="flex">
          <Tilt max={8} className="group glass hover-lift relative flex w-full flex-col overflow-hidden rounded-[var(--radius-card)] p-6">
            <Medal3D tone={tier.tone} size={68} className="-ml-1 -mt-1" />
            <h3 className="mt-4 text-[20px] font-extrabold tracking-[-0.03em] text-fg">{tier.name}</h3>
            <dl className="mt-3 space-y-1.5 border-y border-hair py-3">
              <div className="flex items-baseline justify-between gap-2">
                <dt className="text-[11.5px] font-extrabold uppercase tracking-[0.1em] text-fg-3">{labels.deliveries}</dt>
                <dd className="tnum text-[14px] font-extrabold text-fg">{tier.deliveries}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <dt className="text-[11.5px] font-extrabold uppercase tracking-[0.1em] text-fg-3">{labels.rating}</dt>
                <dd className="tnum text-[14px] font-extrabold text-fg">{tier.rating}</dd>
              </div>
            </dl>
            <p className="mt-3 text-[14px] leading-relaxed text-fg-2">{tier.detail}</p>
          </Tilt>
        </Reveal>
      ))}
    </ul>
    <RailDots count={tiers.length} />
    </>
  );
}

/**
 * What a delivery partner earns, and what moves them up: the rider is paid
 * the order's whole delivery fee, then the tiers. What a rider brings depends
 * on what they ride, so this lists what everyone brings and links to the
 * vehicle picker on /deliver for the rest.
 */
export default function RiderTiers({
  section,
  tiers,
  documents,
}: {
  section: {
    eyebrow: string;
    title: string;
    accent: string;
    intro: string;
    figures: string[];
    figureValues: string[];
    deliveries: string;
    rating: string;
    documentsTitle: string;
    documentsNote: string;
    documentsCta: { label: string; href: string };
    caveatTitle: string;
    caveatText: string;
  };
  tiers: Tier[];
  documents: { type: string; label: string }[];
}) {
  return (
    <section id="ride-with-us" className="tone-base section scroll-mt-24">
      <div className="shell">
        <SectionHeader eyebrow={section.eyebrow} title={section.title} accent={section.accent} intro={section.intro} />

        <Reveal className="glass glass-raised mx-auto mt-12 grid max-w-[760px] grid-cols-3 divide-x divide-[var(--hair)] rounded-[28px]">
          {section.figureValues.map((f, i) => (
            <div key={section.figures[i]} className="px-2 py-6 text-center sm:px-4">
              <CountUp value={f} className="tnum block text-[clamp(1.6rem,1.2rem+2vw,2.8rem)] font-extrabold leading-none tracking-[-0.045em] text-gradient" />
              <p className="mt-2 text-[11px] font-extrabold uppercase leading-snug tracking-[0.1em] text-fg-3 sm:text-[12px]">{section.figures[i]}</p>
            </div>
          ))}
        </Reveal>

        <div className="mt-6">
          <TierGrid tiers={tiers} labels={{ deliveries: section.deliveries, rating: section.rating }} />
        </div>

        <div className="m-rail mx-auto mt-4 grid max-w-[1080px] gap-4 md:grid-cols-2">
          <Reveal className="glass flex flex-col rounded-[var(--radius-card)] p-6 sm:p-7">
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
            <Link href={section.documentsCta.href} className="link-more mt-4 self-start">
              {section.documentsCta.label}
              <Icon name="arrow-right" size={15} strokeWidth={2.2} />
            </Link>
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
