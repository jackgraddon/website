<template>
  <div class="contact">
    <Surface variant="glass">
      <form >
        <input type="text" placeholder="Name" />
        <input type="email" placeholder="Email" />
        <textarea placeholder="Message"></textarea>
        <span>
          <Button color="#ffffff" to="#" variant="glass">Send</Button>
        </span>
      </form>
    </Surface>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
    layout: 'default',
    title: 'Contact',
    description: "Let's get in touch!",
    icon: 'solar:mailbox-outline',
})

</script>

<style scoped>
.contact {
  
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    input, textarea {
      padding: 0.5rem;
      border-radius: 14pt;
      border: 2px solid transparent;
      outline: none;

      &:focus {
        border: 2px solid var(--color-primary);
      }
    }
  }
}
</style>