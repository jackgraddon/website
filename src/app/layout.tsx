import type { Metadata } from "next";
import "@/styles/globals.sass";

export const metadata: Metadata = {
  title: "Jack Graddon",
  description: "Jack Graddon's web portfolio",
};

const getTimeBasedBackground = () => {
  const hour = new Date().getHours();

  const time = {
    morning: 5,
    afternoon: 9,
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

const { background } = getTimeBasedBackground();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body>
      <div className={background}></div>
      {children}
    </body>
    </html>
  );
}
