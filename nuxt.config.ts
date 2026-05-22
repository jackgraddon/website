export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: process.env.NODE_ENV !== 'production' },

  app: {
    head: {
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
    }
  },

  hooks: {
    'build:before': async () => {
      if (process.env.NODE_ENV !== 'production') return;
      try {
        const { generateScreenshots } = await import('./scripts/generate-screenshots')
        await generateScreenshots()
      } catch (error) {
        console.error('[Nuxt Config] Failed to run build-time screenshot generator:', error)
      }
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
        protocol: 'wss',
      },
    },
  },

  // devServer: {
  //   https: {
  //     key: './server.key',
  //     cert: './server.crt'
  //   }
  // },

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/hints',
    '@nuxt/icon',
    '@nuxt/image',
    'nuxt-studio',
    'motion-v/nuxt',
    '@nuxtjs/mcp-toolkit'
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