'use client';

/**
 * Registers the service worker (production only) and keeps hold of the
 * browser's install offer, which fires once, early, and is gone if nobody is
 * listening — InstallApp may mount long after it. The worker's URL carries
 * the deploy, so a new deploy replaces it and its caches.
 */
import { useEffect } from 'react';

type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> };
declare global {
  interface Window {
    __qlInstall?: InstallPrompt | null;
  }
}

export const INSTALL_EVENT = 'ql:installable';

export default function PwaRegister({ version }: { version: string }) {
  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      window.__qlInstall = e as InstallPrompt;
      window.dispatchEvent(new Event(INSTALL_EVENT));
    };
    const onInstalled = () => {
      window.__qlInstall = null;
      window.dispatchEvent(new Event(INSTALL_EVENT));
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);

    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      const register = () => navigator.serviceWorker.register(`/sw.js?v=${encodeURIComponent(version)}`).catch(() => {});
      if (document.readyState === 'complete') register();
      else window.addEventListener('load', register, { once: true });
    }
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, [version]);
  return null;
}
