<script setup lang="ts">

</script>

<template>
    <main class="paged-content">
        <slot />
    </main>
</template>

<style>
.paged-content {
    max-width: var(--breakpoint-sm);
    margin: 0 auto;
    padding: 2rem 0;

    display: grid;
    gap: 4rem;
    
    > section {
        min-height: 100vh;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: start;
    }
}
</style>