<script setup lang="ts">
useHead({
  titleTemplate: 'Jack Graddon',
  htmlAttrs: {
    lang: 'en',
  },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'description', content: '' }
  ],
})
</script>

<template>
  <div>
    <Background />
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

