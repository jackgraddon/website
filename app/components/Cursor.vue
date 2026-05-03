<script setup lang="ts">
import { motion, useMotionValue, useSpring } from 'motion-v'

const { isLoaded } = useAppLoaded()

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
const isOutside = ref(true)
const isOverResize = ref(false)
const isPressed = ref(false)

const isVisible = computed(() => !isOutside.value && !isOverResize.value)
const shouldShow = computed(() => isVisible.value && isLoaded.value)

let lastPointer = { x: 0, y: 0, t: 0 }
let edgeTimer: ReturnType<typeof setTimeout> | null = null
let safetyInterval: ReturnType<typeof setInterval> | null = null
const EDGE_THRESHOLD = 1 // tighter threshold for explicit movement checks

let lastTarget: HTMLElement | null = null
let isResizable = false
let _cursorRafId = 0
let cachedCustomCursor: string | null = null
let cachedIsInput = false
let cachedIsLink = false

const updateCursorState = (e: PointerEvent) => {
  const target = e.target as HTMLElement
  if (!target) return

  // Cache computed style and closest checks
  if (target !== lastTarget) {
    lastTarget = target
    const style = window.getComputedStyle(target)
    isResizable = style.resize !== 'none'
    
    // Consolidate closest calls into a single traversal if possible, 
    // or at least cache the results for this target.
    const customCursorAttr = target.closest('[data-cursor]')
    const interactiveTarget = target.closest('a, button, [role="button"], input, textarea, [contenteditable="true"]')
    
    cachedCustomCursor = customCursorAttr?.getAttribute('data-cursor') || null
    cachedIsInput = !!interactiveTarget?.closest('input, textarea, [contenteditable="true"]')
    cachedIsLink = !!interactiveTarget && !cachedIsInput
  }

  // Check for resize handle (bottom right corner, usually ~15x15px)
  let isResizeHandle = false
  if (isResizable) {
    const rect = target.getBoundingClientRect()
    if (e.clientX >= rect.right - 15 && e.clientY >= rect.bottom - 15) {
      isResizeHandle = true
    }
  }

  if (isResizeHandle) {
    isOverResize.value = true
    return
  } else {
    isOverResize.value = false
  }

  // Explicit boundary check for fast movements
  const atEdge = 
    e.clientX <= EDGE_THRESHOLD || 
    e.clientX >= window.innerWidth - EDGE_THRESHOLD || 
    e.clientY <= EDGE_THRESHOLD || 
    e.clientY >= window.innerHeight - EDGE_THRESHOLD

  if (atEdge) {
    if (!edgeTimer) {
      edgeTimer = setTimeout(() => {
        const dt = Date.now() - lastPointer.t
        // If we're at the edge and haven't moved for a bit, 
        // it's likely we left without a pointerleave event
        if (dt > 150) isOutside.value = true
      }, 200)
    }
  } else {
    isOutside.value = false
    if (edgeTimer) {
      clearTimeout(edgeTimer)
      edgeTimer = null
    }
  }

  if (cachedCustomCursor && cursorMap.value[cachedCustomCursor]) {
    activeCursor.value = cachedCustomCursor
    isHovering.value = true
  } else if (cachedIsInput) {
    activeCursor.value = cursorMap.value['text'] ? 'text' : 'pointer'
    isHovering.value = true
  } else if (cachedIsLink) {
    activeCursor.value = cursorMap.value['hover'] ? 'hover' : (cursorMap.value['link'] ? 'link' : 'pointer')
    isHovering.value = true
  } else {
    activeCursor.value = 'pointer'
    isHovering.value = false
  }
}

const updateMouse = (e: PointerEvent) => {
  lastPointer = { x: e.clientX, y: e.clientY, t: Date.now() }
  
  mouseX.set(e.clientX)
  mouseY.set(e.clientY)
  
  if (_cursorRafId === 0) {
    const snapshot = e
    _cursorRafId = requestAnimationFrame(() => {
      _cursorRafId = 0
      updateCursorState(snapshot)
    })
  }
}

const handleMouseDown = () => isPressed.value = true
const handleMouseUp = () => isPressed.value = false

const handleMouseEnter = () => { 
  isOutside.value = false 
  if (edgeTimer) clearTimeout(edgeTimer)
}

const handleMouseLeave = (e: PointerEvent) => {
  if (!e.relatedTarget) isOutside.value = true
}

const handleBlur = () => { 
  isOutside.value = true 
}

const handleVisibility = () => {
  if (document.visibilityState === 'hidden') isOutside.value = true
}

const runSafetyCheck = () => {
  const now = Date.now()
  // Only hide if we haven't seen movement for a while AND we're at the very edge
  // This catches cases where pointerleave might have missed a fast exit
  if (now - lastPointer.t > 2000) {
    const atEdge = 
      lastPointer.x <= 1 || 
      lastPointer.x >= window.innerWidth - 1 || 
      lastPointer.y <= 1 || 
      lastPointer.y >= window.innerHeight - 1
    
    if (atEdge) isOutside.value = true
  }
}

onMounted(() => {
  window.addEventListener('pointermove', updateMouse, { passive: true, capture: true })
  window.addEventListener('pointerdown', handleMouseDown, { capture: true })
  window.addEventListener('pointerup', handleMouseUp, { capture: true })
  window.addEventListener('blur', handleBlur)
  window.addEventListener('focus', () => { /* noop, wait for move */ })
  document.addEventListener('pointerenter', handleMouseEnter, { capture: true })
  document.addEventListener('pointerleave', handleMouseLeave, { capture: true })
  document.addEventListener('visibilitychange', handleVisibility)
  
  safetyInterval = setInterval(runSafetyCheck, 400)
  
  document.documentElement.classList.add('custom-cursor-active')
  
  const style = document.createElement('style')
  style.id = 'cursor-none-styles'
  style.innerHTML = `
    .custom-cursor-active, 
    .custom-cursor-active *,
    .custom-cursor-active a, 
    .custom-cursor-active button, 
    .custom-cursor-active [role="button"] {
      cursor: none !important;
    }
  `
  document.head.appendChild(style)
})

onUnmounted(() => {
  window.removeEventListener('pointermove', updateMouse, { capture: true, passive: true })
  window.removeEventListener('pointerdown', handleMouseDown, { capture: true })
  window.removeEventListener('pointerup', handleMouseUp, { capture: true })
  window.removeEventListener('blur', handleBlur)
  document.removeEventListener('pointerenter', handleMouseEnter, { capture: true })
  document.removeEventListener('pointerleave', handleMouseLeave, { capture: true })
  document.removeEventListener('visibilitychange', handleVisibility)
  
  if (edgeTimer) clearTimeout(edgeTimer)
  if (safetyInterval) clearInterval(safetyInterval)
  
  document.documentElement.classList.remove('custom-cursor-active')
  document.getElementById('cursor-none-styles')?.remove()
})
</script>

<template>
  <div class="cursor-container">
    <motion.div
      class="cursor-follower"
      :animate="{
        opacity: shouldShow ? 1 : 0,
      }"
      :style="{
        x: smoothX,
        y: smoothY,
        translateX: '-50%',
        translateY: '-50%'
      }"
      :transition="{
        opacity: { duration: 0.2 }
      }"
    >
      <motion.div
        class="cursor-visual"
        :animate="{
          scale: isPressed ? 0.8 : (isHovering ? 1.2 : 1),
          rotate: isHovering ? 0 : -25
        }"
        :transition="{ type: 'spring', damping: 5, stiffness: 300 }"
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
