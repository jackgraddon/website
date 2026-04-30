<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const now = ref(new Date().getHours());
// now.value = 12;

const img = useImage();

const optimizedStarryUrl = computed(() => {
    return img('/images/starrysky.webp', { format: 'webp', quality: 80, width: 1920 });
});

useHead({
    link: [
        {
            rel: 'preload',
            as: 'image',
            href: optimizedStarryUrl.value,
        },
    ],
});

const backgroundGradient = computed(() => {
    if (now.value >= 6 && now.value < 10) {
        return 'linear-gradient(0deg, #46016b 0%, #c44d25 100%)';
    } else if (now.value >= 10 && now.value < 18) {
        return 'linear-gradient(0deg, #067bbb 0%, #aecfdb 100%)';
    } else if (now.value >= 18 && now.value < 21) {
        return 'linear-gradient(0deg, #ffb1b1 0%, #e2dabb 25%, #b8d6e4 40%, #2a6ca1 100%)';
    } else {
        return 'linear-gradient(0deg, rgba(19, 0, 29, 1) 0%, rgba(51, 0, 79, 1) 100%)';
    }
});

// 1 = light/warm background needs dark cards, 0 = dark background needs light cards
const isLightBackground = computed(() => {
    return (now.value >= 6 && now.value < 10) || (now.value >= 18 && now.value < 21) ? 1 : 0;
});

function applyRootVars() {
    document.documentElement.style.setProperty('--bg-is-light', String(isLightBackground.value));
}

let timeInterval: ReturnType<typeof setInterval>;

onMounted(() => {
    applyRootVars();
    timeInterval = setInterval(() => {
        now.value = new Date().getHours();
        applyRootVars();
    }, 3600000); // Check every hour
});

// Clean up the interval when the component is destroyed
onUnmounted(() => {
    clearInterval(timeInterval);
});
</script>

<template>
    <div 
  class="background" 
  :style="{ 
    backgroundImage: (now >= 18 || now < 6) 
      ? `url('${optimizedStarryUrl}'), ${backgroundGradient}` 
      : backgroundGradient 
  }"
></div>
</template>

<style scoped>
.background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -999;
    background-size: cover;
    background-position: center;
    background-blend-mode: screen, normal;
}
</style>