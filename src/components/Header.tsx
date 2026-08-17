/**
 * The site header.
 *
 * ── IT CHANGES WHEN THE PAGE SCROLLS ────────────────────────────────────────
 * Transparent over the hero's colour wash, then solid with a hairline once the
 * page moves. A permanently solid bar would cut the hero in half; a permanently
 * transparent one becomes unreadable the moment a white card slides under it.
 *
 * ── THE MOBILE MENU IS A SHEET, NOT A DROPDOWN ──────────────────────────────
 * Six links and two buttons do not fit in a dropdown on a 375px screen without
 * scrolling inside it. The sheet takes the screen, locks the page behind it,
 * and closes on Escape, on a link, and on the backdrop.
 *
 * ── THE CURRENT PAGE IS MARKED ──────────────────────────────────────────────
 * With aria-current, not only an underline, so it is announced and not merely
 * drawn.
 *
 * ── THE SHEET IS A SIBLING OF THE BAR, NOT A CHILD ──────────────────────────
 * It has to be. The bar gains `backdrop-blur` once the page scrolls, and
 * backdrop-filter makes an element a CONTAINING BLOCK for its position:fixed
 * descendants. Nested inside, the sheet stopped resolving against the viewport
 * and started resolving against a 72px-tall bar — collapsing to zero height the
 * moment you scrolled. The button still opened it and still locked body scroll,
 * so the page froze with no visible menu and no way to dismiss it.
 *
 * The same trap waits for anything else fixed that gets nested in here later.
 */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from './Icon';
import { Logo } from './Logo';
import { Button, Container } from './ui';
import { nav } from '@/lib/data';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // passive: this fires on every scroll frame and must never be able to
    // block it.
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    // The page behind a full-screen sheet must not scroll under it.
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  /**
   * Closing on navigation is done HERE, on the tap, rather than in an effect
   * watching the pathname. The click already knows the sheet should shut; an
   * effect would be React discovering it a render later, which is both a
   * cascading render and one frame of the old page under an open menu.
   */
  const close = () => setOpen(false);

  const isCurrent = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
    <header
      style={{ height: 'var(--header-h)' }}
      className={`fixed inset-x-0 top-0 z-50 flex items-center transition-all duration-300 ${
        scrolled
          ? 'border-b border-[var(--line)] bg-[rgba(253,250,246,.86)] backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}>
      <Container className="flex items-center justify-between gap-4">
        <Link href="/" aria-label="QuickLocal — home">
          <Logo size={34} priority />
        </Link>

        {/* ≥lg: the full bar. Below that everything folds into the sheet. */}
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {nav.map(item => {
            const current = isCurrent(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? 'page' : undefined}
                className={`relative rounded-lg px-3 py-2 text-[13.5px] font-semibold transition-colors ${
                  current
                    ? 'text-[var(--color-tangerine-600)]'
                    : 'text-[var(--color-ink-700)] hover:text-[var(--color-tangerine-600)]'
                }`}>
                {item.label}
                {/* The underline grows from the centre on hover, and is simply
                    present on the current page. */}
                <span
                  className={`absolute inset-x-3 -bottom-0.5 h-[2px] origin-center rounded-full bg-[var(--color-tangerine-500)] transition-transform duration-300 ${
                    current ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2.5 lg:flex">
          <Button href="/get-the-app" variant="outline" size="sm">
            Become a Partner
          </Button>
          <Button href="/contact" variant="primary" size="sm">
            Login / Sign Up
          </Button>
        </div>

        <button
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--color-ink-700)] transition hover:bg-[var(--color-cream-100)] lg:hidden">
          <Icon name={open ? 'close' : 'menu'} size={19} />
        </button>
      </Container>
    </header>

      {/* ── mobile sheet ──────────────────────────────────────────────────── */}
      {/* Outside <header> on purpose — see the note at the top of this file.

          overflow-hidden is load-bearing too.
          The sheet is translated up by its own height when closed, which puts
          its bottom edge exactly on this wrapper's top edge — and with nothing
          clipping it, that edge (the last button in the menu) was left painted
          across the header on every mobile page load. */}
      <div
        className={`fixed inset-0 top-[var(--header-h)] z-40 overflow-hidden lg:hidden ${
          open ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        aria-hidden={!open}>
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-[rgba(26,23,19,.4)] transition-opacity duration-300 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <nav
          aria-label="Main"
          className={`absolute inset-x-0 top-0 max-h-[calc(100vh-var(--header-h))] overflow-y-auto border-b border-[var(--line)] bg-[var(--bg)] px-5 pb-6 pt-3 transition-transform duration-300 ${
            open ? 'translate-y-0' : '-translate-y-full'
          }`}>
          <ul className="space-y-1">
            {nav.map(item => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={close}
                  aria-current={isCurrent(item.href) ? 'page' : undefined}
                  className={`flex items-center justify-between rounded-xl px-3 py-3 text-[15px] font-semibold transition ${
                    isCurrent(item.href)
                      ? 'bg-[var(--color-tangerine-100)] text-[var(--color-tangerine-700)]'
                      : 'text-[var(--color-ink-700)] hover:bg-[var(--color-cream-100)]'
                  }`}>
                  {item.label}
                  <Icon name="chevron-right" size={16} className="opacity-40" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid gap-2.5" onClick={close}>
            <Button href="/get-the-app" variant="outline" size="md" className="w-full">
              Become a Partner
            </Button>
            <Button href="/contact" variant="primary" size="md" className="w-full">
              Login / Sign Up
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
}
