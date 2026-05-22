<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

definePageMeta({
  title: 'Home',
  description: 'Design Engineer, Web Developer, and Graphic Designer',
  keywords: 'home, jack graddon, design engineer, web developer, graphic designer'
})

// Track references for both sections
const introRef = ref<HTMLElement | null>(null)
const workRef = ref<HTMLElement | null>(null)

// Track independent progress decimals for each section
const introProgress = ref(0) 
const workProgress = ref(0)

// Helper function to calculate progress for any given element
const calculateParallaxProgress = (element: HTMLElement | null) => {
  if (!element) return 0
  
  const rect = element.getBoundingClientRect()
  const viewportHeight = window.innerHeight

  const totalRange = rect.height + viewportHeight
  const currentPosition = viewportHeight - rect.top
  
  const progress = Math.max(0, Math.min(1, currentPosition / totalRange))

  // Returns a value from 0.5 to -0.5
  return (progress - 0.5) * -1
}

const handleScroll = () => {
  // Update both sections independently on scroll
  introProgress.value = calculateParallaxProgress(introRef.value)
  workProgress.value = calculateParallaxProgress(workRef.value)
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll() 
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="landing-page">
    <PagedContent>
      <section class="snap-section" ref="introRef" :style="{ '--parallax-progress': introProgress }">
        <div id="intro">
          <div>
            <h1>Hello!</h1>
            <Surface variant="glass">
              <p>I'm Jack, a freelance Design Engineer. I've worked on projects and designs for my school districts, growing
                influencers, and nonprofits. I've always desired to make technology more accessible by developing user
                interfaces that are simple to navigate and visually engaging.</p>
            </Surface>
            <Button variant="default" to="/about">About Me</Button>
          </div>
          <div>
            <NuxtImg 
              class="parallax-img" 
              style="--travel-speed: 120px;"
              src="/images/portraits/vertical-lean.webp" 
              alt="Portrait of Jack leaning against a wall in grayscale." 
              width="400px"
            />
          </div>
          <div>
            <NuxtImg 
              class="parallax-img" 
              style="--travel-speed: 340px;"
              src="/images/portraits/horizontal-sit.webp" 
              alt="Portrait of Jack sitting on a ledge overlooking Belligham, WA." 
              width="300px"
            />
          </div>
          <div>
            <NuxtImg 
              class="parallax-img" 
              style="--travel-speed: 160px;"
              src="/images/portraits/vertical-graduate.webp" 
              alt="Portrait of Jack in WSU graduation regalia." 
              width="300px"
            />
          </div>
        </div>
      </section>
      
      <section class="snap-section" ref="workRef" :style="{ '--parallax-progress': workProgress }">
        <div id="work">
          <div>
            <h2>My Work</h2>
            <Surface variant="glass">
              <p>Feel free to explore my portfolio and see some of the projects I've worked on. I'm passionate about creating
                beautiful and functional designs that meet the needs of the people I work with.</p>
            </Surface>
            <Button variant="default" to="/projects">View Projects</Button>
          </div>
          <div>
            <NuxtLink to="/projects/230801" class="parallax-img project-card" style="--travel-speed: 150px;">
              <NuxtImg src="/projects/230801/ogImage.jpg" alt="Redesigns for WSU's LPRC website" width="350"/>
            </NuxtLink>
          </div>
          <div>
            <NuxtLink to="/projects/240101" class="parallax-img project-card" style="--travel-speed: 300px;">
              <NuxtImg src="/projects/240101/ogImage.jpg" alt="Cowboy Ted Complete Brand Overhaul" width="400"/>
            </NuxtLink>
          </div>
          <div>
            <NuxtLink to="/projects/260203" class="parallax-img project-card" style="--travel-speed: 180px;">
              <NuxtImg src="/projects/260203/ogImage.jpg" alt="Tumult, a Matrix client inspired by Discord" width="350" />
            </NuxtLink>
          </div>
        </div>
      </section>
    </PagedContent>
  </div>
</template>

<style lang="css">
div#intro {
  display: flex;
  position: relative; 
  align-items: center;
  text-align: end;
  gap: 25px;
  width: 100%;
  height: 100%;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  > div {
    display: flex;
    flex-direction: column;
    position: absolute;
    gap: 25px;

    &:nth-child(1) {
      align-items: flex-end;
      width: min(100%, 400px);
      right: 55%;
      left: 17%;
      overflow: visible !important;
      z-index: 5;

      @media screen and (max-width:968px){
        width: min(100%, 450px);
        left: 50% !important; 
        right: unset !important;
        transform: translateX(-50%);
        top: 35%;
        align-items: center;
        text-align: center;
      }

      h1 {
        font-size: 3.5rem;
        margin: 0 1.3rem -3.7rem 0;
        z-index: 3;
      }
    }

    &:nth-child(2) {
      align-items: flex-start;
      width: min(100%, 400px);
      left: 50%;
      right: 17%;
      z-index: 4;

      @media screen and (max-width: 968px){
        left: 50% !important; 
        right: unset !important;
        transform: translateX(-50%);
        top: 10%;
        align-items: center;
      }
    }
    
    &:nth-child(3) {
      align-items: flex-start;
      width: min(100%, 300px);
      bottom: 20%;
      left: -5%;
      z-index: 3;

      @media screen and (max-width: 968px){
        left: 10% !important; 
        right: unset !important;
        transform: translateX(-50%);
        top: 70%;
        align-items: center;
      }
    }
    
    &:nth-child(4) {
      align-items: flex-start;
      width: min(100%, 300px);
      left: 10%;
      top: 5%;
      z-index: 2;

      @media screen and (max-width: 968px){
        left: 70% !important; 
        right: unset !important;
        transform: translateX(-50%);
        top: 60%;
        align-items: center;
      }
    }
  }
}

