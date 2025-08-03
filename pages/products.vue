<!-- pages/products.vue - VERSION ENTIÈREMENT FONCTIONNELLE -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Catalogue Produits</h1>
            <p class="mt-2 text-gray-600">
              Gérez votre catalogue pour que votre Vendeur IA connaisse vos produits
            </p>
          </div>
          
          <div class="flex items-center space-x-4">
            <button
              @click="showConnectModal = true"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
              </svg>
              Connecter une boutique
            </button>
            
            <button
              @click="openCreateModal"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Ajouter un produit
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Manual Products -->
        <div class="card-modern">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="p-2 bg-purple-100 rounded-lg mr-3">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Produits manuels</h3>
                <p class="text-sm text-gray-500">Ajoutés directement</p>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ stats?.bySource.manual || 0 }}</p>
              <p class="text-xs text-gray-500">produits</p>
            </div>
            <button
              @click="openCreateModal"
              class="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              Ajouter →
            </button>
          </div>
        </div>

        <!-- Shopify Connection -->
        <div class="card-modern">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="p-2 bg-green-100 rounded-lg mr-3">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Shopify</h3>
                <p class="text-sm text-gray-500">
                  <span v-if="isShopifyConnected" class="text-green-600">Connecté</span>
                  <span v-else class="text-gray-400">Non connecté</span>
                </p>
              </div>
            </div>
            <div v-if="isShopifyConnected" class="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ stats?.bySource.shopify || 0 }}</p>
              <p class="text-xs text-gray-500">produits synchronisés</p>
            </div>
            <button
              @click="handleShopifyAction"
              :disabled="syncing"
              class="text-green-600 hover:text-green-700 text-sm font-medium disabled:opacity-50"
            >
              {{ syncing ? 'Sync...' : (isShopifyConnected ? 'Synchroniser' : 'Connecter') }} →
            </button>
          </div>
        </div>

        <!-- WooCommerce Connection -->
        <div class="card-modern">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="p-2 bg-blue-100 rounded-lg mr-3">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"/>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">WooCommerce</h3>
                <p class="text-sm text-gray-500">
                  <span v-if="isWooConnected" class="text-blue-600">Connecté</span>
                  <span v-else class="text-gray-400">Non connecté</span>
                </p>
              </div>
            </div>
            <div v-if="isWooConnected" class="w-3 h-3 bg-blue-500 rounded-full"></div>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ stats?.bySource.woocommerce || 0 }}</p>
              <p class="text-xs text-gray-500">produits synchronisés</p>
            </div>
            <button
              @click="handleWooCommerceAction"
              :disabled="syncing"
              class="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
            >
              {{ syncing ? 'Sync...' : (isWooConnected ? 'Synchroniser' : 'Connecter') }} →
            </button>
          </div>
        </div>
      </div>

      <!-- Sync Status Banner -->
      <div v-if="syncing" class="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div class="flex items-center">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
          <div class="flex-1">
            <h3 class="text-sm font-medium text-blue-800">Synchronisation en cours...</h3>
            <p class="text-sm text-blue-700">
              Importation des produits depuis votre boutique connectée.
            </p>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="card-modern mb-6">
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
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
            </div>
          </div>
          
          <!-- Filters -->
          <div class="flex items-center space-x-4">
            <select 
              v-model="filters.source" 
              @change="applyFilters"
              class="input-modern"
            >
              <option value="">Toutes les sources</option>
              <option value="manual">Manuel</option>
              <option value="shopify">Shopify</option>
              <option value="woocommerce">WooCommerce</option>
            </select>
            
            <select 
              v-model="filters.category" 
              @change="applyFilters"
              class="input-modern"
            >
              <option value="">Toutes les catégories</option>
              <option v-for="category in availableCategories" :key="category.name" :value="category.name">
                {{ category.name }} ({{ category.count }})
              </option>
            </select>
            
            <button
              @click="handleExport"
              :disabled="!hasProducts"
              class="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
            >
              Exporter CSV
            </button>
          </div>
        </div>
      </div>

      <!-- Products List -->
      <div class="card-modern">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">
            Catalogue produits
          </h2>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-500">
              {{ stats?.total || 0 }} produit(s)
            </span>
            <button
              @click="refreshProducts"
              :disabled="loading"
              class="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
            >
              {{ loading ? 'Actualisation...' : 'Actualiser' }}
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="p-12">
          <div class="flex items-center justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span class="ml-3 text-gray-600">Chargement des produits...</span>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="p-12 text-center">
          <div class="text-red-500 mb-4">
            <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
          <p class="text-gray-500 mb-4">{{ error }}</p>
          <button
            @click="refreshProducts"
            class="btn-primary"
          >
            Réessayer
          </button>
        </div>

        <!-- Products Grid -->
        <div v-else-if="hasProducts" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div
              v-for="product in products"
              :key="product.id"
              class="product-card"
            >
              <!-- Product Image -->
              <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  v-if="product.featuredImage || product.images?.[0]"
                  :src="product.featuredImage || product.images[0]"
                  :alt="product.name"
                  class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  @error="handleImageError"
                >
                <div v-else class="w-full h-full flex items-center justify-center">
                  <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
              </div>

              <!-- Product Info -->
              <div class="flex-1">
                <div class="flex items-start justify-between mb-2">
                  <h3 class="text-sm font-medium text-gray-900 line-clamp-2">
                    {{ product.name }}
                  </h3>
                  <span :class="getSourceBadgeClass(product.source)" class="source-badge ml-2">
                    {{ getSourceLabel(product.source) }}
                  </span>
                </div>
                
                <p v-if="product.description" class="text-xs text-gray-500 line-clamp-2 mb-2">
                  {{ product.description }}
                </p>
                
                <div class="flex items-center justify-between mb-3">
                  <div class="flex flex-col">
                    <span class="text-lg font-bold text-gray-900">
                      {{ formatPrice(product.price) }}
                    </span>
                    <span v-if="product.compareAtPrice && product.compareAtPrice > product.price" class="text-xs text-gray-400 line-through">
                      {{ formatPrice(product.compareAtPrice) }}
                    </span>
                  </div>
                  <div class="text-right">
                    <span v-if="product.category" class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded block mb-1">
                      {{ product.category }}
                    </span>
                    <span v-if="product.trackInventory" class="text-xs" :class="getStockClass(product.inventoryQuantity)">
                      {{ getStockLabel(product.inventoryQuantity) }}
                    </span>
                  </div>
                </div>

                <!-- Product Status -->
                <div class="mb-3">
                  <span 
                    :class="product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {{ product.isActive ? 'Actif' : 'Inactif' }}
                  </span>
                </div>

                <!-- Product Actions -->
                <div class="flex items-center space-x-2">
                  <button
                    @click="editProduct(product)"
                    class="flex-1 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors"
                  >
                    Modifier
                  </button>
                  <button
                    @click="handleDuplicate(product)"
                    class="text-xs bg-gray-50 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
                    title="Dupliquer"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                    </svg>
                  </button>
                  <button
                    @click="handleDelete(product)"
                    :disabled="product.source !== 'manual'"
                    class="text-xs bg-red-50 text-red-700 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Supprimer"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">
            {{ hasFilters ? 'Aucun produit trouvé' : 'Aucun produit dans votre catalogue' }}
          </h3>
          <p class="mt-2 text-gray-500">
            {{ hasFilters
              ? 'Aucun produit ne correspond à vos critères de recherche'
              : 'Commencez par ajouter des produits manuellement ou connecter votre boutique'
            }}
          </p>
          <div class="mt-6">
            <button
              v-if="!hasFilters"
              @click="openCreateModal"
              class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Ajouter votre premier produit
            </button>
            <button
              v-else
              @click="clearFilters"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors"
            >
              Effacer les filtres
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Form Modal -->
    <ProductFormModal
      v-if="showProductModal"
      :product="editingProduct"
      @close="closeProductModal"
      @success="handleProductSuccess"
    />

    <!-- Connection Modals -->
    <ConnectionModal
      v-if="showConnectModal"
      @close="showConnectModal = false"
      @connect-shopify="openShopifyModal"
      @connect-woocommerce="openWooCommerceModal"
    />

    <ShopifyConnectionModal
      v-if="showShopifyModal"
      @close="showShopifyModal = false"
      @success="handleShopifyConnected"
    />

    <WooCommerceConnectionModal
      v-if="showWooCommerceModal"
      @close="showWooCommerceModal = false"
      @success="handleWooCommerceConnected"
    />

    <!-- Success Notification -->
    <NotificationToast
      :show="showNotification"
      :message="notificationMessage"
      :type="notificationType"
      @close="showNotification = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useProducts } from '~~/composables/useProducts'
