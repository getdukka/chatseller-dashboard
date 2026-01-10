<!-- pages/products.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
    <!-- Header Beauté -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Catalogue Intelligent</h1>
            <p class="mt-2 text-gray-600">
              Gérez vos produits beauté et optimisez les recommandations de votre {{ getAgentTypeName() }}
            </p>
          </div>
          
          <div class="flex items-center space-x-4">
            <button
              @click="showSyncModal = true"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Synchroniser boutique
            </button>
            
            <button
              @click="openEnrichmentModal"
              class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-sm font-medium rounded-lg hover:from-rose-700 hover:to-pink-700 transition-all"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Enrichir un produit
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-8">
      <!-- Stats Cards Spécialisées Beauté -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Produits Synchronisés -->
        <div class="card-beauty-gradient from-blue-500 to-blue-600">
          <div class="flex items-center justify-between">
            <div class="text-white">
              <p class="text-blue-100 text-sm font-medium">Produits synchronisés</p>
              <p class="text-2xl md:text-3xl font-bold">{{ stats.synchronized }}</p>
              <p class="text-blue-100 text-sm mt-1">
                <span class="text-white font-medium">{{ stats.lastSync }}</span> dernière sync
              </p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Produits Enrichis -->
        <div class="card-beauty-gradient from-purple-500 to-purple-600">
          <div class="flex items-center justify-between">
            <div class="text-white">
              <p class="text-purple-100 text-sm font-medium">Fiches enrichies</p>
              <p class="text-2xl md:text-3xl font-bold">{{ stats.enriched }}</p>
              <p class="text-purple-100 text-sm mt-1">
                <span class="text-white font-medium">{{ Math.round((stats.enriched / stats.total) * 100) }}%</span> complétées
              </p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Recommandations IA -->
        <div class="card-beauty-gradient from-green-500 to-green-600">
          <div class="flex items-center justify-between">
            <div class="text-white">
              <p class="text-green-100 text-sm font-medium">Recommandations IA</p>
              <p class="text-2xl md:text-3xl font-bold">{{ stats.aiRecommendations }}</p>
              <p class="text-green-100 text-sm mt-1">
                <span class="text-white font-medium">{{ stats.conversionRate }}%</span> conversion
              </p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Top Catégorie -->
        <div class="card-beauty-gradient from-rose-500 to-pink-600">
          <div class="flex items-center justify-between">
            <div class="text-white">
              <p class="text-rose-100 text-sm font-medium">{{ getTopCategoryLabel() }}</p>
              <p class="text-2xl md:text-3xl font-bold">{{ stats.topCategoryValue }}</p>
              <p class="text-rose-100 text-sm mt-1">
                <span class="text-white font-medium">{{ stats.topCategoryPercentage }}%</span> du catalogue
              </p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {{ getCategoryIcon() }}
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

      <!-- Filters and Search Beauté -->
      <div class="card-modern mb-6">
        <div class="p-6">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <!-- Search Intelligent -->
            <div class="flex-1 max-w-lg">
              <div class="relative">
                <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input
                  v-model="filters.search"
                  @input="debouncedSearch"
                  type="text"
                  :placeholder="getSearchPlaceholder()"
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                >
              </div>
            </div>
            
            <!-- Filters Spécialisés Beauté -->
            <div class="flex flex-wrap items-center space-x-4">
              <select 
                v-model="filters.beautyCategory" 
                @change="applyFilters"
                class="input-beauty"
              >
                <option value="">{{ getBeautyCategoryFilterLabel() }}</option>
                <option v-for="category in beautyCategories" :key="category.value" :value="category.value">
                  {{ category.label }}
                </option>
              </select>
              
              <select 
                v-model="filters.enrichmentStatus" 
                @change="applyFilters"
                class="input-beauty"
              >
                <option value="">Tous les statuts</option>
                <option value="enriched">Fiches enrichies</option>
                <option value="basic">Fiches basiques</option>
                <option value="needs_enrichment">À enrichir</option>
              </select>
              
              <select 
                v-model="filters.aiPerformance" 
                @change="applyFilters"
                class="input-beauty"
              >
                <option value="">Performance IA</option>
                <option value="high_conversion">Forte conversion</option>
                <option value="frequently_recommended">Souvent recommandé</option>
                <option value="needs_optimization">À optimiser</option>
              </select>
              
              <button
                @click="handleIntelligentExport"
                :disabled="!hasProducts"
                class="text-rose-600 hover:text-rose-700 text-sm font-medium disabled:opacity-50"
              >
                Export intelligent
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Products Grid Enrichi -->
      <div class="card-modern">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">
            Catalogue intelligent beauté
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
            <span class="ml-3 text-gray-600">Chargement du catalogue intelligent...</span>
          </div>
        </div>

        <!-- Products Grid avec données enrichies -->
        <div v-else-if="hasProducts" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div
              v-for="product in filteredProducts"
              :key="product.id"
              class="product-card-beauty"
            >
              <!-- Product Image avec overlay enrichissement -->
              <div class="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  v-if="product.featured_image"
                  :src="product.featured_image"
                  :alt="product.name"
                  class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                >
                <div v-else class="w-full h-full flex items-center justify-center">
                  <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                
                <!-- Enrichment Status Badge -->
                <div class="absolute top-2 right-2">
                  <span :class="getEnrichmentBadgeClass(product)" class="enrichment-badge">
                    {{ getEnrichmentStatus(product) }}
                  </span>
                </div>

                <!-- AI Performance Indicator -->
                <div v-if="product.ai_stats?.recommendations > 0" class="absolute bottom-2 left-2">
                  <div class="bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full flex items-center">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                    {{ product.ai_stats.recommendations }}
                  </div>
                </div>
              </div>

              <!-- Product Info Enrichie -->
              <div class="flex-1">
                <div class="flex items-start justify-between mb-2">
                  <h3 class="text-sm font-medium text-gray-900 line-clamp-2">
                    {{ product.name }}
                  </h3>
                  <span :class="getBeautyCategoryBadgeClass(product.beauty_category)" class="beauty-category-badge ml-2">
                    {{ getBeautyCategoryLabel(product.beauty_category) }}
                  </span>
                </div>
                
                <!-- Données Beauté Enrichies -->
                <div v-if="product.beauty_data" class="mb-3">
                  <div v-if="product.beauty_data.skin_types" class="mb-1">
                    <span class="text-xs text-gray-500">Types de peau:</span>
                    <div class="flex flex-wrap gap-1 mt-1">
                      <span 
                        v-for="skinType in product.beauty_data.skin_types.slice(0, 2)" 
                        :key="skinType"
                        class="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded"
                      >
                        {{ skinType }}
                      </span>
                      <span v-if="product.beauty_data.skin_types.length > 2" class="text-xs text-gray-400">
                        +{{ product.beauty_data.skin_types.length - 2 }}
                      </span>
                    </div>
                  </div>
                  
                  <div v-if="product.beauty_data.key_ingredients" class="mb-1">
                    <span class="text-xs text-gray-500">Ingrédients clés:</span>
                    <p class="text-xs text-gray-700 line-clamp-1">
                      {{ product.beauty_data.key_ingredients.slice(0, 2).join(', ') }}
                      <span v-if="product.beauty_data.key_ingredients.length > 2">...</span>
                    </p>
                  </div>
                </div>
                
                <div class="flex items-center justify-between mb-3">
                  <div class="flex flex-col">
                    <span class="text-lg font-bold text-gray-900">
                      {{ formatPrice(product.price) }}
                    </span>
                    <span v-if="product.compare_at_price && product.compare_at_price > product.price" class="text-xs text-gray-400 line-through">
                      {{ formatPrice(product.compare_at_price) }}
                    </span>
                  </div>
                  <div class="text-right">
                    <span v-if="product.ai_stats?.conversion_rate" class="text-xs text-green-600 font-medium">
                      {{ product.ai_stats.conversion_rate }}% conv.
                    </span>
                  </div>
                </div>

                <!-- Performance IA -->
                <div v-if="product.ai_stats" class="mb-3">
                  <div class="flex items-center justify-between text-xs text-gray-500">
                    <span>Recommandations: {{ product.ai_stats.recommendations || 0 }}</span>
                    <span>Conversions: {{ product.ai_stats.conversions || 0 }}</span>
                  </div>
                </div>

                <!-- Actions Enrichies -->
                <div class="flex flex-col space-y-2">
                  <div class="flex items-center space-x-2">
                    <button
                      @click="enrichProduct(product)"
                      class="flex-1 text-xs bg-rose-50 text-rose-700 hover:bg-rose-100 px-3 py-2 rounded-lg transition-colors"
                    >
                      {{ product.is_enriched ? 'Modifier enrichissement' : 'Enrichir fiche' }}
                    </button>
                    <button
                      @click="viewAIInsights(product)"
                      class="text-xs bg-purple-50 text-purple-700 hover:bg-purple-100 px-3 py-2 rounded-lg transition-colors"
                      title="Analytics IA"
                    >
                      📊
                    </button>
                  </div>
                  
                  <div class="flex items-center space-x-2">
                    <button
                      @click="toggleAIRecommendation(product)"
                      :class="product.ai_recommend ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'"
                      class="flex-1 text-xs hover:bg-opacity-80 px-3 py-2 rounded-lg transition-colors"
                    >
                      {{ product.ai_recommend ? '✅ Recommandé par IA' : 'Activer recommandation IA' }}
                    </button>
                  </div>
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
              : 'Synchronisez votre boutique pour créer votre catalogue intelligent'
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
  synchronized: 0,
  enriched: 0,
  aiRecommendations: 0,
  conversionRate: 0,
  lastSync: 'Jamais',
  topCategoryValue: 'Skincare',
  topCategoryPercentage: 45
})

