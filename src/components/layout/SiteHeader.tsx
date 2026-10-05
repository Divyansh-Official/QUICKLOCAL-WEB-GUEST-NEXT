'use client';

/**
 * The header: a floating capsule of liquid glass with the page scrolling
 * beneath it — which is what gives the refraction something to bend.
 *
 * It is sticky with a negative bottom margin (`.site-header`), so it takes no
 * room in the layout. It lives in the root layout, so it is the same element
 * on every page: it never moves, fades or re-renders between routes, and it
 * sits above the card zoom and the phone menu (whose button turns into a
 * close button in place).
 *
 * Its glass adapts to what is behind it: over a night section — the stats
 * band, a category opening, a card zooming open — it turns to dark glass with
 * light text. One hit-test per scrolled frame, written straight to a data
 * attribute: no state, so scrolling never re-renders it.
 */
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LiquidGlass from '@/components/glass/LiquidGlass';
import Button from '@/components/ui/Button';
import { ThemeButton } from '@/components/ui/ThemeToggle';
import Logo from './Logo';
import MobileMenu, { type MenuProps } from './MobileMenu';

type Labels = MenuProps['labels'] & { brand: string; ctaShort: string };

export default function SiteHeader({
  items,
  all,
  cta,
  contact,
  labels,
  showTheme,
}: {
  items: { label: string; href: string }[];
  all: { label: string; href: string }[];
  cta: { label: string; href: string; icon?: string };
  contact: MenuProps['contact'];
  labels: Labels;
  showTheme: boolean;
}) {
  const pathname = usePathname() || '/';
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const close = useCallback(() => setOpen(false), []);
  const isActive = useCallback(
    (href: string) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)),
    [pathname],
  );

  useEffect(() => {
    let frame = 0;
    const setTone = (tone: string) => {
      const el = headerRef.current;
      if (el && el.dataset.tone !== tone) el.dataset.tone = tone;
    };
    const probe = () => {
      frame = 0;
      const header = headerRef.current;
      const box = header?.firstElementChild?.getBoundingClientRect();
      if (!header || !box) return;
      const below = document
        .elementsFromPoint(window.innerWidth / 2, box.top + box.height / 2)
        .find(el => !header.contains(el));
      setTone(below?.closest('.tone-night') ? 'dark' : 'light');
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(probe);
    };
    const onMorph = (event: Event) => {
      const tone = (event as CustomEvent<{ tone?: string }>).detail?.tone;
      if (tone) setTone(tone);
      else schedule();
    };
    schedule();
    const settle = window.setTimeout(schedule, 320);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('morphchange', onMorph);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('morphchange', onMorph);
    };
  }, [pathname, open]);

  return (
    <>
      <header ref={headerRef} className="site-header" data-print="hide">
        <LiquidGlass
          radius={999}
          strength="soft"
          elevation="raised"
          className="mx-auto flex h-[54px] w-full max-w-[calc(var(--shell-max)-12px)] items-center gap-2 rounded-full pl-3 pr-1.5 md:h-[58px] md:pl-4 md:pr-2">
          <div className="mr-auto nav:mr-0">
            <Logo size={32} label={labels.brand} />
          </div>

          <nav aria-label={labels.primaryNav} className="hidden flex-1 justify-center nav:flex">
            <ul className="flex items-center gap-0.5">
              {items.map(item => (
                <li key={item.href}>
                  <Link href={item.href} className="nav-link" aria-current={isActive(item.href) ? 'page' : undefined}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-none items-center gap-1">
            {showTheme ? <ThemeButton labels={labels.theme} /> : null}
            <Button href={cta.href} size="sm" iconStart={cta.icon} className="hidden xs:inline-flex">
              <span className="sm:hidden">{labels.ctaShort}</span>
              <span className="hidden sm:inline">{cta.label}</span>
            </Button>
            <button
              ref={toggleRef}
              type="button"
              className="icon-btn text-fg hover:bg-[color-mix(in_oklab,var(--fg)_7%,transparent)] nav:hidden"
              onClick={() => setOpen(v => !v)}
              aria-label={open ? labels.closeMenu : labels.openMenu}
              aria-expanded={open}
              aria-controls={menuId}
              aria-haspopup="dialog">
              <span className="flex w-[18px] flex-col gap-[5px]" aria-hidden="true">
                <span className="menu-toggle-line h-[1.75px] rounded-full bg-current" />
                <span className="menu-toggle-line h-[1.75px] rounded-full bg-current" />
              </span>
            </button>
          </div>
        </LiquidGlass>
      </header>

      <MobileMenu
        id={menuId}
        open={open}
        onClose={close}
        toggleRef={toggleRef}
        items={all}
        cta={cta}
        contact={contact}
        labels={labels}
        isActive={isActive}
        pathname={pathname}
        showTheme={showTheme}
      />
    </>
  );
}
