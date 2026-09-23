/**
 * Liquid glass, the same material the admin console uses.
 *
 * ── THE ONE RULE THAT DECIDES WHETHER ANY OF THIS IS VISIBLE ────────────────
 * Refraction bends a backdrop. Bending a FLAT backdrop returns the same flat
 * backdrop — the maths runs, the map is correct, and the screen shows nothing.
 * So every glass surface on this site is placed over the patterned field that
 * `Backdrop` paints, never over plain cream. Put one of these on a solid fill
 * and all you have bought is an expensive border.
 *
 * ── WHY THE OPTICS ARE CONSTANTS HERE ───────────────────────────────────────
 * The console reads them from a per-user Appearance store because an operator
 * stares at that screen all day and should be able to turn it down. A visitor
 * sees this site for ninety seconds and has no settings, so the values are
 * fixed at what that store ships as its default — the same glass, minus a
 * preferences system nobody would find.
 *
 * ── COST ────────────────────────────────────────────────────────────────────
 * Each refracting surface is its own GPU pass, redone whenever anything behind
 * it moves. Maps are cached by size (snapped to an 8 x 4 px grid, where the
 * stretch is invisible) and shared by every surface of that size, and new ones
 * are built a few per frame so a long page never hitches. Anything below the
 * fold is `lazy` and only refracts once it is on screen.
 *
 * Only Chromium resolves an SVG filter inside backdrop-filter. Everywhere else
 * this degrades to tint, blur and rim — which still reads as glass, just
 * without the bend.
 */
'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import {
  generateDisplacementMap,
  nextFilterId,
  supportsBackdropRefraction,
  type DisplacementMap,
  type SurfaceProfile,
} from '@/lib/liquidGlass';
import { Spring } from '@/lib/liquidMotion';
import { GlassFilter } from './GlassFilter';

/** The console's shipped defaults, copied rather than re-picked by eye. */
const OPTICS = {
  depth: 18,
  thickness: 30,
  ior: 1.5,
  softness: 0.35,
  specular: 0.4,
  profile: 'squircle' as SurfaceProfile,
  dispersion: 0.4,
  lensing: 0.35,
  response: 0.32,
  damping: 0.72,
};

type Optics = {
  radius: number;
  depth: number;
  thickness: number;
  ior: number;
  softness: number;
  specular: number;
  profile: SurfaceProfile;
};

type Job = { key: string; w: number; h: number; optics: Optics };

const MAX_CACHED = 120;
/** Per-frame budget for building maps, so scrolling never stalls on one. */
const FRAME_BUDGET_MS = 7;

const cache = new Map<string, DisplacementMap>();
const waiting = new Map<string, Set<(m: DisplacementMap) => void>>();
const queue: Job[] = [];
let scheduled = false;

function remember(key: string, map: DisplacementMap) {
  cache.set(key, map);
  // Oldest out first — Map keeps insertion order.
  while (cache.size > MAX_CACHED) {
    const oldest = cache.keys().next().value;
    if (oldest === undefined) break;
    cache.delete(oldest);
  }
}

function deliver(key: string, map: DisplacementMap) {
  const subs = waiting.get(key);
  waiting.delete(key);
  subs?.forEach(fn => fn(map));
}

function pump() {
  scheduled = false;
  const start = performance.now();
  while (queue.length && performance.now() - start < FRAME_BUDGET_MS) {
    const job = queue.shift()!;
    if (!waiting.has(job.key)) continue; // everyone who asked has gone
    const hit = cache.get(job.key);
    if (hit) {
      deliver(job.key, hit);
      continue;
    }
    const map = generateDisplacementMap({
      width: job.w,
      height: job.h,
      ...job.optics,
      specularAngle: -90,
      superSample: 1,
    });
    remember(job.key, map);
    // Decoded before it is handed out, or the first frame paints with an
    // unresolved feImage and the surface flickers flat.
    const img = new Image();
    img.src = map.url;
    img.decode().then(() => deliver(job.key, map), () => deliver(job.key, map));
  }
  if (queue.length) schedule();
}

function schedule() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(pump);
}

