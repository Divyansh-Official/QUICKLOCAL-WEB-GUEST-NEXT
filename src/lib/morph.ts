/**
 * Card ↔ page zoom, in the manner of the App Store's Today cards: the card
 * you tap grows out of its exact place on the screen into the page it opens,
 * and the page's content rises in once it lands. Back runs it in reverse.
 *
 * It is a fixed overlay of a copy of the card, animated with Web Animations
 * BENEATH the header — the header, the tab bar and the rest of the chrome are
 * never captured, covered or redrawn.
 *
 * Smoothness comes from never asking the main thread for two things at once:
 *
 *   expand    the copy grows straight to the box the page's hero will occupy
 *             and holds still; only then does the navigation run, under it;
 *             once the new page has painted, the overlay dissolves (a
 *             compositor-only fade) as the page's text rises in.
 *   collapse  the hero darkens under an opaque layer, the previous page
 *             renders beneath it, then the layer shrinks back into the card.
 *
 * Reduced motion and ?nomotion fall straight through to an ordinary
 * navigation, and nothing here can block one: if the new page has not
 * arrived within 2.5s the overlay simply fades and navigation finishes alone.
 */
import { prefersCalm } from '@/lib/hooks';

const GIVE_UP_MS = 2500;
const GROW_MS = 620;
const SHRINK_MS = 560;
const DARKEN_MS = 170;
const REVEAL_MS = 440;
const HANDOFF_MS = 160;
const SAFETY_MS = 6000;
const ENTRANCES_MS = 1800;
const SOFT = 'cubic-bezier(0.4, 0, 0.2, 1)';
const HERO_MIN = 560;
const HERO_MAX = 820;
const HERO_VH = 0.88;

type Layer = { layer: HTMLDivElement; dim: HTMLDivElement; surface: HTMLDivElement; shade: HTMLDivElement; copy: HTMLElement | null };
type Pending = { mode: 'expand' | 'collapse'; from: string; restore?: boolean; resolve: () => void; timer: number };

const state: {
  pending: Pending | null;
  current: string | null;
  opened: { detail: string; from: string } | null;
  scroll: Map<string, number>;
  layer: Layer | null;
  startedAt: number;
  arrivedAt: number;
  released: boolean;
  arrivalTimer: number;
  safetyTimer: number;
} = {
  pending: null,
  current: null,
  opened: null,
  scroll: new Map(),
  layer: null,
  startedAt: 0,
  arrivedAt: 0,
  released: true,
  arrivalTimer: 0,
  safetyTimer: 0,
};

const root = () => document.documentElement;
const sleep = (ms: number) => new Promise<void>(resolve => window.setTimeout(resolve, ms));
const frames = (count = 2) =>
  new Promise<void>(resolve => {
    const step = (left: number) => (left ? requestAnimationFrame(() => step(left - 1)) : resolve());
    step(count);
  });
const idle = (timeout: number) =>
  new Promise<void>(resolve => {
    if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(() => resolve(), { timeout });
    else window.setTimeout(resolve, Math.min(timeout, 120));
  });

const busy = () => Boolean(state.layer) && performance.now() - state.startedAt < SAFETY_MS;

export function canAnimate() {
  return typeof document !== 'undefined' && typeof Element.prototype.animate === 'function' && !prefersCalm();
}

export function canMorph() {
  return canAnimate() && typeof document.startViewTransition === 'function';
}

export function morphSurface(card: Element | null): HTMLElement | null {
  return (card?.querySelector?.('[data-morph-source]') as HTMLElement) || (card as HTMLElement) || null;
}

export function isMorphing() {
  return typeof document !== 'undefined' && root().hasAttribute('data-morph');
}

function inViewport(el: Element | null) {
  if (!el) return false;
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth && r.width > 0;
}

/* ---------- geometry ---------- */

let easing: string | null = null;
const spring = () =>
  (easing ??= getComputedStyle(root()).getPropertyValue('--spring-snappy').trim() || 'cubic-bezier(0.32, 0.72, 0, 1)');

function animate(el: Element, keyframes: Keyframe[], options: KeyframeAnimationOptions) {
  try {
    return el.animate(keyframes, options);
  } catch {
    return el.animate(keyframes, { ...options, easing: 'cubic-bezier(0.32, 0.72, 0, 1)' });
  }
}

type Box = { top: number; left: number; width: number; height: number };
const box = (r: Box) => ({ top: `${r.top}px`, left: `${r.left}px`, width: `${r.width}px`, height: `${r.height}px` });
const near = (a: Box, b: Box) =>
  Math.abs(a.top - b.top) < 2 && Math.abs(a.left - b.left) < 2 && Math.abs(a.width - b.width) < 2 && Math.abs(a.height - b.height) < 2;

let probe: HTMLDivElement | null = null;
function smallViewportHeight() {
  if (!probe) {
    probe = document.createElement('div');
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText = 'position:fixed;top:0;left:0;width:0;height:100svh;visibility:hidden;pointer-events:none';
    document.body.append(probe);
  }
  return probe.offsetHeight || window.innerHeight;
}

