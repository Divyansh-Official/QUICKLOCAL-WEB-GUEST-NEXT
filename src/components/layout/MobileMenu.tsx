'use client';

/**
 * The menu below 960px, opening UNDER the header: the header never moves —
 * its button turns into a close button — while the page behind blurs into a
 * glass backdrop and the panel drops in on a spring, its rows following one
 * after another.
 *
 * A non-modal <dialog> so it can sit beneath the header, doing the modal work
 * itself: everything outside the header and the menu goes inert, Escape and a
 * tap on the backdrop close it, focus returns to the button, and the page
 * behind holds still (lockPage).
 */
import { useEffect, useRef, type RefObject } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import InstallApp from '@/components/pwa/InstallApp';
import { openSearch } from '@/components/search/SearchDialog';
import { ThemeSegmented } from '@/components/ui/ThemeToggle';
import type { NavGroup } from '@/lib/data';
import { lockPage, prefersCalm } from '@/lib/hooks';

export type MenuProps = {
  id: string;
  open: boolean;
  onClose: () => void;
  toggleRef: RefObject<HTMLButtonElement | null>;
  /** The four pages people open most, large. */
  main: { label: string; href: string }[];
  /** Everything else, in the same groups the header's flyouts use. */
  groups: NavGroup[];
  cta: { label: string; href: string; icon?: string };
  contact: { phone: string; phoneHref: string; email: string; emailHref: string; address: string };
  labels: {
    menu: string;
    primaryNav: string;
    search: string;
    contactUs: string;
    install: { title: string; text: string; button: string; iosTitle: string; iosSteps: string; installed: string; note: string };
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

export default function MobileMenu({ id, open, onClose, toggleRef, main, groups, cta, contact, labels, isActive, pathname, showTheme }: MenuProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const firstPath = useRef(pathname);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.removeAttribute('data-closing');
      dialog.show();
      lockPage(true);
      setOutsideInert(dialog, true);
      dialog.querySelector<HTMLElement>('a, button')?.focus({ preventScroll: true });
      return;
    }
    if (!open && dialog.open) {
      setOutsideInert(dialog, false);
      lockPage(false);
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
          <button
            type="button"
            onClick={() => {
              onClose();
              window.setTimeout(openSearch, 60);
            }}
            className="menu-item flex h-12 w-full items-center gap-3 rounded-full bg-[color-mix(in_oklab,var(--fg)_6%,transparent)] px-4 text-left text-[15.5px] font-semibold text-fg-3 transition-colors hover:text-fg-2"
            style={{ ['--i' as string]: 0 }}>
            <Icon name="search" size={18} strokeWidth={2} />
            {labels.search}
          </button>

          <nav aria-label={labels.primaryNav} className="mt-2">
            <ul>
              {main.map((item, i) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href} className="menu-item" style={{ ['--i' as string]: i + 1 }}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? 'page' : undefined}
                      className={`flex items-center justify-between border-b border-hair py-3 text-[24px] font-extrabold tracking-[-0.035em] transition-colors ${
                        active ? 'text-primary-ink' : 'text-fg hover:text-primary-ink'
                      }`}>
                      {item.label}
                      <Icon name="chevron-right" size={20} strokeWidth={2} className="text-fg-3" />
                    </Link>
                  </li>
                );
              })}
            </ul>
            {groups.map((group, g) => (
              <div key={group.key} className="menu-item mt-5" style={{ ['--i' as string]: main.length + 1 + g }}>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-fg-3">{group.label}</p>
                <ul className="mt-2 grid grid-cols-2 gap-1.5">
                  {group.items
                    .filter(item => !main.some(m => m.href === item.href))
                    .map(item => {
                      const active = isActive(item.href);
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={onClose}
                            aria-current={active ? 'page' : undefined}
                            className={`flex min-h-12 items-center gap-2.5 rounded-2xl px-2.5 py-2 text-[14px] font-bold leading-tight tracking-[-0.015em] transition-colors ${
                              active ? 'bg-[color-mix(in_oklab,var(--primary)_12%,transparent)] text-primary-ink' : 'text-fg hover:bg-[color-mix(in_oklab,var(--fg)_6%,transparent)]'
                            }`}>
                            <span className="grid h-8 w-8 flex-none place-items-center rounded-[10px] bg-primary-soft text-primary-ink">
                              <Icon name={item.icon} size={16} strokeWidth={1.9} />
                            </span>
                            {item.label}
                          </Link>
                        </li>
                      );
                    })}
                </ul>
              </div>
            ))}
          </nav>

          <div className="menu-item mt-7" style={{ ['--i' as string]: main.length + groups.length + 1 }}>
            <Button href={cta.href} size="lg" block iconStart={cta.icon}>
              {cta.label}
            </Button>
            <div className="mt-3 empty:hidden">
              <InstallApp copy={labels.install} compact />
            </div>
          </div>

          {showTheme ? (
            <div className="menu-item mt-6 flex flex-col items-start gap-3 min-[400px]:flex-row min-[400px]:items-center min-[400px]:justify-between" style={{ ['--i' as string]: main.length + groups.length + 2 }}>
              <span className="text-[14px] font-bold text-fg-2">{labels.theme.label}</span>
              <ThemeSegmented labels={labels.theme} />
            </div>
          ) : null}

          <div className="menu-item mt-6 space-y-2.5 border-t border-hair pt-5 text-[15px] text-fg-2" style={{ ['--i' as string]: main.length + groups.length + 3 }}>
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
            <Link href="/contact" onClick={onClose} className="inline-flex items-center gap-1 pt-1 font-bold text-primary-ink">
              {labels.contactUs}
              <Icon name="arrow-right" size={15} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
    </dialog>
  );
}
