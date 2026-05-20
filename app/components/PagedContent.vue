<!--
  PagedContent.vue

  Architecture: Native Window Scroll
  ────────────────────────────────────
  This component uses the native window scroll position to drive page
  transitions and parallax effects. By linking directly to the DOM's 
  page scroll, we avoid common issues with nested scroll hijacking 
  and ensure smooth, native behavior across all devices.

  • .scroll-track: Defines the total scrollable height.
  • .snap-point: Provides anchor points for CSS scroll-snap.
  • .snap-container: Sticky wrapper that holds the current viewport.

  Usage:
    <PagedContent>
      <section class="snap-section">Page 1</section>
      <section class="snap-section">Page 2</section>
    </PagedContent>

  Each direct child with class="snap-section" becomes a full-screen page.
-->

<script setup lang="ts">
// ─── Refs ─────────────────────────────────────────────────────────────────────

const trackRef      = ref<HTMLElement | null>(null)
const stickyRef     = ref<HTMLElement | null>(null)
const sectionRefs   = ref<HTMLElement[]>([])
const currentPage   = ref(0)
const sectionCount  = ref(0)
const currentScroll = ref(0)
const isAutoScrolling = ref(false)
let scrollTimeout: ReturnType<typeof setTimeout> | null = null

// ─── Section discovery ────────────────────────────────────────────────────────

onMounted(async () => {
  await nextTick()
  const track = trackRef.value
  if (!track) return

  // Find sections within the track (they are passed via slot)
  const sections = Array.from(
    track.querySelectorAll<HTMLElement>('.snap-section')
  )
  sectionRefs.value  = sections
  sectionCount.value = sections.length

  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleScroll, { passive: true })
  handleScroll()

  generateClouds(sections.length)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleScroll)
  clearGlobalStyles()
  if (rafId) cancelAnimationFrame(rafId)
  if (scrollTimeout) clearTimeout(scrollTimeout)
})

// ─── Style Management ────────────────────────────────────────────────────────

function clearGlobalStyles() {
  document.documentElement.style.scrollSnapType = ''
  document.documentElement.style.scrollBehavior = ''
}

function updateGlobalStyles(isActive: boolean) {
  if (isAutoScrolling.value) return
  if (isActive) {
    document.documentElement.style.scrollSnapType = 'y mandatory'
    // Snapping works best with auto scroll behavior
    document.documentElement.style.scrollBehavior = 'auto'
  } else {
    clearGlobalStyles()
  }
}

function handleScroll() {
  if (!trackRef.value) return

  const rect = trackRef.value.getBoundingClientRect()
  const vh   = window.innerHeight

  // Active check: is the track currently occupying the viewport?
  // We use a small threshold to enable snapping just before/at the top.
  const isActive = rect.top <= 5 && rect.bottom >= vh - 5
  updateGlobalStyles(isActive)

  // st is how many pixels the top of the track has moved above the viewport top
  const st = -rect.top
  const maxScroll = Math.max(0, (sectionCount.value - 1) * vh)

  // Clamp scroll between 0 and the end of the track
  currentScroll.value = Math.max(0, Math.min(maxScroll, st))

  // Update currentPage for indicators and UI
  currentPage.value = Math.min(
    sectionCount.value - 1,
    Math.max(0, Math.floor(st / vh + 0.5))
  )

  // Update clouds
  updateClouds(currentScroll.value)
}

function scrollToPage(index: number) {
  if (!trackRef.value) return
  const vh = window.innerHeight
  // Calculate global scroll position
  const targetY = trackRef.value.offsetTop + index * vh
  
  isAutoScrolling.value = true
  document.documentElement.style.scrollSnapType = 'none'
  
  window.scrollTo({ top: targetY, behavior: 'smooth' })
  
  if (scrollTimeout) clearTimeout(scrollTimeout)
  scrollTimeout = setTimeout(() => {
    isAutoScrolling.value = false
    handleScroll()
  }, 800)
}

function nextPage() {
  if (currentPage.value < sectionCount.value - 1) scrollToPage(currentPage.value + 1)
}

function prevPage() {
  if (currentPage.value > 0) scrollToPage(currentPage.value - 1)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); nextPage() }
  if (e.key === 'ArrowUp'   || e.key === 'PageUp')   { e.preventDefault(); prevPage() }
}