/** Where the page at `href` will put its hero, before it exists. */
function heroRect(): Box {
  const width = document.documentElement.clientWidth;
  const height = Math.max(HERO_MIN, Math.min(smallViewportHeight() * HERO_VH, HERO_MAX));
  const top = document.getElementById('main')?.offsetTop || 0;
  return { top, left: 0, width, height };
}

/* ---------- the overlay ---------- */

function copyOf(el: HTMLElement, rect: Box) {
  const copy = el.cloneNode(true) as HTMLElement;
  copy.removeAttribute('id');
  copy.removeAttribute('data-morph-key');
  copy.querySelectorAll('[id], [data-morph-key]').forEach(node => {
    node.removeAttribute('id');
    node.removeAttribute('data-morph-key');
  });
  copy.classList.add('morph-copy');
  copy.style.width = `${rect.width}px`;
  copy.style.height = `${rect.height}px`;
  return copy;
}

function removeLayer() {
  state.layer?.layer.remove();
  state.layer = null;
}

function buildLayer(rect: Box, radius: string, copy: HTMLElement | null): Layer {
  removeLayer();
  const layer = document.createElement('div');
  layer.className = 'morph-layer';
  layer.setAttribute('aria-hidden', 'true');
  const dim = document.createElement('div');
  dim.className = 'morph-dim';
  const surface = document.createElement('div');
  surface.className = 'morph-surface';
  Object.assign(surface.style, box(rect), { borderRadius: radius });
  const shade = document.createElement('div');
  shade.className = 'morph-shade';
  surface.append(shade);
  if (copy) surface.append(copy);
  layer.append(dim, surface);
  document.body.append(layer);
  state.layer = { layer, dim, surface, shade, copy };
  state.startedAt = performance.now();
  window.clearTimeout(state.safetyTimer);
  state.safetyTimer = window.setTimeout(finish, SAFETY_MS);
  return state.layer;
}

function settle() {
  const pending = state.pending;
  if (!pending) return;
  state.pending = null;
  window.clearTimeout(pending.timer);
  pending.resolve();
}

function waitForRoute(entry: Omit<Pending, 'resolve' | 'timer'>) {
  return new Promise<void>(resolve => {
    state.pending = { ...entry, resolve, timer: window.setTimeout(settle, GIVE_UP_MS) };
  });
}

function announce(detail: Record<string, string>) {
  window.dispatchEvent(new CustomEvent('morphchange', { detail }));
}

function releaseEntrances(lead = 40) {
  if (state.released || !root().hasAttribute('data-morph-arrived')) return;
  state.released = true;
  const waited = Math.max(0, performance.now() - state.arrivedAt);
  root().style.setProperty('--arrive', `${Math.round(waited + lead)}ms`);
  window.clearTimeout(state.arrivalTimer);
  state.arrivalTimer = window.setTimeout(() => {
    root().removeAttribute('data-morph-arrived');
    root().style.removeProperty('--arrive');
  }, ENTRANCES_MS + lead);
}

function finish() {
  window.clearTimeout(state.safetyTimer);
  releaseEntrances(0);
  removeLayer();
  root().removeAttribute('data-morph');
  announce({ phase: 'end' });
}

/* ---------- card → page ---------- */

export function expand({ source, go }: { source: HTMLElement | null; href?: string; go: () => void }) {
  if (busy()) return;
  if (!canAnimate() || !source) {
    go();
    return;
  }
  const from = window.location.pathname;
  state.scroll.set(from, window.scrollY);

  const rect = source.getBoundingClientRect();
  const radius = getComputedStyle(source).borderTopLeftRadius || '26px';
  const hero = heroRect();
  const parts = buildLayer(rect, radius, copyOf(source, rect));
  root().dataset.morph = 'expand';

  void (async () => {
    await frames(1);
    if (state.layer !== parts) return;
    const grow = animate(parts.surface, [{ ...box(rect), borderRadius: radius }, { ...box(hero), borderRadius: '0px' }], {
      duration: GROW_MS,
      easing: spring(),
      fill: 'forwards',
    });
    if (parts.copy) animate(parts.copy, [{ opacity: 1 }, { opacity: 0 }], { duration: 260, easing: 'ease-out', fill: 'forwards' });
    animate(parts.shade, [{ opacity: 0 }, { opacity: 1 }], { duration: GROW_MS * 0.7, easing: SOFT, fill: 'forwards' });
    animate(parts.dim, [{ opacity: 0 }, { opacity: 0.45 }], { duration: GROW_MS, easing: SOFT, fill: 'forwards' });
    window.setTimeout(() => announce({ phase: 'covered', tone: 'dark' }), GROW_MS * 0.45);

    await grow.finished.catch(() => {});
    if (state.layer !== parts) return;

    const arrived = waitForRoute({ mode: 'expand', from });
    go();
    await arrived;
    await frames(2);
    if (state.layer !== parts) return;

    const target = document.querySelector('[data-morph-target]');
    if (target) {
      const to = target.getBoundingClientRect();
      if (!near(to, hero)) {
        await animate(parts.surface, [{ ...box(hero) }, { ...box(to) }], { duration: 260, easing: SOFT, fill: 'forwards' })
          .finished.catch(() => {});
      }
    }
    if (state.layer !== parts) return;

    releaseEntrances();
    await animate(parts.layer, [{ opacity: 1 }, { opacity: 0 }], { duration: REVEAL_MS, easing: SOFT, fill: 'forwards' })
      .finished.catch(() => {});
    if (state.layer === parts) finish();
  })();
}

