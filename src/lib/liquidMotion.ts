/**
 * The motion half of liquid glass: SwiftUI's spring, integrated per frame.
 *
 * ── WHY A SPRING AND NOT AN EASING CURVE ────────────────────────────────────
 * The interesting case is a target that changes MID-FLIGHT. Flick a card across
 * the screen and change direction, or click three nav rows quickly, and an
 * easing curve restarts from a standstill every time — the motion resets rather
 * than continues. A spring carries its existing velocity into the new target,
 * which is the whole reason Apple's surfaces feel like objects rather than
 * animations.
 *
 * ── THE PARAMETERISATION IS SWIFTUI'S, ON PURPOSE ───────────────────────────
 * response is the period of one oscillation in seconds, damping is the fraction
 * of critical. So numbers lifted straight out of a SwiftUI codebase behave
 * identically here, and so do Reanimated's — withSpring({duration, dampingRatio})
 * is the same model. SwiftUI's own presets sit at response 0.5 with damping 1.0
 * (.smooth), 0.85 (.snappy) and 0.7 (.bouncy); .interactiveSpring, which is what
 * finger tracking uses, is 0.15 / 0.86.
 */

export class Spring {
  private w = 0;
  private z = 1;
  x = 0;
  v = 0;
  target = 0;

  constructor(response: number, damping: number, value = 0) {
    this.setParams(response, damping);
    this.x = value;
    this.target = value;
  }

  setParams(response: number, damping: number) {
    this.w = (2 * Math.PI) / Math.max(0.02, response);
    this.z = damping;
  }

  step(dt: number) {
    if (!(dt > 0)) return this.x;
    // A backgrounded tab hands back a dt of seconds, and no substep count
    // survives integrating that in one go. Clamp before anything else.
    if (dt > 0.064) dt = 0.064;
    // Semi-implicit Euler is stable while h*w < 2. Sizing the substeps off the
    // spring's OWN frequency keeps a stiff spring well inside that bound,
    // rather than every spring sharing one fixed guess and the stiff ones
    // quietly exploding.
    const n = Math.min(32, Math.max(1, Math.ceil((dt * this.w) / 0.35)));
    const h = dt / n;
    for (let i = 0; i < n; i++) {
      const a = -this.w * this.w * (this.x - this.target) - 2 * this.z * this.w * this.v;
      this.v += a * h;
      this.x += this.v * h;
    }
    return this.x;
  }

  settled(eps = 0.05) {
    return Math.abs(this.x - this.target) < eps && Math.abs(this.v) < eps * 10;
  }

  snap(v: number) {
    this.x = v;
    this.target = v;
    this.v = 0;
  }
}

/**
 * How hard the glass is deforming, 0 to 1, from how fast it is moving.
 *
 * Saturating rather than linear: a droplet deforms less and less the faster it
 * goes, because surface tension is what resists it and that does not scale with
 * speed. A linear map keeps stretching without bound and reads as rubber.
 */
export function flexFromSpeed(speed: number, knee = 900): number {
  return speed / (speed + knee);
}

/**
 * Reduce Motion is about oscillation, not speed.
 *
 * Forcing at least critical damping keeps the tracking responsive while
 * removing overshoot entirely. Suppressing only the stretch would leave the
 * glass still rocking past its target, which is the part that actually causes
 * trouble for vestibular users.
 */
export function dampFor(damping: number, reduceMotion: boolean): number {
  return reduceMotion ? Math.max(1, damping) : damping;
}
