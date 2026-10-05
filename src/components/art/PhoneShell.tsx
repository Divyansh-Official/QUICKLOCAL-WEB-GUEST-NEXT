import type { CSSProperties, ReactNode } from 'react';

/**
 * The handset body on its own — layers along Z, the lit bezel, the island and
 * the glare — around any screen. Phone3D draws the hero's live tracking in
 * the same body; this one takes its screen as children, so the How It Works
 * story can swap scenes inside it. The screen is a size container: draw in
 * cqw and it scales with the phone.
 */
export default function PhoneShell({ width = 'clamp(240px, 24vw, 300px)', className = '', children }: { width?: string; className?: string; children: ReactNode }) {
  return (
    <div className={`phone-stage select-none ${className}`} aria-hidden="true">
      <div className="phone" style={{ '--pw': width, '--rx': '0deg', '--ry': '0deg', '--rz': '0deg' } as CSSProperties}>
        {Array.from({ length: 9 }, (_, i) => (
          <span key={i} className="phone-layer" style={{ '--i': i + 1 } as CSSProperties} />
        ))}
        <div className="phone-front">
          <div className="phone-screen @container">
            <span className="phone-island" />
            {children}
          </div>
        </div>
        <span className="phone-glare" />
      </div>
      <span className="phone-shadow" />
    </div>
  );
}
