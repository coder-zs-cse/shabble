'use client';

import { useEffect, useState } from 'react';

/** Matches Tailwind `lg` (1024px) */
export function useIsLgScreen() {
  const [isLg, setIsLg] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsLg(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return isLg;
}
