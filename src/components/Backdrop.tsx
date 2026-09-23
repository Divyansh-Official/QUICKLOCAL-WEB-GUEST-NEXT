/**
 * The field every glass surface on this site sits on.
 *
 * ── IT EXISTS BECAUSE OF HOW REFRACTION WORKS ───────────────────────────────
 * Bending a flat backdrop returns the same flat backdrop. Glass over plain
 * cream is an expensive border and nothing else, which is why iOS glass is
 * always over a wallpaper. So the page gets a wallpaper: warm colour that
 * drifts, and a fine grid fine enough to be felt rather than seen. The grid is
 * the part that matters — high-frequency structure is what a displacement map
 * has something to do with.
 *
 * ── IT IS FIXED, NOT PER-SECTION ────────────────────────────────────────────
 * One painted layer behind the whole document rather than a wash per section.
 * Sections used to each carry their own blooms, which meant two of them
 * overlapping at a boundary and a seam where one ended. A single fixed field
 * scrolls under everything and has no seams to get wrong.
 *
 * ── IT COSTS ALMOST NOTHING ─────────────────────────────────────────────────
 * Three gradients and one repeating SVG, composited once. The drift animates
 * `transform` only, so it never forces layout while the page is scrolling —
 * and it stops entirely under Reduce Motion.
 */
export function Backdrop() {
  return (
    <div aria-hidden className="ql-backdrop" data-testid="backdrop">
      {/* Warm blooms. Two, drifting out of phase, so the field is never
          symmetrical enough to read as a pattern. */}
      <span className="ql-bloom ql-bloom-a" />
      <span className="ql-bloom ql-bloom-b" />
      <span className="ql-bloom ql-bloom-c" />
      {/* The structure the glass actually bends. */}
      <span className="ql-weave" />
    </div>
  );
}