/* ---------- page → card ---------- */

export function collapse({ router, fallbackHref }: { router: { back: () => void; push: (h: string) => void }; fallbackHref: string }) {
  const here = window.location.pathname;
  const back = Boolean(state.opened && state.opened.detail === here);
  const go = () => (back ? router.back() : router.push(fallbackHref));
  const target = document.querySelector('[data-morph-target]');
  if (busy()) return;
  if (!canAnimate() || !target) {
    go();
    return;
  }

  const rect = target.getBoundingClientRect();
  const parts = buildLayer(rect, '0px', null);
  parts.shade.style.opacity = '1';
  parts.surface.style.opacity = '0';
  root().dataset.morph = 'collapse';

  void (async () => {
    const cover = animate(parts.surface, [{ opacity: 0 }, { opacity: 1 }], { duration: DARKEN_MS, easing: 'ease-out', fill: 'forwards' });
    const dark = animate(parts.dim, [{ opacity: 0 }, { opacity: 1 }], { duration: DARKEN_MS, easing: 'ease-out', fill: 'forwards' });
    await Promise.all([cover.finished.catch(() => {}), dark.finished.catch(() => {})]);
    if (state.layer !== parts) return;
    const arrived = waitForRoute({ mode: 'collapse', from: here, restore: back });
    go();
    await arrived;
    await frames(2);
    await idle(160);
    if (state.layer !== parts) return;

    announce({ phase: 'reveal' });
    const card = morphSurface(document.querySelector(`[data-morph-key="${CSS.escape(here)}"]`));
    animate(parts.dim, [{ opacity: 1 }, { opacity: 0 }], { duration: SHRINK_MS, easing: SOFT, fill: 'forwards' });

    if (!card || !inViewport(card)) {
      await animate(parts.surface, [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(0.94)' }], {
        duration: REVEAL_MS,
        easing: SOFT,
        fill: 'forwards',
      }).finished.catch(() => {});
      if (state.layer === parts) finish();
      return;
    }

    const to = card.getBoundingClientRect();
    const radius = getComputedStyle(card).borderTopLeftRadius || '26px';
    const copy = copyOf(card, to);
    copy.style.opacity = '0';
    parts.surface.append(copy);

    await Promise.all(
      [
        animate(parts.surface, [{ ...box(rect), borderRadius: '0px' }, { ...box(to), borderRadius: radius }], {
          duration: SHRINK_MS,
          easing: spring(),
          fill: 'forwards',
        }),
        animate(parts.shade, [{ opacity: 1 }, { opacity: 0 }], { duration: SHRINK_MS * 0.6, easing: SOFT, fill: 'forwards' }),
        animate(copy, [{ opacity: 0 }, { opacity: 0, offset: 0.4 }, { opacity: 1 }], { duration: SHRINK_MS, easing: 'ease-in-out', fill: 'forwards' }),
      ].map(a => a.finished.catch(() => {})),
    );
    if (state.layer !== parts) return;
    await animate(parts.layer, [{ opacity: 1 }, { opacity: 0 }], { duration: HANDOFF_MS, easing: 'ease-out', fill: 'forwards' })
      .finished.catch(() => {});
    if (state.layer === parts) finish();
  })();
}

/** MorphProvider calls this in the commit that puts a new route on screen. */
export function routeCommitted(pathname: string) {
  if (pathname === state.current) return;
  state.current = pathname;
  const pending = state.pending;
  if (!pending) return;
  if (pending.mode === 'expand') {
    state.opened = { detail: pathname, from: pending.from };
    state.arrivedAt = performance.now();
    state.released = false;
    window.clearTimeout(state.arrivalTimer);
    root().style.setProperty('--arrive', `${SAFETY_MS}ms`);
    root().dataset.morphArrived = '';
  } else {
    if (pending.restore && state.scroll.has(pathname)) {
      window.scrollTo({ top: state.scroll.get(pathname)!, behavior: 'instant' as ScrollBehavior });
    }
    state.opened = null;
  }
  settle();
}

/** Re-flowing a filtered grid: items marked `data-vt` glide to their new places. */
export function filterTransition(update: () => void) {
  if (!canMorph()) {
    update();
    return;
  }
  root().dataset.filtering = '';
  const transition = document.startViewTransition(update);
  transition.finished.catch(() => {}).finally(() => root().removeAttribute('data-filtering'));
}

export { sleep };
