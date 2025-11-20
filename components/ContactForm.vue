<template>
  <form
    id="contact"
    @submit.prevent="handleSubmit"
    accept-charset="utf-8"
    method="post"
    :class="$style.form"
  >
    <div :class="$style.formInputContainer">
      <label :class="$style.formLabel" for="name">
        Full Name <span :class="$style.required">*</span>
      </label>
      <input
        type="text"
        name="name"
        id="name"
        :class="$style.formInput"
        :placeholder="placeholders.name"
        required
      />
    </div>
    <div :class="$style.formInputContainer">
      <label :class="$style.formLabel" for="email">
        Email Address <span :class="$style.required">*</span>
      </label>
      <input
        type="email"
        name="replyto"
        id="email"
        :class="$style.formInput"
        :placeholder="placeholders.email"
        required
      />
    </div>
    <div :class="$style.formInputContainer">
      <label :class="$style.formLabel" for="subject">
        Subject <span :class="$style.required">*</span>
      </label>
      <input
        type="text"
        name="_subject"
        id="subject"
        :class="$style.formInput"
        :placeholder="placeholders.subject"
        required
      />
    </div>
    <div :class="$style.formInputContainer">
      <label :class="$style.formLabel" for="message">
        Message <span :class="$style.required">*</span>
      </label>
      <textarea
        name="message"
        id="message"
        :class="$style.formText"
        :placeholder="placeholders.message"
        required
      ></textarea>
    </div>
    <button type="submit" :class="$style.submit" :disabled="state.submitting">
      Submit
    </button>
  </form>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const state = ref({
  submitting: false,
  succeeded: false,
})

const placeholders = ref({
  name: "",
  email: "",
  subject: "",
  message: "",
})

onMounted(() => {
  // Define possible placeholder values
  const names = [
    "John Doe", "Prince Hamlet", "Phil Swift", "Abraham Lincoln",
    "Marilyn Monroe", "Winston Churchill", "Queen Elizabeth II",
    "Bill Gates", "Elvis Presley",
  ]
  const emails = [
    "johndoe@unkown.com", "p.hamlet@denmark.gov", "phil@flextape.com",
    "lincolna@whitehouse.gov", "marilyn@marilynmonroe.com",
    "churchill@gov.uk", "liz@gov.uk", "gatesb@microsoft.com",
    "presley@elvispresely.com",
  ]
  const subjects = [
    "I know who you are", "Ghost Sighting", "Flex Tape", "Speech Idea",
    "Important Info", "RE: Good Quotes?", "RE: Important - Read Now!",
    "I Love Windows 11", "It's ok, we all have rough times.",
  ]
  const messages = [
    "Hello! You may not know who I am, but...",
    "Hello! Have you seen my father? I've heard he...",
    "Hey! To show you the power of flex tape, I sawed this form in half...",
    "Hello. I have this speech idea: Four score and seven years ago our fathers...",
    "The sky is not the limit. Your mind is...",
    "You have enemies? Good. That means you've stood up for something, sometime in your life...",
    "Hey, let us not take ourselves too seriously. None of us has a monopoly on wisdom...",
    "Hey, if you can't make it good, at least make it look good...",
    "When things go wrong, don't go with them...",
  ]

  // Generate a random index
  const rand = Math.floor(Math.random() * names.length)

  // Set placeholders dynamically
  placeholders.value = {
    name: names[rand],
    email: emails[rand],
    subject: subjects[rand],
    message: messages[rand],
  }
})

const handleSubmit = async (event: Event) => {
  state.value.submitting = true

  const formData = new FormData(event.target as HTMLFormElement)
  const data = new URLSearchParams()

  formData.forEach((value, key) => {
    data.append(key, value.toString())
  })

  try {
    await fetch("https://formspree.io/f/mzzzyvzg", {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
  } catch (error) {
    state.value.submitting = false
    state.value.succeeded = false
    console.error("Network or server error:", error)
  }

  navigateTo('/contact/success/')
}
</script>

<style module>
.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  padding: 1rem;
  border-radius: 7pt;
  background-color: #f9f9f9;
  color: #333;
}

.formInputContainer { display: flex; flex-direction: column; }

.formLabel {
  padding: 0.4rem 0.8rem;
  border: 1px solid #ccc;
  border-bottom: 0;
  border-radius: 7pt 7pt 0 0;
  background: #f0f0f0;
  width: fit-content;
  font-size: 0.9em;
}

.formInput,
.formSelect,
.formText,
.formButton {
  padding: 0.4rem 0.8rem;
  border: 1px solid #ccc;
  border-radius: 0 7pt 7pt 7pt;
  min-height: 39px;
  max-width: 100%;
}

.formInput:focus,
.formSelect:focus,
.formText:focus,
.formButton:focus {
  outline: 0;
  box-shadow: none;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
}

.required { color: red; }

.submit {
  transition: 150ms ease;
  display: block;
  width: fit-content;
  padding: 0.4rem 0.8rem;
  border: 0.3rem solid;
  border-radius: 7pt;
  text-align: center;
  text-decoration: none;
  background-color: #fff;
  color: #175e84;
  cursor: pointer;
}

.submit:hover { background-color: #d8d8d8; }
.submit.disabled { opacity: 0.8; background-color: #faf9f9; }
</style>
