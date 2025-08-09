// stores/products.ts - VERSION API PURE

import { defineStore } from 'pinia'

// ✅ TYPES
interface Product {
  id: string
  name: string
  description?: string
  price: number
  image?: string
  category?: string
  status: 'active' | 'inactive'
  source: 'manual' | 'shopify' | 'woocommerce'
  external_id?: string
  shop_id: string
  created_at: string
  updated_at: string
}

interface ProductsState {
  products: Product[]
  selectedProduct: Product | null
  isLoading: boolean
  error: string | null
  filters: {
    search: string
    category: string
    source: string
    status: string
  }
  pagination: {
    page: number
    limit: number
    total: number
    hasNextPage: boolean
  }
}

// ✅ STORE PRODUCTS
export const useProducts = defineStore('products', {
  state: (): ProductsState => ({
    products: [],
    selectedProduct: null,
    isLoading: false,
    error: null,
    filters: {
      search: '',
      category: '',
      source: '',
      status: 'active'
    },
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      hasNextPage: false
    }
  }),

  getters: {
    // ✅ PRODUITS FILTRÉS
    filteredProducts: (state): Product[] => {
      let filtered = [...state.products]
      
      if (state.filters.search) {
        const search = state.filters.search.toLowerCase()
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(search) ||
          product.description?.toLowerCase().includes(search)
        )
      }
      
      if (state.filters.category) {
        filtered = filtered.filter(product => product.category === state.filters.category)
      }
      
      if (state.filters.source) {
        filtered = filtered.filter(product => product.source === state.filters.source)
      }
      
      if (state.filters.status) {
        filtered = filtered.filter(product => product.status === state.filters.status)
      }
      
      return filtered
    },

    // ✅ STATISTIQUES
    stats: (state) => ({
      total: state.products.length,
      active: state.products.filter(p => p.status === 'active').length,
      inactive: state.products.filter(p => p.status === 'inactive').length,
      manual: state.products.filter(p => p.source === 'manual').length,
      shopify: state.products.filter(p => p.source === 'shopify').length,
      woocommerce: state.products.filter(p => p.source === 'woocommerce').length
    }),

    // ✅ CATÉGORIES UNIQUES
    categories: (state): string[] => {
      const categories = state.products
        .map(product => product.category)
        .filter((category): category is string => !!category)
      return [...new Set(categories)]
    }
  },

  actions: {
    // ✅ CHARGER PRODUITS VIA API
    async fetchProducts(params: {
      search?: string
      category?: string
      source?: string
      status?: string
      page?: number
      limit?: number
    } = {}) {
      this.isLoading = true
      this.error = null
      
      try {
        console.log('📦 [Products Store] Chargement produits via API...')
        
        const api = useApi()
        
        // Construire les paramètres de requête
        const queryParams = {
          search: params.search || this.filters.search || undefined,
          category: params.category || this.filters.category || undefined,
          source: params.source || this.filters.source || undefined,
          isActive: params.status || this.filters.status || undefined,
          page: String(params.page || this.pagination.page),
          limit: String(params.limit || this.pagination.limit)
        }
        
        // Filtrer les paramètres undefined
        const filteredParams = Object.fromEntries(
          Object.entries(queryParams).filter(([_, value]) => value !== undefined)
        )
        
        const response = await api.products.list(filteredParams)
        
        if (!response.success) {
          throw new Error(response.error || 'Erreur lors du chargement des produits')
        }
        
        // Mettre à jour les données
        this.products = response.data || []
        
        // Mettre à jour les filtres utilisés
        if (params.search !== undefined) this.filters.search = params.search
        if (params.category !== undefined) this.filters.category = params.category
        if (params.source !== undefined) this.filters.source = params.source
        if (params.status !== undefined) this.filters.status = params.status
        
        // Mettre à jour la pagination (calculée côté client pour l'instant)
        this.pagination = {
          page: params.page || 1,  
          limit: params.limit || 20, 
          total: this.products.length,
          hasNextPage: false // À implémenter côté API plus tard
        }
        
        console.log('✅ [Products Store] Produits chargés:', this.products.length)
        
      } catch (error: any) {
        console.error('❌ [Products Store] Erreur chargement produits:', error)
        this.error = error.message || 'Erreur lors du chargement des produits'
      } finally {
        this.isLoading = false
      }
    },

    // ✅ CRÉER PRODUIT
    async createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'shop_id'>) {
      this.isLoading = true
      this.error = null
      
      try {
        console.log('➕ [Products Store] Création produit via API...')
        
        const api = useApi()
        const response = await api.products.create(productData)
        
        if (!response.success) {
          throw new Error(response.error || 'Erreur lors de la création du produit')
        }
        
        const newProduct = response.data
        this.products.unshift(newProduct)
        
        console.log('✅ [Products Store] Produit créé:', newProduct.id)
        return newProduct
        
      } catch (error: any) {
        console.error('❌ [Products Store] Erreur création produit:', error)
        this.error = error.message || 'Erreur lors de la création du produit'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // ✅ METTRE À JOUR PRODUIT
    async updateProduct(productId: string, updates: Partial<Product>) {
      this.isLoading = true
      this.error = null
      
      try {
        console.log('✏️ [Products Store] Mise à jour produit via API...')
        
        const api = useApi()
        const response = await api.products.update(productId, updates)
        
        if (!response.success) {
          throw new Error(response.error || 'Erreur lors de la mise à jour du produit')
        }
        
        // Mettre à jour dans la liste locale
        const index = this.products.findIndex(p => p.id === productId)
        if (index !== -1) {
          this.products[index] = { ...this.products[index], ...updates }
        }
        
        // Mettre à jour le produit sélectionné si c'est le même
        if (this.selectedProduct?.id === productId) {
          this.selectedProduct = { ...this.selectedProduct, ...updates }
        }
        
        console.log('✅ [Products Store] Produit mis à jour:', productId)
        return response.data
        
      } catch (error: any) {
        console.error('❌ [Products Store] Erreur mise à jour produit:', error)
        this.error = error.message || 'Erreur lors de la mise à jour du produit'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // ✅ SUPPRIMER PRODUIT
    async deleteProduct(productId: string) {
      this.isLoading = true
      this.error = null
      
      try {
        console.log('🗑️ [Products Store] Suppression produit via API...')
        
        const api = useApi()
        const response = await api.products.delete(productId)
        
        if (!response.success) {
          throw new Error(response.error || 'Erreur lors de la suppression du produit')
        }
        
        // Supprimer de la liste locale
        this.products = this.products.filter(p => p.id !== productId)
        
        // Supprimer la sélection si c'est le produit sélectionné
        if (this.selectedProduct?.id === productId) {
          this.selectedProduct = null
        }
        
        console.log('✅ [Products Store] Produit supprimé:', productId)
        
      } catch (error: any) {
        console.error('❌ [Products Store] Erreur suppression produit:', error)
        this.error = error.message || 'Erreur lors de la suppression du produit'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // ✅ SÉLECTIONNER PRODUIT
    async selectProduct(productId: string) {
      const product = this.products.find(p => p.id === productId)
      if (product) {
        this.selectedProduct = product
      } else {
        // Charger depuis l'API si pas en local
        try {
          const api = useApi()
          const response = await api.products.get(productId)
          if (response.success) {
            this.selectedProduct = response.data
          }
        } catch (error) {
          console.error('❌ [Products Store] Erreur chargement produit:', error)
        }
      }
    },

    // ✅ RÉINITIALISER FILTRES
    resetFilters() {
      this.filters = {
        search: '',
        category: '',
        source: '',
        status: 'active'
      }
      this.pagination.page = 1
    },

    // ✅ APPLIQUER FILTRES
    applyFilters(filters: Partial<typeof this.filters>) {
      Object.assign(this.filters, filters)
      this.pagination.page = 1
      return this.fetchProducts()
    },

    // ✅ CHANGER PAGE
    changePage(page: number) {
      this.pagination.page = page
      return this.fetchProducts()
    },

    // ✅ NETTOYER ERREURS
    clearError() {
      this.error = null
    }
  }
})