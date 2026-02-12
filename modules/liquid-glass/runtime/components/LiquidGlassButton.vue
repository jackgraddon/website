<template>
  <div 
    ref="buttonRef"
    class="glass-button"
    :class="{
      'glass-button-circle': type === 'circle'
    }"
    :style="buttonStyle"
    @click="handleClick"
  >
    <canvas ref="canvasRef" class="glass-canvas" :style="canvasStyle" />
    <NuxtLink :to="to" class="glass-button-text" :style="{ fontSize: size + 'px' }">
      <slot />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, computed, inject, onMounted, type Ref } from 'vue'
import { glassProps, GlassContainerKey } from '../utils/glass-types'
import { useGlassGl } from '../composables/useGlassGl'

const props = defineProps({
  ...glassProps,
  to: {
    type: String,
    default: ''
  },
  size: {
    type: Number,
    default: 16
  }
})

const emit = defineEmits(['click'])

const { type, borderRadius, tintOpacity, blurRadius, warp,
        edgeIntensity, rimIntensity, baseIntensity, 
        edgeDistance, rimDistance, baseDistance, 
        cornerBoost, rippleEffect } = toRefs(props)

const buttonRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

// Check if we are nested
const parentCanvas = inject<Ref<HTMLCanvasElement | null> | null>(GlassContainerKey, null)
const isNested = computed(() => !!parentCanvas?.value)

// WebGL Logic
useGlassGl(canvasRef, buttonRef, {
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
  isNested: !!isNested.value,
  parentCanvas: parentCanvas
})

const buttonStyle = computed(() => {
  // Logic from button.js setSizeFromText
  // Can be implemented here or with simple CSS
  // For now simple CSS
  return {
    borderRadius: `${borderRadius.value}px`,
    padding: `${props.size * 0.5}px ${props.size}px`
  }
})

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

const handleClick = (e: Event) => {
  emit('click', e)
}

</script>

<style scoped>
.glass-button {
  position: relative;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  pointer-events: auto;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  overflow: hidden; /* Important for button glass */
}

.glass-button-circle {
  aspect-ratio: 1 / 1;
  flex-shrink: 0;
  flex-grow: 0;
}

.glass-button-text {
  position: relative;
  z-index: 1;
  pointer-events: none;
  font-weight: normal;
  color: white;
  font-family: system-ui, -apple-system, sans-serif;
  white-space: nowrap;
}
</style>
