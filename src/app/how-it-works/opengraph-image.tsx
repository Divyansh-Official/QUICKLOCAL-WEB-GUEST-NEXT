import { ogSize, pageOgAlt, pageOgCard } from '@/lib/og';

export const alt = pageOgAlt('howItWorks');
export const size = ogSize;
export const contentType = 'image/png';

export default function Image() {
  return pageOgCard('howItWorks');
}
