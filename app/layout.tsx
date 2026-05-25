import type { Metadata } from "next";
import { ToastContainer } from 'react-toastify';
import { ThemeProvider, ThemeScript } from '@/contexts';
import "@/styles/globals.css";
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: "Shabble",
  description: "Shabble is a shape guessing game",
  icons: {
    icon: '/favicon.ico',    // This will look for the file in the public directory
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
        <meta name="google-adsense-account" content="ca-pub-1399037640696384"></meta>
        <ThemeScript />
      </head>
      <body>
        <ThemeProvider>
          <ToastContainer />
          <Analytics />
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
