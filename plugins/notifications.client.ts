// plugins/notifications.client.ts
import { ref, readonly } from 'vue'

interface NotificationItem {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
}

export default defineNuxtPlugin(() => {
  const notifications = ref<NotificationItem[]>([])

  const addNotification = (notification: Omit<NotificationItem, 'id'>) => {
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

  const showNotification = (
    message: string, 
    type: 'success' | 'error' | 'warning' | 'info' = 'info', 
    title?: string
  ) => {
    addNotification({ message, type, title })
  }

  // Rendre disponible globalement
  return {
    provide: {
      notifications: readonly(notifications),
      addNotification,
      removeNotification,
      showNotification
    }
  }
})