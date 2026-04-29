<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
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

// We use a slightly higher stiffness here to ensure the "speed" 
// matches the user's scroll intent more closely at the handoff.
const smoothProgress = useSpring(scrollYProgress, {
  stiffness: 70,
  damping: 30,
  restDelta: 0.0001
})

const y = useTransform(smoothProgress, (val) => {
  if (sectionCount.value <= 1) return '0vh'
  const n = sectionCount.value
  
  const clampedIndex = Math.min(Math.floor(val * n), n - 1)
  const localProgress = (val - (clampedIndex / n)) * n
  
  const driftEnd = 0.70 
  const maxDrift = 12   
  
  let yOffset = clampedIndex * 100 
  
  if (clampedIndex === n - 1) {
    /**
     * LAST SECTION: The Velocity Handoff
     * Instead of easing to a stop, we ease the speed back up to 
     * "Standard Scroll Speed". 
     */
    const t = localProgress
    
    // We use a cubic curve that starts at 0 and ends at a specific 
    // slope that matches the 'unsticking' of the container.
    // This creates a "soft" drift that blends into the natural scroll.
    const easeOutWithMomentum = t * (2 - t) // Quadratic ease-out
    
    // We add a tiny "exit velocity" to the drift so it's moving
    // as it reaches the end of the track.
    yOffset += easeOutWithMomentum * maxDrift
  } 
  else {
    // INTERMEDIATE SECTIONS: Floating + Fly-away
    if (localProgress <= driftEnd) {
      const driftPcnt = localProgress / driftEnd
      yOffset += driftPcnt * maxDrift
    } else {
      const flyPcnt = (localProgress - driftEnd) / (1 - driftEnd)
      // Exponential curve for the "fly away" speed peak
      const easedFly = Math.pow(flyPcnt, 3) 
      yOffset += maxDrift + (easedFly * (100 - maxDrift))
    }
  }
  
  return `-${yOffset}vh`
})
</script>

<template>
  <div 
    class="scroll-track" 
    ref="targetRef" 
    :style="{ height: sectionCount > 0 ? `${sectionCount * 180}vh` : '100vh' }"
  >
    <div class="sticky-window">
      <motion.div
        class="sections-wrapper"
        ref="wrapperRef"
        :style="{ y }"
      >
        <slot />
      </motion.div>
    </div>
  </div>
</template>

<style scoped>
.scroll-track {
  position: relative;
  width: 100%;
}

.sticky-window {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.sections-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  will-change: transform;
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
}
</style>