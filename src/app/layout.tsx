/**
 * Name: Layout
 * Description: Default Root Layout component for Next.js applications.
 * Author: Jack Graddon
 */

import "@/styles/globals.sass";
import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next";

// Components
import Footer from '@/components/site-footer/site-footer'
import Background from "@/components/backgorund/background";

// Set Metadata for root
export const metadata: Metadata = {
  title: "Jack Graddon",
  description: "Jack Graddon's web portfolio",
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body>
        <Background></Background>
        {children}
        <Footer></Footer>
        <SpeedInsights/>
        <Analytics/>
      </body>
    </html>
  );
}