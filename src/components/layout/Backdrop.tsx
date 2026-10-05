/**
 * The field every glass surface sits on: warm blooms and a fine weave,
 * painted once and fixed behind the whole document. Refraction bends what is
 * behind a surface — bend a flat colour and nothing shows — so this is what
 * makes the glass legible. It never moves: anything animating behind glass
 * makes every glass surface recompute every frame. Its colours come from the
 * theme, so it is cream by day and charcoal by night.
 */
export default function Backdrop() {
  return (
    <div className="field" aria-hidden="true">
      <span className="bloom bloom-a" />
      <span className="bloom bloom-b" />
      <span className="bloom bloom-c" />
      <span className="weave" />
    </div>
  );
}
