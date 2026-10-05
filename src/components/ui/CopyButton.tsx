'use client';

import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';

/** Copies a value and confirms with an iOS-style swap. */
export default function CopyButton({ value, label, copiedLabel }: { value: string; label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* Clipboard denied outside a secure context — the value is still visible. */
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="chip relative z-[2] min-h-8 px-3 transition-colors hover:bg-[color-mix(in_oklab,var(--fg)_10%,transparent)]"
      aria-label={copied ? copiedLabel : `${label} ${value}`}>
      <Icon name={copied ? 'check' : 'copy'} size={14} strokeWidth={copied ? 2.4 : 1.7} className={copied ? 'text-ok-ink' : ''} />
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  );
}
