/**
 * Runs in <head>, before anything paints:
 *   · applies the visitor's appearance (light, dark, or the system's) so the
 *     page never flashes the wrong theme
 *   · applies ?nomotion (or localStorage.nomotion = '1'), which renders every
 *     entrance and reveal in its final state — for clean screenshots
 * <html> carries suppressHydrationWarning for the attributes it sets.
 */
export default function HeadScript({ fallback }: { fallback: string }) {
  const script = `(function(){try{var d=document.documentElement,s=localStorage.getItem('ql-theme')||${JSON.stringify(
    fallback,
  )};var m=window.matchMedia('(prefers-color-scheme: dark)');var r=s==='system'?(m.matches?'dark':'light'):s;d.setAttribute('data-theme',r);d.setAttribute('data-theme-choice',s);if(/[?&]nomotion(=|&|$)/.test(location.search)||localStorage.getItem('nomotion')==='1'){d.classList.add('no-motion')}}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
