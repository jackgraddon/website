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
import { ref, onMounted } from 'vue';
import { timeWindows } from '~/utils/timeWindows';

/**
 * Retrieves a greeting message based on the current time of day.
 */
const getTimeBasedText = (hour: number) => {
  if (hour >= timeWindows.morning && hour < timeWindows.afternoon) {
    return {
      title: 'Good Morning!',
      subtitle: "It's going to be a great day.",
    };
  } else if (hour >= timeWindows.afternoon && hour < timeWindows.evening) {
    return {
      title: 'Good Afternoon!',
      subtitle: 'What a beautiful day it is.',
    };
  } else if (hour >= timeWindows.evening && hour < timeWindows.night) {
    return {
      title: 'Good Evening!',
      subtitle: "Don't miss the sunset tonight.",
    };
  } else {
    return {
      title: 'Good Night!',
      subtitle: 'Rest well and wake up refreshed.',
    };
  }
};

const greeting = ref({ title: '', subtitle: '' });

onMounted(() => {
  const localHour = new Date().getHours();
  greeting.value = getTimeBasedText(localHour);
});
</script>

<style module lang="sass">
.about
  // Import styles from the original page.module.sass if needed

.aboutImage
  // Import styles from the original page.module.sass if needed
</style>
