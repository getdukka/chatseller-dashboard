// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/image'
    // Supprimé '@supabase/nuxt' temporairement
  ],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    apiSecret: '',
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://api.chatseller.app',
      environment: process.env.NODE_ENV || 'development'
      // Supprimé les variables Supabase
    }
  },

  nitro: {
    preset: 'vercel'
  },

  build: {
    transpile: ['@headlessui/vue', '@heroicons/vue']
  },

  ssr: true,

  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ],

  imports: {
    dirs: [
      'composables',
      'utils',
      'stores'
    ]
  },

  typescript: {
    typeCheck: false
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css'
  },

  app: {
    head: {
      title: 'ChatSeller Dashboard',
      titleTemplate: '%s - ChatSeller',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          name: 'description', 
          content: 'Dashboard pour gérer votre Agent IA Commercial ChatSeller' 
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  vite: {
    optimizeDeps: {
      include: ['date-fns', 'pinia']
    }
  }
})