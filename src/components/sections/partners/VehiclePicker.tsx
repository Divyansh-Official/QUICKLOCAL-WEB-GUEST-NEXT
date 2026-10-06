'use client';

/**
 * Pick what you ride; see what you bring. The list is the one
 * VerificationGateService computes from the vehicle: identity, tax, payout
 * proof and three photographs for everyone, plus a licence, an RC and a
 * declared plate for anything with an engine. Choosing a bicycle folds the
 * engine group away (a grid-rows transition, so the page below glides rather
 * than jumps), and the slab beside it turns to the new vehicle.
 */
import { useState } from 'react';
import Icon from '@/components/ui/Icon';
import Slab3D from '@/components/ui/Slab3D';
import { fillLive } from '@/lib/format';

type Vehicle = { type: string; label: string; icon: string; motorised: boolean };
type Doc = { type: string; label: string; icon: string };

export default function VehiclePicker({
  vehicles,
  everyone,
  motorised,
  copy,
}: {
  vehicles: Vehicle[];
  everyone: Doc[];
  motorised: Doc[];
  copy: { label: string; everyone: string; motorised: string; count: string; payout: string; photos: string };
}) {
  const [type, setType] = useState(vehicles[0].type);
  const vehicle = vehicles.find(v => v.type === type) ?? vehicles[0];
  const count = everyone.length + (vehicle.motorised ? motorised.length : 0);

  return (
    <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
      <div className="flex min-w-0 flex-col items-center gap-4 sm:gap-8 lg:sticky lg:top-[calc(var(--header-h)+40px)]">
        <div className="group relative grid place-items-center">
          <span aria-hidden="true" className="absolute inset-[-12%] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--primary)_16%,transparent),transparent)]" />
          <span key={vehicle.type} className="enter-scale relative">
            <Slab3D icon={vehicle.icon} hue={vehicle.motorised ? 'ink' : 'green'} size={220} phoneSize={104} active />
          </span>
        </div>
        <div role="group" aria-label={copy.label} className="flex max-w-[400px] flex-wrap justify-center gap-2">
          {vehicles.map(v => {
            const on = v.type === type;
            return (
              <button
                key={v.type}
                type="button"
                aria-pressed={on}
                onClick={() => setType(v.type)}
                className={`inline-flex h-9 items-center gap-1.5 rounded-full pl-2.5 pr-3.5 text-[13px] sm:h-11 sm:gap-2 sm:pl-3 sm:pr-4 sm:text-[14px] font-bold transition-[background-color,color,box-shadow,transform] duration-300 active:scale-95 ${
                  on ? 'btn-primary' : 'glass text-fg-2 hover:text-fg'
                }`}>
                <Icon name={v.icon} size={18} strokeWidth={1.9} />
                {v.label}
              </button>
            );
          })}
        </div>
        <p key={count} className="enter-scale tnum text-center text-[15px] font-extrabold text-fg-2" aria-live="polite">
          {fillLive(copy.count, { count })}
        </p>
      </div>

      <div className="min-w-0">
        <p className="flex items-start gap-3 rounded-[22px] bg-[color-mix(in_oklab,var(--primary)_10%,transparent)] px-4 py-3 text-[13.5px] font-semibold leading-relaxed text-fg sm:px-5 sm:py-4 sm:text-[14.5px]">
          <Icon name="wallet" size={19} strokeWidth={2} className="mt-0.5 flex-none text-primary-ink" />
          {copy.payout}
        </p>

        <h3 className="mt-8 text-[12px] font-extrabold uppercase tracking-[0.14em] text-fg-3">{copy.everyone}</h3>
        <DocGrid docs={everyone} />
        <p className="t-small mt-3">{copy.photos}</p>

        <div className="ql-collapse" data-open={vehicle.motorised ? '' : undefined}>
          <div>
            <h3 className="mt-8 text-[12px] font-extrabold uppercase tracking-[0.14em] text-fg-3">{copy.motorised}</h3>
            <DocGrid docs={motorised} />
          </div>
        </div>
      </div>
    </div>
  );
}

function DocGrid({ docs }: { docs: Doc[] }) {
  return (
    <ul className="mt-3 grid grid-cols-2 gap-2 sm:gap-3">
      {docs.map((d, i) => (
        <li key={d.type} className="glass doc-card flex items-center gap-2.5 rounded-[16px] p-2.5 sm:gap-3.5 sm:rounded-[20px] sm:p-4" style={{ ['--k' as string]: i }}>
          <span className="icon-tile icon-tile-soft" style={{ ['--s' as string]: '40px' }}>
            <Icon name={d.icon} size={18} strokeWidth={1.9} />
          </span>
          <span className="min-w-0 text-[13px] font-bold leading-tight tracking-[-0.015em] text-fg sm:text-[15.5px]">{d.label}</span>
          <Icon name="check-circle" size={18} strokeWidth={2} className="ml-auto flex-none text-ok max-sm:hidden" />
        </li>
      ))}
    </ul>
  );
}
