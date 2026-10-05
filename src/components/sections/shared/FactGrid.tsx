import Reveal from '@/components/motion/Reveal';
import CountUp from '@/components/ui/CountUp';
import Icon from '@/components/ui/Icon';
import Tilt from '@/components/ui/Tilt';

/** Figures as glass tiles that tilt toward the pointer and count up on arrival. */
export default function FactGrid({ items, cols = 4 }: { items: { icon: string; value: string; label: string }[]; cols?: 3 | 4 }) {
  return (
    <ul className={`grid grid-cols-1 gap-4 xs:grid-cols-2 ${cols === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
      {items.map((d, i) => (
        <Reveal as="li" key={d.label} index={i} className="flex">
          <Tilt max={6} className="glass hover-lift stat-box relative flex w-full flex-col rounded-[var(--radius-card)] p-6">
            <span className="icon-tile" style={{ ['--s' as string]: '44px' }}>
              <Icon name={d.icon} size={21} strokeWidth={1.9} />
            </span>
            <CountUp value={d.value} className="mt-8 block whitespace-nowrap text-[clamp(2rem,1.6rem+1.6vw,2.8rem)] font-extrabold leading-none tracking-[-0.045em] text-fg" />
            <span className="mt-2 text-[14.5px] leading-snug text-fg-2">{d.label}</span>
          </Tilt>
        </Reveal>
      ))}
    </ul>
  );
}
