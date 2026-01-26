<script setup lang="ts">
// Get current time for dynamic elements
let now = new Date().getHours();

// Define theme-color based on time of day
const backgroundStyle = computed(() => {
    return (now >= 6 && now < 12) ? '#46016b' :
           (now >= 12 && now < 18) ? '#067bbb' :
           (now >= 18 && now < 21) ? '#ffb1b1' :
           '#13001d';
});


useHead({
  htmlAttrs: {
    lang: 'en',
  },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'author', content: 'Jack Graddon' },
    { name: 'theme-color', content: backgroundStyle.value },
  ],
})

// Get current route metadata for dynamic head management
const route = useRoute();
const routeMeta = computed(() => ({
  title: (route.meta.title as string == 'Home') ? 'Jack Graddon' : route.meta.title as string,
  description: route.meta.description as string || '',
  icon: route.meta.icon as string || ''
}));

// Fetch content metadata for content routes
const { data: contentPage } = await useAsyncData(
  () => `content-${route.path}`,
  async () => {
    if (route.path.startsWith('/projects/') && route.path !== '/projects' && route.path !== '/projects/') {
      try {
        return await queryCollection('content').path(route.path).first()
      } catch (e) {
        return null
      }
    }
    return null
  },
  { watch: [() => route.path] }
)

// Compute effective metadata (from route meta or content)
const effectiveMeta = computed(() => {
  if (contentPage.value) {
    const page = contentPage.value as any
    return {
      title: page.title || 'Project',
      description: page.description || '',
      icon: page.meta?.icon || ''
    }
  }
  return routeMeta.value
})

// Get route meta to adjust app meta
watch(() => route.path, () => {
  const meta = effectiveMeta.value
  if (meta.title || meta.description) {
    useHead({
      title: (meta.title == 'Home') ? 'Jack Graddon' : `${meta.title} | Jack Graddon`,
      meta: [
        { name: 'description', content: meta.description }
      ]
    });
  }
}, { immediate: true });

watch(() => contentPage.value, () => {
  const meta = effectiveMeta.value
  if (meta.title || meta.description) {
    useHead({
      title: (meta.title == 'Home') ? 'Jack Graddon' : `${meta.title} | Jack Graddon`,
      meta: [
        { name: 'description', content: meta.description }
      ]
    });
  }
}, { immediate: true });

// If landing page, make sure Hero is variant landing
let heroVariant = computed(() => {
  return (effectiveMeta.value.title == 'Home') ? 'landing' : 'default';
});
</script>

<template>
  <Background />
  <NuxtRouteAnnouncer />
  <Hero :title="effectiveMeta.title" :subtitle="effectiveMeta.description" :iconName="effectiveMeta.icon" :variant="heroVariant" />
  <main>
    <NuxtPage />
  </main>
  <Footer />
</template>

