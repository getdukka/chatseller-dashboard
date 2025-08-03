// plugins/auto-imports.client.ts
export default defineNuxtPlugin(() => {
  // Force l'auto-import des stores pour éviter les erreurs
  if (process.client) {
    // Import explicite des stores pour s'assurer qu'ils sont disponibles
    const stores = {
      useAuthStore: () => import('~/stores/auth').then(m => m.useAuthStore),
      useAnalyticsStore: () => import('~/stores/analytics').then(m => m.useAnalyticsStore),
      useConversationsStore: () => import('~/stores/conversations').then(m => m.useConversationsStore),
      useKnowledgeBaseStore: () => import('~/stores/knowledgeBase').then(m => m.useKnowledgeBaseStore),
      useOrdersStore: () => import('~/stores/orders').then(m => m.useOrdersStore),
      useSettingsStore: () => import('~/stores/settings').then(m => m.useSettingsStore)
    }

    console.log('✅ Auto-imports plugin: Stores disponibles')
    
    // Les rendre globalement disponibles pour debugging
    if (typeof window !== 'undefined') {
      (window as any).__CHATSELLER_STORES__ = stores
    }
  }
})