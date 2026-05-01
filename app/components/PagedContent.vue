<script setup lang="ts">
import { motion, useScroll, useTransform, useSpring } from 'motion-v'

const targetRef = ref<HTMLElement | null>(null)
const wrapperRef = ref<any>(null)
const sectionCount = ref(0)

onMounted(async () => {
  await nextTick()
  const el = wrapperRef.value?.$el || wrapperRef.value
  if (el && el.children) {
    sectionCount.value = el.children.length
  }
})

const { scrollYProgress } = useScroll({
  target: targetRef,
  offset: ["start start", "end end"]
})

const smoothProgress = useSpring(scrollYProgress, {
  stiffness: 100,
  damping: 40,
  restDelta: 0.0001
})

function calculateYOffset(val: number, n: number, multiplier: number = 1) {
  if (n <= 1) return 0
  
  const clampedIndex = Math.min(Math.floor(val * n), n - 1)
  const localProgress = (val - (clampedIndex / n)) * n
  
  const driftEnd = 0.70 
  const maxDrift = 12   
  
  let yOffset = clampedIndex * 100 
  
  if (clampedIndex === n - 1) {
    const t = localProgress
    const easeOutWithMomentum = t * (2 - t) 
    yOffset += easeOutWithMomentum * maxDrift
  } 
  else {
    if (localProgress <= driftEnd) {
      const driftPcnt = localProgress / driftEnd
      yOffset += driftPcnt * maxDrift
    } else {
      const flyPcnt = (localProgress - driftEnd) / (1 - driftEnd)
      const easedFly = Math.pow(flyPcnt, 3) 
      yOffset += maxDrift + (easedFly * (100 - maxDrift))
    }
  }
  
  return yOffset * multiplier
}

const y = useTransform(smoothProgress, (val) => {
  return `-${calculateYOffset(val, sectionCount.value)}vh`
})

const yBgClouds = useTransform(smoothProgress, (val) => {
  return `-${calculateYOffset(val, sectionCount.value, 0.6)}vh`
})

const yFgClouds = useTransform(smoothProgress, (val) => {
  return `-${calculateYOffset(val, sectionCount.value, 1.5)}vh`
})

const getCloudSrc = (index: number) => {
  const num = (index % 3) + 1;
  return `/images/clouds/cloud-00${num}.webp`;
}

const bgClouds = ref<any[]>([])
const mdClouds = ref<any[]>([])
const fgClouds = ref<any[]>([])

watch(sectionCount, (n) => {
  const bg = []
  const md = []
  const fg = []

  for (let i = 1; i < n; i++) {
    bg.push({
      id: `bg-${i}-1`,
      src: getCloudSrc(i * 3),
      style: {
        top: `${i * 60 - 20}vh`,
        left: `${(i % 2 === 0) ? -5 : -10}vw`,
        width: '120vw',
        opacity: 0.3,
        filter: 'blur(6px)',
        animationDelay: `${i * 0.5}s`
      }
    })
    bg.push({
      id: `bg-${i}-2`,
      src: getCloudSrc(i * 3 + 1),
      style: {
        top: `${i * 60 + 60}vh`,
        right: `${(i % 2 === 0) ? -10 : -5}vw`,
        width: '115vw',
        opacity: 0.2,
        filter: 'blur(8px)',
        animationDelay: `${i * 0.7}s`
      }
    })

    md.push({
      id: `md-${i}-1`,
      src: getCloudSrc(i * 3 + 2),
      style: {
        top: `${i * 100 - 40}vh`,
        left: `${(i % 2 === 0) ? -5 : -10}vw`,
        width: '125vw',
        opacity: 0.6,
        filter: 'none',
        animationDelay: `${i * 0.2}s`
      }
    })
    md.push({
      id: `md-${i}-2`,
      src: getCloudSrc(i * 3 + 3),
      style: {
        top: `${i * 100 + 60}vh`,
        right: `${(i % 2 === 0) ? -10 : -5}vw`,
        width: '130vw',
        opacity: 0.7,
        filter: 'none',
        animationDelay: `${i * 0.9}s`
      }
    })

    fg.push({
      id: `fg-${i}-1`,
      src: getCloudSrc(i * 3 + 4),
      style: {
        top: `${i * 150 - 50}vh`,
        left: `${(i % 2 === 0) ? -10 : -15}vw`,
        width: '135vw',
        opacity: 0.8,
        filter: 'blur(8px)',
        animationDelay: `${i * 0.1}s`
      }
    })
    fg.push({
      id: `fg-${i}-2`,
      src: getCloudSrc(i * 3 + 5),
      style: {
        top: `${i * 150 + 60}vh`,
        right: `${(i % 2 === 0) ? -15 : -10}vw`,
        width: '140vw',
        opacity: 0.9,
        filter: 'blur(6px)',
        animationDelay: `${i * 0.4}s`
      }
    })
  }

  // Add "outro" clouds to transition smoothly to the footer
  if (n > 1) {
    bg.push({
      id: 'bg-outro',
      src: getCloudSrc(n * 3),
      style: {
        top: `${(n - 1) * 60 + 80}vh`,
        left: '-10vw',
        width: '130vw',
        opacity: 0.2,
        filter: 'none',
        animationDelay: '0s'
      }
    })
    fg.push({
      id: 'fg-outro',
      src: getCloudSrc(n * 3 + 1),
      style: {
        top: `${(n - 1) * 150 + 100}vh`,
        right: '-15vw',
        width: '150vw',
        opacity: 0.4,
        filter: 'blur(12px)',
        animationDelay: '0s'
      }
    })
  }

  bgClouds.value = bg
  mdClouds.value = md
  fgClouds.value = fg
}, { immediate: true })

const currentPage = ref(0)

