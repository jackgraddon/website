<script setup lang="ts">
import Background from './background.vue';

const props = defineProps<{
    image?: string
}>();
</script>

<template>
    <div class="card" :style="{backgroundImage: props.image ? 'url(' + props.image + ')' : 'none'}">
        <slot class="card-header" name="header" />
        <slot />
        <slot class="card-footer" name="footer" />
    </div>
</template>

<style scoped>
.card {
    width: 100%;
    aspect-ratio: 1.6;
    position: relative;
    padding: 0.5rem;

    background-color: var(--color-bg-surface);
    background-position: center;
    background-size: cover;
    backdrop-filter: blur(7pt);
    
    border: 1px solid var(--color-border);
    border-radius: 32pt;

    display: flex;
    flex-direction: column;

    overflow: hidden;
}
</style>