// Filters
const filters = ref({
  search: '',
  beautyCategory: '',
  enrichmentStatus: '',
  aiPerformance: ''
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
      p.beauty_data?.key_ingredients?.some(i => i.toLowerCase().includes(query))
    )
  }

  if (filters.value.beautyCategory) {
    filtered = filtered.filter(p => p.beauty_category === filters.value.beautyCategory)
  }

  if (filters.value.enrichmentStatus) {
    filtered = filtered.filter(p => {
      if (filters.value.enrichmentStatus === 'enriched') return p.is_enriched
      if (filters.value.enrichmentStatus === 'basic') return !p.is_enriched && !p.needs_enrichment
      if (filters.value.enrichmentStatus === 'needs_enrichment') return p.needs_enrichment
      return true
    })
  }

  return filtered
})

const beautyCategories = computed(() => {
  const categories = {
    'skincare': { label: '✨ Soins visage', value: 'skincare' },
    'makeup': { label: '💄 Maquillage', value: 'makeup' },
    'fragrance': { label: '🌸 Parfums', value: 'fragrance' },
    'haircare': { label: '💇‍♀️ Soins cheveux', value: 'haircare' },
    'bodycare': { label: '🧴 Soins corps', value: 'bodycare' }
  }
  
  return Object.values(categories)
})

