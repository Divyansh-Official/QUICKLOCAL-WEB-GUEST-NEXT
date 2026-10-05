import Reveal from '@/components/motion/Reveal';
import Icon from '@/components/ui/Icon';
import Tilt from '@/components/ui/Tilt';

/**
 * The three kinds of shop offer as tear-off tickets: a notched card with a
 * perforated seam, the saving stamped large on the left. The stamp lands as
 * each ticket scrolls in (`.ticket-stamp`, a view timeline).
 */
export default function OfferTickets({ items, note }: { items: { kind: string; value: string; detail: string; icon: string }[]; note: string }) {
  return (
    <>
      <ul className="grid gap-4 lg:grid-cols-3">
        {items.map((t, i) => (
          <Reveal as="li" key={t.kind} index={i} className="flex">
            <Tilt max={7} className="ticket hover-lift flex w-full items-stretch">
              <span className="ticket-stub grid w-[42%] place-items-center px-3 py-7 text-center text-white">
                <span className="ticket-stamp block text-[clamp(1.6rem,1.2rem+1.4vw,2.2rem)] font-extrabold leading-none tracking-[-0.04em]">{t.value}</span>
              </span>
              <span className="flex flex-1 flex-col justify-center gap-1.5 px-5 py-6">
                <span className="flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-[0.12em] text-primary-ink">
                  <Icon name={t.icon} size={14} strokeWidth={2} />
                  {t.kind}
                </span>
                <span className="text-[15px] font-semibold leading-snug text-fg">{t.detail}</span>
              </span>
            </Tilt>
          </Reveal>
        ))}
      </ul>
      <p className="t-small mt-4 text-center">{note}</p>
    </>
  );
}
