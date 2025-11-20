<template>
  <div :class="$style.splash">
    <div
      ref="titleRef"
      :class="$style.splashTitle"
    >
      <h1 :class="$style.title">{{ title }}</h1>
      <p :class="$style.subtitle">{{ subtitle }}</p>
    </div>
    <div :class="$style.splashCloud">
      <!-- parallax cloud, transformed on scroll -->
      <div ref="cloudRef" :class="$style.splashCloudInner">
      <NuxtImg
        src="/images/splash-cloud.webp"
        width="1043"
        height="607"
        alt="A cloud, covering the width of the screen"
        loading="eager"
      />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, useCssModule } from 'vue';

/**
 * Interface representing the properties for the Splash component.
 */
interface SplashProps {
  title: string
  subtitle: string
}

defineProps<SplashProps>()

const titleRef = ref<HTMLElement | null>(null)
const cloudRef = ref<HTMLElement | null>(null)

// Parallax: throttle with requestAnimationFrame
let rafId: number | null = null
function onScroll() {
  if (rafId !== null) return
  rafId = requestAnimationFrame(() => {
    rafId = null
    if (!cloudRef.value) return
    // simple parallax: move cloud down at 20% of scrollY
    const offset = window.scrollY * 0.2
    cloudRef.value.style.transform = `translateY(${offset}px)`
  })
}

// CSS Modules mapping for adding the locally-scoped "is-entering" class
const css = useCssModule()
const enterClass = css['is-entering'] ?? css['isEntering'] ?? 'is-entering'

onMounted(() => {
  // small delay so initial styles are applied, then trigger the transition
  nextTick(() => requestAnimationFrame(() => {
    if (titleRef.value) titleRef.value.classList.add(enterClass)
  }))
  // attach scroll listener for parallax
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  if (rafId !== null) cancelAnimationFrame(rafId)
})
</script>

<style module>
.splash {
  width: 100vw;
  text-align: center;
  height: fit-content;
  position: relative;
}

@media screen and (max-width: 768px) {
  .splash {
    height: 100vh;
  }
}

.splashTitle {
  text-align: center;
  pointer-events: none;
  align-content: end;
  /* start slightly offset, blurred and transparent; the JS will add .is-entering to trigger the transition */
  transform: translate(-50%, -50%) translateY(20px);
  filter: blur(6px);
  opacity: 0;
  position: fixed;
  left: 50%;
  top: 45%;
  transition: transform 0.8s ease, opacity 0.8s ease, filter 0.8s ease;
}

.splashTitle.is-entering {
  transform: translate(-50%, -50%) translateY(0);
  filter: blur(0);
  opacity: 1;
}

.splashCloud {
  overflow: hidden;
  width: 100vw;
  height: auto;
  margin: 45vh 0 0;
}

@media screen and (max-width: 768px) {
  .splashCloud {
    height: 100%;
  }
}

.splashCloud img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.splashCloudInner {
  will-change: transform;
}

.title {
  font-size: 4rem !important;
  line-height: 1;
}

.subtitle {
  font-size: 1.5rem !important;
  font-style: italic;
}

/* Scroll Button */
.scroll {
  color: white;
  background: linear-gradient(to right, rgba(255, 255, 255, 0.5) 0, white 10%, rgba(255, 255, 255, 0.5) 20%);
  background-position: 0;
  background-clip: text;
  background-color: rgba(255, 255, 255, 0.5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shine 3s infinite linear;
  animation-fill-mode: forwards;
  -webkit-text-size-adjust: none;
  font-weight: 600;
  font-size: smaller;
  white-space: nowrap;
}

@keyframes shine {
  from { background-position: 0; }
  to { background-position: 77px; }
}
</style>
