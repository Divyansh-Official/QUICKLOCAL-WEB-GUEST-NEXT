/**
 * Card ↔ page zoom, in the manner of the App Store's Today cards: the card
 * you tap opens out of its exact place into the page it leads to, and its 3D
 * tile flies to where the page shows it. Back runs it in reverse.
 *
 * Everything moves on the compositor or in paint, never in layout:
 *   · the panel is ONE fixed, full-viewport surface whose visible shape is a
 *     clip-path inset — from the card's rectangle and corners to the page's
 *     hero, and back;
 *   · the tile is a copy flown with transform (translate + scale) from the
 *     card's tile to the page's, and swapped for the real one when it lands.
 *
 * The navigation runs once the panel has opened (the page is prefetched, so it
 * is there at once), and the tile flies in one movement to where category
 * pages put it — remembered after the first open, so it lands exactly. It all sits BENEATH the header: the chrome is never covered.
 *
 * Reduced motion and ?nomotion fall straight through to an ordinary
 * navigation, and nothing here can block one: if the new page has not
 * arrived within 2.5s the panel simply fades and navigation finishes alone.
 */
import { prefersCalm } from '@/lib/hooks';

const GIVE_UP_MS = 2500;
const OPEN_MS = 500;
const FLY_MS = 520;
const CLOSE_MS = 520;
const FADE_MS = 260;
const SAFETY_MS = 6000;
const ENTRANCES_MS = 1800;
/* iOS's own sheet curve: quick away, long soft landing, no overshoot. */
const IOS = 'cubic-bezier(0.32, 0.72, 0, 1)';
const OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';
const HERO_MIN = 560;
const HERO_MAX = 820;
const HERO_VH = 0.88;

type Layer = { layer: HTMLDivElement; dim: HTMLDivElement; surface: HTMLDivElement; shade: HTMLDivElement; fly: HTMLElement | null };
type Pending = { mode: 'expand' | 'collapse'; from: string; restore?: boolean; resolve: () => void; timer: number };

