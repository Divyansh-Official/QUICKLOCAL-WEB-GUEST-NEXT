'use client';

/**
 * A sample order, tapped through from aisle to doorstep. The phone is the
 * product — its buttons work: pick an aisle, fill a basket, choose how far the
 * shop is, pay — and the panel beside it says what the platform does at each
 * step and which rule applies.
 *
 * Everything that could be real is: the order states and what they mean
 * (lifecycle.json), the delivery arithmetic (lib/fees, the backend's own
 * formula), the default free-delivery amount, the codes at both ends and the
 * clocks. The shop, its items and prices are made up and labelled so.
 * Nothing is sent anywhere.
 */
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import PhoneShell from '@/components/art/PhoneShell';
import Icon from '@/components/ui/Icon';
import { deliverySplit, type FeeRules } from '@/lib/fees';
import { fillLive, rupees } from '@/lib/format';
import { prefersCalm } from '@/lib/hooks';

type Item = { name: string; price: number };
type Aisle = { slug: string; name: string; icon: string; items: Item[] };
type Step = { key: string; status?: string; title: string; text: string; rule: string; label?: string };
type Copy = {
  label: string;
  illustrative: string;
  shop: string;
  shopMeta: string;
  add: string;
  basket: string;
  empty: string;
  subtotal: string;
  delivery: string;
  deliveryNote: string;
  deliveryExtra: string;
  shopCovers: string;
  freeFrom: string;
  freeLeft: string;
  total: string;
  distance: string;
  distances: number[];
  pay: string;
  waitingShop: string;
  waitingRider: string;
  riderOffer: string;
  riderMasked: string;
  pickupCode: string;
  deliveryCode: string;
  deliveryCodeNote: string;
  eta: string;
  enterCode: string;
  delivered: string;
  receipt: string;
  youPaid: string;
  yourBasket: string;
  deliveryPaid: string;
  shopFunded: string;
  riderEarns: string;
  riderNote: string;
  rate: string;
  back: string;
  next: string;
  restart: string;
  stepOf: string;
  codes: { pickup: string[]; delivery: string[] };
  minutes: number;
};

const d = (n: number) => ({ '--d': `${n}ms` }) as CSSProperties;

function Codes({ digits, tone = 'plain', filled = true }: { digits: string[]; tone?: 'plain' | 'brand'; filled?: boolean }) {
  return (
    <div className="flex justify-center gap-[2.4cqw]">
      {digits.map((n, i) => (
        <span
          key={i}
          className={`grid h-[15cqw] w-[11.5cqw] place-items-center rounded-[3.4cqw] text-[7cqw] font-extrabold tracking-[-0.04em] ${
            tone === 'brand' ? 'bg-primary text-white shadow-[0_6px_14px_-8px_rgb(240_134_38/0.9)]' : 'bg-card text-fg shadow-[inset_0_0_0_1.5px_var(--hair)]'
          }`}>
          <span className={filled ? '' : 'so-digit'} style={filled ? undefined : d(250 + i * 260)}>
            {n}
          </span>
        </span>
      ))}
    </div>
  );
}

/** The order's progress through the real states, as the app shows it. */
function Timeline({ states, at }: { states: { status: string; label: string }[]; at: number }) {
  return (
    <ol className="relative mt-[4cqw] space-y-[2.6cqw]">
      <span aria-hidden="true" className="absolute bottom-[3cqw] left-[3.1cqw] top-[3cqw] w-[0.5cqw] rounded-full bg-[color-mix(in_oklab,var(--fg)_9%,transparent)]" />
      {states.map((s, i) => (
        <li key={s.status} className="relative flex items-center gap-[3cqw]">
          <span
            className={`relative grid h-[6.6cqw] w-[6.6cqw] flex-none place-items-center rounded-full ${
              i < at ? 'bg-ok text-white' : i === at ? 'so-now bg-primary text-white' : 'bg-[color-mix(in_oklab,var(--fg)_9%,var(--card))] text-fg-3'
            }`}>
            {i <= at ? <Icon name="check" size={10} strokeWidth={3} /> : null}
          </span>
          <span className={`text-[3.6cqw] font-bold ${i === at ? 'text-primary-ink' : i < at ? 'text-fg' : 'text-fg-3'}`}>{s.label}</span>
        </li>
      ))}
    </ol>
  );
}

