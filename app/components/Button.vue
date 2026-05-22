<script setup lang="ts">
const props = defineProps<{
    variant?: 'default' | 'glass' | 'outline' | 'ghost' | 'tab' | 'solid',
    to?: string,
    color?: 'primary' | 'accent' | string,
    bg?: string,
    active?: boolean,
    type?: 'button' | 'submit' | 'reset',
}>();

// --- Reactive State & Color Logic ---
function getLuminance(r: number, g: number, b: number) {
    const a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0]! * 0.2126 + a[1]! * 0.7152 + a[2]! * 0.0722;
}

function parseColor(color: string) {
    if (!color) return null;
    color = color.trim().toLowerCase();
    if (color.startsWith('rgb')) {
        const match = color.match(/\d+/g);
        if (match && match.length >= 3) {
            return { r: parseInt(match[0]!, 10), g: parseInt(match[1]!, 10), b: parseInt(match[2]!, 10) };
        }
    } else if (color.startsWith('#')) {
        let hex = color.slice(1);
        if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
        if (hex.length >= 6) {
            return {
                r: parseInt(hex.substring(0, 2), 16),
                g: parseInt(hex.substring(2, 4), 16),
                b: parseInt(hex.substring(4, 6), 16)
            };
        }
    }
    return null;
}

const buttonColor = computed(() => {
    if (props.color === 'primary' || props.color === 'accent') {
        return `var(--color-${props.color})`;
    }
    return props.color || 'white';
});

const isLight = computed(() => {
    if (props.bg) {
        const p = parseColor(props.bg);
        if (p) return getLuminance(p.r, p.g, p.b) > 0.45;
    }
    if (props.color === 'primary' || props.color === 'accent') return false; 
    const p = parseColor(buttonColor.value);
    if (!p) return true; 
    return getLuminance(p.r, p.g, p.b) > 0.45;
});

const textColor = computed(() => {
    const isNeutral = !props.color || 
                      props.color === 'white' || 
                      props.color === '#fff' || 
                      props.color === '#ffffff';

    

    if (isNeutral) return 'rgba(255, 255, 255, 0.92)';
    if (isLight.value) {
        return `color-mix(in srgb, ${buttonColor.value} 85%, black)`;
    } else {
        return `color-mix(in srgb, ${buttonColor.value} 25%, white)`;
    }
});

const glassRef = ref(null);
useGlassGlow(glassRef);
</script>

<template>
    <NuxtLink
        v-if="to"
        :to="to"
        ref="glassRef"
        :class="[
            'button', 
            variant ? `variant-${variant}` : 'variant-default', 
            { 'is-active': active, 'is-light': isLight }
        ]"
        :style="{ 
            '--button-color': buttonColor,
            '--base-text-color': textColor
        }"
    >
        <slot />
    </NuxtLink>
    <button
        v-else
        :type="type || 'button'"
        ref="glassRef"
        :class="[
            'button', 
            variant ? `variant-${variant}` : 'variant-default', 
            { 'is-active': active, 'is-light': isLight }
        ]"
        :style="{ 
            '--button-color': buttonColor,
            '--base-text-color': textColor
        }"
    >
        <slot />
    </button>
</template>

<style scoped>
.button {
    /* Shared Glass Tokens (Consistent with Surface.vue) */
    --_dark-fill:  rgba(0,   0,   0,   0.14);
    --_light-fill: rgba(200, 200, 200, 0.09);
    --_dark-border:  rgba(0,   0,   0,   0.22);
    --_light-border: rgba(200, 200, 200, 0.18);

    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.45rem 1.2rem 0.55rem 1.2rem;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    border-radius: 999px;
    
    font-family: 'Outfit', sans-serif;
    font-weight: 600;
    font-size: 1em;
    text-decoration: none;

    /* 
     * GLOBAL REACTIVE GLASS LOGIC
     * All buttons react to background brightness by default.
     * We mix in a tiny bit of the brand color (4%) to anchor it.
     */
    background: color-mix(
        in srgb,
        var(--button-color) 4%,
        color-mix(
            in srgb,
            var(--_dark-fill)  calc(var(--bg-is-light, 0) * 100%),
            var(--_light-fill) calc((1 - var(--bg-is-light, 0)) * 100%)
        )
    );

    border: 1.5px solid color-mix(
        in srgb,
        var(--button-color) 25%,
        color-mix(
            in srgb,
            var(--_dark-border)  calc(var(--bg-is-light, 0) * 100%),
            var(--_light-border) calc((1 - var(--bg-is-light, 0)) * 100%)
        )
    );

    /* Text color: Light for legibility on dark/saturated backgrounds */
    color: var(--base-text-color);
    
    backdrop-filter: blur(8px) saturate(130%) brightness(90%);
    box-shadow:
        0 4px 12px rgba(0, 0, 0, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.15);

    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateZ(0);
}