function requestMap(
  key: string,
  w: number,
  h: number,
  optics: Optics,
  cb: (m: DisplacementMap) => void,
) {
  const hit = cache.get(key);
  if (hit) {
    // Asynchronously even on a hit, so a caller's effect never sets state in
    // the same tick it runs.
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) cb(hit);
    });
    return () => {
      cancelled = true;
    };
  }
  let subs = waiting.get(key);
  if (!subs) {
    subs = new Set();
    waiting.set(key, subs);
    queue.push({ key, w, h, optics });
    schedule();
  }
  subs.add(cb);
  return () => {
    const s = waiting.get(key);
    s?.delete(cb);
    if (s && s.size === 0) waiting.delete(key);
  };
}

const RIMS = [
  // Light entering the top face, and the fainter one off the back face —
  // glass has two bright edges, and leaving out the second is the usual tell.
  'inset 0 1px 0 rgba(255,255,255,0.55)',
  'inset 0 -1px 0 rgba(255,255,255,0.18)',
  'inset 0 0 0 0.5px rgba(255,255,255,0.32)',
];

const ELEVATION = {
  flat: RIMS.join(', '),
  raised: [...RIMS, '0 1px 2px rgba(26,23,19,0.10)', '0 4px 14px rgba(26,23,19,0.08)'].join(', '),
  float: [...RIMS, '0 2px 6px rgba(26,23,19,0.10)', '0 22px 50px rgba(26,23,19,0.16)'].join(', '),
} as const;

type Tag = 'div' | 'header' | 'footer' | 'aside' | 'section' | 'span' | 'article' | 'li';

export type GlassPaneProps = Omit<React.HTMLAttributes<HTMLElement>, 'style'> & {
  as?: Tag;
  /** Corner radius in px — drawn by CSS and traced into the map. */
  radius?: number;
  /** The glass's own colour at the opacity it should show. */
  tint?: string;
  /** Blur inside the glass after the bend. More keeps text legible over busy fields. */
  blur?: number;
  saturation?: number;
  /**
   * 'soft' keeps the bend in a shallow rim — right for small cards with text
   * on them. 'full' uses the optics as tuned, for large panes.
   */
  strength?: 'soft' | 'full';
  elevation?: keyof typeof ELEVATION;
  /** Refract only once on screen. Default on: most of this page is below the fold. */
  lazy?: boolean;
  /** Lens harder under the pointer and when pressed, on a spring. */
  interactive?: boolean;
  style?: CSSProperties;
  children?: ReactNode;
};

