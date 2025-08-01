// nuxt.config.ts - VERSION MINIMALE POUR TEST
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  compatibilityDate: '2025-07-24',

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/google-fonts'
  ],

  css: ['~/assets/css/main.css'],

  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700]
    }
  },

  typescript: {
    strict: false,
    typeCheck: false
  },

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-key-chatseller-dashboard',
    
    public: {
      apiBaseUrl: process.env.API_URL || 'https://chatseller-api-production.up.railway.app',
      supabaseUrl: process.env.SUPABASE_URL || 'https://hdprfqmufuydpgwvhxvd.supabase.co',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkcHJmcW11ZnV5ZHBnd3ZoeHZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNzcxNjYsImV4cCI6MjA2Nzg1MzE2Nn0.VQMtvKJVflpRb7tjjQHPR6iSX0eThsGRjr6KIgIDGkc',
      appUrl: process.env.APP_URL || 'http://localhost:3000',
      widgetUrl: process.env.WIDGET_URL || 'https://widget.chatseller.app'
    }
  },

  // ✅ RÈGLES DE ROUTAGE SIMPLIFIÉES AU MAXIMUM
  routeRules: {
    '/': { prerender: true },
    '/login': { prerender: true },
    '/register': { prerender: true }
    // Suppression de TOUTES les règles pour /vendeurs-ia/**
  },

  imports: {
    dirs: [
      'composables',
      'stores',
      'utils',
      'types'
    ]
  },

  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ],

  ssr: true,

  // ✅ CONFIGURATION ROUTER SIMPLIFIÉE
  router: {
    options: {
      strict: false
    }
  },

  // ✅ LOGGING POUR DEBUG
  hooks: {
    'render:route': (url, result, context) => {
      console.log('🛣️ [Nuxt] Route rendue:', url)
    }
  }
})