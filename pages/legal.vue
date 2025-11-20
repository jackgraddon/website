<template>
  <div>
    <Splash title="Legals" subtitle="All of the information." />
    <main style="width: 100%">
      <section>
        <h1>Copyright</h1>
        <p>This website was designed and developed by Jack Graddon. All rights reserved 2024.</p>
        <p>Contact me for any inquiries or feedback.</p>
        <NuxtLink to="/contact" class="btn">Contact Me</NuxtLink>
      </section>
      <section>
        <h3>Other Work Used</h3>
        <p>Other work, code, fonts, or images I used are credited below.</p>
        <div :class="$style.worksDeck">
          <div :class="$style.worksCard">
            <NuxtImg src="/images/works/madesunflower.webp" width="1280" height="800" alt="MADE Sunflower banner" />
            <a class="btn" href="https://www.youworkforthem.com/font/T11080/made-sunflower" target="_blank" rel="noopener noreferrer">Made Sunflower</a>
          </div>
          <div :class="$style.worksCard">
            <NuxtImg src="/images/works/motion.webp" width="1280" height="800" alt="Motion logo" />
            <a class="btn" href="https://motion.dev/" target="_blank" rel="noopener noreferrer">Motion</a>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
/**
 * Name: Legals Page
 * Description: Displays my copyright information, as well as credits to other work I used to create this portfolio.
 * Author: Jack Graddon
 */

useHead({
  title: 'Legals | Jack Graddon',
  meta: [
    { name: 'description', content: "All of the legal information for Jack Graddon's portfolio website." }
  ]
})
</script>

<style module>
.worksDeck {
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  gap: 0.5rem;
}

.worksCard {
  flex-grow: 1;
  flex-basis: 32%;
  min-width: 300px;
  max-height: 480px;
  border-radius: 7pt;
  aspect-ratio: 1.6;
  background-size: contain;
  background-repeat: no-repeat;
  overflow: hidden;
  display: flex;
  flex-flow: column;
  justify-content: end;
  align-items: flex-start;
  position: relative;
}

.worksCard img { width: 100%; height: auto; object-fit: cover; position: absolute; }
.worksCard a { margin: 0.5rem; z-index: 1; }
</style>
