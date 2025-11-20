<template>
  <div :class="$style.deck">
    <div
      v-for="project in projectData"
      :key="project.id"
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
</template>

<script setup lang="ts">
/**
 * Name: Project Deck
 * Description: Displays three projects on cards with an image and a button to navigate to the project page with more details about it.
 * Author: Jack Graddon
 */
import { onMounted, ref } from 'vue'
import { projectDictionary } from '~/composables/project'

// Define base URL for the project images
const BASE_URL = 'https://raw.githubusercontent.com/jackgraddon/'

// Define project data
interface ProjectDeckProps {
  firstId: string
  secondId: string
  thirdId: string
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

const props = defineProps<ProjectDeckProps>()

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
  const ids = [props.firstId, props.secondId, props.thirdId]
  const fetchedData = await Promise.all(ids.map(fetchProjectDetails))
  // Filter out null results and set the project data
  projectData.value = fetchedData.filter((data): data is ProjectDetails => data !== null)
})
</script>

<style module>
.deck {
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  gap: 0.5rem;
}

.tile {
  flex-grow: 1;
  flex-basis: 32%;
  min-width: 300px;
  max-height: 480px;
  border-radius: 7pt;
  aspect-ratio: 1.6;
  overflow: hidden;
  display: flex;
  flex-flow: column;
  justify-content: flex-end;
  align-items: flex-start;
  position: relative;
}

.tile img {
  width: 100%;
  height: auto;
  object-fit: cover;
  position: absolute;
}

.tile a {
  margin: 0.5rem;
  z-index: 1;
}
</style>
