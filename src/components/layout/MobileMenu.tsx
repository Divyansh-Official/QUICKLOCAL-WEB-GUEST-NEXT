'use client';

/**
 * The menu below 1120px, opening UNDER the header: the header never moves —
 * its button turns into a close button — while the page behind blurs into a
 * glass backdrop and the panel drops in on a spring, its rows following one
 * after another.
 *
 * A non-modal <dialog> so it can sit beneath the header, doing the modal work
 * itself: everything outside the header and the menu goes inert, Escape and a
 * tap on the backdrop close it, focus returns to the button, and the page
 * behind holds still (html:has(dialog[open])).
 */
import { useEffect, useRef, type RefObject } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { ThemeSegmented } from '@/components/ui/ThemeToggle';
import { prefersCalm } from '@/lib/hooks';

export type MenuProps = {
  id: string;
  open: boolean;
  onClose: () => void;
  toggleRef: RefObject<HTMLButtonElement | null>;
  items: { label: string; href: string }[];
  cta: { label: string; href: string; icon?: string };
  contact: { phone: string; phoneHref: string; email: string; emailHref: string; address: string };
  labels: {
    menu: string;
    primaryNav: string;
    openMenu: string;
    closeMenu: string;
    theme: { label: string; toggle: string; light: string; dark: string; system: string };
  };
  isActive: (href: string) => boolean;
  pathname: string;
  showTheme: boolean;
};

function setOutsideInert(dialog: HTMLDialogElement | null, inert: boolean) {
  const header = document.querySelector('.site-header');
  Array.from(document.body.children).forEach(el => {
    if (el === dialog || el === header || el.tagName === 'SCRIPT') return;
    if (inert) el.setAttribute('inert', '');
    else el.removeAttribute('inert');
  });
}

export default function MobileMenu({ id, open, onClose, toggleRef, items, cta, contact, labels, isActive, pathname, showTheme }: MenuProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const firstPath = useRef(pathname);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.removeAttribute('data-closing');
      dialog.show();
      setOutsideInert(dialog, true);
      dialog.querySelector<HTMLElement>('a, button')?.focus({ preventScroll: true });
      return;
    }
    if (!open && dialog.open) {
      setOutsideInert(dialog, false);
      if (dialog.contains(document.activeElement)) toggleRef.current?.focus({ preventScroll: true });
      if (prefersCalm()) {
        dialog.close();
        return;
      }
      dialog.setAttribute('data-closing', '');
      const timer = window.setTimeout(() => {
        dialog.close();
        dialog.removeAttribute('data-closing');
      }, 220);
      return () => window.clearTimeout(timer);
    }
  }, [open, toggleRef]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => () => setOutsideInert(ref.current, false), []);

  /* Close after navigating — but not on first mount. */
  useEffect(() => {
    if (pathname !== firstPath.current) {
      firstPath.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  return (
    <dialog ref={ref} id={id} className="menu-sheet" aria-label={labels.menu}>
      <div className="menu-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="menu-panel glass glass-raised relative mx-auto mt-[calc(var(--header-h)+4px)] flex max-h-[calc(100dvh-var(--header-h)-16px)] w-[calc(100%-20px)] max-w-xl flex-col overflow-hidden rounded-[30px] bg-card/90">
        <div className="no-scrollbar flex-1 overflow-y-auto px-6 pb-7 pt-4">
          <nav aria-label={labels.primaryNav}>
            <ul>
              {items.map((item, i) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href} className="menu-item" style={{ ['--i' as string]: i }}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? 'page' : undefined}
                      className={`flex items-center justify-between border-b border-hair py-3 text-[26px] font-extrabold tracking-[-0.035em] transition-colors ${
                        active ? 'text-primary-ink' : 'text-fg hover:text-primary-ink'
                      }`}>
                      {item.label}
                      <Icon name="chevron-right" size={20} strokeWidth={2} className="text-fg-3" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="menu-item mt-7" style={{ ['--i' as string]: items.length }}>
            <Button href={cta.href} size="lg" block iconStart={cta.icon}>
              {cta.label}
            </Button>
          </div>

          {showTheme ? (
            <div className="menu-item mt-6 flex flex-col items-start gap-3 min-[400px]:flex-row min-[400px]:items-center min-[400px]:justify-between" style={{ ['--i' as string]: items.length + 1 }}>
              <span className="text-[14px] font-bold text-fg-2">{labels.theme.label}</span>
              <ThemeSegmented labels={labels.theme} />
            </div>
          ) : null}

          <div className="menu-item mt-6 space-y-2.5 border-t border-hair pt-5 text-[15px] text-fg-2" style={{ ['--i' as string]: items.length + 2 }}>
            <a href={contact.phoneHref} className="flex items-center gap-3 hover:text-fg">
              <Icon name="phone" size={16} className="text-primary" />
              {contact.phone}
            </a>
            <a href={contact.emailHref} className="flex items-center gap-3 break-all hover:text-fg">
              <Icon name="mail" size={16} className="text-primary" />
              {contact.email}
            </a>
            <p className="flex items-center gap-3">
              <Icon name="pin" size={16} className="text-primary" />
              {contact.address}
            </p>
          </div>
        </div>
      </div>
    </dialog>
  );
}
