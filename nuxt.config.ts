// nuxt.config.ts - CONFIGURATION CORRIGÉE DÉFINITIVE
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

  // ✅ COMPOSANTS AUTO-IMPORTÉS
  components: [
    { 
      path: '~/components', 
      pathPrefix: false 
    },
    { 
      path: '~/components/ui', 
      prefix: '' 
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

  // ✅ TYPESCRIPT CONFIGURÉ
  typescript: {
    strict: false,
    typeCheck: false
  },

  // ✅ COMPATIBILITÉ
  compatibilityDate: '2025-07-23'
})