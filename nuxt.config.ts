// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: [
    '@/assets/styles/main.css',
    '@/assets/styles/variables.css',
    '@/assets/fonts/fonts.css',
  ],

  vite: {
    server: {
      allowedHosts: ['localhost', 'localho.st'],
    },

  },

  modules: [
    '@nuxt/a11y',
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/hints',
    '@nuxt/icon',
    '@nuxt/image',
    'nuxt-studio',
    './modules/liquid-glass/module.ts'
  ],

  studio: {
    repository: {
      provider: 'github',
      owner: 'jackgraddon',
      repo: 'website',
      branch: 'main'
    }
  }
})