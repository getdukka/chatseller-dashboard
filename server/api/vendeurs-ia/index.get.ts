// server/api/agent-ia/index.get.ts - ENDPOINT POUR LISTE DES AGENTS
export default defineEventHandler(async (event) => {
  try {
    console.log('🔍 [API] Récupération liste des agents')

    // ✅ DONNÉES MOCKÉES POUR LE DÉVELOPPEMENT
    // TODO: Remplacer par un appel à votre API backend réelle
    
    const mockAgents = [
      {
        id: 'b50591b2-9f18-4c72-9d06-e754b60c3887',
        name: 'Rose - Vendeuse',
        type: 'product_specialist',
        personality: 'friendly',
        description: 'Assistante d\'achat spécialisée dans les produits de jeux de cartes relationnels',
        welcomeMessage: 'Bonjour ! Je suis Rose, votre assistante d\'achat. Comment puis-je vous aider aujourd\'hui ?',
        fallbackMessage: 'Je transmets votre question à notre équipe, un conseiller vous recontactera bientôt.',
        avatar: 'https://ui-avatars.com/api/?name=Rose&background=E91E63&color=fff',
        isActive: true,
        config: {
          collectName: true,
          collectPhone: true,
          collectAddress: false,
          collectPayment: true,
          upsellEnabled: false
        },
        stats: {
          conversations: 47,
          conversions: 12
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'agent-2-mock',
        name: 'Thomas - Expert Tech',
        type: 'general',
        personality: 'expert',
        description: 'Spécialiste des produits techniques et électroniques',
        welcomeMessage: 'Salut ! Je suis Thomas, expert en tech. Que puis-je vous expliquer ?',
        fallbackMessage: 'Je vous mets en relation avec notre équipe technique.',
        avatar: 'https://ui-avatars.com/api/?name=Thomas&background=3B82F6&color=fff',
        isActive: false,
        config: {
          collectName: true,
          collectPhone: false,
          collectAddress: true,
          collectPayment: true,
          upsellEnabled: true
        },
        stats: {
          conversations: 23,
          conversions: 8
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    // ✅ OPTIONNEL: Appel à votre API backend réelle
    /*
    const config = useRuntimeConfig()
    try {
      const response = await $fetch('/api/v1/agents', {
        baseURL: config.public.apiBaseUrl,
        headers: {
          'Authorization': `Bearer ${token}` // Récupérer le token depuis les headers
        }
      })
      
      if (response.success) {
        return response
      }
    } catch (apiError) {
      console.warn('⚠️ API backend non disponible, utilisation des données mockées')
    }
    */

    // Retourner les données mockées
    return {
      success: true,
      data: mockAgents,
      meta: {
        total: mockAgents.length,
        planLimit: 1 // Plan starter limité à 1 agent
      }
    }

  } catch (error) {
    console.error('❌ [API] Erreur récupération agents:', error)
    
    return {
      success: false,
      error: 'Erreur lors de la récupération des agents'
    }
  }
})