// stores/products.ts
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

// ✅ TYPES BEAUTÉ ENRICHIS
interface BeautyProductData {
  skin_types?: string[]
  hair_types?: string[]
  beauty_category?: 'skincare' | 'makeup' | 'fragrance' | 'haircare' | 'bodycare'
  key_ingredients?: string[]
  benefits?: string[]
  application_tips?: string[]
  contraindications?: string[]
  age_range?: string[]
  season_preference?: string[]
  occasion_tags?: string[]
  expert_notes?: string
}

interface AIProductStats {
  recommendations: number
  conversions: number
  conversion_rate: number
  revenue_generated: number
  customer_feedback_avg: number
  engagement_score: number
}

interface Product {
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
  featured_image?: string
  images: string[]
  features: string[]
  specifications: Record<string, any>
  inventory_quantity: number
  track_inventory: boolean
  source: 'manual' | 'shopify' | 'woocommerce' | 'api'
  external_id?: string
  is_active: boolean
  is_visible: boolean
  available_for_sale: boolean
  
  // ✅ DONNÉES BEAUTÉ ENRICHIES
  beauty_data?: BeautyProductData
  is_enriched: boolean
  needs_enrichment: boolean
  enrichment_score: number
  
  // ✅ ANALYTICS IA
  ai_stats?: AIProductStats
  ai_recommend: boolean
  personalization_data?: Record<string, any>
  
  // ✅ SYNC ET MÉTADONNÉES
  last_synced_at?: string
  sync_errors?: string
  created_at: string
  updated_at: string
}

interface ProductStats {
  total: number
  synchronized: number
  enriched: number
  aiRecommendations: number
  conversionRate: number
  lastSync: string
  topCategoryValue: string
  topCategoryPercentage: number
  
  // ✅ STATS BEAUTÉ SPÉCIALISÉES
  byBeautyCategory: Record<string, number>
  enrichmentProgress: number
  aiPerformance: {
    totalRecommendations: number
    totalConversions: number
    averageConversionRate: number
    topPerformingProducts: string[]
  }
  
  // ✅ INSIGHTS CLIENTS BEAUTÉ
  beautyInsights: {
    dominantSkinTypes: Array<{ type: string; percentage: number }>
    popularIngredients: Array<{ ingredient: string; count: number }>
    seasonalTrends: Record<string, number>
    ageGroupPreferences: Record<string, string[]>
  }
}

interface SyncStatus {
  inProgress: boolean
  progress: number
  currentStep: string
  platform: string
  lastSync: Date | null
  errors: string[]
}

interface ProductsState {
  products: Product[]
  stats: ProductStats | null
  syncStatus: SyncStatus
  
  // ✅ ÉTATS DE CHARGEMENT
  isLoading: boolean
  isSyncing: boolean
  isEnriching: boolean
  error: string | null
  lastFetch: Date | null
  
  // ✅ FILTRES BEAUTÉ AVANCÉS
  filters: {
    search: string
    beautyCategory: string
    enrichmentStatus: 'all' | 'enriched' | 'basic' | 'needs_enrichment'
    aiPerformance: 'all' | 'high_conversion' | 'frequently_recommended' | 'needs_optimization'
    skinTypes: string[]
    ingredients: string[]
    priceRange: { min: number; max: number }
    source: string
  }
  
  // ✅ CACHE OPTIMISATIONS
  enrichmentCache: Map<string, BeautyProductData>
  aiInsightsCache: Map<string, AIProductStats>
}

