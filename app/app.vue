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
  icon: route.meta.icon as string || ''
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
    const page = contentPage.value as any
    return {
      title: page.title || 'Project',
      description: page.description || '',
      icon: page.icon || page.meta?.icon || ''
    }
  }
  return routeMeta.value
})

// Reactive head management
const siteUrl = 'https://jackgraddon.com'

useHead({
  title: computed(() => {
    const meta = effectiveMeta.value
    // If title is missing, Home, or Jack Graddon, show just Jack Graddon
    if (!meta.title || meta.title === 'Home' || meta.title === 'Jack Graddon') {
      return 'Jack Graddon'
    }
    return `${meta.title} | Jack Graddon`
  }),
  meta: [
    // Standard
    { name: 'description', content: computed(() => effectiveMeta.value.description) },

    // Open Graph
    { property: 'og:site_name', content: 'Jack Graddon' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: computed(() => `${siteUrl}${route.path}`) },
    {
      property: 'og:title',
      content: computed(() => {
        const meta = effectiveMeta.value
        if (!meta.title || meta.title === 'Home' || meta.title === 'Jack Graddon') {
          return 'Jack Graddon'
        }
        return `${meta.title} | Jack Graddon`
      }),
    },
    { property: 'og:description', content: computed(() => effectiveMeta.value.description || 'Design Engineer, Web Developer, and Graphic Designer based in Spokane, WA.') },
    { property: 'og:image', content: `${siteUrl}/images/og-default.jpg` },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: 'Jack Graddon — Design Engineer' },

    // Twitter / X
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@jackgraddon' },
    { name: 'twitter:creator', content: '@jackgraddon' },
    {
      name: 'twitter:title',
      content: computed(() => {
        const meta = effectiveMeta.value
        if (!meta.title || meta.title === 'Home' || meta.title === 'Jack Graddon') {
          return 'Jack Graddon'
        }
        return `${meta.title} | Jack Graddon`
      }),
    },
    { name: 'twitter:description', content: computed(() => effectiveMeta.value.description || 'Design Engineer, Web Developer, and Graphic Designer based in Spokane, WA.') },
    { name: 'twitter:image', content: `${siteUrl}/images/og-default.jpg` },
  ],
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
    <Hero :title="effectiveMeta.title" :subtitle="effectiveMeta.description" :iconName="effectiveMeta.icon" :variant="heroVariant" />
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