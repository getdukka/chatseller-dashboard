// nuxt.config.ts
export default defineNuxtConfig({
  // =====================================
  // DEVELOPMENT CONFIG
  // =====================================
  devtools: { enabled: true },
  
  // =====================================
  // CSS & STYLING
  // =====================================
  css: ['~/assets/css/main.css'],
  
  // =====================================
  // MODULES
  // =====================================
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/google-fonts'
  ],

  // =====================================
  // GOOGLE FONTS
  // =====================================
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700]
    },
    display: 'swap'
  },

  // =====================================
  // PINIA CONFIGURATION
  // =====================================
  pinia: {
    storesDirs: ['./stores/**']
  },

  // =====================================
  // RUNTIME CONFIG
  // =====================================
  runtimeConfig: {
    // Private keys (only available on server-side)
    
    // Public keys (exposed to client-side)
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'https://api.chatseller.app',
      appEnv: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0'
    }
  },

  // =====================================
  // APP CONFIGURATION
  // =====================================
  app: {
    head: {
      title: 'ChatSeller Dashboard',
      titleTemplate: '%s - ChatSeller',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Dashboard ChatSeller - Gérez votre agent IA commercial' },
        { name: 'author', content: 'ChatSeller Team' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'ChatSeller Dashboard' },
        { property: 'og:description', content: 'Dashboard ChatSeller - Gérez votre agent IA commercial' },
        { property: 'og:site_name', content: 'ChatSeller' },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: 'ChatSeller Dashboard' },
        { name: 'twitter:description', content: 'Dashboard ChatSeller - Gérez votre agent IA commercial' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ]
    }
  },

  // =====================================
  // SSR CONFIGURATION
  // =====================================
  ssr: false, // SPA mode for better client-side auth handling
  
  // =====================================
  // NITRO CONFIGURATION
  // =====================================
  nitro: {
    preset: 'vercel'
  },

  // =====================================
  // BUILD CONFIGURATION
  // =====================================
  build: {
    transpile: ['@headlessui/vue']
  },

  // =====================================
  // TYPESCRIPT CONFIGURATION
  // =====================================
  typescript: {
    strict: false,
    typeCheck: false
  },

  // =====================================
  // IMPORTS CONFIGURATION
  // =====================================
  imports: {
    dirs: [
      'composables/**',
      'stores/**'
    ]
  },

  // =====================================
  // EXPERIMENTAL FEATURES
  // =====================================
  experimental: {
    payloadExtraction: false // Better for SPA
  },

  // =====================================
  // ROUTER CONFIGURATION
  // =====================================
  router: {
    options: {
      scrollBehaviorType: 'smooth'
    }
  },

  // =====================================
  // VITE CONFIGURATION
  // =====================================
  vite: {
    define: {
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Split vendor chunks for better caching
            'pinia': ['pinia'],
            'vue': ['vue', '@vue/runtime-core'],
            'utils': ['date-fns', 'lodash-es']
          }
        }
      }
    }
  }
})