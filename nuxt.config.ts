// nuxt.config.ts - VERSION CORRIGÉE POUR VERCEL
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

  // ✅ CONFIGURATION RUNTIME SIMPLIFIÉE POUR VERCEL
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-key-chatseller-dashboard',
    
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      
      // ✅ URLS FIXES POUR PRODUCTION VERCEL
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://chatseller-api-production.up.railway.app',
      widgetUrl: process.env.NUXT_PUBLIC_WIDGET_URL || 'https://widget.chatseller.app',
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'https://dashboard.chatseller.app',
      environment: process.env.NODE_ENV || 'production',
      debug: process.env.DEBUG === 'true'
    }
  },

  // ✅ RÈGLES DE ROUTAGE SIMPLIFIÉES POUR VERCEL
  routeRules: {
    // Pages publiques
    '/': { prerender: false, ssr: true },
    '/login': { prerender: false, ssr: true },
    '/register': { prerender: false, ssr: true },
    
    // Pages de callback - client side seulement
    '/auth/callback': { ssr: false },
    '/onboarding': { ssr: false },
    
    // Pages protégées - client side pour éviter les problèmes d'auth
    '/vendeurs-ia/**': { ssr: false },
    '/conversations/**': { ssr: false },
    '/orders/**': { ssr: false },
    '/settings/**': { ssr: false },
    '/billing': { ssr: false },
    '/analytics': { ssr: false },
    '/knowledge-base/**': { ssr: false },
    '/products/**': { ssr: false }
  },

  imports: {
    dirs: [
      'composables',
      'stores',
      'utils'
    ]
  },

  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ],

  // ✅ SSR DÉSACTIVÉ POUR LES PAGES PROTÉGÉES
  ssr: true,

  // ✅ CONFIGURATION NITRO OPTIMISÉE POUR VERCEL
  nitro: {
    preset: 'vercel',
    vercel: {
      functions: {
        maxDuration: 30
      }
    }
  },

  // ✅ PLUGINS SIMPLIFIÉS
  plugins: [
    '~/plugins/auth.client.ts'
  ],

  // ✅ CONFIGURATION APP BASIQUE
  app: {
    head: {
      title: 'ChatSeller Dashboard',
      titleTemplate: '%s | ChatSeller',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Dashboard ChatSeller - Créez des Vendeurs IA pour votre e-commerce' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // ✅ BUILD CONFIGURATION SIMPLIFIÉE
  build: {
    transpile: ['@headlessui/vue']
  },

  // ✅ VITE CONFIGURATION BASIQUE
  vite: {
    optimizeDeps: {
      include: ['@supabase/supabase-js']
    }
  }
})