<script setup lang="ts">
let props = defineProps<{
    variant?: 'default' | 'glass' | 'outline' | 'ghost',
    to: string,
    color?: 'primary' | 'accent' | string, 
    simple?: boolean,
}>();

// Default to primary color
let buttonColor = 'var(--color-primary)';
let backgroundColor = 'rgba(255, 255, 255, 0.3)';
let textColor = 'var(--color-primary)';
let glassBaseColor = 'white';

function getLuminance(r: number, g: number, b: number) {
    const a = [r, g, b].map(function (v) {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function parseColor(color: string) {
    if (!color) return null;
    color = color.trim().toLowerCase();
    if (color.startsWith('rgb')) {
        const match = color.match(/\d+/g);
        if (match && match.length >= 3) {
            return { r: parseInt(match[0], 10), g: parseInt(match[1], 10), b: parseInt(match[2], 10) };
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

// Only override if a valid color is provided
if (props.color && props.color.trim()) {
    if (props.color.startsWith('#') || props.color.startsWith('rgb')) {
        backgroundColor = `rgba(0, 0, 0, 0.1)`;
        buttonColor = props.color;
        textColor = props.color; // Fix: directly use the color if it's hex/rgb
        
        const parsed = !props.simple ? parseColor(props.color) : null;
        if (parsed) {
            const lum = getLuminance(parsed.r, parsed.g, parsed.b);
            const contrastWhite = 1.05 / (lum + 0.05);
            if (contrastWhite < 3.0) {
                glassBaseColor = `color-mix(in srgb, ${props.color} 20%, black)`;
                textColor = `color-mix(in srgb, ${props.color} 15%, white)`;
            }
        }
    } else if (props.color === 'primary' || props.color === 'accent') {
        buttonColor = `var(--color-${props.color})`;
        textColor = `var(--color-${props.color})`;
    }
    // Any other value falls back to default primary
}
</script>

<template>
    <NuxtLink v-if="props.variant === 'default'" :to="props.to" class="button" :style="{
        '--button-color': buttonColor,
        '--background-color': backgroundColor,
        '--text-color': textColor,
        '--glass-base-color': glassBaseColor,
    }">
        <slot />
    </NuxtLink>
    <div v-else-if="props.variant === 'glass'" class="button-glass-wrap" :style="{
        '--button-color': buttonColor,
        '--background-color': backgroundColor,
        '--text-color': textColor,
        '--glass-base-color': glassBaseColor,
    }">
        <NuxtLink :to="props.to" class="button-glass">
            <span>
                <slot />
            </span>
        </NuxtLink>
        <div class="button-glass-shadow"></div>
    </div>
</template>

<style scoped>

/* Default Button — subtle frosted pill */
.button {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    margin-top: 0.4rem;
    padding: 0.4rem 1.2rem 0.5rem 1.2rem;
    cursor: pointer;

    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(8px);
    color: var(--color-text);

    border: 1.5px solid rgba(255, 255, 255, 0.25);
    border-radius: 999px;

    font-family: 'Outfit', sans-serif;
    font-weight: 500;
    font-size: 1em;
    text-align: center;
    text-decoration: none;

    box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.15),
        0 2px 6px rgba(0, 0, 0, 0.1);

    transition: background 200ms ease, border-color 200ms ease, box-shadow 200ms ease, transform 150ms ease;

    &:hover {
        background: rgba(255, 255, 255, 0.14);
        border-color: rgba(255, 255, 255, 0.4);
        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            0 4px 10px rgba(0, 0, 0, 0.14);
        text-decoration: none;
        transform: translateY(-1px);
    }

    &:active {
        transform: scale(0.98);
        background: rgba(255, 255, 255, 0.06);
        box-shadow:
            inset 0 1px 3px rgba(0, 0, 0, 0.1),
            0 1px 3px rgba(0, 0, 0, 0.08);
    }
}

/* Glass Button Styles */

@property --angle-1 {
  syntax: "<angle>";
  inherits: false;
  initial-value: -75deg;
}

@property --angle-2 {
  syntax: "<angle>";
  inherits: false;
  initial-value: -45deg;
}

.button-glass-wrap {
    --anim--hover-time: 400ms;
    --anim--hover-ease: cubic-bezier(0.25, 1, 0.5, 1);
    
    position: relative;
    z-index: 2;
    border-radius: 999vw;
    background: transparent;
    transition: all var(--anim--hover-time) var(--anim--hover-ease);
    display: inline-block;
    margin-top: 0.4rem;
}

.button-glass-shadow {
    --shadow-cuttoff-fix: 2em;
    position: absolute;
    width: calc(100% + var(--shadow-cuttoff-fix));
    height: calc(100% + var(--shadow-cuttoff-fix));
    top: calc(0% - var(--shadow-cuttoff-fix) / 2);
    left: calc(0% - var(--shadow-cuttoff-fix) / 2);
    filter: blur(clamp(2px, 0.125em, 12px));
    overflow: visible;
    pointer-events: none;
}

.button-glass-shadow::after {
    content: "";
    position: absolute;
    z-index: 0;
    inset: 0;
    border-radius: 999vw;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1));
    width: calc(100% - var(--shadow-cuttoff-fix) - 0.25em);
    height: calc(100% - var(--shadow-cuttoff-fix) - 0.25em);
    top: calc(var(--shadow-cuttoff-fix) - 0.5em);
    left: calc(var(--shadow-cuttoff-fix) - 0.875em);
    padding: 0.125em;
    box-sizing: border-box;
    mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    mask-composite: exclude;
    transition: all var(--anim--hover-time) var(--anim--hover-ease);
    overflow: visible;
    opacity: 1;
}

.button-glass {
    --border-width: clamp(1px, 0.0625em, 4px);
    display: inline-block;
    cursor: pointer;
    position: relative;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    pointer-events: auto;
    z-index: 3;
    background-image: linear-gradient(
        -75deg,
        color-mix(in srgb, var(--button-color) 10%, transparent),
        color-mix(in srgb, var(--button-color) 30%, transparent),
        color-mix(in srgb, var(--button-color) 10%, transparent)
    );
    background-color: color-mix(in srgb, var(--glass-base-color) 60%, transparent);
    border-radius: 999vw;
    box-shadow: inset 0 0.125em 0.125em rgba(0, 0, 0, 0.05),
        inset 0 -0.125em 0.125em rgba(255, 255, 255, 0.5),
        0 0.25em 0.125em -0.125em rgba(0, 0, 0, 0.2),
        0 0 0.1em 0.25em inset rgba(255, 255, 255, 0.2),
        0 0 0 0 rgba(255, 255, 255, 1);
    backdrop-filter: blur(clamp(4px, 0.5em, 8px));
    transition: all var(--anim--hover-time) var(--anim--hover-ease);
    text-decoration: none;
}

.button-glass:hover {
    transform: scale(0.975);
    backdrop-filter: blur(clamp(2px, 0.25em, 4px));
    box-shadow: inset 0 0.125em 0.125em rgba(0, 0, 0, 0.05),
        inset 0 -0.125em 0.125em rgba(255, 255, 255, 0.5),
        0 0.15em 0.05em -0.1em rgba(0, 0, 0, 0.25),
        0 0 0.05em 0.1em inset rgba(255, 255, 255, 0.5),
        0 0 0 0 rgba(255, 255, 255, 1);
}

.button-glass span {
    position: relative;
    display: block;
    user-select: none;
    letter-spacing: -0.05em;
    font-weight: 500;
    font-size: 1em;
    color: var(--text-color);
    text-shadow: 0em 0.25em 0.08em rgba(0, 0, 0, 0.1);
    transition: all var(--anim--hover-time) var(--anim--hover-ease);
    padding: 0.4rem 1.2rem 0.5rem 1.2rem;
}

.button-glass:hover span {
    text-shadow: 0.025em 0.025em 0.025em rgba(0, 0, 0, 0.12);
}

.button-glass span::after {
    content: "";
    display: block;
    position: absolute;
    z-index: 1;
    width: calc(100% - var(--border-width));
    height: calc(100% - var(--border-width));
    top: calc(0% + var(--border-width) / 2);
    left: calc(0% + var(--border-width) / 2);
    box-sizing: border-box;
    border-radius: 999vw;
    overflow: clip;
    background: linear-gradient(
        var(--angle-2),
        color-mix(in srgb, var(--button-color) 0%, rgba(255, 255, 255, 0.2)) 0%,
        color-mix(in srgb, var(--button-color) 15%, rgba(255, 255, 255, 0.4)) 40% 50%,
        color-mix(in srgb, var(--button-color) 0%, rgba(255, 255, 255, 0.2)) 55%
    );
    z-index: 3;
    mix-blend-mode: screen;
    pointer-events: none;
    background-size: 200% 200%;
    background-position: 0% 50%;
    background-repeat: no-repeat;
    transition: background-position calc(var(--anim--hover-time) * 1.25)
        var(--anim--hover-ease),
        --angle-2 calc(var(--anim--hover-time) * 1.25) var(--anim--hover-ease);
}

.button-glass:hover span::after {
    background-position: 25% 50%;
}

.button-glass:active span::after {
    background-position: 50% 15%;
    --angle-2: -15deg;
}

.button-glass::after {
    content: "";
    position: absolute;
    z-index: 1;
    inset: 0;
    border-radius: 999vw;
    width: calc(100% + var(--border-width));
    height: calc(100% + var(--border-width));
    top: calc(0% - var(--border-width) / 2);
    left: calc(0% - var(--border-width) / 2);
    padding: var(--border-width);
    box-sizing: border-box;
    background: conic-gradient(
        from var(--angle-1) at 50% 50%,
        color-mix(in srgb, var(--button-color) 50%, black),
        rgba(0, 0, 0, 0) 5% 40%,
        color-mix(in srgb, var(--button-color) 50%, black) 50%,
        rgba(0, 0, 0, 0) 60% 95%,
        color-mix(in srgb, var(--button-color) 50%, black)
    ),
    linear-gradient(180deg, color-mix(in srgb, var(--button-color) 50%, white), color-mix(in srgb, var(--button-color) 50%, white));
    mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    mask-composite: exclude;
    transition: all var(--anim--hover-time) var(--anim--hover-ease),
    --angle-1 500ms ease;
    box-shadow: inset 0 0 0 calc(var(--border-width) / 2) color-mix(in srgb, var(--button-color) 50%, white);
}

.button-glass:hover::after {
    --angle-1: -125deg;
}

.button-glass:active::after {
    --angle-1: -75deg;
}

.button-glass-wrap:has(.button-glass:hover) .button-glass-shadow {
    filter: blur(clamp(2px, 0.0625em, 6px));
}

.button-glass-wrap:has(.button-glass:hover) .button-glass-shadow::after {
    top: calc(var(--shadow-cuttoff-fix) - 0.875em);
    opacity: 1;
}

.button-glass-wrap:has(.button-glass:active) {
    transform: rotate3d(1, 0, 0, 25deg);
}

.button-glass-wrap:has(.button-glass:active) .button-glass {
    box-shadow: inset 0 0.125em 0.125em rgba(0, 0, 0, 0.05),
        inset 0 -0.125em 0.125em rgba(255, 255, 255, 0.5),
        0 0.125em 0.125em -0.125em rgba(0, 0, 0, 0.2),
        0 0 0.1em 0.25em inset rgba(255, 255, 255, 0.2),
        0 0.225em 0.05em 0 rgba(0, 0, 0, 0.05),
        0 0.25em 0 0 rgba(255, 255, 255, 0.75),
        inset 0 0.25em 0.05em 0 rgba(0, 0, 0, 0.15);
}

.button-glass-wrap:has(.button-glass:active) .button-glass-shadow::after {
    top: calc(var(--shadow-cuttoff-fix) - 0.5em);
    opacity: 0.75;
}

.button-glass-wrap:has(.button-glass:active) span {
    text-shadow: 0.025em 0.25em 0.05em rgba(0, 0, 0, 0.12);
}

/* Touch Devices */
@media (hover: none) and (pointer: coarse) {
    .button-glass span::after,
    .button-glass:active span::after {
        --angle-2: -45deg;
    }
    .button-glass::after,
    .button-glass:hover::after,
    .button-glass:active::after {
        --angle-1: -75deg;
    }
}
</style>