// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-21',
  devtools: { enabled: true },
  ssr: true,
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],

  typescript: {
    strict: false,
    typeCheck: false
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'chatseller-jwt-secret-dev',
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
    
    public: {
      apiUrl: '/api', // Endpoints locaux Nuxt
      externalApiUrl: 'https://chatseller-api-production.up.railway.app', // API Railway
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      widgetUrl: process.env.WIDGET_URL || 'https://widget.chatseller.app',
      appUrl: process.env.APP_URL || 'http://localhost:3000'
    }
  },

  devServer: {
    port: 3000,
    host: 'localhost'
  },

  // CONFIGURATION NITRO CORRIGÉE - Séparation des endpoints
  nitro: {
    experimental: {
      wasm: false
    },
    
    // Proxy SEULEMENT pour les routes externes spécifiques
    routeRules: {
      '/external-api/**': {
        cors: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        },
        proxy: {
          to: 'https://chatseller-api-production.up.railway.app/**'
        }
      }
    },
    
    // DevProxy désactivé pour permettre les endpoints locaux
    devProxy: {
      '/external-api': {
        target: 'https://chatseller-api-production.up.railway.app',
        changeOrigin: true
      }
    }
  }
})