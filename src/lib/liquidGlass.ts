/**
 * Refraction for the console's glass surfaces.
 *
 * ── WHAT THIS IS ────────────────────────────────────────────────────────────
 * Not a blur with a white border. It ray-traces a vertical light ray through a
 * curved glass bezel with Snell's law, works out where that ray lands on the
 * background, and bakes the resulting 2D offset field into a PNG that SVG's
 * feDisplacementMap consumes. The bend you see is the bend the physics says.
 *
 *   n1·sin(theta1) = n2·sin(theta2)      n1 = 1 (air), n2 = ior (1.5 = glass)
 *   d = h · tan(theta1 - theta2)         h = glass height at that point
 *
 * The model is deliberately constrained so every ray has a closed-form answer:
 * one refraction event at the entry surface, incident rays orthogonal to the
 * background, and the glass sitting flush on it. Exit refraction is skipped
 * because the exit face is in optical contact with what it is resting on.
 *
 * ── THE ONE THING THAT DECIDES WHETHER ANY OF THIS IS VISIBLE ───────────────
 * Refraction bends a backdrop. Bending a FLAT backdrop returns the same flat
 * backdrop — the maths runs, the map is correct, and the screen shows nothing.
 * Glass needs something behind it with structure, which is why iOS glass is
 * always over a wallpaper. Put one of these over a solid fill and the only
 * thing that survives is the rim light, at which point you have paid for a
 * displacement map to draw a border.
 */

/* -------------------------------------------------------------------------- */
/* Geometry                                                                    */
/* -------------------------------------------------------------------------- */

export interface LensGeometry {
  width: number;
  height: number;
  /** Corner radius in px. Clamped to half the shorter side. */
  radius: number;
  /**
   * Bezel width in px — how far in the curved shoulder reaches before the
   * surface goes flat. The dominant look control. Small = a hard optical rim,
   * large = a soft dome.
   */
  depth: number;
  /** Glass thickness in px. Scales how far a bent ray travels, so it scales the bend. */
  thickness: number;
  /** 1.5 = crown glass, 1.33 = water, 2.42 = diamond. */
  ior: number;
  /** Shoulder cross-section. Apple uses a squircle. */
  profile: SurfaceProfile;
  /**
   * Eases the shoulder toward a straight ramp, 0-0.5.
   *
   * A pure squircle has a near-vertical tangent at the rim, which packs the
   * whole refraction into a sub-pixel line that aliases. Measured on an 18px
   * bezel: softness 0 puts the >50% band at 4.0px, softness 0.35 spreads it to
   * 17.9px. Past 0.55 the ramp takes over and the peak jumps to the INNER edge,
   * which is backwards — verified, the flip happens between 0.50 and 0.55.
   */
  softness: number;
  /** Rim specular strength, 0-1. Baked into the map's blue channel. */
  specular: number;
  /** Light direction in degrees. 0 = from the right, -90 = from above. */
  specularAngle: number;
  /** Map texels per CSS px. 2 is the sweet spot; costs 4x to generate. */
  superSample: number;
}

export const DEFAULT_LENS: LensGeometry = {
  width: 200,
  height: 34,
  radius: 8,
  depth: 10,
  thickness: 14,
  ior: 1.5,
  profile: 'squircle',
  softness: 0.35,
  specular: 0.3,
  specularAngle: -90,
  superSample: 2,
};

export interface DisplacementMap {
  /** data: URL of the PNG. Goes into feImage. */
  url: string;
  mapWidth: number;
  mapHeight: number;
  /** The value to hand feDisplacementMap so the rendered shift equals the traced shift. */
  scale: number;
  /** Peak bend in CSS px. */
  peak: number;
  /** Width of the band carrying more than half the peak bend, in CSS px. */
  band: number;
}

/* -------------------------------------------------------------------------- */
/* Surface                                                                     */
/* -------------------------------------------------------------------------- */

export type SurfaceProfile = 'squircle' | 'convex' | 'lip' | 'concave';

