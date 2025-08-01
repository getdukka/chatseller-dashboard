// nuxt.config.ts - CONFIGURATION CORRIGÉE POUR RÉSOUDRE LA NAVIGATION
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // ✅ COMPATIBILITY DATE
  compatibilityDate: '2025-07-24',

  // ✅ MODULES EXISTANTS - GARDÉS
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/google-fonts'
  ],

  // ✅ CSS
  css: ['~/assets/css/main.css'],

  // ✅ GOOGLE FONTS
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700]
    }
  },

  // ✅ TYPESCRIPT
  typescript: {
    strict: false,
    typeCheck: false
  },

  // ✅ RUNTIME CONFIG - CONFIGURATION EXISTANTE GARDÉE
  runtimeConfig: {
    // Privé (serveur seulement)
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-key-chatseller-dashboard',
    
    // Public (client + serveur)
    public: {
      // API EXISTANTE (on garde pour les données business)
      apiBaseUrl: process.env.API_URL || 'https://chatseller-api-production.up.railway.app',
      
      // ✅ SUPABASE CONFIGURATION MANUELLE
      supabaseUrl: process.env.SUPABASE_URL || 'https://hdprfqmufuydpgwvhxvd.supabase.co',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkcHJmcW11ZnV5ZHBnd3ZoeHZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNzcxNjYsImV4cCI6MjA2Nzg1MzE2Nn0.VQMtvKJVflpRb7tjjQHPR6iSX0eThsGRjr6KIgIDGkc',
      
      // AUTRES CONFIG
      appUrl: process.env.APP_URL || 'http://localhost:3000',
      widgetUrl: process.env.WIDGET_URL || 'https://widget.chatseller.app'
    }
  },

  // ✅ ROUTE RULES SIMPLIFIÉES - LE CHANGEMENT PRINCIPAL
  routeRules: {
    // Pages statiques
    '/': { prerender: true },
    '/login': { prerender: true },
    '/register': { prerender: true },
    
    // ✅ NOUVEAU : SIMPLIFICATION DES ROUTES DYNAMIQUES
    // On retire les règles complexes et on laisse Nuxt gérer automatiquement
    '/vendeurs-ia/**': { 
      // On retire ssr: false qui causait des problèmes
      // On garde juste les headers de cache pour le développement
      headers: { 'cache-control': 'no-cache' }
    },
    '/knowledge-base/**': { 
      headers: { 'cache-control': 'no-cache' }
    },
    
    // SPA mode pour dashboard interactif
    '/dashboard': { spa: true },
    '/analytics': { spa: true }
  },

  // ✅ AUTO-IMPORTS
  imports: {
    dirs: [
      'composables',
      'composables/**',
      'stores',
      'stores/**',
      'utils',
      'utils/**',
      'types'
    ]
  },

  // ✅ COMPONENTS AUTO-IMPORT
  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ],

  // ✅ BUILD CONFIGURATION
  build: {
    transpile: ['@heroicons/vue', 'chart.js']
  },

  // ✅ VITE OPTIMIZATIONS AMÉLIORÉES
  vite: {
    optimizeDeps: {
      include: [
        '@heroicons/vue/24/outline',
        '@heroicons/vue/24/solid',
        '@vueuse/core',
        'pinia',
        'chart.js',
        '@supabase/supabase-js'
      ]
    },
    // ✅ NOUVEAU : Configuration pour éviter les erreurs d'hydratation
    define: {
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
    },
    vue: {
      script: {
        defineModel: true,
        propsDestructure: true
      }
    },
    server: {
      fs: {
        allow: ['..']
      }
    }
  },

  // ✅ PINIA CONFIGURATION
  pinia: {
    storesDirs: ['./stores/**', './custom-folder/stores/**']
  },

  // ✅ APP CONFIG
  app: {
    head: {
      title: 'ChatSeller Dashboard',
      meta: [
        { name: 'description', content: 'Vendeur IA - Dashboard' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { charset: 'utf-8' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // ✅ SSR CONFIG SIMPLIFIÉ
  ssr: true,

  // ✅ NITRO CONFIG
  nitro: {
    experimental: {
      wasm: true
    },
    esbuild: {
      options: {
        target: 'es2020'
      }
    }
  },

  // ✅ ROUTAGE CONFIGURÉ POUR PAGES DYNAMIQUES
  router: {
    options: {
      strict: false,
      sensitive: false
    }
  },

  // ✅ EXPERIMENTAL FEATURES
  experimental: {
    payloadExtraction: false,
    typedPages: true,
    scanPageMeta: true
  },

  // ✅ HOOKS POUR DEBUG AMÉLIORÉS
  hooks: {
    'build:before': () => {
      console.log('🚀 Building ChatSeller Dashboard...')
    },
    'render:route': (url, result, context) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('🛣️ [Nuxt] Route rendue:', url)
        if (url.includes('/vendeurs-ia/')) {
          console.log('🎯 [Nuxt] Route dynamique détectée:', url)
        }
      }
    },
    // ✅ NOUVEAU : Hook pour diagnostiquer les erreurs de navigation
    'app:error': (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ [Nuxt] Erreur app:', error)
      }
    }
  }
})