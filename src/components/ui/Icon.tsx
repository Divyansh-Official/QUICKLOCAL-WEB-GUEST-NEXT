/**
 * The icon set — inline SVG on a 24-unit grid, drawn with the same 1.7 stroke
 * as the admin console so the products look drawn by one hand. No requests,
 * `currentColor` throughout, server-rendered.
 *
 * Icons can move, the way SF Symbols do:
 *   effect="draw"    the strokes draw themselves as the icon scrolls into view
 *   effect="bounce"  a small hop when its `.group` parent is hovered
 * Both are CSS (globals.css) and both stop under reduced motion.
 *
 * Any icon name may come from JSON; an unknown one falls back to a circle.
 */
type Glyph = { d: string[]; filled?: boolean; dash?: number[] };

const circle = (cx: number, cy: number, r: number) =>
  `M${cx} ${cy - r}a${r} ${r} 0 1 0 0 ${2 * r} ${r} ${r} 0 0 0 0-${2 * r}Z`;

const ICONS: Record<string, Glyph> = {
  /* categories */
  basket: { d: ['M4.2 8.8h15.6l-1.5 9.4a2 2 0 0 1-2 1.7H7.7a2 2 0 0 1-2-1.7Z', 'M8.6 8.8 10.9 4M15.4 8.8 13.1 4', 'M10 12.4v3.4M14 12.4v3.4'] },
  tools: {
    d: [
      'M14.2 6.6a3.4 3.4 0 0 0 4.5 4.4l2.1 2.1a1.6 1.6 0 0 1-2.3 2.3l-2.1-2.1a3.4 3.4 0 0 1-4.4-4.5Z',
      'M10.4 13.6 4.6 19.4a1.7 1.7 0 0 0 2.4 2.4l5.8-5.8',
      'M3.2 6.2 6 3.4l3.4 3.4-1.2 2.6-2.6 1.2Z',
    ],
  },
  sofa: {
    d: [
      'M4.4 11.2V8.6a2.2 2.2 0 0 1 2.2-2.2h10.8a2.2 2.2 0 0 1 2.2 2.2v2.6',
      'M3 13.2a2 2 0 0 1 4 0v2.4h10v-2.4a2 2 0 0 1 4 0v4.4a1.4 1.4 0 0 1-1.4 1.4H4.4A1.4 1.4 0 0 1 3 17.6Z',
      'M6 19v1.6M18 19v1.6',
    ],
  },
  shirt: { d: ['M9 3.6 12 6l3-2.4 5 2.6-1.8 4-2.2-.8v11H8v-11l-2.2.8-1.8-4Z'] },
  box: { d: ['M12 3.2 20.4 7.6v8.8L12 20.8 3.6 16.4V7.6Z', 'M3.6 7.6 12 12l8.4-4.4M12 12v8.8'] },

  /* trust */
  'shield-check': { d: ['M12 3.2 19 5.8v5.4c0 4.2-2.8 7.4-7 9.6-4.2-2.2-7-5.4-7-9.6V5.8Z', 'm8.9 11.9 2.2 2.2 4-4.3'] },
  lock: {
    d: [
      'M6.6 10.2h10.8a2.2 2.2 0 0 1 2.2 2.2v5.8a2.2 2.2 0 0 1-2.2 2.2H6.6a2.2 2.2 0 0 1-2.2-2.2v-5.8a2.2 2.2 0 0 1 2.2-2.2Z',
      'M8.2 10.2V7.6a3.8 3.8 0 0 1 7.6 0v2.6',
      'M12 14.4v1.8',
    ],
  },
  truck: { d: ['M2.8 6.4h10.4v9.8H2.8Z', 'M13.2 9.6h3.6l3.4 3.2v3.4h-7Z', circle(7, 18, 1.9), circle(17, 18, 1.9)] },
  headset: {
    d: [
      'M4.6 14.4v-2.6a7.4 7.4 0 0 1 14.8 0v2.6',
      'M4.4 13.4h.8a1.6 1.6 0 0 1 1.6 1.6v2.4a1.6 1.6 0 0 1-1.6 1.6h-.8a1.6 1.6 0 0 1-1.6-1.6V15a1.6 1.6 0 0 1 1.6-1.6Z',
      'M18.8 13.4h.8a1.6 1.6 0 0 1 1.6 1.6v2.4a1.6 1.6 0 0 1-1.6 1.6h-.8a1.6 1.6 0 0 1-1.6-1.6V15a1.6 1.6 0 0 1 1.6-1.6Z',
      'M19.4 19v.6a2.4 2.4 0 0 1-2.4 2.4h-2.6',
    ],
  },

  /* facts */
  radius: { d: [circle(12, 12, 8.4), circle(12, 12, 1.4), 'M12 12h8.4'], dash: [0] },
  clock: { d: [circle(12, 12, 8.4), 'M12 7.2V12l3.4 2'] },
  wallet: {
    d: [
      'M3.6 8.2a2.2 2.2 0 0 1 2.2-2.2h10.4a2 2 0 0 1 2 2v1.4',
      'M5.8 8.2h12.4a2.2 2.2 0 0 1 2.2 2.2v6a2.2 2.2 0 0 1-2.2 2.2H5.8a2.2 2.2 0 0 1-2.2-2.2v-6a2.2 2.2 0 0 1 2.2-2.2Z',
      'M15.6 13.4h1.2',
    ],
  },
  tag: { d: ['M11.4 3.4H20v8.6l-8.4 8.4a1.6 1.6 0 0 1-2.3 0l-6.3-6.3a1.6 1.6 0 0 1 0-2.3Z', circle(16.2, 7.8, 1.5)] },
  gift: {
    d: [
      'M4 9.4h16v3.4H4Z',
      'M5.4 12.8h13.2v7.6H5.4Z',
      'M12 9.4v11',
      'M12 9.4C10.6 6 7.4 5.4 7 7.2s2.6 2.2 5 2.2Zm0 0c1.4-3.4 4.6-4 5-2.2s-2.6 2.2-5 2.2Z',
    ],
  },
  calculator: {
    d: [
      'M7 3.4h10a1.8 1.8 0 0 1 1.8 1.8v13.6a1.8 1.8 0 0 1-1.8 1.8H7a1.8 1.8 0 0 1-1.8-1.8V5.2A1.8 1.8 0 0 1 7 3.4Z',
      'M8.4 6.6h7.2v3H8.4Z',
      'M8.8 13h.01M12 13h.01M15.2 13h.01M8.8 16.4h.01M12 16.4h.01M15.2 16.4h.01',
    ],
  },
  route: { d: [circle(6, 18, 2.2), circle(18, 6, 2.2), 'M8.2 18h7.3a3 3 0 0 0 0-6h-7a3 3 0 0 1 0-6h7.3'] },

  /* ui */
  home: { d: ['M4 10.4 12 4l8 6.4V19a1.4 1.4 0 0 1-1.4 1.4h-4v-5.6H9.4v5.6h-4A1.4 1.4 0 0 1 4 19Z'] },
  download: { d: ['M12 3.6v11.2', 'm7.6 10.6 4.4 4.4 4.4-4.4', 'M4.4 16.6v1.8a2 2 0 0 0 2 2h11.2a2 2 0 0 0 2-2v-1.8'] },
  search: { d: [circle(10.8, 10.8, 6.4), 'm15.6 15.6 4.2 4.2'] },
  pin: { d: ['M12 21.2s6.6-5.6 6.6-10.4a6.6 6.6 0 1 0-13.2 0C5.4 15.6 12 21.2 12 21.2Z', circle(12, 10.6, 2.4)] },
  'chevron-right': { d: ['m9.5 5.5 6.5 6.5-6.5 6.5'] },
  'chevron-left': { d: ['M14.5 5.5 8 12l6.5 6.5'] },
  'chevron-down': { d: ['m5.5 9.5 6.5 6.5 6.5-6.5'] },
  check: { d: ['m5.5 12.5 4.2 4.2 8.8-9.4'] },
  'check-circle': { d: [circle(12, 12, 8.6), 'm8.4 12.2 2.5 2.5 4.8-5'] },
  'arrow-right': { d: ['M4.4 12h15.2', 'm13.8 6.2 5.8 5.8-5.8 5.8'] },
  'arrow-up-right': { d: ['M7 17 17 7', 'M8.4 7H17v8.6'] },
  menu: { d: ['M4 8h16', 'M4 16h16'] },
  close: { d: ['M6.4 6.4l11.2 11.2M17.6 6.4 6.4 17.6'] },
  plus: { d: ['M12 5v14', 'M5 12h14'] },
  info: { d: [circle(12, 12, 8.6), 'M12 11v5.4', 'M12 7.8h.01'] },
  copy: {
    d: [
      'M9 9.5A1.5 1.5 0 0 1 10.5 8h8A1.5 1.5 0 0 1 20 9.5v8a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 9 17.5Z',
      'M15 8V6.5A1.5 1.5 0 0 0 13.5 5h-8A1.5 1.5 0 0 0 4 6.5v8A1.5 1.5 0 0 0 5.5 16H7',
    ],
  },
  sun: { d: [circle(12, 12, 3.8), 'M12 2.8v1.8M12 19.4v1.8M2.8 12h1.8M19.4 12h1.8M5.5 5.5l1.3 1.3M17.2 17.2l1.3 1.3M5.5 18.5l1.3-1.3M17.2 6.8l1.3-1.3'] },
  moon: { d: ['M19.6 14.6A8 8 0 0 1 9.4 4.4a8 8 0 1 0 10.2 10.2Z'] },
  contrast: { d: [circle(12, 12, 8.4), 'M12 3.6v16.8a8.4 8.4 0 0 0 0-16.8Z'] },
  star: { d: ['m12 3.6 2.6 5.4 5.9.8-4.3 4.1 1.1 5.9-5.3-2.9-5.3 2.9 1.1-5.9L3.5 9.8l5.9-.8Z'], filled: true },
  sparkle: { d: ['M12 3.2 13.6 9 19.4 10.6 13.6 12.2 12 18 10.4 12.2 4.6 10.6 10.4 9Z'], filled: true },
  bolt: { d: ['M13 2.8 5 13.4h6.2L10.6 21 19 10.4h-6.3L13 2.8Z'] },
  phone: { d: ['M6.2 3.8h3l1.5 3.7-1.9 1.3a11 11 0 0 0 5.4 5.4l1.3-1.9 3.7 1.5v3a1.7 1.7 0 0 1-1.9 1.7C9.5 17.7 6.3 14.5 4.5 5.7A1.7 1.7 0 0 1 6.2 3.8Z'] },
  mail: {
    d: ['M5.4 5.4h13.2a2.2 2.2 0 0 1 2.2 2.2v8.8a2.2 2.2 0 0 1-2.2 2.2H5.4a2.2 2.2 0 0 1-2.2-2.2V7.6a2.2 2.2 0 0 1 2.2-2.2Z', 'm3.8 7.2 8.2 5.6 8.2-5.6'],
  },
  store: { d: ['M4 9.6h16v9.2a1.6 1.6 0 0 1-1.6 1.6H5.6A1.6 1.6 0 0 1 4 18.8Z', 'M3.4 9.6 5 4.4h14l1.6 5.2', 'M9.6 20.4v-5.2h4.8v5.2'] },
  bike: { d: [circle(5.6, 16.8, 3.2), circle(18.4, 16.8, 3.2), 'M8.8 16.8h5.2l-2-8.2h-2.6', 'm14 8.6 3 .8 1.4 7.4'] },
  users: { d: [circle(9.4, 8.6, 3.4), 'M3.6 19.4a5.8 5.8 0 0 1 11.6 0', 'M16 5.6a3.4 3.4 0 0 1 0 6.6M17.4 14.6a5.8 5.8 0 0 1 3 4.8'] },
  chart: { d: ['M4 20h16', 'M6.6 20v-6M11 20V7.4M15.4 20v-8.4M19.8 20v-4'] },
  refresh: { d: ['M20.2 12a8.2 8.2 0 1 1-2.4-5.8', 'M20.4 4.2v4.6h-4.6'] },
  heart: { d: ['M12 20s-7.5-4.7-7.5-9.6A4.2 4.2 0 0 1 12 8a4.2 4.2 0 0 1 7.5 2.4C19.5 15.3 12 20 12 20Z'] },
  receipt: { d: ['M6 3.5h12v17l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4-2 1.4v-17Z', 'M9 8h6', 'M9 11.5h6', 'M9 15h3.5'] },

  /* brands */
  instagram: {
    d: [
      'M8.4 3.6h7.2a4.8 4.8 0 0 1 4.8 4.8v7.2a4.8 4.8 0 0 1-4.8 4.8H8.4a4.8 4.8 0 0 1-4.8-4.8V8.4a4.8 4.8 0 0 1 4.8-4.8Z',
      circle(12, 12, 3.9),
      'M16.8 7.2h.01',
    ],
  },
  apple: {
    filled: true,
    d: [
      'M16.4 12.7c0-2.4 2-3.6 2.05-3.65-1.1-1.65-2.85-1.85-3.5-1.9-1.5-.15-2.9.85-3.65.85s-1.9-.85-3.15-.8a4.65 4.65 0 0 0-3.9 2.4c-1.65 2.9-.45 7.2 1.2 9.55.8 1.15 1.75 2.45 3 2.4 1.2-.05 1.65-.8 3.1-.8s1.85.8 3.1.75c1.3 0 2.1-1.15 2.9-2.3a10 10 0 0 0 1.3-2.7 4.2 4.2 0 0 1-2.45-3.8ZM14 5.6A4.1 4.1 0 0 0 15 2.6a4.25 4.25 0 0 0-2.75 1.45A3.9 3.9 0 0 0 11.2 7 3.5 3.5 0 0 0 14 5.6Z',
    ],
  },
  play: {
    filled: true,
    d: ['M3.9 2.6a1.5 1.5 0 0 0-.7 1.3v16.2a1.5 1.5 0 0 0 .7 1.3l9-9.4Zm10.4 8.1 2.6-2.7-9.5-5.4Zm0 2.6-6.9 8.1 9.5-5.4Zm1.4-1.3 3.4-1.9c1-.6 1-1.8 0-2.4l-3.4-1.9-2.75 3.1Z'],
  },
};

export const iconNames = Object.keys(ICONS);

export default function Icon({
  name,
  size = 20,
  strokeWidth = 1.7,
  className,
  label,
  effect,
}: {
  name: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
  /** Only when the icon alone carries meaning, e.g. an icon button. */
  label?: string;
  effect?: 'draw' | 'bounce';
}) {
  const icon = ICONS[name] ?? { d: [circle(12, 12, 8.4)] };
  const filled = Boolean(icon.filled);
  const fx = effect === 'draw' && !filled ? 'sym-draw' : effect === 'bounce' ? 'sym-bounce' : '';

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={filled ? undefined : strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={[fx, className].filter(Boolean).join(' ') || undefined}
      style={{ width: size, height: size, flexShrink: 0 }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false">
      {label ? <title>{label}</title> : null}
      {icon.d.map((d, i) => (
        <path
          key={d}
          d={d}
          pathLength={fx === 'sym-draw' ? 1 : undefined}
          strokeDasharray={icon.dash?.includes(i) && fx !== 'sym-draw' ? '3 3' : undefined}
        />
      ))}
    </svg>
  );
}
