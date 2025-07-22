// server/api/conversations/[id].get.ts
import { getCurrentUser, getConversationById, getConversationMessages } from '~/server/utils/database'

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

    const conversation = await getConversationById(conversationId, user.id)
    if (!conversation) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Conversation non trouvée'
      })
    }

    const messages = await getConversationMessages(conversationId)

    return {
      success: true,
      data: {
        conversation,
        messages
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