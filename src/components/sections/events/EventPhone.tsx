import type { CSSProperties } from 'react';
import PhoneShell from '@/components/art/PhoneShell';
import Icon from '@/components/ui/Icon';

export type EventScreen = {
  place: string;
  search: string;
  all: string;
  event: string;
  aisles: string[];
  kicker: string;
  headline: string;
  blurb: string;
  tiles: string[];
};

const k = (n: number) => ({ '--k': n }) as CSSProperties;

/**
 * The customer app's home with an event running: the event's tab slides into
 * the category rail right after All and glows, its page opens beneath with the
 * occasion's headline and offer tiles. All of it is a view timeline on the
 * phone itself — it plays as the phone scrolls into view, and rests on its
 * final frame without scroll-driven animation support.
 */
export default function EventPhone({ screen, width }: { screen: EventScreen; width?: string }) {
  return (
    <PhoneShell width={width ?? 'clamp(240px, 26vw, 300px)'} className="ev-phone">
      <div className="flex h-full flex-col px-[5.5cqw] pb-[6cqw] pt-[14cqw]">
        <div className="flex items-center gap-[2cqw] text-[3.4cqw] font-bold text-fg-2">
          <Icon name="pin" size={12} strokeWidth={2.2} className="text-primary" />
          {screen.place}
        </div>
        <div className="mt-[3cqw] flex items-center gap-[2.4cqw] rounded-full bg-[color-mix(in_oklab,var(--fg)_6%,var(--card))] px-[4cqw] py-[2.8cqw] text-[3.3cqw] text-fg-3">
          <Icon name="search" size={12} strokeWidth={2.2} />
          <span className="truncate">{screen.search}</span>
        </div>

        {/* the rail: All, then the event, then the aisles */}
        <div className="mt-[4cqw] flex items-center gap-[1.8cqw] overflow-hidden">
          <span className="flex-none rounded-full bg-[color-mix(in_oklab,var(--fg)_6%,transparent)] px-[3.2cqw] py-[1.8cqw] text-[3.3cqw] font-extrabold text-fg-2">{screen.all}</span>
          <span className="ev-tab relative flex flex-none items-center gap-[1.4cqw] overflow-hidden whitespace-nowrap rounded-full bg-[linear-gradient(135deg,#d9a62b,#c1621b)] py-[1.8cqw] pl-[2.6cqw] pr-[3.2cqw] text-[3.3cqw] font-extrabold text-white shadow-[0_6px_16px_-8px_rgb(193_98_27/0.9)]">
            <Icon name="sparkle" size={11} />
            {screen.event}
          </span>
          {screen.aisles.map(a => (
            <span key={a} className="flex-none rounded-full bg-[color-mix(in_oklab,var(--fg)_6%,transparent)] px-[3.2cqw] py-[1.8cqw] text-[3.3cqw] font-extrabold text-fg-2">
              {a}
            </span>
          ))}
        </div>

        {/* the event's own page */}
        <div className="ev-hero relative mt-[4.4cqw] overflow-hidden rounded-[5cqw] bg-[#FBE7C6] px-[5cqw] py-[5cqw] text-[#3d2508] dark:bg-[#3a2a14] dark:text-[#fbe7c6]">
          <span aria-hidden="true" className="absolute -right-[6cqw] -top-[6cqw] h-[26cqw] w-[26cqw] rounded-full bg-[radial-gradient(closest-side,rgb(217_166_43/0.55),transparent)]" />
          <p className="relative text-[3cqw] font-extrabold tracking-[0.14em] text-[#C1621B] dark:text-[#f5b55a]">{screen.kicker}</p>
          <p className="relative mt-[1.4cqw] text-[5.6cqw] font-extrabold leading-tight tracking-[-0.03em]">{screen.headline}</p>
          <p className="relative mt-[1.4cqw] text-[3.2cqw] opacity-75">{screen.blurb}</p>
        </div>
        <div className="mt-[3.6cqw] grid grid-cols-2 gap-[2.4cqw]">
          {screen.tiles.map((t, i) => (
            <span key={t} className="ev-tile flex flex-col rounded-[4cqw] bg-[color-mix(in_oklab,var(--fg)_5%,var(--card))] p-[2.4cqw]" style={k(i)}>
              <span className="block aspect-[5/3] rounded-[3cqw] bg-[color-mix(in_oklab,#d9a62b_22%,var(--card))]" />
              <span className="mt-[1.6cqw] truncate text-[3.2cqw] font-bold text-fg">{t}</span>
            </span>
          ))}
        </div>
      </div>
      <div aria-hidden="true" className="absolute inset-x-[5cqw] bottom-[5cqw] flex h-[14cqw] items-center justify-around rounded-full bg-[color-mix(in_oklab,var(--fg)_6%,var(--card))] text-fg-3 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--fg)_5%,transparent)]">
        {['home', 'search', 'basket', 'users'].map((icon, i) => (
          <span key={icon} className={`grid h-[10cqw] w-[10cqw] place-items-center rounded-full ${i === 0 ? 'bg-primary text-white' : ''}`}>
            <Icon name={icon} size={15} strokeWidth={2} />
          </span>
        ))}
      </div>
    </PhoneShell>
  );
}
