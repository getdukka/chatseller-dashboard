// composables/useNotifications.ts
interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  persistent?: boolean
}

interface NotificationState {
  notifications: Notification[]
}

const state = reactive<NotificationState>({
  notifications: []
})

export const useNotifications = () => {
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const newNotification: Notification = {
      id,
      duration: 5000,
      persistent: false,
      ...notification
    }

    state.notifications.push(newNotification)

    // Auto-remove après la durée définie (sauf si persistent)
    if (!newNotification.persistent) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }

    return id
  }

  const removeNotification = (id: string) => {
    const index = state.notifications.findIndex(n => n.id === id)
    if (index > -1) {
      state.notifications.splice(index, 1)
    }
  }

  const clearAll = () => {
    state.notifications = []
  }

  // Méthodes de convenance
  const success = (title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({ ...options, type: 'success', title, message })
  }

  const error = (title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({ ...options, type: 'error', title, message, persistent: true })
  }

  const warning = (title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({ ...options, type: 'warning', title, message })
  }

  const info = (title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({ ...options, type: 'info', title, message })
  }

  return {
    notifications: readonly(toRef(state, 'notifications')),
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info
  }
}