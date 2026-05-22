<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { motion, useScroll, scroll, animate } from 'motion-v';
const { scrollYProgress } = useScroll();

definePageMeta({
  title: 'Projects',
  description: 'A selection of my work.',
  icon: 'solar:folder-broken',
  keywords: 'projects, portfolio, work, design, development'
})

const { data: projects } = await useFetch('/api/projects')

// 1. Define the IDs of your featured projects
const favoriteIds = ['230201', '221001', '230801'];
</script>

<template>
    <section id="favorites">
        <h2 id="favorites-title">My favorites</h2>
        <Carousel :projectIds="favoriteIds" />    
    </section>
    
    <section>
        <h2>A history of my work</h2>
        <ProjectTimeline class="fit-short" :projects="projects as any[]" />
    </section>
</template>

<style scoped>
section {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
}
</style>