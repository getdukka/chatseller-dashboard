<!-- pages/products.vue - GESTION PRODUITS CORRIGÉE -->
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
              @click="showAddProductModal = true"
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
      <!-- Connection Status Cards -->
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
              <p class="text-2xl font-bold text-gray-900">{{ stats.manualProducts }}</p>
              <p class="text-xs text-gray-500">produits</p>
            </div>
            <button
              @click="showAddProductModal = true"
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
                  <span v-if="connections.shopify.connected" class="text-green-600">Connecté</span>
                  <span v-else class="text-gray-400">Non connecté</span>
                </p>
              </div>
            </div>
            <div v-if="connections.shopify.connected" class="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ stats.shopifyProducts }}</p>
              <p class="text-xs text-gray-500">produits synchronisés</p>
            </div>
            <button
              @click="connections.shopify.connected ? syncShopify() : connectShopify()"
              :disabled="connections.shopify.syncing"
              class="text-green-600 hover:text-green-700 text-sm font-medium disabled:opacity-50"
            >
              {{ connections.shopify.syncing ? 'Sync...' : (connections.shopify.connected ? 'Synchroniser' : 'Connecter') }} →
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
                  <span v-if="connections.woocommerce.connected" class="text-blue-600">Connecté</span>
                  <span v-else class="text-gray-400">Non connecté</span>
                </p>
              </div>
            </div>
            <div v-if="connections.woocommerce.connected" class="w-3 h-3 bg-blue-500 rounded-full"></div>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ stats.woocommerceProducts }}</p>
              <p class="text-xs text-gray-500">produits synchronisés</p>
            </div>
            <button
              @click="connections.woocommerce.connected ? syncWooCommerce() : connectWooCommerce()"
              :disabled="connections.woocommerce.syncing"
              class="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
            >
              {{ connections.woocommerce.syncing ? 'Sync...' : (connections.woocommerce.connected ? 'Synchroniser' : 'Connecter') }} →
            </button>
          </div>
        </div>
      </div>

      <!-- Sync Status Banner -->
      <div v-if="syncStatus.isSync" class="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div class="flex items-center">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
          <div class="flex-1">
            <h3 class="text-sm font-medium text-blue-800">Synchronisation en cours...</h3>
            <p class="text-sm text-blue-700">
              Importation des produits depuis {{ syncStatus.source }}. {{ syncStatus.processed }}/{{ syncStatus.total }} traités.
            </p>
            <div class="mt-2 bg-blue-200 rounded-full h-2">
              <div 
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: (syncStatus.processed / syncStatus.total * 100) + '%' }"
              ></div>
            </div>
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
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher un produit..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
            </div>
          </div>
          
          <!-- Filters -->
          <div class="flex items-center space-x-4">
            <select v-model="selectedSource" class="input-modern">
              <option value="">Toutes les sources</option>
              <option value="manual">Manuel</option>
              <option value="shopify">Shopify</option>
              <option value="woocommerce">WooCommerce</option>
            </select>
            
            <select v-model="selectedCategory" class="input-modern">
              <option value="">Toutes les catégories</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
            
            <button
              @click="exportProducts"
              class="text-blue-600 hover:text-blue-700 text-sm font-medium"
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
              {{ filteredProducts.length }} produit(s)
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

        <!-- Products Grid -->
        <div v-else-if="filteredProducts.length > 0" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div
              v-for="product in filteredProducts"
              :key="product.id"
              class="product-card"
            >
              <!-- Product Image -->
              <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  v-if="product.image"
                  :src="product.image"
                  :alt="product.name"
                  class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
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
                
                <p class="text-xs text-gray-500 line-clamp-2 mb-2">
                  {{ product.description }}
                </p>
                
                <div class="flex items-center justify-between mb-3">
                  <span class="text-lg font-bold text-gray-900">
                    {{ formatCurrency(product.price) }}
                  </span>
                  <span v-if="product.category" class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {{ product.category }}
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
                    @click="duplicateProduct(product)"
                    class="text-xs bg-gray-50 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
                    title="Dupliquer"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                    </svg>
                  </button>
                  <button
                    @click="deleteProduct(product)"
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
            {{ searchQuery || selectedSource || selectedCategory ? 'Aucun produit trouvé' : 'Aucun produit dans votre catalogue' }}
          </h3>
          <p class="mt-2 text-gray-500">
            {{ searchQuery || selectedSource || selectedCategory
              ? 'Aucun produit ne correspond à vos critères de recherche'
              : 'Commencez par ajouter des produits manuellement ou connecter votre boutique'
            }}
          </p>
          <div class="mt-6">
            <button
              v-if="!searchQuery && !selectedSource && !selectedCategory"
              @click="showAddProductModal = true"
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

    <!-- Modals -->
    <!-- Add Product Modal -->
    <div v-if="showAddProductModal" class="modal-overlay" @click.self="showAddProductModal = false">
      <div class="modal-content modal-large">
        <div class="modal-header">
          <h3 class="modal-title">{{ editingProduct ? 'Modifier le produit' : 'Ajouter un produit' }}</h3>
          <button @click="closeProductModal" class="modal-close">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Left Column -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nom du produit *</label>
                <input
                  v-model="productForm.name"
                  type="text"
                  class="input-modern w-full"
                  placeholder="Nom de votre produit"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  v-model="productForm.description"
                  rows="4"
                  class="input-modern w-full"
                  placeholder="Description détaillée de votre produit"
                ></textarea>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Prix (€) *</label>
                  <input
                    v-model="productForm.price"
                    type="number"
                    step="0.01"
                    min="0"
                    class="input-modern w-full"
                    placeholder="0.00"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                  <select v-model="productForm.category" class="input-modern w-full">
                    <option value="">Sélectionner une catégorie</option>
                    <option v-for="category in categories" :key="category" :value="category">
                      {{ category }}
                    </option>
                  </select>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">SKU / Référence</label>
                <input
                  v-model="productForm.sku"
                  type="text"
                  class="input-modern w-full"
                  placeholder="SKU-001"
                >
              </div>
            </div>
            
            <!-- Right Column -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Image du produit</label>
                <div class="image-upload-zone" @click="triggerImageUpload">
                  <input ref="imageInput" type="file" accept="image/*" class="hidden" @change="handleImageUpload">
                  <div v-if="productForm.image" class="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img :src="productForm.image" alt="Aperçu" class="w-full h-full object-cover">
                  </div>
                  <div v-else class="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                    <div class="text-center">
                      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                      <p class="text-sm text-gray-500 mt-2">Cliquer pour ajouter une image</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Caractéristiques clés</label>
                <div class="space-y-2">
                  <div v-for="(feature, index) in productForm.features" :key="index" class="flex items-center space-x-2">
                    <input
                      v-model="productForm.features[index]"
                      type="text"
                      class="input-modern flex-1"
                      placeholder="Caractéristique"
                    >
                    <button
                      @click="removeFeature(index)"
                      class="text-red-600 hover:text-red-700"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                  <button
                    @click="addFeature"
                    class="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    + Ajouter une caractéristique
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="closeProductModal" class="btn-secondary">Annuler</button>
          <button 
            @click="saveProduct" 
            :disabled="!productForm.name || !productForm.price" 
            class="btn-primary"
          >
            {{ editingProduct ? 'Mettre à jour' : 'Ajouter' }} le produit
          </button>
        </div>
      </div>
    </div>

    <!-- ✅ MODAL CONNECT STORE CORRIGÉ -->
    <div v-if="showConnectModal" class="modal-overlay" @click.self="showConnectModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Connecter une boutique</h3>
          <button @click="showConnectModal = false" class="modal-close">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="space-y-4">
            <!-- Shopify -->
            <div class="connection-option" @click="handleConnectShopify" :class="{ 'connecting': connections.shopify.connecting }">
              <div class="flex items-center space-x-4">
                <div class="p-3 bg-green-100 rounded-lg">
                  <svg v-if="!connections.shopify.connecting" class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                  </svg>
                  <svg v-else class="w-8 h-8 text-green-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <h4 class="text-lg font-medium text-gray-900">Shopify</h4>
                  <p class="text-sm text-gray-500">
                    {{ connections.shopify.connected ? 'Boutique connectée' : 'Synchronisez automatiquement votre catalogue Shopify' }}
                  </p>
                  <p v-if="connections.shopify.connecting" class="text-sm text-green-600 mt-1">Connexion en cours...</p>
                </div>
                <div class="text-green-600">
                  <svg v-if="connections.shopify.connected" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <svg v-else-if="!connections.shopify.connecting" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- WooCommerce -->
            <div class="connection-option" @click="handleConnectWooCommerce" :class="{ 'connecting': connections.woocommerce.connecting }">
              <div class="flex items-center space-x-4">
                <div class="p-3 bg-blue-100 rounded-lg">
                  <svg v-if="!connections.woocommerce.connecting" class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"/>
                  </svg>
                  <svg v-else class="w-8 h-8 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <h4 class="text-lg font-medium text-gray-900">WooCommerce</h4>
                  <p class="text-sm text-gray-500">
                    {{ connections.woocommerce.connected ? 'Boutique connectée' : 'Connectez votre boutique WordPress WooCommerce' }}
                  </p>
                  <p v-if="connections.woocommerce.connecting" class="text-sm text-blue-600 mt-1">Connexion en cours...</p>
                </div>
                <div class="text-blue-600">
                  <svg v-if="connections.woocommerce.connected" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <svg v-else-if="!connections.woocommerce.connecting" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Coming Soon -->
            <div class="connection-option disabled">
              <div class="flex items-center space-x-4">
                <div class="p-3 bg-gray-100 rounded-lg">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <h4 class="text-lg font-medium text-gray-400">Autres plateformes</h4>
                  <p class="text-sm text-gray-400">Magento, PrestaShop, BigCommerce - Bientôt disponible</p>
                </div>
                <span class="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">Bientôt</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ SHOPIFY CONNECTION MODAL -->
    <div v-if="showShopifyModal" class="modal-overlay" @click.self="showShopifyModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Connecter Shopify</h3>
          <button @click="showShopifyModal = false" class="modal-close">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">URL de votre boutique Shopify</label>
              <input
                v-model="shopifyForm.shopUrl"
                type="url"
                placeholder="https://votre-boutique.myshopify.com"
                class="input-modern w-full"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Clé API Shopify</label>
              <input
                v-model="shopifyForm.apiKey"
                type="text"
                placeholder="Votre clé API Shopify"
                class="input-modern w-full"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Mot de passe API</label>
              <input
                v-model="shopifyForm.apiPassword"
                type="password"
                placeholder="Votre mot de passe API"
                class="input-modern w-full"
              >
            </div>
            
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex">
                <svg class="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div>
                  <p class="text-sm text-blue-800 font-medium">Comment obtenir vos clés API ?</p>
                  <p class="text-sm text-blue-700 mt-1">
                    Rendez-vous dans votre admin Shopify → Apps → Développer des apps → Créer une app privée
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="showShopifyModal = false" class="btn-secondary">Annuler</button>
          <button 
            @click="submitShopifyConnection" 
            :disabled="!shopifyForm.shopUrl || !shopifyForm.apiKey || shopifyForm.connecting"
            class="btn-primary"
          >
            {{ shopifyForm.connecting ? 'Connexion...' : 'Connecter' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ✅ WOOCOMMERCE CONNECTION MODAL -->
    <div v-if="showWooCommerceModal" class="modal-overlay" @click.self="showWooCommerceModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Connecter WooCommerce</h3>
          <button @click="showWooCommerceModal = false" class="modal-close">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">URL de votre site WordPress</label>
              <input
                v-model="wooCommerceForm.siteUrl"
                type="url"
                placeholder="https://votre-site.com"
                class="input-modern w-full"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Consumer Key</label>
              <input
                v-model="wooCommerceForm.consumerKey"
                type="text"
                placeholder="ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                class="input-modern w-full"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Consumer Secret</label>
              <input
                v-model="wooCommerceForm.consumerSecret"
                type="password"
                placeholder="cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                class="input-modern w-full"
              >
            </div>
            
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex">
                <svg class="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div>
                  <p class="text-sm text-blue-800 font-medium">Comment obtenir vos clés API ?</p>
                  <p class="text-sm text-blue-700 mt-1">
                    WooCommerce → Réglages → Avancé → REST API → Ajouter une clé
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="showWooCommerceModal = false" class="btn-secondary">Annuler</button>
          <button 
            @click="submitWooCommerceConnection" 
            :disabled="!wooCommerceForm.siteUrl || !wooCommerceForm.consumerKey || wooCommerceForm.connecting"
            class="btn-primary"
          >
            {{ wooCommerceForm.connecting ? 'Connexion...' : 'Connecter' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Success Notification -->
    <div
      v-if="showSuccessMessage"
      class="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300"
    >
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        {{ successMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

// ✅ PAGE META
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// ✅ TYPES
interface Product {
  id: string
  name: string
  description: string
  price: number
  image?: string
  category?: string
  sku?: string
  source: 'manual' | 'shopify' | 'woocommerce'
  externalId?: string
  features: string[]
  createdAt: string
  updatedAt: string
}

interface Connection {
  connected: boolean
  connecting?: boolean
  syncing?: boolean
  lastSync?: string
  url?: string
  status?: 'active' | 'error' | 'syncing'
}

// ✅ COMPOSABLES
const authStore = useAuthStore()

// ✅ REACTIVE STATE
const loading = ref(false)
const searchQuery = ref('')
const selectedSource = ref('')
const selectedCategory = ref('')
const showSuccessMessage = ref(false)
const successMessage = ref('')

// Modals
const showAddProductModal = ref(false)
const showConnectModal = ref(false)
const showShopifyModal = ref(false) // ✅ AJOUTÉ
const showWooCommerceModal = ref(false) // ✅ AJOUTÉ

// Forms
const editingProduct = ref<Product | null>(null)
const productForm = ref({
  name: '',
  description: '',
  price: 0,
  category: '',
  sku: '',
  image: '',
  features: ['']
})

// ✅ AJOUT: Formulaires de connexion
const shopifyForm = ref({
  shopUrl: '',
  apiKey: '',
  apiPassword: '',
  connecting: false
})

const wooCommerceForm = ref({
  siteUrl: '',
  consumerKey: '',
  consumerSecret: '',
  connecting: false
})

// Connections
const connections = ref({
  shopify: {
    connected: false,
    connecting: false,
    syncing: false,
    lastSync: null,
    url: '',
    status: 'active'
  } as Connection,
  woocommerce: {
    connected: false,
    connecting: false,
    syncing: false,
    lastSync: null,
    url: '',
    status: 'active'
  } as Connection
})

// Sync status
const syncStatus = ref({
  isSync: false,
  source: '',
  processed: 0,
  total: 0
})

// Stats
const stats = ref({
  manualProducts: 2,
  shopifyProducts: 0,
  woocommerceProducts: 0
})

// Categories
const categories = ref([
  'Électronique',
  'Vêtements',
  'Maison & Jardin',
  'Sports & Loisirs',
  'Beauté & Santé',
  'Livres',
  'Jouets',
  'Autres'
])

// Products
const products = ref<Product[]>([
  {
    id: '1',
    name: 'Smartphone Premium',
    description: 'Smartphone dernière génération avec appareil photo 108MP',
    price: 699.99,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
    category: 'Électronique',
    sku: 'PHONE-001',
    source: 'manual',
    features: ['108MP Camera', '5G Ready', '256GB Storage'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'T-shirt Coton Bio',
    description: 'T-shirt en coton biologique certifié, doux et confortable',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    category: 'Vêtements',
    sku: 'TSHIRT-001',
    source: 'manual',
    features: ['Coton bio', 'Certifié GOTS', 'Unisexe'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
])

// File input ref
const imageInput = ref<HTMLInputElement>()

// ✅ COMPUTED
const filteredProducts = computed(() => {
  let filtered = products.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.sku?.toLowerCase().includes(query)
    )
  }

  if (selectedSource.value) {
    filtered = filtered.filter(product => product.source === selectedSource.value)
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(product => product.category === selectedCategory.value)
  }

  return filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
})

// ✅ UTILITY METHODS
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const getSourceLabel = (source: string): string => {
  const labels: Record<string, string> = {
    manual: 'Manuel',
    shopify: 'Shopify',
    woocommerce: 'WooCommerce'
  }
  return labels[source] || source
}

const getSourceBadgeClass = (source: string): string => {
  const classes: Record<string, string> = {
    manual: 'bg-purple-100 text-purple-800',
    shopify: 'bg-green-100 text-green-800',
    woocommerce: 'bg-blue-100 text-blue-800'
  }
  return classes[source] || 'bg-gray-100 text-gray-800'
}

const showNotification = (message: string) => {
  successMessage.value = message
  showSuccessMessage.value = true
  setTimeout(() => {
    showSuccessMessage.value = false
  }, 3000)
}

// ✅ CONNECTION ACTIONS - CORRECTIONS MAJEURES
const handleConnectShopify = () => {
  if (connections.value.shopify.connected) {
    showNotification('Boutique Shopify déjà connectée')
    return
  }
  
  if (connections.value.shopify.connecting) return
  
  showConnectModal.value = false
  showShopifyModal.value = true
}

const handleConnectWooCommerce = () => {
  if (connections.value.woocommerce.connected) {
    showNotification('Boutique WooCommerce déjà connectée')
    return
  }
  
  if (connections.value.woocommerce.connecting) return
  
  showConnectModal.value = false
  showWooCommerceModal.value = true
}

const submitShopifyConnection = async () => {
  shopifyForm.value.connecting = true
  connections.value.shopify.connecting = true
  
  try {
    // ✅ TODO: Remplacer par un vrai appel API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simuler une connexion réussie
    connections.value.shopify = {
      connected: true,
      connecting: false,
      syncing: false,
      lastSync: new Date().toISOString(),
      url: shopifyForm.value.shopUrl,
      status: 'active'
    }
    
    showShopifyModal.value = false
    showNotification('Boutique Shopify connectée avec succès!')
    
    // Démarrer automatiquement la synchronisation
    setTimeout(() => {
      syncShopify()
    }, 1000)
    
    // Reset form
    shopifyForm.value = {
      shopUrl: '',
      apiKey: '',
      apiPassword: '',
      connecting: false
    }
    
  } catch (error: any) {
    console.error('Erreur connexion Shopify:', error)
    showNotification('Erreur lors de la connexion à Shopify')
  } finally {
    shopifyForm.value.connecting = false
    connections.value.shopify.connecting = false
  }
}

const submitWooCommerceConnection = async () => {
  wooCommerceForm.value.connecting = true
  connections.value.woocommerce.connecting = true
  
  try {
    // ✅ TODO: Remplacer par un vrai appel API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simuler une connexion réussie
    connections.value.woocommerce = {
      connected: true,
      connecting: false,
      syncing: false,
      lastSync: new Date().toISOString(),
      url: wooCommerceForm.value.siteUrl,
      status: 'active'
    }
    
    showWooCommerceModal.value = false
    showNotification('Boutique WooCommerce connectée avec succès!')
    
    // Démarrer automatiquement la synchronisation
    setTimeout(() => {
      syncWooCommerce()
    }, 1000)
    
    // Reset form
    wooCommerceForm.value = {
      siteUrl: '',
      consumerKey: '',
      consumerSecret: '',
      connecting: false
    }
    
  } catch (error: any) {
    console.error('Erreur connexion WooCommerce:', error)
    showNotification('Erreur lors de la connexion à WooCommerce')
  } finally {
    wooCommerceForm.value.connecting = false
    connections.value.woocommerce.connecting = false
  }
}

const connectShopify = () => {
  handleConnectShopify()
}

const connectWooCommerce = () => {
  handleConnectWooCommerce()
}

const syncShopify = async () => {
  connections.value.shopify.syncing = true
  syncStatus.value = {
    isSync: true,
    source: 'Shopify',
    processed: 0,
    total: 5
  }

  // Simuler la synchronisation
  const interval = setInterval(() => {
    syncStatus.value.processed++
    
    if (syncStatus.value.processed >= syncStatus.value.total) {
      clearInterval(interval)
      syncStatus.value.isSync = false
      connections.value.shopify.syncing = false
      connections.value.shopify.lastSync = new Date().toISOString()
      
      // Ajouter des produits Shopify simulés
      const shopifyProducts = [
        {
          id: 'shopify_' + Date.now(),
          name: 'Casque Audio Premium',
          description: 'Casque sans fil avec réduction de bruit active',
          price: 199.99,
          category: 'Électronique',
          source: 'shopify' as const,
          externalId: 'shopify_456',
          features: ['Bluetooth 5.0', 'Réduction de bruit', '30h d\'autonomie'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
      
      products.value.unshift(...shopifyProducts)
      updateStats()
      showNotification('Synchronisation Shopify terminée!')
    }
  }, 800)
}

const syncWooCommerce = async () => {
  connections.value.woocommerce.syncing = true
  syncStatus.value = {
    isSync: true,
    source: 'WooCommerce',
    processed: 0,
    total: 3
  }

  const interval = setInterval(() => {
    syncStatus.value.processed++
    
    if (syncStatus.value.processed >= syncStatus.value.total) {
      clearInterval(interval)
      syncStatus.value.isSync = false
      connections.value.woocommerce.syncing = false
      connections.value.woocommerce.lastSync = new Date().toISOString()
      
      // Ajouter des produits WooCommerce simulés
      const wooProducts = [
        {
          id: 'woo_' + Date.now(),
          name: 'Montre Connectée Sport',
          description: 'Montre intelligente avec GPS et suivi santé',
          price: 299.99,
          category: 'Électronique',
          source: 'woocommerce' as const,
          externalId: 'woo_789',
          features: ['GPS intégré', 'Étanche', 'Batterie 7 jours'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
      
      products.value.unshift(...wooProducts)
      updateStats()
      showNotification('Synchronisation WooCommerce terminée!')
    }
  }, 1000)
}

// ✅ PRODUCT ACTIONS
const editProduct = (product: Product) => {
  editingProduct.value = product
  productForm.value = {
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category || '',
    sku: product.sku || '',
    image: product.image || '',
    features: [...product.features]
  }
  showAddProductModal.value = true
}

const duplicateProduct = (product: Product) => {
  const duplicated: Product = {
    ...product,
    id: Date.now().toString(),
    name: product.name + ' (Copie)',
    sku: product.sku ? product.sku + '-COPY' : '',
    source: 'manual',
    externalId: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  products.value.unshift(duplicated)
  updateStats()
  showNotification('Produit dupliqué avec succès!')
}

const deleteProduct = async (product: Product) => {
  if (product.source !== 'manual') {
    showNotification('Seuls les produits manuels peuvent être supprimés. Les produits synchronisés doivent être supprimés depuis leur plateforme d\'origine.')
    return
  }

  if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
    products.value = products.value.filter(p => p.id !== product.id)
    updateStats()
    showNotification('Produit supprimé avec succès!')
  }
}

const saveProduct = () => {
  if (!productForm.value.name || !productForm.value.price) return

  if (editingProduct.value) {
    // Update existing product
    const index = products.value.findIndex(p => p.id === editingProduct.value!.id)
    if (index !== -1) {
      products.value[index] = {
        ...products.value[index],
        name: productForm.value.name,
        description: productForm.value.description,
        price: productForm.value.price,
        category: productForm.value.category,
        sku: productForm.value.sku,
        image: productForm.value.image,
        features: productForm.value.features.filter(f => f.trim() !== ''),
        updatedAt: new Date().toISOString()
      }
      showNotification('Produit modifié avec succès!')
    }
  } else {
    // Add new product
    const newProduct: Product = {
      id: Date.now().toString(),
      name: productForm.value.name,
      description: productForm.value.description,
      price: productForm.value.price,
      category: productForm.value.category,
      sku: productForm.value.sku,
      image: productForm.value.image,
      source: 'manual',
      features: productForm.value.features.filter(f => f.trim() !== ''),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    products.value.unshift(newProduct)
    showNotification('Produit ajouté avec succès!')
  }

  closeProductModal()
  updateStats()
}

const closeProductModal = () => {
  showAddProductModal.value = false
  editingProduct.value = null
  productForm.value = {
    name: '',
    description: '',
    price: 0,
    category: '',
    sku: '',
    image: '',
    features: ['']
  }
}

// ✅ FEATURES MANAGEMENT
const addFeature = () => {
  productForm.value.features.push('')
}

const removeFeature = (index: number) => {
  productForm.value.features.splice(index, 1)
}

// ✅ IMAGE UPLOAD
const triggerImageUpload = () => {
  imageInput.value?.click()
}

const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      productForm.value.image = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// ✅ UTILITY ACTIONS
const refreshProducts = async () => {
  loading.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    updateStats()
    showNotification('Produits actualisés avec succès!')
  } catch (error) {
    console.error('Erreur lors du rafraîchissement:', error)
  } finally {
    loading.value = false
  }
}

const exportProducts = () => {
  // Créer le contenu CSV
  const headers = ['Nom', 'Prix', 'Catégorie', 'Source', 'SKU']
  const csvData = filteredProducts.value.map(p => [
    p.name,
    p.price,
    p.category || '',
    p.source,
    p.sku || ''
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
  
  showNotification(`${filteredProducts.value.length} produit(s) exporté(s) avec succès!`)
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedSource.value = ''
  selectedCategory.value = ''
}

const updateStats = () => {
  stats.value = {
    manualProducts: products.value.filter(p => p.source === 'manual').length,
    shopifyProducts: products.value.filter(p => p.source === 'shopify').length,
    woocommerceProducts: products.value.filter(p => p.source === 'woocommerce').length
  }
}

// ✅ LIFECYCLE
onMounted(() => {
  updateStats()
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

.connection-option {
  @apply p-4 border border-gray-200 rounded-lg cursor-pointer transition-all hover:border-blue-300 hover:bg-blue-50;
}

.connection-option.connecting {
  @apply border-blue-300 bg-blue-50;
}

.connection-option.disabled {
  @apply cursor-not-allowed opacity-60 hover:border-gray-200 hover:bg-white;
}

.image-upload-zone {
  @apply cursor-pointer;
}

/* ✅ MODAL STYLES */
.modal-overlay {
  @apply fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4;
}

.modal-content {
  @apply bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto;
}

.modal-large {
  @apply max-w-4xl;
}

.modal-header {
  @apply flex items-center justify-between p-6 border-b border-gray-200;
}

.modal-title {
  @apply text-lg font-semibold text-gray-900;
}

.modal-close {
  @apply text-gray-400 hover:text-gray-600 transition-colors;
}

.modal-body {
  @apply p-6;
}

.modal-footer {
  @apply flex items-center justify-end space-x-3 p-6 border-t border-gray-200;
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

/* ✅ TEXT UTILS */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>