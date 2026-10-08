import { ogSize, pageOgAlt, pageOgCard } from '@/lib/og';

export const alt = pageOgAlt('about');
export const size = ogSize;
export const contentType = 'image/png';

export default function Image() {
  return pageOgCard('about');
}
