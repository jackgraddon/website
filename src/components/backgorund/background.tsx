
"use client";

import { useEffect, useState } from "react";

/**
 * Determines the appropriate background class based on the given hour of the day.
 *
 * @param {number} hour - The current hour in 24-hour format (0-23).
 * @returns {Object} An object containing the background class name.
 * The class name corresponds to the time of day:
 * - 'background-morning' for hours between 6 and 12
 * - 'background-afternoon' for hours between 12 and 18
 * - 'background-evening' for hours between 18 and 22
 * - 'background-night' for hours outside these ranges
 */
const getTimeBasedBackground = (hour: number) => {
  // Define time windows
  const time = {
    morning: 6,
    afternoon: 12,
    evening: 18,
    night: 22,
  };

  console.log("Current hour: ", hour);

  if (hour >= time.morning && hour < time.afternoon) {
    console.log('Setting background to morning');
    return {
      background: 'background-morning',
    };
  } else if (hour >= time.afternoon && hour < time.evening) {
    console.log('Setting background to afternoon');
    return {
      background: 'background-afternoon',
    };
  } else if (hour >= time.evening && hour < time.night) {
    console.log('Setting background to evening');
    return {
      background: 'background-evening',
    };
  } else {
    console.log('Setting background to night');
    return {
      background: 'background-night',
    };
  }
};

export default function Background() {

  const [background, setBackground] = useState('');

  useEffect(() => {
    const localHour = new Date().getHours();
    const backgroundClass = getTimeBasedBackground(localHour).background;
    setBackground(backgroundClass);
  }, []);

  return (
    <div className={background}></div>
  );
}