<!-- pages/products.vue -->
<template>
  <div class="min-h-screen bg-gray-50/50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="px-4 sm:px-6 lg:px-8 py-5">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl font-semibold text-gray-900">Produits</h1>
            <p class="mt-1 text-sm text-gray-500">
              {{ hasProducts ? `${stats.total} produit(s) importés depuis ${platformName}` : `Importez vos produits depuis ${platformName}` }}
            </p>
          </div>

          <div class="flex items-center flex-wrap gap-2">
            <button
              v-if="hasProducts"
              @click="handleExport"
              class="inline-flex items-center px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              </svg>
              Exporter
            </button>

            <button
              @click="showSyncModal = true"
              class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg btn-brand-primary"
            >
              <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Synchroniser
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="px-4 sm:px-6 lg:px-8 py-6">

      <!-- Sync Status Banner -->
      <div v-if="syncing" class="mb-6 bg-white border border-blue-200 rounded-xl p-5">
        <div class="flex items-center">
          <div class="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-gray-900 mr-4"></div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900">Synchronisation en cours...</p>
            <p class="text-xs text-gray-500 mt-0.5">{{ syncCurrentStep }}</p>
            <div class="mt-2 bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div
                class="h-full bg-gray-900 transition-all duration-300 rounded-full"
                :style="{ width: syncProgress + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Row (compact) -->
      <div v-if="hasProducts" class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl border border-gray-200 p-4">
          <div class="flex items-center space-x-3">
            <div class="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <svg class="w-4.5 h-4.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <div>
              <p class="text-xs text-gray-500">Importés</p>
              <p class="text-lg font-semibold text-gray-900">{{ stats.total }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-4">
          <div class="flex items-center space-x-3">
            <div class="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
              <svg class="w-4.5 h-4.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-xs text-gray-500">Enrichis</p>
              <p class="text-lg font-semibold text-gray-900">{{ stats.enriched }}<span class="text-sm text-gray-400 font-normal">/{{ stats.total }}</span></p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-4">
          <div class="flex items-center space-x-3">
            <div class="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
              <svg class="w-4.5 h-4.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <div>
              <p class="text-xs text-gray-500">Recommandés</p>
              <p class="text-lg font-semibold text-gray-900">{{ stats.aiRecommended }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-4">
          <div class="flex items-center space-x-3">
            <div class="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
              <svg class="w-4.5 h-4.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-xs text-gray-500">Dernière sync</p>
              <p class="text-sm font-medium text-gray-900">{{ stats.lastSync }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div v-if="hasProducts" class="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div class="flex-1 max-w-md">
            <div class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                v-model="filters.search"
                @input="debouncedSearch"
                type="text"
                placeholder="Rechercher un produit..."
                class="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
              >
            </div>
          </div>

          <div class="flex items-center gap-3">
            <select
              v-model="filters.enrichmentStatus"
              @change="applyFilters"
              class="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
            >
              <option value="">Tous les produits</option>
              <option value="enriched">Enrichis</option>
              <option value="needs_enrichment">Non enrichis</option>
            </select>

            <select
              v-model="filters.aiRecommend"
              @change="applyFilters"
              class="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
            >
              <option value="">Recommandation {{ agentName }}</option>
              <option value="enabled">Activée</option>
              <option value="disabled">Désactivée</option>
            </select>

            <button
              v-if="hasFilters"
              @click="clearFilters"
              class="text-sm text-gray-500 hover:text-gray-700"
            >
              Effacer
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-gray-900"></div>
        <span class="ml-3 text-sm text-gray-500">Chargement du catalogue...</span>
      </div>

      <!-- Products Grid -->
      <div v-else-if="hasProducts && filteredProducts.length > 0">
        <div class="flex items-center justify-between mb-4">
          <p class="text-sm text-gray-500">{{ filteredProducts.length }} produit(s)</p>
          <button
            @click="refreshCatalog"
            :disabled="loading"
            class="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            Actualiser
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 hover:shadow-sm transition-all group"
          >
            <!-- Product Image -->
            <div class="relative aspect-square bg-gray-50">
              <img
                v-if="product.featured_image || product.image_url"
                :src="product.featured_image || product.image_url"
                :alt="product.name"
                class="w-full h-full object-cover"
              >
              <div v-else class="w-full h-full flex items-center justify-center">
                <svg class="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>

              <!-- Enrichment badge -->
              <div class="absolute top-2 right-2">
                <span
                  :class="product.is_enriched ? 'bg-emerald-500' : 'bg-amber-500'"
                  class="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                >
                  {{ product.is_enriched ? '✓' : '!' }}
                </span>
              </div>
            </div>

            <!-- Product Info -->
            <div class="p-3.5">
              <h3 class="text-sm font-medium text-gray-900 line-clamp-2 mb-1.5">
                {{ product.name }}
              </h3>

              <div v-if="product.beauty_data?.key_ingredients?.length" class="mb-2">
                <p class="text-[11px] text-gray-400 line-clamp-1">
                  {{ product.beauty_data.key_ingredients.join(', ') }}
                </p>
              </div>

              <p class="text-base font-semibold text-gray-900 mb-3">
                {{ formatPrice(product.price) }}
              </p>

              <!-- Actions -->
              <div class="flex items-center gap-2">
                <button
                  @click="enrichProduct(product)"
                  class="flex-1 text-xs font-medium py-1.5 px-2.5 rounded-lg border transition-colors"
                  :class="product.is_enriched
                    ? 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    : 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'"
                >
                  {{ product.is_enriched ? 'Modifier' : 'Compléter' }}
                </button>

                <button
                  @click="toggleAIRecommendation(product)"
                  class="p-1.5 rounded-lg border transition-colors"
                  :class="product.ai_recommend
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                    : 'border-gray-200 text-gray-400 hover:text-gray-600'"
                  :title="product.ai_recommend ? `Recommandé par ${agentName}` : 'Activer la recommandation'"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State: has products but filtered to none -->
      <div v-else-if="hasProducts && filteredProducts.length === 0" class="text-center py-16">
        <svg class="mx-auto h-10 w-10 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <p class="text-sm font-medium text-gray-900 mb-1">Aucun produit trouvé</p>
        <p class="text-sm text-gray-500 mb-4">Aucun produit ne correspond à vos critères</p>
        <button @click="clearFilters" class="text-sm text-gray-900 font-medium hover:underline">
          Effacer les filtres
        </button>
      </div>

      <!-- Empty State: no products at all -->
      <div v-else class="max-w-lg mx-auto text-center py-20">
        <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
          </svg>
        </div>

        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          Importez votre catalogue
        </h3>
        <p class="text-sm text-gray-500 mb-2">
          Connectez votre boutique {{ platformName }} pour importer automatiquement vos produits.
        </p>
        <p class="text-sm text-gray-400 mb-6">
          {{ agentName }} utilisera ces produits pour faire des recommandations personnalisées à vos clients.
        </p>

        <button
          @click="showSyncModal = true"
          class="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg btn-brand-primary"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          Connecter {{ platformName }}
        </button>

        <div class="mt-8 bg-gray-900 rounded-xl p-4 text-left">
          <p class="text-xs font-medium text-white mb-1">Comment ça marche ?</p>
          <p class="text-xs text-gray-400">
            Entrez l'URL de votre boutique et ChatSeller importera automatiquement tous vos produits avec leurs images, prix et descriptions. Vous pourrez ensuite enrichir chaque fiche avec l'IA pour que {{ agentName }} puisse mieux les recommander.
          </p>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <SyncModal v-if="showSyncModal" @close="showSyncModal = false" @sync="handleSync" />
    <EnrichmentModal v-if="showEnrichmentModal" :product="selectedProduct" @close="closeEnrichmentModal" @save="handleEnrichmentSave" />
    <AIInsightsModal v-if="showAIInsightsModal" :product="selectedProduct" @close="showAIInsightsModal = false" />

    <!-- Notification -->
    <NotificationToast
      :show="showNotification"
      :message="notificationMessage"
      :type="notificationType"
      @close="showNotification = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useDebounce } from '~~/composables/useDebounce'

definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// COMPOSABLES
const authStore = useAuthStore()
const api = useApi()
const agentName = ref('Mia')

// REACTIVE STATE
const loading = ref(true)
const syncing = ref(false)
const syncProgress = ref(0)
const syncCurrentStep = ref('')
const showSyncModal = ref(false)
const showEnrichmentModal = ref(false)
const showAIInsightsModal = ref(false)
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref<'success' | 'error'>('success')

const selectedProduct = ref(null)
const platformName = ref('Shopify')

const products = ref([])
const stats = ref({
  total: 0,
  enriched: 0,
  enrichedPercentage: 0,
  aiRecommended: 0,
  lastSync: 'Jamais',
  lastSyncProducts: 0
})

const filters = ref({
  search: '',
  enrichmentStatus: '',
  aiRecommend: ''
})

// COMPUTED
const hasProducts = computed(() => products.value.length > 0)
const hasFilters = computed(() => Object.values(filters.value).some(f => f !== ''))

const filteredProducts = computed(() => {
  let filtered = products.value

  if (filters.value.search) {
    const query = filters.value.search.toLowerCase()
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query)
    )
  }

  if (filters.value.enrichmentStatus) {
    filtered = filtered.filter(p => {
      if (filters.value.enrichmentStatus === 'enriched') return p.is_enriched
      if (filters.value.enrichmentStatus === 'needs_enrichment') return !p.is_enriched
      return true
    })
  }

  if (filters.value.aiRecommend) {
    filtered = filtered.filter(p => {
      if (filters.value.aiRecommend === 'enabled') return p.ai_recommend === true
      if (filters.value.aiRecommend === 'disabled') return p.ai_recommend === false
      return true
    })
  }

  return filtered
})

// UTILITY METHODS
const formatPrice = (price) => {
  const shopCurrency = authStore.user?.shop?.default_currency || 'XOF'

  const localeMap = {
    'XOF': 'fr-SN',
    'EUR': 'fr-FR',
    'USD': 'en-US',
    'GBP': 'en-GB',
    'MAD': 'fr-MA',
    'TND': 'fr-TN',
    'DZD': 'fr-DZ'
  }

  const locale = localeMap[shopCurrency] || 'fr-FR'

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: shopCurrency,
    minimumFractionDigits: 0,
    maximumFractionDigits: shopCurrency === 'XOF' ? 0 : 2
  }).format(price)
}