/** Shoulder cross-section at normalised distance x in from the outer edge. */
function rawHeight(x: number, profile: SurfaceProfile): number {
  switch (profile) {
    // Circular arc. Hands off to the flat interior more sharply, so it reads
    // as a harder, more optical rim. Good on small controls.
    case 'convex':
      return Math.sqrt(Math.max(0, 1 - (1 - x) ** 2));

    // Bowl. Diverges rays OUTWARD, so it samples past the lens boundary and
    // needs the bleed ring to have real pixels in it. Apple avoids this
    // everywhere except a switch thumb.
    case 'concave':
      return 1 - Math.sqrt(Math.max(0, 1 - (1 - x) ** 2));

    // Raised rim with a shallow dip behind it — what a physical switch thumb
    // or a pressed key actually looks like in section.
    case 'lip': {
      const convex = Math.sqrt(Math.max(0, 1 - (1 - x) ** 2));
      const s = x * x * x * (x * (x * 6 - 15) + 10);   // smootherstep
      return convex * (1 - s) + (1 - convex) * s;
    }

    // Apple's shape. The quartic superellipse keeps the refraction gradient
    // continuous when the lens is stretched into a wide rectangle, which is
    // every nav pill ever made. A circular arc does not.
    default:
      return Math.max(0, 1 - (1 - x) ** 4) ** 0.25;
  }
}

/**
 * Height of the glass at normalised distance t from the outer edge.
 *
 * Softness eases toward the straight line between THIS profile's own
 * endpoints, not toward a rising ramp. A dome runs 0 to 1 and a bowl runs 1 to
 * 0; easing both toward a rising line widens the dome's band and collapses the
 * bowl's, which is the opposite of what the control is for.
 */
function surfaceHeight(t: number, softness: number, profile: SurfaceProfile): number {
  const x = t < 0 ? 0 : t > 1 ? 1 : t;
  const base = rawHeight(x, profile);
  if (softness <= 0) return base;
  const line = rawHeight(0, profile) * (1 - x) + rawHeight(1, profile) * x;
  return base * (1 - softness) + line * softness;
}

/** Signed distance to a rounded rectangle centred on the origin. Negative inside. */
function sdRoundedRect(px: number, py: number, halfW: number, halfH: number, r: number): number {
  const qx = Math.abs(px) - halfW + r;
  const qy = Math.abs(py) - halfH + r;
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
}

/**
 * Outward unit normal, solved analytically rather than by differencing the SDF.
 * A numeric gradient leaves a visible seam where the straight edge meets the
 * corner arc; this does not.
 */
function outwardNormal(
  px: number, py: number, halfW: number, halfH: number, r: number,
): [number, number] {
  const qx = Math.abs(px) - halfW + r;
  const qy = Math.abs(py) - halfH + r;
  const sx = px < 0 ? -1 : 1;
  const sy = py < 0 ? -1 : 1;
  if (qx > 0 && qy > 0) {
    const len = Math.hypot(qx, qy) || 1;
    return [(qx / len) * sx, (qy / len) * sy];
  }
  return qx > qy ? [sx, 0] : [0, sy];
}

/* -------------------------------------------------------------------------- */
/* Map generation                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Build the displacement PNG.
 *
 *   R -> x sampling offset, 128 neutral
 *   G -> y sampling offset, 128 neutral
 *   B -> baked Fresnel rim
 *   A -> always 255
 *
 * Alpha stays opaque everywhere on purpose. SVG filters work on premultiplied
 * colour, so putting the lens silhouette in alpha would zero R and G outside
 * the shape and throw the whole backdrop sideways. The silhouette is a CSS
 * border-radius on the element instead — free, and exact.
 */