// BEAUTY-SPECIFIC METHODS
const getAgentTypeName = () => {
  const user = authStore.user
  const beautyCategory = user?.shop?.beauty_category || 'multi'
  
  const types = {
    'skincare': 'Esthéticienne IA',
    'makeup': 'Experte Makeup IA',
    'fragrance': 'Conseillère Parfums IA',
    'haircare': 'Experte Capillaire IA',
    'bodycare': 'Experte Soins Corps IA',
    'multi': 'Conseillère Beauté IA'
  }
  
  return types[beautyCategory] || types.multi
}

const getSearchPlaceholder = () => {
  const user = authStore.user
  const beautyCategory = user?.shop?.beauty_category || 'multi'
  
  const placeholders = {
    'skincare': 'Rechercher par nom, type de peau, ingrédient...',
    'makeup': 'Rechercher par nom, couleur, occasion...',
    'fragrance': 'Rechercher par nom, famille olfactive...',
    'haircare': 'Rechercher par nom, type de cheveux...',
    'bodycare': 'Rechercher par nom, zone corporelle...',
    'multi': 'Rechercher un produit beauté...'
  }
  
  return placeholders[beautyCategory] || placeholders.multi
}

const getBeautyCategoryFilterLabel = () => {
  return 'Toutes les catégories beauté'
}

const getTopCategoryLabel = () => {
  return 'Catégorie dominante'
}

const getCategoryIcon = () => {
  return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>'
}

// UTILITY METHODS
const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

const getEnrichmentStatus = (product) => {
  if (product.is_enriched) return '✅'
  if (product.needs_enrichment) return '⚠️'
  return '📝'
}

