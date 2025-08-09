// composables/useProducts.ts - API PURE VERSION

import { ref, computed } from 'vue'

// ✅ TYPES
interface Product {
  id: string
  name: string
  description?: string
  price: number
  compare_at_price?: number
  category?: string
  source: 'manual' | 'shopify' | 'woocommerce'
  sku?: string
  featured_image?: string
  images?: string[]
  inventory_quantity: number
  track_inventory: boolean
  is_active: boolean
  created_at: string
  updated_at: string
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

// ✅ COMPOSABLE
export const useProducts = () => {
  const api = useApi()
  
  // État
  const products = ref<Product[]>([])
  const stats = ref<ProductStats | null>(null)
  const loading = ref(false)
  const saving = ref(false)
  const syncing = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const hasProducts = computed(() => products.value.length > 0)

  // Actions
  const fetchProducts = async (filters: any = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.products.list(filters)
      
      if (response.success && response.data) {
        products.value = response.data
        return { success: true, data: response.data }
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

  const fetchStats = async () => {
    loading.value = true
    error.value = null
    
    try {
      // Calculer les stats depuis la liste des produits
      if (products.value.length > 0) {
        const total = products.value.length
        const active = products.value.filter(p => p.is_active).length
        const inactive = total - active
        
        const bySource = {
          manual: products.value.filter(p => p.source === 'manual').length,
          shopify: products.value.filter(p => p.source === 'shopify').length,
          woocommerce: products.value.filter(p => p.source === 'woocommerce').length
        }
        
        const categoryCount = products.value.reduce((acc: any, product) => {
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

  const createProduct = async (data: any) => {
    saving.value = true
    error.value = null
    
    try {
      const response = await api.products.create(data)
      
      if (response.success && response.data) {
        products.value.unshift(response.data)
        await fetchStats() // Recalculer les stats
        return { success: true, data: response.data }
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

  const updateProduct = async (id: string, data: any) => {
    saving.value = true
    error.value = null
    
    try {
      const response = await api.products.update(id, data)
      
      if (response.success && response.data) {
        const index = products.value.findIndex(p => p.id === id)
        if (index !== -1) {
          products.value[index] = response.data
        }
        await fetchStats() // Recalculer les stats
        return { success: true, data: response.data }
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

  const deleteProduct = async (id: string) => {
    saving.value = true
    error.value = null
    
    try {
      const response = await api.products.delete(id)
      
      if (response.success) {
        products.value = products.value.filter(p => p.id !== id)
        await fetchStats() // Recalculer les stats
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

  const duplicateProduct = async (id: string) => {
    const sourceProduct = products.value.find(p => p.id === id)
    if (!sourceProduct) {
      error.value = 'Produit source non trouvé'
      return { success: false, error: error.value }
    }

    const duplicateData = {
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
      is_active: false // Créer en mode inactif par défaut
    }

    return await createProduct(duplicateData)
  }

  const syncProducts = async (source: string, credentials: any) => {
    syncing.value = true
    error.value = null
    
    try {
      // Simuler une synchronisation
      console.log(`🔄 Synchronisation ${source} avec:`, credentials)
      
      // Simuler un délai
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simuler des produits synchronisés
      const mockProducts: Product[] = [
        {
          id: `sync-${Date.now()}-1`,
          name: `Produit ${source} 1`,
          description: `Produit synchronisé depuis ${source}`,
          price: 29.99,
          category: 'Synchronisé',
          source: source as any,
          featured_image: 'https://via.placeholder.com/300x300',
          images: ['https://via.placeholder.com/300x300'],
          inventory_quantity: 100,
          track_inventory: true,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: `sync-${Date.now()}-2`,
          name: `Produit ${source} 2`,
          description: `Autre produit synchronisé depuis ${source}`,
          price: 49.99,
          category: 'Synchronisé',
          source: source as any,
          featured_image: 'https://via.placeholder.com/300x300',
          images: ['https://via.placeholder.com/300x300'],
          inventory_quantity: 50,
          track_inventory: true,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
      
      // Ajouter les produits synchronisés
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

  const clearError = () => {
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