export function generateDisplacementMap(geometry: Partial<LensGeometry> = {}): DisplacementMap {
  const g: LensGeometry = { ...DEFAULT_LENS, ...geometry };

  const ss = Math.max(1, Math.round(g.superSample));
  const W = Math.max(1, Math.round(g.width));
  const H = Math.max(1, Math.round(g.height));
  const mapW = W * ss;
  const mapH = H * ss;

  const halfW = W / 2;
  const halfH = H / 2;
  const radius = Math.min(g.radius, halfW, halfH);
  const depth = Math.max(1, Math.min(g.depth, halfW, halfH));

  const lightRad = (g.specularAngle * Math.PI) / 180;
  const lx = Math.cos(lightRad);
  const ly = Math.sin(lightRad);

  // ---- Pass 1: solve the ray once along a single radius --------------------
  // The bend depends only on distance from the edge, never on where you are
  // around the perimeter, so one LUT serves every pixel of every quadrant.
  const N = 256;
  const dispLUT = new Float64Array(N);
  const specLUT = new Float64Array(N);
  const dt = 1 / (N - 1);
  const eps = dt * 0.5;
  let peak = 0;

  for (let i = 0; i < N; i++) {
    const t = i * dt;
    const h = surfaceHeight(t, g.softness, g.profile) * g.thickness;

    // Slope in px/px: d(height)/d(t) converted to d(height)/d(distance).
    const hA = surfaceHeight(t - eps, g.softness, g.profile) * g.thickness;
    const hB = surfaceHeight(t + eps, g.softness, g.profile) * g.thickness;
    const slope = (hB - hA) / (2 * eps * depth);

    // The incident ray is vertical, so the angle of incidence IS the surface tilt.
    const theta1 = Math.atan(Math.abs(slope));
    const theta2 = Math.asin(Math.min(1, Math.sin(theta1) / g.ior));

    // Sign follows the slope: a converging surface pulls rays inward, a
    // diverging one pushes them out. Taking the magnitude only would make a
    // bowl refract like a dome.
    const bend = h * Math.tan(theta1 - theta2);
    dispLUT[i] = slope >= 0 ? bend : -bend;
    if (Math.abs(dispLUT[i]) > peak) peak = Math.abs(dispLUT[i]);

    // Reflectance climbs steeply toward grazing incidence, which is why real
    // glass lights up along its rim and stays clear in the middle. A hand-drawn
    // white gradient never falls off quite right.
    specLUT[i] = (1 - Math.cos(theta1)) ** 5;
  }
  if (peak < 1e-6) peak = 1e-6;

  let lo = -1;
  let hi = -1;
  for (let i = 0; i < N; i++) {
    if (Math.abs(dispLUT[i]) > peak * 0.5) { if (lo < 0) lo = i; hi = i; }
  }
  const band = lo < 0 ? 0 : ((hi - lo) / (N - 1)) * depth;

  // ---- Pass 2: rasterise ---------------------------------------------------
  const canvas = document.createElement('canvas');
  canvas.width = mapW;
  canvas.height = mapH;
  // No willReadFrequently: this canvas is written and encoded, never read back,
  // and the flag forces a software backing store that only slows toDataURL.
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(mapW, mapH);
  const data = img.data;

  const write = (x: number, y: number, ox: number, oy: number, sp: number) => {
    const idx = (y * mapW + x) * 4;
    data[idx] = 128 + Math.max(-127, Math.min(127, (ox / peak) * 127));
    data[idx + 1] = 128 + Math.max(-127, Math.min(127, (oy / peak) * 127));
    data[idx + 2] = Math.max(0, Math.min(255, sp * 255));
    data[idx + 3] = 255;
  };

  // Four-fold symmetry: solve the top-left quadrant, mirror the rest with a
  // sign flip per axis. Texel centres mirror exactly, verified — mapW-1-x lands
  // on -px for even and odd sizes alike.
  const qw = Math.ceil(mapW / 2);
  const qh = Math.ceil(mapH / 2);

  for (let y = 0; y < qh; y++) {
    const py = (y + 0.5) / ss - halfH;
    for (let x = 0; x < qw; x++) {
      const px = (x + 0.5) / ss - halfW;
      const distFromEdge = -sdRoundedRect(px, py, halfW, halfH, radius);
      const mx = mapW - 1 - x;
      const my = mapH - 1 - y;

      if (distFromEdge <= 0) {
        write(x, y, 0, 0, 0);
        if (mx !== x) write(mx, y, 0, 0, 0);
        if (my !== y) write(x, my, 0, 0, 0);
        if (mx !== x && my !== y) write(mx, my, 0, 0, 0);
        continue;
      }

      const t = Math.min(1, distFromEdge / depth);
      const fi = t * (N - 1);
      const i0 = Math.floor(fi);
      const i1 = Math.min(N - 1, i0 + 1);
      const f = fi - i0;
      const d = dispLUT[i0] * (1 - f) + dispLUT[i1] * f;
      const fres = specLUT[i0] * (1 - f) + specLUT[i1] * f;

      const [nx, ny] = outwardNormal(px, py, halfW, halfH, radius);

      // A converging surface pulls rays toward the thick centre, so the sample
      // offset points INWARD. That inward pull is what magnifies the core and
      // compresses the band just inside the rim — the single most recognisable
      // thing about Apple's glass. Flip the sign and it reads as a fisheye.
      const ox = -nx * d;
      const oy = -ny * d;

      // The offset field mirrors with a sign flip. The rim light does not — it
      // has a direction — so the Lambert term is re-evaluated against each
      // quadrant's own normal and only the Fresnel scalar is reused.
      const lit = (ax: number, ay: number) =>
        fres * Math.max(0, nx * ax * lx + ny * ay * ly) * g.specular;

      write(x, y, ox, oy, lit(1, 1));
      if (mx !== x) write(mx, y, -ox, oy, lit(-1, 1));
      if (my !== y) write(x, my, ox, -oy, lit(1, -1));
      if (mx !== x && my !== y) write(mx, my, -ox, -oy, lit(-1, -1));
    }
  }

  ctx.putImageData(img, 0, 0);

  return {
    url: canvas.toDataURL('image/png'),
    mapWidth: mapW,
    mapHeight: mapH,
    // feDisplacementMap turns a channel value c into scale * (c/255 - 0.5). The
    // encoding puts +-1 at 128 +- 127, so dividing that back out makes the
    // rendered pixel shift equal the traced physical shift. Round-trip error
    // measured at 0.055px worst case, which is the byte rounding and nothing else.
    scale: peak * (255 / 127),
    peak,
    band,
  };
}

