<template>
  <div :class="$style.footer">
    <div :class="$style.footerCauses">
      <a id="data-rights" href="https://epic.org" title="Learn about your Data Rights" target="_blank">&#x1F512;</a>
      <a id="help-me" href="https://ko-fi.com/jackgraddon" title="Buy me a Coffee" target="_blank">&#x1FA99;</a>
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

<style module lang="sass">
.footer
  width: fit-content
  max-width: 100vw
  height: fit-content
  margin: 1rem auto
  padding: 0
  display: flex
  flex-flow: column
  justify-content: center
  align-items: center
  text-align: center

  h3
    line-height: 1em

  p
    font-size: 1em

  .footerCauses
    display: flex
    flex-direction: row
    align-items: center
    justify-content: center
    width: 100%
    margin: 0

    a
      cursor: pointer
      transition: 300ms
      text-decoration: none
      font-size: 1.7rem
      padding: 0 0.5rem

      &:hover
        scale: 1.15

  ul
    &.nav
      width: 100%
      height: fit-content
      margin: 10px 0 0 0
      font-size: 1.2em
      padding: 0
      display: flex
      gap: 0.5rem
      flex-flow: row wrap
      justify-content: center
      align-items: center

      li
        list-style: none
        margin: 0
        padding: 0

        & > a
          color: rgba(255,255,255,0.75) !important
          text-decoration: none
          cursor: pointer
          transition: 150ms ease
          border-radius: 7pt
          font-size: 1rem
          font-weight: 400
          padding: 0.35rem

          @media screen and (max-width: 768px)
            color: rgba(255,255,255,1) !important
            background-color: rgba(255,255,255,0.25)

        &:hover
          a
            color: rgba(255,255,255,1) !important
            background-color: rgba(255,255,255,0.25)
</style>
