<template>
    <div class="floating-cta-container" :class="{ 'is-loaded': isLoaded }" aria-label="Quick navigation">
        <div class="cta-ring">
            <div
                v-for="(cta, index) in ctas"
                :key="cta.id"
                class="cta-slot"
                :style="getSlotStyle(index)"
            >
                <div class="cta-drift" :style="getDriftStyle(index)">
                    <NuxtLink :to="cta.url" class="cta-card" :aria-label="cta.title" :style="cardSizeStyle">
                        <Surface variant="glass" direction="column">
                            <!-- Icon: visible when collapsed -->
                            <div class="cta-icon-wrap">
                                <Icon v-if="cta.icon && isNuxtIcon(cta.icon)" :name="cta.icon" class="cta-icon" />
                                <span v-else-if="cta.icon" class="cta-icon">{{ cta.icon }}</span>
                            </div>

                            <!-- Portal: fills card on hover -->
                            <div class="cta-portal" :style="portalInnerStyle">
                                <!-- Unified Snapshot -->
                                <img 
                                    :src="`/api/screenshot?url=${encodeURIComponent(cta.url)}&ar=${closestPreset.name}`" 
                                    class="cta-screenshot"
                                    loading="lazy"
                                    alt=""
                                />

                                <!-- Label: Floating in the center -->
                                <div class="cta-portal-label">{{ cta.title }}</div>
                            </div>
                        </Surface>
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">


const props = defineProps<{
    ctas: Array<{ id: number; title: string; url: string; icon?: string }>;
}>();

const { isLoaded } = useAppLoaded();

const DRIFT_DURATIONS = [14.2, 16.8, 12.5, 18.4, 15.9, 16.1];
const DRIFT_DELAYS    = [0, -4.6, -10.2, -3.4, -7.8, -12.4];
const CARD_TILTS      = [-3, 2, -1, 3, -2, 1];

const ICON_SIZE     = 52;
const PORTAL_W      = 180;
const CAPTURE_SCALE = 0.2;

const PRESETS = [
    { name: '16-9', ratio: 16 / 9 },
    { name: '4-3',  ratio: 4 / 3 },
    { name: '9-16', ratio: 9 / 16 },
    { name: '1-1',  ratio: 1 / 1 }
];

const aspectRatio = computed(() =>
    typeof window !== 'undefined' ? window.innerWidth / window.innerHeight : 16 / 9
);
const resizeTrigger = ref(0);
let _resizeTimer: ReturnType<typeof setTimeout>;
function _onResize() {
    clearTimeout(_resizeTimer);
    _resizeTimer = setTimeout(() => resizeTrigger.value++, 200);
}
if (typeof window !== 'undefined') {
    window.addEventListener('resize', _onResize, { passive: true });
}
onUnmounted(() => {
    if (typeof window !== 'undefined') {
        window.removeEventListener('resize', _onResize);
    }
    clearTimeout(_resizeTimer);
});

const closestPreset = computed(() => {
    resizeTrigger.value; 
    const current = aspectRatio.value;
    return PRESETS.reduce((prev, curr) => 
        Math.abs(curr.ratio - current) < Math.abs(prev.ratio - current) ? curr : prev
    );
});

const portalH = computed(() => {
    const preset = closestPreset.value;
    return Math.round(PORTAL_W / preset.ratio);
});

const cardSizeStyle = computed(() => ({
    '--icon-size': `${ICON_SIZE}px`,
    '--portal-w':  `${PORTAL_W}px`,
    '--portal-h':  `${portalH.value}px`,
}));

const portalInnerStyle = computed(() => ({
    width:  `${PORTAL_W}px`,
    height: `${portalH.value}px`,
}));

const screenshotStyle = computed(() => ({
    width:     `${Math.round(PORTAL_W / CAPTURE_SCALE)}px`,
    height:    `${Math.round(portalH.value / CAPTURE_SCALE)}px`,
    transform: `scale(${CAPTURE_SCALE})`,
}));

function getSlotStyle(index: number): Record<string, string> {
    const count = props.ctas.length;
    const angleDeg = (360 / count) * index;
    return {
        '--angle': `${angleDeg}deg`,
        '--card-tilt': `${CARD_TILTS[index % CARD_TILTS.length]}deg`,
        '--entrance-delay': `${2 + (index * 0.1)}s`
    };
}

function getDriftStyle(index: number): Record<string, string> {
    return {
        '--drift-duration': `${DRIFT_DURATIONS[index % DRIFT_DURATIONS.length]}s`,
        '--drift-delay':    `${DRIFT_DELAYS[index % DRIFT_DELAYS.length]}s`,
    };
}

