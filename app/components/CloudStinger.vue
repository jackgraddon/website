<script setup lang="ts">
/**
 * CloudStinger.vue
 *
 * Always mounted so the phase watcher is live before any navigation fires.
 * Uses v-show (not v-if) so it's never torn down mid-animation.
 *
 * Geometry — one container, parked off-screen below:
 *
 *   position: fixed; top: 0; left: 0; width: 100vw; height: 100vh
 *
 *   idle:      translateY(-150%) → completely above the viewport
 *   rising:    translateY(0%)    → fills the viewport
 *   revealing: translateY(150%)  → exits off the bottom
 *
 * The cloud images overflow below the container bottom (overflow: visible)
 * to give a natural fluffy bottom edge without clipping.
 * A sky div fills the container background so there's no gap above.
 *
 * To add clouds: append to CLOUD_IMAGES. Layout is automatic.
 */

const { phase, notifyCovered, notifyRevealed } = useCloudStinger()

// ─── Cloud config ─────────────────────────────────────────────────────────────
// Define the unique cloud assets available
const BASE_CLOUDS = [
    '/images/clouds/cloud-001.webp',
    '/images/clouds/cloud-002.webp',
    '/images/clouds/cloud-003.webp',
]

// Generate an array of N clouds by repeating the available assets
// OPTIMIZATION: Reduced from 18 to 10. We only need clouds on the top and bottom edges
// because the center is covered by the solid stinger-sky div. This massively reduces
// overdraw and expensive blur rendering.
const TARGET_CLOUD_COUNT = 10
const CLOUD_IMAGES = Array.from(
    { length: TARGET_CLOUD_COUNT }, 
    (_, i) => BASE_CLOUDS[i % BASE_CLOUDS.length]
)

const RISE_MS   = 1500
const REVEAL_MS = 1000

// ─── Cloud layout ─────────────────────────────────────────────────────────────
// Seeded pseudo-random — deterministic so hydration matches
function sr(seed: number, min: number, max: number) {
    const x = Math.sin(seed + 1) * 10000
    return min + (x - Math.floor(x)) * (max - min)
}

interface Cloud {
    src: string
    left: string
    top: string       // position within the container (as %)
    width: string
    opacity: number
    rotate: number
    scale: number
    flip: number
    blur: number
}

const clouds = computed<Cloud[]>(() =>
    CLOUD_IMAGES.map((src, i) => {
        const isTopEdge = i < 5
        const indexInEdge = i % 5

        // Spread 5 clouds across the width for each edge
        const baseX = -30 + (indexInEdge * 35)
        
        // Base Y: top edge clouds around -20%, bottom edge clouds around 90%
        const baseY = isTopEdge ? -20 : 90

        return {
            src,
            left:    `${baseX + sr(i, -10, 10)}%`,
            top:     `${baseY + sr(i * 2, -15, 15)}%`,
            width:   `clamp(900px, ${sr(i * 3, 90, 140)}vw, 2000px)`,
            opacity: sr(i * 4, 0.95, 1.0),
            rotate:  sr(i * 5, -12, 12),
            scale:   sr(i * 6, 0.85, 1.3),
            flip:    sr(i * 7, 0, 1) > 0.5 ? -1 : 1,
            blur:    indexInEdge % 2 === 0 ? sr(i * 8, 16, 28) : sr(i * 9, 4, 10)
        }
    })
)

// ─── Animation state ──────────────────────────────────────────────────────────
// Direction reversed: enters from -200% (top)
const translateY = ref('-200%')
const transitionCSS = ref('none')

function sleep(ms: number) { return new Promise<void>(r => setTimeout(r, ms)) }

watch(phase, async (p) => {
    if (p === 'rising') {
        // Snap to start position (far above viewport so bottom clouds don't peek)
        transitionCSS.value = 'none'
        translateY.value = '-200%'
        await new Promise(r => requestAnimationFrame(r))
        await new Promise(r => requestAnimationFrame(r))
        
        // Slower, more graceful entry from top to 0%
        transitionCSS.value = `transform ${RISE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
        translateY.value = '0%'
        await sleep(RISE_MS + 30)
        
        // Hold the cover
        await sleep(20)
        
        notifyCovered()
    }

    if (p === 'revealing') {
        // Exit off the bottom (far enough so top clouds clear)
        transitionCSS.value = `transform ${REVEAL_MS}ms cubic-bezier(0.32, 0, 0.67, 0)`
        translateY.value = '200%'
        await sleep(REVEAL_MS + 30)
        notifyRevealed()
        
        // Reset to parked position (top) silently after reveal
        await new Promise(r => requestAnimationFrame(r))
        transitionCSS.value = 'none'
        translateY.value = '-200%'
    }
}, { immediate: false })

const containerStyle = computed(() => ({
    transform:  `translateY(${translateY.value})`,
    transition: transitionCSS.value,
}))

const isVisible = computed(() => phase.value !== 'idle')
</script>

<template>
    <Teleport to="body">
        <div
            class="stinger-wrap"
            :class="{ 'stinger-active': isVisible }"
            :style="containerStyle"
            aria-hidden="true"
        >
            <!-- 
                Solid sky background 
                Ensures 100% opacity during the transition even if clouds have gaps.
                Padded vertically so it covers the screen before/after the fluffiest edges.
            -->
            <div class="stinger-sky" />

            <!-- Cloud images -->
            <img
                v-for="(cloud, i) in clouds"
                :key="i"
                :src="cloud.src"
                class="stinger-cloud"
                :style="{
                    left:      cloud.left,
                    top:       cloud.top,
                    width:     cloud.width,
                    opacity:   cloud.opacity,
                    transform: `rotate(${cloud.rotate}deg) scale(${cloud.scale}) scaleX(${cloud.flip}) translateZ(0)`,
                    filter:    `blur(${cloud.blur}px)`,
                    zIndex:    i + 1,
                }"
                alt=""
                draggable="false"
            />
        </div>
    </Teleport>
</template>

<style scoped>
.stinger-wrap {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    height: 100dvh;
    z-index: 9999;
    pointer-events: none;
    /* Single GPU layer for the whole stinger */
    will-change: transform;
    /* Let clouds overflow below without clipping */
    overflow: visible;
    /* Hidden when idle so it doesn't intercept any events or paints */
    visibility: hidden;
}

.stinger-active {
    visibility: visible;
}

.stinger-sky {
    position: absolute;
    top: -10%;
    left: 0;
    width: 100%;
    height: 120%;
    /* Fade the top and bottom edges so it blends seamlessly into the clouds without a hard cutoff line */
    background: linear-gradient(to bottom, transparent 0%, white 15%, white 85%, transparent 100%);
    z-index: 0;
}


.stinger-cloud {
    position: absolute;
    height: auto;
    pointer-events: none;
    user-select: none;
    transform: translateZ(0); /* own layer per cloud for smooth compositing */
}
</style>