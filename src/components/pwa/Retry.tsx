'use client';

import Icon from '@/components/ui/Icon';

export default function Retry({ label }: { label: string }) {
  return (
    <button type="button" onClick={() => window.location.reload()} className="btn btn-lg btn-primary">
      <Icon name="refresh" size={18} strokeWidth={2} />
      {label}
    </button>
  );
}