// ACTION METHODS
const refreshCatalog = async () => {
  loading.value = true
  try {
    const response = await api.products.list()
    if (response.success) {
      products.value = response.data || []
      await calculateStats()
    }
  } catch (error) {
    console.error('Erreur refresh catalog:', error)
  } finally {
    loading.value = false
  }
}

const calculateStats = async () => {
  const total = products.value.length
  const enriched = products.value.filter(p => p.is_enriched).length
  const aiRecommended = products.value.filter(p => p.ai_recommend).length

  const lastSyncDate = products.value.length > 0
    ? products.value.reduce((latest, p) => {
        const pDate = new Date(p.last_synced_at || p.updated_at || 0)
        return pDate > latest ? pDate : latest
      }, new Date(0))
    : null

  const formatLastSync = (date: Date | null) => {
    if (!date || date.getTime() === 0) return 'Jamais'
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return "A l'instant"
    if (diffMins < 60) return `Il y a ${diffMins}min`
    if (diffHours < 24) return `Il y a ${diffHours}h`
    return `Il y a ${diffDays}j`
  }

  stats.value = {
    total,
    enriched,
    enrichedPercentage: total > 0 ? Math.round((enriched / total) * 100) : 0,
    aiRecommended,
    lastSync: formatLastSync(lastSyncDate),
    lastSyncProducts: total
  }
}

