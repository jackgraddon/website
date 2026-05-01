// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },

  icon: {
    clientBundle: {
      icons: [
        'tabler:brand-github-filled',
        'tabler:brand-linkedin-filled',
      ],
      scan: true,
    }
  },

  css: [
    '@/assets/styles/main.css',
    '@/assets/styles/variables.css',
    '@/assets/fonts/fonts.css',
  ],

  vite: {
    server: {
      allowedHosts: true,
      hmr: {
        protocol: 'ws',
      },
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