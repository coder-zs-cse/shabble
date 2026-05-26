import React from 'react';
import Script from 'next/script';
import { Metadata } from 'next';
import {
  DesktopAdLeft,
  DesktopAdRight,
} from '@/components/adsense/adsense-placements';
import { ADSENSE_CLIENT, ADSENSE_SLOT_MOBILE } from '@/constants';
import { dailyLayout } from './layout.variants';

export const metadata: Metadata = {
  title: 'Shabble',
  description:
    'Shabble is a shape guessing puzzle game. Play daily to get a new shape to guess. Solve with as less attempts as possible.',
};

function layout({ children }: { children: React.ReactNode }) {
  const { root, sidebar, main, mobileBar } = dailyLayout({
    mobileAd: Boolean(ADSENSE_SLOT_MOBILE),
  });

  return (
    <>
      {ADSENSE_CLIENT ? (
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      ) : null}

      <div className={root()}>
        <aside className={sidebar()} aria-label="Advertisement">
          <DesktopAdLeft />
        </aside>

        <main className={main()}>{children}</main>

        <aside className={sidebar()} aria-label="Advertisement">
          <DesktopAdRight />
        </aside>

        {/* {ADSENSE_SLOT_MOBILE ? (
          <div className={mobileBar()} aria-label="Advertisement">
            <MobileAdBar />
          </div>
        ) : null} */}
      </div>
    </>
  );
}

export default layout;
