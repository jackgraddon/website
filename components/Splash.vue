<template>
  <div :class="$style.splash">
    <div
      :class="$style.splashTitle"
      v-motion
      :initial="{ opacity: 1, filter: 'blur(0px)' }"
      :enter="{ opacity: 1 }"
    >
      <h1 :class="$style.title">{{ title }}</h1>
      <p :class="$style.subtitle">{{ subtitle }}</p>
    </div>
    <div :class="$style.splashCloud">
      <NuxtImg
        src="/images/splash-cloud.webp"
        width="1043"
        height="607"
        alt="A cloud, covering the width of the screen"
        loading="eager"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Interface representing the properties for the Splash component.
 *
 * @interface SplashProps
 * @property {string} title - The main title to be displayed on the splash screen.
 * @property {string} subtitle - The subtitle to provide additional context or information on the splash screen.
 */
interface SplashProps {
  title: string
  subtitle: string
}

defineProps<SplashProps>()
</script>

<style module lang="sass">
.splash
  width: 100vw
  text-align: center
  height: fit-content
  position: relative

  @media screen and (max-width: 768px)
    height: 100vh

.splashTitle
  text-align: center
  pointer-events: none
  align-content: end
  transform: translate(-50%, -50%)
  position: fixed
  left: 50%
  top: 45%

.splashCloud
  overflow: hidden
  width: 100vw
  height: auto
  margin: 45vh 0 0

  @media screen and (max-width: 768px)
    height: 100%

  img
    width: 100%
    height: 100%
    object-fit: cover

.title
  font-size: 4rem !important
  line-height: 1

.subtitle
  font-size: 1.5rem !important
  font-style: italic

// Scroll Button
.scroll
  color: white
  background: linear-gradient(to right, rgba(255, 255, 255, 0.5) 0, white 10%, rgba(255, 255, 255, 0.5) 20%)
  background-position: 0
  background-clip: text
  background-color: rgba(255, 255, 255, 0.5)
  -webkit-background-clip: text
  -webkit-text-fill-color: transparent
  animation: shine 3s infinite linear
  animation-fill-mode: forwards
  -webkit-text-size-adjust: none
  font-weight: 600
  font-size: smaller
  white-space: nowrap

@keyframes shine
  from
    background-position: 0
  to
    background-position: 77px
</style>
