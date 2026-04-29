<template>
  <div class="contact">
    <Surface variant="glass" class="fit-wide">
      <form>
        <span style="grid-column: 1 / span 1;">
          <label>Name</label>
          <input type="text" placeholder="Name" />
        </span>
        <span style="grid-column: 2 / span 1;">
          <label>Email</label>
          <input autocorrect="off" type="email" placeholder="Email" />
        </span>
        <span style="grid-column: 1 / span 2;">
          <label>Message</label>
          <textarea placeholder="Message"></textarea>
        </span>
      </form>
      <Button color="#ffffff" to="#" style="width: fit-content;">Send</Button>
    </Surface>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'default',
  title: 'Contact',
  description: "Let's get in touch!",
  icon: 'solar:mailbox-broken',
})
</script>

<style scoped>
.contact {
  form {
    display: grid;

    @media screen and (max-width: 768px) {
      grid-template-columns: 1fr;

      span {
        grid-column: 1 / span 1 !important;
      }
    }

    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    width: 100%;
    margin-bottom: 1rem;

    div {
      width: 100%;
      display: flex;
      gap: 1rem;
    }

    span {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    label {
      padding-left: 7pt;
    }

    input, textarea {
      padding: 0.5rem;
      border-radius: 14pt;
      border: 2px solid transparent;
      outline: none;
      resize: vertical;
      min-height: 2.5rem;

      &:focus {
        border: 2px solid var(--color-primary);
      }
    }
  }
}
</style>