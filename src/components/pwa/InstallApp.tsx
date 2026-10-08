'use client';

/**
 * "Put QuickLocal on your home screen." Shown only where it can work: an
 * Install button where the browser offers installation (Chrome, Edge,
 * Samsung Internet), the two Safari steps on iPhone and iPad, and a quiet
 * confirmation once installed. Anywhere else it renders nothing.
 */
import { useEffect, useState } from 'react';
import Icon from '@/components/ui/Icon';
import { INSTALL_EVENT } from './PwaRegister';

type Copy = { title: string; text: string; button: string; iosTitle: string; iosSteps: string; installed: string; note: string };
type Mode = 'none' | 'prompt' | 'ios' | 'installed';

function detect(): Mode {
  const standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
  if (standalone) return 'installed';
  if (window.__qlInstall) return 'prompt';
  const ua = navigator.userAgent;
  const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  return ios ? 'ios' : 'none';
}

export default function InstallApp({ copy, compact = false }: { copy: Copy; compact?: boolean }) {
  const [mode, setMode] = useState<Mode>('none');

  useEffect(() => {
    const update = () => setMode(detect());
    const frame = requestAnimationFrame(update);
    window.addEventListener(INSTALL_EVENT, update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener(INSTALL_EVENT, update);
    };
  }, []);

  if (mode === 'none') return null;

  const install = async () => {
    const offer = window.__qlInstall;
    if (!offer) return;
    await offer.prompt();
    const { outcome } = await offer.userChoice;
    window.__qlInstall = null;
    setMode(outcome === 'accepted' ? 'installed' : 'none');
  };

  if (compact) {
    if (mode === 'installed') return null;
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-[color-mix(in_oklab,var(--primary)_9%,transparent)] p-3">
        <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-primary text-white">
          <Icon name="square-plus" size={19} strokeWidth={2} />
        </span>
        <span className="min-w-0 flex-1 text-[13px] leading-snug text-fg-2">
          <span className="block font-bold text-fg">{copy.title}</span>
          {mode === 'ios' ? copy.iosSteps : null}
        </span>
        {mode === 'prompt' ? (
          <button type="button" onClick={install} className="btn btn-sm btn-primary flex-none">
            {copy.button}
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="glass glass-raised flex flex-col gap-4 rounded-[var(--radius-card)] p-5 text-left sm:flex-row sm:items-center sm:gap-5 sm:p-6">
      <span className="grid h-14 w-14 flex-none place-items-center rounded-[18px] bg-[linear-gradient(150deg,#f7a552,#e0721a)] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.4),0_10px_24px_-10px_rgb(240_134_38/0.8)]">
        <Icon name={mode === 'installed' ? 'check' : 'square-plus'} size={26} strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[17px] font-extrabold tracking-[-0.02em] text-fg">{mode === 'installed' ? copy.installed : copy.title}</p>
        <p className="mt-1 text-[14px] leading-relaxed text-fg-2">
          {mode === 'ios' ? (
            <>
              <span className="font-bold text-fg">{copy.iosTitle}: </span>
              {copy.iosSteps}
            </>
          ) : (
            copy.text
          )}
        </p>
        <p className="mt-1.5 text-[12.5px] text-fg-3">{copy.note}</p>
      </div>
      {mode === 'prompt' ? (
        <button type="button" onClick={install} className="btn btn-md btn-primary flex-none">
          <Icon name="download" size={17} strokeWidth={2} />
          {copy.button}
        </button>
      ) : null}
    </div>
  );
}