const state: {
  pending: Pending | null;
  current: string | null;
  /** Every card opened in a row (Home → Grocery → Toys), so each Back goes one step. */
  opened: { detail: string; from: string }[];
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
  opened: [],
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

function animate(el: Element, keyframes: Keyframe[], options: KeyframeAnimationOptions) {
  return el.animate(keyframes, options);
}
const done = (a: Animation) => a.finished.then(() => undefined, () => undefined);

/* ---------- geometry ---------- */

type Box = { top: number; left: number; width: number; height: number };
const rectOf = (el: Element): Box => {
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
};

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

/** Where the page will put its hero, before it exists: the top of the viewport, full width. */
function heroRect(): Box {
  const width = document.documentElement.clientWidth;
  const height = Math.max(HERO_MIN, Math.min(smallViewportHeight() * HERO_VH, HERO_MAX));
  return { top: 0, left: 0, width, height };
}

/** A box as a clip-path on the full-viewport surface. */
function clip(r: Box, radius: string) {
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;
  const right = Math.max(0, vw - (r.left + r.width));
  const bottom = Math.max(0, vh - (r.top + r.height));
  return `inset(${Math.max(0, r.top)}px ${right}px ${bottom}px ${Math.max(0, r.left)}px round ${radius})`;
}

/** Transform that puts an element laid out at `to` exactly over `from`. */
function over(from: Box, to: Box) {
  const sx = from.width / to.width;
  const sy = from.height / to.height;
  const dx = from.left + from.width / 2 - (to.left + to.width / 2);
  const dy = from.top + from.height / 2 - (to.top + to.height / 2);
  return `translate3d(${dx}px, ${dy}px, 0) scale(${sx}, ${sy})`;
}

/** Transform that moves an element laid out at `from` onto `to`. */
function onto(from: Box, to: Box) {
  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  return `translate3d(${dx}px, ${dy}px, 0) scale(${to.width / from.width}, ${to.height / from.height})`;
}

/*
 * Where a category page puts its tile, so the tile can fly there in one
 * movement before the page exists. Every category page shares one layout,
 * so the first real measurement is remembered per viewport size and every
 * later flight lands exactly; the layout arithmetic below covers the first.
 */
const landed = new Map<string, Box>();
const sizeKey = () => `${document.documentElement.clientWidth}x${window.innerHeight}`;

function predictSlab(hero: Box): Box {
  const known = landed.get(sizeKey());
  if (known) return known;
  const vw = document.documentElement.clientWidth;
  if (vw < 1024) {
    const size = vw < 640 ? 210 : 300;
    return { top: 168, left: (vw - size) / 2, width: size, height: size };
  }
  const gutter = Math.min(48, Math.max(18, vw * 0.046));
  const shell = Math.min(vw, vw >= 1600 ? 1320 : 1240);
  const inner = shell - gutter * 2;
  const start = (vw - shell) / 2 + gutter;
  const centre = start + (inner - 40) * 0.6 + 40 + ((inner - 40) * 0.4) / 2;
  return { top: hero.height * 0.36, left: centre - 150, width: 300, height: 300 };
}

/* ---------- the layer ---------- */

function removeLayer() {
  state.layer?.layer.remove();
  state.layer = null;
}

function buildLayer(): Layer {
  removeLayer();
  const layer = document.createElement('div');
  layer.className = 'morph-layer';
  layer.setAttribute('aria-hidden', 'true');
  const dim = document.createElement('div');
  dim.className = 'morph-dim';
  const surface = document.createElement('div');
  surface.className = 'morph-surface';
  const shade = document.createElement('div');
  shade.className = 'morph-shade';
  surface.append(shade);
  layer.append(dim, surface);
  document.body.append(layer);
  /* Every scroll during a morph is a jump, never a glide: a smooth scroll
     still running after a measurement would leave the card behind. */
  root().style.scrollBehavior = 'auto';
  state.layer = { layer, dim, surface, shade, fly: null };
  state.startedAt = performance.now();
  window.clearTimeout(state.safetyTimer);
  state.safetyTimer = window.setTimeout(finish, SAFETY_MS);
  return state.layer;
}

/** A copy of an element, laid out at `r` in viewport coordinates. */
function pinned(el: HTMLElement, r: Box, className: string) {
  const copy = el.cloneNode(true) as HTMLElement;
  copy.removeAttribute('id');
  copy.removeAttribute('data-morph-key');
  copy.querySelectorAll('[id], [data-morph-key]').forEach(node => {
    node.removeAttribute('id');
    node.removeAttribute('data-morph-key');
  });
  copy.classList.add(className);
  Object.assign(copy.style, { top: `${r.top}px`, left: `${r.left}px`, width: `${r.width}px`, height: `${r.height}px` });
  return copy;
}

/**
 * The tile, as a free-flying copy laid out at `r`. It starts in the pose its
 * source shows and eases into the pose its destination shows while it flies
 * (the slab's own spring transition), so nothing turns at the hand-over.
 */
function flyer(slab: HTMLElement, r: Box, endActive: boolean) {
  const fly = pinned(slab, r, 'morph-fly');
  const startActive = slab.hasAttribute('data-active') || Boolean(slab.closest('.group')?.matches(':hover'));
  fly.toggleAttribute('data-active', startActive);
  if (startActive !== endActive) requestAnimationFrame(() => requestAnimationFrame(() => fly.toggleAttribute('data-active', endActive)));
  return fly;
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
  root().style.removeProperty('scroll-behavior');
  root().removeAttribute('data-morph');
  announce({ phase: 'end' });
}

/** The page's own tile: hidden while its copy flies in, and never replays its entrance. */
function pageSlab() {
  const holder = document.querySelector<HTMLElement>('[data-morph-target] [data-morph-slab]');
  const slab = holder?.querySelector<HTMLElement>('.slab-stage') ?? null;
  return { holder, slab };
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

  const card = rectOf(source);
  const radius = getComputedStyle(source).borderTopLeftRadius || '26px';
  const hero = heroRect();
  const parts = buildLayer();
  root().dataset.morph = 'expand';

  /* The card itself, inside the panel at its own place, its tile taken out to fly. */
  const copy = pinned(source, card, 'morph-copy');
  copy.querySelector<HTMLElement>('.slab-stage')?.style.setProperty('visibility', 'hidden');
  parts.surface.append(copy);
  parts.surface.style.clipPath = clip(card, radius);

  /* The tile, drawn at the size it lands at (so it is crisp when it gets there) and
     sent off from the card's tile by transform alone. */
  const cardSlab = source.querySelector<HTMLElement>('.slab-stage');
  const slabFrom = cardSlab ? rectOf(cardSlab) : null;
  const aim = predictSlab(hero);
  let flight: Animation | null = null;
  if (cardSlab && slabFrom) {
    const fly = flyer(cardSlab, aim, true);
    fly.style.setProperty('--s-d', `${aim.width}px`);
    fly.style.setProperty('--s-m', `${aim.width}px`);
    fly.style.transform = over(slabFrom, aim);
    parts.fly = fly;
    parts.layer.append(fly);
  }

  void (async () => {
    await frames(1);
    if (state.layer !== parts) return;

    const open = animate(parts.surface, [{ clipPath: clip(card, radius) }, { clipPath: clip(hero, '0px') }], { duration: OPEN_MS, easing: IOS, fill: 'forwards' });
    animate(copy, [{ opacity: 1 }, { opacity: 0 }], { duration: 140, easing: 'ease-out', fill: 'forwards' });
    animate(parts.shade, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: 'cubic-bezier(0.2, 0, 0, 1)', fill: 'forwards' });
    animate(parts.dim, [{ opacity: 0 }, { opacity: 0.25 }], { duration: OPEN_MS, easing: IOS, fill: 'forwards' });
    if (parts.fly && slabFrom) {
      flight = animate(parts.fly, [{ transform: over(slabFrom, aim) }, { transform: 'none' }], { duration: FLY_MS, easing: OUT, fill: 'forwards' });
    }
    window.setTimeout(() => announce({ phase: 'covered', tone: 'dark' }), OPEN_MS * 0.4);

    /* By 60% of the opening the panel already covers the hero (the curve is
       front-loaded): navigate under it then. The page is prefetched. */
    await sleep(OPEN_MS * 0.6);
    if (state.layer !== parts) return;
    const arrived = waitForRoute({ mode: 'expand', from });
    go();
    await Promise.all([arrived, sleep(OPEN_MS * 0.2)]);
    await frames(2);
    if (state.layer !== parts) return;

    const { holder, slab } = pageSlab();
    if (holder) holder.style.animation = 'none';
    if (slab) slab.style.visibility = 'hidden';

    /* The panel dissolves around the tile as the page's text rises in. The tile
       stays solid, finishes its flight, and lands exactly where the page put
       its own (remembered for next time) before handing over to it. */
    releaseEntrances();
    const reveal = Promise.all([
      done(open).then(() => done(animate(parts.surface, [{ opacity: 1 }, { opacity: 0 }], { duration: FADE_MS, easing: 'ease-out', fill: 'forwards' }))),
      done(animate(parts.dim, [{ opacity: 0.25 }, { opacity: 0 }], { duration: FADE_MS, easing: 'ease-out', fill: 'forwards' })),
    ]);
    const land = (async () => {
      if (flight) await done(flight);
      if (!slab || !parts.fly || !inViewport(slab) || state.layer !== parts) return;
      const real = rectOf(slab);
      landed.set(sizeKey(), real);
      const moved = Math.abs(real.left - aim.left) > 1 || Math.abs(real.top - aim.top) > 1 || Math.abs(real.width - aim.width) > 1;
      if (moved) await done(animate(parts.fly, [{ transform: 'none' }, { transform: onto(aim, real) }], { duration: 220, easing: OUT, fill: 'forwards' }));
    })();
    await Promise.all([reveal, land]);
    if (state.layer !== parts) return;
    if (slab) slab.style.visibility = '';
    if (state.layer === parts) finish();
  })();
}

