<template>
  <div :class="$style.timeline">
    <div 
      v-for="project in projectData" 
      :key="project.id" 
      :class="$style['timeline-item']"
    >
      <div
        :class="$style['timeline-icon']"
        :style="{ color: project.buttonColor }"
      >
        {{ `${project.id.slice(2, 4)}/${project.id.slice(0, 2)}` }}
      </div>
      <div
        :class="$style.tile"
        :style="{ backgroundColor: project.backgroundColor }"
      >
        <NuxtImg
          :src="`https://raw.githubusercontent.com/jackgraddon/${project.url.replace('/README.md', '/.projectDetails/ogImage.jpg')}`"
          :alt="project.name"
          width="400"
          height="300"
          style="object-fit: cover"
        />
        <NuxtLink
          class="btn"
          :to="`/project?id=${project.id}`"
          :style="{ color: project.buttonColor }"
        >
          {{ project.name }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { projectDictionary } from '~/composables/project'

const BASE_URL = "https://raw.githubusercontent.com/jackgraddon/"

interface TimelineProps {
  projects: string[]
}

interface ProjectDetails {
  id: string
  name: string
  description: string
  url: string
  backgroundColor: string
  buttonColor: string
  status: string
}

const props = defineProps<TimelineProps>()

const projectData = ref<ProjectDetails[]>([])

const fetchProjectDetails = async (id: string): Promise<ProjectDetails | null> => {
  const repo = projectDictionary[id]
  if (!repo) {
    console.error(`Project ID ${id} not found in dictionary.`)
    return null
  }
  const url = `${BASE_URL}${repo.url}`
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch details for project ID ${id}: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error(error)
    return null
  }
}

onMounted(async () => {
  const fetchedData = await Promise.all(props.projects.map(fetchProjectDetails))
  projectData.value = fetchedData.filter((data): data is ProjectDetails => data !== null)
})
</script>

<style module>
.timeline {
  display: flex;
  flex-direction: column;
  position: relative;
  margin: 20px 0 0 420px;
  padding: 0;
}

.timeline::before {
  background-color: #ccc;
  width: 4px;
  height: 100%;
  content: "";
  position: absolute;
  top: 0;
  left: -2px;
  border-radius: 7pt;
}

@media screen and (max-width: 768px), (orientation: portrait) {
  .timeline {
    width: 80%;
    margin: 0;
    gap: 0.5em;
  }
  .timeline::before {
    left: calc(50% - 2px);
    top: -10px;
    height: calc(100% + 20px);
  }
}

.timeline-item {
  display: flex;
  align-items: center;
  margin: 20px 0;
  position: relative;
}

@media screen and (max-width: 768px), (orientation: portrait) {
  .timeline-item { margin: 0; width: 100%; }
}

.timeline-item:nth-child(even) {
  flex-direction: row-reverse;
  left: -100%;
}

.timeline-item:nth-child(even) .tile {
  margin-left: 0;
  margin-right: 60px;
}

@media screen and (max-width: 768px), (orientation: portrait) {
  .timeline-item:nth-child(even) { flex-direction: row; left: 0; }
  .timeline-item:nth-child(even) .tile { margin: 0; }
}

.timeline-icon {
  background-color: white;
  border: 0.3rem solid;
  border-radius: 7pt;
  width: fit-content;
  height: 40px;
  padding: 0.4rem 0.8rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media screen and (max-width: 768px), (orientation: portrait) {
  .timeline-icon { margin: 0.5rem; z-index: 1; position: absolute; top: 0; left: 0; }
}

.tile {
  margin-left: 60px;
  margin-right: 0;
  min-width: 300px;
  max-height: 480px;
  border-radius: 7pt;
  aspect-ratio: 1.6;
  overflow: hidden;
  display: flex;
  flex-flow: column;
  justify-content: end;
  align-items: flex-start;
  position: relative;
}

@media screen and (max-width: 768px), (orientation: portrait) {
  .tile { margin: 0; width: 100%; }
}

.tile img {
  width: 100%;
  height: auto;
  object-fit: cover;
  position: absolute;
}

.tile a { margin: 0.5rem; z-index: 1; }
</style>
