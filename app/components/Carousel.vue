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

const buttonLink = computed(() => {
    const id = activeId.value;
    return id ? `/projects/${id}` : undefined;
});

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
      <div
        class="background-layer"
        :key="activeId || 'empty'"
        :style="{ backgroundImage: `url('${buttonLink}/screenshots/1-1.png')` }"
      />
    </transition>
    <transition name="fade" mode="out-in">
      <div
        class="background-overlay"
        :key="activeId || 'empty'"
        :style="{ backgroundColor: `color-mix(in srgb, ${buttonColor} 15%, transparent)`}"
      />
    </transition>
    <div class="content-layer">
      <transition name="fade" mode="out-in">
        <Card :project-id="activeId!" style="max-width: 300px; flex: 2;" :key="activeId || 'empty'" />
      </transition>
      <transition name="fade" mode="out-in">
        <div class="text-content" v-if="activeProject" :key="activeId || 'empty'">
          <h3>{{ activeProject.title }}</h3>
          <p class="description" v-if="activeProject.description">
            {{ activeProject.description }}
          </p>
        </div>
      </transition>
    </div>

    <div class="carousel-nav">
      <Button 
        v-for="(project, index) in projectsData" 
        :key="projectIds[index] || index"
        @click="selectProject(index)"
        :color="getProjectColor(project)"
        variant="glass"
        class="nav-btn"
        :style="{ '--color': getProjectColor(project) }"
        :class="{ active: projectIds[index] === activeId }"
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
  width: 100%;
  height: 100%;
  z-index: -1;
  background-size: cover;
  background-position: center;
  opacity: 0.1;
  filter: blur(5px);
}
.background-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.content-layer {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  padding: 2rem;
  gap: 0.5rem;

  .text-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0rem;
    max-width: 550px;
    margin-bottom: 10px;
  }

  .text-content h3 {
    margin: 0;
  }

  .text-content p {
    margin: 0;
  }
}

.carousel-nav {
  position: relative;
  width: 100%;
  z-index: 1;
  display: flex;
  gap: 0.5rem;
  padding: 0 2rem 2rem 2rem;

  .nav-btn {
    flex-grow: 0;
    min-width: fit-content;

    &.active {
      flex-grow: 1;
      background: var(--color);
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .carousel-container {
    min-height: 450px;
  }
  
  .content-layer {
    padding: 0.5rem;
    justify-content: center;
  }

  .carousel-nav {
    flex-direction: column;
    padding: 0.5rem;
    gap: 0.5rem;
    width: 100%;
    
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .carousel-nav::-webkit-scrollbar {
    display: none;
  }
}

@media (max-width: 960px) {
  .content-layer {
    align-items: flex-start;
    flex-direction: column;
  }

  .text-content {
    margin: 0;
  }
}
</style>