const isNuxtIcon = (name?: string) => name?.includes(':');

</script>

<style scoped>
/* ── Container & Orbit ── */
.floating-cta-container {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    --orbit-duration: 360s;
}

.cta-ring {
    position: absolute;
    width: 0;
    height: 0;
    animation: orbit var(--orbit-duration) linear infinite;
    animation-play-state: paused;
}

.is-loaded .cta-ring {
    animation-play-state: running;
}

@keyframes orbit {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
}

.cta-slot {
    position: absolute;
    width: 0;
    height: 0;
    animation: counter-orbit var(--orbit-duration) linear infinite;
    animation-play-state: paused;
}

.is-loaded .cta-slot {
    animation-play-state: running;
}

@keyframes counter-orbit {
    from { transform: rotate(var(--angle)) translateX(38vmin) translateY(-10vmin) rotate(calc(-1 * var(--angle))) rotate(0deg); }
    to   { transform: rotate(var(--angle)) translateX(38vmin) translateY(-10vmin) rotate(calc(-1 * var(--angle))) rotate(-360deg); }
}

/* .cta-drift {
    animation: drift var(--drift-duration) ease-in-out var(--drift-delay) infinite;
}

@keyframes drift {
    0%, 100% { transform: rotate(var(--card-tilt, 0deg)) translateY(0px); }
    40%      { transform: rotate(var(--card-tilt, 0deg)) translateY(-14px); }
    65%      { transform: rotate(var(--card-tilt, 0deg)) translateY(-6px); }
} */

/* ── Card & Portal ── */
.cta-card {
    cursor: pointer;
    pointer-events: all;
    display: block;
    text-decoration: none;
    position: absolute;
    will-change: transform, opacity;
    transform: translate(-50%, -50%);
    animation: cta-entrance 0.8s ease-out var(--entrance-delay) backwards;
    animation-play-state: paused;
}

.is-loaded .cta-card {
    animation-play-state: running;
}

@keyframes cta-entrance {
    from {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.8);
    }
    to {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
}

.cta-card :deep(.surface-glass) {
    padding: 0;
    overflow: hidden;
    width: var(--icon-size);
    height: var(--icon-size);
    backdrop-filter: blur(0px);
    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1), height 0.4s cubic-bezier(0.4, 0, 0.2, 1), backdrop-filter 0s;
}

.cta-card:hover :deep(.surface-glass) {
    width:  var(--portal-w);
    height: var(--portal-h);
    backdrop-filter: blur(5px) saturate(140%);
}

.cta-icon-wrap {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.15s ease;
}

.cta-icon {
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
}

.cta-card:hover .cta-icon-wrap { opacity: 0; }

/* ── Portal Container ── */
.cta-portal {
    position: absolute;
    inset: 0;
    overflow: hidden;
    opacity: 0;
    transition: opacity 0.3s ease 0.15s;
    border-radius: inherit;
    background: radial-gradient(circle at center, transparent, var(--color-night));
    box-shadow: inset 0 0 60px 10px rgba(0, 0, 0, 0.95);
}

/* .cta-portal::after {
    content: "";
    position: absolute;
    inset: -50%; 
    z-index: 4;
    pointer-events: none;
    background-color: purple;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    mix-blend-mode: overlay;
    opacity: 0.35;
    animation: grain-dance 0.8s steps(3) infinite;
    animation-play-state: paused;
} */

.cta-card:hover .cta-portal { opacity: 1; }
.cta-card:hover .cta-portal::after { animation-play-state: running; }

/* ── Distorted Image ── */
.cta-screenshot {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%; 
    height: 100%;
    transform: translate(-50%, -50%);
    object-fit: cover;
    z-index: 1; 
    filter: blur(2px) brightness(0.8);
    mix-blend-mode: screen;
    opacity: 0.7; 
}

.cta-portal-label {
    position: absolute;
    inset: 0;
    z-index: 10; 
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    user-select: none;
}

@keyframes grain-dance {
    /* Slowed to 0.8s to reduce the repaint frequency — visually imperceptible */
    0%, 100% { transform: translate(0, 0); }
    10% { transform: translate(-1%, -2%); }
    30% { transform: translate(1%, 1%); }
    50% { transform: translate(-2%, 2%); }
    70% { transform: translate(2%, -1%); }
    90% { transform: translate(-1%, 1%); }
}

@media (prefers-reduced-motion: reduce) {
    .cta-ring, .cta-slot, .cta-drift { animation: none; }
    .cta-card :deep(.surface-glass), .cta-portal { transition: none; }
}
</style>