const handleExport = () => {
  const headers = ['Nom', 'Prix', 'Enrichi', 'Recommandé IA', 'URL']

  const csvData = filteredProducts.value.map(p => [
    p.name,
    p.price,
    p.is_enriched ? 'Oui' : 'Non',
    p.ai_recommend ? 'Oui' : 'Non',
    p.url || ''
  ])

  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `catalogue-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)

  showNotification.value = true
  notificationMessage.value = 'Catalogue exporté'
  notificationType.value = 'success'
}

const handleSync = async (platform, credentials) => {
  syncing.value = true
  syncProgress.value = 0

  try {
    const steps = [
      'Connexion à la boutique...',
      'Récupération des produits...',
      'Importation en cours...',
      'Finalisation...'
    ]

    for (let i = 0; i < steps.length; i++) {
      syncCurrentStep.value = steps[i]
      syncProgress.value = ((i + 1) / steps.length) * 100
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    const response = await api.products.sync(platform, credentials)

    if (response.success) {
      showNotification.value = true
      const summary = response.data?.summary || {}
      const inserted = summary.inserted || 0
      const updated = summary.updated || 0
      const total = inserted + updated

      if (total > 0) {
        notificationMessage.value = `${inserted} nouveau(x) produit(s) importé(s), ${updated} mis à jour !`
      } else if (response.data?.message) {
        notificationMessage.value = response.data.message
      } else {
        notificationMessage.value = 'Synchronisation terminée'
      }
      notificationType.value = 'success'
      await refreshCatalog()
    }

  } catch (error) {
    console.error('Erreur sync:', error)
    showNotification.value = true
    notificationMessage.value = 'Erreur lors de la synchronisation'
    notificationType.value = 'error'
  } finally {
    syncing.value = false
    showSyncModal.value = false
  }
}

const enrichProduct = (product) => {
  selectedProduct.value = product
  showEnrichmentModal.value = true
}

const closeEnrichmentModal = () => {
  showEnrichmentModal.value = false
  selectedProduct.value = null
}

const handleEnrichmentSave = async (enrichmentData) => {
  try {
    const response = await api.products.enrich(selectedProduct.value.id, enrichmentData)

    if (response.success) {
      const productIndex = products.value.findIndex(p => p.id === selectedProduct.value.id)

      if (productIndex !== -1) {
        const updatedProducts = [...products.value]
        updatedProducts[productIndex] = {
          ...updatedProducts[productIndex],
          beauty_data: enrichmentData,
          is_enriched: true,
          needs_enrichment: false,
          enrichment_score: response.data?.enrichment_score || 50,
          updated_at: new Date().toISOString()
        }
        products.value = updatedProducts
      }

      showNotification.value = true
      notificationMessage.value = 'Infos produit complétées avec succès !'
      notificationType.value = 'success'

      await calculateStats()
    } else {
      throw new Error(response.error || 'Erreur lors de l\'enrichissement')
    }

  } catch (error: any) {
    console.error('Erreur enrichissement:', error)
    showNotification.value = true
    notificationMessage.value = error.message || 'Erreur lors de la sauvegarde'
    notificationType.value = 'error'
  } finally {
    closeEnrichmentModal()
  }
}

const toggleAIRecommendation = async (product) => {
  try {
    const response = await api.products.toggleRecommendation(product.id, !product.ai_recommend)

    if (response.success) {
      product.ai_recommend = !product.ai_recommend
      showNotification.value = true
      notificationMessage.value = product.ai_recommend ? 'Produit ajouté aux recommandations' : 'Produit retiré des recommandations'
      notificationType.value = 'success'
    }

  } catch (error) {
    console.error('Erreur toggle recommendation:', error)
  }
}

const applyFilters = () => {}

const clearFilters = () => {
  filters.value = {
    search: '',
    enrichmentStatus: '',
    aiRecommend: ''
  }
}

const debouncedSearch = useDebounce(() => {}, 300)

// LIFECYCLE
onMounted(async () => {
  await refreshCatalog()
  api.agents.list().then((res: any) => {
    if (res.success && res.data?.length > 0) {
      agentName.value = res.data[0].name || 'Mia'
    }
  }).catch(() => {})
})

useHead({
  title: 'Produits - ChatSeller Dashboard'
})
</script>

<style scoped>
.btn-brand-primary {
  background-color: var(--color-primary);
  color: #ffffff;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}
.btn-brand-primary:hover {
  background-color: var(--color-primary-hover);
  box-shadow: 0 4px 12px rgba(234, 66, 66, 0.25);
}
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
