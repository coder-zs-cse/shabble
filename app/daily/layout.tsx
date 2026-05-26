import React from 'react';
import Script from 'next/script';
import { Metadata } from 'next';
import {
  DesktopAdLeft,
  DesktopAdRight,
} from '@/components/adsense/adsense-placements';
import { ADSENSE_CLIENT } from '@/constants';

export const metadata: Metadata = {
  title: 'Shabble',
  description:
    'Shabble is a shape guessing puzzle game. Play daily to get a new shape to guess. Solve with as less attempts as possible.',
};

function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      <div className="w-screen min-h-screen bg-gray-200 flex flex-col lg:flex-row">
        <DesktopAdLeft />

        <main className="relative w-full lg:w-[730px] lg:max-w-[730px] lg:flex-shrink-0 min-h-screen flex flex-col bg-white pb-28 lg:pb-0">
          {children}
        </main>

        <DesktopAdRight />

        {/* <MobileAdBar /> */}
      </div>
    </>
  );
}

export default layout;
