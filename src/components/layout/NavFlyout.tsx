'use client';

/**
 * A header entry that opens a small menu of pages — "Explore", "Partners" —
 * so the bar carries five entries instead of a dozen.
 *
 * The panel is portalled into the header but outside its glass capsule: a
 * backdrop-filter nested inside another only blurs its parent, and this panel
 * should blur the page. It opens on hover with a mouse (with a short grace
 * period to travel into it), on click or tap, and from the keyboard (Enter,
 * Space or ↓, which also moves focus into it). Escape, a click outside,
 * tabbing out, or another flyout opening closes it.
 */
import { useCallback, useEffect, useId, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Icon from '@/components/ui/Icon';
import type { NavGroup } from '@/lib/data';

const WIDTH = 360;
const EVENT = 'ql:flyout';

export default function NavFlyout({
  group,
  isActive,
  pathname,
  headerRef,
}: {
  group: NavGroup;
  isActive: (href: string) => boolean;
  pathname: string;
  headerRef: RefObject<HTMLElement | null>;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [pos, setPos] = useState({ left: 0, top: 0 });
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const timer = useRef(0);
  /* A mouse opens it on hover; the click that usually follows should not shut it again. */
  const hoveredAt = useRef(0);
  const active = group.items.some(i => isActive(i.href));

  useEffect(() => {
    const frame = requestAnimationFrame(() => setHost(headerRef.current));
    return () => cancelAnimationFrame(frame);
  }, [headerRef]);

  const place = useCallback(() => {
    const header = headerRef.current;
    const b = button.current?.getBoundingClientRect();
    const bar = header?.firstElementChild?.getBoundingClientRect();
    const h = header?.getBoundingClientRect();
    if (!b || !bar || !h) return;
    const left = Math.min(Math.max(12, b.left + b.width / 2 - WIDTH / 2), window.innerWidth - WIDTH - 12);
    setPos({ left: left - h.left, top: bar.bottom - h.top + 8 });
  }, [headerRef]);

  const show = useCallback(() => {
    window.clearTimeout(timer.current);
    place();
    setOpen(true);
    window.dispatchEvent(new CustomEvent(EVENT, { detail: id }));
  }, [id, place]);

  const hide = useCallback((delay = 0) => {
    window.clearTimeout(timer.current);
    if (delay) timer.current = window.setTimeout(() => setOpen(false), delay);
    else setOpen(false);
  }, []);

  /* Only one open at a time. */
  useEffect(() => {
    const other = (e: Event) => (e as CustomEvent<string>).detail !== id && setOpen(false);
    window.addEventListener(EVENT, other);
    return () => window.removeEventListener(EVENT, other);
  }, [id]);

  /* Navigating closes it. */
  useEffect(() => {
    const frame = requestAnimationFrame(() => setOpen(false));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!button.current?.contains(t) && !panel.current?.contains(t)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      if (panel.current?.contains(document.activeElement)) button.current?.focus();
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', place);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', place);
    };
  }, [open, place]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const focusFirst = () => requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>('a')?.focus());

  const leaving = (e: React.FocusEvent) => {
    const next = e.relatedTarget as Node | null;
    if (next && (button.current?.contains(next) || panel.current?.contains(next))) return;
    setOpen(false);
  };

  return (
    <>
      <button
        ref={button}
        type="button"
        className="nav-link gap-1"
        data-active={active || undefined}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => {
          if (open && performance.now() - hoveredAt.current < 700) return;
          if (open) hide();
          else show();
        }}
        onPointerEnter={e => {
          if (e.pointerType !== 'mouse') return;
          hoveredAt.current = performance.now();
          show();
        }}
        onPointerLeave={e => e.pointerType === 'mouse' && hide(180)}
        onKeyDown={e => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            show();
            focusFirst();
          }
        }}
        onBlur={leaving}>
        {group.label}
        <Icon name="chevron-down" size={14} strokeWidth={2.2} className="nav-chevron" />
      </button>
      {host
        ? createPortal(
            <div
              ref={panel}
              id={id}
              className="nav-flyout"
              data-open={open || undefined}
              inert={!open}
              style={{ left: pos.left, top: pos.top, width: WIDTH }}
              onPointerEnter={e => e.pointerType === 'mouse' && window.clearTimeout(timer.current)}
              onPointerLeave={e => e.pointerType === 'mouse' && hide(180)}
              onBlur={leaving}
              onKeyDown={e => {
                if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
                e.preventDefault();
                const links = Array.from(panel.current?.querySelectorAll<HTMLElement>('a') ?? []);
                const at = links.indexOf(document.activeElement as HTMLElement);
                links[(at + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length]?.focus();
              }}>
              <p className="px-3 pb-1.5 pt-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-fg-3">{group.label}</p>
              <ul>
                {group.items.map((item, i) => (
                  <li key={item.href} style={{ ['--i' as string]: i }}>
                    <Link href={item.href} className="nav-flyout-row" aria-current={isActive(item.href) ? 'page' : undefined} onClick={() => setOpen(false)}>
                      <span className="nav-flyout-icon">
                        <Icon name={item.icon} size={18} strokeWidth={1.9} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[14.5px] font-bold tracking-[-0.015em] text-fg">{item.label}</span>
                        <span className="block truncate text-[12.5px] text-fg-2">{item.text}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>,
            host,
          )
        : null}
    </>
  );
}
