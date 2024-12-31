/**
 * Name: Layout
 * Description: Default Root Layout component for Next.js applications.
 * Author: Jack Graddon
 */

import type { Metadata } from "next";
import "@/styles/globals.sass";
import { headers} from "next/headers";

// Components
import Footer from '@/components/site-footer/site-footer'

export const metadata: Metadata = {
  title: "Jack Graddon",
  description: "Jack Graddon's web portfolio",
};

const getTimeBasedBackground = (hour: number) => {
  // Define time windows
  const time = {
    morning: 6,
    afternoon: 12,
    evening: 18,
    night: 22,
  };

  if (hour >= time.morning && hour < time.afternoon) {
    return {
      background: 'background-morning',
    };
  } else if (hour >= time.afternoon && hour < time.evening) {
    return {
      background: 'background-afternoon',
    };
  } else if (hour >= time.evening && hour < time.night) {
    return {
      background: 'background-evening',
    };
  } else {
    return {
      background: 'background-night',
    };
  }
};

export default async function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
  // Retrieve timezone header (if available) from the client
  const headersList = await headers();
  const timezone = headersList.get('x-timezone') || 'UTC'; // Default to UTC if timezone header is not available

  // Use the timezone to determine the local hour
  const localHour = new Date().getHours() + (timezone === 'UTC' ? 0 : timezone === 'GMT+1' ? -1 : 1);

  // Set the backgorund class based on the local hour
  const { background } =  getTimeBasedBackground(localHour);

  return (
    <html lang="en">
    <body>
      <div className={background}></div>
      {children}
      <Footer></Footer>
    </body>
    </html>
  );
}