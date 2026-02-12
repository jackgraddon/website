<template>
  <div 
    ref="containerRef" 
    class="glass-container"
    :class="{
      'glass-container-circle': type === 'circle',
      'glass-container-pill': type === 'pill'
    }"
    :style="containerStyle"
  >
    <canvas ref="canvasRef" class="glass-canvas" :style="canvasStyle" />
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, computed, provide } from 'vue'
import { glassProps, GlassContainerKey } from '../utils/glass-types'
import { useGlassGl } from '../composables/useGlassGl'

const props = defineProps({
  ...glassProps
})

const { type, borderRadius, tintOpacity, blurRadius, warp, 
        edgeIntensity, rimIntensity, baseIntensity, 
        edgeDistance, rimDistance, baseDistance, 
        cornerBoost, rippleEffect } = toRefs(props)

const containerRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

// Provide canvas to children for nested glass
provide(GlassContainerKey, canvasRef)

// WebGL Logic
useGlassGl(canvasRef, containerRef, {
  type,
  borderRadius,
  tintOpacity,
  blurRadius,
  warp,
  edgeIntensity,
  rimIntensity,
  baseIntensity,
  edgeDistance,
  rimDistance,
  baseDistance,
  cornerBoost,
  rippleEffect,
  isNested: false
})

const containerStyle = computed(() => ({
  borderRadius: `${borderRadius.value}px`
}))

const canvasStyle = computed(() => ({
  position: 'absolute' as const,
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  borderRadius: `${borderRadius.value}px`,
  zIndex: '-1',
  pointerEvents: 'none' as const
}))
</script>

<style scoped>
.glass-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 10px;
  box-sizing: border-box;
}

.glass-container-circle {
  aspect-ratio: 1 / 1;
  flex-shrink: 0;
  flex-grow: 0;
}

.glass-container-pill {
  flex-shrink: 0;
  flex-grow: 0;
}
</style>
