<script setup lang="ts">
let props = defineProps<{
    to: string
}>();
</script>

<template>
    <NuxtLink :to="props.to" class="button">
        <slot />
    </NuxtLink>
</template>

<style scoped>
.button {
    display: inline-block;
    padding: 0.7rem 1.2rem;
    
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5pt);

    border: 1px solid var(--color-primary);
    border-radius: 5rem;
    
    color: var(--color-text);
    font-weight: 600;
    text-align: center;
    text-decoration: none;
}
</style>