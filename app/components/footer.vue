<script setup lang="ts">

</script>

<template>
    <footer class="footer">
        <h2>Jack Graddon</h2>
        <div class="footer-content">
            <div class="footer-info">
                <p>Design Engineer, Web Developer, and Graphic Designer</p>
                <p>&copy; 2026 Jack Graddon. All rights reserved.</p>
            </div>
            <div class="footer-links">
                <NuxtLink to="/">Home</NuxtLink>
                <NuxtLink to="/projects">Projects</NuxtLink>
                <NuxtLink to="/contact">Contact</NuxtLink>
            </div>
        </div>
    </footer>
</template>

<style scoped>
.footer {
    max-width: var(--breakpoint-lg);
    padding: 3rem 1rem;
    margin-inline: auto;
    color: var(--color-text-light);
}   
.footer-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    justify-items: start;
}
.footer-links {
    display: flex;
    gap: 1.5rem;
}
</style>