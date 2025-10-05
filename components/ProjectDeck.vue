<template>
  <div :class="$style.deck">
    <div
      v-for="project in projectData"
      :key="project.id"
      :class="$style.tile"
      :style="{ backgroundColor: project.backgroundColor }"
    >
      <NuxtImg
        :src="`https://raw.githubusercontent.com/jackgraddon/${project.url.replace('.projectDetails/details.json', '.projectDetails/ogImage.jpg')}`"
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
import { ref, onMounted, watch } from 'vue';
import { projectDictionary } from '~/utils/project';

// Define base URL for the project images
const BASE_URL = 'https://raw.githubusercontent.com/jackgraddon/';

interface ProjectDeckProps {
  firstId: string;
  secondId: string;
  thirdId: string;
}

interface ProjectDetails {
  id: string;
  name: string;
  description: string;
  url: string;
  backgroundColor: string;
  buttonColor: string;
  status: string;
}

const props = defineProps<ProjectDeckProps>();
const projectData = ref<ProjectDetails[]>([]);

const fetchProjectDetails = async (id: string): Promise<ProjectDetails | null> => {
  const repo = projectDictionary[id];
  if (!repo) {
    console.error(`Project ID ${id} not found in dictionary.`);
    return null;
  }
  const url = `${BASE_URL}${repo.url}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch details for project ID ${id}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

const fetchAllProjects = async () => {
  const ids = [props.firstId, props.secondId, props.thirdId];
  const fetchedData = await Promise.all(ids.map(fetchProjectDetails));
  // Filter out null results and set the project data
  projectData.value = fetchedData.filter((data): data is ProjectDetails => data !== null);
};

onMounted(() => {
  fetchAllProjects();
});

watch(() => [props.firstId, props.secondId, props.thirdId], () => {
  fetchAllProjects();
});
</script>

<style module lang="sass" src="./deck.module.sass"></style>