interface Cloud {
  id:      string
  src:     string
  layer:   'bg' | 'mid' | 'fg'
  baseTop: number
  left?:   string
  right?:  string
  width:   string
  opacity: number
  blur:    number
}

const clouds   = ref<Cloud[]>([])
const cloudY   = ref<Record<string, number>>({})
const PARALLAX = { bg: 0.55, mid: 1.0, fg: 1.6 }
let   rafId    = 0

function updateClouds(st: number) {
  clouds.value.forEach((c) => {
    // Math adjustment for sticky container parallax:
    // In a sticky container, to move with the sections (1:1), 
    // a child would need to be translated by -st.
    // So parallax math becomes: st * (PARALLAX - 2.0)
    cloudY.value[c.id] = st * (PARALLAX[c.layer] - 2.0)
  })
}

function getCloudSrc(index: number) {
  const num = (index % 3) + 1
  return `/images/clouds/cloud-${String(num).padStart(3, "0")}.webp`
}

function generateClouds(n: number) {
  const result: Cloud[] = []
  const init: Record<string, number> = {}

  for (let i = 0; i < n; i++) {
    const pageTop = i * 100

    result.push({
      id: `bg-${i}`, src: getCloudSrc(i), layer: 'bg',
      baseTop: pageTop + 15,
      left: i % 2 === 0 ? '-8vw' : '10vw',
      width: '120vw', opacity: 0.12, blur: 14,
    })

    if (i < n - 1) {
      result.push({
        id: `mid-${i}`, src: getCloudSrc(i + 4), layer: 'mid',
        baseTop: pageTop + 80, left: '-5vw',
        width: '115vw', opacity: 0.45, blur: 4,
      })
      result.push({
        id: `fg-${i}`, src: getCloudSrc(i + 7), layer: 'fg',
        baseTop: pageTop + 88, right: '-8vw',
        width: '140vw', opacity: 0.65, blur: 10,
      })
    }
  }

  result.forEach((c) => (init[c.id] = 0))
  clouds.value = result
  cloudY.value  = init
  // Initial position
  if (trackRef.value) handleScroll()
}

function cloudStyle(cloud: Cloud) {
  const offset = cloudY.value[cloud.id] ?? 0
  return {
    top:           `calc(${cloud.baseTop}vh + ${offset}px)`,
    left:          cloud.left,
    right:         cloud.right,
    width:         cloud.width,
    opacity:       cloud.opacity,
    filter:        cloud.blur > 0 ? `blur(${cloud.blur}px)` : 'none',
    zIndex:        cloud.layer === 'bg' ? 0 : cloud.layer === 'mid' ? 5 : 20,
    position:      'absolute' as const,
    pointerEvents: 'none'     as const,
    willChange:    'top',
  }
}
</script>

<template>
  <div
    ref="trackRef"
    class="scroll-track"
    :style="{ height: sectionCount > 0 ? `${sectionCount * 100}vh` : '100vh' }"
  >
    <div
      ref="stickyRef"
      class="snap-container"
      tabindex="0"
      @keydown="onKeydown"
    >
      <!-- Cloud layers -->
      <img
        v-for="cloud in clouds"
        :key="cloud.id"
        :src="cloud.src"
        :style="cloudStyle(cloud)"
        class="cloud-img"
        alt=""
        aria-hidden="true"
        loading="lazy"
      />

    </div>

    <!-- UI overlay -->
    <div class="ui-overlay" aria-hidden="true">
      <!-- Side dot indicators -->
      <div v-if="sectionCount > 1" class="page-indicators" role="tablist">
        <button
          v-for="i in sectionCount"
          :key="i"
          class="dot-btn"
          :class="{ active: currentPage === i - 1 }"
          role="tab"
          :aria-selected="currentPage === i - 1"
          :aria-label="`Go to page ${i}`"
          @click="scrollToPage(i - 1)"
        >
          <span class="dot-inner" />
        </button>
      </div>

      <!-- Previous -->
      <Transition name="hint-down">
        <Button
          v-if="currentPage > 0"
          variant="default"
          class="page-hint top"
          @click="prevPage"
          aria-label="Previous page"
        >
          Previous
        </Button>
      </Transition>

      <!-- Next -->
      <Transition name="hint-up">
        <Button
          v-if="currentPage < sectionCount - 1"
          class="page-hint bottom"
          @click="nextPage"
          aria-label="Next page"
        >
          Next
        </Button>
      </Transition>
    </div>
    
    <div class="sections-host">
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* ── Outer track ────────────────────────────────────────────────────── */

