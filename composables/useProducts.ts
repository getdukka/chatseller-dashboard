// composables/useProducts.ts - VERSION BEAUTÉ INTELLIGENTE

import { ref, computed, type Ref, type ComputedRef } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useQuotas } from '~/composables/useQuotas'
import { useDebounce } from '~/composables/useDebounce'

// ✅ TYPES BEAUTÉ ENRICHIS
interface BeautyProductData {
  beauty_category?: 'skincare' | 'makeup' | 'fragrance' | 'haircare' | 'bodycare'
  skin_types?: string[]
  hair_types?: string[]
  key_ingredients?: string[]
  benefits?: string[]
  application_tips?: string[]
  contraindications?: string[]
  age_range?: string[]
  season_preference?: string[]
  occasion_tags?: string[]
  expert_notes?: string
  routine_step?: string
  compatibility?: string[]
}

interface AIProductStats {
  recommendations: number
  conversions: number
  conversion_rate: number
  revenue_generated: number
  customer_feedback_avg: number
  engagement_score: number
  last_recommended?: string
  performance_trend?: 'up' | 'down' | 'stable'
}

interface EnhancedProduct {
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
  
  // ✅ DONNÉES BEAUTÉ
  beauty_data?: BeautyProductData
  is_enriched: boolean
  needs_enrichment: boolean
  enrichment_score: number
  
  // ✅ ANALYTICS IA
  ai_stats?: AIProductStats
  ai_recommend: boolean
  personalization_enabled: boolean
  
  // ✅ SYNCHRONISATION
  last_synced_at?: string
  sync_errors?: string[]
  created_at: string
  updated_at: string
}

interface ProductFilters {
  search?: string
  beautyCategory?: string
  skinTypes?: string[]
  ingredients?: string[]
  priceRange?: { min: number; max: number }
  source?: string
  enrichmentStatus?: 'all' | 'enriched' | 'basic' | 'needs_enrichment'
  aiPerformance?: 'all' | 'high_conversion' | 'frequently_recommended' | 'needs_optimization'
  availability?: 'all' | 'in_stock' | 'low_stock' | 'out_of_stock'
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
  
  // ✅ STATS BEAUTÉ
  byBeautyCategory: Record<string, number>
  enrichmentProgress: number
  aiPerformanceScore: number
  beautyInsights: {
    dominantSkinTypes: Array<{ type: string; percentage: number }>
    popularIngredients: Array<{ ingredient: string; count: number }>
    topPerformingProducts: Array<{ name: string; conversionRate: number }>
  }
}

interface SyncProgress {
  inProgress: boolean
  progress: number
  currentStep: string
  platform: string
  estimatedTime: string
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// ✅ COMPOSABLE PRINCIPAL
export const useProducts = () => {
  const api = useApi()
  const authStore = useAuthStore()
  const quotas = useQuotas()
  
  // ✅ ÉTAT RÉACTIF
  const products: Ref<EnhancedProduct[]> = ref([])
  const stats: Ref<ProductStats | null> = ref(null)
  const syncProgress: Ref<SyncProgress> = ref({
    inProgress: false,
    progress: 0,
    currentStep: '',
    platform: '',
    estimatedTime: ''
  })
  
  const loading = ref(false)
  const saving = ref(false)
  const syncing = ref(false)
  const enriching = ref(false)
  const error = ref<string | null>(null)
  const lastFetch = ref<Date | null>(null)
  
  // ✅ FILTRES BEAUTÉ AVANCÉS
  const filters = ref<ProductFilters>({
    search: '',
    beautyCategory: '',
    skinTypes: [],
    ingredients: [],
    priceRange: { min: 0, max: 1000 },
    source: '',
    enrichmentStatus: 'all',
    aiPerformance: 'all',
    availability: 'all'
  })

  // ✅ COMPUTED PROPERTIES
  const hasProducts = computed(() => products.value.length > 0)
  const hasEnrichedProducts = computed(() => products.value.some(p => p.is_enriched))
  const hasAIData = computed(() => products.value.some(p => p.ai_stats))
  
  const enrichmentProgress = computed(() => {
    if (products.value.length === 0) return 0
    const enriched = products.value.filter(p => p.is_enriched).length
    return Math.round((enriched / products.value.length) * 100)
  })

  const needsRefresh = computed(() => {
    if (!lastFetch.value) return true
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000)
    return lastFetch.value < fifteenMinutesAgo
  })

