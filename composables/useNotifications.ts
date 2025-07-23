// composables/useNotifications.ts - CORRIGÉ SANS TYPES GÉNÉRIQUES

import { ref, reactive } from 'vue'

// ✅ TYPES LOCAUX POUR ÉVITER LES IMPORTS PROBLÉMATIQUES
interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  timestamp: string
}

interface NotificationState {
  notifications: Notification[]
}

export const useNotifications = () => {
  // ✅ UTILISER reactive SANS TYPE GÉNÉRIQUE
  const state = reactive({
    notifications: []
  } as NotificationState)

  // ✅ METHODS
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      timestamp: new Date().toISOString(),
      duration: notification.duration || 5000
    }

    state.notifications.push(newNotification)

    // Auto-remove après duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(newNotification.id)
      }, newNotification.duration)
    }

    return newNotification.id
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

  // ✅ HELPERS SPÉCIFIQUES
  const notifySuccess = (title: string, message?: string) => {
    return addNotification({ type: 'success', title, message })
  }

  const notifyError = (title: string, message?: string) => {
    return addNotification({ type: 'error', title, message })
  }

  const notifyWarning = (title: string, message?: string) => {
    return addNotification({ type: 'warning', title, message })
  }

  const notifyInfo = (title: string, message?: string) => {
    return addNotification({ type: 'info', title, message })
  }

  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  return {
    // State
    notifications: state.notifications,
    
    // Methods
    addNotification,
    removeNotification,
    clearAll,
    
    // Helpers
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo
  }
}