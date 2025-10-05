<template>
  <div>
    <Splash title="Success!" subtitle="Your message has been sent." />
    <main>
      <section>
        <h2>Thank You!</h2>
        <p>Thanks for reaching out! I'll get back to you as soon as possible.</p>
        <NuxtLink to="/" class="btn">Return Home</NuxtLink>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Success | Jack Graddon',
  meta: [
    { name: 'description', content: 'Message sent successfully.' }
  ]
});
</script>
