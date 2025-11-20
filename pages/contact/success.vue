<template>
  <div style="margin: 35vh 0 0 0">
    <main>
      <section>
        <h1>Thank you!</h1>
        <p>I will get back to you soon.</p>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
/**
 * Name: Contact Success Page
 * Description: Displays when the contact form is submitted. This page redirects the user to the home page after 5 seconds.
 * Author: Jack Graddon
 */
import { onMounted } from 'vue'

onMounted(() => {
  setTimeout(() => {
    navigateTo('/')
  }, 5000) // redirect after 5 seconds
})

useHead({
  title: 'Thank You | Jack Graddon',
  meta: [
    { name: 'description', content: 'Thank you for contacting Jack Graddon.' }
  ]
})
</script>
