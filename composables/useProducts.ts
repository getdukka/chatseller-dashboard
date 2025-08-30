// composables/useProducts.ts

import { ref, computed, type Ref, type ComputedRef } from 'vue'

// Types pour l'API existante (selon useApi.ts)
interface ApiProduct {
  id: string
  name: string
  description?: string
  price?: number
  imageUrl?: string
  category?: string
  isActive?: boolean
  metadata?: any
  created_at?: string
  updated_at?: string
}

// Interface pour création de produit (API)
interface CreateProductData {
  name: string
  description?: string
  price?: number
  imageUrl?: string
  category?: string
  isActive?: boolean
  metadata?: any
}

// Interface produit étendue pour l'affichage
interface Product extends ApiProduct {
  compare_at_price?: number
  source: 'manual' | 'shopify' | 'woocommerce'
  sku?: string
  featured_image?: string
  images?: string[]
  inventory_quantity: number
  track_inventory: boolean
  is_active: boolean
}

interface ProductStats {
  total: number
  active: number
  inactive: number
  bySource: {
    manual: number
    shopify: number
    woocommerce: number
  }
  categories: Array<{
    name: string
    count: number
  }>
}

interface ProductFilters {
  search?: string
  category?: string
  source?: 'manual' | 'shopify' | 'woocommerce'
  is_active?: boolean
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Composable
export const useProducts = () => {
  const api = useApi()
  
  // État
  const products: Ref<Product[]> = ref<Product[]>([])
  const stats: Ref<ProductStats | null> = ref<ProductStats | null>(null)
  const loading: Ref<boolean> = ref<boolean>(false)
  const saving: Ref<boolean> = ref<boolean>(false)
  const syncing: Ref<boolean> = ref<boolean>(false)
  const error: Ref<string | null> = ref<string | null>(null)

  // Computed
  const hasProducts: ComputedRef<boolean> = computed((): boolean => 
    products.value.length > 0
  )

  // Fonction de conversion API vers Product
  const convertApiToProduct = (apiProduct: ApiProduct): Product => {
    return {
      ...apiProduct,
      source: 'manual', // Default
      featured_image: apiProduct.imageUrl,
      images: apiProduct.imageUrl ? [apiProduct.imageUrl] : [],
      inventory_quantity: 100, // Default
      track_inventory: false, // Default
      is_active: apiProduct.isActive ?? true,
      created_at: apiProduct.created_at || new Date().toISOString(),
      updated_at: apiProduct.updated_at || new Date().toISOString()
    }
  }

  // Fonction de conversion Product vers API
  const convertProductToApi = (product: Partial<Product>): CreateProductData => {
    return {
      name: product.name || '',
      description: product.description,
      price: product.price,
      imageUrl: product.featured_image || product.imageUrl,
      category: product.category,
      isActive: product.is_active ?? product.isActive ?? true,
      metadata: product.metadata
    }
  }

  // Actions
  const fetchProducts = async (filters: ProductFilters = {}): Promise<ApiResponse<Product[]>> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.products.list()
      
      if (response.success && response.data) {
        // Convertir les données API vers le format Product
        const convertedProducts = response.data.map(convertApiToProduct)
        
        // Appliquer les filtres côté client
        let filteredProducts = convertedProducts
        
        if (filters.search) {
          filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
            p.description?.toLowerCase().includes(filters.search!.toLowerCase())
          )
        }
        
        if (filters.category) {
          filteredProducts = filteredProducts.filter(p => p.category === filters.category)
        }
        
        if (filters.source) {
          filteredProducts = filteredProducts.filter(p => p.source === filters.source)
        }
        
        if (typeof filters.is_active === 'boolean') {
          filteredProducts = filteredProducts.filter(p => p.is_active === filters.is_active)
        }
        
        products.value = filteredProducts
        return { success: true, data: filteredProducts }
      } else {
        throw new Error(response.error || 'Erreur lors du chargement des produits')
      }
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des produits'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const fetchStats = async (): Promise<ApiResponse<ProductStats>> => {
    loading.value = true
    error.value = null
    
    try {
      if (products.value.length > 0) {
        const total = products.value.length
        const active = products.value.filter(p => p.is_active).length
        const inactive = total - active
        
        const bySource = {
          manual: products.value.filter(p => p.source === 'manual').length,
          shopify: products.value.filter(p => p.source === 'shopify').length,
          woocommerce: products.value.filter(p => p.source === 'woocommerce').length
        }
        
        const categoryCount = products.value.reduce((acc: Record<string, number>, product) => {
          if (product.category) {
            acc[product.category] = (acc[product.category] || 0) + 1
          }
          return acc
        }, {})
        
        const categories = Object.entries(categoryCount).map(([name, count]) => ({
          name,
          count: count as number
        }))

        stats.value = {
          total,
          active,
          inactive,
          bySource,
          categories
        }
      } else {
        stats.value = {
          total: 0,
          active: 0,
          inactive: 0,
          bySource: { manual: 0, shopify: 0, woocommerce: 0 },
          categories: []
        }
      }
      
      return { success: true, data: stats.value }
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du calcul des statistiques'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const createProduct = async (data: Partial<Product>): Promise<ApiResponse<Product>> => {
    saving.value = true
    error.value = null
    
    try {
      const apiData = convertProductToApi(data)
      const response = await api.products.create(apiData)
      
      if (response.success && response.data) {
        const newProduct = convertApiToProduct(response.data)
        products.value.unshift(newProduct)
        await fetchStats()
        return { success: true, data: newProduct }
      } else {
        throw new Error(response.error || 'Erreur lors de la création du produit')
      }
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la création du produit'
      return { success: false, error: error.value }
    } finally {
      saving.value = false
    }
  }

