// stores/sync.ts
// Store Pinia pour le suivi du sync background (produits + KB) pendant l'onboarding

import { defineStore } from 'pinia'

export type SyncStatus = 'idle' | 'pending' | 'success' | 'error'

interface SyncState {
  // Sync produits
  productsStatus: SyncStatus
  productsCount: number
  productsError: string | null

  // Sync KB (knowledge base)
  kbStatus: SyncStatus
  kbDocumentsCount: number
  kbError: string | null

  // Données détectées depuis le sync produits (pour pré-remplissage)
  detectedPriceRange: 'budget' | 'mid' | 'luxury' | null
  detectedMinPrice: number | null
  detectedMaxPrice: number | null

  // Promises internes (non sérialisables, gérées hors state)
  _productsPromise: Promise<any> | null
  _kbPromise: Promise<any> | null
}

export const useSyncStore = defineStore('sync', {
  state: (): SyncState => ({
    productsStatus: 'idle',
    productsCount: 0,
    productsError: null,

    kbStatus: 'idle',
    kbDocumentsCount: 0,
    kbError: null,

    detectedPriceRange: null,
    detectedMinPrice: null,
    detectedMaxPrice: null,

    _productsPromise: null,
    _kbPromise: null
  }),

  getters: {
    isSyncing: (state): boolean => {
      return state.productsStatus === 'pending' || state.kbStatus === 'pending'
    },

    isSyncComplete: (state): boolean => {
      const productsFinished = state.productsStatus === 'success' || state.productsStatus === 'error' || state.productsStatus === 'idle'
      const kbFinished = state.kbStatus === 'success' || state.kbStatus === 'error' || state.kbStatus === 'idle'
      // Au moins un sync doit avoir été lancé
      const atLeastOneLaunched = state.productsStatus !== 'idle' || state.kbStatus !== 'idle'
      return productsFinished && kbFinished && atLeastOneLaunched
    },

    hasAnySuccess: (state): boolean => {
      return state.productsStatus === 'success' || state.kbStatus === 'success'
    },

    syncSummary: (state): string => {
      const parts: string[] = []
      if (state.productsStatus === 'success' && state.productsCount > 0) {
        parts.push(`${state.productsCount} produit${state.productsCount > 1 ? 's' : ''} importé${state.productsCount > 1 ? 's' : ''}`)
      }
      if (state.kbStatus === 'success' && state.kbDocumentsCount > 0) {
        parts.push(`${state.kbDocumentsCount} page${state.kbDocumentsCount > 1 ? 's' : ''} indexée${state.kbDocumentsCount > 1 ? 's' : ''}`)
      }
      return parts.join(' et ') || ''
    }
  },

  actions: {
    /**
     * Lance le sync produits + KB en background.
     * Ne bloque pas : les promises sont stockées et peuvent être await plus tard.
     */
    startSync(params: {
      website: string
      platform: string
      beautyCategory: string
      companyName: string
    }) {
      const api = useApi()
      const normalizedWebsite = params.website.startsWith('http')
        ? params.website
        : `https://${params.website}`

      console.log('🚀 [SyncStore] Lancement sync background:', {
        website: normalizedWebsite,
        platform: params.platform
      })

      // --- KB (toujours si website fourni) ---
      this.kbStatus = 'pending'
      this._kbPromise = api.knowledgeBase.processWebsite({
        url: normalizedWebsite,
        title: `Site ${params.companyName}`,
        tags: ['website', 'onboarding', params.beautyCategory || 'multi'],
        beautyCategory: params.beautyCategory
      }).then(res => {
        if (res.success) {
          this.kbStatus = 'success'
          this.kbDocumentsCount = res.meta?.totalDocumentsCreated || res.data?.documentsCreated || 0
          console.log('✅ [SyncStore] KB indexé:', this.kbDocumentsCount, 'documents')
        } else {
          this.kbStatus = 'error'
          this.kbError = res.error || 'Erreur inconnue'
          console.warn('⚠️ [SyncStore] KB erreur:', this.kbError)
        }
      }).catch(err => {
        this.kbStatus = 'error'
        this.kbError = err?.message || String(err)
        console.warn('⚠️ [SyncStore] KB exception:', this.kbError)
      })

      // --- Produits (seulement si plateforme supportée) ---
      if (params.platform && params.platform !== 'custom') {
        this.productsStatus = 'pending'
        this._productsPromise = api.products.sync(params.platform, {
          shop_url: normalizedWebsite,
          auto_enrich: true
        }).then(res => {
          if (res.success) {
            this.productsStatus = 'success'
            // L'API retourne { success, data: Product[], summary: {...} }
            // apiCall passe la réponse telle quelle (success in response)
            const summary = (res as any).summary || {}
            this.productsCount = (summary.inserted || 0) + (summary.updated || 0)
            console.log('✅ [SyncStore] Produits importés:', this.productsCount)

            // res.data EST le tableau de produits directement
            const products = Array.isArray(res.data) ? res.data : []
            this._detectPriceRange(products)
          } else {
            this.productsStatus = 'error'
            this.productsError = res.error || 'Erreur inconnue'
            console.warn('⚠️ [SyncStore] Produits erreur:', this.productsError)
          }
        }).catch(err => {
          this.productsStatus = 'error'
          this.productsError = err?.message || String(err)
          console.warn('⚠️ [SyncStore] Produits exception:', this.productsError)
        })
      } else {
        console.log('ℹ️ [SyncStore] Plateforme custom, pas de sync produits')
      }
    },

    /**
     * Attend la fin de tous les syncs en cours (avec timeout).
     * Utilisé à l'étape 4 si le sync n'est pas encore terminé.
     */
    async waitForCompletion(timeoutMs: number = 90000): Promise<'completed' | 'timeout'> {
      const promises: Promise<any>[] = []
      if (this._productsPromise) promises.push(this._productsPromise)
      if (this._kbPromise) promises.push(this._kbPromise)

      if (promises.length === 0) return 'completed'

      const result = await Promise.race([
        Promise.allSettled(promises).then(() => 'completed' as const),
        new Promise<'timeout'>(resolve => setTimeout(() => resolve('timeout'), timeoutMs))
      ])

      return result
    },

    /**
     * Détecte la gamme de prix à partir des produits importés.
     */
    _detectPriceRange(products: any[]) {
      if (!products || products.length === 0) return

      const prices = products
        .map(p => {
          const price = parseFloat(p.price || p.metadata?.price || 0)
          return isNaN(price) ? 0 : price
        })
        .filter(p => p > 0)

      if (prices.length === 0) return

      const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length
      this.detectedMinPrice = Math.min(...prices)
      this.detectedMaxPrice = Math.max(...prices)

      // Heuristique : basée sur le prix moyen en EUR
      if (avgPrice <= 25) {
        this.detectedPriceRange = 'budget'
      } else if (avgPrice <= 80) {
        this.detectedPriceRange = 'mid'
      } else {
        this.detectedPriceRange = 'luxury'
      }

      console.log('🔍 [SyncStore] Gamme de prix détectée:', this.detectedPriceRange,
        `(avg: ${avgPrice.toFixed(2)}, min: ${this.detectedMinPrice}, max: ${this.detectedMaxPrice})`)
    },

    /**
     * Reset complet du store.
     */
    reset() {
      this.productsStatus = 'idle'
      this.productsCount = 0
      this.productsError = null
      this.kbStatus = 'idle'
      this.kbDocumentsCount = 0
      this.kbError = null
      this.detectedPriceRange = null
      this.detectedMinPrice = null
      this.detectedMaxPrice = null
      this._productsPromise = null
      this._kbPromise = null
    }
  }
})
