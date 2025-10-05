<template>
  <html lang="en">
    <body>
      <Background />
      <slot />
      <SiteFooter />
      <SpeedInsights />
      <Analytics />
    </body>
  </html>
</template>

<script setup lang="ts">
import { SpeedInsights } from '@vercel/speed-insights/nuxt';
import { Analytics } from '@vercel/analytics/vue';

useHead({
  title: 'Jack Graddon',
  meta: [
    { name: 'description', content: "Jack Graddon's web portfolio" }
  ]
});
</script>
