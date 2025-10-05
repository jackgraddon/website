<template>
  <div :class="$style.footer">
    <div :class="$style.footerCauses">
      <NuxtLink 
        id="data-rights" 
        to="https://epic.org" 
        title="Learn about your Data Rights" 
        target="_blank"
      >
        🔒
      </NuxtLink>
      <NuxtLink 
        id="help-me" 
        to="https://ko-fi.com/jackgraddon" 
        title="Buy me a Coffee" 
        target="_blank"
      >
        🪙
      </NuxtLink>
    </div>
    <h3>Jack Graddon</h3>
    <p>Website © Jack Graddon 2024</p>
    <div>
      <ul :class="$style.nav">
        <li :class="$style.navItem">
          <NuxtLink to="/">Home</NuxtLink>
        </li>
        <li :class="$style.navItem">
          <NuxtLink to="/about/">About</NuxtLink>
        </li>
        <li :class="$style.navItem">
          <NuxtLink to="/projects/">Projects</NuxtLink>
        </li>
        <li :class="$style.navItem">
          <NuxtLink to="/social/">Social</NuxtLink>
        </li>
        <li :class="$style.navItem">
          <NuxtLink to="/contact/">Contact</NuxtLink>
        </li>
        <li :class="$style.navItem">
          <NuxtLink to="/legal/">Legal</NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style module lang="sass" src="./site-footer.module.sass"></style>
