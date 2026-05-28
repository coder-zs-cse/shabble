import type { Metadata } from "next";
import { ToastContainer } from 'react-toastify';
import { ThemeProvider, ThemeScript } from '@/contexts';
import "@/styles/globals.css";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ADSENSE_CLIENT } from "@/constants";
import {
  appJsonLd,
  canonicalUrl,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  category: "game",
  alternates: {
    canonical: canonicalUrl('/daily'),
  },
  openGraph: {
    type: "website",
    url: canonicalUrl('/daily'),
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content={ADSENSE_CLIENT}></meta>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
        />
        <ThemeScript />
      </head>
      <body>
        <ThemeProvider>
          <ToastContainer />
          <Analytics />
          <SpeedInsights />
          {children}
        </ThemeProvider>
      </body>
      {/* <script defer src="https://usa.kenyt.ai/botapp/ChatbotUI/dist/js/bot-loader.js" type="text/javascript" data-bot="188903092"></script> */}
      {/* <script defer src="https://www.kenyt.ai/botapp/ChatbotUI/dist/js/bot-loader.js" type="text/javascript" data-bot="111651938"></script> */}
      {/* <script defer src/="https://lark-actual-finally.ngrok-free.app/botapp/ChatbotUI/dist/js/bot-loader.js" type="text/javascript" data-bot="113711041"></script> */}
      {/* <script defer src="https://usa.kenyt.ai/botapp/ChatbotUI/dist/js/bot-loader.js" type="text/javascript" data-bot="117195617"></script> */}
      {/* <script defer src="https://www.kenyt.ai/botapp/ChatbotUI/dist/js/bot-loader.js" type="text/javascript" data-bot="112709652"></script> */}
    </html>
  );
}
