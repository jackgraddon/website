
"use client";

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

export default function Background() {
  // Determine the local hour
  const localHour = new Date().getHours();
  // Set the background class based on the local hour
  const { background } =  getTimeBasedBackground(localHour);

  return (
    <div className={background}></div>
  );
}