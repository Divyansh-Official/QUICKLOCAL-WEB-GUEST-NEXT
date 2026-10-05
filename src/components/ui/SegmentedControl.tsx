'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import Icon from './Icon';

/**
 * iOS segmented control: one selected pill that slides between segments on a
 * spring rather than fading in place.
 *   mode 'tabs'    a real tablist — arrows, Home and End move focus and selection
 *   mode 'filter'  toggle buttons with aria-pressed
 * Until JavaScript measures, the selected segment paints its own background,
 * so nothing jumps on hydration.
 */
export default function SegmentedControl({
  items,
  value,
  onChange,
  mode = 'filter',
  label,
  idPrefix = 'seg',
  className = '',
}: {
  items: { value: string; label: string; icon?: string }[];
  value: string;
  onChange: (value: string) => void;
  mode?: 'tabs' | 'filter';
  label: string;
  idPrefix?: string;
  className?: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);
  const tabs = mode === 'tabs';

  const measure = useCallback(() => {
    const active = track.current?.querySelector<HTMLElement>('[data-active="true"]');
    if (active) setPill({ x: active.offsetLeft, w: active.offsetWidth });
  }, []);

  useEffect(() => {
    measure();
    const el = track.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure, value]);

  useEffect(() => {
    const el = track.current;
    const active = el?.querySelector<HTMLElement>('[data-active="true"]');
    if (!el || !active || el.scrollWidth <= el.clientWidth) return;
    el.scrollTo({ left: active.offsetLeft - (el.clientWidth - active.offsetWidth) / 2, behavior: 'smooth' });
  }, [value]);

  const onKeyDown = (event: KeyboardEvent) => {
    if (!tabs) return;
    const index = items.findIndex(i => i.value === value);
    let next: number | null = null;
    if (event.key === 'ArrowRight') next = (index + 1) % items.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = items.length - 1;
    if (next == null) return;
    event.preventDefault();
    onChange(items[next].value);
    track.current?.querySelector<HTMLElement>(`[data-index="${next}"]`)?.focus();
  };

  return (
    <div
      ref={track}
      role={tabs ? 'tablist' : 'group'}
      aria-label={label}
      onKeyDown={onKeyDown}
      className={`segmented ${className}`}
      data-ready={pill ? '' : undefined}
      style={pill ? ({ '--x': `${pill.x}px`, '--w': `${pill.w}px` } as CSSProperties) : undefined}>
      <span className="segmented-pill" aria-hidden="true" />
      {items.map((item, index) => {
        const selected = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            data-index={index}
            data-active={selected ? 'true' : 'false'}
            className="segmented-btn"
            onClick={() => onChange(item.value)}
            {...(tabs
              ? { role: 'tab', id: `${idPrefix}-tab-${item.value}`, 'aria-selected': selected, 'aria-controls': `${idPrefix}-panel`, tabIndex: selected ? 0 : -1 }
              : { 'aria-pressed': selected })}>
            {item.icon ? <Icon name={item.icon} size={16} /> : null}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
