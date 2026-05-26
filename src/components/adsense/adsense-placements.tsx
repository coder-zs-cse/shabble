'use client';

import { AdSenseUnit } from '@/components';
import { useIsLgScreen } from '@/hooks';
import {
  ADSENSE_SLOT_LEFT,
  ADSENSE_SLOT_RIGHT,
  ADSENSE_SLOT_MOBILE,
} from '@/constants';

export function DesktopAdLeft() {
  const isLg = useIsLgScreen();
  if (!ADSENSE_SLOT_LEFT || isLg !== true) return null;

  return (
    <AdSenseUnit slot={ADSENSE_SLOT_LEFT} className="w-full max-w-[160px]" />
  );
}

export function DesktopAdRight() {
  const isLg = useIsLgScreen();
  if (!ADSENSE_SLOT_RIGHT || isLg !== true) return null;

  return (
    <AdSenseUnit slot={ADSENSE_SLOT_RIGHT} className="w-full max-w-[160px]" />
  );
}

export function MobileAdBar() {
  const isLg = useIsLgScreen();
  if (!ADSENSE_SLOT_MOBILE || isLg !== false) return null;

  return (
    <AdSenseUnit
      slot={ADSENSE_SLOT_MOBILE}
      format="horizontal"
      className="w-full min-h-[50px]"
    />
  );
}