/* ---------- page → card ---------- */

export function collapse({ router, fallbackHref }: { router: { back: () => void; push: (h: string) => void }; fallbackHref: string }) {
  const here = window.location.pathname;
  const top = state.opened[state.opened.length - 1];
  const back = Boolean(top && top.detail === here);
  const go = () => (back ? router.back() : router.push(fallbackHref));
  const target = document.querySelector('[data-morph-target]');
  if (busy()) return;
  if (!canAnimate() || !target) {
    go();
    return;
  }

  const hero = rectOf(target);
  const parts = buildLayer();
  parts.surface.style.clipPath = clip(hero, '0px');
  parts.shade.style.opacity = '1';
  root().dataset.morph = 'collapse';

  /* The page's tile lifts off into its own layer before anything changes underneath. */
  const { slab } = pageSlab();
  const slabFrom = slab && inViewport(slab) ? rectOf(slab) : null;
  if (slab && slabFrom) {
    parts.fly = flyer(slab, slabFrom, false);
    parts.layer.append(parts.fly);
  }

  void (async () => {
    /* The panel is the hero, pixel for pixel, so covering it is invisible. */
    animate(parts.dim, [{ opacity: 0 }, { opacity: 0.25 }], { duration: 120, easing: 'ease-out', fill: 'forwards' });
    await done(animate(parts.surface, [{ opacity: 0 }, { opacity: 1 }], { duration: 120, easing: 'ease-out', fill: 'forwards' }));
    if (state.layer !== parts) return;
    const arrived = waitForRoute({ mode: 'collapse', from: here, restore: back });
    go();
    await arrived;
    await frames(2);
    if (state.layer !== parts) return;

    announce({ phase: 'reveal' });
    const card = morphSurface(document.querySelector(`[data-morph-key="${CSS.escape(here)}"]`));

    if (!card || !inViewport(card)) {
      await Promise.all([
        done(animate(parts.surface, [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(0.96)' }], { duration: 360, easing: IOS, fill: 'forwards' })),
        parts.fly ? done(animate(parts.fly, [{ opacity: 1 }, { opacity: 0 }], { duration: 240, easing: 'ease-out', fill: 'forwards' })) : Promise.resolve(),
      ]);
      if (state.layer === parts) finish();
      return;
    }

    const to = rectOf(card);
    const radius = getComputedStyle(card).borderTopLeftRadius || '26px';
    const copy = pinned(card, to, 'morph-copy');
    copy.querySelector<HTMLElement>('.slab-stage')?.style.setProperty('visibility', 'hidden');
    copy.style.opacity = '0';
    parts.surface.insertBefore(copy, parts.shade);

    const cardSlab = card.querySelector<HTMLElement>('.slab-stage');
    let flight: Promise<void> = Promise.resolve();
    if (parts.fly && cardSlab && slabFrom) {
      const dest = rectOf(cardSlab);
      const fly = flyer(cardSlab, dest, false);
      fly.removeAttribute('data-active');
      parts.fly.replaceWith(fly);
      parts.fly = fly;
      cardSlab.style.visibility = 'hidden';
      flight = done(animate(fly, [{ transform: over(slabFrom, dest) }, { transform: 'none' }], { duration: CLOSE_MS + 60, easing: OUT, fill: 'forwards' }));
    }

    animate(parts.dim, [{ opacity: 0.25 }, { opacity: 0 }], { duration: CLOSE_MS, easing: IOS, fill: 'forwards' });
    await Promise.all([
      done(animate(parts.surface, [{ clipPath: clip(hero, '0px') }, { clipPath: clip(to, radius) }], { duration: CLOSE_MS, easing: IOS, fill: 'forwards' })),
      done(animate(parts.shade, [{ opacity: 1 }, { opacity: 0, offset: 0.45 }, { opacity: 0 }], { duration: CLOSE_MS, easing: 'ease-in-out', fill: 'forwards' })),
      done(animate(copy, [{ opacity: 0 }, { opacity: 0, offset: 0.25 }, { opacity: 1, offset: 0.7 }, { opacity: 1 }], { duration: CLOSE_MS, easing: 'ease-out', fill: 'forwards' })),
      flight,
    ]);
    if (cardSlab) cardSlab.style.visibility = '';
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
    /* Start the new page at its top, at once and under the panel — the page's
       smooth scrolling would otherwise slide it up while the panel lifts. */
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    state.opened.push({ detail: pathname, from: pending.from });
    state.arrivedAt = performance.now();
    state.released = false;
    window.clearTimeout(state.arrivalTimer);
    root().style.setProperty('--arrive', `${SAFETY_MS}ms`);
    root().dataset.morphArrived = '';
  } else {
    if (pending.restore && state.scroll.has(pathname)) {
      window.scrollTo({ top: state.scroll.get(pathname)!, behavior: 'instant' as ScrollBehavior });
    }
    /* A real step back pops one card; a jump to the fallback page ends the trail. */
    if (pending.restore) state.opened.pop();
    else state.opened.length = 0;
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