export const useProductsStore = defineStore('products', {
  state: (): ProductsState => ({
    products: [],
    stats: null,
    syncStatus: {
      inProgress: false,
      progress: 0,
      currentStep: '',
      platform: '',
      lastSync: null,
      errors: []
    },
    
    isLoading: false,
    isSyncing: false,
    isEnriching: false,
    error: null,
    lastFetch: null,
    
    filters: {
      search: '',
      beautyCategory: '',
      enrichmentStatus: 'all',
      aiPerformance: 'all',
      skinTypes: [],
      ingredients: [],
      priceRange: { min: 0, max: 1000 },
      source: ''
    },
    
    enrichmentCache: new Map(),
    aiInsightsCache: new Map()
  }),

  getters: {
    // ✅ PRODUITS FILTRÉS INTELLIGENTS
    filteredProducts: (state) => {
      let filtered = [...state.products]

      // Recherche textuelle avancée
      if (state.filters.search.trim()) {
        const searchTerms = state.filters.search.toLowerCase().trim().split(' ')
        filtered = filtered.filter(product => {
          const searchableText = [
            product.name,
            product.description,
            product.category,
            ...(product.beauty_data?.key_ingredients || []),
            ...(product.beauty_data?.benefits || []),
            ...(product.tags || [])
          ].join(' ').toLowerCase()
          
          return searchTerms.every(term => searchableText.includes(term))
        })
      }

      // Filtre catégorie beauté
      if (state.filters.beautyCategory) {
        filtered = filtered.filter(p => 
          p.beauty_data?.beauty_category === state.filters.beautyCategory
        )
      }

      // Filtre statut enrichissement
      if (state.filters.enrichmentStatus !== 'all') {
        filtered = filtered.filter(p => {
          switch (state.filters.enrichmentStatus) {
            case 'enriched': return p.is_enriched
            case 'basic': return !p.is_enriched && !p.needs_enrichment
            case 'needs_enrichment': return p.needs_enrichment
            default: return true
          }
        })
      }

      // Filtre performance IA
      if (state.filters.aiPerformance !== 'all') {
        filtered = filtered.filter(p => {
          const stats = p.ai_stats
          if (!stats) return state.filters.aiPerformance === 'needs_optimization'
          
          switch (state.filters.aiPerformance) {
            case 'high_conversion': return stats.conversion_rate > 15
            case 'frequently_recommended': return stats.recommendations > 10
            case 'needs_optimization': return stats.conversion_rate < 5
            default: return true
          }
        })
      }

      // Filtre types de peau
      if (state.filters.skinTypes.length > 0) {
        filtered = filtered.filter(p => 
          p.beauty_data?.skin_types?.some(type => 
            state.filters.skinTypes.includes(type)
          )
        )
      }

      // Filtre ingrédients
      if (state.filters.ingredients.length > 0) {
        filtered = filtered.filter(p => 
          p.beauty_data?.key_ingredients?.some(ingredient => 
            state.filters.ingredients.some(filter => 
              ingredient.toLowerCase().includes(filter.toLowerCase())
            )
          )
        )
      }

      // Filtre prix
      const { min, max } = state.filters.priceRange
      if (min > 0 || max < 1000) {
        filtered = filtered.filter(p => p.price >= min && p.price <= max)
      }

      // Filtre source
      if (state.filters.source) {
        filtered = filtered.filter(p => p.source === state.filters.source)
      }

      return filtered.sort((a, b) => {
        // Priorité : enrichis > performance IA > date de mise à jour
        if (a.is_enriched && !b.is_enriched) return -1
        if (!a.is_enriched && b.is_enriched) return 1
        
        const aPerf = (a.ai_stats?.conversion_rate || 0)
        const bPerf = (b.ai_stats?.conversion_rate || 0)
        if (aPerf !== bPerf) return bPerf - aPerf
        
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      })
    },

    // ✅ PRODUITS PAR CATÉGORIE BEAUTÉ
    productsByBeautyCategory: (state) => {
      return state.products.reduce((acc: Record<string, Product[]>, product) => {
        const category = product.beauty_data?.beauty_category || 'uncategorized'
        if (!acc[category]) acc[category] = []
        acc[category].push(product)
        return acc
      }, {})
    },

    // ✅ TOP PERFORMERS IA
    topAIProducts: (state) => {
      return state.products
        .filter(p => p.ai_stats?.conversions > 0)
        .sort((a, b) => (b.ai_stats?.revenue_generated || 0) - (a.ai_stats?.revenue_generated || 0))
        .slice(0, 10)
    },

    // ✅ PRODUITS NÉCESSITANT ATTENTION
    productsNeedingAttention: (state) => {
      return state.products.filter(p => 
        p.needs_enrichment || 
        (p.ai_stats?.conversion_rate || 0) < 5 ||
        !p.is_active ||
        p.inventory_quantity < 5
      )
    },

    // ✅ DISPONIBILITÉ DES DONNÉES
    hasProducts: (state) => state.products.length > 0,
    hasEnrichedProducts: (state) => state.products.some(p => p.is_enriched),
    hasAIData: (state) => state.products.some(p => p.ai_stats),

    // ✅ PROGRESSION ENRICHISSEMENT
    enrichmentProgress: (state) => {
      if (state.products.length === 0) return 0
      const enriched = state.products.filter(p => p.is_enriched).length
      return Math.round((enriched / state.products.length) * 100)
    },

    // ✅ BESOIN REFRESH
    needsRefresh: (state) => {
      if (!state.lastFetch) return true
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000)
      return state.lastFetch < fifteenMinutesAgo
    }
  },

  actions: {
    // ✅ CHARGER CATALOGUE INTELLIGENT
    async fetchProducts(forceRefresh = false) {
      if (!forceRefresh && !this.needsRefresh) return

      this.isLoading = true
      this.error = null

      try {
        console.log('📦 [Products Store] Chargement catalogue intelligent beauté...')
        
        const api = useApi()
        const response = await api.products.list()

        if (response.success && response.data) {
          this.products = response.data.map(this.convertToBeautyProduct)
          await this.calculateStats()
          
          this.lastFetch = new Date()
          console.log('✅ [Products Store] Catalogue chargé:', this.products.length, 'produits')
        } else {
          throw new Error(response.error || 'Erreur chargement catalogue')
        }
      } catch (error: any) {
        console.error('❌ [Products Store] Erreur:', error)
        this.error = error.message || 'Erreur lors du chargement'
        this.loadMockProducts() // Fallback données test
      } finally {
        this.isLoading = false
      }
    },

    // ✅ CALCULER STATISTIQUES BEAUTÉ
    async calculateStats() {
      try {
        const total = this.products.length
        const enriched = this.products.filter(p => p.is_enriched).length
        const synchronized = this.products.filter(p => p.source !== 'manual').length
        
        // Stats IA
        const aiProducts = this.products.filter(p => p.ai_stats)
        const totalRecommendations = aiProducts.reduce((sum, p) => sum + (p.ai_stats?.recommendations || 0), 0)
        const totalConversions = aiProducts.reduce((sum, p) => sum + (p.ai_stats?.conversions || 0), 0)
        
        // Catégories beauté
        const byBeautyCategory = this.products.reduce((acc: Record<string, number>, p) => {
          const cat = p.beauty_data?.beauty_category || 'uncategorized'
          acc[cat] = (acc[cat] || 0) + 1
          return acc
        }, {})

        // Insights beauté
        const skinTypes = this.products
          .flatMap(p => p.beauty_data?.skin_types || [])
          .reduce((acc: Record<string, number>, type) => {
            acc[type] = (acc[type] || 0) + 1
            return acc
          }, {})

        const ingredients = this.products
          .flatMap(p => p.beauty_data?.key_ingredients || [])
          .reduce((acc: Record<string, number>, ingredient) => {
            acc[ingredient] = (acc[ingredient] || 0) + 1
            return acc
          }, {})

        this.stats = {
          total,
          synchronized,
          enriched,
          aiRecommendations: totalRecommendations,
          conversionRate: totalRecommendations > 0 ? Math.round((totalConversions / totalRecommendations) * 100) : 0,
          lastSync: this.syncStatus.lastSync?.toLocaleString() || 'Jamais',
          topCategoryValue: Object.entries(byBeautyCategory)
            .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Non classé',
          topCategoryPercentage: total > 0 ? Math.round((Math.max(...Object.values(byBeautyCategory)) / total) * 100) : 0,
          
          byBeautyCategory,
          enrichmentProgress: this.enrichmentProgress,
          
          aiPerformance: {
            totalRecommendations,
            totalConversions,
            averageConversionRate: aiProducts.length > 0 
              ? Math.round(aiProducts.reduce((sum, p) => sum + (p.ai_stats?.conversion_rate || 0), 0) / aiProducts.length)
              : 0,
            topPerformingProducts: this.topAIProducts.slice(0, 5).map(p => p.name)
          },
          
          beautyInsights: {
            dominantSkinTypes: Object.entries(skinTypes)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([type, count]) => ({
                type,
                percentage: Math.round((count / total) * 100)
              })),
            popularIngredients: Object.entries(ingredients)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 10)
              .map(([ingredient, count]) => ({ ingredient, count })),
            seasonalTrends: {}, // À implémenter
            ageGroupPreferences: {} // À implémenter
          }
        }
      } catch (error) {
        console.error('❌ [Products Store] Erreur calcul stats:', error)
      }
    },

    // ✅ SYNCHRONISATION INTELLIGENTE
    async syncProducts(platform: string, credentials: any) {
      this.isSyncing = true
      this.syncStatus.inProgress = true
      this.syncStatus.platform = platform
      this.syncStatus.progress = 0
      this.syncStatus.errors = []

      try {
        const steps = [
          'Connexion à la boutique...',
          'Récupération des produits...',
          'Analyse des catégories beauté...',
          'Enrichissement automatique IA...',
          'Finalisation et indexation...'
        ]

        for (let i = 0; i < steps.length; i++) {
          this.syncStatus.currentStep = steps[i]
          this.syncStatus.progress = ((i + 1) / steps.length) * 100
          
          // Simulation du processus
          await new Promise(resolve => setTimeout(resolve, 1500))
        }

        const api = useApi()
        const response = await api.products.sync(platform, credentials)

        if (response.success && response.data) {
          // Ajouter les nouveaux produits
          const newProducts = response.data.map(this.convertToBeautyProduct)
          this.products.push(...newProducts)
          
          // Démarrer enrichissement automatique
          await this.autoEnrichNewProducts(newProducts)
          
          await this.calculateStats()
          this.syncStatus.lastSync = new Date()
          
          console.log('✅ [Products Store] Sync terminée:', newProducts.length, 'produits')
          return { success: true, count: newProducts.length }
        } else {
          throw new Error(response.error || 'Erreur synchronisation')
        }
      } catch (error: any) {
        console.error('❌ [Products Store] Erreur sync:', error)
        this.syncStatus.errors.push(error.message)
        throw error
      } finally {
        this.isSyncing = false
        this.syncStatus.inProgress = false
      }
    },

    // ✅ ENRICHISSEMENT IA AUTOMATIQUE
    async autoEnrichNewProducts(products: Product[]) {
      this.isEnriching = true
      
      try {
        for (const product of products) {
          if (!product.is_enriched) {
            // Analyse IA basique du nom et description
            const enrichmentData = await this.generateAIEnrichment(product)
            await this.enrichProduct(product.id, enrichmentData)
          }
        }
      } catch (error) {
        console.error('❌ [Products Store] Erreur auto-enrichissement:', error)
      } finally {
        this.isEnriching = false
      }
    },

    // ✅ ENRICHIR UN PRODUIT
    async enrichProduct(productId: string, enrichmentData: BeautyProductData) {
      try {
        const api = useApi()
        const response = await api.products.enrich(productId, enrichmentData)

        if (response.success) {
          const index = this.products.findIndex(p => p.id === productId)
          if (index !== -1) {
            this.products[index] = {
              ...this.products[index],
              beauty_data: enrichmentData,
              is_enriched: true,
              needs_enrichment: false,
              enrichment_score: this.calculateEnrichmentScore(enrichmentData),
              updated_at: new Date().toISOString()
            }
          }

          // Mettre en cache
          this.enrichmentCache.set(productId, enrichmentData)
          await this.calculateStats()
        }

        return response
      } catch (error: any) {
        console.error('❌ [Products Store] Erreur enrichissement:', error)
        throw error
      }
    },

    // ✅ BASCULER RECOMMANDATION IA
    async toggleAIRecommendation(productId: string, recommend: boolean) {
      try {
        const api = useApi()
        const response = await api.products.toggleRecommendation(productId, recommend)

        if (response.success) {
          const index = this.products.findIndex(p => p.id === productId)
          if (index !== -1) {
            this.products[index].ai_recommend = recommend
          }
        }

        return response
      } catch (error: any) {
        console.error('❌ [Products Store] Erreur toggle recommendation:', error)
        throw error
      }
    },

    // ✅ FILTRAGE AVANCÉ
    setFilters(filters: Partial<ProductsState['filters']>) {
      this.filters = { ...this.filters, ...filters }
    },

    clearFilters() {
      this.filters = {
        search: '',
        beautyCategory: '',
        enrichmentStatus: 'all',
        aiPerformance: 'all',
        skinTypes: [],
        ingredients: [],
        priceRange: { min: 0, max: 1000 },
        source: ''
      }
    },

    // ✅ HELPERS PRIVÉS
    convertToBeautyProduct(apiProduct: any): Product {
      return {
        ...apiProduct,
        beauty_data: apiProduct.beauty_data || null,
        is_enriched: !!apiProduct.beauty_data && Object.keys(apiProduct.beauty_data).length > 0,
        needs_enrichment: !apiProduct.beauty_data || Object.keys(apiProduct.beauty_data).length < 3,
        enrichment_score: apiProduct.beauty_data ? this.calculateEnrichmentScore(apiProduct.beauty_data) : 0,
        ai_stats: apiProduct.ai_stats || null,
        ai_recommend: apiProduct.ai_recommend || false,
        tags: apiProduct.tags || [],
        images: apiProduct.images || [],
        features: apiProduct.features || [],
        specifications: apiProduct.specifications || {}
      }
    },

    calculateEnrichmentScore(beautyData: BeautyProductData): number {
      let score = 0
      if (beautyData.skin_types?.length) score += 20
      if (beautyData.key_ingredients?.length) score += 25
      if (beautyData.benefits?.length) score += 20
      if (beautyData.application_tips?.length) score += 15
      if (beautyData.age_range?.length) score += 10
      if (beautyData.expert_notes) score += 10
      return Math.min(score, 100)
    },

    async generateAIEnrichment(product: Product): Promise<BeautyProductData> {
      // Simulation enrichissement IA basé sur le nom et description
      const name = product.name.toLowerCase()
      const desc = (product.description || '').toLowerCase()
      
      const enrichment: BeautyProductData = {
        beauty_category: this.detectBeautyCategory(name, desc),
        key_ingredients: this.extractIngredients(name, desc),
        skin_types: this.suggestSkinTypes(name, desc),
        benefits: this.extractBenefits(name, desc)
      }
      
      return enrichment
    },

    detectBeautyCategory(name: string, desc: string): BeautyProductData['beauty_category'] {
      if (name.includes('sérum') || name.includes('crème') || desc.includes('visage')) return 'skincare'
      if (name.includes('mascara') || name.includes('rouge') || name.includes('fond')) return 'makeup'
      if (name.includes('parfum') || name.includes('eau de')) return 'fragrance'
      if (name.includes('shampooing') || name.includes('cheveux')) return 'haircare'
      if (name.includes('corps') || name.includes('body')) return 'bodycare'
      return 'skincare' // Default
    },

    extractIngredients(name: string, desc: string): string[] {
      const text = (name + ' ' + desc).toLowerCase()
      const commonIngredients = [
        'acide hyaluronique', 'vitamine c', 'rétinol', 'niacinamide',
        'acide salicylique', 'acide glycolique', 'peptides', 'collagène',
        'aloe vera', 'huile d\'argan', 'beurre de karité'
      ]
      
      return commonIngredients.filter(ingredient => 
        text.includes(ingredient.toLowerCase())
      )
    },

    suggestSkinTypes(name: string, desc: string): string[] {
      const text = (name + ' ' + desc).toLowerCase()
      const suggestions = []
      
      if (text.includes('tous') || text.includes('universal')) {
        return ['Normale', 'Sèche', 'Grasse', 'Mixte', 'Sensible']
      }
      if (text.includes('hydratant') || text.includes('sec')) suggestions.push('Sèche')
      if (text.includes('matifiant') || text.includes('gras')) suggestions.push('Grasse')
      if (text.includes('mixte')) suggestions.push('Mixte')
      if (text.includes('sensible') || text.includes('doux')) suggestions.push('Sensible')
      
      return suggestions.length > 0 ? suggestions : ['Normale']
    },

    extractBenefits(name: string, desc: string): string[] {
      const text = (name + ' ' + desc).toLowerCase()
      const benefits = []
      
      if (text.includes('hydrat')) benefits.push('Hydratation')
      if (text.includes('anti-âge') || text.includes('rides')) benefits.push('Anti-âge')
      if (text.includes('éclat')) benefits.push('Éclat')
      if (text.includes('nettoy')) benefits.push('Nettoyage')
      if (text.includes('protec')) benefits.push('Protection')
      
      return benefits
    },

    // ✅ DONNÉES SIMULÉES POUR DÉVELOPPEMENT
    loadMockProducts() {
      console.log('🎭 [Products Store] Chargement données simulées beauté')
      
      this.products = [
        {
          id: 'mock-product-1',
          shop_id: 'shop-1',
          name: 'Sérum Vitamine C Éclat',
          description: 'Sérum concentré en vitamine C pour un teint éclatant',
          price: 45,
          compare_at_price: 60,
          currency: 'EUR',
          category: 'Soins visage',
          tags: ['vitamine-c', 'éclat', 'anti-âge'],
          featured_image: 'https://via.placeholder.com/400x400',
          images: ['https://via.placeholder.com/400x400'],
          features: ['Formule concentrée', 'Résultats visibles en 7 jours'],
          specifications: { volume: '30ml', texture: 'fluide' },
          inventory_quantity: 50,
          track_inventory: true,
          source: 'manual',
          is_active: true,
          is_visible: true,
          available_for_sale: true,
          
          beauty_data: {
            beauty_category: 'skincare',
            skin_types: ['Normale', 'Mixte', 'Terne'],
            key_ingredients: ['Vitamine C', 'Acide hyaluronique', 'Niacinamide'],
            benefits: ['Éclat', 'Anti-âge', 'Hydratation'],
            application_tips: ['Appliquer matin sur peau propre', 'Utiliser une crème solaire'],
            age_range: ['25-35', '35-45'],
            expert_notes: 'Idéal pour les peaux en perte d\'éclat et premiers signes de l\'âge'
          },
          is_enriched: true,
          needs_enrichment: false,
          enrichment_score: 95,
          
          ai_stats: {
            recommendations: 156,
            conversions: 28,
            conversion_rate: 17.9,
            revenue_generated: 1260,
            customer_feedback_avg: 4.6,
            engagement_score: 8.2
          },
          ai_recommend: true,
          
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'mock-product-2',
          shop_id: 'shop-1',
          name: 'Fond de Teint Longue Tenue',
          description: 'Fond de teint haute couvrance 24h',
          price: 32,
          currency: 'EUR',
          category: 'Maquillage',
          tags: ['fond-teint', 'couvrance', 'longue-tenue'],
          featured_image: 'https://via.placeholder.com/400x400',
          images: ['https://via.placeholder.com/400x400'],
          features: ['Tenue 24h', 'Couvrance modulable'],
          specifications: { volume: '30ml', fini: 'mat' },
          inventory_quantity: 25,
          track_inventory: true,
          source: 'shopify',
          is_active: true,
          is_visible: true,
          available_for_sale: true,
          
          beauty_data: {
            beauty_category: 'makeup',
            skin_types: ['Grasse', 'Mixte'],
            key_ingredients: ['Silicones', 'Pigments micronisés'],
            benefits: ['Couvrance', 'Tenue longue durée', 'Fini mat'],
            application_tips: ['Utiliser un primer', 'Estomper au pinceau ou éponge'],
            occasion_tags: ['quotidien', 'professionnel', 'soirée']
          },
          is_enriched: true,
          needs_enrichment: false,
          enrichment_score: 85,
          
          ai_stats: {
            recommendations: 89,
            conversions: 12,
            conversion_rate: 13.5,
            revenue_generated: 384,
            customer_feedback_avg: 4.2,
            engagement_score: 7.1
          },
          ai_recommend: true,
          
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
      
      this.calculateStats()
    },

    // ✅ GESTION D'ERREURS
    clearError() {
      this.error = null
    },

    clearData() {
      this.products = []
      this.stats = null
      this.error = null
      this.lastFetch = null
      this.clearFilters()
      this.enrichmentCache.clear()
      this.aiInsightsCache.clear()
    }
  }
})

