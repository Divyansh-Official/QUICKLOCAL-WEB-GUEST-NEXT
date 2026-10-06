import Reveal from '@/components/motion/Reveal';
import Icon from '@/components/ui/Icon';
import Slab3D from '@/components/ui/Slab3D';
import Tilt from '@/components/ui/Tilt';
import RailDots from '@/components/ui/RailDots';

const HUE: Record<string, string> = { festive: 'butter', rain: 'sky', night: 'ink', warm: 'rose' };

/** Example occasions as glass cards, each with its own 3D slab and window. */
export default function Occasions({ items }: { items: { name: string; line: string; window: string; icon: string; tone: string }[] }) {
  return (
    <>
      <ul className="m-rail grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-4 [--rail-w:70vw]">
      {items.map((o, i) => (
        <Reveal as="li" key={o.name} index={i} className="flex">
          <Tilt max={7} className="group glass hover-lift flex w-full flex-col rounded-[var(--radius-card)] p-6">
            <span className="chip chip-brand self-start">
              <Icon name="calendar" size={13} />
              {o.window}
            </span>
            <span className="my-6 flex justify-center">
              <Slab3D icon={o.icon} hue={HUE[o.tone] ?? 'tangerine'} size={124} />
            </span>
            <span className="text-[20px] font-extrabold tracking-[-0.03em] text-fg">{o.name}</span>
            <span className="mt-1.5 text-[14px] leading-snug text-fg-2">{o.line}</span>
          </Tilt>
        </Reveal>
      ))}
    </ul>
    <RailDots count={items.length} />
    </>
  );
}
