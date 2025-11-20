<template>
  <div>
    <Splash title="Contact" subtitle="How to reach out." />
    <main style="width: 100%">
      <section>
        <h1>Contact</h1>
        <p>If you need to contact me, you can fill out the form below!</p>
      </section>
      <section>
        <ContactForm />
        <p>Want to reach me the old fashioned way? Open your mail application by clicking <a href="mailto:hello@jackgraddon.com?subject=What%20do%20you%20want%20to%20talk%20about?" target="_blank" rel="noopener noreferrer">here</a> and send me an email!</p>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
/**
 * Name: Contact Page
 * Description: Displays a form for viewers to submit their inquiries. Redirects to the success page when submitted.
 * Author: Jack Graddon
 */

useHead({
  title: 'Contact | Jack Graddon',
  meta: [
    { name: 'description', content: "Let's talk! Get in touch with Jack Graddon." }
  ]
})
</script>
