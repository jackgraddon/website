<template>
  <div>
    <Splash :title="greeting.title" :subtitle="greeting.subtitle" />
    <main>
      <section>
        <h1>Hello!</h1>
        <p>I'm Jack, a freelance Web Developer and Graphic Designer.</p>
        <ProjectDeck first-id="230101" second-id="230201" third-id="221001" />
        <NuxtLink to="/projects" class="btn">View All Projects</NuxtLink>
      </section>
      <section :class="$style.about">
        <div :class="$style.aboutImage">
          <NuxtImg 
            src="/images/portraits/Jack_Horizontal_Sit.webp" 
            alt="A portrait of me sitting next to an overlook of the ocean." 
            width="1920" 
            height="1280"
          />
        </div>
        <div>
          <h2>About</h2>
          <p>
            I'm a freelance Web Developer and Graphic Designer. I've worked on projects and designs for my local school, growing influencers, companies, and competitions. I've always desired to make technology more accessible by developing user interfaces that are simple to navigate and visually engaging.
          </p>
          <NuxtLink to="/about/" class="btn">Read More</NuxtLink>
        </div>
      </section>
      <section>
        <h2>Contact</h2>
        <p style="text-align: center">Have any questions, comments, or just want to reach out? Feel free to contact me by email or by using the form below.</p>
        <NuxtLink to="/contact" class="btn">Open Form</NuxtLink>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
/**
 * Name: Index
 * Description: The application's index page, displays Splash and Project Deck components, as well as links to contact.
 * Author: Jack Graddon
 */
import { onMounted, ref } from 'vue'
import { timeWindows } from '~/composables/timeWindows'

/**
 * Retrieves a greeting message based on the current time of day.
 * The function determines the current hour and returns an object
 * containing a title and subtitle appropriate for morning, afternoon,
 * evening, or night.
 *
 * @param {number} hour - The current hour in 24-hour format (0-23).
 * @returns {Object} An object containing:
 * @property {string} title - A greeting message based on the time of day.
 * @property {string} subtitle - A supportive message related to the greeting.
 */
const getTimeBasedText = (hour: number) => {
  if (hour >= timeWindows.morning && hour < timeWindows.afternoon) {
    return {
      title: 'Good Morning!',
      subtitle: "It's going to be a great day.",
    }
  } else if (hour >= timeWindows.afternoon && hour < timeWindows.evening) {
    return {
      title: 'Good Afternoon!',
      subtitle: 'What a beautiful day it is.',
    }
  } else if (hour >= timeWindows.evening && hour < timeWindows.night) {
    return {
      title: 'Good Evening!',
      subtitle: "Don't miss the sunset tonight.",
    }
  } else {
    return {
      title: 'Good Night!',
      subtitle: 'Rest well and wake up refreshed.',
    }
  }
}

const greeting = ref({ title: '', subtitle: '' })

onMounted(() => {
  const localHour = new Date().getHours()
  greeting.value = getTimeBasedText(localHour)
})

useHead({
  title: 'Jack Graddon',
  meta: [
    { name: 'description', content: "Jack Graddon's web portfolio" }
  ]
})
</script>

<style module>
.warning {
  border: 1px solid yellow;
  border-radius: 7pt;
  background: rgba(0, 0, 0, 0.2);
  padding: 1rem;
}

.about {
  display: grid;
  grid-template: 1fr / 1fr 1fr;
}

@media (max-width: 768px) {
  .about { display: flex; flex-direction: column; }
}

.aboutImage { width: 100%; height: 100%; overflow: hidden; }

.aboutImage img { width: 100%; height: 100%; object-fit: cover; }
</style>
