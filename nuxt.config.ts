// nuxt.config.ts - AUTO-IMPORTS CORRIGÉS
export default defineNuxtConfig({
  app: {
    head: {
      title: 'ChatSeller - Dashboard',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          name: 'description', 
          content: 'Dashboard professionnel pour gérer votre Agent IA Commercial ChatSeller' 
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
        }
      ]
    }
  },

  // ✅ MODULES ESSENTIELS
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/image'
  ],

  // ✅ AUTO-IMPORTS CONFIGURÉS EXPLICITEMENT
  imports: {
    dirs: [
      'composables',
      'composables/**',
      'utils',
      'utils/**',
      'stores',
      'stores/**'
    ],
    // ✅ IMPORTS EXPLICITES des composables Vue et Nuxt
    imports: [
      // Vue
      { name: 'ref', from: 'vue' },
      { name: 'reactive', from: 'vue' },
      { name: 'computed', from: 'vue' },
      { name: 'onMounted', from: 'vue' },
      { name: 'onUnmounted', from: 'vue' },
      { name: 'watch', from: 'vue' },
      { name: 'watchEffect', from: 'vue' },
      { name: 'inject', from: 'vue' },
      { name: 'provide', from: 'vue' },
      { name: 'readonly', from: 'vue' },
      { name: 'toRef', from: 'vue' },
      // Nuxt
      { name: 'navigateTo', from: '#app' },
      { name: 'useRoute', from: '#app' },
      { name: 'useRouter', from: '#app' },
      { name: 'useRuntimeConfig', from: '#app' },
      { name: 'useLazyFetch', from: '#app' },
      { name: 'useHead', from: '#app' },
      { name: 'useSeoMeta', from: '#app' },
      { name: 'definePageMeta', from: '#app' },
      { name: 'defineNuxtRouteMiddleware', from: '#app' },
      { name: '$fetch', from: '#app' }
    ]
  },

  // ✅ COMPOSANTS AUTO-IMPORTÉS
  components: [
    { 
      path: '~/components', 
      pathPrefix: false 
    },
    { 
      path: '~/components/ui', 
      prefix: 'UI' 
    },
    {
      path: '~/components/charts',
      prefix: 'Chart'
    }
  ],

  css: ['~/assets/css/main.css'],

  // ✅ BUILD OPTIMISÉ
  build: {
    transpile: ['vue-chartjs', 'chart.js']
  },

  // ✅ VARIABLES D'ENVIRONNEMENT
  runtimeConfig: {
    apiSecret: process.env.API_SECRET,
    jwtSecret: process.env.JWT_SECRET,
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'https://chatseller-api-production.up.railway.app',
      appUrl: process.env.APP_URL || 'https://dashboard.chatseller.app',
      environment: process.env.NODE_ENV || 'development'
    }
  },

  // ✅ CONFIGURATION NITRO
  nitro: {
    preset: 'vercel'
  },

  // ✅ TYPESCRIPT STRICT
  typescript: {
    strict: true,
    typeCheck: false // Désactivé pour les performances en dev
  },

  // ✅ OPTIMISATIONS
  experimental: {
    payloadExtraction: false
  },

  // ✅ COMPATIBILITÉ
  compatibilityDate: '2025-07-23'
})