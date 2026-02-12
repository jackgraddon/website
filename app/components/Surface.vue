<template>
  <div :class="variant">
    <slot />
  </div>
</template>

<script lang="ts" setup>
defineProps<{ 
  color?: string,
  variant?: 'default' | 'glass',
}>();
</script>

<style scoped>
div {
  padding: 1rem;
  border-radius: 14pt;
}
.default {
    background-color: var(--color-surface);
}
.glass {
    background-color: color-mix(in srgb, var(--color-surface), rgba(255, 255, 255, 0.1));
    backdrop-filter: blur(7pt);
}
</style>