<script setup lang="ts">
definePageMeta({
  title: 'Home',
  description: 'Design Engineer, Web Developer, and Graphic Designer',
  keywords: 'home, jack graddon, design engineer, web developer, graphic designer'
})
</script>

<template>
  <div class="landing-page">
    <PagedContent>
      <section id="intro" class="snap-section">
        <div>
          <h1>Hello!</h1>
          <p>I'm Jack, a freelance Design Engineer. I've worked on projects and designs for my school districts, growing
            influencers, and nonprofits. I've always desired to make technology more accessible by developing user
            interfaces that are simple to navigate and visually engaging.</p>
          <Button variant="default" to="/about">About Me</Button>
        </div>
        <div>
          <NuxtImg src="/images/portraits/vertical-lean.webp" alt="Portrait of Jack" />
        </div>
      </section>
      <section id="work" class="snap-section">
        <h2>My Work</h2>
        <p>Feel free to explore my portfolio and see some of the projects I've worked on. I'm passionate about creating
          beautiful and functional designs that meet the needs of my clients.</p>
        <Button variant="default" to="/projects">View Projects</Button>
      </section>
    </PagedContent>
  </div>
</template>

<style lang="css">
section {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  gap: 25px;

  #intro {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    div {
      flex-grow: 1;
    }
  }
}
</style>