export function GlassPane({
  as = 'div',
  radius = 22,
  tint = 'rgba(255,255,255,0.55)',
  blur = 2,
  saturation = 1.3,
  strength = 'soft',
  elevation = 'raised',
  lazy = true,
  interactive = false,
  className = '',
  style,
  children,
  onPointerEnter,
  onPointerLeave,
  onPointerDown,
  onPointerUp,
  onPointerCancel,
  ...rest
}: GlassPaneProps) {
  const refracts = useMemo(() => supportsBackdropRefraction(), []);
  const hostRef = useRef<HTMLElement | null>(null);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  const [visible, setVisible] = useState(!lazy);
  const [map, setMap] = useState<{ key: string; map: DisplacementMap } | null>(null);
  const [filterId] = useState(() => nextFilterId('guest-glass'));

  // Size, as it changes — a marketing page reflows on every breakpoint.
  useEffect(() => {
    const el = hostRef.current;
    if (!el || !refracts) return;
    const measure = () => {
      const w = Math.max(1, Math.round(el.offsetWidth));
      const h = Math.max(1, Math.round(el.offsetHeight));
      setBox(prev => (prev && prev.w === w && prev.h === h ? prev : { w, h }));
    };
    let frame = requestAnimationFrame(measure);
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    });
    ro.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [refracts]);

  useEffect(() => {
    const el = hostRef.current;
    if (!lazy || !el || !refracts) return;
    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) setVisible(e.isIntersecting);
      },
      { rootMargin: '200px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [lazy, refracts]);

  const optics: Optics | null = box
    ? {
        radius: Math.min(radius, box.h / 2, box.w / 2),
        depth: strength === 'soft' ? Math.min(OPTICS.depth, 12) : OPTICS.depth,
        thickness: strength === 'soft' ? Math.min(OPTICS.thickness, 22) : OPTICS.thickness,
        ior: OPTICS.ior,
        softness: strength === 'soft' ? Math.max(OPTICS.softness, 0.3) : OPTICS.softness,
        specular: OPTICS.specular,
        profile: OPTICS.profile,
      }
    : null;
  const qw = box ? Math.max(8, Math.ceil(box.w / 8) * 8) : 0;
  const qh = box ? Math.max(4, Math.ceil(box.h / 4) * 4) : 0;
  const key = optics
    ? `${qw}x${qh}|${optics.radius.toFixed(1)}|${optics.depth}|${optics.thickness}|${optics.softness}|${optics.profile}`
    : '';

  useEffect(() => {
    if (!refracts || !visible || !optics || !key) return;
    return requestMap(key, qw, qh, optics, m => setMap({ key, map: m }));
    // optics is derived from key; listing key is listing optics.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refracts, visible, key]);

  const live = refracts && visible && box && map && map.key === key ? map.map : null;

  // ── flex ──────────────────────────────────────────────────────────────────
  const lens = useRef<Spring | null>(null);
  const lensFrame = useRef(0);
  const hovering = useRef(false);
  useEffect(() => () => cancelAnimationFrame(lensFrame.current), []);

  function flex(target: number) {
    if (!interactive || !live) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const spring = lens.current ?? (lens.current = new Spring(OPTICS.response, OPTICS.damping, 1));
    spring.target = target;
    if (lensFrame.current) return;
    const base = live.scale;
    const taps = [1 - OPTICS.dispersion * 0.12, 1, 1 + OPTICS.dispersion * 0.12];
    let last = performance.now();
    const tick = (now: number) => {
      const k = spring.step((now - last) / 1000);
      last = now;
      const nodes = document.getElementById(filterId)?.querySelectorAll('feDisplacementMap');
      nodes?.forEach((node, i) => node.setAttribute('scale', String(base * k * (taps[i] ?? 1))));
      if (spring.settled(0.002)) {
        spring.snap(spring.target);
        nodes?.forEach((node, i) =>
          node.setAttribute('scale', String(base * spring.target * (taps[i] ?? 1))),
        );
        lensFrame.current = 0;
        return;
      }
      lensFrame.current = requestAnimationFrame(tick);
    };
    lensFrame.current = requestAnimationFrame(tick);
  }

  const lensing = 1 + OPTICS.lensing;
  const Tag = as as 'div';

  return (
    <Tag
      {...(rest as React.HTMLAttributes<HTMLDivElement>)}
      onPointerEnter={e => {
        hovering.current = true;
        flex(1 + (lensing - 1) * 0.6);
        onPointerEnter?.(e);
      }}
      onPointerLeave={e => {
        hovering.current = false;
        flex(1);
        onPointerLeave?.(e);
      }}
      onPointerDown={e => {
        flex(lensing * 1.25);
        onPointerDown?.(e);
      }}
      onPointerUp={e => {
        flex(hovering.current ? 1 + (lensing - 1) * 0.6 : 1);
        onPointerUp?.(e);
      }}
      onPointerCancel={e => {
        flex(1);
        onPointerCancel?.(e);
      }}
      ref={hostRef as React.Ref<HTMLDivElement>}
      className={className}
      style={{
        borderRadius: radius,
        background: tint,
        ...(live
          ? { backdropFilter: `url(#${filterId})`, WebkitBackdropFilter: `url(#${filterId})` }
          : {
              backdropFilter: `blur(${Math.max(10, blur * 5)}px) saturate(1.45) brightness(1.04)`,
              WebkitBackdropFilter: `blur(${Math.max(10, blur * 5)}px) saturate(1.45) brightness(1.04)`,
            }),
        boxShadow: ELEVATION[elevation],
        ...style,
      }}>
      {live && box ? (
        <GlassFilter
          id={filterId}
          map={live}
          width={box.w}
          height={box.h}
          dispersion={OPTICS.dispersion}
          blur={blur}
          saturation={saturation}
        />
      ) : null}
      {children}
    </Tag>
  );
}
