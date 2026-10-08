'use client';

import { useEffect, useSyncExternalStore, type MouseEvent } from 'react';
import Icon from './Icon';
import SegmentedControl from './SegmentedControl';

/**
 * Appearance: Light, Dark or Auto (the device's). The head script has already
 * applied the stored choice before first paint; this only changes it.
 *
 * The new theme opens out of the button as a widening circle — a View
 * Transition of the whole page, so nothing re-renders mid-animation — and
 * simply swaps where View Transitions or motion are unavailable. The choice is
 * a per-visitor convenience, kept in localStorage.
 */
type Choice = 'light' | 'dark' | 'system';
const ORDER: Choice[] = ['light', 'dark', 'system'];
const KEY = 'ql-theme';
const listeners = new Set<() => void>();

function readChoice(): Choice {
  const value = document.documentElement.getAttribute('data-theme-choice');
  return value === 'light' || value === 'dark' || value === 'system' ? value : 'system';
}

function resolve(choice: Choice): 'light' | 'dark' {
  if (choice !== 'system') return choice;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function apply(choice: Choice, origin?: { x: number; y: number }) {
  const root = document.documentElement;
  const next = resolve(choice);
  const commit = () => {
    root.setAttribute('data-theme', next);
    root.setAttribute('data-theme-choice', choice);
    try {
      localStorage.setItem(KEY, choice);
    } catch {
      /* A blocked store only means the choice is not remembered. */
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#12100d' : '#fdfaf6');
    listeners.forEach(fn => fn());
  };

  const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches || root.classList.contains('no-motion');
  if (root.getAttribute('data-theme') === next || calm || typeof document.startViewTransition !== 'function' || !origin) {
    commit();
    return;
  }
  const radius = Math.hypot(Math.max(origin.x, innerWidth - origin.x), Math.max(origin.y, innerHeight - origin.y));
  root.style.setProperty('--tx', `${origin.x}px`);
  root.style.setProperty('--ty', `${origin.y}px`);
  root.style.setProperty('--tr', `${radius}px`);
  root.setAttribute('data-theme-switching', '');
  const transition = document.startViewTransition(commit);
  transition.finished.finally(() => root.removeAttribute('data-theme-switching'));
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function useChoice() {
  return useSyncExternalStore(subscribe, readChoice, () => 'system' as Choice);
}

/** While on Auto, follow the device when it switches. */
function useFollowSystem(choice: Choice) {
  useEffect(() => {
    if (choice !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const on = () => apply('system');
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [choice]);
}

const ICON: Record<Choice, string> = { light: 'sun', dark: 'moon', system: 'contrast' };

/** A round button for the header: cycles Light → Dark → Auto. */
export function ThemeButton({ labels, className = '' }: { labels: { toggle: string; light: string; dark: string; system: string }; className?: string }) {
  const choice = useChoice();
  useFollowSystem(choice);
  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    /* From Auto, the first tap always changes what is on screen. */
    const next: Choice = choice === 'system' ? (resolve('system') === 'dark' ? 'light' : 'dark') : choice === 'light' ? 'dark' : 'system';
    const r = event.currentTarget.getBoundingClientRect();
    apply(next, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`icon-btn h-10 w-10 text-fg hover:bg-[color-mix(in_oklab,var(--fg)_7%,transparent)] ${className}`}
      aria-label={`${labels.toggle}: ${labels[choice]}`}
      title={`${labels.toggle}: ${labels[choice]}`}>
      <Icon name={ICON[choice]} size={19} strokeWidth={1.8} />
    </button>
  );
}

/** The full control, for the footer and the menu. */
export function ThemeSegmented({ labels }: { labels: { label: string; light: string; dark: string; system: string } }) {
  const choice = useChoice();
  useFollowSystem(choice);
  return (
    <SegmentedControl
      label={labels.label}
      value={choice}
      onChange={value => {
        const btn = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        const r = btn?.getBoundingClientRect();
        apply(value as Choice, r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : undefined);
      }}
      items={ORDER.map(value => ({ value, label: labels[value], icon: ICON[value] }))}
    />
  );
}
