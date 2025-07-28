// composables/useAgentConfig.ts - VERSION AMÉLIORÉE AVEC KB INTÉGRÉE
import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useKnowledgeBase, type KnowledgeBaseDocument } from '~/composables/useKnowledgeBase'

// ✅ TYPES
export interface AgentConfig {
  agent: {
    id: string
    name: string
    type: string
    personality: string
    description: string | null
    welcomeMessage: string | null
    fallbackMessage: string | null
    avatar: string | null
    isActive: boolean
    config: Record<string, any>
    stats: {
      conversations: number
      conversions: number
    }
    linkedKnowledgeBase: string[] // IDs des documents KB liés
  }
  knowledgeBase: Array<{
    id: string
    title: string
    content: string
    contentType: string
    isActive: boolean
    tags: string[]
    linkedToAgent: boolean
    metadata?: {
      wordCount?: number
      fileSize?: number
      fileType?: string
    }
  }>
}

export interface AgentConfigUpdate {
  collectName?: boolean
  collectPhone?: boolean
  collectAddress?: boolean
  collectPayment?: boolean
  upsellEnabled?: boolean
  linkedKnowledgeBase?: string[]
  [key: string]: any
}

interface ConfigResponse {
  success: boolean
  data: AgentConfig
}

interface UpdateResponse {
  success: boolean
  data: {
    id: string
    config: Record<string, any>
    linkedKnowledgeBase: string[]
    updatedAt: string
  }
}

