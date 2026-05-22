<template>
    <div v-if="variant === 'default'" class="surface default" :style="surfaceStyles">
        <slot />
    </div>
    <div v-else-if="variant === 'glass'" ref="glassRef"
        :class="['surface-glass', span ? `surface-glass--${span}` : '', directionClass]" :style="surfaceStyles">
        <slot />
    </div>
</template>

<script lang="ts" setup>


const props = defineProps<{
    color?: string,
    variant?: 'default' | 'glass',
    span?: 'wide' | 'contact' | 'normal',
    direction?: 'row' | 'column'
}>();

const glassRef = ref<HTMLElement | null>(null);
useGlassGlow(glassRef);

const directionClass = computed(() =>
    props.direction === 'row' ? 'is-row' : 'is-column'
);

const surfaceStyles = computed(() => {
    let surfaceColor = 'var(--color-primary)';
    let backgroundColor = 'rgba(255, 255, 255, 0.3)';
    let textColor = 'var(--color-primary)';

    if (props.color && props.color.trim()) {
        if (props.color.startsWith('#') || props.color.startsWith('rgb')) {
            backgroundColor = `rgba(0, 0, 0, 0.1)`;
            surfaceColor = props.color;
            textColor = props.color;
        } else if (props.color === 'primary' || props.color === 'accent') {
            surfaceColor = `var(--color-${props.color})`;
            textColor = `var(--color-${props.color})`;
        }
    }

    return {
        '--surface-color': surfaceColor,
        '--background-color': backgroundColor,
        '--text-color': textColor,
    };
});
</script>

<style scoped>
.surface {
    padding: 1rem;
    border-radius: 20pt;
}

.default {
    background-color: var(--color-surface);
}

.is-row {
    flex-direction: row !important;
}

.is-column {
    flex-direction: column !important;
}

/* ── Glass Variant ────────────────────────────────────── */
.surface-glass {
    /*
     * --bg-is-light is set on :root by Background.vue
     * 1 = light/warm bg  →  dark-tinted cards for contrast
     * 0 = dark bg        →  light-tinted cards (original look)
     *
     * Slightly higher fill opacity (0.09 vs 0.06) on dark backgrounds
     * so the card reads as glass rather than smoke.
     */
    --_dark-fill: rgba(0, 0, 0, 0.14);
    --_light-fill: rgba(200, 200, 200, 0.09);
    --_dark-border: rgba(0, 0, 0, 0.22);
    --_light-border: rgba(200, 200, 200, 0.18);

    position: relative;
    overflow: hidden;

    background: rgba(255, 255, 255, 0.01);
    background: color-mix(in srgb,
            var(--_dark-fill) calc(var(--bg-is-light, 0) * 100%),
            var(--_light-fill) calc((1 - var(--bg-is-light, 0)) * 100%));
    border: 1.5px solid color-mix(in srgb,
            var(--_dark-border) calc(var(--bg-is-light, 0) * 100%),
            var(--_light-border) calc((1 - var(--bg-is-light, 0)) * 100%));
    border-radius: 18pt;
    padding: 1.2rem 1.3rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    backdrop-filter: blur(30px) saturate(1.3) brightness(0.9);
    box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.22),
        0 2px 8px rgba(0, 0, 0, 0.12),
        0 0 0 1px rgba(255, 255, 255, 0.18),
        inset 0 1.5px 0 rgba(255, 255, 255, 0.30),
        inset 0 -1px 0 rgba(0, 0, 0, 0.12);

    transform: translateZ(0);
    backface-visibility: hidden;
    /* will-change removed: don't pre-promote all glass elements to compositor
       layers — only elements actively animating should use this hint. */
    perspective: 1000px;
    isolation: isolate;
    transition:
        background 300ms ease,
        border-color 300ms ease,
        box-shadow 300ms ease;
}

/* Diagonal specular sheen — light catching a convex glass face.
 * mix-blend-mode: screen composites cleanly over any bg colour.
 * Works in Firefox, Chrome, and Safari. */
.surface-glass::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(135deg,
            rgba(255, 255, 255, 0.28) 0%,
            rgba(255, 255, 255, 0.07) 45%,
            transparent 65%);
    mix-blend-mode: screen;
    pointer-events: none;
    z-index: 1;
    opacity: 1;
    transition: opacity 300ms ease;
}

/* Content must sit above the ::before sheen */
.surface-glass>* {
    position: relative;
    z-index: 2;
}

.surface-glass:hover {
    background: color-mix(in srgb,
            rgba(0, 0, 0, 0.30) calc(var(--bg-is-light, 0) * 100%),
            rgba(255, 255, 255, 0.12) calc((1 - var(--bg-is-light, 0)) * 100%));
    border-color: color-mix(in srgb,
            rgba(0, 0, 0, 0.20) calc(var(--bg-is-light, 0) * 100%),
            rgba(255, 255, 255, 0.30) calc((1 - var(--bg-is-light, 0)) * 100%));
    box-shadow:
        0 12px 40px rgba(0, 0, 0, 0.28),
        0 4px 12px rgba(0, 0, 0, 0.14),
        0 0 0 1px rgba(255, 255, 255, 0.26),
        inset 0 1.5px 0 rgba(255, 255, 255, 0.40),
        inset 0 -1px 0 rgba(0, 0, 0, 0.10);
}

/* On hover, brighten the specular slightly */
.surface-glass:hover::before {
    opacity: 1.0;
    /* kept full — hover is subtle via box-shadow brightening */
}

/*
 * Cursor-reactive border glow.
 * --mouse-x / --mouse-y are set in JS; default to -999% so the gradient
 * centre is far off-screen and produces no visible glow until the cursor
 * enters the element.
 *
 * The mask-composite: exclude trick carves a "border-only" window:
 * padding (2px) minus content-box = the ring that matches the border.
 */
.surface-glass::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 2px;
    /* slightly wider than the 1.5px border */
    box-sizing: border-box;
    background: radial-gradient(circle 240px at var(--mouse-x, -999%) var(--mouse-y, -999%),
            rgba(255, 255, 255, 0.1) 0%,
            transparent 100%);
    /* Mask to border strip only — works in Firefox, Chrome, Safari */
    mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    mask-composite: exclude;
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    pointer-events: none;
    z-index: 5;
}

/* Disable on touch devices — no cursor to track */
@media (hover: none) {
    .surface-glass::after {
        display: none;
    }
}

.surface-glass--wide {
    grid-column: span 2;
}

.surface-glass--contact {
    grid-column: span 2;
}
</style>