.button:hover {
    transform: translateY(-2px);
    background: color-mix(
        in srgb,
        var(--button-color) 15%,
        color-mix(
            in srgb,
            rgba(0,   0,   0,   0.25) calc(var(--bg-is-light, 0) * 100%),
            rgba(255, 255, 255, 0.15) calc((1 - var(--bg-is-light, 0)) * 100%)
        )
    );
    box-shadow:
        0 8px 24px rgba(0, 0, 0, 0.12),
        0 0 15px color-mix(in srgb, var(--button-color) 25%, transparent);
}

.button.is-active {
    background: color-mix(
        in srgb,
        var(--button-color) 25%,
        color-mix(
            in srgb,
            rgba(0,   0,   0,   0.25) calc(var(--bg-is-light, 0) * 100%),
            rgba(255, 255, 255, 0.25) calc((1 - var(--bg-is-light, 0)) * 100%)
        )
    );
    border-color: color-mix(in srgb, var(--button-color) 50%, rgba(255, 255, 255, 0.4));
    box-shadow: 
        0 4px 12px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

/* --- Variant: Glass (Pure transparency, no brand tint) --- */
.variant-glass {
    background: color-mix(
        in srgb,
        var(--_dark-fill)  calc(var(--bg-is-light, 0) * 100%),
        var(--_light-fill) calc((1 - var(--bg-is-light, 0)) * 100%)
    );
}

/* Premium Sheen for Glass & Default variants */
.variant-glass::before, 
.variant-default::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.22) 0%,
        rgba(255, 255, 255, 0.05) 45%,
        transparent 65%
    );
    mix-blend-mode: screen;
    pointer-events: none;
    z-index: 1;
    opacity: 0.8;
}

/* --- Variant: Tab --- */
.variant-tab {
    background: transparent;
    border: 1px solid transparent;
    padding: 0.4rem 1rem;
    font-weight: 500;
    backdrop-filter: blur(8px) saturate(130%) brightness(90%);
    box-shadow: none;
}

.variant-tab.is-active {
    background: color-mix(
        in srgb,
        var(--button-color) 12%,
        color-mix(
            in srgb,
            rgba(0,   0,   0,   0.12) calc(var(--bg-is-light, 0) * 100%),
            rgba(255, 255, 255, 0.12) calc((1 - var(--bg-is-light, 0)) * 100%)
        )
    );
    border-color: color-mix(
        in srgb,
        var(--button-color) 30%,
        rgba(255, 255, 255, 0.15)
    );
    backdrop-filter: blur(8px);
}

/* --- Variant: Solid (Non-glassy backup) --- */
.variant-solid {
    background: var(--button-color);
    color: var(--base-text-color);
    backdrop-filter: none;
}

/* --- Flashlight Effect --- */
.button::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 2px;
    box-sizing: border-box;
    background: radial-gradient(
        circle 120px at var(--mouse-x, -999%) var(--mouse-y, -999%),
        color-mix(in srgb, var(--button-color) 40%, transparent) 0%,
        color-mix(in srgb, var(--button-color) 20%, transparent) 60%,
        transparent 100%
    );
    mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    mask-composite: exclude;
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    opacity: 0.4;
    transition: opacity 1s ease;
    pointer-events: none;
    z-index: 2;
}

.button:hover::after {
    opacity: 1;
}

/* Ensure slot content stays above sheen/flashlight */
.button > * {
    position: relative;
    z-index: 5;
}
</style>