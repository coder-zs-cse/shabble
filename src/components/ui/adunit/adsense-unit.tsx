'use client';

import { useEffect, useRef } from 'react';
import { ADSENSE_CLIENT } from '@/constants/adsense/adsense';

declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
  }
}

type AdSenseFormat = 'auto' | 'horizontal' | 'rectangle' | 'vertical';

type AdSenseUnitProps = {
  slot: string;
  format?: AdSenseFormat;
  fullWidthResponsive?: boolean;
  className?: string;
};

export default function AdSenseUnit({
  slot,
  format = 'auto',
  fullWidthResponsive = true,
  className = '',
}: AdSenseUnitProps) {
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const enabled = Boolean(slot && ADSENSE_CLIENT);

  useEffect(() => {
    if (!enabled) return;
    const el = insRef.current;
    if (!el) return;

    const tryPush = () => {
      if (pushed.current || el.offsetWidth === 0) return;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch (error) {
        console.error('AdSense failed to load', error);
      }
    };

    tryPush();

    const observer = new ResizeObserver(() => tryPush());
    observer.observe(el);

    return () => observer.disconnect();
  }, [enabled]);

  if (!enabled) return null;

  return (
    <ins
      ref={insRef}
      className={`adsbygoogle ${className}`.trim()}
      style={{ display: 'block', minWidth: 1 }}
      data-ad-client={ADSENSE_CLIENT}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
    />
  );
}
