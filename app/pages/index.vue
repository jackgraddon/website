<script setup lang="ts">
definePageMeta({
  title: 'Home',
  description: 'Design Engineer, Web Developer, and Graphic Designer',
  keywords: 'home, jack graddon, design engineer, web developer, graphic designer'
})
</script>

<template>
  <PagedContent class="fit-short">
    <section id="intro">
      <h1>Hello!</h1>
      <p>I'm Jack, a freelance Design Engineer, Web Developer, and Graphic Designer. I've worked on projects and designs for my local school, growing influencers, companies, and competitions. I've always desired to make technology more accessible by developing user interfaces that are simple to navigate and visually engaging.</p>
    </section>
    <section id="work">
      <h2>My Work</h2>
      <p>Feel free to explore my portfolio and see some of the projects I've worked on. I'm passionate about creating beautiful and functional designs that meet the needs of my clients.</p>
      <Button variant="default" to="/projects">View Projects</Button>
    </section>
  </PagedContent>
</template>

<style scoped>

</style>