export default function SampleOrder({
  copy,
  steps,
  aisles,
  rules,
  states,
}: {
  copy: Copy;
  steps: Step[];
  aisles: Aisle[];
  rules: FeeRules;
  states: { status: string; label: string }[];
}) {
  const [at, setAt] = useState(0);
  const [aisle, setAisle] = useState(aisles[0].slug);
  const [basket, setBasket] = useState<Record<string, number>>({});
  const [km, setKm] = useState(copy.distances[1] ?? copy.distances[0]);
  const [stars, setStars] = useState(0);
  const [calm, setCalm] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const announced = useRef(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setCalm(prefersCalm()));
    return () => cancelAnimationFrame(frame);
  }, []);

  /* Moving to a step moves focus to its title, so a screen reader hears it. */
  useEffect(() => {
    if (!announced.current) {
      announced.current = true;
      return;
    }
    panel.current?.querySelector<HTMLElement>('h3')?.focus({ preventScroll: true });
  }, [at]);

  const current = aisles.find(a => a.slug === aisle) ?? aisles[0];
  const lines = current.items.filter(i => basket[i.name]);
  const count = lines.reduce((n, i) => n + basket[i.name], 0);
  const subtotal = lines.reduce((sum, i) => sum + i.price * basket[i.name], 0);
  const split = useMemo(() => deliverySplit(rules, subtotal, km), [rules, subtotal, km]);
  const step = steps[at];
  const statusAt = step.status ? states.findIndex(s => s.status === step.status) : -1;
  const last = at === steps.length - 1;
  const blocked = step.key === 'basket' && count === 0;

  const changeAisle = (slug: string) => {
    if (slug === aisle) return;
    setAisle(slug);
    setBasket({});
  };
  const add = (name: string, by: number) => setBasket(b => ({ ...b, [name]: Math.max(0, (b[name] ?? 0) + by) }));
  const go = (n: number) => setAt(Math.max(0, Math.min(steps.length - 1, n)));
  const restart = () => {
    setBasket({});
    setStars(0);
    setAt(0);
  };

  const deliveryNote = fillLive(copy.deliveryNote, {
    extra: split.extra ? fillLive(copy.deliveryExtra, { extra: rupees(split.extra), extraKm: Number(split.extraKm.toFixed(1)), freeKm: rules.freeRangeKm }) : '',
  });
  const left = rules.defaultFreeDeliveryThresholdInr - subtotal;

  const nextLabel = last ? copy.restart : step.key === 'checkout' ? fillLive(copy.pay, { total: rupees(subtotal + split.customer) }) : copy.next;

  /* ── the phone's screens ─────────────────────────────────────────────── */

  const screens: Record<string, React.ReactNode> = {
    aisle: (
      <>
        <p className="text-[6cqw] font-extrabold tracking-[-0.03em] text-fg">{steps[0].title}</p>
        <div className="mt-[4cqw] grid grid-cols-2 gap-[2.6cqw]">
          {aisles.map(a => (
            <button
              key={a.slug}
              type="button"
              onClick={() => changeAisle(a.slug)}
              aria-pressed={a.slug === aisle}
              className={`so-tap flex flex-col items-start gap-[2cqw] rounded-[4cqw] p-[3.4cqw] text-left transition-colors ${
                a.slug === aisle ? 'bg-primary text-white shadow-[0_8px_18px_-10px_rgb(240_134_38/0.9)]' : 'bg-[color-mix(in_oklab,var(--fg)_5%,var(--card))] text-fg'
              }`}>
              <Icon name={a.icon} size={18} strokeWidth={1.9} />
              <span className="text-[3.8cqw] font-extrabold">{a.name}</span>
            </button>
          ))}
        </div>
      </>
    ),

    basket: (
      <>
        <div className="rounded-[4cqw] bg-[color-mix(in_oklab,var(--fg)_5%,var(--card))] p-[3.6cqw]">
          <p className="flex items-center gap-[2cqw] text-[4.4cqw] font-extrabold text-fg">
            <Icon name="store" size={14} strokeWidth={2} className="text-primary" />
            {fillLive(copy.shop, { aisle: current.name })}
          </p>
          <p className="mt-[1cqw] text-[3.1cqw] text-fg-3">{fillLive(copy.shopMeta, { km })}</p>
        </div>
        <ul className="mt-[3cqw] space-y-[2cqw]">
          {current.items.map(i => {
            const n = basket[i.name] ?? 0;
            return (
              <li key={i.name} className="flex items-center gap-[2.4cqw] rounded-[3.6cqw] bg-card px-[3cqw] py-[2.4cqw] shadow-[inset_0_0_0_1px_var(--hair)]">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[3.6cqw] font-bold text-fg">{i.name}</span>
                  <span className="block text-[3.2cqw] text-fg-2">{rupees(i.price)}</span>
                </span>
                {n ? (
                  <span className="flex items-center gap-[1.6cqw]">
                    <button type="button" onClick={() => add(i.name, -1)} className="so-tap grid h-[7cqw] w-[7cqw] place-items-center rounded-full bg-[color-mix(in_oklab,var(--fg)_8%,transparent)] text-fg" aria-label={`− ${i.name}`}>
                      <Icon name="minus" size={11} strokeWidth={2.6} />
                    </button>
                    <span className="tnum w-[4cqw] text-center text-[3.6cqw] font-extrabold text-fg" aria-live="polite">
                      {n}
                    </span>
                    <button type="button" onClick={() => add(i.name, 1)} className="so-tap grid h-[7cqw] w-[7cqw] place-items-center rounded-full bg-primary text-white" aria-label={`+ ${i.name}`}>
                      <Icon name="plus" size={11} strokeWidth={2.6} />
                    </button>
                  </span>
                ) : (
                  <button type="button" onClick={() => add(i.name, 1)} className="so-tap rounded-full bg-primary px-[3.4cqw] py-[1.6cqw] text-[3.3cqw] font-extrabold text-white">
                    {copy.add}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
        <p className="mt-[2.4cqw] text-center text-[2.9cqw] text-fg-3">{copy.illustrative}</p>
        <div className="mt-auto flex items-center justify-between rounded-full bg-[#1a1713] px-[4cqw] py-[2.6cqw] text-white dark:bg-[#f8f4ef] dark:text-[#1a1713]">
          <span className="flex items-center gap-[2cqw] text-[3.4cqw] font-bold">
            <Icon name="basket" size={13} strokeWidth={2.2} />
            {count ? `${copy.basket} · ${count}` : copy.empty}
          </span>
          <span className="tnum text-[3.8cqw] font-extrabold">{rupees(subtotal)}</span>
        </div>
      </>
    ),

    checkout: (
      <>
        <p className="text-[5.4cqw] font-extrabold tracking-[-0.03em] text-fg">{copy.distance}</p>
        <div role="radiogroup" aria-label={copy.distance} className="mt-[2.4cqw] grid grid-cols-4 gap-[1.6cqw] rounded-full bg-[color-mix(in_oklab,var(--fg)_6%,transparent)] p-[1.2cqw]">
          {copy.distances.map(v => (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={v === km}
              onClick={() => setKm(v)}
              className={`so-tap rounded-full py-[1.8cqw] text-[3.4cqw] font-extrabold transition-colors ${v === km ? 'bg-card text-fg shadow-[0_1px_4px_rgb(0_0_0/0.15)]' : 'text-fg-2'}`}>
              {v} km
            </button>
          ))}
        </div>
        <dl className="mt-[4cqw] space-y-[2.4cqw] text-[3.5cqw]">
          <div className="flex justify-between">
            <dt className="text-fg-2">
              {copy.subtotal} · {count}
            </dt>
            <dd className="tnum font-bold text-fg">{rupees(subtotal)}</dd>
          </div>
          <div className="flex justify-between gap-[3cqw]">
            <dt className="text-fg-2">
              {copy.delivery}
              <span className="block text-[2.9cqw] text-fg-3">{split.free ? copy.shopCovers : deliveryNote}</span>
            </dt>
            <dd className="tnum font-bold text-fg">{split.customer ? rupees(split.customer) : rupees(0)}</dd>
          </div>
        </dl>
        <div className="mt-[3cqw] rounded-[3.4cqw] bg-[color-mix(in_oklab,var(--ok)_12%,transparent)] px-[3cqw] py-[2.4cqw]">
          <p className="text-[3cqw] font-bold text-fg">{split.free ? copy.shopCovers : fillLive(copy.freeLeft, { left: rupees(Math.max(0, left)) })}</p>
          <span className="mt-[1.6cqw] block h-[1.4cqw] overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--fg)_9%,transparent)]">
            <span className="block h-full rounded-full bg-ok transition-[width] duration-500" style={{ width: `${Math.min(100, (subtotal / rules.defaultFreeDeliveryThresholdInr) * 100)}%` }} />
          </span>
          <p className="mt-[1.4cqw] text-[2.8cqw] text-fg-3">{copy.freeFrom}</p>
        </div>
        <div className="mt-auto flex items-baseline justify-between border-t border-hair pt-[3cqw]">
          <span className="text-[3.6cqw] font-bold text-fg-2">{copy.total}</span>
          <span className="tnum text-[6.4cqw] font-extrabold tracking-[-0.03em] text-fg">{rupees(subtotal + split.customer)}</span>
        </div>
        <button type="button" onClick={() => go(at + 1)} className="so-tap mt-[3cqw] rounded-full bg-primary py-[3cqw] text-[3.8cqw] font-extrabold text-white shadow-[0_8px_18px_-10px_rgb(240_134_38/0.9)]">
          {nextLabel}
        </button>
      </>
    ),

    placed: (
      <>
        <div className="relative mt-[2cqw] flex flex-col items-center text-center">
          <span className="so-wait grid h-[16cqw] w-[16cqw] place-items-center">
            <span className="so-spinner h-[10cqw] w-[10cqw] rounded-full border-[1cqw] border-[color-mix(in_oklab,var(--primary)_25%,transparent)] border-t-primary" />
          </span>
          <span className="so-done absolute inset-x-0 top-0 mx-auto grid h-[16cqw] w-[16cqw] place-items-center rounded-full bg-ok text-white">
            <Icon name="check" size={26} strokeWidth={2.6} />
          </span>
          <p className="mt-[3cqw] text-[5cqw] font-extrabold tracking-[-0.03em] text-fg">{states[0].label}</p>
          <p className="text-[3.2cqw] text-fg-3">{copy.waitingShop}</p>
        </div>
        <Timeline states={states} at={0} />
      </>
    ),

    shop: (
      <>
        <div className="flex items-center gap-[3cqw] rounded-[4cqw] bg-[color-mix(in_oklab,var(--ok)_12%,transparent)] p-[3.4cqw]">
          <span className="so-pop grid h-[10cqw] w-[10cqw] flex-none place-items-center rounded-full bg-ok text-white">
            <Icon name="store" size={16} strokeWidth={2} />
          </span>
          <span>
            <span className="block text-[4.2cqw] font-extrabold text-fg">{states[1].label}</span>
            <span className="block text-[3cqw] text-fg-2">{fillLive(copy.shop, { aisle: current.name })}</span>
          </span>
        </div>
        <Timeline states={states} at={1} />
      </>
    ),

    rider: (
      <>
        <div className="relative overflow-hidden rounded-[4cqw] bg-[#1a1713] p-[3.6cqw] text-white dark:bg-[#f8f4ef] dark:text-[#1a1713]">
          <p className="so-wait text-[3.2cqw] font-bold opacity-80">{copy.waitingRider}</p>
          <div className="so-done absolute inset-0 flex items-center gap-[3cqw] p-[3.6cqw]">
            <span className="grid h-[10cqw] w-[10cqw] flex-none place-items-center rounded-full bg-primary text-white">
              <Icon name="bike" size={16} strokeWidth={2} />
            </span>
            <span className="text-[4cqw] font-extrabold">{states[2].label}</span>
          </div>
          <p className="mt-[2.4cqw] flex items-center gap-[1.6cqw] text-[2.9cqw] opacity-70">
            <Icon name="users" size={11} strokeWidth={2} />
            {copy.riderOffer}
          </p>
        </div>
        <p className="mt-[2.4cqw] flex items-center gap-[1.6cqw] text-[2.9cqw] text-fg-3">
          <Icon name="phone" size={11} strokeWidth={2} />
          {copy.riderMasked}
        </p>
        <Timeline states={states} at={2} />
      </>
    ),

    pickup: (
      <>
        <p className="text-center text-[3.4cqw] font-bold text-fg-2">{copy.pickupCode}</p>
        <div className="mt-[2.4cqw]">
          <Codes digits={copy.codes.pickup} filled={calm} />
        </div>
        <Timeline states={states} at={3} />
      </>
    ),

    transit: (
      <>
        <div className="relative overflow-hidden rounded-[4cqw] bg-[color-mix(in_oklab,var(--fg)_5%,var(--card))]">
          <svg viewBox="0 0 200 120" className="block w-full" aria-hidden="true">
            {[
              [10, 10, 50, 30],
              [70, 8, 60, 34],
              [140, 10, 50, 24],
              [12, 54, 44, 52],
              [74, 56, 40, 24],
              [130, 46, 60, 30],
              [74, 92, 56, 22],
              [146, 86, 44, 26],
            ].map(([x, y, w, h]) => (
              <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx={6} className="fill-[color-mix(in_oklab,var(--fg)_7%,transparent)]" />
            ))}
            <path id="so-route" d="M28 46 C 60 46, 64 44, 66 50 S 120 40, 124 42 S 128 84, 138 82 S 170 80, 178 78" fill="none" stroke="var(--primary)" strokeWidth={4} strokeLinecap="round" className="so-route" />
            <circle cx={28} cy={46} r={5} className="fill-[#1a1713] dark:fill-[#f8f4ef]" />
            <circle cx={178} cy={78} r={6} className="fill-ok" />
            <g>
              <circle r={7} fill="var(--primary)" stroke="white" strokeWidth={2.4} {...(calm ? { cx: 178, cy: 78 } : {})} />
              {calm ? null : (
                <animateMotion dur="4.5s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="0.45 0 0.2 1">
                  <mpath href="#so-route" />
                </animateMotion>
              )}
            </g>
          </svg>
          <p className="absolute left-[3cqw] top-[3cqw] rounded-full bg-card px-[2.6cqw] py-[1.2cqw] text-[3cqw] font-extrabold text-fg shadow-[0_2px_8px_rgb(0_0_0/0.15)]">
            {fillLive(copy.eta, { min: copy.minutes })}
          </p>
        </div>
        <p className="mt-[3.4cqw] text-center text-[3.2cqw] font-bold text-fg-2">{copy.deliveryCode}</p>
        <div className="mt-[2cqw]">
          <Codes digits={copy.codes.delivery} tone="brand" />
        </div>
        <p className="mt-[2cqw] text-center text-[2.9cqw] text-fg-3">{copy.deliveryCodeNote}</p>
      </>
    ),

    delivered: (
      <>
        <p className="text-center text-[3.2cqw] font-bold text-fg-2">{copy.enterCode}</p>
        <div className="mt-[2cqw]">
          <Codes digits={copy.codes.delivery} filled={calm} />
        </div>
        <div className="mt-[3cqw] flex flex-col items-center">
          <span className="so-pop grid h-[13cqw] w-[13cqw] place-items-center rounded-full bg-ok text-white" style={d(calm ? 0 : 1300)}>
            <Icon name="check" size={22} strokeWidth={2.8} />
          </span>
          <p className="mt-[1.6cqw] text-[5cqw] font-extrabold tracking-[-0.03em] text-fg">{copy.delivered}</p>
        </div>
        <div className="mt-[3cqw] rounded-[4cqw] bg-[color-mix(in_oklab,var(--fg)_5%,var(--card))] p-[3.4cqw] text-[3.2cqw]">
          <p className="text-[2.8cqw] font-extrabold uppercase tracking-[0.12em] text-fg-3">{copy.receipt}</p>
          <dl className="mt-[1.6cqw] space-y-[1.4cqw]">
            <div className="flex justify-between">
              <dt className="text-fg-2">{copy.yourBasket}</dt>
              <dd className="tnum font-bold text-fg">{rupees(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-fg-2">{copy.deliveryPaid}</dt>
              <dd className="tnum font-bold text-fg">{rupees(split.customer)}</dd>
            </div>
            {split.free ? (
              <div className="flex justify-between">
                <dt className="text-fg-2">{copy.shopFunded}</dt>
                <dd className="tnum font-bold text-fg">{rupees(split.shop)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between border-t border-hair pt-[1.4cqw]">
              <dt className="text-fg-2">
                {copy.riderEarns} <span className="text-fg-3">· {copy.riderNote}</span>
              </dt>
              <dd className="tnum font-extrabold text-ok">{rupees(split.rider)}</dd>
            </div>
          </dl>
        </div>
        <div className="mt-auto pt-[3cqw] text-center">
          <p className="text-[3cqw] font-bold text-fg-2">{copy.rate}</p>
          <div className="mt-[1.4cqw] flex justify-center gap-[1.6cqw]" role="radiogroup" aria-label={copy.rate}>
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} type="button" role="radio" aria-checked={stars === n} aria-label={`${n} / 5`} onClick={() => setStars(n)} className={`so-tap transition-colors ${n <= stars ? 'text-[#f5b13c]' : 'text-[color-mix(in_oklab,var(--fg)_20%,transparent)]'}`}>
                <Icon name="star" size={20} strokeWidth={1.6} className={n <= stars ? 'fill-current' : ''} />
              </button>
            ))}
          </div>
        </div>
      </>
    ),
  };

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
      <div className="flex justify-center">
        <PhoneShell interactive width="clamp(236px, 62vw, 330px)" className="so-phone">
          <div className="flex h-full flex-col px-[5.5cqw] pb-[6cqw] pt-[13cqw]">
            <div className="mb-[3cqw] flex items-center justify-between text-[3cqw] font-bold text-fg-3">
              <span className="flex items-center gap-[1.4cqw]">
                <Icon name="pin" size={11} strokeWidth={2.2} className="text-primary" />
                {copy.label}
              </span>
              <span className="tnum">{fillLive(copy.stepOf, { n: at + 1, total: steps.length })}</span>
            </div>
            <div key={step.key} className="so-screen relative flex min-h-0 flex-1 flex-col">
              {screens[step.key]}
            </div>
          </div>
        </PhoneShell>
      </div>

      <div ref={panel} className="min-w-0">
        <ol className="so-steps flex gap-1.5" aria-label={copy.label}>
          {steps.map((s, i) => (
            <li key={s.key} className="flex-1">
              <button
                type="button"
                onClick={() => i < at && go(i)}
                disabled={i > at}
                aria-current={i === at ? 'step' : undefined}
                aria-label={`${i + 1}. ${s.title}`}
                className={`block h-1.5 w-full rounded-full transition-colors duration-500 ${i < at ? 'bg-primary/60 hover:bg-primary' : i === at ? 'bg-primary' : 'bg-[color-mix(in_oklab,var(--fg)_10%,transparent)]'}`}
              />
            </li>
          ))}
        </ol>

        <div key={step.key} className="so-copy mt-6 sm:mt-8">
          <p className="t-eyebrow">
            {fillLive(copy.stepOf, { n: at + 1, total: steps.length })}
            {step.status ? (
              <code className="ml-1 rounded-md bg-[color-mix(in_oklab,var(--fg)_6%,transparent)] px-1.5 py-0.5 text-[10.5px] font-bold tracking-wide text-fg-3">{step.status}</code>
            ) : null}
          </p>
          <h3 tabIndex={-1} className="t-display mt-3 outline-none">
            {step.title}
          </h3>
          <p className="t-lead mt-4 max-w-xl">{step.text}</p>
          {step.rule ? (
            <p className="mt-5 flex max-w-xl items-start gap-3 rounded-[18px] bg-[color-mix(in_oklab,var(--primary)_9%,transparent)] px-4 py-3 text-[14px] font-semibold leading-relaxed text-fg">
              <Icon name="clock" size={17} strokeWidth={2} className="mt-0.5 flex-none text-primary-ink" />
              {step.rule}
            </p>
          ) : null}
          {statusAt >= 0 ? null : step.key === 'checkout' ? (
            <p className="t-small mt-4 tnum">
              {rupees(subtotal)} + {rupees(split.customer)} = <b className="text-fg">{rupees(subtotal + split.customer)}</b>
            </p>
          ) : null}
        </div>

        <div className="mt-7 flex items-center gap-3 sm:mt-9">
          <button type="button" onClick={() => go(at - 1)} disabled={at === 0} className="btn btn-lg btn-glass disabled:pointer-events-none disabled:opacity-40">
            <Icon name="chevron-left" size={18} strokeWidth={2} />
            {copy.back}
          </button>
          <button type="button" onClick={() => (last ? restart() : go(at + 1))} disabled={blocked} className="btn btn-lg btn-primary disabled:pointer-events-none disabled:opacity-50">
            {last ? <Icon name="refresh" size={17} strokeWidth={2} /> : null}
            {nextLabel}
            {last ? null : <Icon name="arrow-right" size={18} strokeWidth={2} className="btn-arrow" />}
          </button>
        </div>
        {blocked ? <p className="mt-3 text-[13px] font-semibold text-fg-3">{copy.empty}</p> : null}
      </div>
    </div>
  );
}
