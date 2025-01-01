
"use client";

import { useEffect, useState } from "react";
import { timeWindows} from "@/utils/timeWindows";

/**
 * Determines the appropriate background class based on the given hour of the day.
 *
 * @param {number} hour - The current hour in 24-hour format (0-23).
 * @returns {string} - The background class name.
 * The class name corresponds to the time of day:
 * - 'background-morning'
 * - 'background-afternoon'
 * - 'background-evening'
 * - 'background-night'
 */
const getTimeBasedBackground = (hour: number) => {
  if (hour >= timeWindows.morning && hour < timeWindows.afternoon) {
    return 'background-morning';
  } else if (hour >= timeWindows.afternoon && hour < timeWindows.evening) {
    return 'background-afternoon';
  } else if (hour >= timeWindows.evening && hour < timeWindows.night) {
    return 'background-evening';
  } else {
    return 'background-night';
  }
};

export default function Background() {

  const [background, setBackground] = useState('');

  useEffect(() => {
    const localHour = new Date().getHours();
    setBackground(getTimeBasedBackground(localHour));
    console.log(`Background class set to: ${background}`);
  }, [background]);

  return (
    <div className={background}></div>
  );
}