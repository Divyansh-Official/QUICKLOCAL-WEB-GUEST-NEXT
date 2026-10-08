import { ogSize, pageOgAlt, pageOgCard } from '@/lib/og';

export const alt = pageOgAlt('getTheApp');
export const size = ogSize;
export const contentType = 'image/png';

export default function Image() {
  return pageOgCard('getTheApp');
}
