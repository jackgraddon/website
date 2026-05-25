<script setup lang="ts">
definePageMeta({
  title: 'Projects',
  description: 'A selection of my work.',
  icon: 'solar:folder-broken',
  keywords: 'projects, portfolio, work, design, development'
})

const { data: projects } = await useAsyncData('all-projects', async () => {
  const all = await queryCollection('projects')
    .where('stem', '<>', '0') // Exclude the profile repo
    .all()

  // 1. Sort by stem (YYMMDD) descending - newest first
  // 2. Map to a clean object structure that matches your original API
  return all
    .sort((a, b) => Number(b.stem) - Number(a.stem))
    .map(p => ({
      ...p,
      // Overwrite the path/id to be clean for your Card component
      id: p.stem, 
      path: `/projects/${p.stem}` 
    }))
})

const favoriteIds = ['230101', '240101', '230801'];
</script>
s
<template>
    <section id="favorites">
        <h2 id="favorites-title">My favorites</h2>
        <Carousel :projectIds="favoriteIds" />    
    </section>
    <section>
        <h2>A history of my work</h2>
        <TimelineProjects class="fit-short" :projects="projects as any[]" />
    </section>
</template>

<style scoped>
section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    margin: 2rem 0;
    overflow: visible !important;
}
</style>