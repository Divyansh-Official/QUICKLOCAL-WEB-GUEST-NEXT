'use client';

/**
 * Search, everywhere: ⌘K / Ctrl+K or / from any page, the magnifier in the
 * header, or the field at the top of the phone menu.
 *
 * A modal <dialog> (focus held inside, Escape closes, focus returns to what
 * opened it) holding a combobox: type, and pages, sections, aisles and Help
 * answers narrow as you go, with the matched words marked. ↑ ↓ move through
 * them, Enter opens one. The index is one static file fetched the first time
 * search opens, so no page carries it.
 */
import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Icon from '@/components/ui/Icon';
import type { SearchEntry, SearchKind } from '@/lib/search';

const EVENT = 'ql:search';

/** Opens the search sheet from anywhere on the page. */
export function openSearch() {
  window.dispatchEvent(new Event(EVENT));
}

type Copy = {
  label: string;
  placeholder: string;
  close: string;
  cancel: string;
  popular: string;
  suggestions: string[];
  groups: Record<SearchKind, string>;
  results: string;
  resultsOne: string;
  emptyTitle: string;
  emptyText: string;
  emptyCta: string;
  hintMove: string;
  hintOpen: string;
  hintClose: string;
  loading: string;
  error: string;
};

const ORDER: SearchKind[] = ['page', 'category', 'section', 'faq'];
const LIMIT: Record<SearchKind, number> = { page: 5, category: 6, section: 4, faq: 6 };

const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

let cache: Promise<SearchEntry[]> | null = null;
function loadIndex() {
  cache ??= fetch('/search-index.json')
    .then(r => {
      if (!r.ok) throw new Error(String(r.status));
      return r.json() as Promise<SearchEntry[]>;
    })
    .catch(err => {
      cache = null;
      throw err;
    });
  return cache;
}

function score(entry: SearchEntry, terms: string[]): number {
  const title = norm(entry.title);
  const keys = norm(entry.keywords ?? '');
  const text = norm(entry.text);
  let total = 0;
  for (const t of terms) {
    let s = 0;
    if (title.startsWith(t)) s = 8;
    else if (new RegExp(`\\b${escape(t)}`).test(title)) s = 6;
    else if (title.includes(t)) s = 4;
    else if (new RegExp(`\\b${escape(t)}`).test(keys)) s = 3;
    else if (text.includes(t)) s = 1;
    else return 0;
    total += s;
  }
  return total + (entry.kind === 'page' || entry.kind === 'category' ? 1 : 0);
}

function mark(text: string, terms: string[]): ReactNode {
  if (!terms.length) return text;
  const pattern = new RegExp(`(${terms.map(escape).join('|')})`, 'gi');
  return text.split(pattern).map((part, i) => (i % 2 ? <mark key={i} className="hl">{part}</mark> : part));
}

/** The answer text around the first word that matched, so the snippet shows why it came up. */
function snippet(text: string, terms: string[]) {
  if (!terms.length || text.length < 120) return text;
  const at = norm(text).indexOf(terms[0]);
  if (at < 60) return text;
  const start = text.lastIndexOf(' ', at - 40);
  return `…${text.slice(start + 1)}`;
}

