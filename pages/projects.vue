<template>
  <div>
    <Splash title="Projects" subtitle="My Portfolio" />
    <main>
      <section>
        <h2>Top Projects</h2>
        <ProjectDeck :first-id="topProjects[0]" :second-id="topProjects[1]" :third-id="topProjects[2]" />
      </section>
      <section>
        <h2>All Projects</h2>
        <p>See all my latest projects, newest to oldest.</p>
        <Timeline :projects="timelineProjects" />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
/**
 * Name: Projects Page
 * Description: A page listing all projects with a timeline and deck of cards.
 * Author: Jack Graddon
 */
import { projectDictionary } from '~/composables/project'

const topProjects = ["221001", "230201", "230801"]

// Convert projectDictionary to an array of IDs and sort them by ID (descending)
const timelineProjects = Object.keys(projectDictionary)
  .sort((a, b) => parseInt(b) - parseInt(a))

useHead({
  title: 'Projects | Jack Graddon',
  meta: [
    { name: 'description', content: 'Check out all of my latest projects, from web development to graphic design.' }
  ]
})
</script>
