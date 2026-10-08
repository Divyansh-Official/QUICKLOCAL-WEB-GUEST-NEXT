'use client';

/**
 * Share this page: the system share sheet where there is one (phones, Safari,
 * Edge), otherwise the link goes to the clipboard and the chip says so. With
 * `url`, it shares that address instead of the current page.
 */
import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';

type Copy = { label: string; copied: string; failed: string };

export default function ShareButton({ copy, url, title, text, label, className = '', tone = 'chip' }: { copy: Copy; url?: string; title?: string; text?: string; label?: string; className?: string; tone?: 'chip' | 'button' }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const flash = (next: 'copied' | 'failed') => {
    setState(next);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState('idle'), 2200);
  };

  const share = async () => {
    const href = url ? new URL(url, window.location.origin).href : window.location.href.split('#')[0];
    const data = { title: title ?? document.title, text, url: href };
    if (navigator.share && (!navigator.canShare || navigator.canShare(data))) {
      try {
        await navigator.share(data);
        return;
      } catch (err) {
        if ((err as DOMException)?.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(href);
      flash('copied');
    } catch {
      flash('failed');
    }
  };

  const shown = state === 'copied' ? copy.copied : state === 'failed' ? copy.failed : (label ?? copy.label);
  const cls =
    tone === 'button'
      ? 'btn btn-md btn-glass'
      : 'chip min-h-8 gap-1.5 px-3 text-[12.5px] font-bold text-fg-2 transition-colors hover:bg-[color-mix(in_oklab,var(--fg)_10%,transparent)] hover:text-fg';

  return (
    <button type="button" onClick={share} className={`${cls} ${className}`} aria-live="polite">
      <Icon name={state === 'copied' ? 'check' : state === 'failed' ? 'info' : 'share'} size={tone === 'button' ? 17 : 14} strokeWidth={2} className={state === 'copied' ? 'text-ok' : undefined} />
      <span>{shown}</span>
    </button>
  );
}
