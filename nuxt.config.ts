// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    // Private keys (only available on server-side)
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
    
    // Public keys (exposed to client-side)
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      apiUrl: process.env.API_URL || 'http://localhost:3001',
      widgetUrl: process.env.WIDGET_URL || 'https://widget.chatseller.app',
      appUrl: process.env.APP_URL || 'http://localhost:3000'
    }
  },

  app: {
    head: {
      title: 'ChatSeller Dashboard',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Dashboard pour configurer et analyser votre Agent IA Commercial ChatSeller' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' }
      ]
    }
  },

  // Configuration pour build et déploiement
  nitro: {
    preset: 'vercel'
  },

  // TypeScript configuration
  typescript: {
    typeCheck: false,
    strict: true
  },

  // Auto-imports configuration
  imports: {
    autoImport: true
  },

  // Ensure compatibility
  ssr: true,
  
  // Vite configuration
  vite: {
    define: {
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
    }
  }
})
function defineNuxtConfig(config: any) {
  return config;
}
