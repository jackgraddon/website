<script setup lang="ts">
const props = defineProps<{
    variant?: 'default' | 'glass' | 'outline' | 'ghost',
    to?: string,
    color?: 'primary' | 'accent' | string,
    bg?: string,
    active?: boolean,
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
    // If a specific background color is provided, use that to determine text contrast
    if (props.bg) {
        const p = parseColor(props.bg);
        if (p) return getLuminance(p.r, p.g, p.b) > 0.45;
    }
    
    // Check for theme variables
    if (props.color === 'primary' || props.color === 'accent') return false; 

    // Fallback to button color luminance
    const p = parseColor(buttonColor.value);
    if (!p) return true; // Default to light if we can't parse
    return getLuminance(p.r, p.g, p.b) > 0.45;
});

const textColor = computed(() => {
    if (isLight.value) {
        // Light Background: "Saturated Ink" - 75% brand color, 25% black for depth
        return `color-mix(in srgb, ${buttonColor.value} 90%, white)`;
    } else {
        // Dark Background: "Bright Glow" - 85% white, 15% brand color for clarity
        return `color-mix(in srgb, ${buttonColor.value} 10%, white)`;
    }
});

const glassRef = ref(null);
useGlassGlow(glassRef);
</script>

<template>
    <NuxtLink
        v-if="!props.variant || props.variant === 'default'"
        :to="props.to"
        ref="glassRef"
        class="button"
        :class="{ 'is-light': isLight }"
        :style="{ 
            '--button-color': buttonColor,
            '--text-color': textColor
        }"
    >
        <slot />
    </NuxtLink>

    <div v-else-if="props.variant === 'glass'" class="button-glass-wrap" :style="{ 
        '--button-color': buttonColor,
        '--text-color': textColor
    }">
        <NuxtLink :to="props.to" class="button-glass" :class="{ 'is-light': isLight }">
            <span><slot /></span>
        </NuxtLink>
    </div>

    <button
        v-else-if="props.variant === 'tab'"
        :class="['button-tab', { active: props.active, 'is-light': isLight }]"
        :style="{ 
            '--button-color': buttonColor,
            '--text-color': textColor 
        }"
        ref="glassRef"
        type="button"
    >
        <slot />
    </button>
</template>

<style scoped>
.button {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 1.2rem 0.55rem 1.2rem;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    border-radius: 999px;
    
    font-family: 'Outfit', sans-serif;
    font-weight: 600;
    font-size: 1em;
    text-decoration: none;

    /* Strongly tinted text, no shadow */
    color: var(--text-color);

    /* Frosted Background with a 12% tint to anchor it to the color */
    background: color-mix(in srgb, var(--button-color) 12%, rgba(255, 255, 255, 0.12));
    backdrop-filter: blur(6px) saturate(150%);
    
    /* Branded Border: 35% mix ensures visibility on white backgrounds */
    border: 1.5px solid color-mix(in srgb, var(--button-color) 35%, rgba(255, 255, 255, 0.2));
    
    box-shadow:
        0 4px 12px rgba(0, 0, 0, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);

    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.button:hover {
    transform: translateY(-2px);
    /* Increase saturation/tint on hover instead of washing out */
    color: color-mix(in srgb, var(--text-color) 80%, var(--button-color));
    background: color-mix(in srgb, var(--button-color) 20%, rgba(255, 255, 255, 0.18));
    box-shadow:
        0 8px 24px rgba(0, 0, 0, 0.12),
        0 0 15px color-mix(in srgb, var(--button-color) 25%, transparent);
}

/* Remove separate is-light hover color overrides to keep the saturated mix uniform */

/* --- Inherited Flashlight Effect --- */
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

/* --- Variant Overrides --- */
.button-glass span {
    color: var(--text-color);
    font-weight: 500;
    padding: 0.45rem 1.2rem 0.55rem 1.2rem;
    display: block;
}

.button-glass {
    background-color: color-mix(in srgb, var(--button-color) 12%, rgba(255, 255, 255, 0.1));
    border-radius: 999px;
    backdrop-filter: blur(6px) saturate(150%);
    border: 1px solid color-mix(in srgb, var(--button-color) 40%, rgba(255, 255, 255, 0.2));
    transition: all 0.4s ease;
    text-decoration: none;
}

.button-glass:hover span {
    color: color-mix(in srgb, var(--text-color) 80%, var(--button-color));
}

.button-tab {
    background: transparent;
    border: 1px solid transparent;
    padding: 0.4rem 1rem;
    font-weight: 500;
    color: color-mix(in srgb, var(--text-color) 60%, transparent);
    transition: 0.3s ease;
}

.button-tab.active {
    color: var(--text-color);
    background: color-mix(in srgb, var(--button-color) 10%, rgba(255, 255, 255, 0.1));
    border-color: color-mix(in srgb, var(--button-color) 30%, rgba(255, 255, 255, 0.2));
}
</style>