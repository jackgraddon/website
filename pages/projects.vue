<template>
  <div>
    <Splash title="Projects" subtitle="Check out my work." />
    <main>
      <section>
        <h2>My Portfolio</h2>
        <p>Here are some of the projects I've worked on over the years.</p>
        <!-- Add project listing component here -->
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Projects | Jack Graddon',
  meta: [
    { name: 'description', content: "Browse Jack Graddon's web development and design portfolio." }
  ]
});
</script>
