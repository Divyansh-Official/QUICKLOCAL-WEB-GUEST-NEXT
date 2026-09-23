/**
 * What a delivery partner earns, and what moves them up.
 *
 * ── TWO NUMBERS AND A LADDER ────────────────────────────────────────────────
 * Somebody deciding whether to sign up is asking two things: what does a drop
 * pay, and does sticking around change anything. Both are facts the platform
 * already holds — the payout model in app_config, the promotion thresholds in
 * DeliveryBadgeService — and neither is usually published anywhere a rider can
 * read it before committing.
 *
 * ── THE THRESHOLDS ARE THE REAL ONES ────────────────────────────────────────
 * 50, 200 and 500 deliveries at 3.5, 4.0 and 4.5. Rounding those to "hundreds
 * of deliveries" would make the ladder unfalsifiable, which is the opposite of
 * the point.
 *
 * ── AND THE CAVEAT IS HERE TOO ──────────────────────────────────────────────
 * A rating dipping below a threshold does not demote automatically. That is
 * genuinely how it works, it is in the rider's favour, and burying it would
 * make the tiers read as harsher than they are.
 */
import { riders } from '@/lib/data';
import { GlassPane } from './glass/GlassPane';
import { Icon } from './Icon';
import { Container, Eyebrow } from './ui';
import { Reveal } from './Reveal';

/** Metal, not decoration — each tier reads as the thing it is named after. */
const TONES: Record<string, { ring: string; text: string; chip: string }> = {
  bronze: { ring: 'rgba(176,118,68,.5)', text: '#8a5a33', chip: 'rgba(176,118,68,.14)' },
  silver: { ring: 'rgba(130,140,150,.5)', text: '#5b6670', chip: 'rgba(130,140,150,.14)' },
  gold: { ring: 'rgba(212,160,23,.55)', text: '#8a6508', chip: 'rgba(212,160,23,.16)' },
  platinum: { ring: 'rgba(240,134,38,.6)', text: '#b85c0f', chip: 'rgba(240,134,38,.16)' },
};

export function RiderTiers() {
  const { payout, tiers, documents } = riders;

  return (
    <section className="py-16 sm:py-20" id="ride-with-us">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-[620px] text-center">
            <Eyebrow>Ride with us</Eyebrow>
            <h2 className="mt-2.5 text-balance text-[26px] font-extrabold leading-[1.15] tracking-tight sm:text-[34px]">
              What a delivery{' '}
              <span className="text-[var(--color-tangerine-600)]">actually pays</span>
            </h2>
            <p className="mx-auto mt-3 max-w-[54ch] text-[14px] leading-relaxed text-[var(--color-ink-500)]">
              ₹{payout.baseInr} a job before distance, ₹{payout.perKmInr} a kilometre on top, and
              never less than ₹{payout.minimumInr} however short the drop. The whole delivery fee
              reaches the rider whether the customer or the shop funded it.
            </p>
          </div>
        </Reveal>

        {/* ── the payout, as three figures ───────────────────────────────── */}
        <Reveal delay={60}>
          <GlassPane
            radius={22}
            tint="rgba(255,255,255,0.55)"
            blur={2.2}
            strength="soft"
            elevation="raised"
            className="ql-glint mx-auto mt-9 grid max-w-[620px] grid-cols-3 divide-x divide-white/60">
            <Figure value={`₹${payout.baseInr}`} label="Base, every job" />
            <Figure value={`₹${payout.perKmInr}`} label="Per kilometre" />
            <Figure value={`₹${payout.minimumInr}`} label="Floor, whatever happens" />
          </GlassPane>
        </Reveal>

        {/* ── the ladder ─────────────────────────────────────────────────── */}
        <ul className="ql-stagger mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier, i) => {
            const tone = TONES[tier.tone] ?? TONES.bronze;
            return (
              <li key={tier.level} style={{ ['--i' as string]: i }}>
                <Reveal delay={i * 70}>
                  <GlassPane
                    radius={20}
                    tint="rgba(255,255,255,0.58)"
                    blur={2}
                    strength="soft"
                    elevation="raised"
                    interactive
                    className="ql-glint ql-lift flex h-full flex-col p-5">
                    <span
                      aria-hidden
                      className="grid h-10 w-10 place-items-center rounded-2xl"
                      style={{ background: tone.chip, color: tone.text, boxShadow: `inset 0 0 0 1.5px ${tone.ring}` }}>
                      <Icon name="star" size={17} />
                    </span>
                    <h3 className="mt-3.5 text-[15px] font-extrabold" style={{ color: tone.text }}>
                      {tier.name}
                    </h3>
                    <dl className="mt-2 space-y-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <dt className="text-[11px] font-bold uppercase tracking-wide text-[var(--color-ink-300)]">
                          Deliveries
                        </dt>
                        <dd className="tnum text-[12.5px] font-bold">{tier.deliveries}</dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-2">
                        <dt className="text-[11px] font-bold uppercase tracking-wide text-[var(--color-ink-300)]">
                          Rating
                        </dt>
                        <dd className="tnum text-[12.5px] font-bold">{tier.rating}</dd>
                      </div>
                    </dl>
                    <p className="mt-2.5 text-[12px] leading-relaxed text-[var(--color-ink-500)]">
                      {tier.detail}
                    </p>
                  </GlassPane>
                </Reveal>
              </li>
            );
          })}
        </ul>

        <Reveal delay={120}>
          <div className="mx-auto mt-5 grid max-w-[880px] gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <GlassPane
              radius={20}
              tint="rgba(255,255,255,0.5)"
              blur={2}
              className="ql-glint p-5">
              <h3 className="flex items-center gap-2 text-[13px] font-extrabold">
                <Icon name="shield-check" size={15} className="text-[var(--color-tangerine-600)]" />
                What you bring
              </h3>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {documents.map(doc => (
                  <li
                    key={doc.type}
                    className="rounded-full bg-white/70 px-2.5 py-1 text-[11.5px] font-semibold text-[var(--color-ink-700)]">
                    {doc.label}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[11.5px] leading-relaxed text-[var(--color-ink-500)]">
                Checked against the issuing authority before your first job, not after.
              </p>
            </GlassPane>

            <GlassPane
              radius={20}
              tint="rgba(255,255,255,0.5)"
              blur={2}
              className="ql-glint p-5">
              <h3 className="flex items-center gap-2 text-[13px] font-extrabold">
                <Icon name="refresh" size={15} className="text-[var(--color-tangerine-600)]" />
                A bad week is a bad week
              </h3>
              <p className="mt-2.5 text-[12.5px] leading-relaxed text-[var(--color-ink-500)]">
                A rating that dips below a tier&rsquo;s line does not demote you overnight — no
                nightly job takes a badge away. Where it matters, a person looks at it.
              </p>
            </GlassPane>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function Figure({ value, label }: { value: string; label: string }) {
  return (
    <div className="px-3 py-4 text-center">
      <p className="tnum text-[26px] font-extrabold leading-none text-[var(--color-tangerine-600)]">
        {value}
      </p>
      <p className="mt-1.5 text-[10.5px] font-bold uppercase tracking-wide leading-snug text-[var(--color-ink-500)]">
        {label}
      </p>
    </div>
  );
}
