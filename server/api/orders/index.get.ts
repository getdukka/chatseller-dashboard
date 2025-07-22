// server/api/orders/index.get.ts
import { getCurrentUser, getOrders } from '~/server/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const user = await getCurrentUser(event)
    
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 20
    const status = query.status as string
    const minAmount = parseFloat(query.minAmount as string) || undefined
    const maxAmount = parseFloat(query.maxAmount as string) || undefined

    const { orders, total } = await getOrders({
      userId: user.id,
      page,
      limit,
      status,
      minAmount,
      maxAmount
    })

    return {
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    }
  } catch (error: any) {
    console.error('Erreur orders API:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors du chargement des commandes'
    })
  }
})