  const updateProduct = async (id: string, data: Partial<Product>): Promise<ApiResponse<Product>> => {
    saving.value = true
    error.value = null
    
    try {
      const apiData = convertProductToApi(data)
      const response = await api.products.update(id, apiData)
      
      if (response.success && response.data) {
        const updatedProduct = convertApiToProduct(response.data)
        const index = products.value.findIndex(p => p.id === id)
        if (index !== -1) {
          products.value[index] = updatedProduct
        }
        await fetchStats()
        return { success: true, data: updatedProduct }
      } else {
        throw new Error(response.error || 'Erreur lors de la modification du produit')
      }
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la modification du produit'
      return { success: false, error: error.value }
    } finally {
      saving.value = false
    }
  }

  const deleteProduct = async (id: string): Promise<ApiResponse<void>> => {
    saving.value = true
    error.value = null
    
    try {
      const response = await api.products.delete(id)
      
      if (response.success) {
        products.value = products.value.filter(p => p.id !== id)
        await fetchStats()
        return { success: true, message: 'Produit supprimé' }
      } else {
        throw new Error(response.error || 'Erreur lors de la suppression du produit')
      }
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la suppression du produit'
      return { success: false, error: error.value }
    } finally {
      saving.value = false
    }
  }

  const duplicateProduct = async (id: string): Promise<ApiResponse<Product>> => {
    const sourceProduct = products.value.find(p => p.id === id)
    if (!sourceProduct) {
      error.value = 'Produit source non trouvé'
      return { success: false, error: error.value }
    }

    const duplicateData: Partial<Product> = {
      name: `${sourceProduct.name} (Copie)`,
      description: sourceProduct.description,
      price: sourceProduct.price,
      compare_at_price: sourceProduct.compare_at_price,
      category: sourceProduct.category,
      sku: sourceProduct.sku ? `${sourceProduct.sku}-COPY` : undefined,
      featured_image: sourceProduct.featured_image,
      images: sourceProduct.images || [],
      inventory_quantity: sourceProduct.inventory_quantity,
      track_inventory: sourceProduct.track_inventory,
      is_active: false
    }

    return await createProduct(duplicateData)
  }

  const syncProducts = async (source: string, credentials: any): Promise<ApiResponse<Product[]>> => {
    syncing.value = true
    error.value = null
    
    try {
      console.log(`Synchronisation ${source} avec:`, credentials)
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockProducts: Product[] = [
        {
          id: `sync-${Date.now()}-1`,
          name: `Produit ${source} 1`,
          description: `Produit synchronisé depuis ${source}`,
          price: 29.99,
          category: 'Synchronisé',
          source: source as 'manual' | 'shopify' | 'woocommerce',
          featured_image: 'https://via.placeholder.com/300x300',
          images: ['https://via.placeholder.com/300x300'],
          inventory_quantity: 100,
          track_inventory: true,
          is_active: true,
          isActive: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: `sync-${Date.now()}-2`,
          name: `Produit ${source} 2`,
          description: `Autre produit synchronisé depuis ${source}`,
          price: 49.99,
          category: 'Synchronisé',
          source: source as 'manual' | 'shopify' | 'woocommerce',
          featured_image: 'https://via.placeholder.com/300x300',
          images: ['https://via.placeholder.com/300x300'],
          inventory_quantity: 50,
          track_inventory: true,
          is_active: true,
          isActive: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
      
      products.value.push(...mockProducts)
      await fetchStats()
      
      return { 
        success: true, 
        message: `${mockProducts.length} produits synchronisés depuis ${source}`,
        data: mockProducts 
      }
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la synchronisation'
      return { success: false, error: error.value }
    } finally {
      syncing.value = false
    }
  }

  const clearError = (): void => {
    error.value = null
  }

  // Utilitaires
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
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

  return {
    // State
    products,
    stats,
    loading,
    saving,
    syncing,
    error,
    
    // Computed
    hasProducts,
    
    // Actions
    fetchProducts,
    fetchStats,
    createProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
    syncProducts,
    clearError,
    
    // Utilities
    formatPrice,
    getSourceLabel,
    getSourceBadgeClass
  }
}