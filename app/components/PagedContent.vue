<!-- 
  This needs to be fixed/remade. It kindof works but it's not great at all, the UI overlay is way too big and it doesn't work on mobile
  Goal is to make each section take up the full screen and have buttons on the top and bottom to navigate between them
  Should feel like 'falling' or flying through the sky to get to the next page rather than scrolling. Cloud passing by each section as you scroll.
  What do we even do about mobile? eek. Maybe we just remove PagedContent entirely and just make a normal scrollable page?
  Somehow need to make it not feel like mobile was an afterthought.
-->

<script setup lang="ts">
import { motion, useScroll, useTransform, useSpring } from 'motion-v'

const targetRef = ref<HTMLElement | null>(null)
const wrapperRef = ref<any>(null)
const sectionCount = ref(0)

onMounted(async () => {
  await nextTick()
  const el = wrapperRef.value?.$el || wrapperRef.value
  if (el && el.children) {
    // Only count SECTION tags to avoid counting helper elements
    const sections = Array.from(el.children).filter(c => (c as HTMLElement).tagName === 'SECTION')
    sectionCount.value = sections.length || el.children.length
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
  if (!n || n <= 1) return 0
  
  // Linear step-based transition with a cubic curve for a "sticky then fly" feel
  const step = 120
  const progress = val * (n - 1)
  const index = Math.floor(progress)
  const localProgress = progress - index
  
  // Cubic ease gives immediate feedback but stays near the top for the first half of the transition
  const easedProgress = Math.pow(localProgress, 3)
  
  let yOffset = index * step
  if (index < n - 1) {
    yOffset += easedProgress * step
  }
  
  return yOffset * multiplier
}

const y = useTransform(smoothProgress, (val) => {
  return `-${calculateYOffset(val, sectionCount.value)}vh`
})

const yBgClouds = useTransform(smoothProgress, (val) => {
  return `-${calculateYOffset(val, sectionCount.value, 0.4)}vh`
})

const yFgClouds = useTransform(smoothProgress, (val) => {
  return `-${calculateYOffset(val, sectionCount.value, 1.8)}vh`
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

  for (let i = 0; i < n; i++) {
    // Ambient Background Clouds (one per page)
    bg.push({
      id: `bg-${i}`,
      src: getCloudSrc(i),
      style: {
        top: `${i * 120 + 20}vh`,
        left: `${(i % 2 === 0) ? -10 : 10}vw`,
        width: '130vw',
        opacity: 0.15,
        filter: 'blur(12px)',
        animationDelay: `${i * 0.8}s`
      }
    })

    // Divider Clouds
    if (i < n - 1) {
      md.push({
        id: `md-${i}`,
        src: getCloudSrc(i + 4),
        style: {
          top: `${i * 120 + 105}vh`,
          left: '-5vw',
          width: '120vw',
          opacity: 0.4,
          filter: 'none',
        }
      })

      // Foreground clouds move much faster, so they need to be positioned 
      // further away from the current page to not overlap it.
      fg.push({
        id: `fg-${i}`,
        src: getCloudSrc(i + 7),
        style: {
          top: `${i * 120 + 180}vh`, 
          right: '-10vw',
          width: '150vw',
          opacity: 0.6,
          filter: 'blur(8px)',
        }
      })
    }
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
  
  const totalHeight = (sectionCount.value - 1) * 120 + 100
  const vh = window.innerHeight / 100
  const totalPx = totalHeight * vh
  const viewportPx = window.innerHeight
  
  const targetVal = index / (sectionCount.value - 1 || 1)
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
    :style="{ height: sectionCount > 1 ? `${(sectionCount - 1) * 120 + 100}vh` : '100vh' }"
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
  gap: 20vh;
  width: 100%;
  max-width: 1600px;
  height: auto;
  margin: 0 auto;
  position: relative;
  z-index: 10;
}

:deep(section) {
  min-height: 100vh;
  width: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 16vh 10% 12vh 10%;
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