// ✅ COMPOSABLE POUR ACCÈS FACILE
export const useProducts = () => {
  const productsStore = useProductsStore()
  
  return {
    // State
    products: computed(() => productsStore.products),
    stats: computed(() => productsStore.stats),
    syncStatus: computed(() => productsStore.syncStatus),
    isLoading: computed(() => productsStore.isLoading),
    isSyncing: computed(() => productsStore.isSyncing),
    isEnriching: computed(() => productsStore.isEnriching),
    error: computed(() => productsStore.error),
    filters: computed(() => productsStore.filters),
    
    // Getters
    filteredProducts: computed(() => productsStore.filteredProducts),
    productsByBeautyCategory: computed(() => productsStore.productsByBeautyCategory),
    topAIProducts: computed(() => productsStore.topAIProducts),
    productsNeedingAttention: computed(() => productsStore.productsNeedingAttention),
    hasProducts: computed(() => productsStore.hasProducts),
    hasEnrichedProducts: computed(() => productsStore.hasEnrichedProducts),
    enrichmentProgress: computed(() => productsStore.enrichmentProgress),
    
    // Actions
    fetchProducts: productsStore.fetchProducts,
    syncProducts: productsStore.syncProducts,
    enrichProduct: productsStore.enrichProduct,
    toggleAIRecommendation: productsStore.toggleAIRecommendation,
    setFilters: productsStore.setFilters,
    clearFilters: productsStore.clearFilters,
    clearError: productsStore.clearError,
    clearData: productsStore.clearData
  }
}