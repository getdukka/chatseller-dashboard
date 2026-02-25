<!-- pages/products.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Catalogue produits</h1>
            <p class="mt-2 text-gray-600">
              Produits importés depuis votre boutique {{ platformName }}
            </p>
          </div>

          <div class="flex items-center space-x-3">
            <!-- Export Button -->
            <button
              @click="handleExport"
              :disabled="!hasProducts"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 bg-white text-sm font-medium rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              </svg>
              Exporter
            </button>

            <!-- Sync Button -->
            <button
              @click="showSyncModal = true"
              class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-sm font-medium rounded-lg hover:from-rose-700 hover:to-pink-700 transition-all shadow-md"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Synchroniser
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-8">
      <!-- Stats Cards - 4 métriques utiles -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Produits -->
        <div class="card-beauty-gradient from-blue-500 to-blue-600">
          <div class="flex items-center justify-between">
            <div class="text-white">
              <p class="text-blue-100 text-sm font-medium">Produits importés</p>
              <p class="text-2xl md:text-3xl font-bold">{{ stats.total || 0 }}</p>
              <p class="text-blue-100 text-sm mt-1">
                depuis {{ platformName }}
              </p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Produits Enrichis -->
        <div class="card-beauty-gradient from-purple-500 to-purple-600">
          <div class="flex items-center justify-between">
            <div class="text-white">
              <p class="text-purple-100 text-sm font-medium">Fiches produits enrichies</p>
              <p class="text-2xl md:text-3xl font-bold">{{ stats.enriched || 0 }}<span class="text-lg">/{{ stats.total || 0 }}</span></p>
              <p class="text-purple-100 text-sm mt-1">
                <span class="text-white font-medium">{{ stats.enrichedPercentage || 0 }}%</span> du catalogue
              </p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Produits Recommandés par l'IA -->
        <div class="card-beauty-gradient from-green-500 to-green-600">
          <div class="flex items-center justify-between">
            <div class="text-white">
              <p class="text-green-100 text-sm font-medium">Recommandés par {{ agentName }}</p>
              <p class="text-2xl md:text-3xl font-bold">{{ stats.aiRecommended || 0 }}</p>
              <p class="text-green-100 text-sm mt-1">
                ce mois-ci
              </p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Dernière Synchronisation -->
        <div class="card-beauty-gradient from-rose-500 to-pink-600">
          <div class="flex items-center justify-between">
            <div class="text-white">
              <p class="text-rose-100 text-sm font-medium">Dernière synchronisation</p>
              <p class="text-xl md:text-2xl font-bold">{{ stats.lastSync || 'Jamais' }}</p>
              <p class="text-rose-100 text-sm mt-1">
                {{ stats.lastSyncProducts || 0 }} produits
              </p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Sync Status Banner -->
      <div v-if="syncing" class="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
        <div class="flex items-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gradient-to-r from-blue-600 to-purple-600 mr-4"></div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-blue-900">Synchronisation en cours...</h3>
            <p class="text-blue-700 mt-1">
              Importation et enrichissement automatique des produits depuis votre boutique {{ platformName }}.
            </p>
            <div class="mt-3 bg-white rounded-full h-2 overflow-hidden">
              <div 
                class="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                :style="{ width: syncProgress + '%' }"
              ></div>
            </div>
            <p class="text-sm text-blue-600 mt-2">{{ syncProgress }}% - {{ syncCurrentStep }}</p>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="card-modern mb-6">
        <div class="p-6">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <!-- Search -->
            <div class="flex-1 max-w-lg">
              <div class="relative">
                <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input
                  v-model="filters.search"
                  @input="debouncedSearch"
                  type="text"
                  placeholder="Rechercher un produit..."
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                >
              </div>
            </div>

            <!-- Filters simplifiés -->
            <div class="flex flex-wrap items-center space-x-4">
              <!-- Filtre par statut d'enrichissement -->
              <select
                v-model="filters.enrichmentStatus"
                @change="applyFilters"
                class="input-beauty"
              >
                <option value="">Tous les produits</option>
                <option value="enriched">Enrichis</option>
                <option value="needs_enrichment">Non enrichis</option>
              </select>

              <!-- Filtre par recommandation IA -->
              <select
                v-model="filters.aiRecommend"
                @change="applyFilters"
                class="input-beauty"
              >
                <option value="">Recommandation par {{ agentName }}</option>
                <option value="enabled">Activée</option>
                <option value="disabled">Désactivée</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Products Grid -->
      <div class="card-modern">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">
            Vos produits
          </h2>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-500">
              {{ filteredProducts.length }} produit(s)
            </span>
            <button
              @click="refreshCatalog"
              :disabled="loading"
              class="text-rose-600 hover:text-rose-700 text-sm font-medium disabled:opacity-50"
            >
              {{ loading ? 'Actualisation...' : 'Actualiser' }}
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="p-12">
          <div class="flex items-center justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
            <span class="ml-3 text-gray-600">Chargement du catalogue...</span>
          </div>
        </div>

        <!-- Products Grid simplifié -->
        <div v-else-if="hasProducts" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div
              v-for="product in filteredProducts"
              :key="product.id"
              class="product-card bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
            >
              <!-- Product Image -->
              <div class="relative aspect-square bg-gray-100">
                <img
                  v-if="product.featured_image || product.image_url"
                  :src="product.featured_image || product.image_url"
                  :alt="product.name"
                  class="w-full h-full object-cover"
                >
                <div v-else class="w-full h-full flex items-center justify-center">
                  <svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>

                <!-- Statut enrichissement -->
                <div class="absolute top-2 right-2">
                  <span
                    :class="product.is_enriched ? 'bg-green-500' : 'bg-orange-500'"
                    class="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                  >
                    {{ product.is_enriched ? '✓' : '!' }}
                  </span>
                </div>
              </div>

              <!-- Product Info -->
              <div class="p-4">
                <h3 class="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                  {{ product.name }}
                </h3>

                <!-- Ingrédients clés si enrichi -->
                <div v-if="product.beauty_data?.key_ingredients?.length" class="mb-3">
                  <p class="text-xs text-gray-500">Ingrédients clés:</p>
                  <p class="text-xs text-gray-700 line-clamp-1">
                    {{ product.beauty_data.key_ingredients.join(', ') }}
                  </p>
                </div>

                <!-- Prix -->
                <div class="mb-4">
                  <span class="text-lg font-bold text-gray-900">
                    {{ formatPrice(product.price) }}
                  </span>
                </div>

                <!-- Actions -->
                <div class="flex flex-col space-y-2">
                  <button
                    @click="enrichProduct(product)"
                    class="w-full text-xs bg-rose-50 text-rose-700 hover:bg-rose-100 px-3 py-2 rounded-lg transition-colors"
                  >
                    {{ product.is_enriched ? 'Modifier les infos' : 'Compléter les infos' }}
                  </button>

                  <button
                    @click="toggleAIRecommendation(product)"
                    :class="product.ai_recommend ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'"
                    class="w-full text-xs px-3 py-2 rounded-lg transition-colors"
                  >
                    {{ product.ai_recommend ? '✓ Recommandé par ' + agentName : 'Activer recommandation' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State Intelligent -->
        <div v-else class="text-center py-12">
          <div class="w-20 h-20 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 011-1h4a1 1 0 011 1v2M7 7h10"/>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            {{ hasFilters ? 'Aucun produit trouvé' : 'Catalogue vide' }}
          </h3>
          <p class="text-gray-500 mb-6">
            {{ hasFilters
              ? 'Aucun produit ne correspond à vos critères'
              : 'Synchronisez votre boutique pour importer vos produits'
            }}
          </p>
          <div class="space-x-4">
            <button
              v-if="!hasFilters"
              @click="showSyncModal = true"
              class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold rounded-xl hover:from-rose-700 hover:to-pink-700 transition-all"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Synchroniser ma boutique
            </button>
            <button
              v-else
              @click="clearFilters"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors"
            >
              Effacer les filtres
            </button>
          </div>
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
const platformName = ref('Shopify') // Ou WooCommerce selon la boutique

const products = ref([])
const stats = ref({
  total: 0,
  enriched: 0,
  enrichedPercentage: 0,
  aiRecommended: 0,
  lastSync: 'Jamais',
  lastSyncProducts: 0
})

// Filters simplifiés
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

  // Filtre par recherche
  if (filters.value.search) {
    const query = filters.value.search.toLowerCase()
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query)
    )
  }

  // Filtre par statut d'enrichissement
  if (filters.value.enrichmentStatus) {
    filtered = filtered.filter(p => {
      if (filters.value.enrichmentStatus === 'enriched') return p.is_enriched
      if (filters.value.enrichmentStatus === 'needs_enrichment') return !p.is_enriched
      return true
    })
  }

  // Filtre par recommandation IA
  if (filters.value.aiRecommend) {
    filtered = filtered.filter(p => {
      if (filters.value.aiRecommend === 'enabled') return p.ai_recommend === true
      if (filters.value.aiRecommend === 'disabled') return p.ai_recommend === false
      return true
    })
  }

  return filtered
})

