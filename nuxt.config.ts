// nuxt.config.ts 
export default defineNuxtConfig({
  devtools: { enabled: process.env.NODE_ENV === 'development' },
  
  compatibilityDate: '2025-01-15',

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
    },
    display: 'swap',
    preload: true
  },

  typescript: {
    strict: false,
    typeCheck: false
  },

  // ✅ CONFIGURATION RUNTIME DYNAMIQUE AVEC URLS CORRECTES
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-key-chatseller-dashboard',
    
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      
      // ✅ URLS DYNAMIQUES SELON L'ENVIRONNEMENT AVEC FALLBACKS INTELLIGENTS
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 
        (process.env.NODE_ENV === 'production' 
          ? 'https://chatseller-api-production.up.railway.app'
          : 'http://localhost:3001'),
          
      widgetUrl: process.env.NUXT_PUBLIC_WIDGET_URL || 
        (process.env.NODE_ENV === 'production'
          ? 'https://widget.chatseller.app'
          : 'https://widget.chatseller.app'), // ✅ Utilise production même en dev pour l'instant
          
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 
        (process.env.NODE_ENV === 'production'
          ? 'https://dashboard.chatseller.app'
          : 'http://localhost:3002'),
          
      environment: process.env.NODE_ENV || 'development',
      
      // ✅ NOUVELLE CONFIG POUR DEBUG
      debug: process.env.DEBUG === 'true' || process.env.NODE_ENV === 'development'
    }
  },

  // ✅ RÈGLES DE ROUTAGE OPTIMISÉES
  routeRules: {
    // Pages statiques - prerender en production
    '/': { 
      prerender: false, 
      ssr: true 
    },
    '/login': { 
      prerender: process.env.NODE_ENV === 'production',
      ssr: true
    },
    '/register': { 
      prerender: process.env.NODE_ENV === 'production',
      ssr: true
    },
    
    // Pages callback - toujours côté client
    '/auth/callback': { 
      prerender: false, 
      ssr: false,
      headers: { 'X-Robots-Tag': 'noindex' }
    },
    '/onboarding': { 
      prerender: false, 
      ssr: false,
      headers: { 'X-Robots-Tag': 'noindex' }
    },
    
    // Pages protégées - SSR conditionnel
    '/vendeurs-ia/**': { 
      prerender: false, 
      ssr: process.env.NODE_ENV === 'production'
    },
    '/conversations/**': { 
      prerender: false, 
      ssr: false 
    },
    '/orders/**': { 
      prerender: false, 
      ssr: false 
    },
    '/settings/**': { 
      prerender: false, 
      ssr: process.env.NODE_ENV === 'production'
    },
    '/billing': { 
      prerender: false, 
      ssr: process.env.NODE_ENV === 'production'
    },
    '/analytics': { 
      prerender: false, 
      ssr: false 
    },
    '/knowledge-base/**': { 
      prerender: false, 
      ssr: false 
    },
    '/products/**': { 
      prerender: false, 
      ssr: false 
    },
    
    // API routes - headers de cache
    '/api/**': { 
      cors: true,
      headers: { 
        'Cache-Control': process.env.NODE_ENV === 'production' 
          ? 'public, max-age=300' 
          : 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    }
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

  // ✅ SSR INTELLIGENT
  ssr: true,

  // ✅ CONFIGURATION NITRO POUR PRODUCTION
  nitro: {
    preset: process.env.NODE_ENV === 'production' ? 'vercel' : 'node-server',
    compressPublicAssets: process.env.NODE_ENV === 'production',
    routeRules: {
      '/auth/callback': { 
        headers: { 
          'X-Robots-Tag': 'noindex',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        } 
      },
      '/onboarding': { 
        headers: { 
          'X-Robots-Tag': 'noindex',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        } 
      }
    }
  },

  // ✅ HEADERS DE SÉCURITÉ EN PRODUCTION UNIQUEMENT
  headers: process.env.NODE_ENV === 'production' ? {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  } : {},

  // ✅ PLUGINS CONDITIONNELS
  plugins: [
    '~/plugins/auth.client.ts'
  ],

  // ✅ CONFIGURATION APP AVEC META DYNAMIQUES
  app: {
    head: {
      title: 'ChatSeller Dashboard',
      titleTemplate: '%s | ChatSeller',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Dashboard ChatSeller - Créez des Vendeurs IA pour votre e-commerce' },
        { name: 'robots', content: process.env.NODE_ENV === 'production' ? 'index, follow' : 'noindex, nofollow' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: process.env.NUXT_PUBLIC_APP_URL || 'https://dashboard.chatseller.app' }
      ]
    }
  },

  // ✅ HOOKS CONDITIONNELS POUR DEBUG
  hooks: process.env.NODE_ENV === 'development' ? {
    'render:route': (url: string) => {
      console.log('🛣️ [Nuxt] Route rendue:', url)
    },
    'app:created': () => {
      console.log('🚀 [Nuxt] App créée avec succès')
      console.log('🔧 [Nuxt] Config URLs:', {
        api: process.env.NUXT_PUBLIC_API_BASE_URL,
        widget: process.env.NUXT_PUBLIC_WIDGET_URL,
        app: process.env.NUXT_PUBLIC_APP_URL,
        env: process.env.NODE_ENV
      })
    }
  } : {},

  // ✅ CONFIGURATION BUILD OPTIMISÉE
  build: {
    transpile: ['@headlessui/vue']
  },

  // ✅ CONFIGURATION VITE POUR PERFORMANCE
  vite: {
    define: {
      __VUE_PROD_DEVTOOLS__: process.env.NODE_ENV === 'development',
      __NUXT_ENV__: JSON.stringify(process.env.NODE_ENV || 'development')
    },
    optimizeDeps: {
      include: ['@supabase/supabase-js']
    },
    build: {
      target: 'es2020',
      rollupOptions: {
        output: {
          manualChunks: process.env.NODE_ENV === 'production' ? {
            'supabase': ['@supabase/supabase-js'],
            'vendor': ['vue', 'pinia']
          } : undefined
        }
      }
    }
  },

  // ✅ CONFIGURATION EXPÉRIMENTALE OPTIMISÉE
  experimental: {
    payloadExtraction: process.env.NODE_ENV === 'production',
    inlineSSRStyles: process.env.NODE_ENV === 'production'
  },

  // ✅ CONFIGURATION DE CACHE
  spaLoadingTemplate: process.env.NODE_ENV === 'production',

  // ✅ GESTION D'ERREURS GLOBALES
  errorHandler: '~/error.vue'
})