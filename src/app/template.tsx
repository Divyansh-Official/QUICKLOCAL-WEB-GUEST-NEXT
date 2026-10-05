import PageTransition from '@/components/motion/PageTransition';
import { isEnabled } from '@/lib/data';

/* Remounted on every navigation, which lets a page rise in softly. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition enabled={isEnabled('pageTransitions')}>{children}</PageTransition>;
}
