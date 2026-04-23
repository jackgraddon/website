<script setup lang="ts">
import { motion, useScroll, scroll, animate } from 'motion-v';
import ProjectTimeline from '~/components/Timeline/ProjectTimeline.vue';

const { scrollYProgress } = useScroll();

definePageMeta({
  title: 'Projects',
  description: 'A selection of my work.',
  icon: 'solar:folder-broken',
  keywords: 'projects, portfolio, work, design, development'
})

// Get all projects to display in the timeline
const { data: projects } = await useFetch('/api/projects')

// Scroll animations
onMounted(() => {
    // Favorite Projects
    scroll(animate(document.querySelector('#favorites-title')!, { 
        opacity: [0, 1, 1, 0],
        filter: ["blur(10px)", "blur(0px)", "blur(0px)", "blur(10px)"],
    }), {
        target: document.querySelector('#favorites-title')!,
        offset: ["start end", "start center", "end center", "end start"],
    })
    document.querySelectorAll("#favorites-stack > div").forEach((item, i) => {
        scroll(animate(item, { 
            opacity: [0, 1, 1, 0],
            filter: ["blur(10px)", "blur(0px)", "blur(0px)", "blur(10px)"],
            y: [20, 0, 0, -40],
        }, {
            delay: i * 0.05,
        }), {
            target: item,
            offset: ["start end", "end end", "start start", "end start"],
        })
    })
})
</script>

<template>
    <section id="favorites">
        <h2 id="favorites-title">My favorites</h2>
        <Stack direction="horizontal" gap="1rem" justify="between" id="favorites-stack">
            <Card project-id="230201"></Card>
            <Card project-id="221001"></Card>
            <Card project-id="230801"></Card>
        </Stack>
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