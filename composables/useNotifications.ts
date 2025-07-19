// composables/useNotifications.ts
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  persistent?: boolean
  actions?: NotificationAction[]
}

export interface NotificationAction {
  label: string
  action: () => void
  style?: 'primary' | 'secondary'
}

interface NotificationsState {
  notifications: Notification[]
  maxNotifications: number
}

const state = reactive<NotificationsState>({
  notifications: [],
  maxNotifications: 5
})

export const useNotifications = () => {
  // =====================================
  // NOTIFICATION MANAGEMENT
  // =====================================
  
  /**
   * Add a new notification
   */
  const addNotification = (notification: Omit<Notification, 'id'>): string => {
    const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const newNotification: Notification = {
      id,
      duration: 5000, // 5 seconds default
      persistent: false,
      ...notification
    }

    // Add to beginning of array
    state.notifications.unshift(newNotification)

    // Limit number of notifications
    if (state.notifications.length > state.maxNotifications) {
      state.notifications = state.notifications.slice(0, state.maxNotifications)
    }

    // Auto-remove if not persistent
    if (!newNotification.persistent && newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }

    return id
  }

  /**
   * Remove a notification by ID
   */
  const removeNotification = (id: string): void => {
    const index = state.notifications.findIndex(n => n.id === id)
    if (index !== -1) {
      state.notifications.splice(index, 1)
    }
  }

  /**
   * Clear all notifications
   */
  const clearAllNotifications = (): void => {
    state.notifications = []
  }

  /**
   * Update an existing notification
   */
  const updateNotification = (id: string, updates: Partial<Omit<Notification, 'id'>>): void => {
    const notification = state.notifications.find(n => n.id === id)
    if (notification) {
      Object.assign(notification, updates)
    }
  }

  // =====================================
  // CONVENIENCE METHODS
  // =====================================
  
  /**
   * Show success notification
   */
  const success = (title: string, message?: string, options?: Partial<Notification>): string => {
    return addNotification({
      type: 'success',
      title,
      message,
      ...options
    })
  }

  /**
   * Show error notification
   */
  const error = (title: string, message?: string, options?: Partial<Notification>): string => {
    return addNotification({
      type: 'error',
      title,
      message,
      duration: 8000, // Errors stay longer
      ...options
    })
  }

  /**
   * Show warning notification
   */
  const warning = (title: string, message?: string, options?: Partial<Notification>): string => {
    return addNotification({
      type: 'warning',
      title,
      message,
      duration: 6000,
      ...options
    })
  }

  /**
   * Show info notification
   */
  const info = (title: string, message?: string, options?: Partial<Notification>): string => {
    return addNotification({
      type: 'info',
      title,
      message,
      ...options
    })
  }

  /**
   * Show loading notification (persistent by default)
   */
  const loading = (title: string, message?: string): string => {
    return addNotification({
      type: 'info',
      title,
      message,
      persistent: true,
      duration: 0
    })
  }

  // =====================================
  // API ERROR HANDLING
  // =====================================
  
  /**
   * Handle API errors with user-friendly messages
   */
  const handleApiError = (error: any, context?: string): string => {
    let title = 'Erreur'
    let message = 'Une erreur inattendue est survenue'

    if (context) {
      title = `Erreur - ${context}`
    }

    // Handle different types of errors
    if (typeof error === 'string') {
      message = error
    } else if (error?.message) {
      message = error.message
    } else if (error?.error) {
      message = error.error
    }

    // Handle specific HTTP errors
    if (error?.status) {
      switch (error.status) {
        case 400:
          title = 'Données invalides'
          message = 'Les données envoyées sont incorrectes'
          break
        case 401:
          title = 'Non autorisé'
          message = 'Vous devez vous reconnecter'
          break
        case 403:
          title = 'Accès refusé'
          message = 'Vous n\'avez pas les permissions nécessaires'
          break
        case 404:
          title = 'Ressource introuvable'
          message = 'L\'élément demandé n\'existe pas'
          break
        case 429:
          title = 'Trop de requêtes'
          message = 'Veuillez patienter avant de réessayer'
          break
        case 500:
          title = 'Erreur serveur'
          message = 'Problème technique temporaire'
          break
        case 503:
          title = 'Service indisponible'
          message = 'Le service est temporairement indisponible'
          break
      }
    }

    return error({
      title,
      message,
      actions: error?.status === 401 ? [
        {
          label: 'Se reconnecter',
          action: () => navigateTo('/login'),
          style: 'primary' as const
        }
      ] : undefined
    })
  }

  // =====================================
  // SUCCESS PATTERNS
  // =====================================
  
  /**
   * Show success notification for common actions
   */
  const successPatterns = {
    saved: (item?: string) => success(
      'Sauvegardé avec succès',
      item ? `${item} a été sauvegardé` : undefined
    ),
    
    created: (item?: string) => success(
      'Créé avec succès', 
      item ? `${item} a été créé` : undefined
    ),
    
    updated: (item?: string) => success(
      'Mis à jour avec succès',
      item ? `${item} a été mis à jour` : undefined
    ),
    
    deleted: (item?: string) => success(
      'Supprimé avec succès',
      item ? `${item} a été supprimé` : undefined
    ),
    
    uploaded: (filename?: string) => success(
      'Fichier uploadé avec succès',
      filename ? `${filename} a été uploadé` : undefined
    ),
    
    copied: (item?: string) => success(
      'Copié dans le presse-papier',
      item ? `${item} copié` : undefined
    ),
    
    sent: (item?: string) => success(
      'Envoyé avec succès',
      item ? `${item} a été envoyé` : undefined
    )
  }

  // =====================================
  // CONFIRMATION DIALOGS
  // =====================================
  
  /**
   * Show confirmation dialog via notification
   */
  const confirm = (
    title: string, 
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    options?: {
      confirmLabel?: string
      cancelLabel?: string
      type?: Notification['type']
    }
  ): string => {
    const { confirmLabel = 'Confirmer', cancelLabel = 'Annuler', type = 'warning' } = options || {}
    
    return addNotification({
      type,
      title,
      message,
      persistent: true,
      actions: [
        {
          label: confirmLabel,
          action: () => {
            onConfirm()
            // The notification will be removed by the action itself
          },
          style: 'primary'
        },
        {
          label: cancelLabel,
          action: () => {
            if (onCancel) onCancel()
            // The notification will be removed by the action itself
          },
          style: 'secondary'
        }
      ]
    })
  }

  // =====================================
  // PROGRESS NOTIFICATIONS
  // =====================================
  
  /**
   * Show progress notification with updates
   */
  const progress = (title: string, initialMessage?: string) => {
    const id = loading(title, initialMessage)
    
    return {
      id,
      update: (message: string, progress?: number) => {
        updateNotification(id, {
          message: progress ? `${message} (${progress}%)` : message
        })
      },
      complete: (successMessage?: string) => {
        removeNotification(id)
        if (successMessage) {
          success(title, successMessage)
        }
      },
      error: (errorMessage: string) => {
        removeNotification(id)
        error(title, errorMessage)
      }
    }
  }

  // =====================================
  // UTILITY FUNCTIONS
  // =====================================
  
  /**
   * Get notification icon based on type
   */
  const getNotificationIcon = (type: Notification['type']): string => {
    switch (type) {
      case 'success': return '✅'
      case 'error': return '❌'
      case 'warning': return '⚠️'
      case 'info': return 'ℹ️'
      default: return 'ℹ️'
    }
  }

  /**
   * Get notification color classes
   */
  const getNotificationClasses = (type: Notification['type']): string => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800'
      case 'error': return 'bg-red-50 border-red-200 text-red-800'
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800'
      default: return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  // =====================================
  // RETURN INTERFACE
  // =====================================
  
  return {
    // State
    notifications: readonly(toRef(state, 'notifications')),
    
    // Core methods
    addNotification,
    removeNotification,
    updateNotification,
    clearAllNotifications,
    
    // Convenience methods
    success,
    error,
    warning,
    info,
    loading,
    
    // Patterns
    successPatterns,
    handleApiError,
    confirm,
    progress,
    
    // Utilities
    getNotificationIcon,
    getNotificationClasses
  }
}