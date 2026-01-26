<script setup lang="ts">
let props = defineProps<{
    to: string,
    color?: 'primary' | 'accent' | string, 
}>();

// Default to primary color
let buttonColor = 'var(--color-primary)';

// Only override if a valid color is provided
if (props.color && props.color.trim()) {
    if (props.color.startsWith('#') || props.color.startsWith('rgb')) {
        buttonColor = props.color;
    } else if (props.color === 'primary' || props.color === 'accent') {
        buttonColor = `var(--color-${props.color})`;
    }
    // Any other value falls back to default primary
}
</script>

<template>
    <NuxtLink :to="props.to" class="button" :style="{
        '--button-color': buttonColor,
    }">
        <slot />
    </NuxtLink>
</template>

<style scoped>
.button {
    display: inline-block;
    padding: 0.4rem 1.2rem 0.5rem 1.2rem;
    cursor: pointer;
    
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5pt);
    color: var(--button-color);

    border: 2px solid var(--button-color);
    border-radius: 5rem;

    font-weight: 700;
    text-align: center;
    text-decoration: none;

    transition: 150ms ease;

    &:hover {
        background-color: var(--button-color) !important;
        color: var(--color-text) !important;
    }
}
</style>