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

// Get route meta to adjust app meta
watch(() => route.path, () => {
  if (routeMeta.value.title || routeMeta.value.description) {
    useHead({
      title: (route.meta.title as string == 'Home') ? 'Jack Graddon' : `${route.meta.title as string} | Jack Graddon`,
      meta: [
        { name: 'description', content: routeMeta.value.description }
      ]
    });
  }
}, { immediate: true });

// If landing page, make sure Hero is variant landing
let heroVariant = computed(() => {
  return (route.meta.title as string == 'Home') ? 'landing' : 'default';
});
</script>

<template>
  <Background />
  <NuxtRouteAnnouncer />
  <Hero :title="routeMeta.title" :subtitle="routeMeta.description" :iconName="routeMeta.icon" :variant="heroVariant" />
  <main>
    <NuxtPage />
  </main>
  <Footer />
</template>

