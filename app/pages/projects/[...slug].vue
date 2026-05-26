<script lang="ts" setup>
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('projects').path(route.path).first()
})

useSeoMeta({
  ogImage: `/${page.value?.stem}/ogImage.jpg`
})
</script>

<template>
  <div class="fit-short">
    <ContentRenderer
      v-if="page"
      :value="page"
    />
  </div>
</template>

<style>
table {
  width: 150%;
  margin-left: -25%;
  margin-right: -25%;
}
img {
  width: 100%;
  border-radius: 1rem;
}
</style>
