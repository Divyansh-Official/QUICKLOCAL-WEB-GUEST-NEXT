'use client';

import { useState, type ReactNode } from 'react';
import Icon from './Icon';

/**
 * Long copy, folded on a phone: the first paragraph shows, the rest open on
 * request. On wider screens everything shows and the toggle is not rendered
 * visibly (see `.read-more` in globals.css).
 */
export default function ReadMore({ children, more, less, className = '' }: { children: ReactNode; more: string; less: string; className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`read-more space-y-5 ${className}`} data-open={open || undefined}>
      {children}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="read-more-toggle items-center gap-1 text-[14px] font-bold text-primary-ink">
        {open ? less : more}
        <Icon name="chevron-down" size={15} strokeWidth={2.2} className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
}
