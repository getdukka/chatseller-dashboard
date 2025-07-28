// composables/useProducts.ts - HARMONISÉ AVEC LA BASE DE DONNÉES
import { ref, computed, readonly } from 'vue'
import { useAuthStore } from '~~/stores/auth'

// ✅ TYPES & INTERFACES - HARMONISÉS AVEC LA DB
export interface Product {
  id: string
  shop_id: string
  name: string
  description?: string
  short_description?: string
  price: number
  compare_at_price?: number
  currency: string
  sku?: string
  category?: string
  tags: string[]
  features: string[]
  images: string[]
  featured_image?: string
  weight?: number
  inventory_quantity: number
  track_inventory: boolean
  source: 'manual' | 'shopify' | 'woocommerce' | 'api'
  external_id?: string
  external_data: Record<string, any>
  is_active: boolean
  is_visible: boolean
  available_for_sale: boolean
  handle?: string
  specifications: Record<string, any>
  created_at: string
  updated_at: string
  last_synced_at?: string
  sync_errors?: string
}

export interface ProductVariant {
  id: string
  product_id: string
  title: string
  price: number
  compare_at_price?: number
  sku?: string
  inventory_quantity: number
  option1?: string
  option2?: string
  option3?: string
  external_id?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateProductData {
  name: string
  description?: string
  short_description?: string
  price: number
  compare_at_price?: number
  sku?: string
  category?: string
  tags?: string[]
  features?: string[]
  images?: string[]
  featured_image?: string
  weight?: number
  inventory_quantity?: number
  track_inventory?: boolean
  is_active?: boolean
  is_visible?: boolean
  available_for_sale?: boolean
  specifications?: Record<string, any>
}

export interface UpdateProductData extends Partial<CreateProductData> {}

export interface ProductsFilters {
  search?: string
  category?: string
  source?: string
  isActive?: string // Garde string pour l'URL
  page?: number
  limit?: number
}

export interface ProductStats {
  total: number
  active: number
  inactive: number
  bySource: {
    manual: number
    shopify: number
    woocommerce: number
    api: number
  }
  categories: Array<{
    name: string
    count: number
  }>
}

export interface SyncCredentials {
  shopUrl?: string
  apiKey?: string
  apiPassword?: string
  consumerKey?: string
  consumerSecret?: string
}

// ✅ TYPES DE RÉPONSE API
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

interface ProductsResponse extends ApiResponse<Product[]> {
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

interface SyncResponse extends ApiResponse<any> {
  jobId?: string
}

// ✅ COMPOSABLE PRINCIPAL
export const useProducts = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  
  // ✅ REACTIVE STATE
  const products = ref<Product[]>([])
  const product = ref<Product | null>(null)
  const stats = ref<ProductStats | null>(null)
  const loading = ref(false)
  const saving = ref(false)
  const syncing = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })

  // ✅ COMPUTED
  const hasProducts = computed(() => products.value.length > 0)
  const activeProducts = computed(() => products.value.filter(p => p.is_active))
  const manualProducts = computed(() => products.value.filter(p => p.source === 'manual'))
  const shopifyProducts = computed(() => products.value.filter(p => p.source === 'shopify'))
  const woocommerceProducts = computed(() => products.value.filter(p => p.source === 'woocommerce'))

  // ✅ CLEAR ERROR
  const clearError = () => {
    error.value = null
  }

  // ✅ FETCH PRODUCTS
  const fetchProducts = async (filters: ProductsFilters = {}) => {
    loading.value = true
    clearError()
    
    try {
      const params = new URLSearchParams()
      
      if (filters.search) params.append('search', filters.search)
      if (filters.category) params.append('category', filters.category)
      if (filters.source) params.append('source', filters.source)
      if (filters.isActive !== undefined) params.append('isActive', String(filters.isActive))
      params.append('page', String(filters.page || 1))
      params.append('limit', String(filters.limit || 20))
      
      const response = await $fetch(`${config.public.apiBaseUrl}/api/v1/products?${params}`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      }) as ProductsResponse
      
      if (response.success && response.data) {
        products.value = response.data
        pagination.value = response.pagination
        return { success: true, data: response.data }
      } else {
        throw new Error(response.error || 'Erreur lors de la récupération des produits')
      }
      
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la récupération des produits'
      console.error('Erreur fetch products:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // ✅ FETCH SINGLE PRODUCT
  const fetchProduct = async (id: string) => {
    loading.value = true
    clearError()
    
    try {
      const response = await $fetch(`${config.public.apiBaseUrl}/api/v1/products/${id}`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      }) as ApiResponse<Product>
      
      if (response.success && response.data) {
        product.value = response.data
        return { success: true, data: response.data }
      } else {
        throw new Error(response.error || 'Produit non trouvé')
      }
      
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la récupération du produit'
      console.error('Erreur fetch product:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // ✅ CREATE PRODUCT
  const createProduct = async (data: CreateProductData) => {
    saving.value = true
    clearError()
    
    try {
      const response = await $fetch(`${config.public.apiBaseUrl}/api/v1/products`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          'Content-Type': 'application/json'
        },
        body: data
      }) as ApiResponse<Product>
      
      if (response.success && response.data) {
        // Ajouter le nouveau produit à la liste
        products.value.unshift(response.data)
        return { success: true, data: response.data }
      } else {
        throw new Error(response.error || 'Erreur lors de la création du produit')
      }
      
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la création du produit'
      console.error('Erreur create product:', err)
      return { success: false, error: error.value }
    } finally {
      saving.value = false
    }
  }

  // ✅ UPDATE PRODUCT
  const updateProduct = async (id: string, data: UpdateProductData) => {
    saving.value = true
    clearError()
    
    try {
      const response = await $fetch(`${config.public.apiBaseUrl}/api/v1/products/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          'Content-Type': 'application/json'
        },
        body: data
      }) as ApiResponse<Product>
      
      if (response.success && response.data) {
        // Mettre à jour le produit dans la liste
        const index = products.value.findIndex(p => p.id === id)
        if (index !== -1) {
          products.value[index] = response.data
        }
        
        // Mettre à jour le produit courant si c'est le même
        if (product.value?.id === id) {
          product.value = response.data
        }
        
        return { success: true, data: response.data }
      } else {
        throw new Error(response.error || 'Erreur lors de la modification du produit')
      }
      
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la modification du produit'
      console.error('Erreur update product:', err)
      return { success: false, error: error.value }
    } finally {
      saving.value = false
    }
  }

  // ✅ DELETE PRODUCT
  const deleteProduct = async (id: string) => {
    saving.value = true
    clearError()
    
    try {
      const response = await $fetch(`${config.public.apiBaseUrl}/api/v1/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      }) as ApiResponse<any>
      
      if (response.success) {
        // Supprimer le produit de la liste
        products.value = products.value.filter(p => p.id !== id)
        
        // Réinitialiser le produit courant si c'est le même
        if (product.value?.id === id) {
          product.value = null
        }
        
        return { success: true, message: response.message || 'Produit supprimé' }
      } else {
        throw new Error(response.error || 'Erreur lors de la suppression du produit')
      }
      
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la suppression du produit'
      console.error('Erreur delete product:', err)
      return { success: false, error: error.value }
    } finally {
      saving.value = false
    }
  }

  // ✅ DUPLICATE PRODUCT
  const duplicateProduct = async (id: string) => {
    const sourceProduct = products.value.find(p => p.id === id)
    if (!sourceProduct) {
      error.value = 'Produit source non trouvé'
      return { success: false, error: error.value }
    }

    const duplicateData: CreateProductData = {
      name: `${sourceProduct.name} (Copie)`,
      description: sourceProduct.description,
      short_description: sourceProduct.short_description,
      price: sourceProduct.price,
      compare_at_price: sourceProduct.compare_at_price,
      sku: sourceProduct.sku ? `${sourceProduct.sku}-COPY` : undefined,
      category: sourceProduct.category,
      tags: [...sourceProduct.tags],
      features: [...sourceProduct.features],
      images: [...sourceProduct.images],
      featured_image: sourceProduct.featured_image,
      weight: sourceProduct.weight,
      inventory_quantity: sourceProduct.inventory_quantity,
      track_inventory: sourceProduct.track_inventory,
      specifications: { ...sourceProduct.specifications },
      is_active: false, // Créer en mode inactif par défaut
      is_visible: false,
      available_for_sale: false
    }

    return await createProduct(duplicateData)
  }

  // ✅ SYNC PRODUCTS
  const syncProducts = async (source: 'shopify' | 'woocommerce', credentials: SyncCredentials) => {
    syncing.value = true
    clearError()
    
    try {
      const response = await $fetch(`${config.public.apiBaseUrl}/api/v1/products/sync`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          'Content-Type': 'application/json'
        },
        body: {
          source,
          credentials
        }
      }) as SyncResponse
      
      if (response.success) {
        return { 
          success: true, 
          message: response.message || 'Synchronisation démarrée', 
          jobId: response.jobId 
        }
      } else {
        throw new Error(response.error || 'Erreur lors de la synchronisation')
      }
      
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la synchronisation'
      console.error('Erreur sync products:', err)
      return { success: false, error: error.value }
    } finally {
      syncing.value = false
    }
  }

  // ✅ FETCH STATS
  const fetchStats = async () => {
    loading.value = true
    clearError()
    
    try {
      const response = await $fetch(`${config.public.apiBaseUrl}/api/v1/products/stats`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      }) as ApiResponse<ProductStats>
      
      if (response.success && response.data) {
        stats.value = response.data
        return { success: true, data: response.data }
      } else {
        throw new Error(response.error || 'Erreur lors de la récupération des statistiques')
      }
      
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la récupération des statistiques'
      console.error('Erreur fetch stats:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // ✅ UTILITY FUNCTIONS
  const formatPrice = (price: number, currency = 'EUR'): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency
    }).format(price)
  }

  const getSourceLabel = (source: string): string => {
    const labels: Record<string, string> = {
      manual: 'Manuel',
      shopify: 'Shopify',
      woocommerce: 'WooCommerce',
      api: 'API'
    }
    return labels[source] || source
  }

  const getSourceBadgeClass = (source: string): string => {
    const classes: Record<string, string> = {
      manual: 'bg-purple-100 text-purple-800',
      shopify: 'bg-green-100 text-green-800',
      woocommerce: 'bg-blue-100 text-blue-800',
      api: 'bg-gray-100 text-gray-800'
    }
    return classes[source] || 'bg-gray-100 text-gray-800'
  }

  // ✅ RETURN COMPOSABLE
  return {
    // State
    products: readonly(products),
    product: readonly(product),
    stats: readonly(stats),
    loading: readonly(loading),
    saving: readonly(saving),
    syncing: readonly(syncing),
    error: readonly(error),
    pagination: readonly(pagination),
    
    // Computed
    hasProducts,
    activeProducts,
    manualProducts,
    shopifyProducts,
    woocommerceProducts,
    
    // Actions
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
    syncProducts,
    fetchStats,
    clearError,
    
    // Utilities
    formatPrice,
    getSourceLabel,
    getSourceBadgeClass
  }
}