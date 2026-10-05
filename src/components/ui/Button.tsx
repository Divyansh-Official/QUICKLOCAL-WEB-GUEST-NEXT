import Link from 'next/link';
import type { ReactNode } from 'react';
import Icon from './Icon';

/* Literal class names, so Tailwind's scan keeps every variant. */
const VARIANTS = {
  primary: 'btn-primary',
  dark: 'btn-dark',
  light: 'btn-light',
  glass: 'btn-glass',
  outline: 'btn-outline',
} as const;
const SIZES = { sm: 'btn-sm', md: 'btn-md', lg: 'btn-lg' } as const;

/**
 * The pill button. A raised key in tangerine by default; glass, dark, light
 * and outline beside it. Internal paths use next/link, tel:/mailto:/http are
 * plain anchors (http opens a new tab). Pressing squishes it on a spring.
 * A trailing `icon` that is an arrow nudges forward on hover.
 */
export default function Button({
  href,
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconStart,
  block = false,
  className = '',
  type = 'button',
  onClick,
  ariaLabel,
  disabled,
}: {
  href?: string;
  children: ReactNode;
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  icon?: string;
  iconStart?: string;
  block?: boolean;
  className?: string;
  type?: 'button' | 'submit';
  onClick?: () => void;
  ariaLabel?: string;
  disabled?: boolean;
}) {
  const cls = ['btn', SIZES[size], VARIANTS[variant], block ? 'btn-block' : '', className].filter(Boolean).join(' ');
  const iconSize = size === 'sm' ? 15 : size === 'lg' ? 19 : 17;
  const inner = (
    <>
      {iconStart ? <Icon name={iconStart} size={iconSize} strokeWidth={1.9} /> : null}
      <span>{children}</span>
      {icon ? (
        <Icon name={icon} size={iconSize} strokeWidth={1.9} className={icon.startsWith('arrow') || icon.startsWith('chevron') ? 'btn-arrow' : undefined} />
      ) : null}
    </>
  );

  if (href) {
    if (/^(https?:|tel:|mailto:)/.test(href)) {
      const external = href.startsWith('http');
      return (
        <a href={href} className={cls} aria-label={ariaLabel} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} aria-label={ariaLabel}>
        {inner}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls} aria-label={ariaLabel} disabled={disabled}>
      {inner}
    </button>
  );
}