  // ✅ PRODUITS FILTRÉS INTELLIGENTS
  const filteredProducts = computed(() => {
    let filtered = [...products.value]

    // Recherche textuelle avancée
    if (filters.value.search?.trim()) {
      const searchTerms = filters.value.search.toLowerCase().trim().split(' ')
      filtered = filtered.filter(product => {
        const searchableText = [
          product.name,
          product.description,
          product.category,
          product.sku,
          ...(product.beauty_data?.key_ingredients || []),
          ...(product.beauty_data?.benefits || []),
          ...(product.tags || [])
        ].join(' ').toLowerCase()
        
        return searchTerms.every(term => searchableText.includes(term))
      })
    }

    // Filtre catégorie beauté
    if (filters.value.beautyCategory) {
      filtered = filtered.filter(p => 
        p.beauty_data?.beauty_category === filters.value.beautyCategory
      )
    }

    // Filtre types de peau
    if (filters.value.skinTypes?.length) {
      filtered = filtered.filter(p => 
        p.beauty_data?.skin_types?.some(type => 
          filters.value.skinTypes!.includes(type)
        )
      )
    }

    // Filtre ingrédients
    if (filters.value.ingredients?.length) {
      filtered = filtered.filter(p => 
        p.beauty_data?.key_ingredients?.some(ingredient => 
          filters.value.ingredients!.some(filter => 
            ingredient.toLowerCase().includes(filter.toLowerCase())
          )
        )
      )
    }

    // Filtre prix
    if (filters.value.priceRange) {
      const { min, max } = filters.value.priceRange
      filtered = filtered.filter(p => p.price >= min && p.price <= max)
    }

    // Filtre source
    if (filters.value.source) {
      filtered = filtered.filter(p => p.source === filters.value.source)
    }

    // Filtre statut enrichissement
    if (filters.value.enrichmentStatus !== 'all') {
      filtered = filtered.filter(p => {
        switch (filters.value.enrichmentStatus) {
          case 'enriched': return p.is_enriched
          case 'basic': return !p.is_enriched && !p.needs_enrichment
          case 'needs_enrichment': return p.needs_enrichment
          default: return true
        }
      })
    }

    // Filtre performance IA
    if (filters.value.aiPerformance !== 'all') {
      filtered = filtered.filter(p => {
        const stats = p.ai_stats
        if (!stats) return filters.value.aiPerformance === 'needs_optimization'
        
        switch (filters.value.aiPerformance) {
          case 'high_conversion': return stats.conversion_rate > 15
          case 'frequently_recommended': return stats.recommendations > 10
          case 'needs_optimization': return stats.conversion_rate < 5
          default: return true
        }
      })
    }

    // Filtre disponibilité
    if (filters.value.availability !== 'all') {
      filtered = filtered.filter(p => {
        if (!p.track_inventory) return true
        const qty = p.inventory_quantity
        
        switch (filters.value.availability) {
          case 'in_stock': return qty > 10
          case 'low_stock': return qty <= 10 && qty > 0
          case 'out_of_stock': return qty <= 0
          default: return true
        }
      })
    }

    // Tri intelligent : enrichis > performance IA > date
    return filtered.sort((a, b) => {
      if (a.is_enriched && !b.is_enriched) return -1
      if (!a.is_enriched && b.is_enriched) return 1
      
      const aPerf = a.ai_stats?.conversion_rate || 0
      const bPerf = b.ai_stats?.conversion_rate || 0
      if (aPerf !== bPerf) return bPerf - aPerf
      
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    })
  })

  // ✅ PRODUITS PAR CATÉGORIE BEAUTÉ
  const productsByBeautyCategory = computed(() => {
    return products.value.reduce((acc: Record<string, EnhancedProduct[]>, product) => {
      const category = product.beauty_data?.beauty_category || 'uncategorized'
      if (!acc[category]) acc[category] = []
      acc[category].push(product)
      return acc
    }, {})
  })

  // ✅ TOP PERFORMERS IA
  const topAIProducts = computed(() => {
    return products.value
      .filter(p => p.ai_stats?.conversions && p.ai_stats.conversions > 0)
      .sort((a, b) => (b.ai_stats?.revenue_generated || 0) - (a.ai_stats?.revenue_generated || 0))
      .slice(0, 10)
  })

