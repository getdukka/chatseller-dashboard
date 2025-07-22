// server/api/settings/index.put.ts
export default defineEventHandler(async (event) => {
  try {
    const user = await getCurrentUser(event)
    const newSettings = await readBody(event)
    
    // Valider les paramètres
    const validatedSettings = validateSettings(newSettings)
    
    // Sauvegarder
    await updateUserSettings(user.id, validatedSettings)
    
    return {
      success: true,
      data: validatedSettings
    }
  } catch (error: any) {
    console.error('Erreur update settings API:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors de la sauvegarde des paramètres'
    })
  }
})

// Fonctions utilitaires communes
async function getCurrentUser(event: any) {
  const token = getCookie(event, 'auth-token') || 
                getHeader(event, 'authorization')?.replace('Bearer ', '')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentification requise'
    })
  }

  try {
    const config = useRuntimeConfig()
    const decoded = jwt.verify(token, config.jwtSecret) as any
    
    const user = await findUserById(decoded.userId)
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Utilisateur non trouvé'
      })
    }

    return user
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token invalide'
    })
  }
}

// Fonctions simulées (à remplacer par vos implémentations DB)
async function getConversations(params: any) {
  // Simulation de données
  return {
    conversations: [
      {
        id: '1',
        visitorName: 'Marie Dubois',
        visitorEmail: 'marie.dubois@email.com',
        lastMessage: 'Merci pour ces informations',
        status: 'active',
        messageCount: 8,
        unreadCount: 2,
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
      }
    ],
    total: 1
  }
}

async function getConversationById(id: string, userId: string) {
  return {
    id,
    visitorName: 'Marie Dubois',
    visitorEmail: 'marie.dubois@email.com',
    visitorPhone: '+33 6 12 34 56 78',
    status: 'active',
    unreadCount: 2,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    sourcePage: {
      title: 'Produit Premium',
      url: 'https://monsite.com/produit-premium'
    }
  }
}

async function getConversationMessages(conversationId: string) {
  return [
    {
      id: '1',
      sender: 'agent',
      content: 'Bonjour ! Comment puis-je vous aider ?',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      confidence: 95
    }
  ]
}

async function getOrders(params: any) {
  return {
    orders: [
      {
        id: '1299',
        customerName: 'Pierre Martin',
        customerEmail: 'pierre.martin@email.com',
        customerPhone: '+33 6 12 34 56 78',
        shippingAddress: '123 Rue de la Paix, 75001 Paris',
        products: [
          {
            id: '1',
            name: 'Produit Premium',
            description: 'Description du produit',
            price: 129.99,
            quantity: 1
          }
        ],
        total: 129.99,
        status: 'confirmed',
        source: 'Agent IA',
        createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString()
      }
    ],
    total: 1
  }
}

async function getDashboardStats(userId: string) {
  return {
    totalConversations: 147,
    activeConversations: 12,
    totalOrders: 89,
    conversionRate: 34.2,
    totalRevenue: 45670.50,
    averageOrderValue: 512.30,
    averageResponseTime: 1.8,
    uptime: 99.9
  }
}

async function getUserSettings(userId: string) {
  return {
    agent: {
      name: 'Sophie',
      welcomeMessage: 'Bonjour ! Comment puis-je vous aider ?',
      tone: 'friendly',
      customInstructions: 'Soyez poli et professionnel.'
    },
    sales: {
      enableUpselling: true,
      enableCrossSelling: true,
      createUrgency: false
    },
    widget: {
      primaryColor: '#2563eb',
      textColor: '#ffffff',
      position: 'bottom-right',
      buttonText: 'Besoin d\'aide ?'
    },
    notifications: {
      email: {
        newConversation: true,
        newOrder: true,
        dailyReport: false
      }
    }
  }
}

async function updateUserSettings(userId: string, settings: any) {
  console.log('Paramètres mis à jour pour', userId)
  return settings
}

function validateSettings(settings: any) {
  // Validation des paramètres
  return settings
}