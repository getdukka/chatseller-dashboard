// server/api/dashboard/stats.get.ts
import { getCurrentUser, getDashboardStats } from '~/server/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const user = await getCurrentUser(event)
    
    const stats = await getDashboardStats(user.id)
    
    return {
      success: true,
      data: {
        conversations: {
          total: stats.totalConversations,
          active: stats.activeConversations
        },
        orders: {
          total: stats.totalOrders,
          conversionRate: stats.conversionRate
        },
        revenue: {
          total: stats.totalRevenue,
          average: stats.averageOrderValue
        },
        performance: {
          responseTime: stats.averageResponseTime,
          uptime: stats.uptime
        }
      }
    }
  } catch (error: any) {
    console.error('Erreur dashboard stats API:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors du chargement des statistiques'
    })
  }
})