  // ✅ PRODUITS NÉCESSITANT ATTENTION
  const productsNeedingAttention = computed(() => {
    return products.value.filter(p => 
      p.needs_enrichment || 
      (p.ai_stats?.conversion_rate || 0) < 5 ||
      !p.is_active ||
      (p.track_inventory && p.inventory_quantity < 5)
    )
  })

  // ✅ RECHERCHE DEBOUNCED
  const debouncedSearch = useDebounce((searchTerm: string) => {
    filters.value.search = searchTerm
  }, 300)

  // ✅ ACTIONS PRINCIPALES

  // Charger les produits
  const fetchProducts = async (forceRefresh = false): Promise<ApiResponse<EnhancedProduct[]>> => {
    if (!forceRefresh && !needsRefresh.value) {
      return { success: true, data: products.value }
    }

    loading.value = true
    error.value = null
    
    try {
      console.log('📦 [useProducts] Chargement catalogue beauté...')
      
      const response = await api.products.list()
      
      if (response.success && response.data) {
        products.value = response.data.map(convertToEnhancedProduct)
        await calculateStats()
        lastFetch.value = new Date()
        
        console.log('✅ [useProducts] Catalogue chargé:', products.value.length, 'produits')
        return { success: true, data: products.value }
      } else {
        throw new Error(response.error || 'Erreur chargement produits')
      }
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement'
      console.error('❌ [useProducts] Erreur:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Calculer les statistiques
  const calculateStats = async () => {
    try {
      const total = products.value.length
      const enriched = products.value.filter(p => p.is_enriched).length
      const synchronized = products.value.filter(p => p.source !== 'manual').length
      
      // Stats IA
      const aiProducts = products.value.filter(p => p.ai_stats)
      const totalRecommendations = aiProducts.reduce((sum, p) => sum + (p.ai_stats?.recommendations || 0), 0)
      const totalConversions = aiProducts.reduce((sum, p) => sum + (p.ai_stats?.conversions || 0), 0)
      
      // Catégories beauté
      const byBeautyCategory = products.value.reduce((acc: Record<string, number>, p) => {
        const cat = p.beauty_data?.beauty_category || 'uncategorized'
        acc[cat] = (acc[cat] || 0) + 1
        return acc
      }, {})

      // Insights beauté
      const skinTypesMap = products.value
        .flatMap(p => p.beauty_data?.skin_types || [])
        .reduce((acc: Record<string, number>, type) => {
          acc[type] = (acc[type] || 0) + 1
          return acc
        }, {})

      const ingredientsMap = products.value
        .flatMap(p => p.beauty_data?.key_ingredients || [])
        .reduce((acc: Record<string, number>, ingredient) => {
          acc[ingredient] = (acc[ingredient] || 0) + 1
          return acc
        }, {})

      stats.value = {
        total,
        synchronized,
        enriched,
        aiRecommendations: totalRecommendations,
        conversionRate: totalRecommendations > 0 ? Math.round((totalConversions / totalRecommendations) * 100) : 0,
        lastSync: syncProgress.value.platform ? 'Récente' : 'Jamais',
        topCategoryValue: Object.entries(byBeautyCategory)
          .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Non classé',
        topCategoryPercentage: total > 0 ? Math.round((Math.max(...Object.values(byBeautyCategory)) / total) * 100) : 0,
        
        byBeautyCategory,
        enrichmentProgress: enrichmentProgress.value,
        aiPerformanceScore: aiProducts.length > 0 
          ? Math.round(aiProducts.reduce((sum, p) => sum + (p.ai_stats?.conversion_rate || 0), 0) / aiProducts.length)
          : 0,
        
        beautyInsights: {
          dominantSkinTypes: Object.entries(skinTypesMap)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([type, count]) => ({
              type,
              percentage: Math.round((count / total) * 100)
            })),
          popularIngredients: Object.entries(ingredientsMap)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([ingredient, count]) => ({ ingredient, count })),
          topPerformingProducts: topAIProducts.value.slice(0, 5).map(p => ({
            name: p.name,
            conversionRate: p.ai_stats?.conversion_rate || 0
          }))
        }
      }
    } catch (err) {
      console.error('❌ [useProducts] Erreur calcul stats:', err)
    }
  }

  // Synchronisation intelligente
  const syncProducts = async (platform: string, credentials: any): Promise<ApiResponse<EnhancedProduct[]>> => {
    // Vérifier les quotas avant sync
    const quotaCheck = quotas.checkQuotaBeforeAction('indexablePages', 100)
    if (!quotaCheck.allowed) {
      return { success: false, error: quotaCheck.error }
    }

    syncing.value = true
    syncProgress.value = {
      inProgress: true,
      progress: 0,
      platform,
      currentStep: 'Initialisation...',
      estimatedTime: '2-3 minutes'
    }

    try {
      const steps = [
        { step: 'Connexion à la boutique...', duration: 1000 },
        { step: 'Récupération des produits...', duration: 2000 },
        { step: 'Analyse des catégories beauté...', duration: 1500 },
        { step: 'Enrichissement automatique IA...', duration: 3000 },
        { step: 'Finalisation et indexation...', duration: 1000 }
      ]

      for (let i = 0; i < steps.length; i++) {
        syncProgress.value.currentStep = steps[i].step
        syncProgress.value.progress = ((i + 1) / steps.length) * 100
        
        await new Promise(resolve => setTimeout(resolve, steps[i].duration))
      }

      const response = await api.products.sync(platform, credentials)

      if (response.success && response.data) {
        const newProducts = response.data.map(convertToEnhancedProduct)
        products.value.push(...newProducts)
        
        // Enrichissement automatique des nouveaux produits
        await autoEnrichNewProducts(newProducts)
        
        // Incrémenter quota pages indexées
        await quotas.incrementQuota('indexablePages', newProducts.length)
        
        await calculateStats()
        
        console.log('✅ [useProducts] Sync terminée:', newProducts.length, 'produits')
        return { success: true, data: newProducts, message: `${newProducts.length} produits synchronisés` }
      } else {
        throw new Error(response.error || 'Erreur synchronisation')
      }
    } catch (err: any) {
      error.value = err.message
      console.error('❌ [useProducts] Erreur sync:', err)
      return { success: false, error: err.message }
    } finally {
      syncing.value = false
      syncProgress.value.inProgress = false
    }
  }

  // Enrichissement automatique
  const autoEnrichNewProducts = async (newProducts: EnhancedProduct[]) => {
    enriching.value = true
    
    try {
      for (const product of newProducts) {
        if (!product.is_enriched) {
          const enrichmentData = generateBasicEnrichment(product)
          await enrichProduct(product.id, enrichmentData)
        }
      }
    } catch (err) {
      console.error('❌ [useProducts] Erreur auto-enrichissement:', err)
    } finally {
      enriching.value = false
    }
  }

  // Enrichir un produit
  const enrichProduct = async (productId: string, enrichmentData: BeautyProductData): Promise<ApiResponse<EnhancedProduct>> => {
    // Vérifier quotas documents
    const quotaCheck = quotas.checkQuotaBeforeAction('knowledgeDocuments', 1)
    if (!quotaCheck.allowed) {
      return { success: false, error: quotaCheck.error }
    }

    saving.value = true
    
    try {
      const response = await api.products.enrich(productId, enrichmentData)

      if (response.success) {
        const index = products.value.findIndex(p => p.id === productId)
        if (index !== -1) {
          products.value[index] = {
            ...products.value[index],
            beauty_data: enrichmentData,
            is_enriched: true,
            needs_enrichment: false,
            enrichment_score: calculateEnrichmentScore(enrichmentData),
            updated_at: new Date().toISOString()
          }
        }

        // Incrémenter quota
        await quotas.incrementQuota('knowledgeDocuments', 1)
        await calculateStats()
        
        return { success: true, data: products.value[index] }
      } else {
        throw new Error(response.error || 'Erreur enrichissement')
      }
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      saving.value = false
    }
  }

  // Créer un produit
  const createProduct = async (data: Partial<EnhancedProduct> & { name: string }): Promise<ApiResponse<EnhancedProduct>> => {
    saving.value = true
    error.value = null
    
    try {
      const apiData = {
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrl: data.featured_image,
        category: data.category,
        isActive: data.is_active,
        metadata: {
          ...data,
          beauty_data: data.beauty_data,
          tags: data.tags,
          specifications: data.specifications
        }
      }
      const response = await api.products.create(apiData)
      
      if (response.success && response.data) {
        const newProduct = convertToEnhancedProduct(response.data)
        products.value.unshift(newProduct)
        await calculateStats()
        return { success: true, data: newProduct }
      } else {
        throw new Error(response.error || 'Erreur création produit')
      }
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      saving.value = false
    }
  }

  // Mettre à jour un produit
  const updateProduct = async (productId: string, data: Partial<EnhancedProduct>): Promise<ApiResponse<EnhancedProduct>> => {
    saving.value = true
    
    try {
      const response = await api.products.update(productId, data)
      
      if (response.success && response.data) {
        const index = products.value.findIndex(p => p.id === productId)
        if (index !== -1) {
          products.value[index] = convertToEnhancedProduct(response.data)
        }
        await calculateStats()
        return { success: true, data: products.value[index] }
      } else {
        throw new Error(response.error || 'Erreur modification')
      }
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      saving.value = false
    }
  }

  // Supprimer un produit
  const deleteProduct = async (productId: string): Promise<ApiResponse<void>> => {
    saving.value = true
    
    try {
      const response = await api.products.delete(productId)
      
      if (response.success) {
        products.value = products.value.filter(p => p.id !== productId)
        await calculateStats()
        return { success: true, message: 'Produit supprimé' }
      } else {
        throw new Error(response.error || 'Erreur suppression')
      }
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      saving.value = false
    }
  }

  // Dupliquer un produit
  const duplicateProduct = async (productId: string): Promise<ApiResponse<EnhancedProduct>> => {
    try {
      const response = await api.products.duplicate(productId)
      
      if (response.success && response.data) {
        const duplicatedProduct = convertToEnhancedProduct(response.data)
        products.value.unshift(duplicatedProduct)
        await calculateStats()
        return { success: true, data: duplicatedProduct }
      } else {
        throw new Error(response.error || 'Erreur duplication')
      }
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    }
  }

  // Basculer recommandation IA
  const toggleAIRecommendation = async (productId: string, recommend: boolean): Promise<ApiResponse<EnhancedProduct>> => {
    try {
      const response = await api.products.toggleRecommendation(productId, recommend)

      if (response.success) {
        const index = products.value.findIndex(p => p.id === productId)
        if (index !== -1) {
          products.value[index].ai_recommend = recommend
        }
        return { success: true, data: products.value[index] }
      } else {
        throw new Error(response.error || 'Erreur toggle recommendation')
      }
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    }
  }

  // ✅ UTILITAIRES

  // Conversion API vers produit enrichi
  const convertToEnhancedProduct = (apiProduct: any): EnhancedProduct => {
    return {
      ...apiProduct,
      beauty_data: apiProduct.beauty_data || null,
      is_enriched: !!apiProduct.beauty_data && Object.keys(apiProduct.beauty_data).length > 2,
      needs_enrichment: !apiProduct.beauty_data || Object.keys(apiProduct.beauty_data).length < 3,
      enrichment_score: apiProduct.beauty_data ? calculateEnrichmentScore(apiProduct.beauty_data) : 0,
      ai_stats: apiProduct.ai_stats || null,
      ai_recommend: apiProduct.ai_recommend || false,
      personalization_enabled: apiProduct.personalization_enabled || false,
      tags: apiProduct.tags || [],
      images: apiProduct.images || [],
      features: apiProduct.features || [],
      specifications: apiProduct.specifications || {}
    }
  }

  // Calcul score enrichissement
  const calculateEnrichmentScore = (beautyData: BeautyProductData): number => {
    let score = 0
    if (beautyData.skin_types?.length) score += 20
    if (beautyData.key_ingredients?.length) score += 25
    if (beautyData.benefits?.length) score += 20
    if (beautyData.application_tips?.length) score += 15
    if (beautyData.age_range?.length) score += 10
    if (beautyData.expert_notes) score += 10
    return Math.min(score, 100)
  }

  // Enrichissement basique automatique
  const generateBasicEnrichment = (product: EnhancedProduct): BeautyProductData => {
    const name = product.name.toLowerCase()
    const desc = (product.description || '').toLowerCase()
    
    return {
      beauty_category: detectBeautyCategory(name, desc),
      key_ingredients: extractIngredients(name, desc),
      skin_types: suggestSkinTypes(name, desc),
      benefits: extractBenefits(name, desc)
    }
  }

  const detectBeautyCategory = (name: string, desc: string): BeautyProductData['beauty_category'] => {
    const text = (name + ' ' + desc).toLowerCase()
    if (text.includes('sérum') || text.includes('crème') || text.includes('visage')) return 'skincare'
    if (text.includes('mascara') || text.includes('rouge') || text.includes('fond')) return 'makeup'
    if (text.includes('parfum') || text.includes('eau de')) return 'fragrance'
    if (text.includes('shampooing') || text.includes('cheveux')) return 'haircare'
    if (text.includes('corps') || text.includes('body')) return 'bodycare'
    return 'skincare'
  }

  const extractIngredients = (name: string, desc: string): string[] => {
    const text = (name + ' ' + desc).toLowerCase()
    const commonIngredients = [
      'acide hyaluronique', 'vitamine c', 'rétinol', 'niacinamide',
      'acide salicylique', 'acide glycolique', 'peptides', 'collagène'
    ]
    return commonIngredients.filter(ingredient => text.includes(ingredient))
  }

  const suggestSkinTypes = (name: string, desc: string): string[] => {
    const text = (name + ' ' + desc).toLowerCase()
    const suggestions = []
    
    if (text.includes('tous') || text.includes('universal')) {
      return ['Normale', 'Sèche', 'Grasse', 'Mixte', 'Sensible']
    }
    if (text.includes('hydratant')) suggestions.push('Sèche')
    if (text.includes('matifiant')) suggestions.push('Grasse')
    if (text.includes('mixte')) suggestions.push('Mixte')
    if (text.includes('sensible')) suggestions.push('Sensible')
    
    return suggestions.length > 0 ? suggestions : ['Normale']
  }

  const extractBenefits = (name: string, desc: string): string[] => {
    const text = (name + ' ' + desc).toLowerCase()
    const benefits = []
    
    if (text.includes('hydrat')) benefits.push('Hydratation')
    if (text.includes('anti-âge')) benefits.push('Anti-âge')
    if (text.includes('éclat')) benefits.push('Éclat')
    if (text.includes('nettoy')) benefits.push('Nettoyage')
    
    return benefits
  }

  // Formatage prix
  const formatPrice = (amount: number, currency: string = 'EUR'): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  // Labels sources
  const getSourceLabel = (source: string): string => {
    const labels: Record<string, string> = {
      manual: 'Manuel',
      shopify: 'Shopify',
      woocommerce: 'WooCommerce',
      api: 'API'
    }
    return labels[source] || source
  }

  // Classes badges sources
  const getSourceBadgeClass = (source: string): string => {
    const classes: Record<string, string> = {
      manual: 'bg-purple-100 text-purple-800',
      shopify: 'bg-green-100 text-green-800',
      woocommerce: 'bg-blue-100 text-blue-800',
      api: 'bg-orange-100 text-orange-800'
    }
    return classes[source] || 'bg-gray-100 text-gray-800'
  }

  // Gestion des filtres
  const setFilters = (newFilters: Partial<ProductFilters>) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const clearFilters = () => {
    filters.value = {
      search: '',
      beautyCategory: '',
      skinTypes: [],
      ingredients: [],
      priceRange: { min: 0, max: 1000 },
      source: '',
      enrichmentStatus: 'all',
      aiPerformance: 'all',
      availability: 'all'
    }
  }

  const clearError = () => {
    error.value = null
  }

  // ✅ INTERFACE PUBLIQUE COMPLÈTE
  return {
    // State
    products,
    stats,
    syncProgress,
    loading,
    saving,
    syncing,
    enriching,
    error,
    filters,
    
    // Computed
    hasProducts,
    hasEnrichedProducts,
    hasAIData,
    enrichmentProgress,
    needsRefresh,
    filteredProducts,
    productsByBeautyCategory,
    topAIProducts,
    productsNeedingAttention,
    
    // Actions
    fetchProducts,
    calculateStats,
    syncProducts,
    enrichProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
    toggleAIRecommendation,
    
    // Utilities
    convertToEnhancedProduct,
    formatPrice,
    getSourceLabel,
    getSourceBadgeClass,
    debouncedSearch,
    setFilters,
    clearFilters,
    clearError
  }
}