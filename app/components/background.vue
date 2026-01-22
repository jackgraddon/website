<script setup lang="ts">
// Get the current time to use for dynamic background effect
let now = new Date().getHours();

// Define background gradients based on time of day
let backgroundStyle;
backgroundStyle = computed(() => {
    if (now >= 6 && now < 12) {
        // Morning
        return 'linear-gradient(0deg, #46016b 0%, #c44d25 100%)';
    } else if (now >= 12 && now < 18) {
        // Afternoon
        return 'linear-gradient(0deg, #067bbb 0%, #aecfdb 100%)';
    } else if (now >= 18 && now < 21) {
        // Evening
        return 'linear-gradient(0deg, #ffb1b1 0%, #e2dabb 25%, #b8d6e4 40%, #2a6ca1 100%)';
    } else {
        // Night
        return 'linear-gradient(0deg, rgba(19, 0, 29, 1) 0%, rgba(51, 0, 79, 1) 100%)';
    }
});

// Update the background every hour
onMounted(() => {
    setInterval(() => {
        now = new Date().getHours();
        backgroundStyle = computed(() => {
            (now >= 6 && now < 12) ? 'linear-gradient(0deg, #46016b 0%, #c44d25 100%)' :
            (now >= 12 && now < 18) ? 'linear-gradient(0deg, #067bbb 0%, #aecfdb 100%)' :
            (now >= 18 && now < 21) ? 'linear-gradient(0deg, #ffb1b1 0%, #e2dabb 25%, #b8d6e4 40%, #2a6ca1 100%)' :
            'linear-gradient(0deg, rgba(19, 0, 29, 1) 0%, rgba(51, 0, 79, 1) 100%)';
        });
    }, 3600000);
});
</script>

<template>
    <div class="background" :style="{ background: backgroundStyle }"></div>
</template>

<style scoped>
.background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -999;
    background: var(--color-bg);
}
</style>