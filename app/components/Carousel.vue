<script setup lang="ts">
import { ref, computed } from 'vue';

const props = withDefaults(defineProps<{
    projectIds?: string[]
}>(), {
    projectIds: () => []
});

const { data: projectsData } = await useAsyncData(`carousel-projects-${props.projectIds.join('-')}`, async () => {
    if (!props.projectIds || props.projectIds.length === 0) return [];
    
    const results = await Promise.all(
        props.projectIds.map(id => queryCollection('projects').path(`/projects/${id}`).first())
    );
    
    return results.filter(Boolean);
});

const activeIndex = ref(0);

// Safely extract the active project without optional chaining on .value
const activeProject = computed(() => {
    const data = projectsData.value;
    if (!data || data.length === 0) return null;
    return data[activeIndex.value];
});

const activeId = computed(() => {
    const ids = props.projectIds;
    if (!ids || ids.length === 0) return null;
    return ids[activeIndex.value];
});

// Data for the currently active project (Main display)
const buttonLink = computed(() => {
    const id = activeId.value;
    return id ? `/projects/${id}` : undefined;
});

// Bulletproof color extraction
const buttonColor = computed(() => {
    const project = activeProject.value;
    if (!project) return 'primary';
    return project.buttonColor || (project.meta && project.meta.buttonColor) || 'primary';
});

const backgroundColor = computed(() => {
    const project = activeProject.value;
    if (!project) return undefined;
    return project.backgroundColor || (project.meta && project.meta.backgroundColor) || undefined;
});

// Helper functions for the bottom nav buttons
const getProjectColor = (project: any) => {
    if (!project) return 'primary';
    return project.buttonColor || (project.meta && project.meta.buttonColor) || 'primary';
};

const getProjectBg = (project: any) => {
    if (!project) return undefined;
    return project.backgroundColor || (project.meta && project.meta.backgroundColor) || undefined;
};

function selectProject(index: number) {
    activeIndex.value = index;
}

console.log('RIGHT HERE', activeProject);
</script>

<template>
  <Surface variant="glass" class="carousel-container">
    <transition name="fade" mode="out-in">
      <div class="background-layer" :key="activeId || 'empty'">
        <!-- <iframe 
          v-if="buttonLink" 
          :src="buttonLink" 
          class="background-iframe"
          tabindex="-1"
          aria-hidden="true"
        ></iframe> -->
        <div class="iframe-overlay"></div>
      </div>
    </transition>
    <div class="content-layer">
      <transition name="fade" mode="out-in">
        <Surface variant="glass" :style="{ backgroundImage: `url(${buttonLink}/ogImage.jpg)` }" class="info-panel" :key="activeId || 'empty'" />
      </transition>
    </div>

    <div class="carousel-nav">
      <Button 
        v-for="(project, index) in projectsData" 
        :key="project!.id || index"
        @click="selectProject(index)"
        :color="getProjectColor(project)"
        variant="glass"
        class="nav-btn"
      >
        {{ project!.title }}
      </Button>
    </div>
  </Surface>
</template>

<style scoped>
.carousel-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 600px;
  display: flex;
  flex-direction: column;
}

.background-layer {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.background-iframe {
  width: 100%;
  height: 100%;
  border: none;
  pointer-events: none;
  user-select: none;
  object-fit: cover;
}

.iframe-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top, 
    rgba(0, 0, 0, 0.2) 0%,
    transparent 100%
  );
  backdrop-filter: blur(3px);
}

.content-layer {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  align-items: flex-end;
  padding: 2rem;
}

.info-panel {
  width: 100%;
  max-width: 350px;
  aspect-ratio: 1280/800;
  background-position: center;
  background-size: cover;
  border-radius: 20px;
}

.text-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
}

.text-content p {
  margin: 0;
  line-height: 1.6;
  opacity: 0.85;
}

.carousel-nav {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 1rem;
  padding: 0 2rem 2rem 2rem;
}

.nav-btn {
  flex: 1;
  justify-content: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>