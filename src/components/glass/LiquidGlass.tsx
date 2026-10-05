'use client';

/**
 * LiquidGlass — a surface that refracts the page behind it.
 *
 * Everywhere first, and forever in Safari and Firefox, it is the frosted
 * material in globals.css (`.lg`): tint, blur, saturation and two bright rims,
 * taking its colours from the theme so it reads in light and in dark. In
 * Chromium, once mounted, it measures itself, fetches a displacement map for
 * its exact size from a shared cache, and upgrades to `backdrop-filter:
 * url(#filter)` — light ray-traced through a squircle bezel with Snell's law,
 * with chromatic dispersion and a Fresnel rim (lib/liquidGlass.ts).
 *
 * The first client render matches the server render, so hydration never
 * disagrees; the upgrade is an ordinary state change.
 *
 * Budget: each refracting surface is a GPU pass redone whenever anything
 * behind it moves. Use this for the chrome (header, tab bar) and for a few
 * large panes that stay put. Things that come in numbers take `.glass`.
 *
 *   radius       corner radius in px; 999 makes a capsule
 *   strength     'soft' for bars with text, 'full' for panes
 *   elevation    'flat' | 'raised' | 'float'
 *   interactive  lenses harder under the pointer and when pressed, on a spring
 *   lazy         refract only while on screen
 */
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { GlassFilter } from './GlassFilter';
import {
  generateDisplacementMap,
  nextFilterId,
  supportsBackdropRefraction,
  type DisplacementMap,
  type SurfaceProfile,
} from '@/lib/liquidGlass';
import { Spring } from '@/lib/liquidMotion';

/** The console's signed-off optics, shared so every surface is one material. */
const GLASS = {
  depth: 36,
  thickness: 40,
  ior: 1.7,
  softness: 0,
  dispersion: 0.9,
  specular: 1,
  profile: 'squircle' as SurfaceProfile,
  response: 0.34,
  damping: 0.82,
  lensing: 0.4,
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

function opticsFor(strength: 'soft' | 'full', radius: number): Optics {
  const soft = strength === 'soft';
  return {
    radius,
    depth: soft ? 12 : GLASS.depth,
    thickness: soft ? 22 : GLASS.thickness,
    ior: GLASS.ior,
    softness: soft ? 0.3 : GLASS.softness,
    specular: GLASS.specular,
    profile: GLASS.profile,
  };
}

/* ---------- shared map cache: built a few per frame, never twice ---------- */

const MAX_CACHED = 64;
const FRAME_BUDGET_MS = 7;
const cache = new Map<string, DisplacementMap>();
const waiting = new Map<string, Set<(m: DisplacementMap) => void>>();
const queue: { key: string; w: number; h: number; optics: Optics }[] = [];
let scheduled = false;

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
    if (!waiting.has(job.key)) continue;
    const hit = cache.get(job.key);
    if (hit) {
      deliver(job.key, hit);
      continue;
    }
    const map = generateDisplacementMap({ width: job.w, height: job.h, ...job.optics, specularAngle: -90, superSample: 1 });
    cache.set(job.key, map);
    while (cache.size > MAX_CACHED) {
      const oldest = cache.keys().next().value;
      if (oldest === undefined) break;
      cache.delete(oldest);
    }
    /* Decoded before it is handed out, or the first frame paints unfiltered. */
    const img = new Image();
    img.src = map.url;
    img.decode().then(
      () => deliver(job.key, map),
      () => deliver(job.key, map),
    );
  }
  if (queue.length) schedule();
}

function schedule() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(pump);
}

