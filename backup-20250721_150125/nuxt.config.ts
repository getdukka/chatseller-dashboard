// nuxt.config.ts
export default defineNuxtConfig({
  // Configuration de base
  devtools: { enabled: true },
  ssr: true,
  
  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],

  // Configuration TypeScript
  typescript: {
    strict: false, // Permettre plus de flexibilité pendant le développement
    typeCheck: false // Désactiver type check au build pour éviter les erreurs bloquantes
  },

  // Configuration CSS
  css: [
    '~/assets/css/main.css'
  ],

  // Auto-imports configuration
  imports: {
    // Désactiver l'auto-import des stores pour éviter les conflits
    dirs: [
      'composables/**', // Auto-import des composables uniquement
      // Exclure le dossier stores de l'auto-import
    ]
  },

  // Configuration Pinia
  pinia: {
    storesDirs: ['~/stores/**'] // Utiliser Pinia pour les stores
  },

  // Variables d'environnement
  runtimeConfig: {
    // Clés privées (serveur seulement)
    jwtSecret: process.env.JWT_SECRET,
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
    
    // Clés publiques (disponibles côté client)
    public: {
      apiUrl: process.env.API_URL || 'https://api.chatseller.app',
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      widgetUrl: process.env.WIDGET_URL || 'https://widget.chatseller.app',
      appUrl: process.env.APP_URL || 'http://localhost:3000'
    }
  },

  // Configuration du serveur de développement
  devServer: {
    port: 3000,
    host: 'localhost'
  },

  // Configuration des headers pour CORS
  nitro: {
    routeRules: {
      '/api/**': {
        cors: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    }
  }
})