<script setup lang="ts">

</script>

<template>
    <main class="paged-content">
        <slot />
    </main>
</template>

<style scoped>
.paged-content {
    max-width: var(--breakpoint-sm);
    margin: 0 auto;
    padding: 2rem 0;

    display: grid;
    gap: 4rem;

    section {
        height: 100vh;
        scroll-margin-top: 20vh;

        display: flex;
        flex-direction: column;
    }
}
</style>