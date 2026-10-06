import Reveal from '@/components/motion/Reveal';
import CountUp from '@/components/ui/CountUp';
import Icon from '@/components/ui/Icon';
import Tilt from '@/components/ui/Tilt';

/** Figures as glass tiles that tilt toward the pointer and count up on arrival. */
export default function FactGrid({ items, cols = 4 }: { items: { icon: string; value: string; label: string }[]; cols?: 3 | 4 }) {
  // Three figures sit in one row on a phone too, as a compact strip.
  const trio = items.length === 3;
  return (
    <ul className={`grid gap-2 sm:grid-cols-2 sm:gap-4 ${trio ? 'grid-cols-3' : 'grid-cols-2'} ${cols === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
      {items.map((d, i) => (
        <Reveal as="li" key={d.label} index={i} className="flex">
          <Tilt max={6} className={`glass hover-lift stat-box relative flex w-full flex-col rounded-[var(--radius-card)] sm:p-6 ${trio ? 'p-3' : 'p-4'}`}>
            <span className={`icon-tile ${trio ? 'max-sm:hidden' : ''}`} style={{ ['--s' as string]: 'clamp(34px, 9vw, 44px)' }}>
              <Icon name={d.icon} size={21} strokeWidth={1.9} />
            </span>
            <CountUp value={d.value} className={`block whitespace-nowrap font-extrabold leading-none tracking-[-0.045em] text-fg sm:mt-8 sm:text-[clamp(1.45rem,1rem+2.4vw,2.8rem)] ${trio ? 'text-[clamp(1.05rem,0.7rem+1.8vw,1.35rem)]' : 'mt-5 text-[clamp(1.45rem,1rem+2.4vw,2.8rem)]'}`} />
            <span className={`mt-2 leading-snug text-fg-2 sm:text-[14.5px] ${trio ? 'text-[11.5px]' : 'text-[13px]'}`}>{d.label}</span>
          </Tilt>
        </Reveal>
      ))}
    </ul>
  );
}