export default function SearchDialog({ copy, quickLinks }: { copy: Copy; quickLinks: { label: string; href: string; icon: string }[] }) {
  const ref = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [active, setActive] = useState(0);

  const show = useCallback(() => {
    opener.current = document.activeElement as HTMLElement | null;
    setOpen(true);
    setFailed(false);
    loadIndex().then(setIndex, () => setFailed(true));
  }, []);

  const hide = useCallback(() => setOpen(false), []);

  /* Triggers: the custom event, ⌘K / Ctrl+K, and / outside a text field. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && (e.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName));
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (ref.current?.open) hide();
        else show();
      } else if (e.key === '/' && !typing && !ref.current?.open) {
        e.preventDefault();
        show();
      }
    };
    window.addEventListener(EVENT, show);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener(EVENT, show);
      window.removeEventListener('keydown', onKey);
    };
  }, [show, hide]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.removeAttribute('inert');
      dialog.showModal();
      /* The last search stays, selected — typing replaces it, Enter reopens it. */
      requestAnimationFrame(() => input.current?.select());
    } else if (!open && dialog.open) {
      dialog.close();
      opener.current?.focus?.({ preventScroll: true });
    }
  }, [open]);

  /* A route change (a result was opened) closes it. */
  useEffect(() => {
    const frame = requestAnimationFrame(() => setOpen(false));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  const terms = useMemo(() => norm(query).trim().split(/\s+/).filter(Boolean), [query]);

  const groups = useMemo(() => {
    if (!index || !terms.length) return [];
    const scored = index.map(entry => ({ entry, s: score(entry, terms) })).filter(x => x.s > 0);
    return ORDER.map(kind => ({
      kind,
      items: scored
        .filter(x => x.entry.kind === kind)
        .sort((a, b) => b.s - a.s)
        .slice(0, LIMIT[kind])
        .map(x => x.entry),
    }))
      .filter(g => g.items.length)
      .sort((a, b) => score(b.items[0], terms) - score(a.items[0], terms) || ORDER.indexOf(a.kind) - ORDER.indexOf(b.kind))
      .map((g, n, all) => ({ ...g, start: all.slice(0, n).reduce((sum, x) => sum + x.items.length, 0) }));
  }, [index, terms]);

  const flat = useMemo(() => groups.flatMap(g => g.items), [groups]);
  const count = flat.length;
  const optionId = (i: number) => `${listId}-o${i}`;

  const choose = useCallback(
    (entry: SearchEntry) => {
      const [path] = entry.href.split(/[?#]/);
      setOpen(false);
      /* Same page with a new query (Help): the page reads its query on load, so load it. */
      if (path === pathname && entry.href.includes('?')) window.location.assign(entry.href);
      else router.push(entry.href);
    },
    [pathname, router],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    /* A search field eats the first Escape to clear itself; here it closes. */
    if (e.key === 'Escape') {
      e.preventDefault();
      hide();
      return;
    }
    if (!count) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const next = (active + (e.key === 'ArrowDown' ? 1 : -1) + count) % count;
      setActive(next);
      document.getElementById(optionId(next))?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const entry = flat[active];
      if (entry) choose(entry);
    }
  };

  const status = !terms.length ? '' : count === 1 ? copy.resultsOne : copy.results.replace('{n}', String(count));

  return (
    <dialog
      ref={ref}
      className="search-sheet"
      aria-label={copy.label}
      onCancel={e => {
        e.preventDefault();
        hide();
      }}
      onClick={e => e.target === ref.current && hide()}>
      <div className="search-panel">
        <div className="flex items-center gap-3 border-b border-hair px-4 sm:px-5">
          <Icon name="search" size={20} strokeWidth={2} className="flex-none text-fg-3" />
          <input
            ref={input}
            type="search"
            role="combobox"
            aria-expanded={count > 0}
            aria-controls={listId}
            aria-activedescendant={count ? optionId(active) : undefined}
            aria-autocomplete="list"
            aria-label={copy.label}
            placeholder={copy.placeholder}
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setActive(0);
              list.current?.scrollTo({ top: 0 });
            }}
            onKeyDown={onKeyDown}
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="go"
            className="h-14 min-w-0 flex-1 bg-transparent text-[16.5px] font-semibold text-fg outline-none placeholder:font-medium placeholder:text-fg-3 sm:h-16 sm:text-[18px] [&::-webkit-search-cancel-button]:hidden"
          />
          {query ? (
            <button type="button" onClick={() => { setQuery(''); input.current?.focus(); }} className="grid h-7 w-7 flex-none place-items-center rounded-full bg-[color-mix(in_oklab,var(--fg)_8%,transparent)] text-fg-2" aria-label={copy.close}>
              <Icon name="close" size={13} strokeWidth={2.4} />
            </button>
          ) : null}
          <button type="button" onClick={hide} className="flex-none rounded-lg px-2 py-1 text-[13px] font-bold text-primary-ink sm:hidden">
            {copy.cancel}
          </button>
          <span className="max-sm:hidden">
            <kbd className="kbd">esc</kbd>
          </span>
        </div>

        <div ref={list} className="search-results no-scrollbar">
          <p className="sr-only" role="status" aria-live="polite">
            {status}
          </p>

          {!terms.length ? (
            <div className="p-4 sm:p-5">
              <p className="search-heading">{copy.popular}</p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {copy.suggestions.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setQuery(s);
                      setActive(0);
                      input.current?.focus();
                    }}
                    className="chip min-h-9 px-3.5 text-[13.5px] font-bold hover:bg-[color-mix(in_oklab,var(--fg)_10%,transparent)]">
                    {s}
                  </button>
                ))}
              </div>
              <ul className="mt-5 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                {quickLinks.map(l => (
                  <li key={l.href}>
                    <Link href={l.href} onClick={hide} className="search-quick">
                      <span className="grid h-8 w-8 flex-none place-items-center rounded-[10px] bg-primary-soft text-primary-ink">
                        <Icon name={l.icon} size={16} strokeWidth={1.9} />
                      </span>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : failed ? (
            <p className="px-5 py-10 text-center text-[14.5px] text-fg-2">{copy.error}</p>
          ) : !index ? (
            <p className="px-5 py-10 text-center text-[14.5px] text-fg-3">{copy.loading}</p>
          ) : !count ? (
            <div className="px-5 py-10 text-center">
              <p className="text-[16px] font-extrabold text-fg">{copy.emptyTitle.replace('{q}', query.trim())}</p>
              <p className="mt-1.5 text-[14px] text-fg-2">{copy.emptyText}</p>
              <Link href="/contact" onClick={hide} className="mt-4 inline-flex items-center gap-1 text-[14px] font-bold text-primary-ink">
                {copy.emptyCta}
                <Icon name="arrow-right" size={15} strokeWidth={2} />
              </Link>
            </div>
          ) : (
            <div id={listId} role="listbox" aria-label={copy.label} className="p-2 sm:p-2.5">
              {groups.map(group => (
                <div key={group.kind} role="group" aria-label={copy.groups[group.kind]} className="pb-1.5">
                  <p className="search-heading px-3 pb-1 pt-2.5">{copy.groups[group.kind]}</p>
                  {group.items.map((entry, k) => {
                    const n = group.start + k;
                    const on = n === active;
                    return (
                      <Link
                        key={entry.kind + entry.href}
                        id={optionId(n)}
                        href={entry.href}
                        role="option"
                        aria-selected={on}
                        tabIndex={-1}
                        onMouseMove={() => n !== active && setActive(n)}
                        onClick={e => {
                          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                          e.preventDefault();
                          choose(entry);
                        }}
                        className="search-row"
                        data-active={on || undefined}>
                        <span className="search-row-icon">
                          <Icon name={entry.icon} size={17} strokeWidth={1.9} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[14.5px] font-bold leading-snug tracking-[-0.015em] text-fg">{mark(entry.title, terms)}</span>
                          <span className={`mt-0.5 text-[12.5px] leading-snug text-fg-2 ${entry.kind === 'faq' ? 'line-clamp-2' : 'block truncate'}`}>
                            {mark(entry.kind === 'faq' ? snippet(entry.text, terms) : entry.text, terms)}
                          </span>
                        </span>
                        <Icon name={entry.href.includes('#') ? 'arrow-right' : 'chevron-right'} size={16} strokeWidth={2} className="search-row-go flex-none text-fg-3" />
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 border-t border-hair px-5 py-2.5 text-[12px] text-fg-3 max-sm:hidden">
          <span className="flex items-center gap-1.5">
            <kbd className="kbd">↑</kbd>
            <kbd className="kbd">↓</kbd>
            {copy.hintMove}
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="kbd">↵</kbd>
            {copy.hintOpen}
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="kbd">esc</kbd>
            {copy.hintClose}
          </span>
          <span className="ml-auto tnum">{status}</span>
        </div>
      </div>
    </dialog>
  );
}