/* -------------------------------------------------------------------------- */
/* Capability                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Can this engine resolve an SVG filter inside `backdrop-filter`?
 *
 * Only Chromium can. It is in no spec — w3c/svgwg#1142 is the open issue asking
 * for it to be defined — and everywhere else the declaration parses and then
 * does nothing, which is worse than failing, because it looks like it worked.
 *
 * ── WHY NOT THE USER-AGENT STRING ───────────────────────────────────────────
 * The obvious test is /Safari/ && !/Chrome|Chromium|Edg/. It is wrong on four
 * real browsers I checked it against, all of them WebKit: iOS Edge, whose UA
 * contains "Edg"; and every iOS in-app webview — Instagram, Facebook, bare
 * WKWebView — which omit "Safari" entirely. Each of those would be handed a
 * declaration that silently does nothing, so the glass renders as an empty
 * transparent box with a faint tint and no blur at all.
 *
 * navigator.vendor is a property of the ENGINE rather than a marketing string:
 * every WebKit build on an Apple platform reports "Apple Computer, Inc.",
 * including iOS Chrome and Edge, which are WKWebView underneath. Chromium
 * reports "Google Inc." and Gecko reports "". There is still no way to feature
 * detect the real thing — you cannot read back a rendered backdrop — so this is
 * the most honest signal available.
 */
export function supportsBackdropRefraction(): boolean {
  if (typeof window === 'undefined') return false;
  if (!CSS?.supports?.('backdrop-filter', 'blur(1px)')) return false;
  const isWebKit = navigator.vendor === 'Apple Computer, Inc.';
  const isGecko = 'MozAppearance' in document.documentElement.style;
  return !isWebKit && !isGecko;
}

