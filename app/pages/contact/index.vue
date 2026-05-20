<template>
  <div class="contact">
    <Surface variant="glass" class="fit-wide">
      <AnimatePresence mode="wait">
        <!-- Success State -->
        <motion.div
          v-if="status === 'success'"
          key="success"
          class="state-view success-view"
          :initial="{ opacity: 0, scale: 0.95, y: 15 }"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :exit="{ opacity: 0, scale: 0.95, y: -15 }"
          :transition="{ duration: 0.4, ease: 'easeOut' }"
        >
          <div class="success-icon-wrap">
            <Icon name="solar:check-circle-line-duotone" class="success-icon" />
          </div>
          <h2 class="state-title">Message Sent!</h2>
          <p class="state-message">Thank you so much. I have received your message and will get back to you as soon as possible.</p>
          <Button @click="resetForm" variant="default" style="margin-top: 1.5rem;">Send another message</Button>
        </motion.div>

        <!-- Form State -->
        <motion.form
          v-else
          key="form"
          @submit.prevent="handleSubmit"
          :initial="{ opacity: 0, scale: 0.98 }"
          :animate="{ opacity: 1, scale: 1 }"
          :exit="{ opacity: 0, scale: 0.98 }"
          :transition="{ duration: 0.3 }"
        >
          <div class="form-grid">
            <span style="grid-column: 1 / span 1;">
              <label for="name">Name</label>
              <input id="name" name="name" type="text" placeholder="Name" required v-model="form.name" :disabled="status === 'submitting'" />
            </span>
            <span style="grid-column: 2 / span 1;">
              <label for="email">Email</label>
              <input id="email" name="email" autocorrect="off" type="email" placeholder="Email" required v-model="form.email" :disabled="status === 'submitting'" />
            </span>
            <span style="grid-column: 1 / span 2;">
              <label for="message">Message</label>
              <textarea id="message" name="message" placeholder="Message" required v-model="form.message" :disabled="status === 'submitting'"></textarea>
            </span>
          </div>

          <div class="form-actions">
            <Button
              type="submit"
              color="#ffffff"
              style="width: fit-content;"
              :disabled="status === 'submitting'"
            >
              <span v-if="status === 'submitting'" class="submitting-label">
                <Icon name="solar:spinner-line-duotone" class="spin" /> Sending...
              </span>
              <span v-else>Send Message</span>
            </Button>
            
            <p v-if="status === 'error'" class="error-text">
              <Icon name="solar:danger-triangle-line-duotone" class="error-icon" /> Something went wrong. Please try again.
            </p>
          </div>
        </motion.form>
      </AnimatePresence>
    </Surface>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { motion, AnimatePresence } from 'motion-v'

definePageMeta({
  layout: 'default',
  title: 'Contact',
  description: "Let's get in touch!",
  icon: 'solar:mailbox-broken',
})

const status = ref<'idle' | 'submitting' | 'success' | 'error'>('idle')
const form = ref({
  name: '',
  email: '',
  message: '',
})

async function handleSubmit() {
  status.value = 'submitting'
  try {
    const response = await fetch('https://formspree.io/f/mzzzyvzg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(form.value),
    })

    if (response.ok) {
      status.value = 'success'
      form.value = { name: '', email: '', message: '' }
    } else {
      status.value = 'error'
    }
  } catch (err) {
    status.value = 'error'
  }
}

function resetForm() {
  status.value = 'idle'
}
</script>

<style scoped>
.contact {
  width: 100%;

  form {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    width: 100%;

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      width: 100%;

      @media screen and (max-width: 768px) {
        grid-template-columns: 1fr;

        span {
          grid-column: 1 / span 1 !important;
        }
      }

      span {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
      }

      label {
        padding-left: 7pt;
        font-weight: 500;
        font-size: 0.95rem;
        color: var(--color-text-muted);
      }

      input, textarea {
        padding: 0.75rem 1rem;
        border-radius: 14pt;
        border: 2px solid transparent;
        outline: none;
        resize: vertical;
        min-height: 2.75rem;
        background: rgba(255, 255, 255, 0.05);
        color: var(--color-text);
        font-size: 0.95rem;
        transition: border-color 0.2s ease, background 0.2s ease;

        &:focus {
          border: 2px solid var(--color-primary);
          background: rgba(255, 255, 255, 0.08);
        }

        &::placeholder {
          color: rgba(255, 255, 255, 0.35);
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }

      textarea {
        min-height: 8rem;
      }
    }

    .form-actions {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      width: 100%;
      flex-wrap: wrap;
    }

    .submitting-label {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .spin {
      animation: spin 1s linear infinite;
    }
  }

  /* ── State Views (Success / Error) ── */
  .state-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 2rem 1rem;
    gap: 0.75rem;

    .success-icon-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 5rem;
      height: 5rem;
      border-radius: 50%;
      margin-bottom: 0.5rem;
    }

    .success-icon {
      font-size: 2.75rem;
      color: var(--color-text);
    }

    .state-title {
      font-family: 'Sunflower', serif;
      font-size: 1.8rem;
      color: var(--color-text);
      line-height: 1.2;
    }

    .state-message {
      font-size: 1rem;
      line-height: 1.6;
      color: var(--color-text-muted);
      max-width: 420px;
    }
  }

  .error-text {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #ff6b6b;
    font-size: 0.9rem;
    font-weight: 500;
  }

  .error-icon {
    font-size: 1.2rem;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>