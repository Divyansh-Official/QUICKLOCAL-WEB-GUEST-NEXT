import { ogSize, pageOgAlt, pageOgCard } from '@/lib/og';

export const alt = pageOgAlt('app');
export const size = ogSize;
export const contentType = 'image/png';

export default function Image() {
  return pageOgCard('app');
}
