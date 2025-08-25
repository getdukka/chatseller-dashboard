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

  // ✅ CONFIGURATION RUNTIME CORRIGÉE POUR VERCEL
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-key-chatseller-dashboard',
    
    public: {
      supabaseUrl: process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
      
      // ✅ URLS SÉCURISÉES AVEC FALLBACKS ROBUSTES
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 
        'https://chatseller-api-production.up.railway.app',
          
      widgetUrl: process.env.NUXT_PUBLIC_WIDGET_URL || 
        'https://widget.chatseller.app',
          
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 
        'https://dashboard.chatseller.app',
          
      environment: process.env.NODE_ENV || 'production',
      debug: process.env.DEBUG === 'true'
    }
  },

  // ✅ RÈGLES DE ROUTAGE CORRIGÉES POUR VERCEL
  routeRules: {
    // Pages statiques pour de meilleures performances
    '/': { 
      prerender: false, 
      ssr: true,
      headers: { 'Cache-Control': 's-maxage=300' }
    },
    '/login': { 
      ssr: true,
      headers: { 'Cache-Control': 's-maxage=300' }
    },
    '/register': { 
      ssr: true,
      headers: { 'Cache-Control': 's-maxage=300' }
    },
    
    // Pages dynamiques côté client uniquement
    '/auth/callback': { 
      ssr: false,
      prerender: false,
      headers: { 
        'X-Robots-Tag': 'noindex',
        'Cache-Control': 'no-cache'
      }
    },
    '/onboarding': { 
      ssr: false,
      prerender: false
    },
    
    // Pages protégées avec SSR conditionnel
    '/vendeurs-ia/**': { 
      ssr: false,  // ✅ Désactivé pour éviter les erreurs de données utilisateur
      prerender: false
    },
    '/conversations/**': { 
      ssr: false,
      prerender: false
    },
    '/agent-config': {  // ✅ AJOUT SPÉCIFIQUE
      ssr: false,
      prerender: false
    },
    
    // API routes
    '/api/**': { 
      cors: true,
      headers: { 
        'Cache-Control': 'no-cache, no-store, must-revalidate'
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

  // ✅ SSR DÉSACTIVÉ POUR LES PAGES SENSIBLES
  ssr: true,

  // ✅ CONFIGURATION NITRO OPTIMISÉE VERCEL
  nitro: {
    preset: 'vercel',
    compressPublicAssets: true,
    minify: true,
    storage: {
      redis: {
        driver: 'memory'  // Évite les erreurs Redis sur Vercel
      }
    }
  },

  // ✅ HEADERS SÉCURITÉ PRODUCTION
  headers: {
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  },

  plugins: [
    '~/plugins/auth.client.ts'
  ],

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

  // ✅ BUILD OPTIMISÉ VERCEL
  build: {
    transpile: ['@headlessui/vue']
  },

  vite: {
    define: {
      __VUE_PROD_DEVTOOLS__: false
    },
    optimizeDeps: {
      include: ['@supabase/supabase-js']
    },
    build: {
      target: 'es2020',
      sourcemap: false  // Désactivé pour optimiser
    }
  },

  // ✅ CONFIGURATION EXPÉRIMENTALE VERCEL
  experimental: {
    payloadExtraction: false,  
    inlineSSRStyles: false
  }
})