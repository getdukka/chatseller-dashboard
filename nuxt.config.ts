// nuxt.config.ts
export default defineNuxtConfig({
  // Métadonnées de l'application
  app: {
    head: {
      title: 'ChatSeller - Dashboard',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          name: 'description', 
          content: 'Dashboard professionnel pour gérer votre Agent IA Commercial ChatSeller' 
        },
        { name: 'robots', content: 'noindex, nofollow' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { 
          rel: 'preconnect', 
          href: 'https://fonts.gstatic.com', 
          crossorigin: 'anonymous' 
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
        }
      ]
    },
    layoutTransition: { name: 'layout', mode: 'out-in' },
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/image'
  ],

  // Configuration CSS
  css: [
    '~/assets/css/main.css'
  ],

  // Configuration Tailwind
  tailwindcss: {
    exposeConfig: true,
    config: {
      content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./nuxt.config.{js,ts}",
        "./app.vue"
      ],
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
          },
          colors: {
            primary: {
              50: '#eff6ff',
              100: '#dbeafe',
              200: '#bfdbfe',
              300: '#93c5fd',
              400: '#60a5fa',
              500: '#3b82f6',
              600: '#2563eb',
              700: '#1d4ed8',
              800: '#1e40af',
              900: '#1e3a8a',
            }
          },
          animation: {
            'fade-in': 'fadeIn 0.5s ease-in-out',
            'slide-in': 'slideIn 0.3s ease-out',
            'pulse-slow': 'pulse 3s infinite',
          },
          keyframes: {
            fadeIn: {
              '0%': { opacity: '0' },
              '100%': { opacity: '1' }
            },
            slideIn: {
              '0%': { transform: 'translateY(-10px)', opacity: '0' },
              '100%': { transform: 'translateY(0)', opacity: '1' }
            }
          }
        }
      }
    }
  },

  // Configuration runtime
  runtimeConfig: {
    // Variables privées (côté serveur uniquement)
    apiSecret: process.env.API_SECRET,
    jwtSecret: process.env.JWT_SECRET,
    
    // Variables publiques (exposées côté client)
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'https://chatseller-api-production.up.railway.app',
      appUrl: process.env.APP_URL || 'https://dashboard.chatseller.app',
      environment: process.env.NODE_ENV || 'development'
    }
  },

  // Configuration Nitro (serveur)
  nitro: {
    preset: 'vercel',
    routeRules: {
      '/api/**': { 
        headers: { 
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Access-Control-Allow-Credentials': 'true'
        }
      }
    }
  },

  // Configuration TypeScript
  typescript: {
    strict: true,
    typeCheck: false
  }
})