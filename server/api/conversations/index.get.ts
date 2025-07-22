// server/api/conversations/index.get.ts
export default defineEventHandler(async (event) => {
  try {
    // Authentification
    const user = await getCurrentUser(event)
    
    // Paramètres de requête
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 20
    const status = query.status as string
    const search = query.search as string

    // Récupérer les conversations
    const { conversations, total } = await getConversations({
      userId: user.id,
      page,
      limit,
      status,
      search
    })

    return {
      success: true,
      data: {
        conversations: conversations.map(conv => ({
          id: conv.id,
          visitorName: conv.visitorName,
          visitorEmail: conv.visitorEmail,
          lastMessage: conv.lastMessage,
          status: conv.status,
          messageCount: conv.messageCount,
          unreadCount: conv.unreadCount,
          createdAt: conv.createdAt,
          updatedAt: conv.updatedAt
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    }
  } catch (error: any) {
    console.error('Erreur conversations API:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors du chargement des conversations'
    })
  }
})