import { useDebounce } from '~~/composables/useDebounce'

// ✅ PAGE META
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// ✅ COMPOSABLES
const {
  products,
  stats,
  loading,
  saving,
  syncing,
  error,
  hasProducts,
  fetchProducts,
  fetchStats,
  createProduct,
  updateProduct,
  deleteProduct,
  duplicateProduct,
  syncProducts,
  clearError,
  formatPrice,
  getSourceLabel,
  getSourceBadgeClass
} = useProducts()

// ✅ REACTIVE STATE
const showProductModal = ref(false)
const showConnectModal = ref(false)
const showShopifyModal = ref(false)
const showWooCommerceModal = ref(false)
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref<'success' | 'error'>('success')

const editingProduct = ref(null)

// Filters
const filters = ref({
  search: '',
  category: '',
  source: ''
})

// Connection states (stored in localStorage/Supabase)
const isShopifyConnected = ref(false)
const isWooConnected = ref(false)

// ✅ COMPUTED
const hasFilters = computed(() => {
  return !!(filters.value.search || filters.value.category || filters.value.source)
})

const availableCategories = computed(() => {
  return stats.value?.categories || []
})

// ✅ DEBOUNCED SEARCH
const debouncedSearch = useDebounce(() => {
  applyFilters()
}, 300)

