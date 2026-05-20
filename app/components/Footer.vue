<script setup lang="ts">

</script>

<template>
    <footer class="footer" aria-label="Site footer">
        <h2>Jack Graddon</h2>
        <div class="footer-content">
            <div class="footer-info">
                <p>Design Engineer, Web Developer, and Graphic Designer</p>
                <p>&copy; 2026 Jack Graddon. All rights reserved.</p>
            </div>
            <div class="footer-links">
                <NuxtLink to="/">Home</NuxtLink>
                <NuxtLink to="/projects">Projects</NuxtLink>
                <NuxtLink to="/about">About</NuxtLink>
                <NuxtLink to="/contact">Contact</NuxtLink>
            </div>
        </div>
    </footer>
</template>

<style scoped>
.footer {
    position: relative;
    max-width: var(--breakpoint-lg);
    margin-inline: auto;
    padding: 3rem calc(1rem + env(safe-area-inset-right)) calc(3rem + env(safe-area-inset-bottom)) calc(1rem + env(safe-area-inset-left));
    color: var(--color-text-light);
    z-index: 9999;
}   
.footer-content {
    display: flex;
    flex-direction: row;
    gap: 1.5rem;
    width: 100%;
    justify-content: space-between;

    @media (max-width: 900px) {
        flex-direction: column;
    }
}
.footer-links {
    display: flex;
    gap: 1.5rem;
}
</style>