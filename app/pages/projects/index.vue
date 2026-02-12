<script setup lang="ts">
import ProjectTimeline from '~/components/Timeline/ProjectTimeline.vue';

definePageMeta({
  title: 'Projects',
  description: 'A selection of my work.',
  icon: 'solar:folder-broken',
  keywords: 'projects, portfolio, work, design, development'
})

// Get all projects to display in the timeline
const { data: projects } = await useFetch('/api/projects')
</script>

<template>
    <section>
        <h1>My favorites</h1>
        <Stack direction="horizontal" gap="1rem" justify="between">
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

</style>