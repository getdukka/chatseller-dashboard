import { d as defineEventHandler, c as createError } from '../../../nitro/nitro.mjs';
import { g as getCurrentUser, e as getDashboardStats } from '../../../_/database.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@supabase/supabase-js';
import 'jsonwebtoken';
import 'bcrypt';

const stats_get = defineEventHandler(async (event) => {
  try {
    const user = await getCurrentUser(event);
    const stats = await getDashboardStats(user.id);
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
    };
  } catch (error) {
    console.error("Erreur dashboard stats API:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Erreur lors du chargement des statistiques"
    });
  }
});

export { stats_get as default };
//# sourceMappingURL=stats.get.mjs.map
