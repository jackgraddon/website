// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-10-29',

  devtools: { enabled: true },

  modules: [
    '@nuxt/image',
    'motion-v/nuxt'
  ],

  css: ['~/assets/styles/globals.css'],

  image: {
    domains: ['raw.githubusercontent.com']
  },

  runtimeConfig: {
    public: {
      appName: "Jack Graddon's Portfolio Website"
    }
  },

  app: {
    head: {
      title: 'Jack Graddon',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: "Jack Graddon's web portfolio" }
      ]
    }
  }
})
