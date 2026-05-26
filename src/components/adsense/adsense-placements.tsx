'use client';

import { AdSenseUnit } from './adsense-unit';
import { useIsLgScreen } from './use-media-query';
import {
  ADSENSE_SLOT_LEFT,
  ADSENSE_SLOT_RIGHT,
  ADSENSE_SLOT_MOBILE,
} from '@/constants/adsense/adsense';

export function DesktopAdLeft() {
  const isLg = useIsLgScreen();
  if (isLg !== true || !ADSENSE_SLOT_LEFT) return null;

  return (
    <aside
      className="flex flex-1 min-w-[120px] items-center justify-center p-4"
      aria-label="Advertisement"
    >
      <AdSenseUnit slot={ADSENSE_SLOT_LEFT} className="w-full max-w-[160px]" />
    </aside>
  );
}

export function DesktopAdRight() {
  const isLg = useIsLgScreen();
  if (isLg !== true || !ADSENSE_SLOT_RIGHT) return null;

  return (
    <aside
      className="flex flex-1 min-w-[120px] items-center justify-center p-4"
      aria-label="Advertisement"
    >
      <AdSenseUnit slot={ADSENSE_SLOT_RIGHT} className="w-full max-w-[160px]" />
    </aside>
  );
}

export function MobileAdBar() {
  const isLg = useIsLgScreen();
  if (isLg !== false || !ADSENSE_SLOT_MOBILE) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-20 bg-gray-200 border-t border-gray-300 px-2 py-2"
      aria-label="Advertisement"
    >
      <AdSenseUnit
        slot={ADSENSE_SLOT_MOBILE}
        format="horizontal"
        className="w-full min-h-[50px]"
      />
    </div>
  );
}
