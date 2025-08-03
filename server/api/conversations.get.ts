export default defineEventHandler(async (event) => {
  // Données de démonstration
  const mockConversations = [
    {
      id: '1',
      customerName: 'Marie Dubois',
      customerEmail: 'marie.dubois@email.com',
      productName: 'iPhone 15 Pro',
      status: 'active',
      lastMessage: 'Je suis intéressée par ce produit',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      messageCount: 5
    },
    {
      id: '2',
      customerName: 'Pierre Martin',
      customerEmail: 'pierre.martin@email.com',
      productName: 'MacBook Air M3',
      status: 'completed',
      lastMessage: 'Merci, commande passée !',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      messageCount: 12
    },
    {
      id: '3',
      customerName: 'Sophie Leroy',
      customerEmail: 'sophie.leroy@email.com',
      productName: 'AirPods Pro 2',
      status: 'pending',
      lastMessage: 'Quelle est la garantie ?',
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      messageCount: 3
    }
  ]
  
  return {
    success: true,
    data: mockConversations,
    total: mockConversations.length
  }
})
