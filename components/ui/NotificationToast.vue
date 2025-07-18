<!-- components/ui/NotificationToast.vue -->
<template>
  <div
    v-if="notifications.length > 0"
    aria-live="assertive"
    class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-50"
  >
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <TransitionGroup
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
        tag="div"
        class="space-y-4"
      >
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5"
        >
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <CheckCircleIcon
                  v-if="notification.type === 'success'"
                  class="h-6 w-6 text-green-400"
                />
                <XCircleIcon
                  v-else-if="notification.type === 'error'"
                  class="h-6 w-6 text-red-400"
                />
                <ExclamationTriangleIcon
                  v-else-if="notification.type === 'warning'"
                  class="h-6 w-6 text-yellow-400"
                />
                <InformationCircleIcon
                  v-else
                  class="h-6 w-6 text-blue-400"
                />
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-gray-900">
                  {{ notification.title || getDefaultTitle(notification.type) }}
                </p>
                <p class="mt-1 text-sm text-gray-500">{{ notification.message }}</p>
              </div>
              <div class="ml-4 flex flex-shrink-0">
                <button
                  @click="removeNotification(notification.id)"
                  class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span class="sr-only">Fermer</span>
                  <XMarkIcon class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TransitionGroup } from 'vue'
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
}

const notifications = ref<Notification[]>([])

// ✅ Correction TypeScript : typage explicite
const getDefaultTitle = (type: 'success' | 'error' | 'warning' | 'info'): string => {
  const titles: Record<string, string> = {
    success: 'Succès',
    error: 'Erreur',
    warning: 'Attention',
    info: 'Information'
  }
  return titles[type] || 'Notification'
}

const addNotification = (notification: Omit<Notification, 'id'>) => {
  const id = Date.now().toString()
  const newNotification = { ...notification, id }
  notifications.value.push(newNotification)

  // Auto-remove après durée spécifiée (défaut: 5s)
  const duration = notification.duration || 5000
  setTimeout(() => {
    removeNotification(id)
  }, duration)
}

const removeNotification = (id: string) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

// Exposer les fonctions pour utilisation globale
defineExpose({
  addNotification,
  removeNotification
})
</script>