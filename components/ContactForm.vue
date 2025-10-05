<template>
  <form @submit.prevent="handleSubmit" :class="$style.form">
    <div :class="$style.formGroup">
      <label for="name">Name</label>
      <input
        type="text"
        id="name"
        name="name"
        required
        :placeholder="placeholders.name"
        v-model="formData.name"
      />
    </div>
    
    <div :class="$style.formGroup">
      <label for="email">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        required
        :placeholder="placeholders.email"
        v-model="formData.email"
      />
    </div>
    
    <div :class="$style.formGroup">
      <label for="subject">Subject</label>
      <input
        type="text"
        id="subject"
        name="subject"
        required
        :placeholder="placeholders.subject"
        v-model="formData.subject"
      />
    </div>
    
    <div :class="$style.formGroup">
      <label for="message">Message</label>
      <textarea
        id="message"
        name="message"
        rows="5"
        required
        :placeholder="placeholders.message"
        v-model="formData.message"
      ></textarea>
    </div>
    
    <button type="submit" class="btn" :disabled="state.submitting">
      {{ state.submitting ? 'Sending...' : 'Send Message' }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const state = ref({
  submitting: false,
  succeeded: false,
});

const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
});

const placeholders = ref({
  name: "",
  email: "",
  subject: "",
  message: "",
});

onMounted(() => {
  // Define possible placeholder values
  const names = [
    "John Doe", "Prince Hamlet", "Phil Swift", "Abraham Lincoln",
    "Marilyn Monroe", "Winston Churchill", "Queen Elizabeth II",
    "Bill Gates", "Elvis Presley",
  ];
  const emails = [
    "johndoe@unkown.com", "p.hamlet@denmark.gov", "phil@flextape.com",
    "lincolna@whitehouse.gov", "marilyn@marilynmonroe.com",
    "churchill@gov.uk", "liz@gov.uk", "gatesb@microsoft.com",
    "presley@elvispresely.com",
  ];
  const subjects = [
    "I know who you are", "Ghost Sighting", "Flex Tape", "Speech Idea",
    "Important Info", "RE: Good Quotes?", "RE: Important - Read Now!",
    "I Love Windows 11", "It's ok, we all have rough times.",
  ];
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
  ];

  // Generate a random index
  const rand = Math.floor(Math.random() * names.length);

  // Set placeholders dynamically
  placeholders.value = {
    name: names[rand],
    email: emails[rand],
    subject: subjects[rand],
    message: messages[rand],
  };
});

const handleSubmit = async () => {
  state.value.submitting = true;

  const data = new URLSearchParams();
  data.append('name', formData.value.name);
  data.append('email', formData.value.email);
  data.append('subject', formData.value.subject);
  data.append('message', formData.value.message);

  try {
    await fetch("https://formspree.io/f/mzzzyvzg", {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // Navigate to success page
    navigateTo('/contact/success');
  } catch (error) {
    // Handle network or other errors
    state.value.submitting = false;
    console.error("Network or server error:", error);
  }
};
</script>

<style module lang="sass" src="./form.module.sass"></style>
