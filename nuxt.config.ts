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

  // ✅ CONFIGURATION RUNTIME CORRIGÉE
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-key-chatseller-dashboard',
    
    public: {
      // ✅ Utilise les bonnes variables d'environnement
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY,
      
      // ✅ URL API - Toujours utiliser la variable d'env, fallback production
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://chatseller-api-production.up.railway.app',
          
      widgetUrl: process.env.NUXT_PUBLIC_WIDGET_URL || 
        (process.env.NODE_ENV === 'production'
          ? 'https://widget.chatseller.app'
          : 'https://widget.chatseller.app'),
          
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 
        (process.env.NODE_ENV === 'production'
          ? 'https://dashboard.chatseller.app'
          : 'http://localhost:3002'),
          
      environment: process.env.NODE_ENV || 'development',
      debug: process.env.DEBUG === 'true' || process.env.NODE_ENV === 'development'
    }
  },

  // Règles de routage (SSR désactivé globalement, règles simplifiées)
  routeRules: {
    '/auth/callback': {
      headers: { 'X-Robots-Tag': 'noindex' }
    },
    '/onboarding': {
      headers: { 'X-Robots-Tag': 'noindex' }
    },
    '/api/**': {
      cors: true,
      headers: {
        'Cache-Control': process.env.NODE_ENV === 'production'
          ? 'public, max-age=300'
          : 'no-cache, no-store, must-revalidate'
      }
    }
  },

  imports: {
    dirs: [
      'composables/**',
      'stores/**',
      'utils/**',
      'types/**'
    ],
    // ✅ Éviter les imports dupliqués
    transform: {
      exclude: [/\bindex\.(js|ts|mjs|mts)$/]
    }
  },

  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ],

  // Dashboard est une SPA interactive derrière auth — SSR n'apporte rien et ralentit
  ssr: false,

  // ✅ CONFIGURATION NITRO FIXÉE POUR VERCEL
  nitro: {
    preset: process.env.NODE_ENV === 'production' ? 'vercel' : 'node-server',
    compressPublicAssets: process.env.NODE_ENV === 'production',
    // ✅ Suppression des configurations problématiques
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

  // ✅ HEADERS DE SÉCURITÉ EN PRODUCTION
  headers: process.env.NODE_ENV === 'production' ? {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  } : {},

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
        { name: 'description', content: 'Dashboard ChatSeller - Créez des Vendeurs IA pour votre e-commerce' },
        { name: 'robots', content: process.env.NODE_ENV === 'production' ? 'index, follow' : 'noindex, nofollow' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: process.env.NUXT_PUBLIC_APP_URL || 'https://dashboard.chatseller.app' }
      ]
    }
  },

  hooks: process.env.NODE_ENV === 'development' ? {
    'render:route': (url: string) => {
      console.log('🛣️ [Nuxt] Route rendue:', url)
    },
    'app:created': () => {
      console.log('🚀 [Nuxt] App créée avec succès')
    }
  } : {},

  build: {
    transpile: ['@headlessui/vue']
  },

  vite: {
    define: {
      __VUE_PROD_DEVTOOLS__: process.env.NODE_ENV === 'development'
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

  experimental: {
    payloadExtraction: process.env.NODE_ENV === 'production',
    inlineSSRStyles: process.env.NODE_ENV === 'production'
  },

  errorHandler: '~/error.vue'
})