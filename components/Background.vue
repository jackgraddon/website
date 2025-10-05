<template>
  <div :class="background"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { timeWindows } from '~/utils/timeWindows';

/**
 * Determines the appropriate background class based on the given hour of the day.
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

const background = ref('');

onMounted(() => {
  const localHour = new Date().getHours();
  background.value = getTimeBasedBackground(localHour);
  console.log(`Background class set to: ${background.value}`);
});
</script>