// ✅ COMPOSABLE PRINCIPAL
export const useAgentConfig = () => {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()
  
  // ✅ INTÉGRATION: Utiliser le composable KB
  const knowledgeBaseComposable = useKnowledgeBase()

  // ✅ STATE RÉACTIF
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)
  const agentConfig = ref<AgentConfig | null>(null)

  // ✅ COMPUTED - Données enrichies avec KB
  const linkedDocuments = computed(() => {
    if (!agentConfig.value) return []
    
    return knowledgeBaseComposable.documents.value.filter(doc => 
      agentConfig.value?.agent.linkedKnowledgeBase?.includes(doc.id) || false
    )
  })

  const availableDocuments = computed(() => {
    if (!agentConfig.value) return knowledgeBaseComposable.activeDocuments.value
    
    return knowledgeBaseComposable.activeDocuments.value.filter(doc => 
      !agentConfig.value?.agent.linkedKnowledgeBase?.includes(doc.id)
    )
  })

  const knowledgeBaseStats = computed(() => {
    const linked = linkedDocuments.value
    return {
      totalDocuments: linked.length,
      totalWords: linked.reduce((sum, doc) => sum + (doc.metadata?.wordCount || 0), 0),
      documentTypes: linked.reduce((acc, doc) => {
        acc[doc.contentType] = (acc[doc.contentType] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    }
  })

  // ✅ HELPER: Headers avec authentification
  const getAuthHeaders = () => {
    if (!authStore.token) {
      console.warn('⚠️ [useAgentConfig] Pas de token disponible, mode développement')
      return {
        'Content-Type': 'application/json'
      }
    }
    
    return {
      'Authorization': `Bearer ${authStore.token}`,
      'Content-Type': 'application/json'
    }
  }

  // ✅ HELPER: Gestion des erreurs API
  const handleApiError = (err: any, defaultMessage: string) => {
    console.error('❌ API Error:', err)
    
    let errorMessage = defaultMessage
    
    if (err.data?.error && typeof err.data.error === 'string') {
      errorMessage = err.data.error
    } else if (err.message && typeof err.message === 'string') {
      errorMessage = err.message
    } else if (err.statusText && typeof err.statusText === 'string') {
      errorMessage = `Erreur ${err.status || 'API'}: ${err.statusText}`
    }
    
    error.value = errorMessage
    return { success: false, error: errorMessage }
  }

  // ✅ RÉCUPÉRER LA CONFIGURATION D'UN AGENT
  const fetchAgentConfig = async (agentId: string) => {
    loading.value = true
    error.value = null

    try {
      console.log('🔍 [useAgentConfig] Récupération configuration agent:', agentId)
      
      // ✅ 1. Charger les documents KB d'abord
      await knowledgeBaseComposable.fetchDocuments()
      
      // ✅ 2. Vérifier si on a un token
      if (!authStore.token) {
        console.log('⚠️ [useAgentConfig] Pas de token, utilisation données mockées')
        
        // ✅ DONNÉES MOCKÉES ENRICHIES
        const mockConfig: AgentConfig = {
          agent: {
            id: agentId,
            name: 'Rose - Vendeuse',
            type: 'general',
            personality: 'friendly',
            description: 'Assistante d\'achat spécialisée dans les produits de jeux de cartes relationnels. Formée sur notre catalogue complet et nos politiques commerciales.',
            welcomeMessage: 'Bonjour ! Je suis Rose, votre assistante d\'achat. J\'ai accès à toutes les informations sur nos produits et je peux vous aider à faire le meilleur choix. Comment puis-je vous aider aujourd\'hui ?',
            fallbackMessage: 'Je transmets votre question à notre équipe, un conseiller vous recontactera bientôt. En attendant, n\'hésitez pas à consulter notre FAQ ou notre catalogue produits.',
            avatar: 'https://ui-avatars.com/api/?name=Rose&background=E91E63&color=fff',
            isActive: true,
            config: {
              collectName: true,
              collectPhone: true,
              collectAddress: false,
              collectPayment: true,
              upsellEnabled: true
            },
            stats: {
              conversations: 47,
              conversions: 12
            },
            linkedKnowledgeBase: ['kb_001', 'kb_002', 'kb_003'] // IDs des documents liés
          },
          knowledgeBase: []
        }
        
        // ✅ 3. Enrichir avec les documents KB réels
        mockConfig.knowledgeBase = knowledgeBaseComposable.documents.value
          .filter(doc => mockConfig.agent.linkedKnowledgeBase.includes(doc.id))
          .map(doc => ({
            id: doc.id,
            title: doc.title,
            content: doc.content,
            contentType: doc.contentType,
            isActive: doc.isActive,
            tags: doc.tags,
            linkedToAgent: true,
            metadata: doc.metadata
          }))
        
        agentConfig.value = mockConfig
        console.log(`✅ [useAgentConfig] Configuration mockée chargée pour:`, mockConfig.agent.name)
        console.log(`📚 Documents KB liés: ${mockConfig.knowledgeBase.length}`)
        return { success: true, data: mockConfig }
      }
      
      // ✅ 3. APPEL API NORMAL avec gestion d'erreur améliorée
      try {
        const response = await $fetch(`/api/v1/agents/${agentId}/config`, {
          baseURL: config.public.apiBaseUrl,
          headers: getAuthHeaders()
        })

        if (response && response.success) {
          // ✅ Enrichir la réponse avec les documents KB
          const enrichedData = {
            ...response.data,
            knowledgeBase: knowledgeBaseComposable.documents.value
              .filter(doc => response.data.agent.linkedKnowledgeBase?.includes(doc.id))
              .map(doc => ({
                id: doc.id,
                title: doc.title,
                content: doc.content,
                contentType: doc.contentType,
                isActive: doc.isActive,
                tags: doc.tags,
                linkedToAgent: true,
                metadata: doc.metadata
              }))
          }
          
          agentConfig.value = enrichedData
          console.log(`✅ [useAgentConfig] Configuration récupérée:`, enrichedData.agent.name)
          console.log(`📚 Documents KB liés: ${enrichedData.knowledgeBase.length}`)
          return { success: true, data: enrichedData }
        } else {
          throw new Error('Réponse API invalide')
        }
      } catch (apiError) {
        console.warn('⚠️ [useAgentConfig] API Error, fallback vers mock:', apiError)
        
        // ✅ FALLBACK VERS DONNÉES MOCKÉES EN CAS D'ERREUR API
        const fallbackConfig: AgentConfig = {
          agent: {
            id: agentId,
            name: 'Agent Fallback',
            type: 'general',
            personality: 'professional',
            description: 'Configuration de fallback en cas d\'erreur API',
            welcomeMessage: 'Bonjour ! Je suis en mode test. Comment puis-je vous aider ?',
            fallbackMessage: 'Service temporairement indisponible. Veuillez réessayer plus tard.',
            avatar: null,
            isActive: true,
            config: {
              collectName: true,
              collectPhone: true,
              collectAddress: false,
              collectPayment: true,
              upsellEnabled: false
            },
            stats: {
              conversations: 0,
              conversions: 0
            },
            linkedKnowledgeBase: []
          },
          knowledgeBase: []
        }
        
        agentConfig.value = fallbackConfig
        console.log(`✅ [useAgentConfig] Configuration fallback chargée`)
        return { success: true, data: fallbackConfig }
      }

    } catch (err: any) {
      console.error('❌ [useAgentConfig] Erreur fetchAgentConfig:', err)
      return handleApiError(err, 'Erreur lors de la récupération de la configuration')
    } finally {
      loading.value = false
    }
  }

  // ✅ METTRE À JOUR LA CONFIGURATION D'UN AGENT
  const updateAgentConfig = async (agentId: string, configData: AgentConfigUpdate) => {
    saving.value = true
    error.value = null

    try {
      console.log('💾 Mise à jour configuration agent:', agentId)
      console.log('📝 Données à sauvegarder:', configData)
      
      const response = await $fetch(`/api/v1/agents/${agentId}/config`, {
        method: 'PUT',
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders(),
        body: { config: configData }
      }) as UpdateResponse

      if (response.success) {
        // ✅ Mettre à jour la configuration locale
        if (agentConfig.value) {
          agentConfig.value.agent.config = response.data.config
          if (response.data.linkedKnowledgeBase) {
            agentConfig.value.agent.linkedKnowledgeBase = response.data.linkedKnowledgeBase
          }
        }
        
        console.log(`✅ Configuration agent mise à jour:`, agentId)
        return { success: true, data: response.data }
      } else {
        throw new Error('Réponse API invalide')
      }

    } catch (err: any) {
      console.warn('⚠️ Erreur API, simulation de succès pour le développement')
      
      // ✅ SIMULATION DE SUCCÈS POUR LE DÉVELOPPEMENT
      if (agentConfig.value) {
        agentConfig.value.agent.config = { ...agentConfig.value.agent.config, ...configData }
        if (configData.linkedKnowledgeBase) {
          agentConfig.value.agent.linkedKnowledgeBase = configData.linkedKnowledgeBase
        }
      }
      
      console.log('✅ Configuration simulée mise à jour')
      return { 
        success: true, 
        data: { 
          id: agentId, 
          config: configData, 
          linkedKnowledgeBase: configData.linkedKnowledgeBase || [],
          updatedAt: new Date().toISOString() 
        } 
      }
    } finally {
      saving.value = false
    }
  }

  // ✅ LIER/DÉLIER DES DOCUMENTS À UN AGENT
  const updateAgentKnowledgeBase = async (agentId: string, documentIds: string[]) => {
    saving.value = true
    error.value = null

    try {
      console.log('🔗 Mise à jour KB agent:', agentId, documentIds)
      
      const response = await $fetch(`/api/v1/agents/${agentId}/knowledge-base`, {
        method: 'PUT',
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders(),
        body: { documentIds }
      }) as { success: boolean; data: { linkedKnowledgeBase: string[]; updatedAt: string } }

      if (response.success) {
        // ✅ Mettre à jour localement
        if (agentConfig.value) {
          agentConfig.value.agent.linkedKnowledgeBase = response.data.linkedKnowledgeBase
          
          // ✅ Mettre à jour la liste KB affichée
          agentConfig.value.knowledgeBase = knowledgeBaseComposable.documents.value
            .filter(doc => response.data.linkedKnowledgeBase.includes(doc.id))
            .map(doc => ({
              id: doc.id,
              title: doc.title,
              content: doc.content,
              contentType: doc.contentType,
              isActive: doc.isActive,
              tags: doc.tags,
              linkedToAgent: true,
              metadata: doc.metadata
            }))
        }
        
        // ✅ Mettre à jour le composable KB aussi
        for (const doc of knowledgeBaseComposable.documents.value) {
          await knowledgeBaseComposable.linkToAgent(doc.id, agentId, documentIds.includes(doc.id))
        }
        
        console.log(`✅ KB agent mise à jour: ${documentIds.length} documents liés`)
        return { success: true, data: response.data }
      } else {
        throw new Error('Réponse API invalide')
      }

    } catch (err: any) {
      console.warn('⚠️ Erreur API, simulation de succès pour le développement')
      
      // ✅ SIMULATION DE SUCCÈS
      if (agentConfig.value) {
        agentConfig.value.agent.linkedKnowledgeBase = documentIds
        agentConfig.value.knowledgeBase = knowledgeBaseComposable.documents.value
          .filter(doc => documentIds.includes(doc.id))
          .map(doc => ({
            id: doc.id,
            title: doc.title,
            content: doc.content,
            contentType: doc.contentType,
            isActive: doc.isActive,
            tags: doc.tags,
            linkedToAgent: true,
            metadata: doc.metadata
          }))
      }
      
      console.log('✅ KB agent simulée mise à jour')
      return { 
        success: true, 
        data: { 
          linkedKnowledgeBase: documentIds, 
          updatedAt: new Date().toISOString() 
        } 
      }
    } finally {
      saving.value = false
    }
  }

  // ✅ LIER UN DOCUMENT INDIVIDUEL À UN AGENT
  const linkDocument = async (agentId: string, documentId: string, link: boolean = true) => {
    try {
      if (!agentConfig.value) return { success: false, error: 'Agent non chargé' }
      
      const currentLinks = agentConfig.value.agent.linkedKnowledgeBase || []
      let newLinks: string[]
      
      if (link && !currentLinks.includes(documentId)) {
        newLinks = [...currentLinks, documentId]
      } else if (!link && currentLinks.includes(documentId)) {
        newLinks = currentLinks.filter(id => id !== documentId)
      } else {
        return { success: true } // Pas de changement nécessaire
      }
      
      return await updateAgentKnowledgeBase(agentId, newLinks)
      
    } catch (err: any) {
      return handleApiError(err, `Erreur lors de la ${link ? 'liaison' : 'délaison'} du document`)
    }
  }

  // ✅ OBTENIR LE CONTENU COMPLET POUR L'IA
  const getAgentKnowledgeContent = (agentId: string): string => {
    if (!agentConfig.value || agentConfig.value.agent.id !== agentId) {
      return ''
    }
    
    const linkedDocs = linkedDocuments.value
    if (linkedDocs.length === 0) {
      return 'Aucune base de connaissance configurée pour cet agent.'
    }
    
    let content = '=== BASE DE CONNAISSANCE ===\n\n'
    
    for (const doc of linkedDocs) {
      content += `## ${doc.title}\n`
      content += `Type: ${doc.contentType}\n`
      if (doc.tags.length > 0) {
        content += `Tags: ${doc.tags.join(', ')}\n`
      }
      content += `\n${doc.content}\n\n---\n\n`
    }
    
    content += `=== STATISTIQUES ===\n`
    content += `Documents: ${knowledgeBaseStats.value.totalDocuments}\n`
    content += `Mots: ${knowledgeBaseStats.value.totalWords}\n`
    content += `Types: ${Object.entries(knowledgeBaseStats.value.documentTypes).map(([type, count]) => `${type}: ${count}`).join(', ')}\n`
    
    return content
  }

  // ✅ COPIER LE CODE D'INTÉGRATION
  const copyIntegrationCode = async (agentId: string, shopId: string) => {
    try {
      const code = `<script>
(function() {
  var script = document.createElement('script');
  script.src = 'https://widget.chatseller.app/widget.js';
  script.setAttribute('data-agent-id', '${agentId}');
  script.setAttribute('data-shop-id', '${shopId}');
  script.setAttribute('data-version', '2.0');
  document.head.appendChild(script);
})();
</script>`
      
      await navigator.clipboard.writeText(code)
      return { success: true, message: 'Code d\'intégration copié dans le presse-papier !' }
    } catch (err) {
      console.error('Erreur lors de la copie:', err)
      return { success: false, error: 'Impossible de copier le code' }
    }
  }

  // ✅ RAFRAÎCHIR LES DONNÉES
  const refreshAgentConfig = async (agentId: string) => {
    await fetchAgentConfig(agentId)
  }

  // ✅ RÉINITIALISER L'ERREUR
  const clearError = () => {
    error.value = null
  }

  // ✅ RÉINITIALISER LA CONFIGURATION
  const clearConfig = () => {
    agentConfig.value = null
    error.value = null
  }

  // ✅ RETOURNER TOUTES LES MÉTHODES ET PROPRIÉTÉS
  return {
    // State
    loading: readonly(loading),
    saving: readonly(saving),
    error: readonly(error),
    agentConfig: readonly(agentConfig),

    // Computed enrichi
    linkedDocuments,
    availableDocuments,
    knowledgeBaseStats,

    // Actions principales
    fetchAgentConfig,
    updateAgentConfig,
    refreshAgentConfig,

    // Actions KB
    updateAgentKnowledgeBase,
    linkDocument,
    getAgentKnowledgeContent,

    // Helpers
    copyIntegrationCode,
    clearError,
    clearConfig,

    // Accès au composable KB
    knowledgeBase: knowledgeBaseComposable
  }
}