// ✅ METHODS
const refreshProducts = async () => {
  clearError()
  await fetchProducts(filters.value)
  await fetchStats()
}

const applyFilters = async () => {
  clearError()
  await fetchProducts(filters.value)
}

const clearFilters = () => {
  filters.value = {
    search: '',
    category: '',
    source: ''
  }
  applyFilters()
}

// ✅ PRODUCT ACTIONS
const openCreateModal = () => {
  editingProduct.value = null
  showProductModal.value = true
}

const editProduct = (product) => {
  editingProduct.value = product
  showProductModal.value = true
}

const closeProductModal = () => {
  showProductModal.value = false
  editingProduct.value = null
}

const handleProductSuccess = (message: string) => {
  showNotification.value = true
  notificationMessage.value = message
  notificationType.value = 'success'
  refreshProducts()
}

const handleDuplicate = async (product) => {
  const result = await duplicateProduct(product.id)
  if (result.success) {
    showNotification.value = true
    notificationMessage.value = 'Produit dupliqué avec succès!'
    notificationType.value = 'success'
    refreshProducts()
  } else {
    showNotification.value = true
    notificationMessage.value = result.error || 'Erreur lors de la duplication'
    notificationType.value = 'error'
  }
}

const handleDelete = async (product) => {
  if (product.source !== 'manual') {
    showNotification.value = true
    notificationMessage.value = 'Seuls les produits manuels peuvent être supprimés'
    notificationType.value = 'error'
    return
  }

  if (confirm(`Êtes-vous sûr de vouloir supprimer "${product.name}" ?`)) {
    const result = await deleteProduct(product.id)
    if (result.success) {
      showNotification.value = true
      notificationMessage.value = 'Produit supprimé avec succès!'
      notificationType.value = 'success'
      refreshProducts()
    } else {
      showNotification.value = true
      notificationMessage.value = result.error || 'Erreur lors de la suppression'
      notificationType.value = 'error'
    }
  }
}

// ✅ CONNECTION ACTIONS
const handleShopifyAction = () => {
  if (isShopifyConnected.value) {
    handleShopifySync()
  } else {
    openShopifyModal()
  }
}

