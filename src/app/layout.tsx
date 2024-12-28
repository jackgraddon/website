import type { Metadata } from "next";
import "@/styles/globals.sass";
// import axios from 'axios';

export const metadata: Metadata = {
  title: "Jack Graddon",
  description: "Jack Graddon's web portfolio",
};

const getTimeBasedBackground = () => {
  // Get the current hour
  const hour = new Date().getHours();

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

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
  const { background } =  getTimeBasedBackground();
  console.log(background);
  return (
    <html lang="en">
    <body>
      <div className={background}></div>
      {children}
    </body>
    </html>
  );
}
