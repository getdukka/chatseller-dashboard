// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // Modules - SANS @nuxtjs/supabase
  modules: [
    '@nuxtjs/tailwindcss'
  ],

  // CSS
  css: ['~/assets/css/main.css'],

  // Runtime config
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      apiUrl: process.env.API_URL || 'https://api.chatseller.app',
      widgetUrl: process.env.WIDGET_URL || 'https://widget.chatseller.app',
      appUrl: process.env.APP_URL || 'https://dashboard.chatseller.app'
    }
  },

  // TypeScript configuration
  typescript: {
    strict: false,
    typeCheck: false
  },

  // Auto-imports
  imports: {
    dirs: [
      'composables',
      'composables/**',
      'utils'
    ]
  },

  // Components auto-import
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    }
  ],

  // App configuration
  app: {
    head: {
      title: 'ChatSeller Dashboard',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Dashboard de votre Agent IA Commercial ChatSeller' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // Build configuration
  build: {
    transpile: ['@headlessui/vue', '@supabase/supabase-js']
  }
})