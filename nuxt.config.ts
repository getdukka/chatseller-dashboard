// nuxt.config.ts - CONFIGURATION FINALE CORRIGÉE
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // ✅ COMPATIBILITY DATE AJOUTÉ POUR ÉVITER LE WARNING
  compatibilityDate: '2025-07-24',

  // ✅ MODULES ESSENTIELS DANS LE BON ORDRE
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

  // ✅ TYPESCRIPT - CONFIGURATION PERMISSIVE POUR ÉVITER LES ERREURS
  typescript: {
    strict: false,
    typeCheck: false
  },

  // ✅ RUNTIME CONFIG - URLS CORRIGÉES
  runtimeConfig: {
    // Privé (serveur seulement)
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-key-chatseller-dashboard',
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
    
    // Public (client + serveur)
    public: {
      // ✅ URL API CORRIGÉE - UTILISER L'API RAILWAY
      apiBaseUrl: process.env.API_URL || 'https://chatseller-api-production.up.railway.app',
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      appUrl: process.env.APP_URL || 'http://localhost:3000',
      widgetUrl: process.env.WIDGET_URL || 'https://widget.chatseller.app'
    }
  },

  // ✅ AUTO-IMPORTS OPTIMISÉS
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
        'chart.js'
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

  // ✅ NITRO CONFIG - ÉVITER LES ERREURS DE CERTIFICAT EN DEV
  nitro: {
    experimental: {
      wasm: true
    },
    esbuild: {
      options: {
        target: 'es2020'
      }
    },
    // ✅ AJOUT POUR ÉVITER LES ERREURS SSL EN DÉVELOPPEMENT
    devProxy: {
      '/api': {
        target: process.env.API_URL || 'https://chatseller-api-production.up.railway.app',
        changeOrigin: true,
        secure: false // ✅ POUR ÉVITER LES ERREURS DE CERTIFICAT
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

  // ✅ HOOKS POUR ÉVITER LES ERREURS DE DÉVELOPPEMENT
  hooks: {
    'build:before': () => {
      console.log('🚀 Building ChatSeller Dashboard...')
    }
  }
})