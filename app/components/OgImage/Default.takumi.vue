<script setup lang="ts">
// Define props matching your page metadata structure
defineProps<{
  title?: string
  subtitle?: string
  iconName?: string
}>()
</script>

<template>
  <div class="og-hero-container">
    <div class="hero-content">
      <h1 class="hero-title">
        {{ title || 'Jack Graddon' }}
      </h1>
      <p v-if="subtitle" class="hero-subtitle">
        {{ subtitle }}
      </p>
    </div>

    <img 
      src="/images/splash-cloud.webp" 
      class="splash-cloud" 
      alt=""
    />
  </div>
</template>

<style scoped>
.og-hero-container {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  background: linear-gradient(0deg, hsl(201, 74%, 38%) 0%, hsl(196, 28%, 77%) 100%);
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  z-index: 20;
  padding: 15vh 0vw;
}

.hero-title {
  font-family: 'Sunflower', serif;
  line-height: 1;
  font-size: 7rem;
  color: rgba(255, 255, 255, 1);
}

.hero-subtitle {
  font-family: 'Outfit', sans-serif;
  font-size: 3rem;
  line-height: 1;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0;
}

.splash-cloud {
  position: absolute;
  bottom: 0;
  left: 0;
  transform: translateY(40%);
  width: 100%;
  object-fit: cover;
  z-index: 10;
  opacity: 0.95;
}
</style>