/**
 * A fresh id per rebuild.
 *
 * Safari caches SVG filter output by filter id and will keep serving the first
 * frame forever if the map changes under a stable one. Cheap insurance even on
 * the Chromium path, where a stale id survives fast refresh in dev.
 */
let filterSeq = 0;
export function nextFilterId(prefix = 'lg'): string {
  filterSeq += 1;
  return `${prefix}-${filterSeq.toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Filter subregions given in objectBoundingBox units are misplaced on iOS.
 * userSpaceOnUse is correct everywhere and mandatory there.
 */
export const FILTER_UNITS = 'userSpaceOnUse' as const;

/**
 * How far the filter region reaches past the element on every side.
 *
 * SVG filter regions CLIP, and a Gaussian blur reaches about 3x its standard
 * deviation. Sized to the element exactly, the blur pulls in transparent black
 * from outside the region and the outer few pixels of the glass fade out — a
 * sharp ring where the unfiltered page shows through. backdrop-filter clips the
 * result to the border box anyway, so the inflation costs nothing but sampling.
 */
export const LENS_BLEED = 16;

/* -------------------------------------------------------------------------- */
/* Grain                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * A seamless noise tile centred exactly on a base colour.
 *
 * ── WHY THIS EXISTS ─────────────────────────────────────────────────────────
 * Refraction is only visible where the backdrop changes over the distance it
 * displaces — about 4px here. Smooth gradients do not; noise does. The obvious
 * way to get noise in CSS is an feTurbulence data URI, and it is a trap: its
 * output is NOT centred on mid-grey. Measured, this tile came back with a mean
 * of 187 out of 255, so laying it over a dark rail lifted that rail's mean
 * luminance from 33 to 74 — it more than doubled the brightness of a
 * deliberately dark surface. Compositing it with `overlay` fixed the brightness
 * and then crushed the amplitude to a standard deviation of 1.3, which is
 * invisible, because overlay against a dark base is multiplicative and its gain
 * is 2 x base.
 *
 * Generating the tile directly sidesteps both. The mean is the base colour by
 * construction and the amplitude is whatever was asked for.
 *
 * The noise is low-passed once. Per-pixel white noise has a correlation length
 * below one device pixel, so it aliases into a shimmer as soon as the page is
 * zoomed or moved to a different DPR. One box pass puts the correlation length
 * around 2px — still well inside the 4px bend, so the refraction still reads,
 * but stable under resampling.
 */
export function generateGrainTile(
  baseColor: [number, number, number],
  amplitude: number,
  size = 96,
): string {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(size, size);

  // Sum of three uniforms: close enough to Gaussian for grain, and far cheaper
  // than Box-Muller over ~9k pixels.
  const raw = new Float32Array(size * size);
  for (let i = 0; i < raw.length; i++) {
    raw[i] = (Math.random() + Math.random() + Math.random()) / 3 - 0.5;
  }

  // Box blur, wrapping at the edges so the tile stays seamless.
  const smooth = new Float32Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let sum = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const sy = (y + dy + size) % size;
          const sx = (x + dx + size) % size;
          sum += raw[sy * size + sx];
        }
      }
      smooth[y * size + x] = sum / 9;
    }
  }

  // Blurring shrinks the spread, so renormalise to the amplitude that was
  // actually requested rather than to whatever the blur happened to leave.
  let mean = 0;
  for (const v of smooth) mean += v;
  mean /= smooth.length;
  let sd = 0;
  for (const v of smooth) sd += (v - mean) ** 2;
  sd = Math.sqrt(sd / smooth.length) || 1e-6;
  const gain = amplitude / sd;

  const [br, bg, bb] = baseColor;
  for (let i = 0; i < smooth.length; i++) {
    const n = (smooth[i] - mean) * gain;
    const p = i * 4;
    img.data[p] = Math.max(0, Math.min(255, br + n));
    img.data[p + 1] = Math.max(0, Math.min(255, bg + n));
    img.data[p + 2] = Math.max(0, Math.min(255, bb + n));
    img.data[p + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL('image/png');
}
