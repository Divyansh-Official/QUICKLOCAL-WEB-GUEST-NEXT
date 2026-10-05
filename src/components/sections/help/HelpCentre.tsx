'use client';

/**
 * Every question the site answers, searchable and filterable by who is
 * asking. Typing narrows the list as you type and marks the words that
 * matched; a topic narrows it further. Items glide to their new places
 * (a View Transition — `filterTransition` in lib/morph) rather than jumping,
 * and the count is announced politely.
 *
 * The query lives in the address bar (?q=, &topic=), so a search can be
 * shared and survives a reload. Answers are native <details>, so they open
 * without JavaScript and Ctrl-F finds them.
 */
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import Icon from '@/components/ui/Icon';
import SegmentedControl from '@/components/ui/SegmentedControl';
import { fillLive } from '@/lib/format';
import { filterTransition } from '@/lib/morph';

type Item = { audience: string; q: string; a: string };
type Copy = { label: string; placeholder: string; results: string; resultsOne: string; emptyTitle: string; emptyText: string; clear: string; topics: string };

const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');

function highlight(text: string, terms: string[]): ReactNode {
  if (!terms.length) return text;
  const pattern = new RegExp(`(${terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  return text.split(pattern).map((part, i) => (i % 2 ? <mark key={i} className="hl">{part}</mark> : part));
}

export default function HelpCentre({ items, audiences, copy }: { items: Item[]; audiences: { key: string; label: string; icon: string }[]; copy: Copy }) {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('all');
  const input = useRef<HTMLInputElement>(null);

  /* Read ?q= and &topic= once, after hydration, so the server render and the first client render agree. */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    const t = params.get('topic');
    const frame = requestAnimationFrame(() => {
      if (q) setQuery(q);
      if (t && audiences.some(a => a.key === t)) setTopic(t);
    });
    return () => cancelAnimationFrame(frame);
  }, [audiences]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (query) params.set('q', query);
    else params.delete('q');
    if (topic !== 'all') params.set('topic', topic);
    else params.delete('topic');
    const search = params.toString();
    window.history.replaceState(window.history.state, '', `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`);
  }, [query, topic]);

  const terms = useMemo(() => norm(query).split(/\s+/).filter(t => t.length > 1), [query]);
  const visible = useMemo(
    () =>
      items
        .map((item, index) => ({ ...item, index }))
        .filter(item => topic === 'all' || item.audience === topic)
        .filter(item => {
          const hay = norm(`${item.q} ${item.a}`);
          return terms.every(t => hay.includes(t));
        }),
    [items, topic, terms],
  );

  const changeTopic = (value: string) => filterTransition(() => setTopic(value));
  const clear = () => {
    filterTransition(() => setQuery(''));
    input.current?.focus();
  };

  return (
    <div className="mx-auto max-w-[920px]">
      <div className="help-search glass glass-raised flex items-center gap-3 rounded-full py-2 pl-5 pr-2">
        <Icon name="search" size={20} strokeWidth={2} className="flex-none text-fg-3" />
        <label htmlFor="help-q" className="sr-only">
          {copy.label}
        </label>
        <input
          ref={input}
          id="help-q"
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={copy.placeholder}
          autoComplete="off"
          spellCheck={false}
          className="h-12 min-w-0 flex-1 bg-transparent text-[17px] font-semibold text-fg outline-none placeholder:font-medium placeholder:text-fg-3 [&::-webkit-search-cancel-button]:hidden"
        />
        {query ? (
          <button type="button" onClick={clear} className="icon-btn flex-none text-fg-2 hover:bg-[color-mix(in_oklab,var(--fg)_7%,transparent)]" aria-label={copy.clear}>
            <Icon name="close" size={16} strokeWidth={2.2} />
          </button>
        ) : null}
      </div>

      <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <SegmentedControl label={copy.topics} items={audiences.map(a => ({ value: a.key, label: a.label, icon: a.icon }))} value={topic} onChange={changeTopic} className="max-w-full" />
        <p className="tnum text-[13.5px] font-bold text-fg-3" aria-live="polite">
          {visible.length === 1 ? copy.resultsOne : fillLive(copy.results, { count: visible.length })}
        </p>
      </div>

      {visible.length ? (
        <div className="mt-8">
          {visible.map(item => (
            <details
              key={item.index}
              className="disclosure"
              data-vt
              style={{ ['--vt' as string]: `faq-${item.index}` }}
              open={terms.length > 0 && visible.length <= 3 ? true : undefined}>
              <summary>
                <span>{highlight(item.q, terms)}</span>
                <span className="disclosure-icon" aria-hidden="true">
                  <Icon name="plus" size={15} strokeWidth={2.2} />
                </span>
              </summary>
              <p className="t-body max-w-3xl pb-6 pr-10">{highlight(item.a, terms)}</p>
            </details>
          ))}
        </div>
      ) : (
        <div className="enter-scale mt-10 flex flex-col items-center rounded-[var(--radius-card)] px-6 py-14 text-center">
          <span className="icon-tile icon-tile-soft" style={{ ['--s' as string]: '56px' }}>
            <Icon name="search" size={24} strokeWidth={1.9} />
          </span>
          <p className="t-headline mt-5">{fillLive(copy.emptyTitle, { query })}</p>
          <p className="t-small mt-2">{copy.emptyText}</p>
          <button type="button" onClick={clear} className="btn btn-md btn-glass mt-6">
            <span>{copy.clear}</span>
          </button>
        </div>
      )}
    </div>
  );
}