// HELPER METHODS - Simplifiés

// UTILITY METHODS
const formatPrice = (price) => {
  // ✅ Utiliser la devise configurée par le shop, ou XOF par défaut (Afrique francophone)
  const shopCurrency = authStore.user?.shop?.default_currency || 'XOF'

  // Configuration locale selon la devise
  const localeMap = {
    'XOF': 'fr-SN', // Sénégal (FCFA)
    'EUR': 'fr-FR',
    'USD': 'en-US',
    'GBP': 'en-GB',
    'MAD': 'fr-MA', // Maroc
    'TND': 'fr-TN', // Tunisie
    'DZD': 'fr-DZ'  // Algérie
  }

  const locale = localeMap[shopCurrency] || 'fr-FR'

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: shopCurrency,
    minimumFractionDigits: 0, // Pas de décimales pour FCFA
    maximumFractionDigits: shopCurrency === 'XOF' ? 0 : 2
  }).format(price)
}


// ACTION METHODS
const refreshCatalog = async () => {
  loading.value = true
  try {
    // Charger les produits depuis l'API
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

  // Calculer le temps depuis la dernière sync
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

    if (diffMins < 1) return "À l'instant"
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

// Export CSV simple
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
    // Étapes de synchronisation
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
    
    // Appel API réel
    const response = await api.products.sync(platform, credentials)

    if (response.success) {
      showNotification.value = true
      // Utiliser le nouveau format summary de l'API
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
      notificationType.value = total > 0 ? 'success' : 'success'
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

const openEnrichmentModal = () => {
  selectedProduct.value = null
  showEnrichmentModal.value = true
}

const closeEnrichmentModal = () => {
  showEnrichmentModal.value = false
  selectedProduct.value = null
}

const handleEnrichmentSave = async (enrichmentData) => {
  try {
    console.log('📝 [Products] Sauvegarde enrichissement pour produit:', selectedProduct.value.id)
    console.log('📝 [Products] Données enrichissement:', enrichmentData)

    const response = await api.products.enrich(selectedProduct.value.id, enrichmentData)

    console.log('📝 [Products] Réponse API enrichissement:', response)

    if (response.success) {
      // ✅ Mettre à jour le produit - FORCER LA RÉACTIVITÉ VUE
      const productIndex = products.value.findIndex(p => p.id === selectedProduct.value.id)

      console.log('📝 [Products] Index trouvé:', productIndex)
      console.log('📝 [Products] response.data is_enriched:', response.data?.is_enriched)

      if (productIndex !== -1) {
        // ✅ FORCER la réactivité en créant un nouveau tableau complet
        const updatedProducts = [...products.value]
        updatedProducts[productIndex] = {
          ...updatedProducts[productIndex],
          beauty_data: enrichmentData,
          is_enriched: true,  // ✅ FORCER explicitement à true
          needs_enrichment: false,
          enrichment_score: response.data?.enrichment_score || 50,
          updated_at: new Date().toISOString()
        }
        products.value = updatedProducts  // ✅ Remplacer le tableau entier pour déclencher réactivité

        console.log('✅ [Products] Produit après mise à jour:', {
          id: products.value[productIndex].id,
          is_enriched: products.value[productIndex].is_enriched
        })
      }

      showNotification.value = true
      notificationMessage.value = 'Infos produit complétées avec succès !'
      notificationType.value = 'success'

      // Recalculer les stats
      await calculateStats()
    } else {
      throw new Error(response.error || 'Erreur lors de l\'enrichissement')
    }

  } catch (error: any) {
    console.error('❌ [Products] Erreur enrichissement:', error)
    showNotification.value = true
    notificationMessage.value = error.message || 'Erreur lors de la sauvegarde'
    notificationType.value = 'error'
  } finally {
    closeEnrichmentModal()
  }
}

const viewAIInsights = (product) => {
  selectedProduct.value = product
  showAIInsightsModal.value = true
}

const toggleAIRecommendation = async (product) => {
  try {
    const response = await api.products.toggleRecommendation(product.id, !product.ai_recommend)
    
    if (response.success) {
      product.ai_recommend = !product.ai_recommend
      showNotification.value = true
      notificationMessage.value = product.ai_recommend ? 'Produit ajouté aux recommandations IA' : 'Produit retiré des recommandations IA'
      notificationType.value = 'success'
    }
    
  } catch (error) {
    console.error('Erreur toggle recommendation:', error)
  }
}

const applyFilters = () => {
  // Les filtres sont appliqués automatiquement via le computed filteredProducts
}

const clearFilters = () => {
  filters.value = {
    search: '',
    enrichmentStatus: '',
    aiRecommend: ''
  }
}

const debouncedSearch = useDebounce(() => {
  // La recherche est appliquée automatiquement via le computed
}, 300)

// LIFECYCLE
onMounted(async () => {
  await refreshCatalog()
  // Load agent name
  api.agents.list().then((res: any) => {
    if (res.success && res.data?.length > 0) {
      agentName.value = res.data[0].name || 'Mia'
    }
  }).catch(() => {})
})

// SEO
useHead({
  title: 'Produits - ChatSeller Dashboard'
})
</script>

<style scoped>
.card-modern {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6;
}

.card-beauty-gradient {
  @apply bg-gradient-to-br rounded-xl shadow-lg p-6 text-white;
}

.input-beauty {
  @apply px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors text-sm;
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

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>