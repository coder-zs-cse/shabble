import React from 'react';
import Script from 'next/script';
import { Metadata } from 'next';
import {
  DesktopAdLeft,
  DesktopAdRight,
} from '@/components/adsense/adsense-placements';
import { ADSENSE_CLIENT, ADSENSE_SLOT_MOBILE } from '@/constants';
import { canonicalUrl, SITE_DESCRIPTION, SITE_TITLE } from '@/lib/seo';
import { dailyLayout } from './layout.variants';

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: canonicalUrl('/daily'),
  },
};

function layout({ children }: { children: React.ReactNode }) {
  const { root, sidebar, main } = dailyLayout({
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
