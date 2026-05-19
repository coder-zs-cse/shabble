import type { Metadata } from "next";
import { ToastContainer } from 'react-toastify';
import { SessionProvider } from "@/components/providers/SessionProvider";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Shabble",
  description: "Shabble is a shape guessing game",
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
    <html lang="en">
      <body>
        <SessionProvider>
          <ToastContainer />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
