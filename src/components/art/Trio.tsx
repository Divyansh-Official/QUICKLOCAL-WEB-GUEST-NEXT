import Slab3D from '@/components/ui/Slab3D';

/**
 * Three slabs — the shop, the basket, the rider — standing on a glass plate:
 * the platform's three sides as one object. Pure CSS 3D, decorative only.
 */
export default function Trio({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`group relative mx-auto aspect-square w-full max-w-[460px] ${className}`}>
      <div className="glass absolute inset-[10%] z-0 rounded-[48px]" />
      <div className="absolute inset-[22%] z-0 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--primary)_22%,transparent),transparent)]" />
      <div className="absolute left-[4%] top-[6%] z-10">
        <Slab3D icon="store" hue="butter" size={190} />
      </div>
      <div className="absolute right-[4%] top-[28%] z-10">
        <Slab3D icon="basket" hue="tangerine" size={170} />
      </div>
      <div className="absolute bottom-[2%] left-[22%] z-10">
        <Slab3D icon="bike" hue="ink" size={160} />
      </div>
    </div>
  );
}
