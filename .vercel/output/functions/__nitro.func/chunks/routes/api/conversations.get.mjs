import { d as defineEventHandler } from '../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const conversations_get = defineEventHandler(async (event) => {
  const mockConversations = [
    {
      id: "1",
      customerName: "Marie Dubois",
      customerEmail: "marie.dubois@email.com",
      productName: "iPhone 15 Pro",
      status: "active",
      lastMessage: "Je suis int\xE9ress\xE9e par ce produit",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1e3).toISOString(),
      updatedAt: new Date(Date.now() - 30 * 60 * 1e3).toISOString(),
      messageCount: 5
    },
    {
      id: "2",
      customerName: "Pierre Martin",
      customerEmail: "pierre.martin@email.com",
      productName: "MacBook Air M3",
      status: "completed",
      lastMessage: "Merci, commande pass\xE9e !",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1e3).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1e3).toISOString(),
      messageCount: 12
    },
    {
      id: "3",
      customerName: "Sophie Leroy",
      customerEmail: "sophie.leroy@email.com",
      productName: "AirPods Pro 2",
      status: "pending",
      lastMessage: "Quelle est la garantie ?",
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1e3).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 60 * 1e3).toISOString(),
      messageCount: 3
    }
  ];
  return {
    success: true,
    data: mockConversations,
    total: mockConversations.length
  };
});

export { conversations_get as default };
//# sourceMappingURL=conversations.get.mjs.map