.scroll-track {
  position: relative;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  display: grid;
  grid-template-columns: 1fr;
}

/* ── Sticky snap container ──────────────────────────────────────────── */

.snap-container {
  grid-area: 1 / 1;
  position: sticky;
  top: 0;
  height: 100vh;
  height: 100dvh;
  width: 100%;
  overflow: visible;
  outline: none;
  z-index: 1;
  pointer-events: none; /* Let clicks pass through to sections if needed, but clouds are pointer-events: none anyway. Actually UI needs pointer-events. */
}

/* ── Sections host ──────────────────────────────────────────────────── */

.sections-host {
  grid-area: 1 / 1;
  position: relative;
  z-index: 10;
  /* Natural height based on slot contents */
}

/* ── Snap sections ──────────────────────────────────────────────────── */

:deep(.snap-section) {
  height: 100vh;
  height: 100dvh;
  width: 100%;
  max-width: var(--breakpoint-xl);
  margin: 0 auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: max(4rem, 10vh) 10% max(3rem, 8vh);
  overflow: hidden;
  position: relative;
  scroll-snap-align: start;
  scroll-snap-stop: always;
}

/* ── Cloud images ───────────────────────────────────────────────────── */

.cloud-img {
  pointer-events: none;
  user-select: none;
  position: absolute;
  max-width: none;
}

/* ── UI overlay ─────────────────────────────────────────────────────── */

.ui-overlay {
  grid-area: 1 / 1;
  position: sticky;
  top: 0;
  height: 100vh;
  height: 100dvh;
  width: 100%;
  pointer-events: none;
  z-index: 30;
}

/* ── Dot indicators ─────────────────────────────────────────────────── */

.page-indicators {
  position: absolute;
  right: clamp(0.75rem, 2vw, 2rem);
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  pointer-events: auto;
}

.dot-btn {
  background: none;
  border: none;
  padding: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dot-inner {
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.45);
  transition: border-color 0.25s, background 0.25s, transform 0.25s, box-shadow 0.25s;
}

.dot-btn:hover .dot-inner {
  border-color: rgba(255, 255, 255, 0.85);
  transform: scale(1.25);
}

.dot-btn.active .dot-inner {
  background: white;
  border-color: white;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  transform: scale(1.35);
}

/* ── Prev / Next buttons ────────────────────────────────────────────── */

.page-hint {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px) saturate(1.4);
  -webkit-backdrop-filter: blur(8px) saturate(1.4);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 2rem;
  padding: 0.6rem 1.4rem;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  pointer-events: auto;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
  white-space: nowrap;
}

.page-hint.top    { top:    clamp(1rem, 3vh, 2.5rem); }
.page-hint.bottom { bottom: clamp(1rem, 3vh, 2.5rem); }

.page-hint:hover { background: rgba(255, 255, 255, 0.2); box-shadow: 0 4px 24px rgba(0,0,0,0.12); }
.page-hint.top:hover    { transform: translateX(-50%) translateY( 3px); }
.page-hint.bottom:hover { transform: translateX(-50%) translateY(-3px); }

/* ── Transitions ────────────────────────────────────────────────────── */

.hint-up-enter-active, .hint-up-leave-active,
.hint-down-enter-active, .hint-down-leave-active {
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.hint-up-enter-from, .hint-up-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(16px);
}

.hint-down-enter-from, .hint-down-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-16px);
}

/* ── Mobile ─────────────────────────────────────────────────────────── */

@media (max-width: 768px) {
  .page-indicators { gap: 1rem; }

  .page-hint { padding: 0.7rem 1.2rem; }

  :deep(.snap-section) {
    padding: max(3rem, 8vh) 6% max(2.5rem, 6vh);
    align-items: center;
    text-align: center;
  }
}

/* ── Reduced motion ─────────────────────────────────────────────────── */

@media (prefers-reduced-motion: reduce) {
  .hint-up-enter-active, .hint-up-leave-active,
  .hint-down-enter-active, .hint-down-leave-active {
    transition: opacity 0.2s ease;
  }

  .hint-up-enter-from, .hint-up-leave-to,
  .hint-down-enter-from, .hint-down-leave-to {
    transform: translateX(-50%);
  }
}
</style>