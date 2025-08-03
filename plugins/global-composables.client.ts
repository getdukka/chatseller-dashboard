import { useAnalyticsStore } from "~~/stores/analytics"
import { useAuthStore } from "~~/stores/auth"
import { useConversationsStore } from "~~/stores/conversations"
import { useKnowledgeBaseStore } from "~~/stores/knowledgeBase"
import { useOrdersStore } from "~~/stores/orders"
import { useSettingsStore } from "~~/stores/settings"

// plugins/global-composables.client.ts - CORRIGÉ
export default defineNuxtPlugin(() => {
  // Force l'enregistrement global des stores et composables
  if (process.client) {
    try {
      console.log('🔄 Global composables plugin: Initialisation...')
      
      // ✅ CORRECTION: Importer les STORES, pas les composables de façon circulaire
      const authStore = useAuthStore()
      const apiComposable = useApi()
      
      console.log('✅ AuthStore:', authStore ? 'disponible' : 'erreur')
      console.log('✅ API Composable:', apiComposable ? 'disponible' : 'erreur')
      
      // ✅ Tenter d'importer les autres stores si disponibles
      try {
        const analyticsStore = useAnalyticsStore()
        console.log('✅ Analytics Store: disponible')
      } catch (e) {
        console.warn('⚠️ Analytics Store: non disponible')
      }
      
      try {
        const conversationsStore = useConversationsStore()
        console.log('✅ Conversations Store: disponible')
      } catch (e) {
        console.warn('⚠️ Conversations Store: non disponible')
      }
      
      try {
        const knowledgeBaseStore = useKnowledgeBaseStore()
        console.log('✅ Knowledge Base Store: disponible')
      } catch (e) {
        console.warn('⚠️ Knowledge Base Store: non disponible')
      }
      
      try {
        const ordersStore = useOrdersStore()
        console.log('✅ Orders Store: disponible')
      } catch (e) {
        console.warn('⚠️ Orders Store: non disponible')
      }
      
      try {
        const settingsStore = useSettingsStore()
        console.log('✅ Settings Store: disponible')
      } catch (e) {
        console.warn('⚠️ Settings Store: non disponible')
      }

      // ✅ Les attacher à window pour debugging seulement
      if (typeof window !== 'undefined') {
        (window as any).__CHATSELLER_STORES__ = {
          auth: authStore,
          api: apiComposable
        }
        console.log('🔧 Debug: Stores disponibles via window.__CHATSELLER_STORES__')
      }

      console.log('✅ Global composables plugin: Initialisation réussie')
    } catch (error) {
      console.error('❌ Global composables plugin: Erreur lors de l\'import:', error)
    }
  }
})