import type { CSSProperties } from 'react';
import Icon from '@/components/ui/Icon';

/**
 * The messages an order sends, as a stack of phone notifications that slide
 * down into place one after another as the stack scrolls through (each card
 * on its own view-timeline range). Static and complete without support.
 */
export default function MessageStack({ items, now, brand }: { items: { icon: string; title: string; text: string }[]; now: string; brand: string }) {
  return (
    <ol className="mx-auto flex max-w-[460px] flex-col gap-2.5">
      {items.map((m, i) => (
        <li key={m.title} className="notif glass glass-raised flex items-center gap-3.5 rounded-[22px] p-3.5 pr-4" style={{ '--k': i } as CSSProperties}>
          <span aria-hidden="true" className="grid h-10 w-10 flex-none place-items-center rounded-[12px] bg-[linear-gradient(150deg,#f7a552,#e0721a)] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.4)]">
            <Icon name={m.icon} size={19} strokeWidth={2} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-baseline justify-between gap-3">
              <span className="truncate text-[12px] font-extrabold uppercase tracking-[0.1em] text-fg-3">{brand}</span>
              <span className="flex-none text-[12px] text-fg-3">{now}</span>
            </span>
            <span className="block truncate text-[15px] font-extrabold tracking-[-0.015em] text-fg">{m.title}</span>
            <span className="block truncate text-[13.5px] text-fg-2">{m.text}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
