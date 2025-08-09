<!-- app.vue - CORRIGÉ -->
<template>
  <div id="app">
    <!-- Loading global -->
    <div v-if="pending" class="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Un instant, nous préparons votre Dashboard...</p>
      </div>
    </div>

    <!-- Application -->
    <NuxtLayout v-else>
      <NuxtPage />
    </NuxtLayout>

    <!-- Toast notifications globales -->
    <div v-if="notifications.length > 0" class="fixed top-4 right-4 z-50 space-y-2">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden transform transition-all duration-300 animate-slide-in-right"
        :class="getNotificationClasses(notification.type)"
      >
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <component :is="getNotificationIcon(notification.type)" class="h-5 w-5" />
            </div>
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p class="text-sm font-medium text-gray-900">
                {{ notification.title }}
              </p>
              <p v-if="notification.message" class="mt-1 text-sm text-gray-500">
                {{ notification.message }}
              </p>
            </div>
            <div class="ml-4 flex-shrink-0 flex">
              <button
                @click="removeNotification(notification.id)"
                class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span class="sr-only">Fermer</span>
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div
          v-if="notification.autoHide"
          class="h-1 bg-gray-200"
        >
          <div
            class="h-full transition-all duration-1000 ease-linear"
            :class="getNotificationBarClass(notification.type)"
            :style="{ width: `${getProgressWidth(notification)}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Modal de maintenance (si nécessaire) -->
    <div v-if="isMaintenanceMode" class="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
        <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-yellow-100 mb-4">
          <svg class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          Maintenance en cours
        </h3>
        <p class="text-gray-600 mb-4">
          Nous effectuons une maintenance pour améliorer nos services. Nous serons de retour bientôt.
        </p>
        <div class="animate-pulse text-sm text-gray-500">
          Vérification automatique...
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from './stores/auth'

// Types
interface NotificationApp {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  autoHide?: boolean
  createdAt: number
}

// État global de l'application
const pending = ref(true)
const isMaintenanceMode = ref(false)
const notifications = ref<NotificationApp[]>([])

// Initialisation de l'application
onMounted(async () => {
  try {
    // Vérifier le statut du service
    await checkServiceStatus()
    
    // Autres initialisations...
    await initializeApplication()
    
  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error)
    addNotification({
      type: 'error',
      title: 'Erreur de connexion',
      message: 'Impossible de se connecter aux services ChatSeller',
      autoHide: false
    })
  } finally {
    pending.value = false
  }
})

// ===========================================
// GESTION DES NOTIFICATIONS
// ===========================================

const addNotification = (notification: Omit<NotificationApp, 'id' | 'createdAt'>) => {
  const newNotification: NotificationApp = {
    id: Math.random().toString(36).substr(2, 9),
    createdAt: Date.now(),
    autoHide: true,
    ...notification
  }

  notifications.value.push(newNotification)

  // Auto-remove après 5 secondes si autoHide est activé
  if (newNotification.autoHide) {
    setTimeout(() => {
      removeNotification(newNotification.id)
    }, 5000)
  }
}

const removeNotification = (id: string) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'success': return CheckCircleIcon
    case 'error': return ExclamationCircleIcon
    case 'warning': return ExclamationTriangleIcon
    case 'info': return InformationCircleIcon
    default: return InformationCircleIcon
  }
}

const getNotificationClasses = (type: string) => {
  switch (type) {
    case 'success': return 'border-l-4 border-green-400'
    case 'error': return 'border-l-4 border-red-400'
    case 'warning': return 'border-l-4 border-yellow-400'
    case 'info': return 'border-l-4 border-blue-400'
    default: return 'border-l-4 border-gray-400'
  }
}

const getNotificationBarClass = (type: string) => {
  switch (type) {
    case 'success': return 'bg-green-400'
    case 'error': return 'bg-red-400'
    case 'warning': return 'bg-yellow-400'
    case 'info': return 'bg-blue-400'
    default: return 'bg-gray-400'
  }
}

const getProgressWidth = (notification: NotificationApp) => {
  if (!notification.autoHide) return 100
  const elapsed = Date.now() - notification.createdAt
  const total = 5000 // 5 secondes
  return Math.max(0, 100 - (elapsed / total) * 100)
}

// ===========================================
// INITIALISATION DE L'APPLICATION
// ===========================================

const checkServiceStatus = async () => {
  try {
    const response = await $fetch('/api/health', { timeout: 5000 })
    if (response.status !== 'ok') {
      throw new Error('Service unavailable')
    }
  } catch (error) {
    console.warn('Health check failed:', error)
    // Continuer même si le health check échoue
  }
}

const initializeApplication = async () => {
  // ✅ CORRECTION: Utiliser le store directement pour restoreSession
  try {
    const authStore = useAuthStore()
    await authStore.restoreSession() // ✅ Méthode qui existe dans le store
    console.log('✅ Session restaurée avec succès')
  } catch (error) {
    console.error('❌ Erreur initialisation auth:', error)
  }

  // Autres initialisations...
  await initializeTheme()
  await setupErrorHandling()
}

const initializeTheme = async () => {
  // Gérer les préférences de thème (dark mode, etc.)
  const theme = localStorage.getItem('theme') || 'light'
  document.documentElement.setAttribute('data-theme', theme)
}

const setupErrorHandling = async () => {
  // Gestion globale des erreurs
  window.addEventListener('error', (event) => {
    console.error('Erreur globale:', event.error)
    if (process.env.NODE_ENV === 'production') {
      addNotification({
        type: 'error',
        title: 'Une erreur inattendue s\'est produite',
        message: 'L\'équipe technique a été notifiée',
        autoHide: true
      })
    }
  })

  // Gestion des promesses rejetées
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Promesse rejetée:', event.reason)
    if (event.reason?.statusCode === 401) {
      // Géré par le store auth
      return
    }
    
    if (process.env.NODE_ENV === 'production') {
      addNotification({
        type: 'error',
        title: 'Erreur de connexion',
        message: 'Vérifiez votre connexion internet',
        autoHide: true
      })
    }
  })
}

// ===========================================
// EXPOSITION GLOBALE
// ===========================================

// Exposer la fonction addNotification globalement
provide('addNotification', addNotification)

// Nettoyage
onUnmounted(() => {
  notifications.value = []
})

// Meta tags globaux
useHead({
  htmlAttrs: {
    lang: 'fr'
  },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'format-detection', content: 'telephone=no' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
  ]
})
</script>

<style>
/* Styles globaux pour l'application */
#app {
  min-height: 100vh;
  font-family: 'Inter', system-ui, sans-serif;
}

/* Transitions pour les notifications */
.animate-slide-in-right {
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Styles pour le loading spinner */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>