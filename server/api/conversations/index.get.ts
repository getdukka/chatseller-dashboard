// server/api/conversations/index.get.ts
import { getCurrentUser, getConversations } from '~/server/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const user = await getCurrentUser(event)
    
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 20
    const status = query.status as string
    const search = query.search as string

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
        conversations,
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