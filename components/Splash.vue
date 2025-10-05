<template>
  <div :class="$style.splash">
    <div 
      :class="$style.splashTitle"
      v-motion
      :initial="{ opacity: 1, filter: 'blur(0px)', transform: 'translate(-50%, -50%) scale(1)' }"
      :style="{ opacity: opacity, filter: filter, transform: transform }"
    >
      <h1 :class="$style.title">{{ title }}</h1>
      <p :class="$style.subtitle">{{ subtitle }}</p>
    </div>
    <div :class="$style.splashCloud">
      <NuxtImg
        src="/components/splash/splash-cloud.webp"
        width="1043"
        height="607"
        alt="A cloud, covering the width of the screen"
        loading="eager"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useWindowScroll } from '@vueuse/core';

/**
 * Interface representing the properties for the Splash component.
 */
interface SplashProps {
  title: string;
  subtitle: string;
}

const props = defineProps<SplashProps>();

const { y: scrollY } = useWindowScroll();

// Easing function
const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

// Transform scroll position to normalized value
const yRange = computed(() => {
  const progress = Math.min(Math.max(scrollY.value / 500, 0), 1);
  return easeInOut(progress);
});

const opacity = computed(() => 1 - yRange.value);
const filter = computed(() => `blur(${yRange.value * 10}px)`);
const scale = computed(() => 1 - yRange.value * 0.1);
const y = computed(() => -50 - yRange.value * 50);
const transform = computed(() => `translate(-50%, ${y.value}%) scale(${scale.value})`);
</script>

<style module lang="sass" src="./splash.module.sass"></style>