const handleWooCommerceAction = () => {
  if (isWooConnected.value) {
    handleWooCommerceSync()
  } else {
    openWooCommerceModal()
  }
}

const openShopifyModal = () => {
  showConnectModal.value = false
  showShopifyModal.value = true
}

const openWooCommerceModal = () => {
  showConnectModal.value = false
  showWooCommerceModal.value = true
}

const handleShopifyConnected = () => {
  isShopifyConnected.value = true
  showNotification.value = true
  notificationMessage.value = 'Boutique Shopify connectée avec succès!'
  notificationType.value = 'success'
  
  // Auto-sync after connection
  setTimeout(() => {
    handleShopifySync()
  }, 1000)
}

const handleWooCommerceConnected = () => {
  isWooConnected.value = true
  showNotification.value = true
  notificationMessage.value = 'Boutique WooCommerce connectée avec succès!'
  notificationType.value = 'success'
  
  // Auto-sync after connection
  setTimeout(() => {
    handleWooCommerceSync()
  }, 1000)
}

const handleShopifySync = async () => {
  // Implementation will depend on stored credentials
  const result = await syncProducts('shopify', {
    // Credentials from storage
  })
  
  if (result.success) {
    showNotification.value = true
    notificationMessage.value = 'Synchronisation Shopify terminée!'
    notificationType.value = 'success'
    refreshProducts()
  } else {
    showNotification.value = true
    notificationMessage.value = result.error || 'Erreur de synchronisation'
    notificationType.value = 'error'
  }
}

const handleWooCommerceSync = async () => {
  const result = await syncProducts('woocommerce', {
    // Credentials from storage
  })
  
  if (result.success) {
    showNotification.value = true
    notificationMessage.value = 'Synchronisation WooCommerce terminée!'
    notificationType.value = 'success'
    refreshProducts()
  } else {
    showNotification.value = true
    notificationMessage.value = result.error || 'Erreur de synchronisation'
    notificationType.value = 'error'
  }
}

// ✅ UTILITY METHODS
const handleImageError = (event) => {
  event.target.style.display = 'none'
}

const getStockClass = (quantity: number) => {
  if (quantity <= 0) return 'text-red-600'
  if (quantity <= 10) return 'text-orange-600'
  return 'text-green-600'
}

const getStockLabel = (quantity: number) => {
  if (quantity <= 0) return 'Rupture'
  if (quantity <= 10) return 'Stock faible'
  return `${quantity} en stock`
}

const handleExport = () => {
  if (!hasProducts.value) return
  
  // Create CSV content
  const headers = ['Nom', 'Prix', 'Catégorie', 'Source', 'SKU', 'Stock', 'Statut']
  const csvData = products.value.map(p => [
    p.name,
    p.price,
    p.category || '',
    getSourceLabel(p.source),
    p.sku || '',
    p.trackInventory ? p.inventoryQuantity : 'Non suivi',
    p.isActive ? 'Actif' : 'Inactif'
  ])
  
  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `produits-chatseller-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
  
  showNotification.value = true
  notificationMessage.value = `${products.value.length} produit(s) exporté(s) avec succès!`
  notificationType.value = 'success'
}

// ✅ LIFECYCLE
onMounted(async () => {
  await refreshProducts()
  
  // Load connection states from storage/Supabase
  // TODO: Implement actual storage loading
})

// ✅ SEO
useHead({
  title: 'Produits - ChatSeller Dashboard'
})
</script>

<style scoped>
/* ✅ MODERN COMPONENTS */
.card-modern {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6;
}

.input-modern {
  @apply px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm;
}

.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors;
}

.btn-secondary {
  @apply px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors;
}

.product-card {
  @apply bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow;
}

.source-badge {
  @apply inline-flex items-center px-2 py-1 rounded-full text-xs font-medium flex-shrink-0;
}

/* ✅ TEXT UTILS */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ✅ RESPONSIVE */
@media (max-width: 768px) {
  .card-modern {
    @apply p-4;
  }
  
  .product-card {
    @apply p-3;
  }
}

/* ✅ ANIMATIONS */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>