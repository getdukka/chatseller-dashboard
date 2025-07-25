// nuxt.config.ts - CONFIGURATION SIMPLIFIÉE SUPABASE
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // ✅ COMPATIBILITY DATE
  compatibilityDate: '2025-07-24',

  // ✅ MODULES SIMPLIFIÉS - RETIRER @nuxtjs/supabase POUR L'INSTANT
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

  // ✅ RUNTIME CONFIG - CONFIGURATION SUPABASE MANUELLE
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

  // ✅ VITE OPTIMIZATIONS
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
    define: {
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
    },
    vue: {
      script: {
        defineModel: true,
        propsDestructure: true
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
        { name: 'description', content: 'Agent IA Commercial - Dashboard' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { charset: 'utf-8' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // ✅ SSR CONFIG
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

  // ✅ ROUTAGE
  router: {
    options: {
      strict: false
    }
  },

  // ✅ EXPERIMENTAL FEATURES
  experimental: {
    payloadExtraction: false,
    typedPages: true
  },

  // ✅ HOOKS
  hooks: {
    'build:before': () => {
      console.log('🚀 Building ChatSeller Dashboard with manual Supabase setup...')
    }
  }
})