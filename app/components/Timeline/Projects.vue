<script lang="ts" setup>
const { data: projects } = await useAsyncData('timeline-projects', async () => {
  const all = await queryCollection('projects').all();

  return all
    .map(p => {
      return {
        id: p.stem.includes('/') ? p.stem.split('/').pop() : p.stem // Isolate just the trailing id string, eg 'projects/240701' to '240701'
      };
    })
    // Filter out the GitHub profile repo (where ID is string '0' or number 0)
    .filter(p => p.id && String(p.id) !== '0')
    // Explicitly sort greatest to least (Newest/Highest ID number first)
    .sort((a, b) => Number(b.id) - Number(a.id));
});
</script>

<template>
  <div class="timeline-container">
    <span id="line"></span>
    <TimelineItem 
        v-for="project in projects" 
        :key="project.id" 
        :project="project" 
    />
  </div>
</template>

<style scoped>
.timeline-container {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  > span#line {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 5px;
    width: 5px;
    top: 50px;
    bottom: 50px;
    background-color: var(--color-surface);
  }

  > div {
    width: calc(50% - 1rem);
    position: relative;
  }

  > div:nth-child(odd) {
    align-self: start;

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      right: 0;
      transform: translate(100%, -50%);
      border-width: 10px 0 10px 15px;
      border-style: solid;
      border-color: transparent transparent transparent var(--color-surface);
    }
  }

  > div:nth-child(even) {
    align-self: end;

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      transform: translate(-100%, -50%);
      border-width: 10px 15px 10px 0;
      border-style: solid;
      border-color: transparent var(--color-surface) transparent transparent;
    }
  }
}
</style>