const getEnrichmentBadgeClass = (product) => {
  if (product.is_enriched) return 'bg-green-500 text-white'
  if (product.needs_enrichment) return 'bg-orange-500 text-white'
  return 'bg-gray-500 text-white'
}

const getBeautyCategoryLabel = (category) => {
  const labels = {
    'skincare': 'Soin',
    'makeup': 'Makeup',
    'fragrance': 'Parfum',
    'haircare': 'Cheveux',
    'bodycare': 'Corps'
  }
  return labels[category] || 'Beauté'
}

const getBeautyCategoryBadgeClass = (category) => {
  const classes = {
    'skincare': 'bg-rose-100 text-rose-700',
    'makeup': 'bg-purple-100 text-purple-700',
    'fragrance': 'bg-violet-100 text-violet-700',
    'haircare': 'bg-amber-100 text-amber-700',
    'bodycare': 'bg-teal-100 text-teal-700'
  }
  return classes[category] || 'bg-gray-100 text-gray-700'
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
  const aiRecommendations = products.value.reduce((sum, p) => sum + (p.ai_stats?.recommendations || 0), 0)
  const conversions = products.value.reduce((sum, p) => sum + (p.ai_stats?.conversions || 0), 0)
  
  stats.value = {
    total,
    synchronized: total,
    enriched,
    aiRecommendations,
    conversionRate: aiRecommendations > 0 ? Math.round((conversions / aiRecommendations) * 100) : 0,
    lastSync: 'Il y a 2h',
    topCategoryValue: 'Skincare',
    topCategoryPercentage: 45
  }
}

const handleSync = async (platform, credentials) => {
  syncing.value = true
  syncProgress.value = 0
  
  try {
    // Simulation sync avec étapes
    const steps = [
      'Connexion à la boutique...',
      'Récupération des produits...',
      'Analyse des catégories beauté...',
      'Enrichissement automatique...',
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
      notificationType.value = total > 0 ? 'success' : 'warning'
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
    const response = await api.products.enrich(selectedProduct.value.id, enrichmentData)
    
    if (response.success) {
      showNotification.value = true
      notificationMessage.value = 'Fiche produit enrichie avec succès !'
      notificationType.value = 'success'
      await refreshCatalog()
    }
    
  } catch (error) {
    console.error('Erreur enrichissement:', error)
    showNotification.value = true
    notificationMessage.value = 'Erreur lors de l\'enrichissement'
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

const handleIntelligentExport = () => {
  // Export avec données enrichies beauté
  const headers = [
    'Nom', 'Catégorie Beauté', 'Prix', 'Types de Peau', 'Ingrédients Clés', 
    'Recommandations IA', 'Taux Conversion', 'Statut Enrichissement'
  ]
  
  const csvData = filteredProducts.value.map(p => [
    p.name,
    getBeautyCategoryLabel(p.beauty_category),
    p.price,
    p.beauty_data?.skin_types?.join('; ') || '',
    p.beauty_data?.key_ingredients?.join('; ') || '',
    p.ai_stats?.recommendations || 0,
    p.ai_stats?.conversion_rate || 0,
    getEnrichmentStatus(p)
  ])
  
  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `catalogue-intelligent-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
  
  showNotification.value = true
  notificationMessage.value = 'Catalogue exporté avec succès !'
  notificationType.value = 'success'
}

const applyFilters = () => {
  // Les filtres sont appliqués automatiquement via le computed filteredProducts
}

const clearFilters = () => {
  filters.value = {
    search: '',
    beautyCategory: '',
    enrichmentStatus: '',
    aiPerformance: ''
  }
}

const debouncedSearch = useDebounce(() => {
  // La recherche est appliquée automatiquement via le computed
}, 300)

// LIFECYCLE
onMounted(async () => {
  await refreshCatalog()
})

// SEO
useHead({
  title: 'Catalogue Intelligent - ChatSeller Dashboard',
  meta: [
    { name: 'description', content: 'Gérez votre catalogue beauté intelligent avec enrichissement IA et analytics de performance' }
  ]
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

.product-card-beauty {
  @apply bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-rose-200 transition-all duration-200;
}

.enrichment-badge {
  @apply inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium;
}

.beauty-category-badge {
  @apply inline-flex items-center px-2 py-1 rounded-full text-xs font-medium flex-shrink-0;
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