// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@nuxt/image',
    '@vueuse/motion/nuxt'
  ],

  css: [
    '~/assets/styles/globals.sass',
  ],

  vite: {
    css: {
      preprocessorOptions: {
        sass: {
          additionalData: `
            $mobile-width: 480px
            $tablet-width: 768px
            $desktop-width: 1024px
          `
        }
      }
    }
  },

  image: {
    domains: ['raw.githubusercontent.com']
  },

  app: {
    head: {
      title: "Jack Graddon",
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: "Jack Graddon's web portfolio" }
      ]
    }
  },

  runtimeConfig: {
    public: {
      appName: "Jack Graddon's Portfolio Website"
    }
  }
});