<script setup lang="ts">
const { isLoaded } = useAppLoaded();

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
    { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
    { name: 'author', content: 'Jack Graddon' },
  ],
})

// Get current route metadata for dynamic head management
const route = useRoute();
const routeMeta = computed(() => ({
  title: (route.meta.title as string == 'Home') ? 'Jack Graddon' : route.meta.title as string,
  description: route.meta.description as string || '',
  icon: route.meta.icon as string || '',
  // Use bracket notation or 'as string' so TypeScript allows the custom property
  subtitle: (route.meta.subtitle as string) || '' 
}));

// Fetch content metadata for content routes
const { data: contentPage } = await useAsyncData(
  () => `content-${route.path}`,
  async () => {
    if (route.path.startsWith('/projects/') && route.path !== '/projects' && route.path !== '/projects/') {
      try {
        return await queryCollection('projects').path(route.path).first()
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
    return {
      title: contentPage.value.title || routeMeta.value.title,
      description: contentPage.value.description || routeMeta.value.description, 
      icon: contentPage.value.icon || routeMeta.value.icon,
      // Prioritize the markdown subtitle, then fall back to the definePageMeta subtitle
      subtitle: contentPage.value.subtitle || routeMeta.value.subtitle 
    }
  }
  return routeMeta.value;
})

// Reactive head management
const siteUrl = 'https://jackgraddon.com'

defineOgImage('Default.takumi', {
  title: effectiveMeta.value.title,
  subtitle: effectiveMeta.value.subtitle
})

// Helper for the dynamic title logic
const computedTitle = computed(() => {
  const meta = effectiveMeta.value
  if (!meta.title || meta.title.includes('Jack Graddon')) {
    return ''
  }
  return `${meta.title}`
})

// Standard Title
useHead({
  title: computedTitle,
  htmlAttrs: { lang: 'en' }
})

// SEO Meta Tags
useSeoMeta({
  description: computed(() => effectiveMeta.value.description),
  
  // Open Graph
  ogSiteName: 'Jack Graddon',
  ogType: 'website',
  ogUrl: computed(() => `${siteUrl}${route.path}`),
  ogTitle: computedTitle,
  ogDescription: computed(() => effectiveMeta.value.description || 'Design Engineer, Web Developer, and Graphic Designer based in Spokane, WA.'),
  ogImageWidth: '1200',
  ogImageHeight: '630',
  ogImageAlt: 'Jack Graddon: Design Engineer',

  // Twitter
  twitterCard: 'summary_large_image',
  twitterSite: '@jackgraddon',
  twitterCreator: '@jackgraddon',
  twitterTitle: computedTitle,
  twitterDescription: computed(() => effectiveMeta.value.description || 'Design Engineer, Web Developer, and Graphic Designer based in Spokane, WA.'),
})

// If landing page, make sure Hero is variant landing
let heroVariant = computed(() => {
  return (effectiveMeta.value.title == 'Jack Graddon') ? 'landing' : 'default';
});
</script>

<template>
  <div :class="{ 'app-not-ready': !isLoaded }">
    <Cursor />
    <Background />
    <NuxtRouteAnnouncer />
    <Hero :title="effectiveMeta.title" :subtitle="effectiveMeta.subtitle" :iconName="effectiveMeta.icon" :variant="heroVariant" />
    <main>
      <NuxtPage :key="$route.path" />
    </main>
    <Footer />

    <!-- Cloud stinger overlay — sits above everything via z-index:9999, teleported to <body> -->
    <CloudStinger />
  </div>
</template>

<style>
/* Global Animation Gating */
.app-not-ready {
  pointer-events: none;
}

/* Pause all CSS animations and transitions until the page is fully ready */
.app-not-ready *,
.app-not-ready *::before,
.app-not-ready *::after {
  animation-play-state: paused !important;
  transition: none !important;
}
</style>