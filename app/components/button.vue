<script setup lang="ts">
let props = defineProps<{
    to: string,
    color?: 'primary' | 'accent' | string, 
}>();

// Default to primary color
let buttonColor = 'var(--color-primary)';

// Only override if a valid color is provided
if (props.color && props.color.trim()) {
    if (props.color.startsWith('#')) {
        buttonColor = props.color;
    } else if (props.color === 'primary' || props.color === 'accent') {
        buttonColor = `var(--color-${props.color})`;
    }
    // Any other value falls back to default primary
}
</script>

<template>
    <NuxtLink :to="props.to" class="button" :style="{
        color: buttonColor,
        borderColor: buttonColor,
    }">
        <slot />
    </NuxtLink>
</template>

<style scoped>
.button {
    display: inline-block;
    padding: 0.7rem 1.2rem;
    cursor: pointer;
    
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5pt);

    border: 2px solid;
    border-radius: 5rem;

    font-weight: 700;
    text-align: center;
    text-decoration: none;

    transition: 150ms ease;

    &:hover {
        background-color: var(--color-primary) !important;
        color: var(--color-text) !important;
    }
}
</style>