// Throttle currentPage updates to one per animation frame
let _progressRafId = 0
smoothProgress.on('change', (val) => {
  if (_progressRafId) return
  _progressRafId = requestAnimationFrame(() => {
    _progressRafId = 0
    if (sectionCount.value > 0) {
      currentPage.value = Math.min(
        Math.floor(val * sectionCount.value + 0.1),
        sectionCount.value - 1
      )
    }
  })
})

const scrollToPage = (index: number) => {
  if (!targetRef.value) return
  
  const totalHeight = sectionCount.value * 180
  const vh = window.innerHeight / 100
  const totalPx = totalHeight * vh
  const viewportPx = window.innerHeight
  
  const targetVal = index / sectionCount.value
  const targetScroll = targetVal * (totalPx - viewportPx)
  
  const top = targetRef.value.offsetTop + targetScroll
  window.scrollTo({
    top,
    behavior: 'smooth'
  })
}

const nextPage = () => {
  if (currentPage.value < sectionCount.value - 1) {
    scrollToPage(currentPage.value + 1)
  }
}

const prevPage = () => {
  if (currentPage.value > 0) {
    scrollToPage(currentPage.value - 1)
  }
}
</script>

<template>
  <div 
    class="scroll-track" 
    ref="targetRef" 
    :style="{ height: sectionCount > 0 ? `${sectionCount * 180}vh` : '100vh' }"
  >
    <div class="sticky-window">
      <!-- Background Clouds -->
      <motion.div class="clouds-wrapper bg-clouds" :style="{ y: yBgClouds }">
        <img v-for="c in bgClouds" :key="c.id" :src="c.src" :style="c.style" class="cloud" alt="" aria-hidden="true" loading="lazy" />
      </motion.div>

      <!-- Mid Clouds -->
      <motion.div class="clouds-wrapper md-clouds" :style="{ y }">
        <img v-for="c in mdClouds" :key="c.id" :src="c.src" :style="c.style" class="cloud" alt="" aria-hidden="true" loading="lazy" />
      </motion.div>

      <motion.div
        class="sections-wrapper"
        ref="wrapperRef"
        :style="{ y }"
      >
        <slot />
      </motion.div>

      <!-- Foreground Clouds -->
      <motion.div class="clouds-wrapper fg-clouds" :style="{ y: yFgClouds }">
        <img v-for="c in fgClouds" :key="c.id" :src="c.src" :style="c.style" class="cloud" alt="" aria-hidden="true" loading="lazy" />
      </motion.div>

      <!-- UI Overlays -->
      <div class="ui-overlay">
        <!-- Page Indicators -->
        <div class="page-indicators" v-if="sectionCount > 1">
          <button 
            v-for="i in sectionCount" 
            :key="i"
            class="dot-btn"
            :class="{ active: currentPage === i - 1 }"
            @click="scrollToPage(i - 1)"
            :aria-label="`Go to page ${i}`"
          >
            <span class="dot-inner"></span>
          </button>
        </div>

        <!-- Previous Page Hint -->
        <transition name="fade-down">
          <Button 
            v-if="currentPage > 0"
            class="scroll-hint top"
            @click="prevPage"
            variant="glass"
          >
            Previous Page
          </Button>
        </transition>

        <!-- Next Page Hint -->
        <transition name="fade-up">
          <Button 
            v-if="currentPage < sectionCount - 1"
            class="scroll-hint bottom"
            @click="nextPage"
            variant="glass"
          >
            Next Page
          </Button>
        </transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scroll-track {
  position: relative;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-top: -3rem;
  margin-bottom: -3rem;
}

.sticky-window {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
}

.clouds-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  will-change: transform;
  contain: layout style;
}

.bg-clouds {
  z-index: 0;
}

.md-clouds {
  z-index: 5;
}

.fg-clouds {
  z-index: 20;
}

.cloud {
  position: absolute;
  pointer-events: none;
}

.sections-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  will-change: transform;
  position: relative;
  z-index: 10;
}

:deep(section) {
  height: 100vh;
  width: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0 10%;
  box-sizing: border-box;
  contain: layout;
  content-visibility: auto;
}

.ui-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 30;
}

.page-indicators {
  position: absolute;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  pointer-events: auto;
}

.dot-btn {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  color: white;
  transition: all 0.3s ease;
}

.dot-inner {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.4);
  transition: all 0.3s ease;
}

.dot-label {
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.3s ease;
  white-space: nowrap;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.dot-btn:hover .dot-label {
  opacity: 1;
  transform: translateX(0);
}

.dot-btn:hover .dot-inner {
  border-color: white;
  transform: scale(1.2);
}

.dot-btn.active .dot-inner {
  background: white;
  border-color: white;
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.5);
  transform: scale(1.3);
}

.dot-btn.active .dot-label {
  opacity: 0.6;
  transform: translateX(0);
}

.scroll-hint {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  pointer-events: auto;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 40;
}

.scroll-hint.top {
  top: 6rem;
}

.scroll-hint.bottom {
  bottom: 2.5rem;
}

.scroll-hint:hover {
  transform: translateX(-50%) translateY(-4px);
}

.scroll-hint.top:hover {
  transform: translateX(-50%) translateY(4px);
}

.hint-text {
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  opacity: 0.7;
}

.hint-icon {
  animation: bounce 2.5s infinite;
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(6px); }
  60% { transform: translateY(3px); }
}

.fade-up-enter-active, .fade-up-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-up-enter-from, .fade-up-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

.fade-down-enter-active, .fade-down-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-down-enter-from, .fade-down-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

@media (max-width: 768px) {
  .page-indicators {
    right: 1rem;
    gap: 1rem;
  }
  .dot-label {
    display: none;
  }
  .scroll-hint {
    bottom: 1.5rem;
  }
}
</style>