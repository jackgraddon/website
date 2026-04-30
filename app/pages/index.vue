<script setup lang="ts">
definePageMeta({
  title: 'Home',
  description: 'Design Engineer, Web Developer, and Graphic Designer',
  keywords: 'home, jack graddon, design engineer, web developer, graphic designer'
})
</script>

<template>
  <FloatingCTADisplay id="floating-ctas" :ctas="[
    { id: 1, title: 'Projects', url: '/projects', icon: 'solar:laptop-minimalistic-bold' },
    { id: 2, title: 'GitHub', url: 'https://github.com/jackgraddon', icon: 'tabler:brand-github-filled' },
    { id: 3, title: 'About', url: '/about', icon: 'solar:hand-shake-bold-duotone' },
    { id: 4, title: 'LinkedIn', url: 'https://linkedin.com/in/jackgraddon', icon: 'tabler:brand-linkedin-filled' },
    { id: 5, title: 'Contact', url: '/contact', icon: 'solar:letter-bold' },
  ]" />
  <PagedContent>
    <section id="intro">
      <h1>Hello!</h1>
      <p>I'm Jack, a freelance Design Engineer, Web Developer, and Graphic Designer. I've worked on projects and designs for my local school, growing influencers, companies, and competitions. I've always desired to make technology more accessible by developing user interfaces that are simple to navigate and visually engaging.</p>
      <Button variant="default" to="/about">About Me</Button>
    </section>
    <section id="work">
      <h2>My Work</h2>
      <p>Feel free to explore my portfolio and see some of the projects I've worked on. I'm passionate about creating beautiful and functional designs that meet the needs of my clients.</p>
      <Button variant="default" to="/projects">View Projects</Button>
    </section>
  </PagedContent>
</template>

<style scoped>
#floating-ctas {
  position: absolute; 
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none; 
  z-index: 100;
}

a {
  margin-top: 10px;
}
</style>