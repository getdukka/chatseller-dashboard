import { d as defineEventHandler } from '../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const analytics_get = defineEventHandler(async (event) => {
  const analytics = {
    overview: {
      totalConversations: 147,
      activeConversations: 12,
      totalOrders: 89,
      revenue: 45670.5,
      conversionRate: 34.2
    },
    recentActivity: [
      {
        id: "1",
        type: "conversation",
        title: "Nouvelle conversation",
        customer: "Marie Dubois",
        product: "iPhone 15 Pro",
        timestamp: new Date(Date.now() - 15 * 60 * 1e3).toISOString()
      },
      {
        id: "2",
        type: "order",
        title: "Commande confirm\xE9e",
        customer: "Pierre Martin",
        amount: 1299,
        timestamp: new Date(Date.now() - 45 * 60 * 1e3).toISOString()
      },
      {
        id: "3",
        type: "conversation",
        title: "Message re\xE7u",
        customer: "Sophie Leroy",
        product: "AirPods Pro 2",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1e3).toISOString()
      }
    ],
    chartData: {
      conversationsPerDay: [
        { date: "2025-07-15", conversations: 23, orders: 8 },
        { date: "2025-07-16", conversations: 31, orders: 12 },
        { date: "2025-07-17", conversations: 28, orders: 9 },
        { date: "2025-07-18", conversations: 35, orders: 15 },
        { date: "2025-07-19", conversations: 42, orders: 18 },
        { date: "2025-07-20", conversations: 38, orders: 14 },
        { date: "2025-07-21", conversations: 29, orders: 11 }
      ],
      topProducts: [
        { name: "iPhone 15 Pro", conversations: 45, orders: 23 },
        { name: "MacBook Air M3", conversations: 38, orders: 19 },
        { name: "AirPods Pro 2", conversations: 32, orders: 15 },
        { name: "iPad Air", conversations: 28, orders: 12 }
      ]
    }
  };
  return {
    success: true,
    data: analytics
  };
});

export { analytics_get as default };
//# sourceMappingURL=analytics.get.mjs.map
