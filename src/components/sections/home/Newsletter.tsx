'use client';

/**
 * The sign-up, honest about what it does. There is no mailing list behind
 * this site, so the address is kept on this device (the form remembers you
 * and does not ask twice) and the confirmation says plainly that nothing was
 * sent anywhere — offering the real mailbox to anyone who wants a person now.
 * When a list exists, `submit` becomes one POST and the wording changes.
 */
import { useState, useSyncExternalStore, type FormEvent } from 'react';
import Reveal from '@/components/motion/Reveal';
import AccentText from '@/components/ui/AccentText';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { fillLive } from '@/lib/format';

const LOOKS_LIKE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const KEY = 'ql.newsletter.email';
const listeners = new Set<() => void>();

function subscribe(fn: () => void) {
  listeners.add(fn);
  window.addEventListener('storage', fn);
  return () => {
    listeners.delete(fn);
    window.removeEventListener('storage', fn);
  };
}
function read(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}
function write(value: string | null) {
  try {
    if (value) localStorage.setItem(KEY, value);
    else localStorage.removeItem(KEY);
  } catch {
    /* not being able to remember is not a failure worth reporting */
  }
  listeners.forEach(fn => fn());
}

type Copy = { title: string; accent: string; text: string; placeholder: string; label: string; submit: string; sending: string; invalid: string; hint: string; doneTitle: string; doneText: string; reset: string };

export default function Newsletter({ copy, contactEmail }: { copy: Copy; contactEmail: string }) {
  const saved = useSyncExternalStore(subscribe, read, () => null);
  const [typed, setTyped] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    const value = typed.trim();
    if (!LOOKS_LIKE_EMAIL.test(value)) {
      setError(copy.invalid);
      return;
    }
    setError(null);
    setSending(true);
    window.setTimeout(() => {
      write(value);
      setSending(false);
    }, 550);
  }

  const [before, after] = fillLive(copy.doneText, { email: '\u0000', contactEmail: '\u0001' }).split('\u0000');
  const [middle, end] = (after ?? '').split('\u0001');

  return (
    <section className="tone-base section-tight pb-[var(--section-y)]">
      <div className="shell">
        <Reveal className="glass glass-raised grid items-center gap-8 overflow-hidden rounded-[var(--radius-panel)] p-6 sm:p-10 lg:grid-cols-[1fr_minmax(0,460px)] lg:gap-14">
          <div className="flex items-start gap-5">
            <span className="icon-tile hidden sm:grid" style={{ ['--s' as string]: '60px' }}>
              <Icon name="mail" size={28} strokeWidth={1.8} effect="draw" />
            </span>
            <div>
              <h2 className="t-title">
                <AccentText text={copy.title} accent={copy.accent} />
              </h2>
              <p className="t-small mt-3 max-w-md">{copy.text}</p>
            </div>
          </div>

          {saved ? (
            <div className="enter-scale rounded-[22px] bg-[color-mix(in_oklab,var(--ok)_10%,transparent)] p-5 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--ok)_28%,transparent)]">
              <p className="flex items-center gap-2.5 text-[16px] font-extrabold text-fg">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-ok text-white">
                  <Icon name="check" size={16} strokeWidth={3} />
                </span>
                {copy.doneTitle}
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-fg-2">
                {before}
                <strong className="break-all text-fg">{saved}</strong>
                {middle}
                <a href={`mailto:${contactEmail}`} className="font-bold text-primary-ink hover:underline">
                  {contactEmail}
                </a>
                {end}
              </p>
              <button
                type="button"
                onClick={() => {
                  write(null);
                  setTyped('');
                }}
                className="mt-3 text-[13px] font-bold text-fg-3 underline underline-offset-4 hover:text-fg">
                {copy.reset}
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <input
                  type="email"
                  value={typed}
                  onChange={e => {
                    setTyped(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder={copy.placeholder}
                  aria-label={copy.label}
                  aria-invalid={error ? true : undefined}
                  aria-describedby="newsletter-note"
                  disabled={sending}
                  autoComplete="email"
                  className={`h-[3.35rem] min-w-0 flex-1 rounded-full border-0 bg-card px-5 text-[16px] text-fg outline-none transition-shadow placeholder:text-fg-3 ${
                    error ? 'shadow-[inset_0_0_0_2px_var(--bad)]' : 'shadow-[inset_0_0_0_1px_var(--hair)] focus:shadow-[inset_0_0_0_2px_var(--primary)]'
                  }`}
                />
                <Button type="submit" size="lg" disabled={sending}>
                  {sending ? copy.sending : copy.submit}
                </Button>
              </div>
              <p id="newsletter-note" role={error ? 'alert' : undefined} className={`mt-2.5 px-2 text-[13px] ${error ? 'text-bad' : 'text-fg-3'}`}>
                {error ?? copy.hint}
              </p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
