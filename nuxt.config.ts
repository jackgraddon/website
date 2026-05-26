export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: process.env.NODE_ENV !== 'production' },

  site: { 
    url: 'https://jackgraddon.com', 
    name: 'Jack Graddon' 
  },

  ogImage: {
    zeroRuntime: true,
  },

  app: {
    head: {
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon.ico'
        }
      ]
    }
  },

  css: [
    '@/assets/styles/main.css',
    '@/assets/styles/variables.css',
    // '@/assets/fonts/fonts.css',
  ],

  fonts: {
    families: [
      { name: 'Outfit', weights: [400, 700], global: true },
      { name: 'Sunflower', src: '/fonts/sunflower.woff2', weights: [400], global: true },
    ],
  },

  vite: {
    server: {
      allowedHosts: true,
      hmr: {
        protocol: 'wss',
      },
    },
  },

  nitro: {
    preset: 'vercel',
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
      ],
    },
  },

  devServer: {
    https: {
      key: './server.key',
      cert: './server.crt'
    }
  },

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/hints',
    '@nuxt/icon',
    '@nuxt/image',
    'nuxt-studio',
    'motion-v/nuxt',
    '@nuxtjs/mcp-toolkit',
    '@nuxtjs/seo',
    'nuxt-ai-ready',
    'nuxt-og-image'
  ],

  content: {
    database: {
      type: 'sqlite',
      filename: '/tmp/nuxt-content.sqlite'
    }
  },

  studio: {
    repository: {
      provider: 'github',
      owner: 'jackgraddon',
      repo: 'website',
      branch: 'nuxt'
    }
  }
})