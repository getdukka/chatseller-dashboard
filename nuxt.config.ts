// nuxt.config.ts - VERSION COMPLÈTE AVEC CORRECTIONS ONBOARDING ET SIDEBAR
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

  // ✅ RÈGLES DE ROUTAGE OPTIMISÉES POUR LES CORRECTIONS
  routeRules: {
    // Pages publiques - pas de middleware
    '/': { prerender: false }, // ✅ Désactiver prerender pour le dashboard dynamique
    '/login': { prerender: true },
    '/register': { prerender: true },
    '/auth/callback': { prerender: false, ssr: false }, // ✅ Callback côté client uniquement
    '/onboarding': { prerender: false, ssr: false }, // ✅ Onboarding côté client
    
    // Pages protégées - avec middlewares
    '/vendeurs-ia': { prerender: false, ssr: false }, // ✅ Côté client pour éviter conflits
    '/conversations/**': { prerender: false },
    '/orders/**': { prerender: false },
    '/settings/**': { prerender: false },
    '/billing': { prerender: false },
    '/analytics': { prerender: false },
    '/knowledge-base/**': { prerender: false },
    '/products/**': { prerender: false },
    '/agent-config': { prerender: false, ssr: false } // ✅ Configuration agent côté client
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

  // ✅ SSR HYBRIDE - Server pour public, Client pour protégé
  ssr: true,

  // ✅ CONFIGURATION ROUTER POUR CORRIGER LA NAVIGATION
  router: {
    options: {
      strict: false,
      // ✅ Configuration pour éviter les conflits de navigation
      scrollBehaviorType: 'smooth'
    }
  },

  // ✅ CONFIGURATION NITRO POUR LES REDIRECTIONS
  nitro: {
    routeRules: {
      '/auth/callback': { headers: { 'X-Robots-Tag': 'noindex' } },
      '/onboarding': { headers: { 'X-Robots-Tag': 'noindex' } }
    }
  },

  // ✅ PLUGINS POUR INITIALISATION
  plugins: [
    '~/plugins/auth.client.ts' // ✅ Plugin auth côté client
  ],

  // ✅ CONFIGURATION APP
  app: {
    head: {
      title: 'ChatSeller Dashboard',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Dashboard ChatSeller - Agent IA Commercial' }
      ]
    }
  },

  // ✅ LOGGING AMÉLIORÉ POUR DEBUG
  hooks: {
    'render:route': (url, result, context) => {
      if (process.dev) {
        console.log('🛣️ [Nuxt] Route rendue:', url)
      }
    },
    'app:created': (app) => {
      if (process.dev) {
        console.log('🚀 [Nuxt] App créée avec succès')
      }
    }
  },

  // ✅ CONFIGURATION DE BUILD
  build: {
    transpile: ['@headlessui/vue']
  },

  // ✅ CONFIGURATION VITE
  vite: {
    define: {
      __VUE_PROD_DEVTOOLS__: false
    },
    optimizeDeps: {
      include: ['@supabase/supabase-js']
    }
  },

  // ✅ CONFIGURATION EXPERIMENTAL
  experimental: {
    payloadExtraction: false, // ✅ Éviter les conflits avec les middlewares
    inlineSSRStyles: false
  }
})