function requestMap(key: string, w: number, h: number, optics: Optics, cb: (m: DisplacementMap) => void) {
  const hit = cache.get(key);
  if (hit) {
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

/* ---------- the surface ---------- */

const ELEVATIONS = { flat: 'lg-flat', raised: 'lg-raised', float: 'lg-float' } as const;

type Props = {
  as?: ElementType;
  radius?: number;
  strength?: 'soft' | 'full';
  elevation?: keyof typeof ELEVATIONS;
  blur?: number;
  saturation?: number;
  interactive?: boolean;
  lazy?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  href?: string;
  onClick?: (event: never) => void;
} & Omit<HTMLAttributes<HTMLElement>, 'style' | 'children' | 'onClick'>;

const LiquidGlass = forwardRef<HTMLElement, Props>(function LiquidGlass(
  {
    as: Tag = 'div',
    radius = 24,
    strength = 'soft',
    elevation = 'raised',
    blur = 1.6,
    saturation = 1.3,
    interactive = false,
    lazy = false,
    className = '',
    style,
    children,
    onPointerEnter,
    onPointerLeave,
    onPointerDown,
    onPointerUp,
    onPointerCancel,
    ...rest
  },
  forwardedRef,
) {
  const hostRef = useRef<HTMLElement | null>(null);
  const [refracts, setRefracts] = useState(false);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  const [visible, setVisible] = useState(!lazy);
  const [map, setMap] = useState<{ key: string; map: DisplacementMap } | null>(null);
  const [filterId] = useState(() => nextFilterId('ql'));

  const setRefs = useCallback(
    (node: HTMLElement | null) => {
      hostRef.current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef],
  );

  /* Capability is read after mount, so server and first client render match. */
  useEffect(() => {
    const id = requestAnimationFrame(() => setRefracts(supportsBackdropRefraction()));
    return () => cancelAnimationFrame(id);
  }, []);

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
    const io = new IntersectionObserver(entries => entries.forEach(e => setVisible(e.isIntersecting)), {
      rootMargin: '160px 0px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, [lazy, refracts]);

  /* Maps are cached on an 8 × 4 px grid — the stretch is invisible. */
  const qw = box ? Math.max(8, Math.ceil(box.w / 8) * 8) : 0;
  const qh = box ? Math.max(4, Math.ceil(box.h / 4) * 4) : 0;
  const optics = box ? opticsFor(strength, Math.min(radius, box.h / 2, box.w / 2)) : null;
  const key = optics
    ? `${qw}x${qh}|${optics.radius.toFixed(1)}|${optics.depth}|${optics.thickness}|${optics.softness}`
    : '';

  useEffect(() => {
    if (!refracts || !visible || !optics || !key) return;
    return requestMap(key, qw, qh, optics, m => setMap({ key, map: m }));
    // optics derives from key
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refracts, visible, key]);

  const live = refracts && visible && box && map && map.key === key ? map.map : null;
  const dispersion = strength === 'soft' ? GLASS.dispersion * 0.5 : GLASS.dispersion;

  /* ---- flex: lens harder under the pointer, on a spring ---- */
  const lens = useRef<Spring | null>(null);
  const lensFrame = useRef(0);
  const hovering = useRef(false);
  useEffect(() => () => cancelAnimationFrame(lensFrame.current), []);

  function flex(target: number) {
    if (!interactive || !live) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const spring = lens.current ?? (lens.current = new Spring(GLASS.response, GLASS.damping, 1));
    spring.target = target;
    if (lensFrame.current) return;
    const base = live.scale;
    const taps = [1 - dispersion * 0.12, 1, 1 + dispersion * 0.12];
    let last = performance.now();
    const tick = (now: number) => {
      spring.step((now - last) / 1000);
      last = now;
      const nodes = document.getElementById(filterId)?.querySelectorAll('feDisplacementMap');
      nodes?.forEach((node, i) => node.setAttribute('scale', String(base * spring.x * (taps[i] ?? 1))));
      if (spring.settled(0.002)) {
        spring.snap(spring.target);
        lensFrame.current = 0;
        return;
      }
      lensFrame.current = requestAnimationFrame(tick);
    };
    lensFrame.current = requestAnimationFrame(tick);
  }

  const lensing = 1 + GLASS.lensing;
  type Handler = ((e: never) => void) | undefined;

  return (
    <Tag
      {...rest}
      ref={setRefs}
      className={`lg ${ELEVATIONS[elevation] ?? ELEVATIONS.raised} ${className}`}
      data-lg-live={live ? '' : undefined}
      onPointerEnter={(e: never) => {
        hovering.current = true;
        flex(1 + (lensing - 1) * 0.6);
        (onPointerEnter as Handler)?.(e);
      }}
      onPointerLeave={(e: never) => {
        hovering.current = false;
        flex(1);
        (onPointerLeave as Handler)?.(e);
      }}
      onPointerDown={(e: never) => {
        flex(lensing * 1.25);
        (onPointerDown as Handler)?.(e);
      }}
      onPointerUp={(e: never) => {
        flex(hovering.current ? 1 + (lensing - 1) * 0.6 : 1);
        (onPointerUp as Handler)?.(e);
      }}
      onPointerCancel={(e: never) => {
        flex(1);
        (onPointerCancel as Handler)?.(e);
      }}
      style={{
        '--lg-radius': `${radius}px`,
        ...(live ? { backdropFilter: `url(#${filterId})`, WebkitBackdropFilter: `url(#${filterId})` } : null),
        ...style,
      } as CSSProperties}>
      {live && box ? (
        <GlassFilter
          id={filterId}
          map={live}
          width={box.w}
          height={box.h}
          dispersion={dispersion}
          blur={blur}
          saturation={saturation}
        />
      ) : null}
      {children}
    </Tag>
  );
});

export default LiquidGlass;
