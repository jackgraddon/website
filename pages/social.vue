<template>
  <div>
    <Splash title="Social" subtitle="Check out my social media" />
    <main>
      <section>
        <h1>Social</h1>
        <div :class="$style.platforms">
          <a title="Click to view Instagram" href="https://www.instagram.com/jack.graddon/" target="_blank" rel="noopener noreferrer" style="color: #E1306C"><InstagramIcon /></a>
          <a title="Click to view LinkedIn" href="https://www.linkedin.com/in/jackgraddon/" target="_blank" rel="noopener noreferrer" style="color: #0A66C2"><LinkedInIcon /></a>
        </div>
      </section>
      <section>
        <p>Instagram feed coming soon...</p>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
/**
 * Name: Social
 * Description: Displays my social media information and feeds.
 * Author: Jack Graddon
 */

useHead({
  title: 'Social | Jack Graddon',
  meta: [
    { name: 'description', content: 'Take a look at my social media profiles and feeds.' }
  ]
})
</script>

<style module lang="sass">
.platforms
  display: flex
  flex-direction: row
  gap: 1rem

  a
    svg
      color: white
      transition: 150ms ease

    &:hover
      transform: scale(1.1)
</style>
