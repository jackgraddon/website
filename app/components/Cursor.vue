<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { motion, useMotionValue, useSpring } from 'motion-v'

// Auto-import all SVGs from assets/cursor
// Vite's import.meta.glob will return the public URLs for these assets
const cursorAssets = import.meta.glob('~/assets/cursor/*.svg', { 
  eager: true, 
  import: 'default' 
})

// Process the imported assets into a clean map { name: url }
const cursorMap = computed(() => {
  const map: Record<string, string> = {}
  for (const path in cursorAssets) {
    const name = path.split('/').pop()?.replace('.svg', '') || ''
    map[name] = cursorAssets[path] as string
  }
  return map
})

// Mouse position tracking with smooth springs
const mouseX = useMotionValue(-100)
const mouseY = useMotionValue(-100)

const springConfig = { damping: 10, stiffness: 250, mass: 0.1 }
const smoothX = useSpring(mouseX, springConfig)
const smoothY = useSpring(mouseY, springConfig)

const activeCursor = ref('pointer')
const isHovering = ref(false)
const isVisible = ref(false)
const isPressed = ref(false)

let lastTarget: HTMLElement | null = null
let isResizable = false

const updateCursorState = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target) return

  // Cache computed style check for performance
  if (target !== lastTarget) {
    lastTarget = target
    const style = window.getComputedStyle(target)
    isResizable = style.resize !== 'none'
  }

  // Check for resize handle (bottom right corner, usually ~15x15px)
  let isResizeHandle = false
  if (isResizable) {
    const rect = target.getBoundingClientRect()
    if (e.clientX >= rect.right - 15 && e.clientY >= rect.bottom - 15) {
      isResizeHandle = true
    }
  }

  // Check for custom data-cursor attribute
  const customCursor = target.closest('[data-cursor]')?.getAttribute('data-cursor')
  
  // Check if hovering over interactive elements
  const isLink = target.closest('a, button, [role="button"]')
  const isInput = target.closest('input, textarea, [contenteditable="true"]')
  
  if (isResizeHandle) {
    isVisible.value = false
    return
  } else {
    isVisible.value = true
  }

  if (customCursor && cursorMap.value[customCursor]) {
    activeCursor.value = customCursor
    isHovering.value = true
  } else if (isInput) {
    activeCursor.value = cursorMap.value['text'] ? 'text' : 'pointer'
    isHovering.value = true
  } else if (isLink) {
    activeCursor.value = cursorMap.value['hover'] ? 'hover' : (cursorMap.value['link'] ? 'link' : 'pointer')
    isHovering.value = true
  } else {
    activeCursor.value = 'pointer'
    isHovering.value = false
  }
}

const updateMouse = (e: MouseEvent) => {
  mouseX.set(e.clientX)
  mouseY.set(e.clientY)
  
  // Constantly evaluate cursor state to catch precise handle positioning
  updateCursorState(e)
}

const handleMouseDown = () => isPressed.value = true
const handleMouseUp = () => isPressed.value = false

onMounted(() => {
  window.addEventListener('mousemove', updateMouse)
  window.addEventListener('mouseover', updateCursorState)
  window.addEventListener('mousedown', handleMouseDown)
  window.addEventListener('mouseup', handleMouseUp)
  
  // Hide the default system cursor globally
  document.documentElement.classList.add('custom-cursor-active')
  
  // Create a style element to force cursor: none on all interactive elements
  const style = document.createElement('style')
  style.id = 'cursor-none-styles'
  style.innerHTML = `
    .custom-cursor-active, 
    .custom-cursor-active *,
    .custom-cursor-active a, 
    .custom-cursor-active button, 
    .custom-cursor-active [role="button"],
    .custom-cursor-active ::-webkit-resizer {
      cursor: none !important;
    }
  `
  document.head.appendChild(style)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', updateMouse)
  window.removeEventListener('mouseover', updateCursorState)
  window.removeEventListener('mousedown', handleMouseDown)
  window.removeEventListener('mouseup', handleMouseUp)
  
  document.documentElement.classList.remove('custom-cursor-active')
  document.getElementById('cursor-none-styles')?.remove()
})
</script>

<template>
  <div v-if="isVisible" class="cursor-container">
    <motion.div
      class="cursor-follower"
      :style="{
        x: smoothX,
        y: smoothY,
        translateX: '-50%',
        translateY: '-50%'
      }"
    >
      <motion.div
        class="cursor-visual"
        :animate="{
          scale: isPressed ? 0.8 : (isHovering ? 1.2 : 1),
          rotate: isHovering ? 0 : -25
        }"
        :transition="{ type: 'spring', damping: 15, stiffness: 300 }"
      >
        <!-- Dynamic SVG from auto-imported assets -->
        <img 
          :src="cursorMap[activeCursor] || cursorMap['pointer']" 
          :alt="activeCursor"
          class="cursor-svg"
        />
      </motion.div>
    </motion.div>
  </div>
</template>

<style scoped>
.cursor-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 99999;
  overflow: hidden;
}

.cursor-follower {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  will-change: transform;
}

.cursor-visual {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cursor-svg {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

/* Hide cursor on mobile/touch devices */
@media (pointer: coarse) {
  .cursor-container {
    display: none;
  }
}
</style>
