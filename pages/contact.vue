<template>
  <div>
    <Splash title="Contact" subtitle="Let's get in touch!" />
    <main>
      <section>
        <h2>Get in Touch</h2>
        <ContactForm />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Contact | Jack Graddon',
  meta: [
    { name: 'description', content: 'Contact Jack Graddon for web development and design services.' }
  ]
});
</script>