div#work {
  display: flex;
  position: relative; 
  align-items: center;
  text-align: end;
  gap: 25px;
  width: 100%;
  height: 100%;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  > div {
    display: flex;
    flex-direction: column;
    position: absolute;
    gap: 15px;

    &:nth-child(1) {
      width: min(100%, 400px);
      left: 50% !important; 
      transform: translateX(-50%);
      top: 35%;
      align-items: center;
      text-align: center;
      overflow: visible !important;
      z-index: 5;

      @media screen and (max-width:968px){
        width: min(100%, 450px);
      }

      h2 {
        font-size: 3rem;
        margin: 0 0 -2.8rem 0;
        z-index: 3;
      }
    }

    &:nth-child(2) {
      width: min(100%, 350px);
      top: 20%;
      left: 10%;
      z-index: 2;
    }

    &:nth-child(3) {
      width: min(100%, 400px);
      right: -5%;
      top: 35%;
      z-index: 3;
    }

    &:nth-child(4) {
      width: min(100%, 350px);
      left: 20%;
      bottom: 15%;
      z-index: 4;
    }

    @media screen and (max-width: 968px) {
      position: relative;
      width: min(100%, 500px) !important;
      left: 50% !important;
      right: unset !important;
      top: unset !important;
      bottom: unset !important;
      transform: translateX(-50%); /* Centers the wrapper securely */
      margin-bottom: 40px;
    }
  }
}

/* The clickable anchor tag acts as the animated card */
.project-card {
  display: block;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  
  /* Smooth transition for the hover effects */
  transition: transform 0.1s ease-out;

  img {
    width: 100%;
    height: auto;
    display: block;
    aspect-ratio: 1280 / 800; /* Locks your requested aspect ratio */
    object-fit: cover;
    transition: 0.4s ease; /* Smooth inner zoom */
  }

  /* Interaction effects */
  &:hover {
    img {
      transform: scale(1.04); /* Subtle internal zoom on hover */
    }
  }
}

.parallax-img {
  will-change: transform;
  transition: transform 0.1s ease-out;
  transform: translateY(calc(var(--parallax-progress, 0) * var(--travel-speed, 80px)));
}
</style>