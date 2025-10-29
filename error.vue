<template>
  <main style="padding: 2rem">
    <h1>Whoops!</h1>
    <p>It looks like you're trying to access a page that doesn't exist.</p>
    <div style="background-color: rgba(0,0,0,0.5); border: 1px solid yellow; padding: 1rem; border-radius: 7pt; display: flex; flex-direction: column; gap: 0.5em">
      <h2>Recent Changes</h2>
      <p>I recently updated my website, and rewrote it from scratch. It is likely you navigated to a URL that did work before this, but no longer does. If that happens to be you, please look below for common pages. If you can't find that page, please reach out to me. You can <NuxtLink to="/contact">contact me here</NuxtLink>.</p>
      <ProjectDeck first-id="221001" second-id="230201" third-id="210310" />
    </div>
  </main>
</template>

<script setup lang="ts">
/**
 * Name: Not Found
 * Description: The Application's 404/Not Found error page.
 * Author: Jack Graddon
 */

useHead({
  title: '404 - Page Not Found | Jack Graddon',
  meta: [
    { name: 'description', content: 'The page you are looking for does not exist.' }
  ]
})
</script>
