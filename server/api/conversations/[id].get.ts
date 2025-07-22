// server/api/conversations/[id].get.ts
export default defineEventHandler(async (event) => {
  try {
    const user = await getCurrentUser(event)
    const conversationId = getRouterParam(event, 'id')

    if (!conversationId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de conversation requis'
      })
    }

    // Récupérer la conversation
    const conversation = await getConversationById(conversationId, user.id)
    if (!conversation) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Conversation non trouvée'
      })
    }

    // Récupérer les messages
    const messages = await getConversationMessages(conversationId)

    return {
      success: true,
      data: {
        conversation: {
          id: conversation.id,
          visitorName: conversation.visitorName,
          visitorEmail: conversation.visitorEmail,
          visitorPhone: conversation.visitorPhone,
          status: conversation.status,
          unreadCount: conversation.unreadCount,
          createdAt: conversation.createdAt,
          updatedAt: conversation.updatedAt,
          sourcePage: conversation.sourcePage
        },
        messages: messages.map(msg => ({
          id: msg.id,
          sender: msg.sender,
          content: msg.content,
          timestamp: msg.timestamp,
          confidence: msg.confidence
        }))
      }
    }
  } catch (error: any) {
    console.error('Erreur conversation detail API:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors du chargement de la conversation'
    })
  }
})