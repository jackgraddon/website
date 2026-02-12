<template>
  <div class="timeline-item">
    <Card :project-id="project.id"></Card>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  project: any
}>()
</script>

<style scoped>
.timeline-item {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>